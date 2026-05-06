'use client';
import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import {
  AppState,
  ACHIEVEMENTS,
  getLevelFromXP,
  DailyTask,
  DailyLog,
  ProfileData,
} from '@/lib/types';
import seedData from '@/data/data.json';

const STORAGE_KEY = 'solo-leveling-state-v2';

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

function calcStreak(logs: DailyLog[]): number {
  if (logs.length === 0) return 0;
  const today = getTodayStr();
  const sorted = [...logs].sort((a, b) => b.date.localeCompare(a.date));
  let streak = 0;
  let expected = today;
  for (const log of sorted) {
    if (log.date === expected && log.totalXP > 0) {
      streak++;
      const d = new Date(expected);
      d.setDate(d.getDate() - 1);
      expected = d.toISOString().split('T')[0];
    } else {
      break;
    }
  }
  return streak;
}

// Merge seed data with live achievement condition functions
const defaultState: AppState = {
  totalXP: seedData.totalXP,
  streak: seedData.streak,
  lastActiveDate: seedData.lastActiveDate,
  profile: seedData.profile,
  skills: seedData.skills as AppState['skills'],
  dailyLogs: seedData.dailyLogs as AppState['dailyLogs'],
  // Overlay unlocked/unlockedAt from seed onto ACHIEVEMENTS which carry the condition fns
  achievements: ACHIEVEMENTS.map(a => {
    const seeded = (seedData.achievements as Array<{ id: string; unlocked: boolean; unlockedAt?: string }>)
      .find(s => s.id === a.id);
    return seeded ? { ...a, unlocked: seeded.unlocked, unlockedAt: seeded.unlockedAt } : a;
  }),
};

export function useAppState() {
  const [state, setState] = useLocalStorage<AppState>(STORAGE_KEY, defaultState);

  const addXP = useCallback((amount: number) => {
    setState(prev => {
      const newXP = prev.totalXP + amount;
      const newLevel = getLevelFromXP(newXP);
      const streak = calcStreak(prev.dailyLogs);

      // Check achievements
      const updatedAchievements = prev.achievements.map(a => {
        if (a.unlocked) return a;
        const unlocked = a.condition({
          level: newLevel,
          totalXP: newXP,
          streak,
          skills: prev.skills,
          tasks: prev.dailyLogs.flatMap(l => l.tasks),
        });
        return unlocked ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() } : a;
      });

      return { ...prev, totalXP: newXP, achievements: updatedAchievements, streak };
    });
  }, [setState]);

  const updateSkill = useCallback((skillId: string, level: number) => {
    setState(prev => ({
      ...prev,
      skills: prev.skills.map(s => s.id === skillId ? { ...s, level: Math.min(100, Math.max(0, level)) } : s),
    }));
  }, [setState]);

  const addTask = useCallback((task: DailyTask) => {
    const today = getTodayStr();
    setState(prev => {
      const logs = [...prev.dailyLogs];
      const logIdx = logs.findIndex(l => l.date === today);
      if (logIdx >= 0) {
        logs[logIdx] = { ...logs[logIdx], tasks: [...logs[logIdx].tasks, task] };
      } else {
        logs.push({ date: today, tasks: [task], totalXP: 0 });
      }
      return { ...prev, dailyLogs: logs };
    });
  }, [setState]);

  const completeTask = useCallback((taskId: string) => {
    const today = getTodayStr();
    setState(prev => {
      const logs = [...prev.dailyLogs];
      const logIdx = logs.findIndex(l => l.date === today);
      if (logIdx < 0) return prev;
      const tasks = logs[logIdx].tasks.map(t => {
        if (t.id === taskId && !t.completed) {
          return { ...t, completed: true, completedAt: new Date().toISOString() };
        }
        return t;
      });
      const xpGained = tasks.filter(t => t.completed).reduce((sum, t) => sum + t.xpReward, 0) -
        logs[logIdx].tasks.filter(t => t.completed).reduce((sum, t) => sum + t.xpReward, 0);
      logs[logIdx] = { ...logs[logIdx], tasks, totalXP: logs[logIdx].totalXP + xpGained };
      
      const newXP = prev.totalXP + xpGained;
      const streak = calcStreak(logs);

      const updatedAchievements = prev.achievements.map(a => {
        if (a.unlocked) return a;
        const unlocked = a.condition({
          level: getLevelFromXP(newXP),
          totalXP: newXP,
          streak,
          skills: prev.skills,
          tasks: logs.flatMap(l => l.tasks),
        });
        return unlocked ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() } : a;
      });

      return { ...prev, dailyLogs: logs, totalXP: newXP, streak, achievements: updatedAchievements };
    });
  }, [setState]);

  const deleteTask = useCallback((taskId: string) => {
    const today = getTodayStr();
    setState(prev => {
      const logs = [...prev.dailyLogs];
      const logIdx = logs.findIndex(l => l.date === today);
      if (logIdx < 0) return prev;
      const removedTask = logs[logIdx].tasks.find(t => t.id === taskId);
      const xpToRemove = removedTask?.completed ? removedTask.xpReward : 0;
      logs[logIdx] = {
        ...logs[logIdx],
        tasks: logs[logIdx].tasks.filter(t => t.id !== taskId),
        totalXP: logs[logIdx].totalXP - xpToRemove,
      };
      return { ...prev, dailyLogs: logs, totalXP: prev.totalXP - xpToRemove };
    });
  }, [setState]);

  const updateProfile = useCallback((profile: ProfileData) => {
    setState(prev => ({ ...prev, profile }));
  }, [setState]);

  const exportData = useCallback(() => {
    const dataStr = JSON.stringify(state, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'solo-leveling-progress.json';
    a.click();
  }, [state]);

  const importData = useCallback((jsonStr: string) => {
    try {
      const data = JSON.parse(jsonStr) as AppState;
      setState(data);
    } catch {
      console.error('Invalid import data');
    }
  }, [setState]);

  const resetData = useCallback(() => {
    setState(defaultState);
  }, [setState]);

  return {
    state,
    addXP,
    updateSkill,
    addTask,
    completeTask,
    deleteTask,
    updateProfile,
    exportData,
    importData,
    resetData,
  };
}

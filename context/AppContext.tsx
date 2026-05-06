'use client';
import React, { createContext, useContext } from 'react';
import { useAppState } from '@/hooks/useAppState';
import {
  AppState, Skill, DailyTask, ProfileData
} from '@/lib/types';

interface AppContextType {
  state: AppState;
  addXP: (amount: number) => void;
  updateSkill: (skillId: string, level: number) => void;
  addTask: (task: DailyTask) => void;
  completeTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  updateProfile: (profile: ProfileData) => void;
  exportData: () => void;
  importData: (jsonStr: string) => void;
  resetData: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const appState = useAppState();
  return <AppContext.Provider value={appState}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

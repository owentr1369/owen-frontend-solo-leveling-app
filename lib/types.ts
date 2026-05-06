export type CareerRank =
  | 'Intern'
  | 'Junior Frontend Developer'
  | 'Frontend Developer'
  | 'Mid-Level Frontend Engineer'
  | 'Senior Frontend Engineer'
  | 'Tech Lead'
  | 'Staff Engineer'
  | 'Engineering Manager'
  | 'Head of Engineering'
  | 'VP of Engineering'
  | 'CTO';

export interface RankThreshold {
  minLevel: number;
  maxLevel: number;
  rank: CareerRank;
  color: string;
  bgColor: string;
  description: string;
}

export const RANK_THRESHOLDS: RankThreshold[] = [
  { minLevel: 1, maxLevel: 10, rank: 'Intern', color: '#94A3B8', bgColor: 'rgba(148,163,184,0.15)', description: 'Starting your journey' },
  { minLevel: 11, maxLevel: 20, rank: 'Junior Frontend Developer', color: '#22C55E', bgColor: 'rgba(34,197,94,0.15)', description: 'Building foundations' },
  { minLevel: 21, maxLevel: 35, rank: 'Frontend Developer', color: '#06B6D4', bgColor: 'rgba(6,182,212,0.15)', description: 'Growing expertise' },
  { minLevel: 36, maxLevel: 50, rank: 'Mid-Level Frontend Engineer', color: '#3B82F6', bgColor: 'rgba(59,130,246,0.15)', description: 'Established engineer' },
  { minLevel: 51, maxLevel: 65, rank: 'Senior Frontend Engineer', color: '#8B5CF6', bgColor: 'rgba(139,92,246,0.15)', description: 'Technical authority' },
  { minLevel: 66, maxLevel: 75, rank: 'Tech Lead', color: '#7C3AED', bgColor: 'rgba(124,58,237,0.15)', description: 'Leading technical direction' },
  { minLevel: 76, maxLevel: 82, rank: 'Staff Engineer', color: '#F59E0B', bgColor: 'rgba(245,158,11,0.15)', description: 'Cross-team impact' },
  { minLevel: 83, maxLevel: 88, rank: 'Engineering Manager', color: '#EF4444', bgColor: 'rgba(239,68,68,0.15)', description: 'People & systems leader' },
  { minLevel: 89, maxLevel: 93, rank: 'Head of Engineering', color: '#EC4899', bgColor: 'rgba(236,72,153,0.15)', description: 'Engineering organization leader' },
  { minLevel: 94, maxLevel: 97, rank: 'VP of Engineering', color: '#F97316', bgColor: 'rgba(249,115,22,0.15)', description: 'Strategic engineering executive' },
  { minLevel: 98, maxLevel: 100, rank: 'CTO', color: '#22D3EE', bgColor: 'rgba(34,211,238,0.15)', description: 'Chief Technology Officer' },
];

export function getRankForLevel(level: number): RankThreshold {
  return RANK_THRESHOLDS.find(r => level >= r.minLevel && level <= r.maxLevel) || RANK_THRESHOLDS[0];
}

export function getXPForLevel(level: number): number {
  return level * 100;
}

export function getLevelFromXP(totalXP: number): number {
  let level = 1;
  let xpNeeded = 0;
  while (level < 100) {
    xpNeeded += getXPForLevel(level);
    if (totalXP < xpNeeded) break;
    level++;
  }
  return Math.min(level, 100);
}

export function getXPProgress(totalXP: number): { current: number; needed: number; percent: number } {
  const level = getLevelFromXP(totalXP);
  let xpForCurrentLevel = 0;
  for (let i = 1; i < level; i++) xpForCurrentLevel += getXPForLevel(i);
  const xpIntoLevel = totalXP - xpForCurrentLevel;
  const needed = getXPForLevel(level);
  return {
    current: xpIntoLevel,
    needed,
    percent: Math.min((xpIntoLevel / needed) * 100, 100),
  };
}

export type SkillCategory = 'Frontend' | 'Backend' | 'Soft Skills' | 'Business & Leadership';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: number; // 0-100
  description?: string;
}

export function getSkillTier(level: number): { label: string; color: string } {
  if (level >= 90) return { label: 'Legendary', color: '#FFD700' };
  if (level >= 70) return { label: 'Epic', color: '#9B59B6' };
  if (level >= 50) return { label: 'Rare', color: '#3498DB' };
  if (level >= 30) return { label: 'Uncommon', color: '#2ECC71' };
  return { label: 'Common', color: '#95A5A6' };
}


export interface DailyTask {
  id: string;
  title: string;
  description?: string;
  xpReward: number;
  completed: boolean;
  completedAt?: string;
  date: string;
  category: 'learning' | 'coding' | 'leadership' | 'communication' | 'other';
}

export interface DailyLog {
  date: string;
  tasks: DailyTask[];
  totalXP: number;
  mood?: 'great' | 'good' | 'okay' | 'tough';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  condition: (data: { level: number; totalXP: number; streak: number; skills: Skill[]; tasks: DailyTask[] }) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-task', title: 'First Step', description: 'Complete your first task', icon: '⚡', unlocked: false, condition: ({ tasks }) => tasks.filter(t => t.completed).length >= 1 },
  { id: 'level-10', title: 'Rookie No More', description: 'Reach level 10', icon: '🔥', unlocked: false, condition: ({ level }) => level >= 10 },
  { id: 'level-25', title: 'Growing Fast', description: 'Reach level 25', icon: '💎', unlocked: false, condition: ({ level }) => level >= 25 },
  { id: 'level-50', title: 'Halfway Legend', description: 'Reach level 50', icon: '⚔️', unlocked: false, condition: ({ level }) => level >= 50 },
  { id: 'level-75', title: 'Elite Developer', description: 'Reach level 75', icon: '👑', unlocked: false, condition: ({ level }) => level >= 75 },
  { id: 'level-100', title: 'The CTO', description: 'Reach the maximum level', icon: '🏆', unlocked: false, condition: ({ level }) => level >= 100 },
  { id: 'streak-7', title: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '🌟', unlocked: false, condition: ({ streak }) => streak >= 7 },
  { id: 'streak-30', title: 'Month Master', description: 'Maintain a 30-day streak', icon: '💫', unlocked: false, condition: ({ streak }) => streak >= 30 },
  { id: 'skill-master', title: 'Skill Master', description: 'Get any skill to 90+', icon: '🎯', unlocked: false, condition: ({ skills }) => skills.some(s => s.level >= 90) },
  { id: 'xp-1000', title: 'XP Grinder', description: 'Earn 1000 total XP', icon: '💥', unlocked: false, condition: ({ totalXP }) => totalXP >= 1000 },
];

export interface ProfileData {
  name: string;
  avatar?: string;
  title: string;
  bio: string;
  mainStack: string[];
  currentFocus: string;
  strengths: string[];
  weaknesses: string[];
  goals: string[];
}


export interface AppState {
  totalXP: number;
  skills: Skill[];
  dailyLogs: DailyLog[];
  achievements: Achievement[];
  profile: ProfileData;
  streak: number;
  lastActiveDate: string;
}

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

export const DEFAULT_SKILLS: Skill[] = [
  // Frontend
  { id: 'html', name: 'HTML', category: 'Frontend', level: 70, description: 'Semantic markup & structure' },
  { id: 'css', name: 'CSS', category: 'Frontend', level: 65, description: 'Styling & layout systems' },
  { id: 'javascript', name: 'JavaScript', category: 'Frontend', level: 60, description: 'Core language fundamentals' },
  { id: 'typescript', name: 'TypeScript', category: 'Frontend', level: 50, description: 'Static typing & interfaces' },
  { id: 'react', name: 'React', category: 'Frontend', level: 55, description: 'Component-based UI library' },
  { id: 'nextjs', name: 'Next.js', category: 'Frontend', level: 45, description: 'Full-stack React framework' },
  { id: 'performance', name: 'Performance Optimization', category: 'Frontend', level: 35, description: 'Core Web Vitals & optimization' },
  { id: 'accessibility', name: 'Accessibility', category: 'Frontend', level: 30, description: 'WCAG & inclusive design' },
  { id: 'testing', name: 'Testing', category: 'Frontend', level: 25, description: 'Unit, integration & e2e testing' },
  // Backend
  { id: 'nodejs', name: 'Node.js', category: 'Backend', level: 30, description: 'Server-side JavaScript' },
  { id: 'apis', name: 'APIs', category: 'Backend', level: 40, description: 'REST & GraphQL API design' },
  { id: 'databases', name: 'Databases', category: 'Backend', level: 25, description: 'SQL, NoSQL, data modeling' },
  { id: 'auth', name: 'Authentication', category: 'Backend', level: 30, description: 'OAuth, JWT, security patterns' },
  { id: 'system-design', name: 'System Design', category: 'Backend', level: 20, description: 'Scalable architecture patterns' },
  // Soft Skills
  { id: 'communication', name: 'Communication', category: 'Soft Skills', level: 55, description: 'Clear & effective communication' },
  { id: 'leadership', name: 'Leadership', category: 'Soft Skills', level: 30, description: 'Guiding & inspiring teams' },
  { id: 'project-mgmt', name: 'Project Management', category: 'Soft Skills', level: 35, description: 'Planning & execution' },
  { id: 'problem-solving', name: 'Problem Solving', category: 'Soft Skills', level: 60, description: 'Analytical thinking & solutions' },
  { id: 'mentoring', name: 'Mentoring', category: 'Soft Skills', level: 25, description: 'Growing other engineers' },
  { id: 'negotiation', name: 'Negotiation', category: 'Soft Skills', level: 20, description: 'Achieving win-win outcomes' },
  { id: 'product-thinking', name: 'Product Thinking', category: 'Soft Skills', level: 35, description: 'User & business alignment' },
  { id: 'strategic-thinking', name: 'Strategic Thinking', category: 'Soft Skills', level: 20, description: 'Long-term vision & planning' },
  { id: 'english', name: 'English', category: 'Soft Skills', level: 72, description: 'IELTS 6.5 — Competent user (B2+). Professional working proficiency.' },
  // Business & Leadership
  { id: 'hiring', name: 'Hiring', category: 'Business & Leadership', level: 15, description: 'Talent acquisition & evaluation' },
  { id: 'team-building', name: 'Team Building', category: 'Business & Leadership', level: 20, description: 'Building high-performance teams' },
  { id: 'tech-vision', name: 'Technical Vision', category: 'Business & Leadership', level: 25, description: 'Technology strategy & roadmap' },
  { id: 'stakeholder', name: 'Stakeholder Management', category: 'Business & Leadership', level: 20, description: 'Executive & cross-functional alignment' },
  { id: 'architecture', name: 'Architecture Decisions', category: 'Business & Leadership', level: 20, description: 'System architecture & trade-offs' },
];

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

export const DEFAULT_PROFILE: ProfileData = {
  name: 'Owen Developer',
  title: 'Frontend Developer → CTO',
  bio: 'On a legendary journey to become a world-class CTO. Building, learning, and leveling up every single day.',
  mainStack: ['React', 'TypeScript', 'Next.js', 'Node.js'],
  currentFocus: 'Mastering system design and technical leadership',
  strengths: ['Fast learner', 'Problem solver', 'Detail-oriented'],
  weaknesses: ['Public speaking', 'Delegation', 'Work-life balance'],
  goals: ['Lead a team of 10+ engineers', 'Build a product used by 1M+ users', 'Become CTO by 2027'],
};

export interface AppState {
  totalXP: number;
  skills: Skill[];
  dailyLogs: DailyLog[];
  achievements: Achievement[];
  profile: ProfileData;
  streak: number;
  lastActiveDate: string;
}

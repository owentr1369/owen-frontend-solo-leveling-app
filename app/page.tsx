'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppProvider, useApp } from '@/context/AppContext';
import Sidebar, { MobileNav } from '@/components/Sidebar';
import ParticleBackground from '@/components/ParticleBackground';
import AchievementPopup from '@/components/AchievementPopup';
import DashboardSection from '@/components/sections/DashboardSection';
import SkillsSection from '@/components/sections/SkillsSection';
import CareerJourneySection from '@/components/sections/CareerJourneySection';
import DailyProgressSection from '@/components/sections/DailyProgressSection';
import ProfileSection from '@/components/sections/ProfileSection';
import { Achievement } from '@/lib/types';

type Section = 'dashboard' | 'skills' | 'journey' | 'daily' | 'profile';

const SECTION_COMPONENTS: Record<Section, React.ComponentType> = {
  dashboard: DashboardSection,
  skills: SkillsSection,
  journey: CareerJourneySection,
  daily: DailyProgressSection,
  profile: ProfileSection,
};

function AppContent() {
  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  // Track whether we're on desktop to decide if sidebar margin applies
  const [isDesktop, setIsDesktop] = useState(false);
  const { state } = useApp();
  const prevAchievements = useRef(state.achievements);

  // Detect desktop vs mobile — runs only on client
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Check for newly unlocked achievements
  useEffect(() => {
    const prev = prevAchievements.current;
    const newlyUnlocked = state.achievements.find(
      (a, i) => a.unlocked && !prev[i]?.unlocked
    );
    if (newlyUnlocked) setNewAchievement(newlyUnlocked);
    prevAchievements.current = state.achievements;
  }, [state.achievements]);

  const SectionComponent = SECTION_COMPONENTS[activeSection];
  const sidebarWidth = sidebarCollapsed ? 72 : 260;
  // Only offset content by sidebar width on desktop
  const contentMargin = isDesktop ? sidebarWidth : 0;

  return (
    <div className="min-h-screen relative" style={{ background: '#070B14' }}>
      <ParticleBackground count={25} />

      {/* Sidebar — hidden on mobile via its own className */}
      <Sidebar
        activeSection={activeSection}
        onNavigate={id => setActiveSection(id as Section)}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
      />

      {/* Main content */}
      <motion.main
        animate={{ marginLeft: contentMargin }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="relative z-10 min-h-screen pb-24 md:pb-8"
        style={{ marginLeft: 0 }}
      >
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <SectionComponent />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.main>

      {/* Mobile bottom nav */}
      <MobileNav
        activeSection={activeSection}
        onNavigate={id => setActiveSection(id as Section)}
      />

      {/* Achievement popup */}
      <AchievementPopup
        achievement={newAchievement}
        onClose={() => setNewAchievement(null)}
      />
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

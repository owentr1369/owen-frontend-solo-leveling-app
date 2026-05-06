"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  TreePine,
  MapPin,
  Calendar,
  User,
  Zap,
  ChevronRight,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { getLevelFromXP, getRankForLevel, getXPProgress } from "@/lib/types";

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "#dashboard",
  },
  { id: "skills", label: "Skills Tree", icon: TreePine, href: "#skills" },
  { id: "journey", label: "Career Journey", icon: MapPin, href: "#journey" },
  { id: "daily", label: "Daily Progress", icon: Calendar, href: "#daily" },
  { id: "profile", label: "System Status", icon: User, href: "#profile" },
];

interface SidebarProps {
  activeSection: string;
  onNavigate: (id: string) => void;
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({
  activeSection,
  onNavigate,
  collapsed,
  onToggle,
}: SidebarProps) {
  const { state } = useApp();
  const level = getLevelFromXP(state.totalXP);
  const rank = getRankForLevel(level);
  const xpProgress = getXPProgress(state.totalXP);

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="hidden md:flex flex-col fixed left-0 top-0 h-screen z-50 overflow-hidden"
      style={{
        background: "rgba(7, 11, 20, 0.95)",
        backdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(124,58,237,0.2)",
      }}
    >
      {/* Logo area */}
      <div
        className="flex items-center gap-3 p-4 h-16"
        style={{ borderBottom: "1px solid rgba(124,58,237,0.15)" }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
            boxShadow: "0 0 20px rgba(124,58,237,0.5)",
          }}
          onClick={onToggle}
        >
          <Zap size={20} color="white" />
        </motion.div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ delay: 0.1 }}
          >
            <div
              className="font-bold text-sm"
              style={{ color: "#F8FAFC", letterSpacing: "0.05em" }}
            >
              SOLO LEVELING
            </div>
            <div className="text-xs font-medium" style={{ color: "#7C3AED" }}>
              Developer System
            </div>
          </motion.div>
        )}
      </div>

      {/* Level summary */}
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mx-3 my-3 p-3 rounded-xl"
          style={{
            background: "rgba(124,58,237,0.1)",
            border: "1px solid rgba(124,58,237,0.25)",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
              style={{
                background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
                color: "white",
              }}
            >
              {level}
            </div>
            <div>
              <div className="text-xs font-bold" style={{ color: "#F8FAFC" }}>
                {rank.rank}
              </div>
              <div className="text-xs" style={{ color: "#94A3B8" }}>
                {state.totalXP} XP total
              </div>
            </div>
          </div>
          <div className="xp-bar">
            <motion.div
              className="xp-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress.percent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs" style={{ color: "#94A3B8" }}>
              {xpProgress.current} XP
            </span>
            <span className="text-xs" style={{ color: "#94A3B8" }}>
              {xpProgress.needed} XP
            </span>
          </div>
        </motion.div>
      )}

      {/* Nav items */}
      <nav className="flex-1 px-2 py-2 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              whileHover={{ x: 2 }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left"
              style={{
                background: isActive ? "rgba(124,58,237,0.2)" : "transparent",
                color: isActive ? "#22D3EE" : "#94A3B8",
                border: isActive
                  ? "1px solid rgba(124,58,237,0.4)"
                  : "1px solid transparent",
                boxShadow: isActive ? "0 0 10px rgba(124,58,237,0.15)" : "none",
              }}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm font-medium flex-1"
                >
                  {item.label}
                </motion.span>
              )}
              {!collapsed && isActive && (
                <ChevronRight size={14} style={{ color: "#7C3AED" }} />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Streak indicator */}
      {!collapsed && state.streak > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mx-3 mb-3 p-3 rounded-xl text-center"
          style={{
            background: "rgba(245,158,11,0.1)",
            border: "1px solid rgba(245,158,11,0.25)",
          }}
        >
          <div className="text-lg">🔥</div>
          <div className="text-sm font-bold" style={{ color: "#F59E0B" }}>
            {state.streak} Day Streak
          </div>
          <div className="text-xs" style={{ color: "#94A3B8" }}>
            Keep going!
          </div>
        </motion.div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="flex items-center justify-center gap-2 p-3 mx-2 mb-3 rounded-xl transition-all duration-200 cursor-pointer"
        style={{ color: "#94A3B8", border: "1px solid rgba(148,163,184,0.1)" }}
      >
        <ChevronRight
          size={16}
          style={{
            transform: collapsed ? "rotate(0deg)" : "rotate(180deg)",
            transition: "transform 0.3s ease",
          }}
        />
        {!collapsed && <span className="text-xs">Collapse</span>}
      </button>
    </motion.aside>
  );
}

export function MobileNav({
  activeSection,
  onNavigate,
}: {
  activeSection: string;
  onNavigate: (id: string) => void;
}) {
  const MOBILE_NAV = NAV_ITEMS.slice(0, 5);
  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-2 py-2"
      style={{
        background: "rgba(7,11,20,0.95)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(124,58,237,0.2)",
      }}
    >
      <div className="flex items-center justify-around">
        {MOBILE_NAV.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="mobile-nav-item"
              style={{
                color: isActive ? "#22D3EE" : "#94A3B8",
                background: isActive ? "rgba(34,211,238,0.1)" : "transparent",
              }}
            >
              <Icon size={20} />
              <span style={{ fontSize: 9 }}>{item.label.split(" ")[0]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

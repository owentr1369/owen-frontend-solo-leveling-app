"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  TrendingUp,
  Trophy,
  Target,
  Flame,
  CheckSquare,
  Star,
  ChevronUp,
  Activity,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import {
  getLevelFromXP,
  getRankForLevel,
  getXPProgress,
  RANK_THRESHOLDS,
  ACHIEVEMENTS,
} from "@/lib/types";

function AnimatedCounter({
  value,
  duration = 1,
}: {
  value: number;
  duration?: number;
}) {
  const [display, setDisplay] = React.useState(0);
  React.useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = (Date.now() - start) / (duration * 1000);
      if (elapsed >= 1) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(value * elapsed));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);
  return <>{display.toLocaleString()}</>;
}

export default function DashboardSection() {
  const { state } = useApp();
  const level = getLevelFromXP(state.totalXP);
  const rank = getRankForLevel(level);
  const xpProgress = getXPProgress(state.totalXP);
  const [showLevelUp, setShowLevelUp] = useState(false);

  const todayStr = new Date().toISOString().split("T")[0];
  const todayLog = state.dailyLogs.find((l) => l.date === todayStr);
  const todayXP = todayLog?.totalXP || 0;
  const todayTasks = todayLog?.tasks || [];
  const completedToday = todayTasks.filter((t) => t.completed).length;
  const unlockedAchievements = state.achievements.filter((a) => a.unlocked);

  const nextRank = RANK_THRESHOLDS.find((r) => r.minLevel > level);

  const stats = [
    {
      label: "Total XP",
      value: state.totalXP,
      icon: Zap,
      color: "#7C3AED",
      suffix: "",
    },
    {
      label: "Current Level",
      value: level,
      icon: Star,
      color: "#22D3EE",
      suffix: "",
    },
    {
      label: "Day Streak",
      value: state.streak,
      icon: Flame,
      color: "#F59E0B",
      suffix: "d",
    },
    {
      label: "Achievements",
      value: unlockedAchievements.length,
      icon: Trophy,
      color: "#22C55E",
      suffix: "",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1
          className="text-2xl md:text-3xl font-bold"
          style={{ color: "#F8FAFC" }}
        >
          System Dashboard
        </h1>
        <p className="text-sm mt-1" style={{ color: "#94A3B8" }}>
          Welcome back,{" "}
          <span style={{ color: "#22D3EE" }}>{state.profile.name}</span>. Keep
          leveling up.
        </p>
      </motion.div>

      {/* Main XP Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden rounded-2xl p-6"
        style={{
          background:
            "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.1))",
          border: "1px solid rgba(124,58,237,0.4)",
          boxShadow: "0 0 30px rgba(124,58,237,0.15)",
        }}
      >
        {/* BG decoration */}
        <div
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #7C3AED, transparent)",
          }}
        />
        <div
          className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #06B6D4, transparent)",
          }}
        />

        <div className="relative flex flex-col md:flex-row md:items-center gap-6">
          {/* Level display */}
          <div className="flex items-center gap-4">
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 20px rgba(124,58,237,0.5)",
                  "0 0 40px rgba(124,58,237,0.8)",
                  "0 0 20px rgba(124,58,237,0.5)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #7C3AED, #5B21B6)",
              }}
            >
              <span
                className="text-xs font-bold opacity-70"
                style={{ color: "#E9D5FF", letterSpacing: "0.1em" }}
              >
                LV
              </span>
              <span
                className="text-3xl font-black"
                style={{ color: "white", lineHeight: 1 }}
              >
                {level}
              </span>
            </motion.div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="rank-badge"
                  style={{
                    background: rank.bgColor,
                    color: rank.color,
                    border: `1px solid ${rank.color}40`,
                  }}
                >
                  {rank.rank}
                </span>
              </div>
              <div className="text-sm" style={{ color: "#94A3B8" }}>
                {nextRank
                  ? `${nextRank.minLevel - level} levels to ${nextRank.rank}`
                  : "Maximum Rank Achieved!"}
              </div>
            </div>
          </div>

          {/* XP Progress */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <span
                className="text-sm font-medium"
                style={{ color: "#94A3B8" }}
              >
                XP Progress
              </span>
              <span className="text-sm font-bold" style={{ color: "#22D3EE" }}>
                {xpProgress.current} / {xpProgress.needed}
              </span>
            </div>
            <div className="xp-bar h-3">
              <motion.div
                className="h-full rounded-full relative"
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress.percent}%` }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                style={{
                  background: "linear-gradient(90deg, #7C3AED, #22D3EE)",
                }}
              >
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
                  style={{
                    background: "#22D3EE",
                    boxShadow: "0 0 10px #22D3EE",
                  }}
                />
              </motion.div>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs" style={{ color: "#94A3B8" }}>
                Total: <AnimatedCounter value={state.totalXP} /> XP
              </span>
              <span className="text-xs" style={{ color: "#7C3AED" }}>
                {xpProgress.percent.toFixed(1)}% complete
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className="card-hover rounded-xl p-4"
              style={{
                background: "#111827",
                border: "1px solid rgba(148,163,184,0.1)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `${stat.color}20` }}
                >
                  <Icon size={16} style={{ color: stat.color }} />
                </div>
                <span className="text-xs" style={{ color: "#94A3B8" }}>
                  {stat.label}
                </span>
              </div>
              <div className="text-2xl font-black" style={{ color: "#F8FAFC" }}>
                <AnimatedCounter value={stat.value} />
                {stat.suffix}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Today's activity + skills preview */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Today's activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl p-5"
          style={{
            background: "#111827",
            border: "1px solid rgba(148,163,184,0.1)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity size={18} style={{ color: "#7C3AED" }} />
              <span
                className="font-semibold text-sm"
                style={{ color: "#F8FAFC" }}
              >
                Today's Activity
              </span>
            </div>
            <span
              className="text-xs px-2 py-1 rounded-full"
              style={{ background: "rgba(124,58,237,0.15)", color: "#7C3AED" }}
            >
              +{todayXP} XP
            </span>
          </div>
          {todayTasks.length === 0 ? (
            <div className="text-center py-6">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-sm" style={{ color: "#94A3B8" }}>
                No tasks today yet
              </div>
              <div className="text-xs mt-1" style={{ color: "#94A3B8" }}>
                Add tasks in Daily Progress
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {todayTasks.slice(0, 4).map((task) => (
                <div key={task.id} className="flex items-center gap-3 py-1">
                  <div
                    className="w-4 h-4 rounded flex items-center justify-center shrink-0"
                    style={{
                      background: task.completed
                        ? "rgba(34,197,94,0.2)"
                        : "rgba(148,163,184,0.1)",
                      border: `1px solid ${task.completed ? "#22C55E" : "rgba(148,163,184,0.2)"}`,
                    }}
                  >
                    {task.completed && (
                      <span style={{ fontSize: 8, color: "#22C55E" }}>✓</span>
                    )}
                  </div>
                  <span
                    className="text-sm flex-1"
                    style={{
                      color: task.completed ? "#94A3B8" : "#F8FAFC",
                      textDecoration: task.completed ? "line-through" : "none",
                    }}
                  >
                    {task.title}
                  </span>
                  <span className="text-xs" style={{ color: "#7C3AED" }}>
                    +{task.xpReward}
                  </span>
                </div>
              ))}
              {todayTasks.length > 4 && (
                <div
                  className="text-xs text-center pt-1"
                  style={{ color: "#94A3B8" }}
                >
                  +{todayTasks.length - 4} more tasks
                </div>
              )}
            </div>
          )}
          <div
            className="mt-4 pt-3 flex items-center justify-between"
            style={{ borderTop: "1px solid rgba(148,163,184,0.08)" }}
          >
            <span className="text-xs" style={{ color: "#94A3B8" }}>
              {completedToday}/{todayTasks.length} completed
            </span>
            <div className="flex items-center gap-1">
              <CheckSquare size={12} style={{ color: "#22C55E" }} />
              <span className="text-xs" style={{ color: "#22C55E" }}>
                {todayXP} XP earned
              </span>
            </div>
          </div>
        </motion.div>

        {/* Achievements preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.45 }}
          className="rounded-xl p-5"
          style={{
            background: "#111827",
            border: "1px solid rgba(148,163,184,0.1)",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Trophy size={18} style={{ color: "#F59E0B" }} />
            <span
              className="font-semibold text-sm"
              style={{ color: "#F8FAFC" }}
            >
              Achievements
            </span>
            <span
              className="ml-auto text-xs px-2 py-1 rounded-full"
              style={{ background: "rgba(245,158,11,0.15)", color: "#F59E0B" }}
            >
              {unlockedAchievements.length}/{state.achievements.length}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-2 mb-3">
            {state.achievements.map((a) => (
              <motion.div
                key={a.id}
                title={a.title}
                whileHover={{ scale: 1.1 }}
                className="aspect-square rounded-lg flex items-center justify-center text-lg cursor-pointer"
                style={{
                  background: a.unlocked
                    ? "rgba(245,158,11,0.15)"
                    : "rgba(148,163,184,0.05)",
                  border: `1px solid ${a.unlocked ? "rgba(245,158,11,0.4)" : "rgba(148,163,184,0.1)"}`,
                  filter: a.unlocked ? "none" : "grayscale(1) opacity(0.3)",
                }}
              >
                {a.icon}
              </motion.div>
            ))}
          </div>
          {unlockedAchievements.length === 0 ? (
            <div className="text-xs text-center" style={{ color: "#94A3B8" }}>
              Complete tasks to unlock achievements
            </div>
          ) : (
            <div className="text-xs" style={{ color: "#94A3B8" }}>
              Latest:{" "}
              <span style={{ color: "#F59E0B" }}>
                {unlockedAchievements[unlockedAchievements.length - 1]?.title}
              </span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Rank progression */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-xl p-5"
        style={{
          background: "#111827",
          border: "1px solid rgba(148,163,184,0.1)",
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} style={{ color: "#22D3EE" }} />
          <span className="font-semibold text-sm" style={{ color: "#F8FAFC" }}>
            Career Rank Progression
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {RANK_THRESHOLDS.map((r, i) => {
            const isCompleted = level > r.maxLevel;
            const isCurrent = level >= r.minLevel && level <= r.maxLevel;
            return (
              <motion.div
                key={r.rank}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{
                  background: isCurrent
                    ? r.bgColor
                    : isCompleted
                      ? "rgba(34,197,94,0.1)"
                      : "rgba(148,163,184,0.05)",
                  border: `1px solid ${isCurrent ? r.color + "60" : isCompleted ? "rgba(34,197,94,0.3)" : "rgba(148,163,184,0.1)"}`,
                  color: isCurrent
                    ? r.color
                    : isCompleted
                      ? "#22C55E"
                      : "#94A3B8",
                }}
              >
                {isCompleted && <span>✓</span>}
                {isCurrent && (
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ◆
                  </motion.span>
                )}
                <span>{r.rank}</span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

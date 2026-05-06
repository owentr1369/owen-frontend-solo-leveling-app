"use client";
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  CheckCircle,
  Circle,
  Zap,
  Calendar,
  Flame,
  BookOpen,
  Code,
  Users,
  MessageSquare,
  Lightbulb,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { DailyTask } from "@/lib/types";

const CATEGORY_CONFIG = {
  learning: { icon: BookOpen, color: "#06B6D4", label: "Learning", xp: 25 },
  coding: { icon: Code, color: "#7C3AED", label: "Coding", xp: 30 },
  leadership: { icon: Users, color: "#F59E0B", label: "Leadership", xp: 35 },
  communication: {
    icon: MessageSquare,
    color: "#22C55E",
    label: "Communication",
    xp: 20,
  },
  other: { icon: Lightbulb, color: "#94A3B8", label: "Other", xp: 15 },
} as const;

const PRESET_TASKS = [
  {
    title: "Completed a React course module",
    category: "learning" as const,
    xp: 25,
  },
  { title: "Solved a LeetCode problem", category: "coding" as const, xp: 30 },
  { title: "Built a new feature/project", category: "coding" as const, xp: 50 },
  { title: "Mentored a teammate", category: "leadership" as const, xp: 35 },
  {
    title: "Practiced English speaking",
    category: "communication" as const,
    xp: 20,
  },
  { title: "Read a tech article/book", category: "learning" as const, xp: 15 },
  {
    title: "Solved an architecture problem",
    category: "coding" as const,
    xp: 40,
  },
  { title: "Led a team meeting", category: "leadership" as const, xp: 35 },
];

function TaskCard({
  task,
  onComplete,
  onDelete,
}: {
  task: DailyTask;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const catConf = CATEGORY_CONFIG[task.category];
  const Icon = catConf.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="flex items-center gap-3 p-4 rounded-xl transition-all duration-200"
      style={{
        background: task.completed ? "rgba(34,197,94,0.05)" : "#111827",
        border: `1px solid ${task.completed ? "rgba(34,197,94,0.2)" : "rgba(148,163,184,0.1)"}`,
      }}
    >
      <button
        onClick={() => !task.completed && onComplete(task.id)}
        className="shrink-0 transition-transform hover:scale-110"
        disabled={task.completed}
      >
        {task.completed ? (
          <CheckCircle size={20} style={{ color: "#22C55E" }} />
        ) : (
          <Circle size={20} style={{ color: "#94A3B8" }} />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div
          className="text-sm font-medium truncate"
          style={{
            color: task.completed ? "#94A3B8" : "#F8FAFC",
            textDecoration: task.completed ? "line-through" : "none",
          }}
        >
          {task.title}
        </div>
        {task.description && (
          <div className="text-xs mt-0.5 truncate" style={{ color: "#94A3B8" }}>
            {task.description}
          </div>
        )}
        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center gap-1">
            <Icon size={10} style={{ color: catConf.color }} />
            <span className="text-xs" style={{ color: catConf.color }}>
              {catConf.label}
            </span>
          </div>
          <span className="text-xs" style={{ color: "#94A3B8" }}>
            •
          </span>
          <div className="flex items-center gap-1">
            <Zap size={10} style={{ color: "#7C3AED" }} />
            <span className="text-xs" style={{ color: "#7C3AED" }}>
              +{task.xpReward} XP
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={() => onDelete(task.id)}
        className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-105"
        style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444" }}
      >
        <Trash2 size={13} />
      </button>
    </motion.div>
  );
}

export default function DailyProgressSection() {
  const { state, addTask, completeTask, deleteTask } = useApp();
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] =
    useState<DailyTask["category"]>("learning");
  const [newXP, setNewXP] = useState(25);
  const [showForm, setShowForm] = useState(false);
  const [filterDate, setFilterDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const todayStr = new Date().toISOString().split("T")[0];
  const selectedLog = state.dailyLogs.find((l) => l.date === filterDate);
  const tasks = selectedLog?.tasks || [];
  const completedTasks = tasks.filter((t) => t.completed);
  const totalXPToday = selectedLog?.totalXP || 0;

  const handleAddTask = () => {
    if (!newTitle.trim()) return;
    const task: DailyTask = {
      id: `task-${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim() || undefined,
      xpReward: newXP,
      completed: false,
      date: todayStr,
      category: newCategory,
    };
    addTask(task);
    setNewTitle("");
    setNewDesc("");
    setNewXP(CATEGORY_CONFIG[newCategory].xp);
    setShowForm(false);
  };

  const handlePreset = (preset: (typeof PRESET_TASKS)[0]) => {
    const task: DailyTask = {
      id: `task-${Date.now()}`,
      title: preset.title,
      xpReward: preset.xp,
      completed: false,
      date: todayStr,
      category: preset.category,
    };
    addTask(task);
  };

  const last7Days = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const log = state.dailyLogs.find((l) => l.date === dateStr);
      days.push({
        date: dateStr,
        dayLabel: d.toLocaleDateString("en", { weekday: "short" }),
        xp: log?.totalXP || 0,
        tasks: log?.tasks.length || 0,
      });
    }
    return days;
  }, [state.dailyLogs]);

  const maxXP = Math.max(...last7Days.map((d) => d.xp), 1);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold" style={{ color: "#F8FAFC" }}>
          Daily Progress
        </h2>
        <p className="text-sm mt-1" style={{ color: "#94A3B8" }}>
          Log your daily learning & track your XP gains
        </p>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: "Today XP",
            value: `+${totalXPToday}`,
            icon: Zap,
            color: "#7C3AED",
          },
          {
            label: "Completed",
            value: `${completedTasks.length}/${tasks.length}`,
            icon: CheckCircle,
            color: "#22C55E",
          },
          {
            label: "Streak",
            value: `${state.streak}d`,
            icon: Flame,
            color: "#F59E0B",
          },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="rounded-xl p-3 text-center"
              style={{
                background: "#111827",
                border: "1px solid rgba(148,163,184,0.1)",
              }}
            >
              <Icon
                size={18}
                className="mx-auto mb-1"
                style={{ color: s.color }}
              />
              <div className="text-lg font-black" style={{ color: "#F8FAFC" }}>
                {s.value}
              </div>
              <div className="text-xs" style={{ color: "#94A3B8" }}>
                {s.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Weekly chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl p-5"
        style={{
          background: "#111827",
          border: "1px solid rgba(148,163,184,0.1)",
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={16} style={{ color: "#7C3AED" }} />
          <span className="font-semibold text-sm" style={{ color: "#F8FAFC" }}>
            Weekly XP Overview
          </span>
        </div>
        <div className="flex items-end gap-2" style={{ height: 100 }}>
          {last7Days.map((day, i) => {
            const pct = maxXP > 0 ? (day.xp / maxXP) * 80 : 0;
            const isToday = day.date === todayStr;
            return (
              <div
                key={day.date}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div
                  className="w-full flex flex-col justify-end"
                  style={{ height: 80 }}
                >
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: Math.max(pct, day.xp > 0 ? 6 : 3) }}
                    transition={{ delay: i * 0.08, duration: 0.6 }}
                    className="rounded-t-sm w-full"
                    style={{
                      background: isToday
                        ? "linear-gradient(to top, #7C3AED, #22D3EE)"
                        : day.xp > 0
                          ? "rgba(124,58,237,0.5)"
                          : "rgba(148,163,184,0.08)",
                    }}
                  />
                </div>
                <span
                  className="text-xs"
                  style={{
                    color: isToday ? "#22D3EE" : "#94A3B8",
                    fontSize: 10,
                  }}
                >
                  {day.dayLabel}
                </span>
                {day.xp > 0 && (
                  <span
                    className="text-xs font-bold"
                    style={{ color: "#7C3AED", fontSize: 9 }}
                  >
                    +{day.xp}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Date selector and add button */}
      <div className="flex items-center gap-3">
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="input-dark"
          style={{ maxWidth: 160 }}
        />
        {filterDate === todayStr && (
          <button
            onClick={() => setShowForm((s) => !s)}
            className="btn-primary"
          >
            <Plus size={16} />
            Add Task
          </button>
        )}
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showForm && filterDate === todayStr && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div
              className="rounded-xl p-4 space-y-3"
              style={{
                background: "#111827",
                border: "1px solid rgba(124,58,237,0.3)",
              }}
            >
              <input
                className="input-dark"
                placeholder="Task title (e.g., Completed React course module)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
                autoFocus
              />
              <input
                className="input-dark"
                placeholder="Description (optional)"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
              />
              <div className="flex gap-3 flex-wrap">
                <select
                  className="input-dark flex-1"
                  style={{ minWidth: 120 }}
                  value={newCategory}
                  onChange={(e) => {
                    const cat = e.target.value as DailyTask["category"];
                    setNewCategory(cat);
                    setNewXP(CATEGORY_CONFIG[cat].xp);
                  }}
                >
                  {Object.entries(CATEGORY_CONFIG).map(([key, conf]) => (
                    <option
                      key={key}
                      value={key}
                      style={{ background: "#111827" }}
                    >
                      {conf.label}
                    </option>
                  ))}
                </select>
                <div
                  className="flex items-center gap-2 flex-1"
                  style={{ minWidth: 120 }}
                >
                  <Zap size={14} style={{ color: "#7C3AED" }} />
                  <input
                    type="number"
                    className="input-dark"
                    placeholder="XP reward"
                    value={newXP}
                    min={1}
                    max={200}
                    onChange={(e) => setNewXP(Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleAddTask} className="btn-primary flex-1">
                  Add Task
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="btn-ghost"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick add presets */}
      {filterDate === todayStr && !showForm && (
        <div>
          <div
            className="text-xs mb-2 font-medium uppercase tracking-wider"
            style={{ color: "#94A3B8" }}
          >
            Quick Add
          </div>
          {/* Horizontal scroll row — no wrapping on mobile */}
          <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            {PRESET_TASKS.map((preset) => {
              const catConf = CATEGORY_CONFIG[preset.category];
              const Icon = catConf.icon;
              return (
                <button
                  key={preset.title}
                  onClick={() => handlePreset(preset)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all hover:scale-105 active:scale-95 shrink-0 whitespace-nowrap"
                  style={{
                    background: `${catConf.color}15`,
                    border: `1px solid ${catConf.color}30`,
                    color: catConf.color,
                  }}
                >
                  <Icon size={11} />
                  {preset.title}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Task list */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={completeTask}
              onDelete={deleteTask}
            />
          ))}
        </AnimatePresence>
        {tasks.length === 0 && (
          <div className="text-center py-10">
            <div className="text-4xl mb-3">📋</div>
            <div className="text-sm" style={{ color: "#94A3B8" }}>
              {filterDate === todayStr
                ? "No tasks yet. Add your first task above!"
                : "No tasks recorded for this day."}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

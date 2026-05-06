"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Edit2,
  Check,
  X,
  Plus,
  Minus,
  Download,
  Upload,
  RotateCcw,
  Shield,
  Target,
  Zap,
  Star,
  Code2,
  Users,
  Brain,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { getLevelFromXP, getRankForLevel, getXPProgress } from "@/lib/types";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

function EditableList({
  items,
  onChange,
  placeholder,
  color,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
  color: string;
}) {
  const [adding, setAdding] = useState(false);
  const [newVal, setNewVal] = useState("");

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div
          key={i}
          className="flex items-center gap-2 text-sm"
          style={{ color: "#94A3B8" }}
        >
          <span style={{ color }}>▸</span>
          <span className="flex-1">{item}</span>
          <button
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="opacity-40 hover:opacity-100 transition-opacity"
          >
            <X size={12} style={{ color: "#EF4444" }} />
          </button>
        </div>
      ))}
      {adding ? (
        <div className="flex gap-2">
          <input
            className="input-dark text-xs flex-1"
            placeholder={placeholder}
            value={newVal}
            onChange={(e) => setNewVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && newVal.trim()) {
                onChange([...items, newVal.trim()]);
                setNewVal("");
                setAdding(false);
              }
              if (e.key === "Escape") setAdding(false);
            }}
            autoFocus
          />
          <button
            onClick={() => {
              if (newVal.trim()) {
                onChange([...items, newVal.trim()]);
                setNewVal("");
              }
              setAdding(false);
            }}
            className="btn-ghost px-2"
          >
            <Check size={14} style={{ color: "#22C55E" }} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-1 text-xs transition-colors"
          style={{ color: "#94A3B8" }}
        >
          <Plus size={12} style={{ color }} />
          <span style={{ color }}>Add item</span>
        </button>
      )}
    </div>
  );
}

export default function ProfileSection() {
  const { state, updateProfile, exportData, importData, resetData } = useApp();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(state.profile);

  const level = getLevelFromXP(state.totalXP);
  const rank = getRankForLevel(level);
  const xpProgress = getXPProgress(state.totalXP);

  const handleSave = () => {
    updateProfile(draft);
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(state.profile);
    setEditing(false);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) importData(ev.target.result as string);
      };
      reader.readAsText(file);
    };
    input.click();
  };

  // Radar chart data
  const radarData = [
    {
      subject: "Frontend",
      value: Math.round(
        state.skills
          .filter((s) => s.category === "Frontend")
          .reduce((a, s) => a + s.level, 0) /
          state.skills.filter((s) => s.category === "Frontend").length,
      ),
    },
    {
      subject: "Backend",
      value: Math.round(
        state.skills
          .filter((s) => s.category === "Backend")
          .reduce((a, s) => a + s.level, 0) /
          state.skills.filter((s) => s.category === "Backend").length,
      ),
    },
    {
      subject: "Soft Skills",
      value: Math.round(
        state.skills
          .filter((s) => s.category === "Soft Skills")
          .reduce((a, s) => a + s.level, 0) /
          state.skills.filter((s) => s.category === "Soft Skills").length,
      ),
    },
    {
      subject: "Leadership",
      value: Math.round(
        state.skills
          .filter((s) => s.category === "Business & Leadership")
          .reduce((a, s) => a + s.level, 0) /
          state.skills.filter((s) => s.category === "Business & Leadership")
            .length,
      ),
    },
    {
      subject: "Problem Solving",
      value: state.skills.find((s) => s.id === "problem-solving")?.level || 0,
    },
    {
      subject: "Communication",
      value: state.skills.find((s) => s.id === "communication")?.level || 0,
    },
  ];

  const totalDaysActive = new Set(state.dailyLogs.map((l) => l.date)).size;
  const totalTasksDone = state.dailyLogs
    .flatMap((l) => l.tasks)
    .filter((t) => t.completed).length;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "#F8FAFC" }}>
            System Status
          </h2>
          <p className="text-sm mt-1" style={{ color: "#94A3B8" }}>
            Your developer profile & stats
          </p>
        </div>
        <div className="flex gap-2">
          {editing ? (
            <>
              <button onClick={handleSave} className="btn-primary">
                <Check size={16} />
                Save
              </button>
              <button onClick={handleCancel} className="btn-ghost">
                <X size={16} />
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setDraft(state.profile);
                setEditing(true);
              }}
              className="btn-ghost"
            >
              <Edit2 size={16} />
              Edit
            </button>
          )}
        </div>
      </motion.div>

      {/* Main profile card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden rounded-2xl p-6"
        style={{
          background:
            "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.08))",
          border: "1px solid rgba(124,58,237,0.35)",
          boxShadow: "0 0 40px rgba(124,58,237,0.1)",
        }}
      >
        {/* Decorative bg */}
        <div
          className="absolute top-0 right-0 w-48 h-48 opacity-10"
          style={{
            background:
              "radial-gradient(circle at top right, #22D3EE, transparent)",
          }}
        />

        <div className="relative flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 20px rgba(124,58,237,0.5)",
                  "0 0 40px rgba(34,211,238,0.6)",
                  "0 0 20px rgba(124,58,237,0.5)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl"
              style={{
                background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
              }}
            >
              👨‍💻
            </motion.div>
            <div
              className="rank-badge"
              style={{
                background: rank.bgColor,
                color: rank.color,
                border: `1px solid ${rank.color}40`,
              }}
            >
              LV{level} · {rank.rank.split(" ").slice(-1)[0]}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-2">
            {editing ? (
              <>
                <input
                  className="input-dark text-xl font-bold"
                  value={draft.name}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, name: e.target.value }))
                  }
                  placeholder="Your name"
                />
                <input
                  className="input-dark"
                  value={draft.title}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, title: e.target.value }))
                  }
                  placeholder="Professional title"
                />
                <textarea
                  className="input-dark text-sm"
                  rows={2}
                  value={draft.bio}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, bio: e.target.value }))
                  }
                  placeholder="Your bio"
                  style={{ resize: "none" }}
                />
                <input
                  className="input-dark"
                  value={draft.currentFocus}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, currentFocus: e.target.value }))
                  }
                  placeholder="Current focus"
                />
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold" style={{ color: "#F8FAFC" }}>
                  {state.profile.name}
                </h3>
                <div
                  className="text-sm font-medium"
                  style={{ color: "#22D3EE" }}
                >
                  {state.profile.title}
                </div>
                <p className="text-sm" style={{ color: "#94A3B8" }}>
                  {state.profile.bio}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <Target size={14} style={{ color: "#7C3AED" }} />
                  <span className="text-sm" style={{ color: "#94A3B8" }}>
                    Focus:{" "}
                    <span style={{ color: "#F8FAFC" }}>
                      {state.profile.currentFocus}
                    </span>
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Stats column */}
          <div className="flex flex-col gap-3 min-w-[120px]">
            {[
              {
                label: "Total XP",
                value: state.totalXP.toLocaleString(),
                color: "#7C3AED",
              },
              {
                label: "Days Active",
                value: totalDaysActive,
                color: "#06B6D4",
              },
              { label: "Tasks Done", value: totalTasksDone, color: "#22C55E" },
              { label: "Streak", value: `${state.streak}d`, color: "#F59E0B" },
            ].map((s) => (
              <div
                key={s.label}
                className="text-center p-2 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(148,163,184,0.08)",
                }}
              >
                <div className="text-lg font-black" style={{ color: s.color }}>
                  {s.value}
                </div>
                <div className="text-xs" style={{ color: "#94A3B8" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Two column grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Radar chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl p-5"
          style={{
            background: "#111827",
            border: "1px solid rgba(148,163,184,0.1)",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Brain size={16} style={{ color: "#7C3AED" }} />
            <span
              className="font-semibold text-sm"
              style={{ color: "#F8FAFC" }}
            >
              Skill Radar
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(148,163,184,0.1)" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: "#94A3B8", fontSize: 10 }}
              />
              <Radar
                name="Skills"
                dataKey="value"
                stroke="#7C3AED"
                fill="#7C3AED"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-xl p-5"
          style={{
            background: "#111827",
            border: "1px solid rgba(148,163,184,0.1)",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Code2 size={16} style={{ color: "#06B6D4" }} />
            <span
              className="font-semibold text-sm"
              style={{ color: "#F8FAFC" }}
            >
              Main Tech Stack
            </span>
          </div>
          {editing ? (
            <EditableList
              items={draft.mainStack}
              onChange={(items) =>
                setDraft((d) => ({ ...d, mainStack: items }))
              }
              placeholder="Add technology..."
              color="#06B6D4"
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {state.profile.mainStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded-full text-sm font-medium"
                  style={{
                    background: "rgba(6,182,212,0.1)",
                    border: "1px solid rgba(6,182,212,0.3)",
                    color: "#06B6D4",
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          <div className="mt-5">
            <div className="flex items-center gap-2 mb-3">
              <Shield size={16} style={{ color: "#22C55E" }} />
              <span
                className="font-semibold text-sm"
                style={{ color: "#F8FAFC" }}
              >
                Strengths
              </span>
            </div>
            {editing ? (
              <EditableList
                items={draft.strengths}
                onChange={(items) =>
                  setDraft((d) => ({ ...d, strengths: items }))
                }
                placeholder="Add strength..."
                color="#22C55E"
              />
            ) : (
              <div className="space-y-1">
                {state.profile.strengths.map((s) => (
                  <div
                    key={s}
                    className="flex items-center gap-2 text-sm"
                    style={{ color: "#94A3B8" }}
                  >
                    <span style={{ color: "#22C55E" }}>▸</span>
                    {s}
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Weaknesses & Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl p-5"
          style={{
            background: "#111827",
            border: "1px solid rgba(148,163,184,0.1)",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Zap size={16} style={{ color: "#EF4444" }} />
            <span
              className="font-semibold text-sm"
              style={{ color: "#F8FAFC" }}
            >
              Growth Areas
            </span>
          </div>
          {editing ? (
            <EditableList
              items={draft.weaknesses}
              onChange={(items) =>
                setDraft((d) => ({ ...d, weaknesses: items }))
              }
              placeholder="Add growth area..."
              color="#EF4444"
            />
          ) : (
            <div className="space-y-1">
              {state.profile.weaknesses.map((w) => (
                <div
                  key={w}
                  className="flex items-center gap-2 text-sm"
                  style={{ color: "#94A3B8" }}
                >
                  <span style={{ color: "#EF4444" }}>▸</span>
                  {w}
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-xl p-5"
          style={{
            background: "#111827",
            border: "1px solid rgba(148,163,184,0.1)",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Star size={16} style={{ color: "#F59E0B" }} />
            <span
              className="font-semibold text-sm"
              style={{ color: "#F8FAFC" }}
            >
              Goals
            </span>
          </div>
          {editing ? (
            <EditableList
              items={draft.goals}
              onChange={(items) => setDraft((d) => ({ ...d, goals: items }))}
              placeholder="Add goal..."
              color="#F59E0B"
            />
          ) : (
            <div className="space-y-2">
              {state.profile.goals.map((g, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-2 rounded-lg"
                  style={{
                    background: "rgba(245,158,11,0.05)",
                    border: "1px solid rgba(245,158,11,0.1)",
                  }}
                >
                  <span
                    className="text-xs font-bold px-1.5 py-0.5 rounded"
                    style={{
                      background: "rgba(245,158,11,0.2)",
                      color: "#F59E0B",
                    }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm" style={{ color: "#94A3B8" }}>
                    {g}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Data management */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="rounded-xl p-5"
        style={{
          background: "#111827",
          border: "1px solid rgba(148,163,184,0.1)",
        }}
      >
        <div
          className="font-semibold text-sm mb-4"
          style={{ color: "#F8FAFC" }}
        >
          Data Management
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={exportData}
            className="btn-ghost flex items-center gap-2"
          >
            <Download size={14} />
            Export Progress
          </button>
          <button
            onClick={handleImport}
            className="btn-ghost flex items-center gap-2"
          >
            <Upload size={14} />
            Import Progress
          </button>
          <button
            onClick={() => {
              if (confirm("Reset all progress? This cannot be undone."))
                resetData();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
            style={{
              background: "rgba(239,68,68,0.1)",
              color: "#EF4444",
              border: "1px solid rgba(239,68,68,0.25)",
            }}
          >
            <RotateCcw size={14} />
            Reset All
          </button>
        </div>
      </motion.div>
    </div>
  );
}

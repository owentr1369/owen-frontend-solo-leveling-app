"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  MapPin,
  Zap,
  Users,
  Code2,
  Brain,
  Target,
} from "lucide-react";
import { RANK_THRESHOLDS, getLevelFromXP } from "@/lib/types";
import { useApp } from "@/context/AppContext";

interface MilestoneData {
  rank: string;
  emoji: string;
  levelRange: string;
  technical: string[];
  mindset: string[];
  leadership: string[];
  responsibilities: string[];
  roadmap: string[];
}

const MILESTONES: MilestoneData[] = [
  {
    rank: "Intern",
    emoji: "🌱",
    levelRange: "1-10",
    technical: [
      "Basic HTML/CSS/JS",
      "Git fundamentals",
      "Following code style guides",
      "Reading documentation",
    ],
    mindset: [
      "Embrace not knowing everything",
      "Ask good questions",
      "Learn from every mistake",
      "Show enthusiasm",
    ],
    leadership: [
      "Self-organization",
      "Time management basics",
      "Team communication",
    ],
    responsibilities: [
      "Fix bugs",
      "Write small features",
      "Write documentation",
      "Attend standups",
    ],
    roadmap: [
      "Complete a frontend course",
      "Build 3+ portfolio projects",
      "Contribute to open source",
      "Practice daily coding",
    ],
  },
  {
    rank: "Junior Developer",
    emoji: "⚡",
    levelRange: "11-20",
    technical: [
      "Solid HTML/CSS/JS",
      "React basics",
      "Version control",
      "Basic testing",
      "REST APIs",
    ],
    mindset: [
      "Take ownership of tasks",
      "Proactive communication",
      "Learn from senior devs",
      "Deliver on commitments",
    ],
    leadership: [
      "Work independently",
      "Manage small tasks end-to-end",
      "Give and receive feedback",
    ],
    responsibilities: [
      "Build features independently",
      "Write unit tests",
      "Code reviews",
      "Estimate work",
    ],
    roadmap: [
      "Master React & hooks",
      "Learn TypeScript",
      "Understand CI/CD",
      "Build a full-stack project",
    ],
  },
  {
    rank: "Mid-Level Engineer",
    emoji: "🔥",
    levelRange: "21-50",
    technical: [
      "Deep React knowledge",
      "TypeScript proficiency",
      "State management",
      "Performance optimization",
      "Testing strategies",
    ],
    mindset: [
      "Think in systems",
      "Prioritize effectively",
      "Balance speed vs quality",
      "Mentor juniors",
    ],
    leadership: [
      "Lead small features",
      "Technical documentation",
      "Onboard new members",
    ],
    responsibilities: [
      "Own feature development",
      "Architecture decisions",
      "Cross-team collaboration",
      "Performance monitoring",
    ],
    roadmap: [
      "Learn system design basics",
      "Study design patterns",
      "Improve soft skills",
      "Lead a small project",
    ],
  },
  {
    rank: "Senior Engineer",
    emoji: "💎",
    levelRange: "51-65",
    technical: [
      "Full-stack capability",
      "System design proficiency",
      "Performance expertise",
      "Security awareness",
      "Architecture patterns",
    ],
    mindset: [
      "Think about business impact",
      "Strategic technical decisions",
      "Amplify team effectiveness",
      "Technical ownership",
    ],
    leadership: [
      "Mentor mid-level devs",
      "Lead technical discussions",
      "Drive best practices",
    ],
    responsibilities: [
      "Lead major features",
      "Architecture design",
      "Cross-team initiatives",
      "Hiring interviews",
    ],
    roadmap: [
      "Study distributed systems",
      "Learn team leadership",
      "Build product intuition",
      "Improve communication skills",
    ],
  },
  {
    rank: "Tech Lead",
    emoji: "⚔️",
    levelRange: "66-75",
    technical: [
      "Expert-level architecture",
      "Technology evaluation",
      "Performance at scale",
      "Security design",
    ],
    mindset: [
      "Team-first thinking",
      "Balancing technical & human aspects",
      "Long-term vision",
      "Servant leadership",
    ],
    leadership: [
      "Lead team of 4-8 engineers",
      "Technical roadmap",
      "Stakeholder communication",
    ],
    responsibilities: [
      "Technical direction",
      "Team productivity",
      "Code quality standards",
      "Engineering processes",
    ],
    roadmap: [
      "Study management frameworks",
      "Learn OKRs",
      "Executive communication",
      "Product management basics",
    ],
  },
  {
    rank: "CTO Path",
    emoji: "👑",
    levelRange: "76-100",
    technical: [
      "Organization-wide architecture",
      "Technology strategy",
      "Build vs buy decisions",
      "Innovation pipeline",
    ],
    mindset: [
      "Business-technology alignment",
      "Executive presence",
      "Visionary thinking",
      "Risk management",
    ],
    leadership: [
      "Build & lead engineering org",
      "Board/investor communication",
      "Cross-functional leadership",
    ],
    responsibilities: [
      "Technology strategy",
      "Engineering culture",
      "Product-technology alignment",
      "Team scaling",
    ],
    roadmap: [
      "MBA concepts",
      "Investor relations",
      "Market analysis",
      "Executive leadership programs",
    ],
  },
];

const ICON_MAP: Record<string, React.ElementType> = {
  technical: Code2,
  mindset: Brain,
  leadership: Users,
  responsibilities: Target,
  roadmap: MapPin,
};

function MilestoneCard({
  milestone,
  index,
  isCompleted,
  isCurrent,
}: {
  milestone: MilestoneData;
  index: number;
  isCompleted: boolean;
  isCurrent: boolean;
}) {
  const [expanded, setExpanded] = useState(isCurrent);
  const rankData =
    RANK_THRESHOLDS.find((r) =>
      r.rank.includes(milestone.rank.split(" ")[0]),
    ) || RANK_THRESHOLDS[index];

  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="relative"
    >
      {/* Connector line */}
      {index > 0 && (
        <div
          className="absolute -top-4 left-6 w-0.5 h-4 md:left-1/2 md:-translate-x-1/2"
          style={{
            background: isCompleted ? "#22C55E" : "rgba(148,163,184,0.2)",
          }}
        />
      )}

      <div
        className="rounded-2xl overflow-hidden transition-all duration-200"
        style={{
          background: isCurrent ? "rgba(124,58,237,0.08)" : "#111827",
          border: `1px solid ${isCurrent ? "rgba(124,58,237,0.4)" : isCompleted ? "rgba(34,197,94,0.2)" : "rgba(148,163,184,0.1)"}`,
          boxShadow: isCurrent ? "0 0 30px rgba(124,58,237,0.1)" : "none",
        }}
      >
        {/* Header */}
        <button
          onClick={() => setExpanded((e) => !e)}
          className="w-full flex items-center gap-4 p-5 text-left"
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
            style={{
              background: isCurrent
                ? "linear-gradient(135deg, #7C3AED, #06B6D4)"
                : isCompleted
                  ? "rgba(34,197,94,0.2)"
                  : "rgba(148,163,184,0.1)",
              boxShadow: isCurrent ? "0 0 20px rgba(124,58,237,0.5)" : "none",
            }}
          >
            {isCompleted ? "✓" : milestone.emoji}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="font-bold"
                style={{
                  color: isCurrent
                    ? "#F8FAFC"
                    : isCompleted
                      ? "#22C55E"
                      : "#94A3B8",
                }}
              >
                {milestone.rank}
              </span>
              {isCurrent && (
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-xs px-2 py-0.5 rounded-full font-bold"
                  style={{
                    background: "rgba(124,58,237,0.2)",
                    color: "#7C3AED",
                  }}
                >
                  CURRENT
                </motion.span>
              )}
            </div>
            <div className="text-xs mt-1" style={{ color: "#94A3B8" }}>
              Level {milestone.levelRange}
            </div>
          </div>
          {expanded ? (
            <ChevronUp size={16} style={{ color: "#94A3B8" }} />
          ) : (
            <ChevronDown size={16} style={{ color: "#94A3B8" }} />
          )}
        </button>

        {/* Content */}
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="px-5 pb-5 grid md:grid-cols-2 gap-4"
          >
            {(["technical", "mindset", "leadership", "roadmap"] as const).map(
              (section) => {
                const Icon = ICON_MAP[section];
                const data = milestone[section];
                const titles = {
                  technical: "Technical Skills",
                  mindset: "Mindset Shift",
                  leadership: "Leadership",
                  roadmap: "Growth Roadmap",
                };
                return (
                  <div
                    key={section}
                    className="rounded-xl p-4"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(148,163,184,0.08)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Icon size={14} style={{ color: "#7C3AED" }} />
                      <span
                        className="text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "#7C3AED" }}
                      >
                        {titles[section]}
                      </span>
                    </div>
                    <ul className="space-y-1.5">
                      {data.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-xs"
                          style={{ color: "#94A3B8" }}
                        >
                          <span style={{ color: "#7C3AED", marginTop: 2 }}>
                            ▸
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              },
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default function CareerJourneySection() {
  const { state } = useApp();
  const level = getLevelFromXP(state.totalXP);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold" style={{ color: "#F8FAFC" }}>
          Career Journey
        </h2>
        <p className="text-sm mt-1" style={{ color: "#94A3B8" }}>
          Your path from Intern to CTO
        </p>
      </motion.div>

      {/* Progress overview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl p-4 flex items-center gap-4"
        style={{
          background: "#111827",
          border: "1px solid rgba(148,163,184,0.1)",
        }}
      >
        <MapPin size={20} style={{ color: "#7C3AED" }} />
        <div>
          <div className="font-semibold text-sm" style={{ color: "#F8FAFC" }}>
            You're on your way to becoming a CTO
          </div>
          <div className="text-xs mt-1" style={{ color: "#94A3B8" }}>
            Level {level}/100 • {100 - level} levels remaining
          </div>
        </div>
        <div className="ml-auto text-right">
          <div className="text-2xl font-black" style={{ color: "#7C3AED" }}>
            {level}%
          </div>
          <div className="text-xs" style={{ color: "#94A3B8" }}>
            of journey
          </div>
        </div>
      </motion.div>

      {/* Timeline */}
      <div className="space-y-4">
        {MILESTONES.map((milestone, i) => {
          const rankData =
            RANK_THRESHOLDS[Math.min(i, RANK_THRESHOLDS.length - 1)];
          const isCompleted = level > rankData.maxLevel;
          const isCurrent =
            level >= rankData.minLevel && level <= rankData.maxLevel;
          return (
            <MilestoneCard
              key={milestone.rank}
              milestone={milestone}
              index={i}
              isCompleted={isCompleted}
              isCurrent={isCurrent}
            />
          );
        })}
      </div>
    </div>
  );
}

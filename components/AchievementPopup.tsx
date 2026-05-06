"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, X } from "lucide-react";
import { Achievement } from "@/lib/types";

interface AchievementPopupProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export default function AchievementPopup({
  achievement,
  onClose,
}: AchievementPopupProps) {
  useEffect(() => {
    if (!achievement) return;
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [achievement, onClose]);

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ x: 400, opacity: 0, scale: 0.8 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: 400, opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed top-4 right-4 z-100 max-w-sm"
          style={{
            background: "rgba(17,24,39,0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(245,158,11,0.5)",
            borderRadius: 16,
            padding: "16px 20px",
            boxShadow:
              "0 0 30px rgba(245,158,11,0.3), 0 20px 60px rgba(0,0,0,0.5)",
          }}
        >
          <div className="flex items-start gap-3">
            <motion.div
              animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl"
            >
              {achievement.icon}
            </motion.div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Trophy size={12} color="#F59E0B" />
                <span
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: "#F59E0B" }}
                >
                  Achievement Unlocked
                </span>
              </div>
              <div className="font-bold text-sm" style={{ color: "#F8FAFC" }}>
                {achievement.title}
              </div>
              <div className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
                {achievement.description}
              </div>
            </div>
            <button
              onClick={onClose}
              style={{ color: "#94A3B8" }}
              className="hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          </div>
          {/* Progress bar */}
          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 4, ease: "linear" }}
            className="absolute bottom-0 left-0 h-0.5 rounded-full origin-left"
            style={{
              background: "linear-gradient(90deg, #F59E0B, #EF4444)",
              width: "100%",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
  color: string;
  driftX: number;
}

interface ParticlesProps {
  count?: number;
}

export default function ParticleBackground({ count = 25 }: ParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  // Generate particles only on the client to avoid SSR/hydration mismatch
  useEffect(() => {
    setParticles(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 8 + Math.random() * 12,
        size: 1 + Math.random() * 2,
        opacity: 0.1 + Math.random() * 0.3,
        color: Math.random() > 0.5 ? "#7C3AED" : "#06B6D4",
        driftX: (Math.random() - 0.5) * 100,
      }))
    );
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* HUD Grid */}
      <div className="absolute inset-0 hud-grid" />

      {/* Particles — only rendered client-side */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            bottom: -10,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 4}px ${p.color}`,
          }}
          animate={{
            y: [0, -950],
            x: [0, p.driftX],
            opacity: [0, p.opacity, p.opacity, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Corner decorations */}
      <div
        className="absolute top-0 left-0 w-32 h-32 opacity-20"
        style={{
          background: "radial-gradient(circle at top left, #7C3AED, transparent)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-64 h-64 opacity-10"
        style={{
          background: "radial-gradient(circle at bottom right, #06B6D4, transparent)",
        }}
      />
    </div>
  );
}

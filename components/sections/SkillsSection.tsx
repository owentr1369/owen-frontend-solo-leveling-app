'use client';
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Edit2, Check, X, TrendingUp, Layers } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Skill, SkillCategory, getSkillTier } from '@/lib/types';

const CATEGORIES: SkillCategory[] = ['Frontend', 'Backend', 'Soft Skills', 'Business & Leadership'];

const CATEGORY_COLORS: Record<SkillCategory, { text: string; bg: string; border: string }> = {
  'Frontend': { text: '#06B6D4', bg: 'rgba(6,182,212,0.1)', border: 'rgba(6,182,212,0.3)' },
  'Backend': { text: '#22C55E', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)' },
  'Soft Skills': { text: '#F59E0B', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)' },
  'Business & Leadership': { text: '#EF4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)' },
};

function SkillCard({ skill, onUpdate }: { skill: Skill; onUpdate: (id: string, level: number) => void }) {
  const [editing, setEditing] = useState(false);
  const [editVal, setEditVal] = useState(skill.level);
  const tier = getSkillTier(skill.level);
  const cat = CATEGORY_COLORS[skill.category];

  const handleSave = () => {
    onUpdate(skill.id, editVal);
    setEditing(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className="rounded-xl p-4 transition-shadow"
      style={{
        background: '#111827',
        border: '1px solid rgba(148,163,184,0.1)',
      }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(124,58,237,0.15)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-semibold text-sm" style={{ color: '#F8FAFC' }}>{skill.name}</div>
          {skill.description && (
            <div className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>{skill.description}</div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: tier.color, background: `${tier.color}20` }}>
            {tier.label}
          </span>
          {!editing ? (
            <button
              onClick={() => { setEditing(true); setEditVal(skill.level); }}
              className="w-6 h-6 rounded-lg flex items-center justify-center transition-colors"
              style={{ background: 'rgba(124,58,237,0.1)', color: '#7C3AED' }}
            >
              <Edit2 size={12} />
            </button>
          ) : (
            <div className="flex gap-1">
              <button onClick={handleSave} className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.2)', color: '#22C55E' }}>
                <Check size={12} />
              </button>
              <button onClick={() => setEditing(false)} className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.2)', color: '#EF4444' }}>
                <X size={12} />
              </button>
            </div>
          )}
        </div>
      </div>

      {editing ? (
        <div className="space-y-2">
          <input
            type="range"
            min={0}
            max={100}
            value={editVal}
            onChange={e => setEditVal(Number(e.target.value))}
            className="w-full accent-purple-600"
          />
          <div className="flex justify-between text-xs" style={{ color: '#94A3B8' }}>
            <span>0</span>
            <span className="font-bold" style={{ color: '#7C3AED' }}>{editVal}</span>
            <span>100</span>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs" style={{ color: '#94A3B8' }}>Mastery</span>
            <span className="text-sm font-bold" style={{ color: tier.color }}>{skill.level}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${skill.level}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${tier.color}80, ${tier.color})` }}
            />
          </div>
        </>
      )}
    </motion.div>
  );
}

export default function SkillsSection() {
  const { state, updateSkill } = useApp();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<SkillCategory | 'All'>('All');
  const [sortBy, setSortBy] = useState<'name' | 'level'>('level');

  const filtered = useMemo(() => {
    return state.skills
      .filter(s => {
        const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
        const matchCat = activeCategory === 'All' || s.category === activeCategory;
        return matchSearch && matchCat;
      })
      .sort((a, b) => {
        if (sortBy === 'level') return b.level - a.level;
        return a.name.localeCompare(b.name);
      });
  }, [state.skills, search, activeCategory, sortBy]);

  const categoryStats = useMemo(() => {
    return CATEGORIES.map(cat => {
      const skills = state.skills.filter(s => s.category === cat);
      const avg = skills.length > 0 ? Math.round(skills.reduce((s, sk) => s + sk.level, 0) / skills.length) : 0;
      return { category: cat, avg, count: skills.length };
    });
  }, [state.skills]);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold" style={{ color: '#F8FAFC' }}>Skills Tree</h2>
        <p className="text-sm mt-1" style={{ color: '#94A3B8' }}>Track and level up your technical & soft skills</p>
      </motion.div>

      {/* Category overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {categoryStats.map((cs, i) => {
          const col = CATEGORY_COLORS[cs.category as SkillCategory];
          return (
            <motion.div
              key={cs.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setActiveCategory(cs.category as SkillCategory)}
              className="rounded-xl p-4 cursor-pointer"
              style={{
                background: activeCategory === cs.category ? col.bg : '#111827',
                border: `1px solid ${activeCategory === cs.category ? col.border : 'rgba(148,163,184,0.1)'}`,
              }}
            >
              <div className="text-xs font-medium mb-2" style={{ color: col.text }}>{cs.category}</div>
              <div className="text-2xl font-black" style={{ color: '#F8FAFC' }}>{cs.avg}<span className="text-sm font-normal" style={{ color: '#94A3B8' }}>%</span></div>
              <div className="text-xs mt-1" style={{ color: '#94A3B8' }}>{cs.count} skills</div>
              <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div className="h-full rounded-full" style={{ width: `${cs.avg}%`, background: col.text }} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Search & filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#94A3B8' }} />
          <input
            className="input-dark pl-9"
            placeholder="Search skills..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy(s => s === 'level' ? 'name' : 'level')}
            className="btn-ghost flex items-center gap-2 px-3"
          >
            <Filter size={14} />
            <span className="text-xs">{sortBy === 'level' ? 'By Level' : 'By Name'}</span>
          </button>
          <button
            onClick={() => setActiveCategory('All')}
            className="btn-ghost px-3"
            style={{ color: activeCategory === 'All' ? '#22D3EE' : '#94A3B8', borderColor: activeCategory === 'All' ? 'rgba(34,211,238,0.4)' : undefined }}
          >
            <span className="text-xs">All</span>
          </button>
        </div>
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => {
          const col = CATEGORY_COLORS[cat];
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(isActive ? 'All' : cat)}
              className="text-xs px-3 py-1.5 rounded-full font-medium transition-all"
              style={{
                background: isActive ? col.bg : 'rgba(148,163,184,0.05)',
                border: `1px solid ${isActive ? col.border : 'rgba(148,163,184,0.1)'}`,
                color: isActive ? col.text : '#94A3B8',
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Skills grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map(skill => (
            <SkillCard key={skill.id} skill={skill} onUpdate={updateSkill} />
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">🔍</div>
          <div style={{ color: '#94A3B8' }}>No skills found matching your search</div>
        </div>
      )}
    </div>
  );
}

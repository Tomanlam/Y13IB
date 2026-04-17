/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Heart, 
  BookOpen, 
  GraduationCap, 
  Languages, 
  ChevronLeft, 
  ChevronUp,
  ChevronDown,
  Plus,
  CheckCircle2, 
  XCircle, 
  Trophy,
  ArrowRight,
  ArrowRightLeft,
  ArrowDown,
  Home,
  RefreshCw,
  Thermometer,
  Github,
  ExternalLink,
  Info,
  Zap,
  LayoutGrid,
  List,
  Eye,
  EyeOff,
  FlaskConical,
  Calculator,
  Atom,
  Variable,
  Dna,
  Beaker,
  Wind,
  Droplets,
  Waves,
  Flame,
  TrendingUp,
  QrCode,
  Layers,
  Activity,
  Box,
  Search
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { units, Unit, Question, Vocab } from './data';

type AppMode = 'splash' | 'dashboard' | 'quiz' | 'quiz-select' | 'revision' | 'vocab' | 'result' | 'user-stats' | 'about' | 'playground' | 'facts';
type QuizSubMode = 'quick' | 'time-attack' | 'marathon';

interface SessionStats {
  [unitId: number]: {
    attemptedQuestions: string[];
    masteredVocab: string[];
  }
}

const formatFormula = (formula: string) => {
  return formula
    .replace(/(\d+)([+-])/g, '<sup>$1$2</sup>') // Match 2+, 3- etc
    .replace(/([+-])(?!\d)/g, '<sup>$1</sup>') // Match solitary + or -
    .replace(/([a-zA-Z)])(\d+)(?!<sup>)/g, '$1<sub>$2</sub>'); // Match subscripts, but only if not already part of a superscript
};

const ELEMENTS_DATA = [
  { z: 1, symbol: 'H', name: 'Hydrogen', block: 's', period: 1, group: 1 },
  { z: 2, symbol: 'He', name: 'Helium', block: 's', period: 1, group: 18 },
  { z: 3, symbol: 'Li', name: 'Lithium', block: 's', period: 2, group: 1 },
  { z: 4, symbol: 'Be', name: 'Beryllium', block: 's', period: 2, group: 2 },
  { z: 5, symbol: 'B', name: 'Boron', block: 'p', period: 2, group: 13 },
  { z: 6, symbol: 'C', name: 'Carbon', block: 'p', period: 2, group: 14 },
  { z: 7, symbol: 'N', name: 'Nitrogen', block: 'p', period: 2, group: 15 },
  { z: 8, symbol: 'O', name: 'Oxygen', block: 'p', period: 2, group: 16 },
  { z: 9, symbol: 'F', name: 'Fluorine', block: 'p', period: 2, group: 17 },
  { z: 10, symbol: 'Ne', name: 'Neon', block: 'p', period: 2, group: 18 },
  { z: 11, symbol: 'Na', name: 'Sodium', block: 's', period: 3, group: 1 },
  { z: 12, symbol: 'Mg', name: 'Magnesium', block: 's', period: 3, group: 2 },
  { z: 13, symbol: 'Al', name: 'Aluminium', block: 'p', period: 3, group: 13 },
  { z: 14, symbol: 'Si', name: 'Silicon', block: 'p', period: 3, group: 14 },
  { z: 15, symbol: 'P', name: 'Phosphorus', block: 'p', period: 3, group: 15 },
  { z: 16, symbol: 'S', name: 'Sulfur', block: 'p', period: 3, group: 16 },
  { z: 17, symbol: 'Cl', name: 'Chlorine', block: 'p', period: 3, group: 17 },
  { z: 18, symbol: 'Ar', name: 'Argon', block: 'p', period: 3, group: 18 },
  { z: 19, symbol: 'K', name: 'Potassium', block: 's', period: 4, group: 1 },
  { z: 20, symbol: 'Ca', name: 'Calcium', block: 's', period: 4, group: 2 },
  { z: 21, symbol: 'Sc', name: 'Scandium', block: 'd', period: 4, group: 3 },
  { z: 22, symbol: 'Ti', name: 'Titanium', block: 'd', period: 4, group: 4 },
  { z: 23, symbol: 'V', name: 'Vanadium', block: 'd', period: 4, group: 5 },
  { z: 24, symbol: 'Cr', name: 'Chromium', block: 'd', period: 4, group: 6 },
  { z: 25, symbol: 'Mn', name: 'Manganese', block: 'd', period: 4, group: 7 },
  { z: 26, symbol: 'Fe', name: 'Iron', block: 'd', period: 4, group: 8 },
  { z: 27, symbol: 'Co', name: 'Cobalt', block: 'd', period: 4, group: 9 },
  { z: 28, symbol: 'Ni', name: 'Nickel', block: 'd', period: 4, group: 10 },
  { z: 29, symbol: 'Cu', name: 'Copper', block: 'd', period: 4, group: 11 },
  { z: 30, symbol: 'Zn', name: 'Zinc', block: 'd', period: 4, group: 12 },
];

const ORBITAL_GROUPS = [
  { id: '1s', label: '1s', boxes: 1, block: 's', energy: 1 },
  { id: '2s', label: '2s', boxes: 1, block: 's', energy: 2 },
  { id: '2p', label: '2p', boxes: 3, block: 'p', energy: 3 },
  { id: '3s', label: '3s', boxes: 1, block: 's', energy: 4 },
  { id: '3p', label: '3p', boxes: 3, block: 'p', energy: 5 },
  { id: '4s', label: '4s', boxes: 1, block: 's', energy: 6 },
  { id: '3d', label: '3d', boxes: 5, block: 'd', energy: 7 },
];

const BLOCK_COLORS = {
  s: { bg: 'bg-rose-500', text: 'text-rose-600', light: 'bg-rose-100', border: 'border-rose-500/50', glow: 'bg-rose-500/10', accent: 'text-rose-400', muted: 'text-rose-300', bgLight: 'bg-rose-50' },
  p: { bg: 'bg-blue-500', text: 'text-blue-600', light: 'bg-blue-100', border: 'border-blue-500/50', glow: 'bg-blue-500/10', accent: 'text-blue-400', muted: 'text-blue-300', bgLight: 'bg-blue-50' },
  d: { bg: 'bg-amber-500', text: 'text-amber-600', light: 'bg-amber-100', border: 'border-amber-500/50', glow: 'bg-amber-500/10', accent: 'text-amber-400', muted: 'text-amber-300', bgLight: 'bg-amber-50' },
  f: { bg: 'bg-emerald-500', text: 'text-emerald-600', light: 'bg-emerald-100', border: 'border-emerald-500/50', glow: 'bg-emerald-500/10', accent: 'text-emerald-400', muted: 'text-emerald-300', bgLight: 'bg-emerald-50' }
};

const ElectronicConfiguration = () => {
  const [z, setZ] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
  const currentElement = ELEMENTS_DATA.find(e => e.z === z) || ELEMENTS_DATA[0];

  const filteredElements = ELEMENTS_DATA.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.z.toString() === searchQuery
  );
  
  const getDistribution = (atomicNumber: number) => {
    const dist: Record<string, number> = {};
    let remaining = atomicNumber;

    // Exceptions
    if (atomicNumber === 24) { // Cr: [Ar] 4s1 3d5
      dist['1s'] = 2; dist['2s'] = 2; dist['2p'] = 6; dist['3s'] = 2; dist['3p'] = 6;
      dist['4s'] = 1; dist['3d'] = 5;
      return dist;
    }
    if (atomicNumber === 29) { // Cu: [Ar] 4s1 3d10
      dist['1s'] = 2; dist['2s'] = 2; dist['2p'] = 6; dist['3s'] = 2; dist['3p'] = 6;
      dist['4s'] = 1; dist['3d'] = 10;
      return dist;
    }

    for (const og of ORBITAL_GROUPS) {
      const cap = og.boxes * 2;
      const fill = Math.min(remaining, cap);
      dist[og.id] = fill;
      remaining -= fill;
      if (remaining <= 0) break;
    }
    return dist;
  };

  const distribution = getDistribution(z);

  const getBoxElectrons = (orbitalId: string, boxIndex: number, totalElectrons: number) => {
    const og = ORBITAL_GROUPS.find(o => o.id === orbitalId)!;
    const spins: number[] = [];
    if (totalElectrons > boxIndex) spins.push(1);
    if (totalElectrons > og.boxes + boxIndex) spins.push(-1);
    return spins;
  };

  const getCondensedConfig = () => {
    const full = ORBITAL_GROUPS
      .filter(og => distribution[og.id] > 0)
      .map(og => `${og.label}${distribution[og.id]}`)
      .join(' ');
    if (z <= 2) return full;
    if (z <= 10) return `[He] ${ORBITAL_GROUPS.slice(1).filter(og => distribution[og.id] > 0).map(og => `${og.label}${distribution[og.id]}`).join(' ')}`;
    if (z <= 18) return `[Ne] ${ORBITAL_GROUPS.slice(3).filter(og => distribution[og.id] > 0).map(og => `${og.label}${distribution[og.id]}`).join(' ')}`;
    return `[Ar] ${ORBITAL_GROUPS.slice(5).filter(og => distribution[og.id] > 0).map(og => `${og.label}${distribution[og.id]}`).join(' ')}`;
  };

  const currentColors = BLOCK_COLORS[currentElement.block as keyof typeof BLOCK_COLORS];

  return (
    <div className="space-y-8">
      {/* Search & Selector Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Element (Z={z})</label>
          <button 
            onClick={() => setShowSearch(!showSearch)}
            className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full text-[10px] font-black text-gray-600 uppercase tracking-widest hover:bg-emerald-100 hover:text-emerald-600 transition-all"
          >
            <Search size={12} />
            {showSearch ? 'Close Search' : 'Search by Name'}
          </button>
        </div>

        {showSearch && (
          <div className="relative">
            <input 
              type="text"
              autoFocus
              placeholder="Search elements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-3 text-sm font-bold focus:border-emerald-400 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-100 rounded-2xl shadow-xl max-h-60 overflow-y-auto z-30 p-2 space-y-1">
                {filteredElements.length > 0 ? (
                  filteredElements.map(e => (
                    <button
                      key={e.z}
                      onClick={() => {
                        setZ(e.z);
                        setSearchQuery('');
                        setShowSearch(false);
                      }}
                      className="w-full flex items-center justify-between p-3 hover:bg-emerald-50 rounded-xl transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg text-[10px] font-black text-gray-500">{e.z}</span>
                        <div>
                          <p className="font-black text-gray-800 text-sm leading-none">{e.name}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{e.block}-block</p>
                        </div>
                      </div>
                      <span className="text-sm font-black text-emerald-500">{e.symbol}</span>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-400 font-bold text-xs italic">No matching elements</div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-[2rem] border-2 border-gray-100">
          <input 
            type="range" 
            min="1" 
            max="30" 
            value={z} 
            onChange={(e) => setZ(parseInt(e.target.value))}
            className="flex-1 h-2 bg-emerald-100 rounded-full appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="w-14 h-14 bg-white border-2 border-emerald-200 rounded-2xl flex items-center justify-center shadow-sm">
            <span className="text-2xl font-black text-emerald-600">{z}</span>
          </div>
        </div>
      </div>

      {/* Periodic Table Mini-Map */}
      <div className="bg-white p-6 rounded-[2rem] border-2 border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Element (Z=1 to 30)</h3>
          <div className="flex gap-4">
            {['s', 'p', 'd'].map(b => (
              <div key={b} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${BLOCK_COLORS[b as keyof typeof BLOCK_COLORS].bg}`} />
                <span className="text-[8px] font-black text-gray-400 uppercase">{b} block</span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-[repeat(18,minmax(0,1fr))] gap-1">
          {Array(4).fill(null).map((_, rIdx) => (
            Array(18).fill(null).map((_, cIdx) => {
              const el = ELEMENTS_DATA.find(e => e.period === rIdx + 1 && e.group === cIdx + 1);
              if (!el) return <div key={`${rIdx}-${cIdx}`} className="aspect-square" />;
              const isSelected = el.z === z;
              const colors = BLOCK_COLORS[el.block as keyof typeof BLOCK_COLORS];
              return (
                <button
                  key={el.z}
                  onClick={() => setZ(el.z)}
                  className={`aspect-square rounded-sm flex flex-col items-center justify-center transition-all duration-200
                    ${isSelected 
                      ? `${colors.bg} text-white shadow-lg scale-110 z-10 ring-2 ring-offset-1 ring-gray-800`
                      : `bg-gray-50 text-gray-400 hover:bg-white hover:shadow-md hover:scale-105 hover:z-10 border border-gray-100`}
                  `}
                >
                  <span className="text-[6px] font-black leading-none">{el.symbol}</span>
                  <span className="text-[4px] font-bold opacity-60 leading-none mt-0.5">{el.z}</span>
                </button>
              );
            })
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Orbital Energy Ladder */}
        <div className="lg:col-span-7 bg-gray-900 p-8 rounded-[2.5rem] border-4 border-gray-800 shadow-2xl relative overflow-hidden">
          <div className="absolute left-4 top-8 bottom-8 w-[1px] bg-gray-800 flex flex-col justify-between items-center py-4">
            <ChevronUp size={12} className="text-gray-600" />
            <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest [writing-mode:vertical-lr] rotate-180">Energy Level</span>
            <div className="w-2 h-[1px] bg-gray-800" />
          </div>

          <div className="ml-8 space-y-6">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Orbital Energy Diagram</h4>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Real-time distribution</span>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-6">
              {ORBITAL_GROUPS.map((og) => {
                const fill = distribution[og.id] || 0;
                const colors = BLOCK_COLORS[og.block as keyof typeof BLOCK_COLORS];
                const isActive = fill > 0;

                return (
                  <motion.div 
                    key={og.id}
                    initial={false}
                    animate={{ opacity: isActive ? 1 : 0.3, x: isActive ? 0 : -5 }}
                    className="flex items-center gap-6"
                  >
                    <div className="w-10 text-right">
                      <span className={`text-sm font-black font-mono ${isActive ? 'text-white' : 'text-gray-700'}`}>{og.label}</span>
                    </div>
                    <div className="flex gap-2">
                      {[...Array(og.boxes)].map((_, bIdx) => {
                        const spins = getBoxElectrons(og.id, bIdx, fill);
                        return (
                          <div 
                            key={bIdx} 
                            className={`w-12 h-12 border-2 rounded-xl flex items-center justify-center relative transition-all duration-500
                              ${isActive ? `${colors.border} bg-gray-800/50 shadow-[0_0_15px_rgba(0,0,0,0.2)]` : 'border-gray-800 bg-transparent'}
                            `}
                          >
                            <AnimatePresence mode="popLayout">
                              {spins.includes(1) && (
                                <motion.div 
                                  key="up"
                                  initial={{ y: 10, opacity: 0, scale: 0 }}
                                  animate={{ y: 0, opacity: 1, scale: 1 }}
                                  exit={{ y: 10, opacity: 0, scale: 0 }}
                                  className={`absolute left-2 ${colors.accent}`}
                                >
                                  <ChevronUp size={24} strokeWidth={4} />
                                </motion.div>
                              )}
                              {spins.includes(-1) && (
                                <motion.div 
                                  key="down"
                                  initial={{ y: -10, opacity: 0, scale: 0 }}
                                  animate={{ y: 0, opacity: 1, scale: 1 }}
                                  exit={{ y: -10, opacity: 0, scale: 0 }}
                                  className={`absolute right-2 ${colors.accent}`}
                                >
                                  <ChevronDown size={24} strokeWidth={4} />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Info & Config Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border-2 border-gray-100 shadow-sm space-y-8">
            <div className="flex items-center gap-6">
              <div className={`w-20 h-20 rounded-[2rem] ${currentColors.light} flex items-center justify-center ${currentColors.text} font-black text-3xl shadow-inner border-2 ${currentColors.border}`}>
                {currentElement.symbol}
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-800 tracking-tight lowercase">{currentElement.name}</h3>
                <div className="flex gap-3 mt-1">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Z = {z}</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${currentColors.light} ${currentColors.text} uppercase tracking-widest`}>{currentElement.block} block</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Full Configuration</p>
                <div className="flex flex-wrap gap-2">
                  {ORBITAL_GROUPS.filter(og => distribution[og.id] > 0).map(og => {
                    const colors = BLOCK_COLORS[og.block as keyof typeof BLOCK_COLORS];
                    return (
                      <div key={og.id} className={`px-3 py-1.5 rounded-xl ${colors.bgLight} ${colors.text} font-mono font-black text-sm border ${colors.border}`}>
                        {og.label}<sup>{distribution[og.id]}</sup>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Condensed Configuration</p>
                <div className="p-5 bg-gray-50 rounded-2xl border-2 border-gray-100 font-mono font-black text-lg text-gray-800 shadow-inner">
                  {getCondensedConfig().split(' ').map((part, i) => {
                    if (part.startsWith('[')) return <span key={i} className="text-gray-400 mr-2">{part}</span>;
                    const match = part.match(/(\d[spd])(\d+)/);
                    if (match) {
                      const og = ORBITAL_GROUPS.find(o => o.label === match[1])!;
                      const colors = BLOCK_COLORS[og.block as keyof typeof BLOCK_COLORS];
                      return (
                        <span key={i} className={`${colors.text} mr-2`}>
                          {match[1]}<sup>{match[2]}</sup>
                        </span>
                      );
                    }
                    return <span key={i} className="mr-2">{part}</span>;
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Zap size={60} />
            </div>
            <h5 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-70">Key Principles</h5>
            <div className="space-y-4">
              {[
                { name: 'Aufbau', desc: 'Fill lowest energy first' },
                { name: 'Pauli', desc: 'Opposite spins in same orbital' },
                { name: 'Hund', desc: 'Fill singly before pairing' }
              ].map(p => (
                <div key={p.name} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-300" />
                  <p className="text-xs font-bold"><span className="text-indigo-200 uppercase tracking-widest mr-2">{p.name}:</span> {p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [mode, setMode] = useState<AppMode>('splash');
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [quizProgress, setQuizProgress] = useState(0);
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [hearts, setHearts] = useState(5);
  const [quizSubMode, setQuizSubMode] = useState<QuizSubMode>('quick');
  const [timeLeft, setTimeLeft] = useState(30);
  const [isY13Open, setIsY13Open] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'structure' | 'reactivity'>('structure');
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [sessionStats, setSessionStats] = useState<SessionStats>({});
  const [error, setError] = useState<Error | null>(null);
  const [s11Temp, setS11Temp] = useState(25); // Celsius
  const [s12Z, setS12Z] = useState(6); // Carbon
  const [s12A, setS12A] = useState(12);

  const allConcepts = useMemo(() => units.flatMap(unit => unit.concepts), []);
  const [randomConcept, setRandomConcept] = useState(() => {
    if (allConcepts.length > 0) {
      return allConcepts[Math.floor(Math.random() * allConcepts.length)];
    }
    return null;
  });

  useEffect(() => {
    if (!randomConcept && allConcepts.length > 0) {
      setRandomConcept(allConcepts[Math.floor(Math.random() * allConcepts.length)]);
    }
  }, [allConcepts, randomConcept]);

  const refreshConcept = () => {
    let nextConcept;
    do {
      nextConcept = allConcepts[Math.floor(Math.random() * allConcepts.length)];
    } while (nextConcept === randomConcept && allConcepts.length > 1);
    setRandomConcept(nextConcept);
  };

  // Splash screen timeout
  useEffect(() => {
    if (mode === 'splash') {
      const timer = setTimeout(() => setMode('dashboard'), 3000);
      return () => clearTimeout(timer);
    }
  }, [mode]);

  // Time Attack timer
  useEffect(() => {
    if (mode === 'quiz' && quizSubMode === 'time-attack' && timeLeft > 0 && !isAnswerChecked) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setMode('result');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [mode, quizSubMode, timeLeft, isAnswerChecked]);

  const startQuiz = (unit: Unit) => {
    if (!unit) {
      console.error("Attempted to start quiz with null unit");
      return;
    }
    setSelectedUnit(unit);
    setMode('quiz-select');
    // Scroll to top
    window.scrollTo(0, 0);
  };

  const startQuizWithMode = (unit: Unit | null, subMode: QuizSubMode) => {
    if (!unit) {
      console.error("Critical: startQuizWithMode called without unit");
      setMode('dashboard');
      return;
    }
    
    setSelectedUnit(unit);
    setQuizSubMode(subMode);
    
    // Clear previous state to ensure fresh start
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setHearts(5);
    setQuizProgress(0);
    setTimeLeft(30);

    const shuffled = [...unit.questions].sort(() => 0.5 - Math.random());
    
    if (subMode === 'quick') {
      setQuizQuestions(shuffled.slice(0, 10));
    } else if (subMode === 'time-attack') {
      setQuizQuestions(shuffled);
      setTimeLeft(30);
    } else {
      setQuizQuestions(shuffled);
    }

    setMode('quiz');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const startRevision = (unit: Unit) => {
    setSelectedUnit(unit);
    setMode('revision');
  };

  const startVocab = (unit: Unit) => {
    setSelectedUnit(unit);
    setMode('vocab');
  };

  const handleOptionSelect = (option: string) => {
    if (!isAnswerChecked) {
      setSelectedOption(option);
    }
  };

  const checkAnswer = () => {
    if (selectedOption && selectedUnit) {
      setIsAnswerChecked(true);
      
      // Track attempted question
      const qId = quizQuestions[currentQuestionIndex].id;
      setSessionStats(prev => {
        const unitStats = prev[selectedUnit.id] || { attemptedQuestions: [], masteredVocab: [] };
        if (!unitStats.attemptedQuestions.includes(qId)) {
          return {
            ...prev,
            [selectedUnit.id]: {
              ...unitStats,
              attemptedQuestions: [...unitStats.attemptedQuestions, qId]
            }
          };
        }
        return prev;
      });

      if (selectedOption === quizQuestions[currentQuestionIndex].correctAnswer) {
        setScore(prev => prev + 1);
      } else {
        setHearts(prev => Math.max(0, prev - 1));
      }
    }
  };

  const nextQuestion = () => {
    if (hearts <= 0) {
      setMode('result');
      return;
    }
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < quizQuestions.length) {
      setCurrentQuestionIndex(nextIndex);
      setSelectedOption(null);
      setIsAnswerChecked(false);
      setQuizProgress(((nextIndex) / quizQuestions.length) * 100);
    } else {
      if (quizSubMode === 'time-attack' || quizSubMode === 'marathon') {
        // Shuffle again and continue for time-attack or marathon if we run out of questions
        const reshuffled = [...selectedUnit!.questions].sort(() => 0.5 - Math.random());
        setQuizQuestions(prev => [...prev, ...reshuffled]);
        setCurrentQuestionIndex(nextIndex);
        setSelectedOption(null);
        setIsAnswerChecked(false);
      } else {
        setQuizProgress(100);
        setMode('result');
      }
    }
  };

  // Components
  const SplashScreen = () => (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="text-red-500 mb-8"
      >
        <Heart size={120} fill="currentColor" />
      </motion.div>
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-gray-800"
      >
        Made with love by Toman
      </motion.h1>
    </div>
  );

  const Y13Splash = ({ onClose }: { onClose: () => void }) => {
    const [activeEmojis, setActiveEmojis] = useState<{ id: number; emoji: string; x: number; y: number; size: number }[]>([]);
    
    const spawnEmoji = () => {
      const facialEmojis = ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩", "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🤗", "🤔", "🤭", "🤫", "🤥", "😶", "😐", "😑", "😬", "🙄", "😯", "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😵", "🤐", "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠", "😈", "👿", "👹", "👺", "🤡", "💩", "👻", "💀", "☠️", "👽", "👾", "🤖", "🎃", "😺", "😸", "😻", "😼", "😽", "🙀", "😿", "😾"];
      const id = Date.now();
      const newEmoji = {
        id,
        emoji: facialEmojis[Math.floor(Math.random() * facialEmojis.length)],
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
        size: Math.random() * 60 + 40,
      };
      setActiveEmojis(prev => [...prev, newEmoji]);
      setTimeout(() => {
        setActiveEmojis(prev => prev.filter(e => e.id !== id));
      }, 1000);
    };

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.05
        }
      }
    };

    const itemVariants = {
      hidden: { opacity: 0, x: -20 },
      visible: { opacity: 1, x: 0 }
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-orange-500 flex flex-col items-center justify-center p-8 overflow-y-auto"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors z-[120]"
        >
          <XCircle size={40} />
        </button>

        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white text-4xl font-black uppercase tracking-tighter mb-12 text-center"
        >
          Class of 2025-26
        </motion.h2>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-4xl w-full"
        >
          {[
            "Luke", "Ryan", "Gerry", "Annie"
          ].map((name) => (
            <motion.button
              key={name}
              variants={itemVariants}
              onClick={(e) => {
                e.stopPropagation();
                spawnEmoji();
              }}
              className="text-white text-2xl font-bold uppercase tracking-wide hover:scale-110 transition-transform text-center outline-none"
            >
              {name}
            </motion.button>
          ))}
        </motion.div>

        <AnimatePresence>
          {activeEmojis.map(emoji => (
            <motion.div
              key={emoji.id}
              initial={{ opacity: 0, scale: 0, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.5, y: -50 }}
              className="fixed pointer-events-none z-[110]"
              style={{ 
                left: `${emoji.x}%`, 
                top: `${emoji.y}%`, 
                fontSize: `${emoji.size}px` 
              }}
            >
              {emoji.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    );
  };

  const Bubble = ({ i, rate }: { i: number, rate: number, key?: string | number }) => {
    return (
      <motion.div
        initial={{ y: 150, x: 20 + (i * 15) % 80, opacity: 0, scale: 0.5 }}
        animate={{ 
          y: [150, 40], 
          x: 20 + (i * 15) % 80 + Math.sin(i) * 10,
          opacity: [0, 1, 0],
          scale: [0.5, 1, 0.8]
        }}
        transition={{ 
          duration: 2 / rate, 
          repeat: Infinity, 
          delay: i * (0.5 / rate),
          ease: "linear"
        }}
        className="absolute w-2 h-2 bg-white/60 border border-white/80 rounded-full z-0"
      />
    );
  };

  const AcidMolecule = ({ i, active, type }: { i: number, active: boolean, type: 'strong' | 'weak', key?: string | number }) => {
    const delay = i * 0.3;
    // For strong acid, all dissociate. For weak, only the first one dissociates.
    const isDissociated = type === 'strong' || (type === 'weak' && i === 0);
    
    return (
      <motion.div
        initial={{ y: -40, x: 20 + i * 25 }}
        animate={active ? {
          y: 100 + (i % 3) * 15,
          x: 20 + i * 25 + (Math.random() - 0.5) * 10,
        } : { y: -40, x: 20 + i * 25 }}
        transition={{ duration: 1, delay, ease: "easeOut" }}
        className="absolute"
      >
        <div className="relative">
          {/* Conjugate Base (Big White Dot) */}
          <motion.div 
            animate={active && isDissociated ? { x: -8, y: -4, rotate: 45 } : { x: 0, y: 0, rotate: 0 }}
            transition={{ delay: delay + 0.8, type: "spring", stiffness: 100 }}
            className="w-5 h-5 bg-white border-2 border-gray-300 rounded-full shadow-sm flex items-center justify-center z-10"
          >
            <span className="text-[5px] font-black text-gray-400 leading-none">
              {type === 'strong' ? 'Cl⁻' : 'CH₃COO⁻'}
            </span>
          </motion.div>

          {/* H+ Ion (Small Red Dot) */}
          <motion.div 
            animate={active && isDissociated ? { x: 12, y: 8 } : { x: 8, y: -4 }}
            transition={{ delay: delay + 0.8, type: "spring", stiffness: 100 }}
            className="absolute w-2.5 h-2.5 bg-rose-500 rounded-full shadow-sm flex items-center justify-center z-20 border border-rose-600"
          >
             <span className="text-[4px] font-black text-white leading-none">H⁺</span>
          </motion.div>
          
          {/* Connection Line (only visible when not dissociated) */}
          {!active && (
            <div className="absolute top-1 left-3 w-0.5 h-3 bg-gray-300 -rotate-45 -z-10" />
          )}
        </div>
      </motion.div>
    );
  };

  const SimpleSubstanceDrawing = () => (
    <div className="relative w-full h-24 bg-sky-50/30 rounded-xl overflow-hidden border border-sky-100">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ 
            x: [Math.random() * 80, Math.random() * 80],
            y: [Math.random() * 60, Math.random() * 60],
            rotate: [0, 360]
          }}
          transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, repeatType: "reverse" }}
          className="absolute flex"
          style={{ left: `${10 + i * 15}%`, top: `${20 + (i % 3) * 20}%` }}
        >
          <div className="w-2.5 h-2.5 bg-sky-400/40 rounded-full" />
          <div className="w-2.5 h-2.5 bg-sky-400/40 rounded-full -ml-1" />
        </motion.div>
      ))}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[8px] font-black text-sky-400 uppercase tracking-widest">Loosely Packed</div>
    </div>
  );

  const GiantSubstanceDrawing = () => (
    <div className="relative w-full h-24 bg-rose-50/30 rounded-xl overflow-hidden border border-rose-100">
      <div className="grid grid-cols-6 grid-rows-3 gap-1 p-2 h-full">
        {[...Array(18)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05 }}
            className="w-full h-full bg-rose-400/40 rounded-sm"
          />
        ))}
      </div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[8px] font-black text-rose-400 uppercase tracking-widest">Tightly Packed</div>
    </div>
  );

  const SimpleAtomDrawing = () => (
    <div className="relative w-full h-24 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ 
            x: [Math.random() * 10, -Math.random() * 10, Math.random() * 10],
            y: [Math.random() * 10, -Math.random() * 10, Math.random() * 10]
          }}
          transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, ease: "linear" }}
          className="absolute w-3 h-3 bg-blue-400 rounded-full shadow-sm"
          style={{ left: `${20 + (i % 3) * 30}%`, top: `${20 + Math.floor(i / 3) * 40}%` }}
        />
      ))}
    </div>
  );

  const SimpleMoleculeDrawing = () => (
    <div className="relative w-full h-24 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ 
            x: [Math.random() * 15, -Math.random() * 15],
            y: [Math.random() * 15, -Math.random() * 15],
            rotate: [0, 360]
          }}
          transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, ease: "linear" }}
          className="absolute flex items-center"
          style={{ left: `${15 + (i % 3) * 30}%`, top: `${20 + Math.floor(i / 3) * 40}%` }}
        >
          <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full shadow-sm border border-emerald-500" />
          <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full shadow-sm border border-emerald-500 -ml-1" />
        </motion.div>
      ))}
    </div>
  );

  const BondPolarityDrawing = ({ type }: { type: 'non-polar' | 'polar' | 'ionic' }) => {
    const config = {
      'non-polar': {
        leftAtom: 'Cl',
        rightAtom: 'Cl',
        leftColor: 'bg-emerald-400',
        rightColor: 'bg-emerald-400',
        leftSize: 'w-14 h-14',
        rightSize: 'w-14 h-14',
        cloudShape: 'rounded-[100px]',
        cloudWidth: 'w-40',
        cloudOffset: 'left-1/2 -translate-x-1/2',
        deltaLeft: null,
        deltaRight: null,
        label: 'Cl₂'
      },
      'polar': {
        leftAtom: 'H',
        rightAtom: 'Cl',
        leftColor: 'bg-blue-400',
        rightColor: 'bg-emerald-400',
        leftSize: 'w-8 h-8',
        rightSize: 'w-16 h-16',
        cloudShape: 'rounded-l-[40px] rounded-r-[100px]',
        cloudWidth: 'w-36',
        cloudOffset: 'left-[45%] -translate-x-1/2',
        deltaLeft: 'δ+',
        deltaRight: 'δ-',
        label: 'HCl'
      },
      'ionic': {
        leftAtom: 'Na⁺',
        rightAtom: 'Cl⁻',
        leftColor: 'bg-amber-400',
        rightColor: 'bg-emerald-500',
        leftSize: 'w-8 h-8',
        rightSize: 'w-18 h-18',
        cloudShape: 'hidden',
        cloudWidth: 'w-0',
        cloudOffset: '',
        deltaLeft: '+',
        deltaRight: '-',
        label: 'NaCl'
      }
    };

    const current = config[type];

    return (
      <div className="relative w-full h-40 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center">
        {/* Electron Cloud (for covalent) */}
        {type !== 'ionic' && (
          <motion.div 
            layoutId="electron-cloud"
            className={`absolute h-20 bg-indigo-500/10 border-2 border-indigo-500/20 blur-sm ${current.cloudShape} ${current.cloudWidth} ${current.cloudOffset}`}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        )}

        <div className="relative flex items-center gap-4 z-10">
          {/* Left Atom */}
          <div className="flex flex-col items-center gap-1">
            {current.deltaLeft && (
              <span className="text-[10px] font-black text-indigo-600 mb-1">{current.deltaLeft}</span>
            )}
            <motion.div 
              layoutId="left-atom"
              className={`${current.leftSize} ${current.leftColor} rounded-full flex items-center justify-center shadow-lg border-2 border-white/50`}
            >
              <span className="text-white font-black text-[10px]">{current.leftAtom}</span>
            </motion.div>
          </div>

          {/* Bond / Transfer Arrow */}
          {type === 'ionic' ? (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col items-center"
            >
              <div className="text-[8px] font-black text-amber-600 uppercase mb-1">Transfer</div>
              <div className="w-10 h-0.5 bg-amber-300 relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 border-t-2 border-r-2 border-amber-300 rotate-45" />
              </div>
            </motion.div>
          ) : (
            <div className="w-6 h-0.5 bg-indigo-200/50" />
          )}

          {/* Right Atom */}
          <div className="flex flex-col items-center gap-1">
            {current.deltaRight && (
              <span className="text-[10px] font-black text-indigo-600 mb-1">{current.deltaRight}</span>
            )}
            <motion.div 
              layoutId="right-atom"
              className={`${current.rightSize} ${current.rightColor} rounded-full flex items-center justify-center shadow-lg border-2 border-white/50`}
            >
              <span className="text-white font-black text-[10px]">{current.rightAtom}</span>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-3 right-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
          {current.label}
        </div>
      </div>
    );
  };

  const SigmaPiBondDrawing = ({ type, step }: { type: 'sigma' | 'pi', step: 'before' | 'after' }) => {
    return (
      <div className="relative w-full h-48 bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 flex items-center justify-center">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        
        <div className="relative flex items-center justify-center w-full h-full">
          {type === 'sigma' ? (
            <div className="flex items-center gap-12">
              {/* Sigma Bond: Axial Overlap */}
              <motion.div 
                animate={{ x: step === 'after' ? 25 : 0 }}
                className="relative"
              >
                <div className="w-16 h-8 bg-indigo-500/40 border-2 border-indigo-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-black text-[8px]">s-orbital</span>
                </div>
              </motion.div>
              
              <motion.div 
                animate={{ x: step === 'after' ? -25 : 0 }}
                className="relative"
              >
                <div className="w-16 h-8 bg-indigo-500/40 border-2 border-indigo-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-black text-[8px]">s-orbital</span>
                </div>
              </motion.div>

              {step === 'after' && (
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-12 h-12 bg-indigo-400/60 rounded-full blur-sm border-2 border-indigo-300" />
                  <div className="absolute text-white font-black text-xs">σ</div>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-16">
              {/* Pi Bond: Sideways Overlap */}
              <motion.div 
                animate={{ x: step === 'after' ? 30 : 0 }}
                className="flex flex-col gap-1"
              >
                <div className="w-6 h-12 bg-rose-500/40 border-2 border-rose-400 rounded-full" />
                <div className="w-6 h-12 bg-rose-500/40 border-2 border-rose-400 rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full" />
              </motion.div>

              <motion.div 
                animate={{ x: step === 'after' ? -30 : 0 }}
                className="flex flex-col gap-1"
              >
                <div className="w-6 h-12 bg-rose-500/40 border-2 border-rose-400 rounded-full" />
                <div className="w-6 h-12 bg-rose-500/40 border-2 border-rose-400 rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full" />
              </motion.div>

              {step === 'after' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-8"
                >
                  <div className="w-32 h-6 bg-rose-400/40 rounded-full blur-sm border-t-2 border-rose-300" />
                  <div className="w-32 h-6 bg-rose-400/40 rounded-full blur-sm border-b-2 border-rose-300" />
                  <div className="absolute text-white font-black text-xs">π</div>
                </motion.div>
              )}
            </div>
          )}
        </div>

        <div className="absolute top-4 left-4 flex flex-col">
          <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Overlap Type</span>
          <span className="text-xs font-black text-indigo-400">{type === 'sigma' ? 'Axial (Head-on)' : 'Sideways (Parallel)'}</span>
        </div>
      </div>
    );
  };

  const VSEPRDrawing = ({ domains, lonePairs }: { domains: number, lonePairs: number }) => {
    const [rotation, setRotation] = useState(0);

    useEffect(() => {
      let frame: number;
      const animate = () => {
        setRotation(prev => (prev + 0.005) % (Math.PI * 2));
        frame = requestAnimationFrame(animate);
      };
      frame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(frame);
    }, []);

    const getVectors = (total: number) => {
      switch (total) {
        case 2: return [[0, 1, 0], [0, -1, 0]];
        case 3: return [[0, 1, 0], [0.866, -0.5, 0], [-0.866, -0.5, 0]];
        case 4: return [[0, 1, 0], [0.943, -0.333, 0], [-0.471, -0.333, 0.816], [-0.471, -0.333, -0.816]];
        case 5: return [[0, 1, 0], [0, -1, 0], [1, 0, 0], [-0.5, 0, 0.866], [-0.5, 0, -0.866]];
        case 6: return [[0, 1, 0], [0, -1, 0], [1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1]];
        default: return [];
      }
    };

    const vectors = getVectors(domains);
    const bondingCount = domains - lonePairs;

    const projected = vectors.map((v, i) => {
      let x = v[0], y = v[1], z = v[2];
      const cosY = Math.cos(rotation);
      const sinY = Math.sin(rotation);
      const x1 = x * cosY + z * sinY;
      const z1 = -x * sinY + z * cosY;
      const cosX = Math.cos(0.5);
      const sinX = Math.sin(0.5);
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;

      return {
        x: x1 * 70,
        y: -y2 * 70,
        z: z2,
        scale: 0.8 + (z2 + 1) * 0.2,
        isLonePair: i >= bondingCount
      };
    });

    const sorted = [...projected].sort((a, b) => a.z - b.z);

    return (
      <div className="relative w-full h-64 bg-gray-900 rounded-3xl overflow-hidden border-2 border-gray-800 flex items-center justify-center">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        
        <svg viewBox="0 0 256 256" className="absolute inset-0 w-full h-full pointer-events-none">
          <g transform="translate(128, 128)">
            {projected.map((p, i) => {
              if (p.isLonePair) return null;
              return (
                <line 
                  key={i}
                  x1="0" y1="0" x2={p.x} y2={p.y}
                  stroke="url(#bondGradient)"
                  strokeWidth={4 * p.scale}
                  strokeLinecap="round"
                  opacity={0.4 + (p.z + 1) * 0.3}
                />
              );
            })}
          </g>
          <defs>
            <linearGradient id="bondGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#4b5563" />
            </linearGradient>
          </defs>
        </svg>

        <div className="relative w-full h-full flex items-center justify-center">
          <div className="w-10 h-10 bg-indigo-500 rounded-full border-4 border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.4)] z-20 flex items-center justify-center">
            <span className="text-white font-black text-[10px]">A</span>
          </div>

          {sorted.map((p, i) => (
            <div
              key={i}
              className="absolute"
              style={{ 
                transform: `translate(${p.x}px, ${p.y}px) scale(${p.scale})`,
                zIndex: Math.round((p.z + 2) * 10)
              }}
            >
              {p.isLonePair ? (
                <div className="relative flex items-center justify-center">
                  <div className="w-8 h-12 bg-indigo-500/20 border-2 border-dashed border-indigo-400/40 rounded-full blur-[1px]" 
                       style={{ transform: `rotate(${Math.atan2(p.x, -p.y) * 180 / Math.PI}deg)` }} />
                  <div className="absolute flex gap-1">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
                  </div>
                </div>
              ) : (
                <div className="w-6 h-6 bg-gray-400 rounded-full border-2 border-gray-300 shadow-lg flex items-center justify-center">
                  <span className="text-gray-800 font-black text-[8px]">X</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="absolute bottom-4 left-4 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full" />
            <span className="text-[8px] font-black text-gray-500 uppercase">Bonding Domain</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 border border-dashed border-indigo-400 rounded-full" />
            <span className="text-[8px] font-black text-gray-500 uppercase">Lone Pair</span>
          </div>
        </div>
      </div>
    );
  };

  const AtomicTransitionDrawing = ({ view, from, to }: { view: 'circles' | 'lines', from: number, to: number }) => {
    const levels = [1, 2, 3, 4, 5, 6];
    // Spaced out levels for better visualization
    const getY = (n: number) => 170 - (n - 1) * 24;
    const getRadius = (n: number) => 25 + (n - 1) * 13;

    const isEmission = from > to;
    const isAbsorption = from < to;
    const isIonization = from === 1 && to === 7;

    return (
      <div className="relative w-full h-64 bg-gray-950 rounded-2xl overflow-hidden border-2 border-gray-800 flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet">
          <defs>
            <marker id="arrowhead-yellow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#fbbf24" />
            </marker>
            <marker id="arrowhead-blue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#60a5fa" />
            </marker>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          {view === 'circles' ? (
            <g transform="translate(100, 0)">
              <circle cx="100" cy="100" r="8" fill="#ef4444" filter="url(#glow)" />
              {levels.map(n => (
                <circle
                  key={n}
                  cx="100"
                  cy="100"
                  r={getRadius(n)}
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="1"
                  strokeDasharray={n === 1 ? "none" : "4 4"}
                />
              ))}
              {to !== 7 && (
                <motion.path
                  d={`M ${100 + getRadius(from)} 100 L ${100 + getRadius(to)} 100`}
                  stroke={isEmission ? "#fbbf24" : "#60a5fa"}
                  strokeWidth="2.5"
                  markerEnd={isEmission ? "url(#arrowhead-yellow)" : "url(#arrowhead-blue)"}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  key={`${from}-${to}-${view}`}
                />
              )}
              {isIonization && (
                <motion.line
                  x1={100 + getRadius(1)}
                  y1="100"
                  x2="190"
                  y2="100"
                  stroke="#60a5fa"
                  strokeWidth="2.5"
                  markerEnd="url(#arrowhead-blue)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                />
              )}
              <motion.circle
                r="4"
                fill="#3b82f6"
                filter="url(#glow)"
                animate={to === 7 ? { cx: 220, opacity: 0 } : { cx: 100 + getRadius(to), cy: 100 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
            </g>
          ) : (
            <>
              {levels.map(n => (
                <g key={n}>
                  <line x1="40" y1={getY(n)} x2="360" y2={getY(n)} stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                  <text x="15" y={getY(n) + 3} fill="rgba(255,255,255,0.4)" fontSize="10" fontWeight="black">n={n}</text>
                </g>
              ))}
              <line x1="40" y1="20" x2="360" y2="20" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeDasharray="4 2" />
              <text x="15" y="23" fill="rgba(255,255,255,0.5)" fontSize="10" fontWeight="black">n=∞</text>
              
              <motion.line
                x1="200"
                y1={getY(from)}
                x2="200"
                y2={to === 7 ? 20 : getY(to)}
                stroke={isEmission ? "#fbbf24" : "#60a5fa"}
                strokeWidth="3"
                markerEnd={isEmission ? "url(#arrowhead-yellow)" : "url(#arrowhead-blue)"}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                key={`${from}-${to}-${view}`}
              />
              <motion.circle
                r="5"
                fill="#3b82f6"
                filter="url(#glow)"
                animate={{ cx: 200, cy: to === 7 ? 20 : getY(to) }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
            </>
          )}
        </svg>

        <AnimatePresence>
          {(isEmission || isAbsorption) && (
            <motion.div
              key={isEmission ? 'emission' : 'absorption'}
              initial={isAbsorption ? { x: -150, opacity: 0 } : { x: 0, opacity: 0 }}
              animate={isAbsorption ? { x: 0, opacity: [0, 1, 0] } : { x: 150, opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute pointer-events-none"
            >
              <div className="flex items-center gap-1">
                <svg width="40" height="20" viewBox="0 0 40 20" className={isAbsorption ? "text-blue-400" : "text-yellow-400"}>
                  <motion.path
                    d="M 0 10 Q 5 0 10 10 T 20 10 T 30 10 T 40 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="100"
                    animate={{ strokeDashoffset: [0, -100] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                </svg>
                <div className={`w-2 h-2 rounded-full ${isAbsorption ? "bg-blue-400 shadow-[0_0_10px_#60a5fa]" : "bg-yellow-400 shadow-[0_0_10px_#fbbf24]"}`} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute top-4 right-4 flex flex-col items-end gap-1">
          <div className="bg-black/60 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
            <p className="text-[10px] font-black text-white uppercase tracking-widest">
              {isIonization ? 'Ionization' : isEmission ? 'Emission' : 'Absorption'}
            </p>
          </div>
          {isEmission && (
            <div className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
              to === 1 ? 'bg-purple-500 text-white' : 
              to === 2 ? 'bg-emerald-500 text-white' : 
              to === 3 ? 'bg-red-500 text-white' : 'bg-gray-500 text-white'
            }`}>
              {to === 1 ? 'UV (Lyman)' : to === 2 ? 'Visible (Balmer)' : to === 3 ? 'IR (Paschen)' : ''}
            </div>
          )}
        </div>
      </div>
    );
  };

  const HydrogenSeriesDiagram = () => {
    const getEnergyY = (n: number) => {
      if (n === 7) return 40; // infinity
      // Increased scale and adjusted base for more spacing
      const scale = 220;
      return 320 - (1 - 1 / (n * n)) * scale;
    };

    const series = [
      { name: 'Lyman', to: 1, region: 'UV', color: '#a855f7', from: [2, 3, 4, 5, 6] },
      { name: 'Balmer', to: 2, region: 'Vis', color: '#10b981', from: [3, 4, 5, 6], lineColors: ['#ff0000', '#00ffff', '#0000ff', '#4b0082'] },
      { name: 'Paschen', to: 3, region: 'IR', color: '#ef4444', from: [4, 5, 6] }
    ];

    return (
      <div className="mt-8 bg-gray-950 p-8 rounded-[3rem] border-2 border-gray-800 relative overflow-hidden w-full">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse" />
            <div>
              <p className="text-[12px] font-black text-white uppercase tracking-widest">Hydrogen Series & Energy Levels</p>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Electronic Transitions & Spectral Series</p>
            </div>
          </div>
          <div className="flex gap-3">
            {['UV (Lyman)', 'Vis (Balmer)', 'IR (Paschen)'].map(r => (
              <span key={r} className={`text-[10px] font-black px-3 py-1 rounded-full border ${
                r.includes('UV') ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                r.includes('Vis') ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                'bg-red-500/10 text-red-400 border-red-500/20'
              }`}>{r}</span>
            ))}
          </div>
        </div>

        <svg viewBox="0 0 400 380" className="w-full h-auto max-h-[500px]">
          <defs>
            <marker id="arrow-uv" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <path d="M0,0 L8,3 L0,6 Z" fill="#a855f7" />
            </marker>
            <marker id="arrow-ir" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <path d="M0,0 L8,3 L0,6 Z" fill="#ef4444" />
            </marker>
            <linearGradient id="level-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.15)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>

          {/* Energy Levels */}
          {[1, 2, 3, 4, 5, 6, 7].map(n => (
            <g key={n}>
              <line x1="30" y1={getEnergyY(n)} x2="370" y2={getEnergyY(n)} stroke="white" strokeOpacity="0.3" strokeWidth="1.5" />
              <text x="10" y={getEnergyY(n) + 4} className="fill-gray-400 text-[10px] font-black">n={n === 7 ? '∞' : n}</text>
            </g>
          ))}

          {/* Lyman Series */}
          {series[0].from.map((f, i) => (
            <motion.line
              key={`lyman-${f}`}
              x1={60 + i * 12} y1={getEnergyY(f)}
              x2={60 + i * 12} y2={getEnergyY(1)}
              stroke={series[0].color} strokeWidth="2"
              markerEnd="url(#arrow-uv)"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: i * 0.1 }}
            />
          ))}
          <text x="85" y={getEnergyY(1) + 20} textAnchor="middle" className="fill-purple-400 text-[10px] font-black uppercase tracking-tighter">Lyman (UV)</text>

          {/* Balmer Series */}
          {series[1].from.map((f, i) => {
            const spectrumPos = [85, 45, 30, 20];
            const x = 150 + (spectrumPos[i] / 100) * 150; 
            return (
              <g key={`balmer-${f}`}>
                <motion.line
                  x1={x} y1={getEnergyY(f)}
                  x2={x} y2={getEnergyY(2)}
                  stroke={series[1].lineColors![i]} strokeWidth="3"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                />
                <circle cx={x} cy={getEnergyY(2)} r="3" fill={series[1].lineColors![i]} />
              </g>
            );
          })}
          <text x="225" y={getEnergyY(2) + 20} textAnchor="middle" className="fill-emerald-400 text-[10px] font-black uppercase tracking-tighter">Balmer (Visible)</text>

          {/* Paschen Series */}
          {series[2].from.map((f, i) => (
            <motion.line
              key={`paschen-${f}`}
              x1={320 + i * 15} y1={getEnergyY(f)}
              x2={320 + i * 15} y2={getEnergyY(3)}
              stroke={series[2].color} strokeWidth="2"
              markerEnd="url(#arrow-ir)"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 1 + i * 0.1 }}
            />
          ))}
          <text x="345" y={getEnergyY(3) + 20} textAnchor="middle" className="fill-red-400 text-[10px] font-black uppercase tracking-tighter">Paschen (IR)</text>
        </svg>
      </div>
    );
  };

  const EmissionSpectrum = () => {
    const lines = [
      { color: '#ff0000', label: '656nm', n: 'n=3 → n=2', pos: 85, name: 'H-alpha' },
      { color: '#00ffff', label: '486nm', n: 'n=4 → n=2', pos: 45, name: 'H-beta' },
      { color: '#0000ff', label: '434nm', n: 'n=5 → n=2', pos: 30, name: 'H-gamma' },
      { color: '#4b0082', label: '410nm', n: 'n=6 → n=2', pos: 20, name: 'H-delta' },
    ];
    return (
      <div className="mt-8 bg-black p-8 rounded-[3rem] border-2 border-gray-800 shadow-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
            <div>
              <p className="text-[12px] font-black text-gray-400 uppercase tracking-widest">Hydrogen Emission Spectrum</p>
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter">Visible Region (Balmer Series)</p>
            </div>
          </div>
          <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-4 py-1.5 rounded-full border border-emerald-400/20 uppercase tracking-widest">Visible Range</span>
        </div>
        <div className="relative h-24 w-full bg-gray-900 rounded-3xl overflow-hidden flex items-center border-2 border-white/5">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-blue-900/10 to-red-900/30" />
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ delay: i * 0.15 }}
              className="absolute h-full w-1 group cursor-help"
              style={{ 
                backgroundColor: line.color,
                left: `${line.pos}%`,
                boxShadow: `0 0 20px ${line.color}`
              }}
            >
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                <div className="bg-gray-800 text-white text-[10px] font-black px-3 py-1.5 rounded-xl border border-gray-700 whitespace-nowrap shadow-2xl">
                  {line.n} ({line.label})
                </div>
                <div className="w-1 h-3 bg-gray-700" />
              </div>
              
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <p className="text-[9px] font-black text-white/60 uppercase tracking-tighter whitespace-nowrap">{line.n.split(' → ')[0]}</p>
                <p className="text-[8px] font-bold text-white/30">{line.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="flex justify-between mt-16 px-4">
          <div className="flex flex-col items-start">
            <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Violet</span>
            <span className="text-[12px] text-gray-400 font-black">400nm</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Red</span>
            <span className="text-[12px] text-gray-400 font-black">700nm</span>
          </div>
        </div>
      </div>
    );
  };

  const GiantIonicDrawing = () => (
    <div className="relative w-full h-24 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 p-2">
      <div className="grid grid-cols-5 grid-rows-3 gap-1 h-full">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ x: [0, 1, -1, 0], y: [0, -1, 1, 0] }}
            transition={{ duration: 0.2, repeat: Infinity }}
            className={`w-full h-full rounded-full shadow-sm flex items-center justify-center text-[6px] font-bold text-white
              ${i % 2 === 0 ? 'bg-blue-500' : 'bg-rose-500'}
            `}
          >
            {i % 2 === 0 ? '+' : '-'}
          </motion.div>
        ))}
      </div>
    </div>
  );

  const GiantMetallicDrawing = () => (
    <div className="relative w-full h-24 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 p-2">
      <div className="grid grid-cols-5 grid-rows-3 gap-2 h-full relative z-10">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="w-full h-full bg-blue-500 rounded-full shadow-sm flex items-center justify-center text-[6px] font-bold text-white">
            +
          </div>
        ))}
      </div>
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`e-${i}`}
          animate={{ 
            x: [Math.random() * 100, Math.random() * 100],
            y: [Math.random() * 80, Math.random() * 80]
          }}
          transition={{ duration: 1 + Math.random(), repeat: Infinity, ease: "linear" }}
          className="absolute w-1 h-1 bg-rose-500 rounded-full z-0"
        />
      ))}
    </div>
  );

  const GiantCovalentDrawing = () => (
    <div className="relative w-full h-24 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-16 h-16 text-gray-400">
        {/* Simple tetrahedral representation */}
        <circle cx="50" cy="50" r="4" fill="currentColor" />
        <line x1="50" y1="50" x2="50" y2="20" stroke="currentColor" strokeWidth="2" />
        <line x1="50" y1="50" x2="20" y2="70" stroke="currentColor" strokeWidth="2" />
        <line x1="50" y1="50" x2="80" y2="70" stroke="currentColor" strokeWidth="2" />
        <line x1="50" y1="50" x2="65" y2="40" stroke="currentColor" strokeWidth="2" />
        <circle cx="50" cy="20" r="4" fill="currentColor" />
        <circle cx="20" cy="70" r="4" fill="currentColor" />
        <circle cx="80" cy="70" r="4" fill="currentColor" />
        <circle cx="65" cy="40" r="4" fill="currentColor" />
      </svg>
    </div>
  );

  const ElectrolyteDrawing = ({ state }: { state: 'solid' | 'molten' | 'aqueous' }) => {
    const ions = [...Array(12)].map((_, i) => {
      const row = Math.floor(i / 4);
      const col = i % 4;
      const isCation = (row + col) % 2 === 0;
      return {
        id: i,
        type: isCation ? 'cation' : 'anion',
        label: isCation ? 'M⁺' : 'X⁻',
        color: isCation ? 'bg-blue-500' : 'bg-rose-500'
      };
    });

    const waterIons = [...Array(8)].map((_, i) => ({
      id: `w-${i}`,
      type: i % 2 === 0 ? 'h' : 'oh',
      label: i % 2 === 0 ? 'H⁺' : 'OH⁻',
      color: i % 2 === 0 ? 'bg-sky-400' : 'bg-indigo-400'
    }));

    return (
      <div className="relative w-full h-40 bg-gray-50 rounded-2xl overflow-hidden border-2 border-gray-100 p-4">
        {state === 'aqueous' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-blue-100/30 z-0"
          />
        )}
        
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          {state === 'solid' ? (
            <div className="grid grid-cols-4 grid-rows-3 gap-1">
              {ions.map((ion) => (
                <motion.div
                  key={ion.id}
                  animate={{ x: [0, 1, -1, 0], y: [0, -1, 1, 0] }}
                  transition={{ duration: 0.2, repeat: Infinity }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-[8px] font-black text-white shadow-sm ${ion.color}`}
                >
                  {ion.type === 'cation' ? '+' : '-'}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="relative w-full h-full">
              {ions.map((ion, i) => (
                <motion.div
                  key={ion.id}
                  initial={{ 
                    x: 100 + (i % 4) * 35, 
                    y: 20 + Math.floor(i / 4) * 35 
                  }}
                  animate={{ 
                    x: [Math.random() * 250, Math.random() * 250], 
                    y: [Math.random() * 100, Math.random() * 100],
                    rotate: [0, 360]
                  }}
                  transition={{ 
                    duration: state === 'molten' ? 2 : 4, 
                    repeat: Infinity, 
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                  className={`absolute w-8 h-8 rounded-full flex flex-col items-center justify-center shadow-md ${ion.color}`}
                >
                  <span className="text-[10px] font-black text-white leading-none">{ion.label}</span>
                </motion.div>
              ))}
              
              {state === 'aqueous' && waterIons.map((ion, i) => (
                <motion.div
                  key={ion.id}
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: 1,
                    x: [Math.random() * 250, Math.random() * 250], 
                    y: [Math.random() * 100, Math.random() * 100],
                  }}
                  transition={{ 
                    duration: 5, 
                    repeat: Infinity, 
                    repeatType: "reverse",
                    ease: "linear"
                  }}
                  className={`absolute w-6 h-6 rounded-full flex items-center justify-center shadow-sm border border-white/50 ${ion.color}`}
                >
                  <span className="text-[7px] font-black text-white leading-none">{ion.label}</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
        
        <div className="absolute bottom-2 right-4 flex flex-col items-end">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            {state === 'solid' ? 'Lattice' : state === 'molten' ? 'Molten' : 'Aqueous'}
          </p>
        </div>
      </div>
    );
  };

  const TitrationCurve = () => {
    const [flaskType, setFlaskType] = useState<'acid' | 'base'>('base');
    const [acidStrength, setAcidStrength] = useState<'strong' | 'weak'>('strong');
    const [baseStrength, setBaseStrength] = useState<'strong' | 'weak'>('strong');
    const [volumeAdded, setVolumeAdded] = useState(0);
    const [isAdding, setIsAdding] = useState(false);
    const timerRef = useRef<any>(null);

    const calculatePH = (v: number, type: 'acid' | 'base', aStr: 'strong' | 'weak', bStr: 'strong' | 'weak') => {
      const c1 = 0.1; 
      const v1 = 25;  
      const c2 = 0.1; 
      
      const moles1 = (c1 * v1) / 1000;
      const moles2 = (c2 * v) / 1000;
      const totalV = (v1 + v) / 1000;

      const Ka = 1.8e-5;
      const Kb = 1.8e-5;
      const Kw = 1e-14;

      if (type === 'base') { // Acid in burette, Base in flask
        if (v === 0) {
          if (bStr === 'strong') return 13;
          return 14 + Math.log10(Math.sqrt(Kb * c1));
        }
        if (moles2 < moles1) {
          if (bStr === 'strong') {
            const remainingOH = moles1 - moles2;
            return 14 + Math.log10(remainingOH / totalV);
          } else {
            const molesBH = moles2;
            const molesB = moles1 - moles2;
            const pOH = -Math.log10(Kb) + Math.log10(molesBH / molesB);
            return 14 - pOH;
          }
        } else if (Math.abs(moles2 - moles1) < 1e-9) {
          if (aStr === 'strong' && bStr === 'strong') return 7;
          if (aStr === 'strong' && bStr === 'weak') return -Math.log10(Math.sqrt((Kw / Kb) * (moles1 / totalV)));
          if (aStr === 'weak' && bStr === 'strong') return 14 + Math.log10(Math.sqrt((Kw / Ka) * (moles1 / totalV)));
          return 7;
        } else {
          const excessH = moles2 - moles1;
          if (aStr === 'strong') return -Math.log10(excessH / totalV);
          return -Math.log10(Math.sqrt(Ka * (excessH / totalV)));
        }
      } else { // Base in burette, Acid in flask
        if (v === 0) {
          if (aStr === 'strong') return 1;
          return -Math.log10(Math.sqrt(Ka * c1));
        }
        if (moles2 < moles1) {
          if (aStr === 'strong') {
            const remainingH = moles1 - moles2;
            return -Math.log10(remainingH / totalV);
          } else {
            const molesA = moles2;
            const molesHA = moles1 - moles2;
            return -Math.log10(Ka) + Math.log10(molesA / molesHA);
          }
        } else if (Math.abs(moles2 - moles1) < 1e-9) {
          if (aStr === 'strong' && bStr === 'strong') return 7;
          if (aStr === 'weak' && bStr === 'strong') return 14 + Math.log10(Math.sqrt((Kw / Ka) * (moles1 / totalV)));
          if (aStr === 'strong' && bStr === 'weak') return -Math.log10(Math.sqrt((Kw / Kb) * (moles1 / totalV)));
          return 7;
        } else {
          const excessOH = moles2 - moles1;
          if (bStr === 'strong') return 14 + Math.log10(excessOH / totalV);
          return 14 + Math.log10(Math.sqrt(Kb * (excessOH / totalV)));
        }
      }
    };

    const chartData = useMemo(() => {
      const points = [];
      for (let i = 0; i <= 50; i += 0.5) {
        points.push({ volume: i, ph: calculatePH(i, flaskType, acidStrength, baseStrength) });
      }
      return points;
    }, [flaskType, acidStrength, baseStrength]);

    const handleAddSolution = () => {
      if (isAdding) {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsAdding(false);
      } else {
        setIsAdding(true);
        timerRef.current = setInterval(() => {
          setVolumeAdded(prev => {
            if (prev >= 50) {
              if (timerRef.current) clearInterval(timerRef.current);
              setIsAdding(false);
              return 50;
            }
            return prev + 0.5;
          });
        }, 50);
      }
    };

    const reset = () => {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsAdding(false);
      setVolumeAdded(0);
    };

    useEffect(() => {
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, []);

    const currentPH = calculatePH(volumeAdded, flaskType, acidStrength, baseStrength);
    
    const getPHColor = (ph: number) => {
      if (ph < 6.5) return 'text-rose-500';
      if (ph > 7.5) return 'text-blue-500';
      return 'text-purple-500';
    };

    const CustomTooltip = ({ active, payload }: any) => {
      if (active && payload && payload.length) {
        const ph = payload[0].value;
        const vol = payload[0].payload.volume;
        let state = ph < 6.5 ? "Acidic" : ph > 7.5 ? "Basic" : "Neutral";
        let color = ph < 6.5 ? "text-rose-500" : ph > 7.5 ? "text-blue-500" : "text-purple-500";
        return (
          <div className="bg-white p-3 border-2 border-gray-100 rounded-xl shadow-xl">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Volume: {vol} cm³</p>
            <p className={`text-sm font-black ${color}`}>pH: {ph.toFixed(2)}</p>
            <p className={`text-[8px] font-black uppercase tracking-widest ${color}`}>{state}</p>
          </div>
        );
      }
      return null;
    };

    return (
      <div className="space-y-8">
        {/* Top: Configuration Toggles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-[2rem] border-2 border-gray-100">
          <div className="space-y-3">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Titration Setup</p>
            <div className="flex bg-white p-1 rounded-xl border-2 border-gray-100">
              <button
                onClick={() => { setFlaskType('base'); reset(); }}
                className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${flaskType === 'base' ? 'bg-indigo-500 text-white' : 'text-gray-400'}`}
              >
                Acid into Base
              </button>
              <button
                onClick={() => { setFlaskType('acid'); reset(); }}
                className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${flaskType === 'acid' ? 'bg-indigo-500 text-white' : 'text-gray-400'}`}
              >
                Base into Acid
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Acid Strength</p>
            <div className="flex bg-white p-1 rounded-xl border-2 border-gray-100">
              <button
                onClick={() => { setAcidStrength('strong'); reset(); }}
                className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${acidStrength === 'strong' ? 'bg-rose-500 text-white' : 'text-gray-400'}`}
              >
                Strong
              </button>
              <button
                onClick={() => { setAcidStrength('weak'); reset(); }}
                className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${acidStrength === 'weak' ? 'bg-rose-500 text-white' : 'text-gray-400'}`}
              >
                Weak
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Base Strength</p>
            <div className="flex bg-white p-1 rounded-xl border-2 border-gray-100">
              <button
                onClick={() => { setBaseStrength('strong'); reset(); }}
                className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${baseStrength === 'strong' ? 'bg-blue-500 text-white' : 'text-gray-400'}`}
              >
                Strong
              </button>
              <button
                onClick={() => { setBaseStrength('weak'); reset(); }}
                className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${baseStrength === 'weak' ? 'bg-blue-500 text-white' : 'text-gray-400'}`}
              >
                Weak
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Visual Representation */}
          <div className="w-full lg:w-1/3 flex flex-col items-center justify-center bg-gray-50 rounded-3xl p-6 border-2 border-gray-100 min-h-[400px]">
            <div className="relative w-32 h-80 scale-90 sm:scale-100">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-48 border-2 border-gray-300 rounded-b-lg bg-white/50 overflow-hidden">
                <motion.div 
                  className={`absolute bottom-0 w-full ${flaskType === 'base' ? 'bg-rose-400/40' : 'bg-blue-400/40'}`}
                  animate={{ height: `${((50 - volumeAdded) / 50) * 100}%` }}
                />
                <div className="absolute inset-0 flex flex-col justify-between py-2 px-1 pointer-events-none">
                  {[0, 10, 20, 30, 40, 50].map(v => (
                    <div key={v} className="flex items-center justify-between">
                      <div className="w-2 h-[1px] bg-gray-400" />
                      <span className="text-[6px] font-bold text-gray-400">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="absolute top-48 left-1/2 -translate-x-1/2 w-4 h-8 bg-gray-400 rounded-sm">
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-2 bg-gray-600 rounded-full transition-transform ${isAdding ? 'rotate-90' : 'rotate-0'}`} />
              </div>

              {isAdding && (
                <motion.div 
                  className={`absolute top-56 left-1/2 -translate-x-1/2 w-1 h-3 rounded-full ${flaskType === 'base' ? 'bg-rose-400' : 'bg-blue-400'}`}
                  animate={{ y: [0, 40], opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                />
              )}

              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-24">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm overflow-visible">
                  <defs>
                    <clipPath id="flask-clip">
                      <path d="M40 0 L60 0 L60 20 L90 90 L10 90 L40 20 Z" />
                    </clipPath>
                  </defs>
                  {/* Background Liquid - Fixed Graphic */}
                  <motion.rect 
                    x="0" y="0" width="100" height="100"
                    fill={currentPH < 6.5 ? '#f43f5e' : currentPH > 7.5 ? '#3b82f6' : '#a855f7'}
                    fillOpacity="0.4"
                    clipPath="url(#flask-clip)"
                    animate={{ 
                      y: 90 - (25 + volumeAdded) * 0.8
                    }}
                    transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                  />
                  {/* Flask Outline */}
                  <path d="M40 0 L60 0 L60 20 L90 90 L10 90 L40 20 Z" fill="none" stroke="#d1d5db" strokeWidth="2" />
                </svg>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Flask Content</p>
              <p className={`text-sm font-black ${flaskType === 'acid' ? 'text-rose-500' : 'text-blue-500'}`}>
                {flaskType === 'acid' ? `${acidStrength === 'strong' ? 'Strong' : 'Weak'} Acid` : `${baseStrength === 'strong' ? 'Strong' : 'Weak'} Base`}
              </p>
            </div>
          </div>

          {/* Chart & Stats */}
          <div className="flex-1 w-full space-y-6">
            <div className="bg-white p-6 rounded-3xl border-2 border-gray-100 h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="volume" 
                    type="number" 
                    domain={[0, 50]} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    domain={[0, 14]} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} isAnimationActive={false} />
                  <Line 
                    type="monotone" 
                    dataKey="ph" 
                    stroke="#8b5cf6" 
                    strokeWidth={4} 
                    dot={false}
                    isAnimationActive={false}
                    activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                  />
                  <Line 
                    data={[{ volume: volumeAdded, ph: currentPH }]} 
                    type="monotone" 
                    dataKey="ph" 
                    stroke="transparent"
                    isAnimationActive={false}
                    dot={{ r: 8, fill: currentPH < 6.5 ? '#f43f5e' : currentPH > 7.5 ? '#3b82f6' : '#a855f7', stroke: '#fff', strokeWidth: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-6 rounded-2xl border-2 border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Current pH</p>
                <div className="flex items-baseline gap-2">
                  <span className={`text-4xl font-black ${getPHColor(currentPH)}`}>{currentPH.toFixed(2)}</span>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${getPHColor(currentPH)}`}>
                    {currentPH < 6.5 ? 'Acidic' : currentPH > 7.5 ? 'Basic' : 'Neutral'}
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl border-2 border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Volume Added</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-gray-800">{volumeAdded.toFixed(1)}</span>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">cm³</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleAddSolution}
                className={`flex items-center justify-center gap-3 px-8 py-5 rounded-2xl font-black uppercase tracking-widest transition-all
                  ${isAdding 
                    ? 'bg-rose-500 text-white shadow-[0_6px_0_0_#be123c] active:shadow-none active:translate-y-1' 
                    : 'bg-emerald-500 text-white shadow-[0_6px_0_0_#047857] hover:bg-emerald-400 active:shadow-none active:translate-y-1'}
                `}
              >
                {isAdding ? <><XCircle size={20} /> Stop Adding</> : <><RefreshCw size={20} /> Add Burette Solution</>}
              </button>
              <button
                onClick={reset}
                className="px-8 py-5 bg-white border-2 border-gray-200 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-600 hover:border-indigo-400 shadow-[0_6px_0_0_#e5e7eb] active:shadow-none active:translate-y-1 transition-all"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AdditionVsSubstitution = () => {
    const [type, setType] = useState<'substitution' | 'addition'>('substitution');
    const [isReacting, setIsReacting] = useState(false);
    const [hasReacted, setHasReacted] = useState(false);

    const reset = () => {
      setIsReacting(false);
      setHasReacted(false);
    };

    const startReaction = () => {
      setIsReacting(true);
      setTimeout(() => {
        setIsReacting(false);
        setHasReacted(true);
      }, 2000);
    };

    return (
      <div className="space-y-6">
        <div className="flex gap-4 bg-gray-100 p-2 rounded-2xl">
          <button
            onClick={() => { setType('substitution'); reset(); }}
            className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all
              ${type === 'substitution' ? 'bg-white text-orange-500 shadow-sm' : 'text-gray-400 hover:text-gray-600'}
            `}
          >
            Alkane Substitution
          </button>
          <button
            onClick={() => { setType('addition'); reset(); }}
            className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all
              ${type === 'addition' ? 'bg-white text-emerald-500 shadow-sm' : 'text-gray-400 hover:text-gray-600'}
            `}
          >
            Alkene Addition
          </button>
        </div>

        <div className="bg-gray-50 rounded-[2rem] p-8 border-2 border-gray-100 min-h-[450px] flex flex-col items-center justify-center relative overflow-hidden">
          {/* UV Light Indicator */}
          {type === 'substitution' && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-yellow-100 px-4 py-1 rounded-full border border-yellow-200 z-20"
            >
              <Zap size={14} className="text-yellow-600" />
              <span className="text-[10px] font-black text-yellow-700 uppercase tracking-widest">Requires UV Light</span>
            </motion.div>
          )}

          <div className="flex flex-col lg:flex-row items-center gap-16 w-full justify-center">
            {/* Hydrocarbon / Product */}
            <div className="relative">
              {/* C-C Bond */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-1 z-0">
                {type === 'addition' && !hasReacted ? (
                  <>
                    <div className="absolute -top-1 left-0 w-full h-1 bg-gray-300 rounded-full" />
                    <div className="absolute -bottom-1 left-0 w-full h-1 bg-gray-300 rounded-full" />
                  </>
                ) : (
                  <div className="w-full h-full bg-gray-300 rounded-full" />
                )}
              </div>

              <div className="flex items-center gap-16 relative z-10">
                {/* Left Carbon Group */}
                <div className="relative flex items-center justify-center w-12 h-12">
                  <div className="w-12 h-12 rounded-full bg-gray-800 border-2 border-gray-900 flex items-center justify-center text-xs font-black text-white">C</div>
                  
                  {/* Top H */}
                  <div className="absolute -top-12 flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-gray-500 flex items-center justify-center text-[10px] font-black text-white">H</div>
                    <div className="w-[2px] h-4 bg-gray-300" />
                  </div>
                  
                  {/* Bottom H */}
                  <div className="absolute -bottom-12 flex flex-col items-center">
                    <div className="w-[2px] h-4 bg-gray-300" />
                    <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-gray-500 flex items-center justify-center text-[10px] font-black text-white">H</div>
                  </div>

                  {/* Left H or Cl */}
                  <div className="absolute -left-12 flex items-center">
                    <AnimatePresence mode="wait">
                      {hasReacted && type === 'addition' ? (
                        <motion.div key="cl-l" initial={{ scale: 0, x: 20 }} animate={{ scale: 1, x: 0 }} className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-emerald-400 border-2 border-emerald-500 flex items-center justify-center text-[10px] font-black text-white">Cl</div>
                          <div className="h-[2px] w-4 bg-gray-300" />
                        </motion.div>
                      ) : type === 'substitution' ? (
                        <div key="h-l" className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-gray-500 flex items-center justify-center text-[10px] font-black text-white">H</div>
                          <div className="h-[2px] w-4 bg-gray-300" />
                        </div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Right Carbon Group */}
                <div className="relative flex items-center justify-center w-12 h-12">
                  <div className="w-12 h-12 rounded-full bg-gray-800 border-2 border-gray-900 flex items-center justify-center text-xs font-black text-white">C</div>
                  
                  {/* Top H */}
                  <div className="absolute -top-12 flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-gray-500 flex items-center justify-center text-[10px] font-black text-white">H</div>
                    <div className="w-[2px] h-4 bg-gray-300" />
                  </div>
                  
                  {/* Bottom H */}
                  <div className="absolute -bottom-12 flex flex-col items-center">
                    <div className="w-[2px] h-4 bg-gray-300" />
                    <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-gray-500 flex items-center justify-center text-[10px] font-black text-white">H</div>
                  </div>

                  {/* Right H or Cl */}
                  <div className="absolute -right-12 flex items-center">
                    <div className="h-[2px] w-4 bg-gray-300" />
                    <AnimatePresence mode="wait">
                      {hasReacted ? (
                        <motion.div key="cl-r" initial={{ scale: 0, x: -20 }} animate={{ scale: 1, x: 0 }} className="w-8 h-8 rounded-full bg-emerald-400 border-2 border-emerald-500 flex items-center justify-center text-[10px] font-black text-white">Cl</motion.div>
                      ) : type === 'substitution' ? (
                        <motion.div key="h-r" exit={{ opacity: 0, x: 20 }} className="w-8 h-8 rounded-full bg-gray-400 border-2 border-gray-500 flex items-center justify-center text-[10px] font-black text-white">H</motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 text-center w-max">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  {hasReacted ? 'Product' : 'Reactant'}
                </p>
                <p className="text-sm font-black text-gray-800 uppercase">
                  {hasReacted 
                    ? (type === 'substitution' ? 'Chloroethane' : '1,2-dichloroethane')
                    : (type === 'substitution' ? 'Ethane' : 'Ethene')}
                </p>
              </div>
            </div>

            {/* Plus Sign */}
            {!hasReacted && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-3xl font-black text-gray-300">+</motion.div>
            )}

            {/* Chlorine / HCl */}
            <div className="relative">
              <AnimatePresence mode="wait">
                {!hasReacted ? (
                  <motion.div 
                    key="cl2"
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center"
                  >
                    <div className="w-10 h-10 rounded-full bg-emerald-400 border-2 border-emerald-500 flex items-center justify-center text-[10px] font-black text-white">Cl</div>
                    <div className="h-[2px] w-4 bg-gray-300" />
                    <div className="w-10 h-10 rounded-full bg-emerald-400 border-2 border-emerald-500 flex items-center justify-center text-[10px] font-black text-white">Cl</div>
                  </motion.div>
                ) : type === 'substitution' ? (
                  <motion.div 
                    key="hcl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-gray-500 flex items-center justify-center text-[10px] font-black text-white">H</div>
                    <div className="h-[2px] w-4 bg-gray-300" />
                    <div className="w-10 h-10 rounded-full bg-emerald-400 border-2 border-emerald-500 flex items-center justify-center text-[10px] font-black text-white">Cl</div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 text-center w-max">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  {hasReacted ? (type === 'substitution' ? 'Side Product' : '') : 'Reactant'}
                </p>
                <p className="text-sm font-black text-gray-800 uppercase">
                  {hasReacted 
                    ? (type === 'substitution' ? 'Hydrogen Chloride' : '')
                    : 'Chlorine'}
                </p>
              </div>
            </div>
          </div>

          {/* Animation Overlay */}
          <AnimatePresence>
            {isReacting && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center"
              >
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="text-emerald-500 mb-4"
                >
                  <RefreshCw size={48} />
                </motion.div>
                <p className="text-sm font-black text-gray-800 uppercase tracking-widest">Reaction in Progress...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-3xl border-2 border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Reaction Type</p>
            <p className={`text-xl font-black uppercase tracking-tight ${type === 'substitution' ? 'text-orange-500' : 'text-emerald-500'}`}>
              {type === 'substitution' ? 'Substitution' : 'Addition'}
            </p>
            <p className="text-xs font-bold text-gray-500 mt-2">
              {type === 'substitution' 
                ? 'One hydrogen atom is replaced by a chlorine atom.' 
                : 'The double bond breaks and both chlorine atoms add to the carbons.'}
            </p>
          </div>
          <div className="bg-white p-6 rounded-3xl border-2 border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Key Facts</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-xs font-bold text-gray-700">
                <div className={`w-2 h-2 rounded-full ${type === 'substitution' ? 'bg-orange-500' : 'bg-emerald-500'}`} />
                {type === 'substitution' ? 'Produces 2 products' : 'Produces 1 product'}
              </li>
              <li className="flex items-center gap-2 text-xs font-bold text-gray-700">
                <div className={`w-2 h-2 rounded-full ${type === 'substitution' ? 'bg-orange-500' : 'bg-emerald-500'}`} />
                {type === 'substitution' ? 'Requires UV Light' : 'No UV Light needed'}
              </li>
            </ul>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={startReaction}
            disabled={isReacting || hasReacted}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-black uppercase tracking-widest transition-all
              ${isReacting || hasReacted
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-emerald-500 text-white shadow-[0_6px_0_0_#047857] hover:bg-emerald-400 active:shadow-none active:translate-y-1'}
            `}
          >
            {isReacting ? 'Reacting...' : hasReacted ? 'Reaction Complete' : 'Start Reaction'}
          </button>
          <button
            onClick={reset}
            className="px-6 py-4 bg-white border-2 border-gray-200 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-600 hover:border-purple-400 shadow-[0_6px_0_0_#e5e7eb] active:shadow-none active:translate-y-1 transition-all"
          >
            Reset
          </button>
        </div>
      </div>
    );
  };

  const NuclearChargeSim = () => {
    const [protons, setProtons] = useState(3);
    const radius = 100 - (protons - 1) * 8;

    return (
      <div className="bg-white p-6 rounded-3xl border-2 border-indigo-100 flex flex-col items-center">
        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-6">Nuclear Charge Simulation</p>
        
        <div className="relative w-48 h-48 flex items-center justify-center bg-gray-50 rounded-full border border-gray-100 mb-6">
          {/* Nucleus */}
          <motion.div 
            animate={{ scale: 1 + protons * 0.05 }}
            className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-black text-[10px] z-10 shadow-lg"
          >
            {protons}+
          </motion.div>

          {/* Orbit Path */}
          <motion.div 
            animate={{ width: radius * 2, height: radius * 2 }}
            className="absolute border border-dashed border-gray-300 rounded-full"
          />

          {/* Valence Electron */}
          <motion.div
            animate={{ 
              x: Math.cos(0) * radius,
              y: Math.sin(0) * radius,
            }}
            className="absolute w-4 h-4 bg-red-500 rounded-full shadow-md flex items-center justify-center"
          >
            <div className="w-1 h-1 bg-white rounded-full" />
          </motion.div>

          {/* Attraction Force Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <motion.line 
              animate={{ x2: 96 + Math.cos(0) * radius, y2: 96 + Math.sin(0) * radius }}
              x1="96" y1="96" x2="150" y2="96" 
              stroke="#6366f1" strokeWidth={protons * 0.5} strokeDasharray="4 2" opacity={0.3}
            />
          </svg>
        </div>

        <div className="w-full space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-gray-400 uppercase">Protons (Z)</span>
            <span className="text-sm font-black text-blue-600">{protons}</span>
          </div>
          <input 
            type="range" min="1" max="10" step="1"
            value={protons}
            onChange={(e) => setProtons(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <p className="text-[9px] font-bold text-gray-500 text-center italic">
            Increasing protons increases attraction, pulling the valence electron closer.
          </p>
        </div>
      </div>
    );
  };

  const ShieldingEffectSim = () => {
    const [shells, setShells] = useState(2);
    const valenceRadius = 40 + shells * 25;

    return (
      <div className="bg-white p-6 rounded-3xl border-2 border-orange-100 flex flex-col items-center">
        <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-6">Shielding Effect Simulation</p>
        
        <div className="relative w-48 h-48 flex items-center justify-center bg-gray-50 rounded-full border border-gray-100 mb-6">
          {/* Nucleus */}
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white font-black text-[8px] z-10 shadow-lg">
            +
          </div>

          {/* Inner Shells */}
          {[...Array(shells - 1)].map((_, i) => (
            <div 
              key={i}
              style={{ width: (i + 1) * 50, height: (i + 1) * 50 }}
              className="absolute border border-gray-200 rounded-full"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-red-400 rounded-full" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-red-400 rounded-full" />
            </div>
          ))}

          {/* Valence Shell */}
          <motion.div 
            animate={{ width: valenceRadius * 2, height: valenceRadius * 2 }}
            className="absolute border border-dashed border-orange-300 rounded-full"
          />

          {/* Valence Electron */}
          <motion.div
            animate={{ 
              x: Math.cos(Math.PI / 4) * valenceRadius,
              y: Math.sin(Math.PI / 4) * valenceRadius,
            }}
            className="absolute w-4 h-4 bg-red-600 rounded-full shadow-md flex items-center justify-center"
          >
            <div className="w-1 h-1 bg-white rounded-full" />
          </motion.div>

          {/* Repulsion Arrows */}
          {shells > 1 && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <motion.path 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                d={`M 96 96 L ${96 + Math.cos(Math.PI / 4) * valenceRadius} ${96 + Math.sin(Math.PI / 4) * valenceRadius}`}
                stroke="#ef4444" strokeWidth="1" strokeDasharray="2 2" opacity={0.2}
              />
            </svg>
          )}
        </div>

        <div className="w-full space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-gray-400 uppercase">Number of Shells</span>
            <span className="text-sm font-black text-orange-600">{shells}</span>
          </div>
          <input 
            type="range" min="1" max="4" step="1"
            value={shells}
            onChange={(e) => setShells(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
          <p className="text-[9px] font-bold text-gray-500 text-center italic">
            More shells increase shielding, pushing the valence electron further away.
          </p>
        </div>
      </div>
    );
  };

  const PeriodicTrends = () => {
    const [selectedTrend, setSelectedTrend] = useState('atomic-radii');

    const trends: Record<string, { 
      title: string, 
      across: string, 
      down: string, 
      explanation: string, 
      color: string,
      periodData: { label: string, value: number, unit: string }[],
      groupData: { label: string, value: number, unit: string }[]
    }> = {
      'atomic-radii': {
        title: 'Atomic Radii',
        across: 'Decreases',
        down: 'Increases',
        explanation: 'Across a period, nuclear charge increases while shielding remains constant, pulling electrons closer. Down a group, the number of occupied shells increases, which outweighs the increase in nuclear charge.',
        color: 'indigo',
        periodData: [
          { label: 'Na', value: 186, unit: 'pm' },
          { label: 'Mg', value: 160, unit: 'pm' },
          { label: 'Al', value: 143, unit: 'pm' },
          { label: 'Si', value: 118, unit: 'pm' },
          { label: 'P', value: 110, unit: 'pm' },
          { label: 'S', value: 102, unit: 'pm' },
          { label: 'Cl', value: 99, unit: 'pm' }
        ],
        groupData: [
          { label: 'Li', value: 152, unit: 'pm' },
          { label: 'Na', value: 186, unit: 'pm' },
          { label: 'K', value: 227, unit: 'pm' },
          { label: 'Rb', value: 248, unit: 'pm' },
          { label: 'Cs', value: 265, unit: 'pm' }
        ]
      },
      'electronegativity': {
        title: 'Electronegativity',
        across: 'Increases',
        down: 'Decreases',
        explanation: 'Across a period, increased nuclear charge and constant shielding result in a stronger attraction for bonding electrons. Down a group, increased shielding and distance from the nucleus decrease the attraction.',
        color: 'rose',
        periodData: [
          { label: 'Na', value: 0.9, unit: '' },
          { label: 'Mg', value: 1.2, unit: '' },
          { label: 'Al', value: 1.5, unit: '' },
          { label: 'Si', value: 1.8, unit: '' },
          { label: 'P', value: 2.1, unit: '' },
          { label: 'S', value: 2.5, unit: '' },
          { label: 'Cl', value: 3.0, unit: '' }
        ],
        groupData: [
          { label: 'Li', value: 1.0, unit: '' },
          { label: 'Na', value: 0.9, unit: '' },
          { label: 'K', value: 0.8, unit: '' },
          { label: 'Rb', value: 0.8, unit: '' },
          { label: 'Cs', value: 0.7, unit: '' }
        ]
      },
      'ionic-radii': {
        title: 'Ionic Radii',
        across: 'Decreases (Na⁺ to Si⁴⁺, then Si⁴⁻ to Cl⁻)',
        down: 'Increases',
        explanation: 'Cations are smaller than parent atoms (loss of shell/increased Zeff). Anions are larger (increased repulsion). Across a period, radii decrease within isoelectronic series. Down a group, more shells increase size.',
        color: 'amber',
        periodData: [
          { label: 'Na⁺', value: 102, unit: 'pm' },
          { label: 'Mg²⁺', value: 72, unit: 'pm' },
          { label: 'Al³⁺', value: 54, unit: 'pm' },
          { label: 'Si⁴⁺', value: 40, unit: 'pm' },
          { label: 'P³⁻', value: 212, unit: 'pm' },
          { label: 'S²⁻', value: 184, unit: 'pm' },
          { label: 'Cl⁻', value: 181, unit: 'pm' }
        ],
        groupData: [
          { label: 'Li⁺', value: 76, unit: 'pm' },
          { label: 'Na⁺', value: 102, unit: 'pm' },
          { label: 'K⁺', value: 138, unit: 'pm' },
          { label: 'Rb⁺', value: 152, unit: 'pm' },
          { label: 'Cs⁺', value: 167, unit: 'pm' }
        ]
      },
      'ionization-energy': {
        title: '1st Ionization Energy',
        across: 'Generally Increases',
        down: 'Decreases',
        explanation: 'Across a period, increased nuclear charge makes it harder to remove an electron. Dips occur at G13 (p-orbital shielding) and G16 (electron pairing repulsion). Down a group, shielding and distance make removal easier.',
        color: 'emerald',
        periodData: [
          { label: 'Na', value: 496, unit: 'kJ/mol' },
          { label: 'Mg', value: 738, unit: 'kJ/mol' },
          { label: 'Al', value: 578, unit: 'kJ/mol' },
          { label: 'Si', value: 786, unit: 'kJ/mol' },
          { label: 'P', value: 1012, unit: 'kJ/mol' },
          { label: 'S', value: 1000, unit: 'kJ/mol' },
          { label: 'Cl', value: 1251, unit: 'kJ/mol' }
        ],
        groupData: [
          { label: 'Li', value: 520, unit: 'kJ/mol' },
          { label: 'Na', value: 496, unit: 'kJ/mol' },
          { label: 'K', value: 419, unit: 'kJ/mol' },
          { label: 'Rb', value: 403, unit: 'kJ/mol' },
          { label: 'Cs', value: 376, unit: 'kJ/mol' }
        ]
      }
    };

    const current = trends[selectedTrend];

    return (
      <div className="space-y-8">
        <div className="flex flex-wrap gap-2">
          {Object.entries(trends).map(([id, t]) => (
            <button
              key={id}
              onClick={() => setSelectedTrend(id)}
              className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all
                ${selectedTrend === id 
                  ? `bg-${t.color}-500 text-white shadow-[0_4px_0_0_rgba(0,0,0,0.2)]` 
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}
              `}
            >
              {t.title}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Trend Visualization */}
          <div className="xl:col-span-2 bg-gray-50 p-8 rounded-[2.5rem] border-2 border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Layers size={80} />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-3 h-3 rounded-full bg-${current.color}-500`} />
                <h3 className="text-xl font-black text-gray-800 uppercase">{current.title}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Across Period Visual */}
                <div className="bg-white p-6 rounded-3xl border border-gray-200">
                  <div className="flex justify-between items-end h-32 gap-1">
                    {current.periodData.map((d, i) => {
                      let size = 0;
                      let intensity = 0;
                      const maxVal = Math.max(...current.periodData.map(x => x.value));
                      const minVal = Math.min(...current.periodData.map(x => x.value));
                      
                      if (selectedTrend === 'atomic-radii' || selectedTrend === 'ionic-radii') {
                        size = (d.value / maxVal) * 50;
                      } else if (selectedTrend === 'electronegativity') {
                        size = 30;
                        intensity = (d.value / 4.0);
                      } else {
                        size = (d.value / maxVal) * 60;
                      }

                      return (
                        <div key={i} className="flex flex-col items-center gap-2 flex-1">
                          <div className="h-20 flex items-center justify-center">
                            <motion.div 
                              animate={{ 
                                height: size, 
                                width: size,
                                backgroundColor: selectedTrend === 'electronegativity' 
                                  ? `rgba(244, 63, 94, ${0.2 + intensity})` 
                                  : selectedTrend === 'atomic-radii' 
                                    ? '#6366f1' 
                                    : selectedTrend === 'ionization-energy'
                                      ? '#10b981'
                                      : '#f59e0b'
                              }}
                              className="rounded-full shadow-sm"
                            />
                          </div>
                          <span className="text-[8px] font-black text-gray-400 uppercase" dangerouslySetInnerHTML={{ __html: formatFormula(d.label) }} />
                          <span className="text-[8px] font-bold text-gray-800">{d.value}{d.unit}</span>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest text-center mt-6">Across Period 3 (Real Data)</p>
                </div>

                {/* Down Group Visual */}
                <div className="bg-white p-6 rounded-3xl border border-gray-200">
                  <div className="flex justify-between items-end h-32 gap-1">
                    {current.groupData.map((d, i) => {
                      let size = 0;
                      let intensity = 0;
                      const maxVal = Math.max(...current.groupData.map(x => x.value));
                      
                      if (selectedTrend === 'atomic-radii' || selectedTrend === 'ionic-radii') {
                        size = (d.value / maxVal) * 50;
                      } else if (selectedTrend === 'electronegativity') {
                        size = 30;
                        intensity = (d.value / 4.0);
                      } else {
                        size = (d.value / maxVal) * 60;
                      }

                      return (
                        <div key={i} className="flex flex-col items-center gap-2 flex-1">
                          <div className="h-20 flex items-center justify-center">
                            <motion.div 
                              animate={{ 
                                height: size, 
                                width: size,
                                backgroundColor: selectedTrend === 'electronegativity' 
                                  ? `rgba(244, 63, 94, ${0.2 + intensity})` 
                                  : selectedTrend === 'atomic-radii' 
                                    ? '#6366f1' 
                                    : selectedTrend === 'ionization-energy'
                                      ? '#10b981'
                                      : '#f59e0b'
                              }}
                              className="rounded-full shadow-sm"
                            />
                          </div>
                          <span className="text-[8px] font-black text-gray-400 uppercase" dangerouslySetInnerHTML={{ __html: formatFormula(d.label) }} />
                          <span className="text-[8px] font-bold text-gray-800">{d.value}{d.unit}</span>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest text-center mt-6">Down Group 1 (Real Data)</p>
                </div>
              </div>

              <div className="p-6 bg-white/50 rounded-2xl border border-gray-200">
                <p className="text-xs font-bold text-gray-600 leading-relaxed">
                  {current.explanation}
                </p>
              </div>
            </div>
          </div>

          {/* Persistent Simulations */}
          <div className="space-y-6">
            <NuclearChargeSim />
            <ShieldingEffectSim />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-indigo-50 p-8 rounded-[2.5rem] border-2 border-indigo-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-indigo-500 p-2 rounded-xl text-white">
                <TrendingUp size={16} />
              </div>
              <h4 className="text-sm font-black text-indigo-900 uppercase tracking-tight">Across Period Summary</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-indigo-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Nuclear Charge</p>
                <div className="flex items-center gap-2 text-emerald-500">
                  <TrendingUp size={16} />
                  <span className="text-sm font-black">Increases</span>
                </div>
                <p className="text-[8px] font-bold text-gray-400 mt-1">More protons in nucleus</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-indigo-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Shielding</p>
                <div className="flex items-center gap-2 text-gray-400">
                  <RefreshCw size={16} />
                  <span className="text-sm font-black">Constant</span>
                </div>
                <p className="text-[8px] font-bold text-gray-400 mt-1">Same number of shells</p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-indigo-500/10 rounded-xl border border-indigo-200">
              <p className="text-[10px] font-black text-indigo-700 uppercase tracking-widest text-center">
                Effective Nuclear Charge (Zeff) Increases
              </p>
            </div>
          </div>

          <div className="bg-orange-50 p-8 rounded-[2.5rem] border-2 border-orange-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-orange-500 p-2 rounded-xl text-white">
                <TrendingUp size={16} />
              </div>
              <h4 className="text-sm font-black text-orange-900 uppercase tracking-tight">Down Group Summary</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-orange-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Nuclear Charge</p>
                <div className="flex items-center gap-2 text-emerald-500">
                  <TrendingUp size={16} />
                  <span className="text-sm font-black">Increases</span>
                </div>
                <p className="text-[8px] font-bold text-gray-400 mt-1">More protons</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-orange-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Shielding</p>
                <div className="flex items-center gap-2 text-emerald-500">
                  <TrendingUp size={16} />
                  <span className="text-sm font-black">Increases</span>
                </div>
                <p className="text-[8px] font-bold text-gray-400 mt-1">More shells added</p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-orange-500/10 rounded-xl border border-orange-200">
              <p className="text-[10px] font-black text-orange-700 uppercase tracking-widest text-center">
                Shielding outweighs Nuclear Charge
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const EquilibriumConstants = () => {
    const [coeffs, setCoeffs] = useState({ a: 1, b: 1, c: 1, d: 1 });
    const [activeSpecies, setActiveSpecies] = useState({ a: true, b: true, c: true, d: true });

    const deltaN = (activeSpecies.c ? coeffs.c : 0) + (activeSpecies.d ? coeffs.d : 0) - 
                   ((activeSpecies.a ? coeffs.a : 0) + (activeSpecies.b ? coeffs.b : 0));

    const formatUnits = (dn: number) => {
      if (dn === 0) return "No units";
      const molExp = dn === 1 ? "" : <sup>{dn}</sup>;
      const dmExp = -3 * dn === 1 ? "" : <sup>{-3 * dn}</sup>;
      
      return (
        <span className="font-mono font-bold">
          mol{molExp} dm{dmExp}
        </span>
      );
    };

    const renderTerm = (label: string, coeff: number, active: boolean) => {
      if (!active) return null;
      return (
        <div className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border-2 border-gray-100 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-gray-800">[{label}]</span>
            <div className="flex flex-col">
              <button 
                onClick={() => setCoeffs(prev => ({ ...prev, [label.toLowerCase()]: Math.min(prev[label.toLowerCase() as keyof typeof prev] + 1, 9) }))}
                className="text-gray-400 hover:text-emerald-500 transition-colors"
              >
                <ChevronUp size={14} />
              </button>
              <span className="text-xs font-black text-emerald-600 text-center">{coeff}</span>
              <button 
                onClick={() => setCoeffs(prev => ({ ...prev, [label.toLowerCase()]: Math.max(prev[label.toLowerCase() as keyof typeof prev] - 1, 1) }))}
                className="text-gray-400 hover:text-emerald-500 transition-colors"
              >
                <ChevronDown size={14} />
              </button>
            </div>
          </div>
          <button 
            onClick={() => setActiveSpecies(prev => ({ ...prev, [label.toLowerCase()]: !prev[label.toLowerCase() as keyof typeof prev] }))}
            className="text-[8px] font-black uppercase tracking-widest text-gray-400 hover:text-rose-500"
          >
            Remove
          </button>
        </div>
      );
    };

    const renderAddButton = (label: string) => (
      <button 
        onClick={() => setActiveSpecies(prev => ({ ...prev, [label.toLowerCase()]: true }))}
        className="p-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 hover:border-emerald-300 hover:text-emerald-500 transition-all flex items-center justify-center"
      >
        <Plus size={20} />
        <span className="ml-2 text-[10px] font-black uppercase">Add {label}</span>
      </button>
    );

    return (
      <div className="space-y-10">
        {/* Equation Display */}
        <div className="bg-gray-900 p-8 rounded-[2.5rem] border-4 border-gray-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Atom size={80} className="text-white" />
          </div>
          <div className="relative z-10 flex flex-wrap justify-center items-center gap-4 text-white font-black text-2xl md:text-3xl tracking-tight">
            <div className="flex items-center gap-2">
              {activeSpecies.a && <span>{coeffs.a}A</span>}
              {activeSpecies.a && activeSpecies.b && <span className="text-emerald-400">+</span>}
              {activeSpecies.b && <span>{coeffs.b}B</span>}
            </div>
            <span className="text-emerald-400 mx-2">⇌</span>
            <div className="flex items-center gap-2">
              {activeSpecies.c && <span>{coeffs.c}C</span>}
              {activeSpecies.c && activeSpecies.d && <span className="text-emerald-400">+</span>}
              {activeSpecies.d && <span>{coeffs.d}D</span>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Controls */}
          <div className="space-y-8">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Reactants</p>
              <div className="grid grid-cols-2 gap-4">
                {activeSpecies.a ? renderTerm('A', coeffs.a, true) : renderAddButton('A')}
                {activeSpecies.b ? renderTerm('B', coeffs.b, true) : renderAddButton('B')}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Products</p>
              <div className="grid grid-cols-2 gap-4">
                {activeSpecies.c ? renderTerm('C', coeffs.c, true) : renderAddButton('C')}
                {activeSpecies.d ? renderTerm('D', coeffs.d, true) : renderAddButton('D')}
              </div>
            </div>
          </div>

          {/* Kc Expression & Units */}
          <div className="flex flex-col justify-center gap-8">
            <div className="bg-emerald-50 p-8 rounded-[2.5rem] border-2 border-emerald-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Calculator size={40} className="text-emerald-600" />
              </div>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-6">K<sub>c</sub> Expression</p>
              
              <div className="flex items-center gap-4">
                <span className="text-3xl font-black text-gray-800">K<sub>c</sub> =</span>
                <div className="flex flex-col items-center">
                  <div className="pb-2 border-b-2 border-gray-800 flex gap-1 text-xl font-black text-gray-800">
                    {activeSpecies.c && <span>[C]<sup>{coeffs.c}</sup></span>}
                    {activeSpecies.d && <span>[D]<sup>{coeffs.d}</sup></span>}
                    {!activeSpecies.c && !activeSpecies.d && <span className="text-gray-300">1</span>}
                  </div>
                  <div className="pt-2 flex gap-1 text-xl font-black text-gray-800">
                    {activeSpecies.a && <span>[A]<sup>{coeffs.a}</sup></span>}
                    {activeSpecies.b && <span>[B]<sup>{coeffs.b}</sup></span>}
                    {!activeSpecies.a && !activeSpecies.b && <span className="text-gray-300">1</span>}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-indigo-50 p-8 rounded-[2.5rem] border-2 border-indigo-100">
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-4">Calculated Units</p>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-gray-800">{formatUnits(deltaN)}</span>
              </div>
              <p className="text-[10px] font-bold text-gray-400 mt-4 leading-relaxed">
                Units are derived from (mol dm⁻³)<sup>Δn</sup>, where Δn = (moles of products) - (moles of reactants).
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const IonizationEnergy = () => {
    const [view, setView] = useState<'first' | 'successive'>('first');
    const [selectedZ, setSelectedZ] = useState(1);

    const ieData = [
      { z: 1, symbol: 'H', ie: 1312, period: 1, group: 1, successive: [1312] },
      { z: 2, symbol: 'He', ie: 2372, period: 1, group: 18, successive: [2372, 5250] },
      { z: 3, symbol: 'Li', ie: 520, period: 2, group: 1, successive: [520, 7298, 11815] },
      { z: 4, symbol: 'Be', ie: 900, period: 2, group: 2, successive: [900, 1757, 14848, 21006] },
      { z: 5, symbol: 'B', ie: 801, period: 2, group: 13, successive: [801, 2427, 3660, 25026, 32827] },
      { z: 6, symbol: 'C', ie: 1086, period: 2, group: 14, successive: [1086, 2353, 4620, 6222, 37831, 47277] },
      { z: 7, symbol: 'N', ie: 1402, period: 2, group: 15, successive: [1402, 2856, 4578, 7475, 9445, 53267, 64360] },
      { z: 8, symbol: 'O', ie: 1314, period: 2, group: 16, successive: [1314, 3388, 5300, 7469, 10989, 13327, 71330, 84078] },
      { z: 9, symbol: 'F', ie: 1681, period: 2, group: 17, successive: [1681, 3374, 6050, 8408, 11023, 15164, 17868, 92038, 106434] },
      { z: 10, symbol: 'Ne', ie: 2081, period: 2, group: 18, successive: [2081, 3952, 6122, 9371, 12177, 15238, 19999, 23069, 115379, 131432] },
      { z: 11, symbol: 'Na', ie: 496, period: 3, group: 1, successive: [496, 4562, 6910, 9543, 13354, 16613, 20117, 25496, 28932, 141362, 159075] },
      { z: 12, symbol: 'Mg', ie: 738, period: 3, group: 2, successive: [738, 1451, 7733, 10543, 13630, 18020, 21711, 25661, 31653, 35458, 169988, 189368] },
      { z: 13, symbol: 'Al', ie: 578, period: 3, group: 13, successive: [578, 1817, 2745, 11577, 14842, 18379, 23326, 27465, 31853, 38473, 42647, 201266, 222316] },
      { z: 14, symbol: 'Si', ie: 786, period: 3, group: 14, successive: [786, 1577, 3232, 4356, 16091, 19805, 23780, 29287, 33878, 38726, 45962, 50502, 235196, 257923] },
      { z: 15, symbol: 'P', ie: 1012, period: 3, group: 15, successive: [1012, 1907, 2914, 4964, 6274, 21267, 25431, 29872, 35905, 40950, 46261, 54114, 59024, 271788, 296198] },
      { z: 16, symbol: 'S', ie: 1000, period: 3, group: 16, successive: [1000, 2252, 3357, 4556, 7004, 8496, 27107, 31719, 36621, 43177, 48710, 54469, 62930, 68216, 311048, 337138] },
      { z: 17, symbol: 'Cl', ie: 1251, period: 3, group: 17, successive: [1251, 2298, 3822, 5159, 6542, 9362, 11018, 33604, 38600, 43961, 51068, 57119, 63363, 72373, 78095, 352994, 380760] },
      { z: 18, symbol: 'Ar', ie: 1521, period: 3, group: 18, successive: [1521, 2666, 3931, 5771, 7238, 8781, 11995, 13842, 40760, 46186, 52002, 59653, 66199, 72918, 82473, 88576, 397605, 427066] },
      { z: 19, symbol: 'K', ie: 419, period: 4, group: 1, successive: [419, 3052, 4420, 5877, 7975, 9590, 11343, 14944, 16964, 48610, 54490, 60730, 68950, 75900, 83080, 93400, 99710, 444880, 476063, 508549] },
      { z: 20, symbol: 'Ca', ie: 590, period: 4, group: 2, successive: [590, 1145, 4912, 6491, 8153, 10496, 12270, 14206, 18191, 20385, 57110, 63410, 70110, 78890, 86310, 94000, 104900, 111711, 494850, 527762] },
    ];

    const currentElement = ieData.find(e => e.z === selectedZ) || ieData[0];

    const getShellColor = (electronIndex: number, totalZ: number) => {
      const shellMapping: number[] = [];
      for (let i = 1; i <= totalZ; i++) {
        if (i <= 2) shellMapping.push(1);
        else if (i <= 10) shellMapping.push(2);
        else if (i <= 18) shellMapping.push(3);
        else shellMapping.push(4);
      }
      const reversedShells = [...shellMapping].reverse();
      const shell = reversedShells[electronIndex];
      
      const colors = {
        1: '#f43f5e', // rose-500
        2: '#f59e0b', // amber-500
        3: '#10b981', // emerald-500
        4: '#3b82f6', // blue-500
      };
      return colors[shell as keyof typeof colors] || '#6366f1';
    };

    const successiveChartData = currentElement.successive.map((val, idx) => ({
      num: idx + 1,
      ie: Math.log10(val),
      realVal: val,
      color: getShellColor(idx, currentElement.z),
      shell: [4, 3, 2, 1].reverse()[[...Array(currentElement.z)].map((_, i) => {
        if (i < 2) return 1;
        if (i < 10) return 2;
        if (i < 18) return 3;
        return 4;
      }).reverse()[idx] - 1]
    }));

    const [hoveredElectron, setHoveredElectron] = useState<number | null>(null);

    const BohrModel = ({ z, highlightIndex }: { z: number, highlightIndex: number | null }) => {
      const shellCounts = [0, 0, 0, 0];
      for (let i = 1; i <= z; i++) {
        if (i <= 2) shellCounts[0]++;
        else if (i <= 10) shellCounts[1]++;
        else if (i <= 18) shellCounts[2]++;
        else shellCounts[3]++;
      }

      return (
        <div className="relative w-72 h-72 flex items-center justify-center bg-slate-950/50 rounded-full border-2 border-white/10 shadow-2xl overflow-hidden">
          {/* Background Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15)_0%,transparent_70%)]" />
          
          {/* Nucleus */}
          <motion.div 
            initial={false}
            animate={{ scale: 1 }}
            className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center z-20 shadow-[0_0_40px_rgba(99,102,241,0.4)] border-2 border-white/20"
          >
            <span className="text-sm font-black text-white drop-shadow-md">{z}+</span>
          </motion.div>
          
          {shellCounts.map((count, sIdx) => {
            if (count === 0) return null;
            const radius = 50 + sIdx * 30;
            const shellColor = { 0: '#f43f5e', 1: '#f59e0b', 2: '#10b981', 3: '#3b82f6' }[sIdx];
            
            let startIndex = 0;
            for (let i = 0; i < sIdx; i++) startIndex += shellCounts[i];

            return (
              <div 
                key={`shell-${sIdx}`}
                className="absolute border border-white/10 rounded-full pointer-events-none" 
                style={{ width: radius * 2, height: radius * 2 }}
              >
                {[...Array(count)].map((_, eIdx) => {
                  const globalIdx = startIndex + eIdx;
                  const isHighlighted = highlightIndex !== null && (z - 1 - highlightIndex) === globalIdx;
                  
                  const angle = (eIdx / count) * 2 * Math.PI - Math.PI / 2;
                  const x = radius * Math.cos(angle);
                  const y = radius * Math.sin(angle);
                  
                  return (
                    <motion.div
                      key={`electron-${globalIdx}`}
                      layout
                      animate={{ 
                        scale: isHighlighted ? 1.5 : 1,
                        boxShadow: isHighlighted 
                          ? `0 0 20px ${shellColor}`
                          : `0 0 8px ${shellColor}`
                      }}
                      transition={{ 
                        type: 'spring', stiffness: 300, damping: 20
                      }}
                      className="absolute w-4 h-4 rounded-full border border-white/40 z-10"
                      style={{ 
                        left: `calc(50% + ${x}px - 8px)`, 
                        top: `calc(50% + ${y}px - 8px)`,
                        backgroundColor: shellColor
                      }}
                    >
                      {isHighlighted && (
                        <motion.div 
                          className="absolute inset-0 border-2 border-white rounded-full animate-ping"
                        />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            );
          })}
        </div>
      );
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
      if (active && payload && payload.length) {
        const data = payload[0].payload;
        if (view === 'first') {
          return (
            <div className="bg-white p-3 border-2 border-gray-100 rounded-xl shadow-xl">
              <p className="text-[10px] font-black text-gray-400 tracking-widest mb-1">z = {data.z}</p>
              <p className="text-sm font-black text-gray-800">{data.symbol}</p>
              <p className="text-xs font-bold text-indigo-600">1st ie: {data.ie} kj mol⁻¹</p>
            </div>
          );
        } else {
          return (
            <div className="bg-white p-3 border-2 border-gray-100 rounded-xl shadow-xl">
              <p className="text-[10px] font-black text-gray-400 tracking-widest mb-1">{data.num === 1 ? '1st' : data.num === 2 ? '2nd' : data.num === 3 ? '3rd' : `${data.num}th`} ie</p>
              <p className="text-sm font-black text-gray-800">{data.realVal} kj mol⁻¹</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color }} />
                <p className="text-[8px] font-black text-gray-400">shell level</p>
              </div>
            </div>
          );
        }
      }
      return null;
    };

    return (
      <div className="space-y-8">
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-gray-50 p-6 rounded-[2rem] border-2 border-gray-100">
          <div className="flex bg-white p-1 rounded-2xl border-2 border-gray-100 shadow-sm">
            <button
              onClick={() => setView('first')}
              className={`px-6 py-2 rounded-xl text-[10px] font-black transition-all ${view === 'first' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
            >
              1st ie trend
            </button>
            <button
              onClick={() => setView('successive')}
              className={`px-6 py-2 rounded-xl text-[10px] font-black transition-all ${view === 'successive' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
            >
              successive ie
            </button>
          </div>

          {view === 'successive' && (
            <div className="flex-1 w-full max-w-md space-y-4">
              <div className="flex justify-between items-center px-2">
                <span className="text-[10px] font-black text-gray-400">select element</span>
                <span className="text-sm font-black text-indigo-600">{currentElement.symbol} (z={selectedZ})</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="20" 
                value={selectedZ} 
                onChange={(e) => setSelectedZ(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between px-1">
                <span className="text-[8px] font-bold text-gray-400">H</span>
                <span className="text-[8px] font-bold text-gray-400">Ca</span>
              </div>
            </div>
          )}
        </div>

        {/* Main Graph Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] border-2 border-gray-100 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-black text-gray-800 tracking-tight lowercase">
                  {view === 'first' ? '1st ionization energy trend' : `successive ie: ${currentElement.symbol}`}
                </h3>
                <p className="text-[10px] font-bold text-gray-400 tracking-widest lowercase">
                  {view === 'first' ? 'across period 1-3 & start of 4' : `atomic number z = ${currentElement.z}`}
                </p>
              </div>
              {view === 'successive' && (
                <div className="flex gap-4">
                  <div className="text-right">
                    <p className="text-[8px] font-black text-gray-400">group</p>
                    <p className="text-sm font-black text-indigo-600">{currentElement.group}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-black text-gray-400">period</p>
                    <p className="text-sm font-black text-indigo-600">{currentElement.period}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                {view === 'first' ? (
                  <LineChart data={ieData} margin={{ top: 5, right: 20, bottom: 25, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="symbol" 
                      stroke="#94a3b8" 
                      fontSize={10} 
                      fontWeight="bold"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#94a3b8" 
                      fontSize={10} 
                      fontWeight="bold"
                      tickLine={false}
                      axisLine={false}
                      label={{ value: '1st ie (kj/mol)', angle: -90, position: 'insideLeft', fontSize: 10, fontWeight: 'black', offset: 10 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="ie" 
                      stroke="#6366f1" 
                      strokeWidth={4} 
                      dot={{ r: 5, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 7, fill: '#4f46e5' }}
                    />
                  </LineChart>
                ) : (
                  <BarChart data={successiveChartData} margin={{ top: 5, right: 20, bottom: 25, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="num" 
                      stroke="#94a3b8" 
                      fontSize={10} 
                      fontWeight="bold"
                      tickLine={false}
                      axisLine={false}
                      label={{ value: 'electron removed', position: 'insideBottom', offset: -15, fontSize: 10, fontWeight: 'black' }}
                    />
                    <YAxis 
                      stroke="#94a3b8" 
                      fontSize={10} 
                      fontWeight="bold"
                      tickLine={false}
                      axisLine={false}
                      label={{ value: 'log₁₀ ie (kj/mol)', angle: -90, position: 'insideLeft', fontSize: 10, fontWeight: 'black', offset: 10 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="ie" 
                      radius={[6, 6, 0, 0]}
                      onMouseEnter={(_, index) => setHoveredElectron(index)}
                      onMouseLeave={() => setHoveredElectron(null)}
                    >
                      {successiveChartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color}
                          fillOpacity={hoveredElectron === null || hoveredElectron === index ? 1 : 0.3}
                          stroke={hoveredElectron === index ? '#fff' : 'none'}
                          strokeWidth={2}
                          className="transition-all duration-300"
                        />
                      ))}
                    </Bar>
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
            
            {view === 'successive' && (
              <div className="mt-6 flex flex-wrap gap-4 justify-center">
                {[4, 3, 2, 1].map(s => (
                  <div key={s} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: { 1: '#f43f5e', 2: '#f59e0b', 3: '#10b981', 4: '#3b82f6' }[s as 1|2|3|4] }} />
                    <span className="text-[10px] font-black text-gray-400">shell {s}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-slate-900 rounded-[3rem] p-8 text-white flex flex-col items-center justify-center shadow-2xl shadow-slate-200/50 relative overflow-hidden border-2 border-slate-800">
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
              <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-rose-500/20 rounded-full blur-3xl" />
            </div>
            
            <p className="text-[10px] font-black tracking-[0.2em] mb-8 opacity-40 uppercase">atomic visualization</p>
            <BohrModel z={currentElement.z} highlightIndex={hoveredElectron} />
            
            <div className="mt-12 text-center space-y-2">
              <motion.h4 
                key={currentElement.symbol}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-4xl font-black tracking-tighter"
              >
                {currentElement.symbol}
              </motion.h4>
              <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                {currentElement.z} protons • {currentElement.z} electrons
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 w-full">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
                <p className="text-[8px] font-black uppercase opacity-40 mb-1">config</p>
                <p className="text-xs font-bold font-mono">
                  {currentElement.z <= 2 ? '1s' : currentElement.z <= 10 ? '[He] 2s 2p' : currentElement.z <= 18 ? '[Ne] 3s 3p' : '[Ar] 4s'}
                </p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
                <p className="text-[8px] font-black uppercase opacity-40 mb-1">valence</p>
                <p className="text-xs font-bold">
                  {currentElement.group === 18 ? 8 : currentElement.group > 10 ? currentElement.group - 10 : currentElement.group} e⁻
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Explanations Grid - Only show in 1st IE view or as general info */}
        {view === 'first' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* G2 vs G13 Dip */}
            <div className="bg-emerald-50 p-8 rounded-[2.5rem] border-2 border-emerald-100 space-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-500 p-2 rounded-xl text-white">
                  <Zap size={18} />
                </div>
                <h3 className="text-lg font-black text-emerald-900 uppercase tracking-tight">Group 2 vs Group 13</h3>
              </div>
              
              <p className="text-xs font-bold text-emerald-800/70 leading-relaxed">
                1st IE decreases from <span className="font-black">Be (2s²)</span> to <span className="font-black">B (2s² 2p¹)</span>.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 text-[10px] font-black text-emerald-600">Be (G2)</div>
                  <div className="flex gap-1">
                    <div className="w-8 h-8 bg-white border-2 border-emerald-200 rounded-lg flex items-center justify-center relative">
                      <span className="text-[8px] font-black text-emerald-400 absolute -top-4">2s</span>
                      <div className="flex flex-col items-center">
                        <ArrowRight size={12} className="text-rose-500 rotate-[-90deg]" />
                        <ArrowRight size={12} className="text-blue-500 rotate-[90deg]" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 text-[10px] font-black text-emerald-600">B (G13)</div>
                  <div className="flex gap-1">
                    <div className="w-8 h-8 bg-white border-2 border-emerald-200 rounded-lg flex items-center justify-center relative opacity-50">
                      <span className="text-[8px] font-black text-emerald-400 absolute -top-4">2s</span>
                      <div className="flex flex-col items-center">
                        <ArrowRight size={12} className="text-rose-500 rotate-[-90deg]" />
                        <ArrowRight size={12} className="text-blue-500 rotate-[90deg]" />
                      </div>
                    </div>
                    <div className="w-8 h-8 bg-emerald-100 border-2 border-emerald-400 rounded-lg flex items-center justify-center relative ring-2 ring-emerald-500 ring-offset-2">
                      <span className="text-[8px] font-black text-emerald-600 absolute -top-4">2p</span>
                      <ArrowRight size={12} className="text-rose-500 rotate-[-90deg]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white/60 rounded-2xl border border-emerald-200">
                <p className="text-[10px] font-bold text-emerald-900 leading-relaxed">
                  The <span className="font-black">2p electron</span> in Boron is in a higher energy subshell, experiences <span className="font-black">more shielding</span> from the 2s electrons, and is <span className="font-black">further from the nucleus</span>, making it easier to remove.
                </p>
              </div>
            </div>

            {/* G15 vs G16 Dip */}
            <div className="bg-rose-50 p-8 rounded-[2.5rem] border-2 border-rose-100 space-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-rose-500 p-2 rounded-xl text-white">
                  <Zap size={18} />
                </div>
                <h3 className="text-lg font-black text-rose-900 uppercase tracking-tight">Group 15 vs Group 16</h3>
              </div>
              
              <p className="text-xs font-bold text-rose-800/70 leading-relaxed">
                1st IE decreases from <span className="font-black">N (2p³)</span> to <span className="font-black">O (2p⁴)</span>.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 text-[10px] font-black text-rose-600">N (G15)</div>
                  <div className="flex gap-1">
                    <div className="w-6 h-6 bg-white border-2 border-rose-200 rounded-md flex items-center justify-center">
                      <ArrowRight size={10} className="text-rose-500 rotate-[-90deg]" />
                    </div>
                    <div className="w-6 h-6 bg-white border-2 border-rose-200 rounded-md flex items-center justify-center">
                      <ArrowRight size={10} className="text-rose-500 rotate-[-90deg]" />
                    </div>
                    <div className="w-6 h-6 bg-white border-2 border-rose-200 rounded-md flex items-center justify-center">
                      <ArrowRight size={10} className="text-rose-500 rotate-[-90deg]" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 text-[10px] font-black text-rose-600">O (G16)</div>
                  <div className="flex gap-1">
                    <div className="w-6 h-6 bg-rose-100 border-2 border-rose-400 rounded-md flex items-center justify-center ring-2 ring-rose-500 ring-offset-2">
                      <div className="flex flex-col items-center">
                        <ArrowRight size={10} className="text-rose-500 rotate-[-90deg]" />
                        <ArrowRight size={10} className="text-blue-500 rotate-[90deg]" />
                      </div>
                    </div>
                    <div className="w-6 h-6 bg-white border-2 border-rose-200 rounded-md flex items-center justify-center">
                      <ArrowRight size={10} className="text-rose-500 rotate-[-90deg]" />
                    </div>
                    <div className="w-6 h-6 bg-white border-2 border-rose-200 rounded-md flex items-center justify-center">
                      <ArrowRight size={10} className="text-rose-500 rotate-[-90deg]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white/60 rounded-2xl border border-rose-200">
                <p className="text-[10px] font-bold text-rose-900 leading-relaxed">
                  In Oxygen, the <span className="font-black">paired electrons</span> in the 2p orbital experience <span className="font-black">inter-electronic repulsion</span>. This repulsion makes it easier to remove one of the paired electrons compared to the unpaired electrons in Nitrogen.
                </p>
              </div>
            </div>
          </div>
        )}

        {view === 'successive' && (
          <div className="bg-white p-8 rounded-[3rem] border-2 border-gray-100 shadow-sm">
            <h4 className="text-lg font-black text-gray-800 uppercase tracking-tight mb-4">Understanding Successive IE</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                <p className="text-[10px] font-black text-indigo-600 uppercase mb-2">Large Jumps</p>
                <p className="text-xs font-bold text-gray-600">A large jump in IE indicates the removal of an electron from a <span className="font-black">new inner shell</span> closer to the nucleus.</p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <p className="text-[10px] font-black text-emerald-600 uppercase mb-2">Valence Electrons</p>
                <p className="text-xs font-bold text-gray-600">The number of electrons removed <span className="font-black">before</span> the first large jump equals the group number (valence electrons).</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <p className="text-[10px] font-black text-amber-600 uppercase mb-2">General Increase</p>
                <p className="text-xs font-bold text-gray-600">IE always increases as more electrons are removed because the <span className="font-black">effective nuclear charge</span> increases on the remaining electrons.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const RedoxBalancing = () => {
    const [selectedExample, setSelectedExample] = useState(0);

    const steps = [
      { id: 1, title: 'Atoms', desc: 'Balance non-H and non-O atoms by modifying coefficients.', color: 'emerald' },
      { id: 2, title: 'Oxygen', desc: 'Balance oxygen by adding H₂O to the O-deficient side.', color: 'blue' },
      { id: 3, title: 'Hydrogen', desc: 'Balance hydrogen by adding H⁺ to the H-deficient side.', color: 'orange' },
      { id: 4, title: 'Charge', desc: 'Balance charge by adding electrons (e⁻) to the more positive side.', color: 'rose' }
    ];

    const examples = [
      {
        title: 'MnO4 - + Fe2+',
        reduction: [
          { step: 1, eq: 'MnO4 - → Mn2+', note: 'Mn is already balanced.' },
          { step: 2, eq: 'MnO4 - → Mn2+ + <span class="text-blue-500 font-black">4H2O</span>', note: 'Added 4 water molecules to balance 4 oxygens.' },
          { step: 3, eq: 'MnO4 - + <span class="text-orange-500 font-black">8H+</span> → Mn2+ + 4H2O', note: 'Added 8 H+ to balance hydrogen from water.' },
          { step: 4, eq: 'MnO4 - + 8H+ + <span class="text-rose-500 font-black">5e-</span> → Mn2+ + 4H2O', note: 'Total charge (+7 → +2). Added 5e- to reduction side.' }
        ],
        oxidation: [
          { step: 4, eq: 'Fe2+ → Fe3+ + <span class="text-rose-500 font-black">e-</span>', note: 'Charge (+2 → +3). Added 1e- to oxidation side.' }
        ],
        combined: 'MnO4 - + 8H+ + 5Fe2+ → Mn2+ + 4H2O + 5Fe3+',
        multiplier: 'Multiply Oxidation by 5 to cancel 5e-.'
      },
      {
        title: 'Cu + NO3 -',
        reduction: [
          { step: 1, eq: 'NO3 - → NO2', note: 'N is balanced.' },
          { step: 2, eq: 'NO3 - → NO2 + <span class="text-blue-500 font-black">H2O</span>', note: 'Added 1 H2O to balance oxygen.' },
          { step: 3, eq: 'NO3 - + <span class="text-orange-500 font-black">2H+</span> → NO2 + H2O', note: 'Added 2 H+ to balance hydrogen.' },
          { step: 4, eq: 'NO3 - + 2H+ + <span class="text-rose-500 font-black">e-</span> → NO2 + H2O', note: 'Total charge (+1 → 0). Added 1e-.' }
        ],
        oxidation: [
          { step: 4, eq: 'Cu → Cu2+ + <span class="text-rose-500 font-black">2e-</span>', note: 'Charge (0 → +2). Added 2e-.' }
        ],
        combined: 'Cu + 2NO3 - + 4H+ → Cu2+ + 2NO2 + 2H2O',
        multiplier: 'Multiply Reduction by 2 to cancel 2e-.'
      },
      {
        title: 'Cr2O7 2- + Fe2+',
        reduction: [
          { step: 1, eq: '<span class="text-emerald-500 font-black">Cr2</span>O7 2- → <span class="text-emerald-500 font-black">2</span>Cr3+', note: 'Balanced Cr atoms.' },
          { step: 2, eq: 'Cr2O7 2- → 2Cr3+ + <span class="text-blue-500 font-black">7H2O</span>', note: 'Added 7 H2O to balance 7 oxygens.' },
          { step: 3, eq: 'Cr2O7 2- + <span class="text-orange-500 font-black">14H+</span> → 2Cr3+ + 7H2O', note: 'Added 14 H+ to balance hydrogen.' },
          { step: 4, eq: 'Cr2O7 2- + 14H+ + <span class="text-rose-500 font-black">6e-</span> → 2Cr3+ + 7H2O', note: 'Total charge (+12 → +6). Added 6e-.' }
        ],
        oxidation: [
          { step: 4, eq: 'Fe2+ → Fe3+ + <span class="text-rose-500 font-black">e-</span>', note: 'Charge (+2 → +3). Added 1e-.' }
        ],
        combined: 'Cr2O7 2- + 14H+ + 6Fe2+ → 2Cr3+ + 7H2O + 6Fe3+',
        multiplier: 'Multiply Oxidation by 6 to cancel 6e-.'
      },
      {
        title: 'MnO4 - + Cl -',
        reduction: [
          { step: 1, eq: 'MnO4 - → Mn2+', note: 'Mn is balanced.' },
          { step: 2, eq: 'MnO4 - → Mn2+ + <span class="text-blue-500 font-black">4H2O</span>', note: 'Added 4 H2O.' },
          { step: 3, eq: 'MnO4 - + <span class="text-orange-500 font-black">8H+</span> → Mn2+ + 4H2O', note: 'Added 8 H+.' },
          { step: 4, eq: 'MnO4 - + 8H+ + <span class="text-rose-500 font-black">5e-</span> → Mn2+ + 4H2O', note: 'Added 5e-.' }
        ],
        oxidation: [
          { step: 1, eq: '<span class="text-emerald-500 font-black">2</span>Cl - → Cl2', note: 'Balanced Cl atoms.' },
          { step: 4, eq: '2Cl - → Cl2 + <span class="text-rose-500 font-black">2e-</span>', note: 'Total charge (-2 → 0). Added 2e-.' }
        ],
        combined: '2MnO4 - + 16H+ + 10Cl - → 2Mn2+ + 8H2O + 5Cl2',
        multiplier: 'Multiply Red by 2 and Ox by 5 to cancel 10e-.'
      }
    ];

    const current = examples[selectedExample];

    return (
      <div className="space-y-8">
        {/* 2x2 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {steps.map((s) => (
            <div key={s.id} className={`p-6 rounded-3xl border-2 border-${s.color}-100 bg-${s.color}-50/30`}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-6 h-6 rounded-lg bg-${s.color}-500 flex items-center justify-center text-white text-[10px] font-black`}>
                  {s.id}
                </div>
                <h4 className={`text-sm font-black text-${s.color}-700 uppercase tracking-tight`}>{s.title}</h4>
              </div>
              <p className="text-xs font-bold text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Step 5 Banner */}
        <div className="p-6 rounded-3xl border-2 border-indigo-100 bg-indigo-50/30">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-500 flex items-center justify-center text-white text-[10px] font-black">5</div>
            <h4 className="text-sm font-black text-indigo-700 uppercase tracking-tight">Combine & Cancel</h4>
          </div>
          <p className="text-xs font-bold text-gray-500">Multiply half-equations so electrons cancel, then add them together and simplify.</p>
        </div>

        {/* Example Selector */}
        <div className="flex flex-wrap gap-2">
          {examples.map((ex, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedExample(idx)}
              className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all
                ${selectedExample === idx 
                  ? 'bg-gray-800 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}
              `}
              dangerouslySetInnerHTML={{ __html: formatFormula(ex.title) }}
            />
          ))}
        </div>

        {/* Interactive Balancing Display */}
        <div className="bg-gray-50 p-8 rounded-[2.5rem] border-2 border-gray-100">
          <div className="space-y-8">
            {/* Reduction Half-Equation */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="px-3 py-1 bg-rose-100 text-rose-600 rounded-lg text-[10px] font-black uppercase">Reduction</div>
                <div className="h-[1px] flex-1 bg-gray-200" />
              </div>
              <div className="space-y-3">
                {current.reduction.map((s, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={i} 
                    className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm"
                  >
                    <div className="flex-1">
                      <p className="text-lg font-mono font-bold text-gray-800" dangerouslySetInnerHTML={{ __html: formatFormula(s.eq) }} />
                    </div>
                    <div className="sm:w-1/3">
                      <p className="text-[10px] font-bold text-gray-400 italic">{s.note}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Oxidation Half-Equation */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-lg text-[10px] font-black uppercase">Oxidation</div>
                <div className="h-[1px] flex-1 bg-gray-200" />
              </div>
              <div className="space-y-3">
                {current.oxidation.map((s, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={i} 
                    className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm"
                  >
                    <div className="flex-1">
                      <p className="text-lg font-mono font-bold text-gray-800" dangerouslySetInnerHTML={{ __html: formatFormula(s.eq) }} />
                    </div>
                    <div className="sm:w-1/3">
                      <p className="text-[10px] font-bold text-gray-400 italic">{s.note}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Final Combined Equation */}
            <div className="pt-8 border-t-2 border-dashed border-gray-200">
              <div className="bg-indigo-600 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <RefreshCw size={80} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-70">Final Balanced Equation</p>
                <p className="text-xl sm:text-2xl font-mono font-bold mb-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatFormula(current.combined) }} />
                <div className="flex items-center gap-2 text-indigo-200">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-300" />
                  <p className="text-xs font-bold italic">{current.multiplier}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const QuickFacts = () => {
    const [hoveredRule, setHoveredRule] = useState<string | null>(null);
    const [hoveredApparatus, setHoveredApparatus] = useState<string | null>(null);
    const [hoveredMoleEq, setHoveredMoleEq] = useState<number | null>(null);
    const [hoveredPhRegion, setHoveredPhRegion] = useState<'acid' | 'base' | null>(null);
    const [acidStrengthActive, setAcidStrengthActive] = useState(false);
    const [mgActiveStrong, setMgActiveStrong] = useState(false);
    const [mgActiveWeak, setMgActiveWeak] = useState(false);
    const [hoveredReactivity, setHoveredReactivity] = useState<number | null>(null);
    const [selectedSaltPrep, setSelectedSaltPrep] = useState<string | null>(null);
    const [ionicStep, setIonicStep] = useState(0); // 0: Molecular, 1: Complete Ionic, 2: Net Ionic
    const [ionicExampleIndex, setIonicExampleIndex] = useState(0);
    const [selectedBondingSubstance, setSelectedBondingSubstance] = useState<string | null>(null);
    const [bondPolarityType, setBondPolarityType] = useState<'non-polar' | 'polar' | 'ionic'>('non-polar');
    const [sigmaPiType, setSigmaPiType] = useState<'sigma' | 'pi'>('sigma');
    const [sigmaPiStep, setSigmaPiStep] = useState<'before' | 'after'>('before');
    const [vseprDomains, setVseprDomains] = useState(4);
    const [vseprLonePairs, setVseprLonePairs] = useState(0);
    const [lewisExample, setLewisExample] = useState('NH3');
    const [atomicTransitionView, setAtomicTransitionView] = useState<'circles' | 'lines'>('lines');
    const [atomicFrom, setAtomicFrom] = useState(2);
    const [atomicTo, setAtomicTo] = useState(1);
    const [selectedSolubilitySalt, setSelectedSolubilitySalt] = useState<string | null>(null);
    const [electrolyteState, setElectrolyteState] = useState<'solid' | 'molten' | 'aqueous'>('solid');
    const leChatelierReactions: Record<string, any> = {
      haber: {
        id: 'haber',
        name: 'Haber Process',
        equation: (
          <div className="flex justify-center items-center gap-4 text-white font-black text-2xl md:text-4xl tracking-tight text-center">
            <span className="drop-shadow-md">N<sub>2</sub>(g)</span>
            <span className="text-emerald-400">+</span>
            <span className="drop-shadow-md">3H<sub>2</sub>(g)</span>
            <span className="text-emerald-400 mx-2">⇌</span>
            <span className="drop-shadow-md">2NH<sub>3</sub>(g)</span>
          </div>
        ),
        deltaH: -92,
        species: [
          { id: 'n2', label: 'N₂', color: '#10b981', tailwind: 'bg-emerald-500', coeff: 1, type: 'reactant' },
          { id: 'h2', label: 'H₂', color: '#3b82f6', tailwind: 'bg-blue-500', coeff: 3, type: 'reactant' },
          { id: 'nh3', label: 'NH₃', color: '#f59e0b', tailwind: 'bg-orange-500', coeff: 2, type: 'product' }
        ],
        calculateQc: (c: any) => (c.nh3 * c.nh3) / (c.n2 * Math.pow(c.h2, 3)),
        baseKc: 0.0001,
        tempEffect: 'exothermic',
        kcScale: 10000,
        expression: (
          <div className="flex flex-col items-center font-black italic text-sm">
            <div className="pb-1 border-b border-white/50">[NH₃]²</div>
            <div className="pt-1">[N₂][H₂]³</div>
          </div>
        )
      },
      no2: {
        id: 'no2',
        name: 'NO₂ Equilibrium',
        equation: (
          <div className="flex justify-center items-center gap-4 text-white font-black text-2xl md:text-4xl tracking-tight text-center">
            <span className="drop-shadow-md">N<sub>2</sub>O<sub>4</sub>(g)</span>
            <span className="text-emerald-400 mx-2">⇌</span>
            <span className="drop-shadow-md">2NO<sub>2</sub>(g)</span>
          </div>
        ),
        deltaH: 57,
        species: [
          { id: 'n2o4', label: 'N₂O₄', color: '#8b5cf6', tailwind: 'bg-purple-500', coeff: 1, type: 'reactant' },
          { id: 'no2', label: 'NO₂', color: '#b45309', tailwind: 'bg-amber-600', coeff: 2, type: 'product' }
        ],
        calculateQc: (c: any) => (c.no2 * c.no2) / c.n2o4,
        baseKc: 0.1,
        tempEffect: 'endothermic',
        kcScale: 10,
        expression: (
          <div className="flex flex-col items-center font-black italic text-sm">
            <div className="pb-1 border-b border-white/50">[NO₂]²</div>
            <div className="pt-1">[N₂O₄]</div>
          </div>
        )
      },
      hi: {
        id: 'hi',
        name: 'HI Equilibrium',
        equation: (
          <div className="flex justify-center items-center gap-4 text-white font-black text-2xl md:text-4xl tracking-tight text-center">
            <span className="drop-shadow-md">H<sub>2</sub>(g)</span>
            <span className="text-emerald-400">+</span>
            <span className="drop-shadow-md">I<sub>2</sub>(g)</span>
            <span className="text-emerald-400 mx-2">⇌</span>
            <span className="drop-shadow-md">2HI(g)</span>
          </div>
        ),
        deltaH: -9,
        species: [
          { id: 'h2', label: 'H₂', color: '#3b82f6', tailwind: 'bg-blue-500', coeff: 1, type: 'reactant' },
          { id: 'i2', label: 'I₂', color: '#a855f7', tailwind: 'bg-purple-500', coeff: 1, type: 'reactant' },
          { id: 'hi', label: 'HI', color: '#ec4899', tailwind: 'bg-pink-500', coeff: 2, type: 'product' }
        ],
        calculateQc: (c: any) => (c.hi * c.hi) / (c.h2 * c.i2),
        baseKc: 50,
        tempEffect: 'exothermic',
        kcScale: 1,
        expression: (
          <div className="flex flex-col items-center font-black italic text-sm">
            <div className="pb-1 border-b border-white/50">[HI]²</div>
            <div className="pt-1">[H₂][I₂]</div>
          </div>
        )
      }
    };

    const [leChatelierState, setLeChatelierState] = useState({
      reactionId: 'haber' as 'haber' | 'no2' | 'hi',
      concentrations: { n2: 40, h2: 60, nh3: 20, n2o4: 50, no2: 30, i2: 40, hi: 50 } as Record<string, number>,
      temp: 50,
      pressure: 1.0,
      history: [] as any[],
      kc: 1.0
    });

    useEffect(() => {
      const interval = setInterval(() => {
        setLeChatelierState(prev => {
          const reaction = leChatelierReactions[prev.reactionId];
          
          let tempFactor;
          if (reaction.tempEffect === 'exothermic') {
            tempFactor = Math.pow(0.2, (prev.temp - 50) / 50);
          } else {
            tempFactor = Math.pow(5, (prev.temp - 50) / 50);
          }
          const targetKc = reaction.baseKc * tempFactor;
          const currentQc = reaction.calculateQc(prev.concentrations);
          
          const diff = targetKc - currentQc;
          const multipliers: Record<string, number> = { haber: 10000, no2: 10, hi: 0.1 };
          const shift = diff * (multipliers[prev.reactionId] || 1); 
          
          const maxShift = 0.5;
          const clampedShift = Math.max(-maxShift, Math.min(maxShift, shift));

          const nextConcentrations = { ...prev.concentrations };
          reaction.species.forEach((s: any) => {
            const change = s.type === 'product' ? (s.coeff * clampedShift) : (-s.coeff * clampedShift);
            nextConcentrations[s.id] = Math.max(0.1, nextConcentrations[s.id] + change);
          });

          const historyPoint: any = { time: Date.now() };
          reaction.species.forEach((s: any) => {
            historyPoint[s.id] = Math.round(nextConcentrations[s.id] * 10) / 10;
          });

          const newHistory = [...prev.history, historyPoint].slice(-40);

          return {
            ...prev,
            concentrations: nextConcentrations,
            kc: targetKc * reaction.kcScale,
            history: newHistory
          };
        });
      }, 100);
      return () => clearInterval(interval);
    }, []);

    const saltPrepData = {
      'NaCl': { soluble: true, group1: true, method: 'Titration' },
      'CuSO4': { soluble: true, group1: false, method: 'Excess Solid' },
      'AgCl': { soluble: false, group1: false, method: 'Precipitation' }
    };

    const apparatusData = [
      { 
        id: 'burette', 
        name: 'Burette', 
        accuracy: 'Accurate', 
        volume: 'Variable',
        use: 'Accurate + Variable volume',
        svg: (
          <svg viewBox="0 0 40 100" className="w-full h-32 text-sky-500">
            <rect x="18" y="5" width="4" height="80" fill="none" stroke="currentColor" strokeWidth="1.5" />
            {[...Array(15)].map((_, i) => (
              <line key={i} x1="18" y1={10 + i * 5} x2={i % 5 === 0 ? "22" : "20"} y2={10 + i * 5} stroke="currentColor" strokeWidth="0.5" />
            ))}
            <circle cx="20" cy="88" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <line x1="20" y1="91" x2="20" y2="100" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        )
      },
      { 
        id: 'pipette', 
        name: 'Pipette', 
        accuracy: 'Accurate', 
        volume: 'Fixed',
        use: 'Accurate + Fixed volume',
        svg: (
          <svg viewBox="0 0 40 100" className="w-full h-32 text-emerald-500">
            <rect x="19" y="5" width="2" height="35" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <ellipse cx="20" cy="55" rx="8" ry="15" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <rect x="19" y="75" width="2" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <line x1="18" y1="20" x2="22" y2="20" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        )
      },
      { 
        id: 'cylinder', 
        name: 'Measuring Cylinder', 
        accuracy: 'Rough', 
        volume: 'Variable',
        use: 'Rough + Variable volume',
        svg: (
          <svg viewBox="0 0 40 100" className="w-full h-32 text-amber-500">
            <path d="M 12 10 L 12 90 Q 12 95 20 95 Q 28 95 28 90 L 28 10" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <rect x="8" y="95" width="24" height="3" rx="1.5" fill="currentColor" />
            {[...Array(8)].map((_, i) => (
              <line key={i} x1="12" y1={20 + i * 10} x2="18" y2={20 + i * 10} stroke="currentColor" strokeWidth="0.8" />
            ))}
          </svg>
        )
      }
    ];

    const reactivityElements = [
      { symbol: 'K', name: 'Potassium' },
      { symbol: 'Na', name: 'Sodium' },
      { symbol: 'Ca', name: 'Calcium' },
      { symbol: 'Mg', name: 'Magnesium' },
      { symbol: 'Al', name: 'Aluminium' },
      { symbol: 'C', name: 'Carbon', color: 'text-emerald-500' },
      { symbol: 'Zn', name: 'Zinc' },
      { symbol: 'Fe', name: 'Iron' },
      { symbol: 'Pb', name: 'Lead' },
      { symbol: 'H', name: 'Hydrogen', color: 'text-rose-500' },
      { symbol: 'Cu', name: 'Copper' },
      { symbol: 'Ag', name: 'Silver' },
      { symbol: 'Au', name: 'Gold' },
    ];

    const ParticleBox = ({ state }: { state: 'solid' | 'liquid' | 'gas' }) => {
      if (state === 'solid') {
        return (
          <div className="grid grid-cols-4 gap-1 p-2">
            {[...Array(16)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ x: [0, 1, -1, 0], y: [0, -1, 1, 0] }}
                transition={{ duration: 0.1, repeat: Infinity }}
                className="w-3 h-3 bg-gray-400 rounded-full"
              />
            ))}
          </div>
        );
      }
      if (state === 'liquid') {
        return (
          <div className="relative w-full h-full">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ 
                  x: [Math.random() * 40, Math.random() * 40], 
                  y: [Math.random() * 40, Math.random() * 40] 
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatType: "reverse" }}
                className="absolute w-3 h-3 bg-sky-400 rounded-full"
                style={{ left: `${(i % 4) * 20 + 10}%`, top: `${Math.floor(i / 4) * 20 + 10}%` }}
              />
            ))}
          </div>
        );
      }
      return (
        <div className="relative w-full h-full">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                x: [Math.random() * 60 - 30, Math.random() * 60 - 30], 
                y: [Math.random() * 60 - 30, Math.random() * 60 - 30] 
              }}
              transition={{ duration: 0.5, repeat: Infinity, ease: "linear", repeatType: "reverse" }}
              className="absolute w-2 h-2 bg-orange-400 rounded-full"
              style={{ left: `${Math.random() * 60 + 20}%`, top: `${Math.random() * 60 + 20}%` }}
            />
          ))}
        </div>
      );
    };

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-gray-50 pb-32"
      >
        <header className="bg-white border-b-2 border-gray-200 p-6 sticky top-0 z-10">
          <div className="max-w-2xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tighter">Quick Facts</h1>
              <p className="text-emerald-500 font-bold text-xs uppercase tracking-widest">Essential Chemistry Knowledge</p>
            </div>
            <div className="bg-emerald-100 text-emerald-600 p-3 rounded-2xl">
              <BookOpen size={28} />
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto p-6 space-y-12">
          <div className="max-w-2xl mx-auto space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white border-2 border-gray-200 rounded-[2.5rem] p-8 shadow-[0_8px_0_0_rgba(0,0,0,0.05)] overflow-hidden"
            >
            <div className="flex items-center gap-4 mb-12">
              <div className="bg-sky-100 p-3 rounded-2xl text-sky-600">
                <Thermometer size={24} />
              </div>
              <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">State Change</h2>
            </div>

            <div className="relative w-full max-w-2xl mx-auto mb-8 h-[300px]">
              <div className="absolute inset-0 flex items-center justify-between px-4">
                {/* SVG for arrows */}
                <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" viewBox="0 0 600 300">
                  <defs>
                    <marker id="arrowhead-blue" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
                    </marker>
                    <marker id="arrowhead-red" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
                    </marker>
                  </defs>
                  
                  {/* Solid to Liquid (Melting) */}
                  <path d="M 140 130 Q 200 110 260 130" fill="none" stroke="#3b82f6" strokeWidth="3" markerEnd="url(#arrowhead-blue)" />
                  {/* Liquid to Solid (Freezing) */}
                  <path d="M 260 170 Q 200 190 140 170" fill="none" stroke="#ef4444" strokeWidth="3" markerEnd="url(#arrowhead-red)" />
                  
                  {/* Liquid to Gas (Boiling) */}
                  <path d="M 340 130 Q 400 110 460 130" fill="none" stroke="#3b82f6" strokeWidth="3" markerEnd="url(#arrowhead-blue)" />
                  {/* Gas to Liquid (Condensing) */}
                  <path d="M 460 170 Q 400 190 340 170" fill="none" stroke="#ef4444" strokeWidth="3" markerEnd="url(#arrowhead-red)" />
                  
                  {/* Solid to Gas (Sublimating) */}
                  <path d="M 100 100 Q 300 20 500 100" fill="none" stroke="#3b82f6" strokeWidth="3" markerEnd="url(#arrowhead-blue)" />
                  {/* Gas to Solid (Depositing) */}
                  <path d="M 500 200 Q 300 280 100 200" fill="none" stroke="#ef4444" strokeWidth="3" markerEnd="url(#arrowhead-red)" />
                </svg>

                {/* Labels for transitions */}
                <div className="absolute top-[95px] left-[180px] text-[10px] font-black text-blue-500 uppercase">Melting</div>
                <div className="absolute top-[185px] left-[180px] text-[10px] font-black text-red-500 uppercase">Freezing</div>
                
                <div className="absolute top-[95px] right-[180px] text-[10px] font-black text-blue-500 uppercase">Boiling</div>
                <div className="absolute top-[185px] right-[180px] text-[10px] font-black text-red-500 uppercase">Condensing</div>
                
                <div className="absolute top-[35px] left-1/2 -translate-x-1/2 text-[10px] font-black text-blue-500 uppercase">Sublimating</div>
                <div className="absolute bottom-[35px] left-1/2 -translate-x-1/2 text-[10px] font-black text-red-500 uppercase">Depositing</div>

                {/* States */}
                {/* Solid (Left) */}
                <div className="flex flex-col items-center z-10">
                  <div className="w-24 h-24 bg-gray-50 rounded-2xl border-2 border-gray-100 flex items-center justify-center overflow-hidden relative">
                    <ParticleBox state="solid" />
                  </div>
                  <span className="mt-2 font-black text-gray-800 uppercase tracking-widest text-sm">Solid</span>
                </div>

                {/* Liquid (Middle) */}
                <div className="flex flex-col items-center z-10">
                  <div className="w-24 h-24 bg-sky-50 rounded-2xl border-2 border-sky-100 flex items-center justify-center overflow-hidden relative">
                    <ParticleBox state="liquid" />
                  </div>
                  <span className="mt-2 font-black text-gray-800 uppercase tracking-widest text-sm">Liquid</span>
                </div>

                {/* Gas (Right) */}
                <div className="flex flex-col items-center z-10">
                  <div className="w-24 h-24 bg-orange-50 rounded-2xl border-2 border-orange-100 flex items-center justify-center overflow-hidden relative">
                    <ParticleBox state="gas" />
                  </div>
                  <span className="mt-2 font-black text-gray-800 uppercase tracking-widest text-sm">Gas</span>
                </div>
              </div>
            </div>
            
            <div className="mt-12 grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-2xl border-2 border-blue-100">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Endothermic</p>
                <p className="text-xs font-bold text-gray-600">Energy is absorbed (Melting, Boiling, Sublimating).</p>
              </div>
              <div className="bg-red-50 p-4 rounded-2xl border-2 border-red-100">
                <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">Exothermic</p>
                <p className="text-xs font-bold text-gray-600">Energy is released (Freezing, Condensing, Depositing).</p>
              </div>
            </div>
          </motion.div>











          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white border-2 border-gray-200 rounded-[2.5rem] p-8 shadow-[0_8px_0_0_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center gap-4 mb-12">
              <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600">
                <Layers size={24} />
              </div>
              <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Electronic Configuration</h2>
            </div>
            <ElectronicConfiguration />
          </motion.div>


          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border-2 border-gray-200 rounded-[2.5rem] p-8 shadow-[0_8px_0_0_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-rose-100 p-3 rounded-2xl text-rose-600">
                  <Flame size={24} />
                </div>
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Strength of Acids</h2>
              </div>
              <button 
                onClick={() => {
                  setAcidStrengthActive(!acidStrengthActive);
                  if (acidStrengthActive) {
                    setMgActiveStrong(false);
                    setMgActiveWeak(false);
                  }
                }}
                className={`px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2
                  ${acidStrengthActive ? 'bg-rose-500 text-white shadow-[0_4px_0_0_#be123c]' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}
                `}
              >
                {acidStrengthActive ? <RefreshCw size={14} /> : <Zap size={14} />}
                {acidStrengthActive ? 'Reset' : 'Dissociate'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Strong Acid (HCl) */}
              <div className="bg-gray-50 rounded-[2rem] p-6 border-2 border-gray-100 flex flex-col items-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Strong Acid (HCl)</p>
                
                <div className="relative w-full h-48 border-x-2 border-b-2 border-gray-300 rounded-b-2xl bg-sky-50/30 mb-6 overflow-hidden">
                  {/* Water level */}
                  <div className="absolute bottom-0 w-full h-32 bg-sky-100/40 border-t-2 border-sky-200" />
                  
                  {/* Bubbles for Mg reaction */}
                  {mgActiveStrong && [...Array(15)].map((_, i) => (
                    <Bubble key={`bubble-strong-${i}`} i={i} rate={2} />
                  ))}

                  {/* Mg Ribbon */}
                  {mgActiveStrong && (
                    <motion.div 
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 120, opacity: 1 }}
                      className="absolute left-1/2 -translate-x-1/2 w-8 h-2 bg-gray-400 rounded-sm shadow-sm z-10 border border-gray-500"
                    />
                  )}
                  
                  {/* Molecules */}
                  {[...Array(5)].map((_, i) => (
                    <AcidMolecule key={`hcl-${i}`} i={i} active={acidStrengthActive} type="strong" />
                  ))}
                </div>

                <div className="w-full space-y-6">
                  <div className="text-center">
                    <p className="text-lg font-black text-gray-800">
                      HCl → <span className="text-rose-500">H<sup>+</sup></span> + Cl<sup>-</sup>
                    </p>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1">Complete Dissociation</p>
                  </div>

                  {/* Species Distribution Chart */}
                  <div className="bg-white/50 rounded-2xl p-4 border border-gray-100">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-3 text-center">Species in Solution</p>
                    <div className="flex gap-4 h-16 items-end justify-center">
                      <div className="flex flex-col items-center gap-1">
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: acidStrengthActive ? 0 : 40 }}
                          className="w-6 bg-gray-200 rounded-t-lg"
                        />
                        <span className="text-[7px] font-bold text-gray-400">HCl</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: acidStrengthActive ? 40 : 0 }}
                          className="w-6 bg-rose-400 rounded-t-lg"
                        />
                        <span className="text-[7px] font-bold text-rose-400">H⁺ + Cl⁻</span>
                      </div>
                    </div>
                  </div>

                  {/* Properties Section */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-200 pb-1">Physical</p>
                      <div className="space-y-2">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-bold text-gray-500 uppercase">pH</span>
                          <span className="text-[10px] font-black text-rose-600">Lower (1-2)</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] font-bold text-gray-500 uppercase">Conductivity</span>
                          <span className="text-[10px] font-black text-emerald-600">Higher</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-200 pb-1">Chemical</p>
                      <div className="space-y-2">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-bold text-gray-500 uppercase">Reactivity (Mg)</span>
                          <span className="text-[10px] font-black text-rose-600">Higher Rate</span>
                        </div>
                        <button 
                          disabled={!acidStrengthActive}
                          onClick={() => setMgActiveStrong(!mgActiveStrong)}
                          className={`mt-1 px-3 py-1 rounded-lg text-[8px] font-black uppercase transition-all
                            ${!acidStrengthActive ? 'bg-gray-100 text-gray-300' : 
                              mgActiveStrong ? 'bg-rose-500 text-white' : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'}
                          `}
                        >
                          {mgActiveStrong ? 'Remove Mg' : 'Add Mg'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weak Acid (CH3COOH) */}
              <div className="bg-gray-50 rounded-[2rem] p-6 border-2 border-gray-100 flex flex-col items-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Weak Acid (CH₃COOH)</p>
                
                <div className="relative w-full h-48 border-x-2 border-b-2 border-gray-300 rounded-b-2xl bg-sky-50/30 mb-6 overflow-hidden">
                  {/* Water level */}
                  <div className="absolute bottom-0 w-full h-32 bg-sky-100/40 border-t-2 border-sky-200" />
                  
                  {/* Bubbles for Mg reaction */}
                  {mgActiveWeak && [...Array(5)].map((_, i) => (
                    <Bubble key={`bubble-weak-${i}`} i={i} rate={0.5} />
                  ))}

                  {/* Mg Ribbon */}
                  {mgActiveWeak && (
                    <motion.div 
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 120, opacity: 1 }}
                      className="absolute left-1/2 -translate-x-1/2 w-8 h-2 bg-gray-400 rounded-sm shadow-sm z-10 border border-gray-500"
                    />
                  )}
                  
                  {/* Molecules */}
                  {[...Array(5)].map((_, i) => (
                    <AcidMolecule key={`ch3cooh-${i}`} i={i} active={acidStrengthActive} type="weak" />
                  ))}
                </div>

                <div className="w-full space-y-6">
                  <div className="text-center">
                    <p className="text-lg font-black text-gray-800">
                      CH<sub>3</sub>COOH ⇌ CH<sub>3</sub>COO<sup>-</sup> + <span className="text-rose-500">H<sup>+</sup></span>
                    </p>
                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mt-1">Partial Dissociation</p>
                  </div>

                  {/* Species Distribution Chart */}
                  <div className="bg-white/50 rounded-2xl p-4 border border-gray-100">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-3 text-center">Species in Solution</p>
                    <div className="flex gap-4 h-16 items-end justify-center">
                      <div className="flex flex-col items-center gap-1">
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: acidStrengthActive ? 32 : 40 }}
                          className="w-6 bg-gray-200 rounded-t-lg"
                        />
                        <span className="text-[7px] font-bold text-gray-400">HA</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: acidStrengthActive ? 8 : 0 }}
                          className="w-6 bg-rose-400 rounded-t-lg"
                        />
                        <span className="text-[7px] font-bold text-rose-400">H⁺ + A⁻</span>
                      </div>
                    </div>
                  </div>

                  {/* Properties Section */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-200 pb-1">Physical</p>
                      <div className="space-y-2">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-bold text-gray-500 uppercase">pH</span>
                          <span className="text-[10px] font-black text-amber-600">Higher (3-5)</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] font-bold text-gray-500 uppercase">Conductivity</span>
                          <span className="text-[10px] font-black text-amber-600">Lower</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-200 pb-1">Chemical</p>
                      <div className="space-y-2">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-bold text-gray-500 uppercase">Reactivity (Mg)</span>
                          <span className="text-[10px] font-black text-amber-600">Lower Rate</span>
                        </div>
                        <button 
                          disabled={!acidStrengthActive}
                          onClick={() => setMgActiveWeak(!mgActiveWeak)}
                          className={`mt-1 px-3 py-1 rounded-lg text-[8px] font-black uppercase transition-all
                            ${!acidStrengthActive ? 'bg-gray-100 text-gray-300' : 
                              mgActiveWeak ? 'bg-rose-500 text-white' : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'}
                          `}
                        >
                          {mgActiveWeak ? 'Remove Mg' : 'Add Mg'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white border-2 border-gray-200 rounded-[2.5rem] p-8 shadow-[0_8px_0_0_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600">
                  <Layers size={24} />
                </div>
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Bonding & Structure</h2>
              </div>
              <div className="flex gap-2">
                {[
                  { id: 'Na', label: 'Na' },
                  { id: 'He', label: 'He' },
                  { id: 'NaCl', label: 'NaCl' },
                  { id: 'Diamond', label: 'Diamond' },
                  { id: 'H2O', label: 'H₂O' }
                ].map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedBondingSubstance(selectedBondingSubstance === sub.id ? null : sub.id)}
                    className={`px-4 py-2 rounded-xl font-black text-[10px] tracking-widest transition-all active:scale-95
                      ${selectedBondingSubstance === sub.id 
                        ? 'bg-indigo-500 text-white shadow-[0_4px_0_0_#4338ca]' 
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}
                    `}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {/* Simple Substances */}
              <div className={`p-6 rounded-[2rem] border-2 transition-all duration-500 ${
                ['He', 'H2O'].includes(selectedBondingSubstance || '') 
                ? 'bg-sky-50 border-sky-200 shadow-lg scale-[1.01]' 
                : 'bg-gray-50 border-gray-100 opacity-60'
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight">Simple Substances</h3>
                    <p className="text-[10px] font-bold text-sky-500 uppercase tracking-widest">Low M.P. & B.P.</p>
                  </div>
                </div>
                
                <SimpleSubstanceDrawing />

                <div className="grid grid-cols-2 gap-6 mt-6">
                  {/* Simple Atoms */}
                  <div className={`p-6 rounded-2xl border-2 transition-all ${
                    selectedBondingSubstance === 'He' 
                    ? 'bg-white border-sky-400 shadow-md' 
                    : 'bg-gray-100/50 border-transparent'
                  }`}>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Simple Atoms</p>
                    <SimpleAtomDrawing />
                    <div className="mt-4 space-y-1">
                      <p className="text-[9px] font-black text-gray-800 uppercase">Gas (Low M.P.)</p>
                      <p className="text-[9px] font-black text-rose-500 uppercase">Insulator in all states</p>
                    </div>
                  </div>

                  {/* Simple Molecules */}
                  <div className={`p-6 rounded-2xl border-2 transition-all ${
                    selectedBondingSubstance === 'H2O' 
                    ? 'bg-white border-sky-400 shadow-md' 
                    : 'bg-gray-100/50 border-transparent'
                  }`}>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Simple Molecules</p>
                    <SimpleMoleculeDrawing />
                    <div className="mt-4 space-y-1">
                      <p className="text-[9px] font-black text-gray-800 uppercase">Mostly Gas/Liquid</p>
                      <p className="text-[9px] font-black text-rose-500 uppercase">Insulator in all states</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Giant Substances */}
              <div className={`p-6 rounded-[2rem] border-2 transition-all duration-500 ${
                ['Na', 'NaCl', 'Diamond'].includes(selectedBondingSubstance || '') 
                ? 'bg-rose-50 border-rose-200 shadow-lg scale-[1.01]' 
                : 'bg-gray-50 border-gray-100 opacity-60'
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight">Giant Substances</h3>
                    <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">High M.P. & B.P.</p>
                  </div>
                </div>

                <GiantSubstanceDrawing />

                <div className="grid grid-cols-3 gap-4 mt-6">
                  {/* Giant Ionic */}
                  <div className={`p-4 rounded-2xl border-2 transition-all ${
                    selectedBondingSubstance === 'NaCl' 
                    ? 'bg-white border-rose-400 shadow-md' 
                    : 'bg-gray-100/50 border-transparent'
                  }`}>
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-3">Giant Ionic</p>
                    <GiantIonicDrawing />
                    <div className="mt-3 space-y-1">
                      <p className="text-[8px] font-black text-gray-800 uppercase">Solid (Brittle)</p>
                      <p className="text-[8px] font-black text-amber-600 uppercase">Cond. (Molten/Aq)</p>
                    </div>
                  </div>

                  {/* Giant Metallic */}
                  <div className={`p-4 rounded-2xl border-2 transition-all ${
                    selectedBondingSubstance === 'Na' 
                    ? 'bg-white border-rose-400 shadow-md' 
                    : 'bg-gray-100/50 border-transparent'
                  }`}>
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-3">Giant Metallic</p>
                    <GiantMetallicDrawing />
                    <div className="mt-3 space-y-1">
                      <p className="text-[8px] font-black text-gray-800 uppercase">Malleable/Ductile</p>
                      <p className="text-[8px] font-black text-emerald-600 uppercase">Conductor (All)</p>
                    </div>
                  </div>

                  {/* Giant Covalent */}
                  <div className={`p-4 rounded-2xl border-2 transition-all ${
                    selectedBondingSubstance === 'Diamond' 
                    ? 'bg-white border-rose-400 shadow-md' 
                    : 'bg-gray-100/50 border-transparent'
                  }`}>
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-3">Giant Covalent</p>
                    <GiantCovalentDrawing />
                    <div className="mt-3 space-y-1">
                      <p className="text-[8px] font-black text-gray-800 uppercase">Hard (Diamond)</p>
                      <p className="text-[8px] font-black text-rose-500 uppercase">Insulator (D)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white border-2 border-gray-200 rounded-[2.5rem] p-8 shadow-[0_8px_0_0_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600">
                  <Activity size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Bond Polarity</h2>
                  <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Electronegativity & Bond Type</p>
                </div>
              </div>
              <div className="flex bg-gray-100 p-1 rounded-xl">
                {(['non-polar', 'polar', 'ionic'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setBondPolarityType(t)}
                    className={`px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all
                      ${bondPolarityType === t ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}
                    `}
                  >
                    {t.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <BondPolarityDrawing type={bondPolarityType} />
              
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-3xl border-2 border-gray-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Zap size={40} className="text-indigo-600" />
                  </div>
                  <div className="relative z-10">
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">Electronegativity Difference (Δχ)</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-gray-800">
                        {bondPolarityType === 'non-polar' ? '< 0.4' : bondPolarityType === 'polar' ? '0.4 – 1.8' : '> 1.8'}
                      </span>
                      <span className="text-xs font-bold text-gray-400 uppercase">Paulings</span>
                    </div>
                    <p className="text-sm font-bold text-gray-600 mt-4 leading-relaxed">
                      {bondPolarityType === 'non-polar' 
                        ? 'Electrons are shared equally between atoms. No partial charges exist.' 
                        : bondPolarityType === 'polar' 
                        ? 'Electrons are shared unequally. The more electronegative atom pulls density, creating dipoles.' 
                        : 'Electrons are completely transferred from the metal to the non-metal, forming electrostatic attraction.'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Example', value: bondPolarityType === 'non-polar' ? 'Cl₂' : bondPolarityType === 'polar' ? 'HCl' : 'NaCl' },
                    { label: 'Bond Type', value: bondPolarityType === 'non-polar' ? 'Pure Cov.' : bondPolarityType === 'polar' ? 'Polar Cov.' : 'Ionic' },
                    { label: 'Particles', value: bondPolarityType === 'ionic' ? 'Ions' : 'Molecules' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white border-2 border-gray-100 p-4 rounded-2xl text-center">
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                      <p className="text-xs font-black text-gray-800 uppercase">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38 }}
            className="bg-white border-2 border-gray-200 rounded-[2.5rem] p-8 shadow-[0_8px_0_0_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600">
                  <Layers size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Sigma vs Pi Bonds</h2>
                  <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Orbital Overlap Mechanisms</p>
                </div>
              </div>
              <div className="flex bg-gray-100 p-1 rounded-xl">
                {(['sigma', 'pi'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => { setSigmaPiType(t); setSigmaPiStep('before'); }}
                    className={`px-6 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all
                      ${sigmaPiType === t ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}
                    `}
                  >
                    {t} Bond
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <SigmaPiBondDrawing type={sigmaPiType} step={sigmaPiStep} />
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setSigmaPiStep('before')}
                    className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border-2
                      ${sigmaPiStep === 'before' ? 'bg-indigo-600 text-white border-indigo-700 shadow-lg' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'}
                    `}
                  >
                    Before Overlap
                  </button>
                  <button
                    onClick={() => setSigmaPiStep('after')}
                    className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border-2
                      ${sigmaPiStep === 'after' ? 'bg-indigo-600 text-white border-indigo-700 shadow-lg' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'}
                    `}
                  >
                    After Overlap
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-3xl border-2 border-gray-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Zap size={40} className="text-indigo-600" />
                  </div>
                  <div className="relative z-10">
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">Formation Mechanism</p>
                    <h3 className="text-xl font-black text-gray-800 uppercase mb-4">
                      {sigmaPiType === 'sigma' ? 'Axial Overlap' : 'Sideways Overlap'}
                    </h3>
                    <p className="text-sm font-bold text-gray-600 leading-relaxed">
                      {sigmaPiType === 'sigma' 
                        ? 'Formed by the head-on (axial) overlap of atomic orbitals along the internuclear axis. This allows for free rotation around the bond.' 
                        : 'Formed by the lateral (sideways) overlap of two parallel p-orbitals (py or pz). This overlap occurs above and below the internuclear axis, preventing free rotation.'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white border-2 border-gray-100 p-4 rounded-2xl">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Strength</p>
                    <p className="text-xs font-black text-gray-800 uppercase">{sigmaPiType === 'sigma' ? 'Stronger' : 'Weaker'}</p>
                  </div>
                  <div className="bg-white border-2 border-gray-100 p-4 rounded-2xl">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Electron Density</p>
                    <p className="text-xs font-black text-gray-800 uppercase">{sigmaPiType === 'sigma' ? 'On Axis' : 'Above/Below Axis'}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.39 }}
            className="bg-white border-2 border-gray-200 rounded-[2.5rem] p-8 shadow-[0_8px_0_0_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600">
                  <Box size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">VSEPR Theory</h2>
                  <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Valence Shell Electron Pair Repulsion</p>
                </div>
              </div>
              <div className="flex bg-gray-100 p-1 rounded-xl">
                {[2, 3, 4, 5, 6].map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      setVseprDomains(d);
                      setVseprLonePairs(0);
                    }}
                    className={`w-10 h-10 rounded-lg font-black text-[10px] uppercase transition-all
                      ${vseprDomains === d ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}
                    `}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <VSEPRDrawing domains={vseprDomains} lonePairs={vseprLonePairs} />
                <div className="flex flex-col gap-4">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Number of Lone Pairs</p>
                  <div className="flex justify-center gap-2">
                    {[...Array(vseprDomains - 1)].map((_, i) => {
                      // Limit lone pairs based on common VSEPR cases
                      const maxLonePairs: Record<number, number> = { 2: 0, 3: 1, 4: 2, 5: 3, 6: 2 };
                      if (i > maxLonePairs[vseprDomains]) return null;
                      
                      return (
                        <button
                          key={i}
                          onClick={() => setVseprLonePairs(i)}
                          className={`w-12 py-2 rounded-xl font-black text-xs transition-all border-2
                            ${vseprLonePairs === i ? 'bg-indigo-600 text-white border-indigo-700 shadow-lg' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'}
                          `}
                        >
                          {i}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {(() => {
                  const data: Record<number, Record<number, { molecular: string, electron: string, example: string }>> = {
                    2: { 0: { molecular: "Linear", electron: "Linear", example: "CO₂" } },
                    3: { 
                      0: { molecular: "Trigonal Planar", electron: "Trigonal Planar", example: "BF₃" },
                      1: { molecular: "Bent", electron: "Trigonal Planar", example: "SO₂" }
                    },
                    4: {
                      0: { molecular: "Tetrahedral", electron: "Tetrahedral", example: "CH₄" },
                      1: { molecular: "Trigonal Pyramidal", electron: "Tetrahedral", example: "NH₃" },
                      2: { molecular: "Bent", electron: "Tetrahedral", example: "H₂O" }
                    },
                    5: {
                      0: { molecular: "Trigonal Bipyramidal", electron: "Trigonal Bipyramidal", example: "PCl₅" },
                      1: { molecular: "Seesaw", electron: "Trigonal Bipyramidal", example: "SF₄" },
                      2: { molecular: "T-shaped", electron: "Trigonal Bipyramidal", example: "ClF₃" },
                      3: { molecular: "Linear", electron: "Trigonal Bipyramidal", example: "XeF₂" }
                    },
                    6: {
                      0: { molecular: "Octahedral", electron: "Octahedral", example: "SF₆" },
                      1: { molecular: "Square Pyramidal", electron: "Octahedral", example: "BrF₅" },
                      2: { molecular: "Square Planar", electron: "Octahedral", example: "XeF₄" }
                    }
                  };
                      const current = data[vseprDomains]?.[vseprLonePairs] || data[vseprDomains][0];

                      const getBondAngle = (d: number, lp: number) => {
                        if (d === 2) return "180°";
                        if (d === 3) {
                          if (lp === 0) return "120°";
                          return "≈ 118°"; // 120 - 2
                        }
                        if (d === 4) {
                          if (lp === 0) return "109.5°";
                          if (lp === 1) return "≈ 107.5°"; // 109.5 - 2
                          return "≈ 105.5°"; // 109.5 - 4
                        }
                        if (d === 5) {
                          if (lp === 0) return "120° & 90°";
                          if (lp === 1) return "< 120° & < 90°";
                          if (lp === 2) return "< 90°";
                          if (lp === 3) return "180°";
                        }
                        if (d === 6) {
                          if (lp === 0) return "90°";
                          if (lp === 1) return "< 90°";
                          if (lp === 2) return "90°";
                        }
                        return "N/A";
                      };

                      return (
                        <>
                          <div className="bg-gray-50 p-6 rounded-3xl border-2 border-gray-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                              <Atom size={40} className="text-indigo-600" />
                            </div>
                            <div className="relative z-10">
                              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">Molecular Geometry</p>
                              <h3 className="text-2xl font-black text-gray-800 uppercase mb-1">{current.molecular}</h3>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                                Electron Domain Geometry: <span className="text-indigo-500">{current.electron}</span>
                              </p>
                              
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="flex items-center gap-4 p-3 bg-white rounded-2xl border border-gray-100">
                                  <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                                    <FlaskConical size={16} />
                                  </div>
                                  <div>
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Example</p>
                                    <p className="text-sm font-black text-gray-800" dangerouslySetInnerHTML={{ __html: current.example.replace(/(\d+)/g, '<sub>$1</sub>') }} />
                                  </div>
                                </div>
                                <div className="flex items-center gap-4 p-3 bg-white rounded-2xl border border-gray-100">
                                  <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                                    <TrendingUp size={16} />
                                  </div>
                                  <div>
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Bond Angle</p>
                                    <p className="text-sm font-black text-gray-800">{getBondAngle(vseprDomains, vseprLonePairs)}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white border-2 border-gray-100 p-4 rounded-2xl">
                          <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Bonding Domains</p>
                          <p className="text-lg font-black text-gray-800">{vseprDomains - vseprLonePairs}</p>
                        </div>
                        <div className="bg-white border-2 border-gray-100 p-4 rounded-2xl">
                          <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Lone Pairs</p>
                          <p className="text-lg font-black text-indigo-600">{vseprLonePairs}</p>
                        </div>
                      </div>

                      <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                        <p className="text-[10px] font-bold text-indigo-700 leading-relaxed">
                          <span className="font-black uppercase tracking-widest mr-2">Pro Tip:</span>
                          Lone pairs occupy more space than bonding pairs, causing bond angles to decrease slightly from the ideal values.
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.395 }}
            className="bg-white border-2 border-gray-200 rounded-[2.5rem] p-8 shadow-[0_8px_0_0_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600">
                  <List size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Lewis Structure</h2>
                  <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Step-by-Step Bond Calculation</p>
                </div>
              </div>
              <div className="flex bg-gray-100 p-1 rounded-xl overflow-x-auto max-w-[200px] sm:max-w-none">
                {['NH3', 'CH4', 'H2O', 'CO2', 'SF6'].map((ex) => (
                  <button
                    key={ex}
                    onClick={() => setLewisExample(ex)}
                    className={`px-4 py-2 rounded-lg font-black text-[10px] uppercase transition-all whitespace-nowrap
                      ${lewisExample === ex ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}
                    `}
                  >
                    <span dangerouslySetInnerHTML={{ __html: ex.replace(/(\d+)/g, '<sub>$1</sub>') }} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(() => {
                  const data: Record<string, { v: number, i: number, b: number, nb: number, note?: string }> = {
                    'NH3': { v: 5 + 3*1, i: 8 + 3*2, b: 6, nb: 2 },
                    'CH4': { v: 4 + 4*1, i: 8 + 4*2, b: 8, nb: 0 },
                    'H2O': { v: 2*1 + 6, i: 2*2 + 8, b: 4, nb: 4 },
                    'CO2': { v: 4 + 2*6, i: 8 + 2*8, b: 8, nb: 8 },
                    'SF6': { v: 6 + 6*7, i: 8 + 6*8, b: 12, nb: 36, note: "Expanded Octet: Borrowed 4e⁻ from lone pairs to form 2 extra bonds" }
                  };
                  const d = data[lewisExample];
                  
                  return (
                    <>
                      {[
                        { step: 1, title: "Total Valence Electrons (V)", calc: `Step 1: ${d.v} e⁻` },
                        { step: 2, title: "Ideal Valence Electrons (I)", calc: `Step 2: ${d.i} e⁻ (Octet/Duet)` },
                        { step: 3, title: "Bonding Electrons & Bonds", calc: `Step 3: (${d.i} - ${d.v}) = ${d.b} e⁻ → ${d.b/2} Bonds` },
                        { step: 4, title: "Non-Bonding Electrons & Lone Pairs", calc: `Step 4: (${d.v} - ${d.b}) = ${d.nb} e⁻ → ${d.nb/2} Lone Pairs` }
                      ].map((s) => (
                        <div key={s.step} className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-100 flex gap-4 items-start">
                          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-xs shrink-0">
                            {s.step}
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{s.title}</p>
                            <p className="text-sm font-black text-gray-800">{s.calc}</p>
                          </div>
                        </div>
                      ))}
                      {d.note && (
                        <div className="md:col-span-2 p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-3">
                          <Info size={16} className="text-amber-500" />
                          <p className="text-[10px] font-bold text-amber-700">{d.note}</p>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>

              <LewisVisuals formula={lewisExample} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-emerald-50 p-6 rounded-[2rem] border-2 border-emerald-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <FlaskConical size={40} className="text-emerald-600" />
                  </div>
                  <div className="relative z-10 text-center">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4">Summary for <span dangerouslySetInnerHTML={{ __html: lewisExample.replace(/(\d+)/g, '<sub>$1</sub>') }} /></p>
                    <div className="flex flex-col gap-6">
                      <div className="flex justify-center gap-8">
                        <div>
                          <p className="text-4xl font-black text-gray-800">
                            {(() => {
                              const data: any = { 'NH3': 3, 'CH4': 4, 'H2O': 2, 'CO2': 4, 'SF6': 6 };
                              return data[lewisExample];
                            })()}
                          </p>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bonds</p>
                        </div>
                        <div className="w-[2px] h-12 bg-emerald-200" />
                        <div>
                          <p className="text-4xl font-black text-emerald-500">
                            {(() => {
                              const data: any = { 'NH3': 1, 'CH4': 0, 'H2O': 2, 'CO2': 4, 'SF6': 18 };
                              return data[lewisExample];
                            })()}
                          </p>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Lone Pairs</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-emerald-200/50">
                        <div>
                          <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Electron Geometry</p>
                          <p className="text-[10px] font-black text-gray-800 uppercase">
                            {(() => {
                              const data: any = { 'NH3': 'Tetrahedral', 'CH4': 'Tetrahedral', 'H2O': 'Tetrahedral', 'CO2': 'Linear', 'SF6': 'Octahedral' };
                              return data[lewisExample];
                            })()}
                          </p>
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Molecular Geometry</p>
                          <p className="text-[10px] font-black text-emerald-600 uppercase">
                            {(() => {
                              const data: any = { 'NH3': 'Trigonal Pyramidal', 'CH4': 'Tetrahedral', 'H2O': 'Bent', 'CO2': 'Linear', 'SF6': 'Octahedral' };
                              return data[lewisExample];
                            })()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border-2 border-gray-100 p-6 rounded-[2rem]">
                  <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    Limitations
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-[10px] font-bold text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 shrink-0" />
                      Does not apply to incomplete octets (e.g., BeCl₂, BF₃).
                    </li>
                    <li className="flex items-start gap-2 text-[10px] font-bold text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 shrink-0" />
                      For expanded octets, "borrow" lone pairs to form extra bonds.
                    </li>
                    <li className="flex items-start gap-2 text-[10px] font-bold text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 shrink-0" />
                      Always check formal charges for the most stable structure.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.398 }}
            className="bg-white border-2 border-gray-200 rounded-[2.5rem] p-8 shadow-[0_8px_0_0_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-yellow-100 p-3 rounded-2xl text-yellow-600">
                  <Zap size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-yellow-600 uppercase tracking-widest">Atomic Physics</p>
                  <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Absorption & Emission</h2>
                </div>
              </div>
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button 
                  onClick={() => setAtomicTransitionView('lines')}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${atomicTransitionView === 'lines' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Energy Levels
                </button>
                <button 
                  onClick={() => setAtomicTransitionView('circles')}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${atomicTransitionView === 'circles' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Bohr Model
                </button>
              </div>
            </div>

            <div className="space-y-12">
              <div className="grid grid-cols-1 gap-12">
                <div className="space-y-8">
                  <AtomicTransitionDrawing view={atomicTransitionView} from={atomicFrom} to={atomicTo} />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gray-50 p-6 rounded-3xl border-2 border-gray-100">
                      <div className="flex justify-between items-center mb-4">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Initial State (n)</p>
                        <span className="text-sm font-black text-indigo-600">n = {atomicFrom}</span>
                      </div>
                      <input 
                        type="range" min="1" max="6" step="1"
                        value={atomicFrom}
                        onChange={(e) => setAtomicFrom(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                      <div className="flex justify-between mt-2 px-1">
                        {[1, 2, 3, 4, 5, 6].map(v => <span key={v} className="text-[8px] font-bold text-gray-400">{v}</span>)}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-3xl border-2 border-gray-100">
                      <div className="flex justify-between items-center mb-4">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Final State (n)</p>
                        <span className="text-sm font-black text-indigo-600">n = {atomicTo === 7 ? '∞' : atomicTo}</span>
                      </div>
                      <input 
                        type="range" min="1" max="7" step="1"
                        value={atomicTo}
                        onChange={(e) => setAtomicTo(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                      <div className="flex justify-between mt-2 px-1">
                        {[1, 2, 3, 4, 5, 6, '∞'].map((v, i) => <span key={i} className="text-[8px] font-bold text-gray-400">{v}</span>)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-8">
                  <div className="bg-gray-50 p-8 rounded-[2.5rem] border-2 border-gray-100">
                    <h3 className="text-xl font-black text-gray-800 uppercase mb-6 flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${atomicFrom < atomicTo ? 'bg-blue-500' : 'bg-yellow-500'}`} />
                      {atomicFrom === 1 && atomicTo === 7 ? 'Ionization Process' : atomicFrom < atomicTo ? 'Absorption Process' : 'Emission Process'}
                    </h3>
                    <p className="text-base font-bold text-gray-600 leading-relaxed mb-8">
                      {atomicFrom === 1 && atomicTo === 7 
                        ? 'The electron absorbs enough energy to completely escape the attraction of the nucleus (n=1 to n=∞). This energy is the Ionization Energy.'
                        : atomicFrom < atomicTo 
                          ? 'The electron absorbs a photon of specific energy and moves to a higher energy level (excited state). Energy is ABSORBED.' 
                          : 'The electron falls to a lower energy level and releases the excess energy as a photon. Energy is RELEASED.'}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-2xl border border-gray-200">
                        <span className="text-[10px] font-black text-gray-400 uppercase block mb-1">Series</span>
                        <span className="text-sm font-black text-gray-800 uppercase">
                          {atomicTo === 1 ? 'Lyman (UV)' : atomicTo === 2 ? 'Balmer (Visible)' : atomicTo === 3 ? 'Paschen (IR)' : 'N/A'}
                        </span>
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-gray-200">
                        <span className="text-[10px] font-black text-gray-400 uppercase block mb-1">Energy Change</span>
                        <span className={`text-sm font-black uppercase ${atomicFrom < atomicTo ? 'text-blue-600' : 'text-yellow-600'}`}>
                          {atomicFrom < atomicTo ? '+ ΔE (Endo)' : '- ΔE (Exo)'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-indigo-50 p-8 rounded-[2.5rem] border-2 border-indigo-100">
                    <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-6">Spectral Identification</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex flex-col items-center text-center gap-3 bg-white/50 p-4 rounded-2xl">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-black text-xs">UV</div>
                        <p className="text-[10px] font-bold text-gray-600 leading-tight">Transitions to <span className="font-black text-gray-800">n = 1</span> produce Ultra-Violet light.</p>
                      </div>
                      <div className="flex flex-col items-center text-center gap-3 bg-white/50 p-4 rounded-2xl">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-xs">VIS</div>
                        <p className="text-[10px] font-bold text-gray-600 leading-tight">Transitions to <span className="font-black text-gray-800">n = 2</span> produce Visible light.</p>
                      </div>
                      <div className="flex flex-col items-center text-center gap-3 bg-white/50 p-4 rounded-2xl">
                        <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-black text-xs">IR</div>
                        <p className="text-[10px] font-bold text-gray-600 leading-tight">Transitions to <span className="font-black text-gray-800">n = 3</span> produce Infra-Red light.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <HydrogenSeriesDiagram />
              <EmissionSpectrum />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white border-2 border-gray-200 rounded-[2.5rem] p-8 shadow-[0_8px_0_0_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-orange-100 p-3 rounded-2xl text-orange-600">
                  <Zap size={24} />
                </div>
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Electrolytes</h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setElectrolyteState('solid')}
                  className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all
                    ${electrolyteState === 'solid' ? 'bg-gray-800 text-white shadow-[0_4px_0_0_#000000]' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}
                  `}
                >
                  Solid
                </button>
                <button
                  onClick={() => setElectrolyteState('molten')}
                  className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all
                    ${electrolyteState === 'molten' ? 'bg-orange-500 text-white shadow-[0_4px_0_0_#c2410c]' : 'bg-orange-100 text-orange-600 hover:bg-orange-200'}
                  `}
                >
                  Molten
                </button>
                <button
                  onClick={() => setElectrolyteState('aqueous')}
                  className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all
                    ${electrolyteState === 'aqueous' ? 'bg-blue-500 text-white shadow-[0_4px_0_0_#1d4ed8]' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}
                  `}
                >
                  Aqueous
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <ElectrolyteDrawing state={electrolyteState} />

              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-2xl border-2 transition-all ${electrolyteState === 'solid' ? 'bg-rose-50 border-rose-200' : 'bg-gray-50 border-gray-100 opacity-40'}`}>
                  <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1">Solid State</p>
                  <p className="text-xs font-bold text-gray-700">Ions are in fixed positions. They cannot move.</p>
                  <p className="text-[10px] font-black text-rose-500 uppercase mt-2">Insulator</p>
                </div>
                <div className={`p-4 rounded-2xl border-2 transition-all ${electrolyteState !== 'solid' ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-100 opacity-40'}`}>
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">{electrolyteState === 'molten' ? 'Molten' : 'Aqueous'} State</p>
                  <p className="text-xs font-bold text-gray-700">Ions are mobile and free to move to electrodes.</p>
                  <p className="text-[10px] font-black text-emerald-500 uppercase mt-2">Conductor</p>
                </div>
              </div>

              {electrolyteState !== 'solid' && (
                <div className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Ions Present</p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full" />
                      <span className="text-xs font-bold text-gray-700">M⁺ (Cation)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-rose-500 rounded-full" />
                      <span className="text-xs font-bold text-gray-700">X⁻ (Anion)</span>
                    </div>
                    {electrolyteState === 'aqueous' && (
                      <>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-sky-400 rounded-full" />
                          <span className="text-xs font-bold text-gray-700">H⁺ (from water)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-indigo-400 rounded-full" />
                          <span className="text-xs font-bold text-gray-700">OH⁻ (from water)</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>



          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white border-2 border-gray-200 rounded-[2.5rem] p-8 shadow-[0_8px_0_0_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-2xl text-purple-600">
                  <FlaskConical size={24} />
                </div>
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Titration Curve</h2>
              </div>
            </div>

            <TitrationCurve />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white border-2 border-gray-200 rounded-[2.5rem] p-8 shadow-[0_8px_0_0_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-rose-100 p-3 rounded-2xl text-rose-600">
                  <Atom size={24} />
                </div>
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Ionic Equation</h2>
              </div>
              <button 
                onClick={() => {
                  setIonicExampleIndex((prev) => (prev + 1) % 2);
                  setIonicStep(0);
                }}
                className="text-xs font-black text-rose-500 uppercase tracking-widest hover:text-rose-600 transition-colors flex items-center gap-2"
              >
                <RefreshCw size={14} />
                Switch Example
              </button>
            </div>

            <div className="bg-gray-50 rounded-[2rem] p-8 border-2 border-gray-100 relative overflow-hidden min-h-[350px] flex flex-col items-center justify-center">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 absolute top-6">
                {ionicStep === 0 ? "Molecular Equation" : ionicStep === 1 ? "Complete Ionic Equation" : "Net Ionic Equation"}
              </p>

              <div className="flex flex-col items-center gap-6 w-full">
                {/* Line 1: Reactants */}
                <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-2 text-xl font-black">
                  {ionicStep === 0 ? (
                    <AnimatePresence mode="wait">
                      <motion.div key="r0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                        {ionicExampleIndex === 0 ? (
                          <>
                            <span className="text-blue-500">AgNO<sub>3</sub>(aq)</span>
                            <span className="text-gray-300">+</span>
                            <span className="text-blue-500">KCl(aq)</span>
                          </>
                        ) : (
                          <>
                            <span className="text-blue-500">Ba(NO<sub>3</sub>)<sub>2</sub>(aq)</span>
                            <span className="text-gray-300">+</span>
                            <span className="text-blue-500">K<sub>2</sub>SO<sub>4</sub>(aq)</span>
                          </>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  ) : (
                    <AnimatePresence mode="wait">
                      <motion.div key="r1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap justify-center items-center gap-x-2 gap-y-2">
                        {ionicExampleIndex === 0 ? (
                          <>
                            <span className="text-blue-500">Ag<sup>+</sup></span>
                            <span className="text-gray-300">+</span>
                            <motion.span animate={{ opacity: ionicStep === 2 ? 0 : 1, width: ionicStep === 2 ? 0 : 'auto' }} className="text-blue-500 overflow-hidden whitespace-nowrap">NO<sub>3</sub><sup>-</sup></motion.span>
                            <motion.span animate={{ opacity: ionicStep === 2 ? 0 : 1, width: ionicStep === 2 ? 0 : 'auto' }} className="text-gray-300 overflow-hidden whitespace-nowrap">+</motion.span>
                            <motion.span animate={{ opacity: ionicStep === 2 ? 0 : 1, width: ionicStep === 2 ? 0 : 'auto' }} className="text-blue-500 overflow-hidden whitespace-nowrap">K<sup>+</sup></motion.span>
                            <span className="text-gray-300">+</span>
                            <span className="text-blue-500">Cl<sup>-</sup></span>
                          </>
                        ) : (
                          <>
                            <span className="text-blue-500">Ba<sup>2+</sup></span>
                            <span className="text-gray-300">+</span>
                            <motion.span animate={{ opacity: ionicStep === 2 ? 0 : 1, width: ionicStep === 2 ? 0 : 'auto' }} className="text-blue-500 overflow-hidden whitespace-nowrap">2NO<sub>3</sub><sup>-</sup></motion.span>
                            <motion.span animate={{ opacity: ionicStep === 2 ? 0 : 1, width: ionicStep === 2 ? 0 : 'auto' }} className="text-gray-300 overflow-hidden whitespace-nowrap">+</motion.span>
                            <motion.span animate={{ opacity: ionicStep === 2 ? 0 : 1, width: ionicStep === 2 ? 0 : 'auto' }} className="text-blue-500 overflow-hidden whitespace-nowrap">2K<sup>+</sup></motion.span>
                            <span className="text-gray-300">+</span>
                            <span className="text-blue-500">SO<sub>4</sub><sup>2-</sup></span>
                          </>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>

                {/* Line 2: Arrow */}
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-orange-400 text-4xl"
                >
                  ↓
                </motion.div>

                {/* Line 3: Products */}
                <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-2 text-xl font-black">
                  {ionicStep === 0 ? (
                    <AnimatePresence mode="wait">
                      <motion.div key="p0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                        {ionicExampleIndex === 0 ? (
                          <>
                            <span className="text-rose-500">AgCl(s)</span>
                            <span className="text-gray-300">+</span>
                            <span className="text-blue-500">KNO<sub>3</sub>(aq)</span>
                          </>
                        ) : (
                          <>
                            <span className="text-rose-500">BaSO<sub>4</sub>(s)</span>
                            <span className="text-gray-300">+</span>
                            <span className="text-blue-500">2KNO<sub>3</sub>(aq)</span>
                          </>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  ) : (
                    <AnimatePresence mode="wait">
                      <motion.div key="p1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap justify-center items-center gap-x-2 gap-y-2">
                        {ionicExampleIndex === 0 ? (
                          <>
                            <span className="text-rose-500">AgCl(s)</span>
                            <motion.span animate={{ opacity: ionicStep === 2 ? 0 : 1, width: ionicStep === 2 ? 0 : 'auto' }} className="text-gray-300 overflow-hidden whitespace-nowrap">+</motion.span>
                            <motion.span animate={{ opacity: ionicStep === 2 ? 0 : 1, width: ionicStep === 2 ? 0 : 'auto' }} className="text-blue-500 overflow-hidden whitespace-nowrap">K<sup>+</sup></motion.span>
                            <motion.span animate={{ opacity: ionicStep === 2 ? 0 : 1, width: ionicStep === 2 ? 0 : 'auto' }} className="text-gray-300 overflow-hidden whitespace-nowrap">+</motion.span>
                            <motion.span animate={{ opacity: ionicStep === 2 ? 0 : 1, width: ionicStep === 2 ? 0 : 'auto' }} className="text-blue-500 overflow-hidden whitespace-nowrap">NO<sub>3</sub><sup>-</sup></motion.span>
                          </>
                        ) : (
                          <>
                            <span className="text-rose-500">BaSO<sub>4</sub>(s)</span>
                            <motion.span animate={{ opacity: ionicStep === 2 ? 0 : 1, width: ionicStep === 2 ? 0 : 'auto' }} className="text-gray-300 overflow-hidden whitespace-nowrap">+</motion.span>
                            <motion.span animate={{ opacity: ionicStep === 2 ? 0 : 1, width: ionicStep === 2 ? 0 : 'auto' }} className="text-blue-500 overflow-hidden whitespace-nowrap">2K<sup>+</sup></motion.span>
                            <motion.span animate={{ opacity: ionicStep === 2 ? 0 : 1, width: ionicStep === 2 ? 0 : 'auto' }} className="text-gray-300 overflow-hidden whitespace-nowrap">+</motion.span>
                            <motion.span animate={{ opacity: ionicStep === 2 ? 0 : 1, width: ionicStep === 2 ? 0 : 'auto' }} className="text-blue-500 overflow-hidden whitespace-nowrap">2NO<sub>3</sub><sup>-</sup></motion.span>
                          </>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>
              </div>

              {ionicStep === 1 && (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 text-xs font-bold text-rose-500 uppercase tracking-widest text-center"
                >
                  Notice: {ionicExampleIndex === 0 ? "AgCl(s)" : "BaSO₄(s)"} is NOT split because it is insoluble!
                </motion.p>
              )}
            </div>

            <div className="mt-8 flex flex-col items-center gap-4">
              <div className="flex items-center gap-3 bg-blue-50 px-6 py-3 rounded-2xl border-2 border-blue-100 text-blue-700 font-bold text-sm">
                <div className="shrink-0"><Info size={18} /></div>
                {ionicStep === 0 && "Step 1: Write the full molecular equation."}
                {ionicStep === 1 && "Step 2: Split soluble (aq) compounds into ions."}
                {ionicStep === 2 && "Step 3: Remove spectator ions to get the net equation."}
              </div>

              <div className="flex gap-4">
                {ionicStep < 2 ? (
                  <button
                    onClick={() => setIonicStep(ionicStep + 1)}
                    className="bg-rose-500 text-white font-black px-8 py-4 rounded-2xl shadow-[0_4px_0_0_#be123c] active:shadow-none active:translate-y-1 transition-all uppercase tracking-widest text-sm"
                  >
                    {ionicStep === 0 ? "Split into Ions" : "Remove Spectators"}
                  </button>
                ) : (
                  <button
                    onClick={() => setIonicStep(0)}
                    className="bg-gray-800 text-white font-black px-8 py-4 rounded-2xl shadow-[0_4px_0_0_#111827] active:shadow-none active:translate-y-1 transition-all uppercase tracking-widest text-sm flex items-center gap-2"
                  >
                    <RefreshCw size={18} />
                    Reset
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white border-2 border-gray-200 rounded-[2.5rem] p-8 shadow-[0_8px_0_0_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-orange-100 p-3 rounded-2xl text-orange-600">
                <Calculator size={24} />
              </div>
              <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Mole Calculation</h2>
            </div>

            <div className="space-y-6">
              {[
                { 
                  id: 1, 
                  eq: "n = m / Mᵣ", 
                  info: "m = mass (g) and Mᵣ = Molar mass (g/mol)",
                  desc: "Calculating moles from mass"
                },
                { 
                  id: 2, 
                  eq: "n = C × V", 
                  info: "C = concentration (mol dm⁻³) and V = volume (dm³)",
                  desc: "Calculating moles from concentration"
                },
                { 
                  id: 3, 
                  eq: "n = V of gas / 24", 
                  info: "V = volume of gas (dm³)",
                  desc: "Calculating moles from gas volume"
                }
              ].map((item) => (
                <motion.div
                  key={item.id}
                  onMouseEnter={() => setHoveredMoleEq(item.id)}
                  onMouseLeave={() => setHoveredMoleEq(null)}
                  className="relative bg-gray-50 border-2 border-gray-100 rounded-3xl p-6 cursor-help transition-all hover:border-orange-200 hover:bg-orange-50 group"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-orange-400">{item.desc}</p>
                      <h3 className="text-2xl font-black text-gray-800 group-hover:text-orange-600">
                        {item.eq.split(' ').map((part, i) => (
                          <span key={i} className={part === '/' || part === '×' ? 'text-orange-400 mx-2' : ''}>
                            {part === 'Mᵣ' ? <span>M<sub>r</sub></span> : part}
                          </span>
                        ))}
                      </h3>
                    </div>
                    <div className="bg-white p-2 rounded-xl shadow-sm text-gray-400 group-hover:text-orange-500">
                      <Info size={20} />
                    </div>
                  </div>

                  <AnimatePresence>
                    {hoveredMoleEq === item.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t-2 border-orange-100 overflow-hidden"
                      >
                        <p className="text-sm font-bold text-orange-600 leading-relaxed">
                          {item.info}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="bg-white border-2 border-gray-200 rounded-[3rem] p-6 md:p-10 shadow-[0_12px_0_0_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center gap-5 mb-10">
              <div className="bg-emerald-500 p-4 rounded-3xl text-white shadow-lg shadow-emerald-200">
                <Calculator size={28} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter leading-none">Equilibrium Constants</h2>
                <p className="text-emerald-500 font-bold text-xs uppercase tracking-widest mt-1">K<sub>c</sub> Expression & Units</p>
              </div>
            </div>

            <EquilibriumConstants />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white border-2 border-gray-200 rounded-[3rem] p-6 md:p-10 shadow-[0_12px_0_0_rgba(0,0,0,0.05)] overflow-hidden"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
              <div className="flex items-center gap-5">
                <div className="bg-emerald-500 p-4 rounded-3xl text-white shadow-lg shadow-emerald-200">
                  <RefreshCw size={28} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter leading-none">Le Chatelier's Principle</h2>
                  <p className="text-emerald-500 font-bold text-xs uppercase tracking-widest mt-1">Equilibrium Dynamics</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.values(leChatelierReactions).map((r: any) => (
                  <button
                    key={r.id}
                    onClick={() => setLeChatelierState(prev => ({ ...prev, reactionId: r.id, history: [] }))}
                    className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${leChatelierState.reactionId === r.id ? 'bg-emerald-500 text-white shadow-[0_4px_0_0_#059669]' : 'bg-white text-gray-400 border-2 border-gray-100 hover:border-emerald-200'}`}
                  >
                    {r.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2.5rem] p-8 mb-10 border-4 border-gray-800 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Atom size={120} className="text-white" />
              </div>
              
              <div className="relative z-10 flex flex-col items-center">
                {leChatelierReactions[leChatelierState.reactionId].equation}
                <div className="mt-6 flex flex-wrap justify-center gap-4">
                  <span className="px-4 py-1.5 bg-gray-800/50 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-widest border border-gray-700">
                    ΔH = {leChatelierReactions[leChatelierState.reactionId].deltaH} kJ mol⁻¹
                  </span>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${leChatelierReactions[leChatelierState.reactionId].tempEffect === 'exothermic' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-orange-500/20 text-orange-400 border-orange-500/30'}`}>
                    {leChatelierReactions[leChatelierState.reactionId].tempEffect === 'exothermic' ? 'Exothermic' : 'Endothermic'}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
              {/* Concentration Dials */}
              <div className="bg-gray-50 p-6 rounded-[2rem] border-2 border-gray-100 space-y-6">
                <div className="flex items-center gap-2 text-gray-400">
                  <Droplets size={16} />
                  <p className="text-[10px] font-black uppercase tracking-widest">Concentration Dials</p>
                </div>
                <div className="space-y-4">
                  {leChatelierReactions[leChatelierState.reactionId].species.map((species: any) => (
                    <div key={species.id} className="bg-white p-4 rounded-2xl border-2 border-gray-100 shadow-sm space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-tighter">{species.label}</span>
                        <span className="text-[10px] font-black text-gray-400">{leChatelierState.concentrations[species.id].toFixed(1)} mol dm⁻³</span>
                      </div>
                      <input 
                        type="range"
                        min="5"
                        max="120"
                        value={leChatelierState.concentrations[species.id]}
                        onChange={(e) => {
                          const newVal = parseFloat(e.target.value);
                          setLeChatelierState(prev => ({ 
                            ...prev, 
                            concentrations: { ...prev.concentrations, [species.id]: newVal } 
                          }));
                        }}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200"
                        style={{ accentColor: species.color }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Pressure Controls */}
              <div className="bg-gray-50 p-6 rounded-[2rem] border-2 border-gray-100 space-y-6">
                <div className="flex items-center gap-2 text-gray-400">
                  <Wind size={16} />
                  <p className="text-[10px] font-black uppercase tracking-widest">System Pressure</p>
                </div>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-2xl border-2 border-gray-100 shadow-sm space-y-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Total Pressure</span>
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                        {leChatelierState.pressure.toFixed(2)} atm
                      </span>
                    </div>
                    <input 
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.01"
                      value={leChatelierState.pressure}
                      onChange={(e) => {
                        const newVal = parseFloat(e.target.value);
                        setLeChatelierState(prev => {
                          const ratio = newVal / prev.pressure;
                          const nextConcentrations = { ...prev.concentrations };
                          Object.keys(nextConcentrations).forEach(key => {
                            nextConcentrations[key] *= ratio;
                          });
                          return {
                            ...prev,
                            pressure: newVal,
                            concentrations: nextConcentrations
                          };
                        });
                      }}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                    <div className="flex justify-between mt-2">
                      <span className="text-[8px] font-bold text-gray-400 uppercase">Low</span>
                      <span className="text-[8px] font-bold text-gray-400 uppercase">High</span>
                    </div>
                  </div>
                  <p className="text-[9px] font-bold text-gray-400 text-center italic leading-relaxed px-2">
                    Increasing pressure scales all concentrations up immediately. Equilibrium shifts only if gas moles differ.
                  </p>
                </div>
              </div>

              {/* Temperature Controls */}
              <div className="bg-gray-50 p-6 rounded-[2rem] border-2 border-gray-100 space-y-6">
                <div className="flex items-center gap-2 text-gray-400">
                  <Thermometer size={16} />
                  <p className="text-[10px] font-black uppercase tracking-widest">System Temperature</p>
                </div>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-2xl border-2 border-gray-100 shadow-sm space-y-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Temperature</span>
                      <span className="text-[10px] font-black text-orange-600 bg-orange-50 px-2 py-1 rounded-lg border border-orange-100">
                        {Math.round(leChatelierState.temp)} °C
                      </span>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max="100"
                      value={leChatelierState.temp}
                      onChange={(e) => {
                        const newVal = parseFloat(e.target.value);
                        setLeChatelierState(prev => ({ ...prev, temp: newVal }));
                      }}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                    <div className="flex justify-between mt-2">
                      <span className="text-[8px] font-bold text-gray-400 uppercase">Cool</span>
                      <span className="text-[8px] font-bold text-gray-400 uppercase">Heat</span>
                    </div>
                  </div>
                  <p className="text-[9px] font-black text-orange-500 text-center uppercase tracking-tighter leading-relaxed px-2">
                    Temperature is the only factor that changes the equilibrium constant (K꜀).
                  </p>
                </div>
              </div>
            </div>

            {/* Graph & Kc Section */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              <div className="xl:col-span-3 bg-gray-50 rounded-[2.5rem] p-4 md:p-8 border-2 border-gray-100 shadow-inner">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="text-emerald-500" size={20} />
                    <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Concentration Profile</h3>
                  </div>
                </div>
                
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={leChatelierState.history}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis hide dataKey="time" />
                      <YAxis 
                        domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.2 / 10) * 10]} 
                        tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            const reaction = leChatelierReactions[leChatelierState.reactionId];
                            const qc = reaction.calculateQc(data) * reaction.kcScale;
                            return (
                              <div className="bg-white border-2 border-gray-100 rounded-2xl p-4 shadow-xl">
                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Equilibrium State</p>
                                <div className="space-y-1">
                                  {payload.map((entry: any, index: number) => (
                                    <div key={index} className="flex items-center justify-between gap-4">
                                      <span className="text-[10px] font-bold text-gray-500">{entry.name}:</span>
                                      <span className="text-[10px] font-black" style={{ color: entry.color }}>{entry.value} mol dm⁻³</span>
                                    </div>
                                  ))}
                                  <div className="mt-2 pt-2 border-t border-gray-100 space-y-1">
                                    <div className="flex items-center justify-between gap-4">
                                      <span className="text-[10px] font-bold text-emerald-600">K꜀:</span>
                                      <span className="text-[10px] font-black text-emerald-600">{leChatelierState.kc.toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center justify-between gap-4">
                                      <span className="text-[10px] font-bold text-blue-600">Q꜀:</span>
                                      <span className="text-[10px] font-black text-blue-600">{qc.toFixed(2)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      {leChatelierReactions[leChatelierState.reactionId].species.map((s: any) => (
                        <Line 
                          key={s.id}
                          type="monotone" 
                          dataKey={s.id} 
                          stroke={s.color} 
                          strokeWidth={4} 
                          dot={false} 
                          name={`[${s.label}]`} 
                          isAnimationActive={false} 
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex flex-wrap justify-center gap-6 md:gap-8 mt-6">
                  {leChatelierReactions[leChatelierState.reactionId].species.map((s: any) => (
                    <div key={s.id} className="flex items-center gap-3">
                      <div className="w-4 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
                      <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest">[{s.label}]</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kc Display */}
              <div className="flex flex-col gap-6">
                {(() => {
                  const reaction = leChatelierReactions[leChatelierState.reactionId];
                  const currentQc = reaction.calculateQc(leChatelierState.concentrations) * reaction.kcScale;
                  const diff = currentQc - leChatelierState.kc;
                  const isAtEquilibrium = Math.abs(diff) < (leChatelierState.kc * 0.05);
                  
                  return (
                    <div className={`flex-1 rounded-[2.5rem] p-8 text-white shadow-xl flex flex-col items-center justify-center text-center relative overflow-hidden transition-colors duration-500 ${isAtEquilibrium ? 'bg-emerald-500 shadow-emerald-100' : 'bg-rose-500 shadow-rose-100'}`}>
                      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                          <path d="M0 100 C 20 0 50 0 100 100" fill="none" stroke="white" strokeWidth="0.5" />
                        </svg>
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-80">Equilibrium Constant</p>
                      
                      <div className="flex flex-col items-center gap-1 mb-4">
                        <motion.div 
                          key={leChatelierState.kc}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-5xl font-black tracking-tighter"
                        >
                          {leChatelierState.kc.toFixed(2)}
                        </motion.div>
                        <div className="text-xl font-black opacity-90">K<sub>c</sub></div>
                      </div>

                      <div className="bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm mb-6 w-full">
                        <p className="text-[10px] font-black uppercase tracking-widest mb-1">Reaction Quotient</p>
                        <p className="text-xl font-black">{currentQc.toFixed(2)} (Q<sub>c</sub>)</p>
                        <p className="text-[10px] font-black mt-1">
                          {isAtEquilibrium ? 'Q = K (Equilibrium)' : currentQc > leChatelierState.kc ? 'Q > K (Shift Left)' : 'Q < K (Shift Right)'}
                        </p>
                      </div>
                      
                      <div className="mt-auto pt-6 border-t border-white/20 w-full flex flex-col items-center">
                        <p className="text-[9px] font-bold uppercase tracking-widest opacity-70 mb-3">Expression</p>
                        {reaction.expression}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
            className="bg-white border-2 border-gray-200 rounded-[3rem] p-6 md:p-10 shadow-[0_12px_0_0_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center gap-5 mb-10">
              <div className="bg-indigo-500 p-4 rounded-3xl text-white shadow-lg shadow-indigo-200">
                <Layers size={28} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter leading-none">Periodic Trends</h2>
                <p className="text-indigo-500 font-bold text-xs uppercase tracking-widest mt-1">Atomic Properties & Patterns</p>
              </div>
            </div>

            <PeriodicTrends />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.88 }}
            className="bg-white border-2 border-gray-200 rounded-[3rem] p-6 md:p-10 shadow-[0_12px_0_0_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center gap-5 mb-10">
              <div className="bg-indigo-600 p-4 rounded-3xl text-white shadow-lg shadow-indigo-200">
                <TrendingUp size={28} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter leading-none">1st IE VS Successive IE</h2>
                <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest mt-1">Ionization Energy Trends & Anomalies</p>
              </div>
            </div>

            <IonizationEnergy />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white border-2 border-gray-200 rounded-[3rem] p-6 md:p-10 shadow-[0_12px_0_0_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center gap-5 mb-10">
              <div className="bg-rose-500 p-4 rounded-3xl text-white shadow-lg shadow-rose-200">
                <RefreshCw size={28} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter leading-none">Redox Balancing</h2>
                <p className="text-rose-500 font-bold text-xs uppercase tracking-widest mt-1">Step-by-Step Half-Equation Method</p>
              </div>
            </div>

            <RedoxBalancing />
          </motion.div>
        </main>
      </motion.div>
    );
  };

  const Dashboard = () => {
    // Safety check for randomConcept - always try to recover
    if (!randomConcept) {
      if (allConcepts.length > 0) {
        setRandomConcept(allConcepts[Math.floor(Math.random() * allConcepts.length)]);
      }
      return (
        <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-center gap-4">
          <RefreshCw className="text-emerald-500 animate-spin" size={48} />
          <p className="font-black uppercase text-gray-400 tracking-widest">Warming Up Knowledge...</p>
        </div>
      );
    }
    
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
      <AnimatePresence>
        {isY13Open && <Y13Splash onClose={() => setIsY13Open(false)} />}
      </AnimatePresence>

      <header className="bg-white border-b-2 border-gray-200 p-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-emerald-500 tracking-tight leading-none">IBDP Chemistry</h1>
            <p className="text-[10px] font-bold text-black uppercase tracking-widest mt-1">An App by Toman</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsQRModalOpen(true)}
              className="bg-gray-100 text-gray-600 p-2 rounded-full hover:bg-gray-200 transition-all"
              title="App QR Code"
            >
              <QrCode size={20} />
            </button>
            <button 
              onClick={() => setIsY13Open(true)}
              className="bg-orange-500 text-white px-4 py-1.5 rounded-full font-black text-sm uppercase tracking-widest shadow-[0_4px_0_0_#c2410c] active:shadow-none active:translate-y-1 transition-all"
            >
              Y13
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isQRModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center relative"
            >
              <button 
                onClick={() => setIsQRModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <XCircle size={24} />
              </button>
              <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tight mb-2">App QR Code</h3>
              <p className="text-gray-500 font-medium mb-6">Scan to open the revision app on your mobile device!</p>
              <div className="bg-gray-50 p-6 rounded-2xl border-2 border-gray-100 flex justify-center mb-6">
                <QRCodeSVG value="https://y13-ib.vercel.app" size={200} level="H" includeMargin={true} />
              </div>
              <p className="text-emerald-500 font-black text-sm uppercase tracking-widest">y13-ib.vercel.app</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="max-w-2xl mx-auto p-4 space-y-6 mt-4">
        <div className="bg-emerald-100 border-2 border-emerald-200 rounded-2xl p-6 flex items-center gap-6">
          <div className="bg-emerald-500 p-4 rounded-full text-white">
            <GraduationCap size={40} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-emerald-900 uppercase tracking-tight">Did you know?</h2>
              <motion.button
                whileHover={{ rotate: 180 }}
                whileTap={{ scale: 0.8 }}
                onClick={refreshConcept}
                className="text-emerald-600 hover:text-emerald-800 p-1 rounded-full hover:bg-emerald-200 transition-colors"
              >
                <RefreshCw size={20} />
              </motion.button>
            </div>
            <p className="text-emerald-700 font-medium leading-tight mt-1">
              {randomConcept.includes(': ') ? (
                <>
                  <span className="font-bold">{randomConcept.split(': ')[0]}:</span>
                  {randomConcept.substring(randomConcept.indexOf(': ') + 1)}
                </>
              ) : (
                randomConcept
              )}
            </p>
          </div>
        </div>

        <div className="flex bg-gray-200 p-1 rounded-2xl">
          <button
            onClick={() => setActiveCategory('structure')}
            className={`flex-1 py-3 rounded-xl font-black uppercase tracking-widest transition-all ${activeCategory === 'structure' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Structure
          </button>
          <button
            onClick={() => setActiveCategory('reactivity')}
            className={`flex-1 py-3 rounded-xl font-black uppercase tracking-widest transition-all ${activeCategory === 'reactivity' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Reactivity
          </button>
        </div>

        <div className="grid gap-4">
          {units.filter(u => u.category === activeCategory).map((unit) => (
            <motion.div 
              key={unit.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white border-2 border-gray-200 rounded-2xl p-5 shadow-[0_4px_0_0_rgba(0,0,0,0.05)] hover:border-emerald-400 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${unit.color} rounded-xl flex items-center justify-center text-white font-bold text-xl`}>
                    {unit.id}
                  </div>
                  <div>
                    <h3 className="font-black text-gray-800 text-lg tracking-wide">{unit.title}</h3>
                    <p className="text-gray-500 text-sm">{unit.description}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <button 
                  onClick={() => startQuiz(unit)}
                  className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl bg-emerald-50 text-emerald-600 border-2 border-emerald-100 hover:bg-emerald-100 transition-colors"
                >
                  <CheckCircle2 size={24} />
                  <span className="text-xs font-bold uppercase">Quiz</span>
                </button>
                <button 
                  onClick={() => startRevision(unit)}
                  className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl bg-blue-50 text-blue-600 border-2 border-blue-100 hover:bg-blue-100 transition-colors"
                >
                  <BookOpen size={24} />
                  <span className="text-xs font-bold uppercase">Notes</span>
                </button>
                <button 
                  onClick={() => startVocab(unit)}
                  className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl bg-purple-50 text-purple-600 border-2 border-purple-100 hover:bg-purple-100 transition-colors"
                >
                  <Languages size={24} />
                  <span className="text-xs font-bold uppercase">Vocab</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
    );
  };

  const QuizSelectView = () => (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-800 uppercase tracking-tight mb-2">Choose Your Challenge</h2>
          <p className="text-gray-500 font-medium">{selectedUnit?.title}</p>
        </div>

        <div className="grid gap-4">
          <button
            onClick={() => startQuizWithMode(selectedUnit!, 'quick')}
            className="bg-white border-2 border-gray-200 p-6 rounded-3xl flex items-center gap-6 hover:border-emerald-400 transition-all group shadow-[0_4px_0_0_#e5e7eb] hover:shadow-[0_4px_0_0_#34d399]"
          >
            <div className="bg-emerald-100 text-emerald-600 p-4 rounded-2xl group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              <CheckCircle2 size={32} />
            </div>
            <div className="text-left">
              <h3 className="font-black text-xl text-gray-800 uppercase">Quick Mode</h3>
              <p className="text-gray-500 text-sm">10 random questions to test your knowledge.</p>
            </div>
          </button>

          <button
            onClick={() => startQuizWithMode(selectedUnit!, 'time-attack')}
            className="bg-white border-2 border-gray-200 p-6 rounded-3xl flex items-center gap-6 hover:border-orange-400 transition-all group shadow-[0_4px_0_0_#e5e7eb] hover:shadow-[0_4px_0_0_#fb923c]"
          >
            <div className="bg-orange-100 text-orange-600 p-4 rounded-2xl group-hover:bg-orange-500 group-hover:text-white transition-colors">
              <Trophy size={32} />
            </div>
            <div className="text-left">
              <h3 className="font-black text-xl text-gray-800 uppercase">Time Attack</h3>
              <p className="text-gray-500 text-sm">Race against the clock! 30 seconds to answer as many as you can.</p>
            </div>
          </button>

          <button
            onClick={() => startQuizWithMode(selectedUnit!, 'marathon')}
            className="bg-white border-2 border-gray-200 p-6 rounded-3xl flex items-center gap-6 hover:border-blue-400 transition-all group shadow-[0_4px_0_0_#e5e7eb] hover:shadow-[0_4px_0_0_#60a5fa]"
          >
            <div className="bg-blue-100 text-blue-600 p-4 rounded-2xl group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <BookOpen size={32} />
            </div>
            <div className="text-left">
              <h3 className="font-black text-xl text-gray-800 uppercase">Marathon</h3>
              <p className="text-gray-500 text-sm">All questions in random order. No time limit.</p>
            </div>
          </button>
        </div>

        <button
          onClick={() => setMode('dashboard')}
          className="w-full mt-8 text-gray-400 font-bold uppercase tracking-widest hover:text-gray-600 transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );

  const QuizView = () => {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    
    if (!currentQuestion) {
      return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 gap-4">
          <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Oops! Something went wrong</h2>
          <p className="text-gray-500 font-bold">We couldn't load the question. Please try again.</p>
          <button onClick={() => setMode('dashboard')} className="bg-emerald-500 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest shadow-[0_4px_0_0_#059669] active:shadow-none active:translate-y-1 transition-all">
            Return Home
          </button>
        </div>
      );
    }
    
    const isCorrect = selectedOption === currentQuestion.correctAnswer;

    return (
      <div className="min-h-screen bg-white flex flex-col">
        <header className="p-4 flex items-center gap-4 max-w-2xl mx-auto w-full">
          <button onClick={() => setMode('dashboard')} className="text-gray-400 hover:text-gray-600">
            <XCircle size={32} />
          </button>
          
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {quizSubMode === 'time-attack' ? 'Time Attack' : quizSubMode === 'marathon' ? 'Marathon' : 'Quick Mode'}
              </span>
              {(quizSubMode === 'quick' || quizSubMode === 'marathon') && (
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                  Question {currentQuestionIndex + 1}
                </span>
              )}
              {quizSubMode === 'time-attack' && (
                <span className={`text-sm font-black uppercase tracking-widest ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-orange-500'}`}>
                  {timeLeft}s
                </span>
              )}
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: quizSubMode === 'time-attack' ? `${(timeLeft / 30) * 100}%` : `${quizProgress}%` }}
                className={`h-full rounded-full transition-all ${quizSubMode === 'time-attack' ? (timeLeft <= 5 ? 'bg-red-500' : 'bg-orange-500') : 'bg-emerald-500'}`}
              />
            </div>
          </div>

          <div className="flex items-center gap-1 text-red-500 font-bold">
            <Heart size={20} fill={hearts > 0 ? "currentColor" : "none"} />
            <span>{hearts}</span>
          </div>
        </header>

        <main className="flex-1 max-w-2xl mx-auto w-full p-6 flex flex-col">
          <h2 className="text-2xl font-black text-gray-800 mb-8">{currentQuestion.text}</h2>
          
          <div className="space-y-4 flex-1">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                disabled={isAnswerChecked}
                onClick={() => handleOptionSelect(option)}
                className={`w-full p-4 text-left rounded-2xl border-2 transition-all font-bold text-lg
                  ${selectedOption === option 
                    ? 'border-blue-400 bg-blue-50 text-blue-600 shadow-[0_4px_0_0_#60a5fa]' 
                    : 'border-gray-200 hover:bg-gray-50 text-gray-700 shadow-[0_4px_0_0_#e5e7eb]'
                  }
                  ${isAnswerChecked && option === currentQuestion.correctAnswer ? 'border-emerald-400 bg-emerald-50 text-emerald-600 shadow-[0_4px_0_0_#34d399]' : ''}
                  ${isAnswerChecked && selectedOption === option && !isCorrect ? 'border-red-400 bg-red-50 text-red-600 shadow-[0_4px_0_0_#f87171]' : ''}
                `}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {isAnswerChecked && option === currentQuestion.correctAnswer && <CheckCircle2 size={24} />}
                  {isAnswerChecked && selectedOption === option && !isCorrect && <XCircle size={24} />}
                </div>
              </button>
            ))}
          </div>
        </main>

        <footer className={`p-6 border-t-2 transition-colors ${isAnswerChecked ? (isCorrect ? 'bg-emerald-100 border-emerald-200' : 'bg-red-100 border-red-200') : 'bg-white border-gray-100'}`}>
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            {isAnswerChecked ? (
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${isCorrect ? 'bg-white text-emerald-500' : 'bg-white text-red-500'}`}>
                  {isCorrect ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
                </div>
                <div>
                  <h3 className={`font-black text-xl ${isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
                    {isCorrect ? 'Excellent!' : 'Correct answer:'}
                  </h3>
                  {!isCorrect && <p className="text-red-600 font-bold">{currentQuestion.correctAnswer}</p>}
                </div>
              </div>
            ) : (
              <div />
            )}
            
            <button
              onClick={isAnswerChecked ? nextQuestion : checkAnswer}
              disabled={!selectedOption}
              className={`px-10 py-3 rounded-2xl font-black text-lg uppercase tracking-wider transition-all
                ${!selectedOption 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : isAnswerChecked 
                    ? (isCorrect ? 'bg-emerald-500 text-white shadow-[0_4px_0_0_#059669]' : 'bg-red-500 text-white shadow-[0_4px_0_0_#dc2626]')
                    : 'bg-emerald-500 text-white shadow-[0_4px_0_0_#059669]'
                }
              `}
            >
              {isAnswerChecked ? 'Continue' : 'Check'}
            </button>
          </div>
        </footer>
      </div>
    );
  };

  const ResultView = () => (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="bg-yellow-100 p-8 rounded-full text-yellow-500 mb-8"
      >
        <Trophy size={100} />
      </motion.div>
      <h2 className="text-4xl font-black text-gray-800 mb-2">
        {hearts > 0 ? (quizSubMode === 'time-attack' ? 'Time Up!' : 'Unit Complete!') : 'Out of Hearts!'}
      </h2>
      <p className="text-gray-500 text-xl mb-8">
        {hearts > 0 
          ? (quizSubMode === 'time-attack' ? `Great effort in Time Attack!` : `You've mastered some ${selectedUnit?.title} concepts!`)
          : `Don't give up! Review the notes and try again.`}
      </p>
      
      <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-12">
        <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-4">
          <p className="text-orange-400 font-bold uppercase text-xs">Score</p>
          <p className="text-orange-600 font-black text-2xl">
            {quizSubMode === 'time-attack' ? score : `${score} / ${quizQuestions.length}`}
          </p>
        </div>
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
          <p className="text-blue-400 font-bold uppercase text-xs">Accuracy</p>
          <p className="text-blue-600 font-black text-2xl">
            {score > 0 ? Math.round((score / (currentQuestionIndex + (isAnswerChecked ? 1 : 0))) * 100) : 0}%
          </p>
        </div>
      </div>

      <button
        onClick={() => setMode('dashboard')}
        className="w-full max-w-sm bg-emerald-500 text-white py-4 rounded-2xl font-black text-xl uppercase tracking-widest shadow-[0_6px_0_0_#059669] active:shadow-none active:translate-y-1 transition-all"
      >
        Finish
      </button>
    </div>
  );

  const S13Graphics = ({ index }: { index: number }) => {
    if (index === 0) {
      return (
        <div className="mt-4 bg-gray-900 p-6 rounded-2xl border border-gray-800 overflow-hidden relative">
          <div className="flex justify-between items-end h-16 gap-0.5">
            {[...Array(40)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ height: [10, 40, 10] }}
                transition={{ 
                  duration: 0.5 + (i * 0.05), 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="flex-1 bg-gradient-to-t from-indigo-500 to-purple-400 rounded-full"
                style={{ opacity: 0.3 + (i / 40) * 0.7 }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-4">
            <div className="text-center">
              <p className="text-[8px] font-black text-indigo-400 uppercase">High λ</p>
              <p className="text-[8px] font-bold text-gray-500 uppercase">Low f, Low E</p>
            </div>
            <div className="text-center">
              <p className="text-[8px] font-black text-purple-400 uppercase">Low λ</p>
              <p className="text-[8px] font-bold text-gray-500 uppercase">High f, High E</p>
            </div>
          </div>
          <div className="absolute top-2 right-4 flex items-center gap-1">
            <Activity size={10} className="text-indigo-400" />
            <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">EM Spectrum</span>
          </div>
        </div>
      );
    }

    if (index === 13) {
      return (
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center">
            <div className="w-16 h-16 bg-indigo-500/20 rounded-full border-2 border-indigo-400 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-indigo-400/10 rounded-full blur-sm" />
              <span className="text-indigo-600 font-black text-xs z-10">s</span>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase mt-2">Spherical</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center">
            <div className="w-16 h-16 flex items-center justify-center relative">
              <div className="w-6 h-14 bg-rose-500/20 border-2 border-rose-400 rounded-full rotate-0 absolute" />
              <div className="w-2 h-2 bg-gray-800 rounded-full z-10" />
              <span className="text-rose-600 font-black text-xs z-10 mt-8">p</span>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase mt-2">Dumbbell</p>
          </div>
        </div>
      );
    }

    if (index === 15) {
      const levels = [
        { label: '4s', y: 20 },
        { label: '3d', y: 35 },
        { label: '3p', y: 60 },
        { label: '3s', y: 80 },
        { label: '2p', y: 110 },
        { label: '2s', y: 130 },
        { label: '1s', y: 160 },
      ];
      return (
        <div className="mt-4 bg-gray-900 p-6 rounded-2xl border border-gray-800 relative h-48 overflow-hidden">
          <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-700">
            <div className="absolute top-0 -left-1 w-2 h-2 border-t-2 border-l-2 border-gray-700 rotate-45" />
          </div>
          <span className="absolute left-6 top-4 text-[8px] font-black text-gray-500 uppercase vertical-text">Energy</span>
          
          <div className="ml-12 h-full flex flex-col justify-between">
            {levels.map((l, i) => (
              <motion.div 
                key={l.label}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="w-12 h-0.5 bg-indigo-500/50" />
                <span className="text-[10px] font-black text-indigo-400">{l.label}</span>
              </motion.div>
            ))}
          </div>
          <div className="absolute bottom-2 right-4 flex items-center gap-1">
            <Layers size={10} className="text-indigo-400" />
            <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Aufbau Principle</span>
          </div>
        </div>
      );
    }

    return null;
  };

  const S14Graphics = ({ index }: { index: number }) => {
    if (index === 0) {
      return (
        <div className="mt-4 bg-indigo-50 p-6 rounded-2xl border border-indigo-100 flex items-center gap-4">
          <div className="bg-white p-3 rounded-xl shadow-sm">
            <span className="text-xl font-black text-indigo-600">6.02 × 10²³</span>
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Avogadro Constant (Nₐ)</p>
            <p className="text-[8px] font-bold text-gray-500">Number of particles in exactly 1 mole of substance.</p>
          </div>
        </div>
      );
    }

    if (index === 7) {
      return (
        <div className="mt-4 bg-indigo-50 p-6 rounded-2xl border border-indigo-100 flex flex-col items-center">
          <div className="relative w-32 h-32">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path d="M 50 10 L 90 80 L 10 80 Z" fill="none" stroke="#6366f1" strokeWidth="2" />
              <line x1="10" y1="50" x2="90" y2="50" stroke="#6366f1" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="50" y1="50" x2="50" y2="80" stroke="#6366f1" strokeWidth="1" strokeDasharray="2 2" />
              <text x="50" y="40" textAnchor="middle" className="fill-indigo-600 font-black text-[10px]">m</text>
              <text x="35" y="65" textAnchor="middle" className="fill-indigo-600 font-black text-[10px]">n</text>
              <text x="65" y="65" textAnchor="middle" className="fill-indigo-600 font-black text-[10px]">M</text>
            </svg>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 w-full">
            <div className="bg-white p-2 rounded-xl border border-indigo-100 text-center">
              <p className="text-[8px] font-black text-gray-400 uppercase">n = m / M</p>
            </div>
            <div className="bg-white p-2 rounded-xl border border-indigo-100 text-center">
              <p className="text-[8px] font-black text-gray-400 uppercase">m = n × M</p>
            </div>
          </div>
        </div>
      );
    }

    if (index === 9) {
      return (
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-2">Empirical Formula</p>
            <div className="flex items-center justify-center gap-1">
              <span className="text-sm font-black text-gray-800">CH₂O</span>
            </div>
            <p className="text-[8px] font-bold text-gray-500 mt-2">Simplest Ratio</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-2">Molecular Formula</p>
            <div className="flex items-center justify-center gap-1">
              <span className="text-sm font-black text-indigo-600">C₆H₁₂O₆</span>
            </div>
            <p className="text-[8px] font-bold text-gray-500 mt-2">Actual Numbers</p>
          </div>
        </div>
      );
    }

    if (index === 10) {
      return (
        <div className="mt-4 bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
          <div className="flex items-center justify-around">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                <Droplets size={24} />
              </div>
              <span className="text-[10px] font-black text-emerald-600 uppercase">Solution</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-lg font-black text-emerald-600">c = n / V</span>
              <div className="h-0.5 w-16 bg-emerald-200" />
              <span className="text-[8px] font-black text-gray-400 uppercase">mol dm⁻³</span>
            </div>
          </div>
        </div>
      );
    }

    if (index === 14) {
      return (
        <div className="mt-4 bg-purple-50 p-6 rounded-2xl border border-purple-100 relative overflow-hidden">
          <div className="flex items-center gap-6">
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-20 h-20 bg-purple-500/20 rounded-3xl border-2 border-purple-400 flex items-center justify-center"
            >
              <Box size={32} className="text-purple-600" />
            </motion.div>
            <div className="space-y-1">
              <p className="text-xl font-black text-purple-600">22.7 dm³</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Molar Volume at STP</p>
              <div className="flex gap-2 mt-2">
                <span className="text-[8px] font-bold bg-purple-200 text-purple-700 px-2 py-0.5 rounded-full">273 K</span>
                <span className="text-[8px] font-bold bg-purple-200 text-purple-700 px-2 py-0.5 rounded-full">100 kPa</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const S12Graphics = ({ index }: { index: number }) => {
    if (index === 0) {
      return (
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { name: 'Proton', charge: '+1', mass: '1', color: 'bg-red-500' },
            { name: 'Neutron', charge: '0', mass: '1', color: 'bg-gray-400' },
            { name: 'Electron', charge: '-1', mass: '1/1836', color: 'bg-blue-500' }
          ].map((p) => (
            <div key={p.name} className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
              <div className={`w-6 h-6 ${p.color} rounded-full mx-auto mb-2 shadow-sm`} />
              <p className="text-[10px] font-black text-gray-800 uppercase mb-1">{p.name}</p>
              <div className="space-y-0.5">
                <p className="text-[8px] font-bold text-gray-400 uppercase">Charge: <span className="text-gray-700">{p.charge}</span></p>
                <p className="text-[8px] font-bold text-gray-400 uppercase">Mass: <span className="text-gray-700">{p.mass}</span></p>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (index === 8) {
      const elements: Record<number, string> = { 1: 'H', 2: 'He', 3: 'Li', 4: 'Be', 5: 'B', 6: 'C', 7: 'N', 8: 'O', 9: 'F', 10: 'Ne' };
      const symbol = elements[s12Z] || '?';
      
      return (
        <div className="mt-4 bg-blue-50 p-6 rounded-2xl border border-blue-100">
          <div className="flex items-center justify-between gap-8">
            <div className="flex-1 space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest">Atomic Number (Z)</span>
                  <span className="text-xs font-black text-blue-600">{s12Z}</span>
                </div>
                <input 
                  type="range" min="1" max="10" value={s12Z} 
                  onChange={(e) => {
                    const z = parseInt(e.target.value);
                    setS12Z(z);
                    if (s12A < z * 2) setS12A(z * 2);
                  }}
                  className="w-full h-1.5 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest">Mass Number (A)</span>
                  <span className="text-xs font-black text-blue-600">{s12A}</span>
                </div>
                <input 
                  type="range" min={s12Z} max={s12Z * 3} value={s12A} 
                  onChange={(e) => setS12A(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-2xl border-2 border-blue-200 shadow-sm w-24 h-32 flex flex-col items-center justify-center relative">
              <span className="absolute top-2 left-3 text-xs font-black text-gray-400">{s12A}</span>
              <span className="absolute bottom-2 left-3 text-xs font-black text-gray-400">{s12Z}</span>
              <span className="text-4xl font-black text-gray-800">{symbol}</span>
              <div className="mt-2 text-[8px] font-black text-blue-500 uppercase tracking-widest">
                {s12A - s12Z} Neutrons
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (index === 12) {
      return (
        <div className="mt-4 grid grid-cols-2 gap-4">
          {[
            { name: 'Carbon-12', p: 6, n: 6, abundance: '98.9%' },
            { name: 'Carbon-14', p: 6, n: 8, abundance: 'Trace' }
          ].map((iso) => (
            <div key={iso.name} className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <p className="text-[10px] font-black text-gray-800 uppercase mb-3 text-center">{iso.name}</p>
              <div className="flex justify-center gap-1 flex-wrap max-w-[60px] mx-auto mb-3">
                {[...Array(iso.p)].map((_, i) => <div key={`p-${i}`} className="w-1.5 h-1.5 bg-red-500 rounded-full" />)}
                {[...Array(iso.n)].map((_, i) => <div key={`n-${i}`} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />)}
              </div>
              <div className="flex justify-between text-[8px] font-bold text-gray-400 uppercase">
                <span>P: {iso.p}</span>
                <span>N: {iso.n}</span>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-200 text-center">
                <span className="text-[8px] font-black text-emerald-500 uppercase">{iso.abundance}</span>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (index === 15) {
      return (
        <div className="mt-4 bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3">Ar Calculation Example (Mg)</p>
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold text-gray-600">
              <span>²⁴Mg (78.99%)</span>
              <span>24 × 0.7899 = 18.96</span>
            </div>
            <div className="flex justify-between text-[10px] font-bold text-gray-600">
              <span>²⁵Mg (10.00%)</span>
              <span>25 × 0.1000 = 2.50</span>
            </div>
            <div className="flex justify-between text-[10px] font-bold text-gray-600">
              <span>²⁶Mg (11.01%)</span>
              <span>26 × 0.1101 = 2.86</span>
            </div>
            <div className="pt-2 border-t border-emerald-200 flex justify-between font-black text-emerald-600">
              <span className="text-xs">Relative Atomic Mass (Ar)</span>
              <span className="text-xs">24.32</span>
            </div>
          </div>
        </div>
      );
    }

    if (index === 16) {
      return (
        <div className="mt-4 bg-gray-900 p-6 rounded-2xl border border-gray-800 relative overflow-hidden h-40">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          
          <svg viewBox="0 0 200 100" className="w-full h-full relative z-10">
            {/* Path */}
            <path d="M 10 50 L 60 50 Q 100 50 100 10 Q 100 -30 140 -30" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" strokeLinecap="round" />
            
            {/* Ionization */}
            <motion.circle 
              r="3" fill="#facc15"
              animate={{ cx: [10, 40], cy: [50, 50], opacity: [0, 1, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <Zap size={10} x={35} y={45} className="text-yellow-400 animate-pulse" />
            
            {/* Acceleration & Deflection */}
            <motion.circle 
              r="3" fill="#60a5fa"
              animate={{ 
                cx: [40, 60, 80, 100, 120, 150], 
                cy: [50, 50, 45, 30, 20, 15],
                opacity: [0, 1, 1, 1, 1, 0]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }}
            />
            
            {/* Heavier Ion (less deflection) */}
            <motion.circle 
              r="4" fill="#f87171"
              animate={{ 
                cx: [40, 60, 90, 130, 170], 
                cy: [50, 50, 52, 55, 58],
                opacity: [0, 1, 1, 1, 0]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1.2 }}
            />

            {/* Labels */}
            <text x="10" y="70" className="fill-gray-500 text-[6px] font-bold uppercase">Ionise</text>
            <text x="60" y="70" className="fill-gray-500 text-[6px] font-bold uppercase">Accelerate</text>
            <text x="110" y="30" className="fill-gray-500 text-[6px] font-bold uppercase">Deflect</text>
            <text x="160" y="80" className="fill-gray-500 text-[6px] font-bold uppercase">Detect</text>
          </svg>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-4">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
              <span className="text-[6px] font-black text-white uppercase">Light</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
              <span className="text-[6px] font-black text-white uppercase">Heavy</span>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const S11Graphics = ({ index }: { index: number }) => {
    const kelvin = Math.round(s11Temp + 273.15);
    const speed = Math.max(0.1, (s11Temp + 273) / 300);
    
    const TemperatureSlider = () => (
      <div className="mt-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Thermometer size={14} className="text-red-500" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Temperature Control</span>
          </div>
          <div className="flex gap-2">
            <span className="text-xs font-black text-gray-800">{s11Temp}°C</span>
            <span className="text-xs font-black text-indigo-600">{kelvin}K</span>
          </div>
        </div>
        <input 
          type="range" 
          min="-273" 
          max="500" 
          value={s11Temp} 
          onChange={(e) => setS11Temp(parseInt(e.target.value))}
          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
        <div className="flex justify-between mt-1">
          <span className="text-[8px] font-bold text-gray-400">-273°C</span>
          <span className="text-[8px] font-bold text-gray-400">500°C</span>
        </div>
      </div>
    );

    if (index === 8) {
      const state = s11Temp <= 0 ? 'solid' : s11Temp < 100 ? 'liquid' : 'gas';
      
      return (
        <div className="space-y-2">
          <div className="mt-4 h-24 bg-gray-900 rounded-2xl relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
            <div className={`grid ${state === 'solid' ? 'grid-cols-4 gap-1' : state === 'liquid' ? 'grid-cols-4 gap-2' : 'flex flex-wrap gap-8'}`}>
              {[...Array(state === 'gas' ? 4 : 12)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={state === 'solid' ? {
                    x: [0, 1, -1, 0],
                    y: [0, -1, 1, 0]
                  } : state === 'liquid' ? {
                    x: [0, 2, -2, 0],
                    y: [0, 5, -5, 0]
                  } : {
                    x: [0, Math.random() * 60 - 30, Math.random() * 60 - 30, 0],
                    y: [0, Math.random() * 60 - 30, Math.random() * 60 - 30, 0]
                  }}
                  transition={{ repeat: Infinity, duration: (state === 'solid' ? 0.2 : state === 'liquid' ? 1 : 0.5) / speed, ease: "linear" }}
                  className={`w-3 h-3 rounded-full ${state === 'solid' ? 'bg-blue-400' : state === 'liquid' ? 'bg-blue-500' : 'bg-blue-300'}`}
                />
              ))}
            </div>
            <div className="absolute top-2 right-2 px-2 py-0.5 bg-white/10 rounded-full flex items-center gap-1">
              <div className={`w-1.5 h-1.5 rounded-full ${state === 'solid' ? 'bg-blue-400' : state === 'liquid' ? 'bg-blue-500' : 'bg-orange-400'}`} />
              <p className="text-[8px] font-black text-white uppercase tracking-widest">{state}</p>
            </div>
          </div>
          <TemperatureSlider />
        </div>
      );
    }

    if (index === 15) {
      const shift = (s11Temp + 273) / 500;
      return (
        <div className="space-y-2">
          <div className="mt-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <div className="flex justify-between items-end h-12 gap-1">
              {[0.2, 0.5, 0.8, 0.4, 0.9, 0.3].map((h, i) => {
                const adjustedH = Math.max(0.1, h * (1 - shift * 0.5) + (i / 10) * shift);
                return (
                  <motion.div
                    key={i}
                    animate={{ height: [`${adjustedH * 100}%`, `${Math.min(1, adjustedH + 0.1) * 100}%`, `${adjustedH * 100}%`] }}
                    transition={{ repeat: Infinity, duration: (1 + i * 0.2) / (speed || 1) }}
                    className="flex-1 bg-indigo-400 rounded-t-sm"
                    style={{ opacity: 0.5 + (i / 10) }}
                  />
                );
              })}
            </div>
            <p className="text-[8px] font-black text-gray-400 uppercase mt-2 text-center">Maxwell-Boltzmann Distribution</p>
          </div>
          <TemperatureSlider />
        </div>
      );
    }

    if (index === 16) {
      return (
        <div className="space-y-2">
          <div className="mt-4 bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
            <div className="flex items-center justify-around mb-6">
              <div className="text-center space-y-1">
                <input 
                  type="number" 
                  value={s11Temp} 
                  onChange={(e) => setS11Temp(parseInt(e.target.value) || 0)}
                  className="w-20 bg-white border-2 border-indigo-200 rounded-xl px-2 py-1 text-center font-black text-indigo-600 outline-none focus:border-indigo-400 transition-colors"
                />
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Celsius (°C)</p>
              </div>
              <ArrowRight size={20} className="text-indigo-300 animate-pulse" />
              <div className="text-center space-y-1">
                <input 
                  type="number" 
                  value={kelvin} 
                  onChange={(e) => setS11Temp((parseInt(e.target.value) || 0) - 273)}
                  className="w-20 bg-white border-2 border-indigo-200 rounded-xl px-2 py-1 text-center font-black text-indigo-600 outline-none focus:border-indigo-400 transition-colors"
                />
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Kelvin (K)</p>
              </div>
            </div>
            <div className="bg-white/50 p-3 rounded-xl border border-indigo-100 text-center">
              <p className="text-[10px] font-bold text-indigo-600 leading-relaxed">
                {s11Temp <= -273.15 ? "Absolute Zero: Particles have minimum possible kinetic energy." : 
                 s11Temp === 0 ? "Freezing point of water." : 
                 s11Temp === 100 ? "Boiling point of water at 1 atm." : 
                 `T(K) = ${s11Temp} + 273.15 = ${kelvin} K`}
              </p>
            </div>
          </div>
          <TemperatureSlider />
        </div>
      );
    }

    return null;
  };

  const LewisVisuals = ({ formula }: { formula: string }) => {
    const Dot = ({ cx, cy, color = "#10b981" }: { cx: number, cy: number, color?: string }) => (
      <circle cx={cx} cy={cy} r="1.5" fill={color} />
    );
    const Cross = ({ x, y, color = "#94a3b8" }: { x: number, y: number, color?: string, key?: any }) => (
      <text x={x} y={y + 3} textAnchor="middle" className="font-black text-[10px]" fill={color}>x</text>
    );

    const visuals: Record<string, { dotCross: React.ReactNode, displayed: React.ReactNode }> = {
      'NH3': {
        dotCross: (
          <svg viewBox="0 0 100 100" className="w-24 h-24">
            <text x="50" y="55" textAnchor="middle" className="fill-gray-800 font-black text-xl">N</text>
            <Dot cx={46} cy={35} /> <Dot cx={54} cy={35} />
            <text x="50" y="90" textAnchor="middle" className="fill-gray-400 font-black text-sm">H</text>
            <Dot cx={50} cy={68} /> <Cross x={50} y={75} />
            <text x="15" y="60" textAnchor="middle" className="fill-gray-400 font-black text-sm">H</text>
            <Dot cx={35} cy={55} /> <Cross x={28} y={58} />
            <text x="85" y="60" textAnchor="middle" className="fill-gray-400 font-black text-sm">H</text>
            <Dot cx={65} cy={55} /> <Cross x={72} y={58} />
          </svg>
        ),
        displayed: (
          <svg viewBox="0 0 100 100" className="w-24 h-24">
            <text x="50" y="55" textAnchor="middle" className="fill-gray-800 font-black text-xl">N</text>
            <Dot cx={46} cy={35} /> <Dot cx={54} cy={35} />
            <line x1="50" y1="60" x2="50" y2="80" stroke="#10b981" strokeWidth="2" />
            <text x="50" y="95" textAnchor="middle" className="fill-gray-400 font-black text-sm">H</text>
            <line x1="40" y1="52" x2="20" y2="55" stroke="#10b981" strokeWidth="2" />
            <text x="10" y="60" textAnchor="middle" className="fill-gray-400 font-black text-sm">H</text>
            <line x1="60" y1="52" x2="80" y2="55" stroke="#10b981" strokeWidth="2" />
            <text x="90" y="60" textAnchor="middle" className="fill-gray-400 font-black text-sm">H</text>
          </svg>
        )
      },
      'CH4': {
        dotCross: (
          <svg viewBox="0 0 100 100" className="w-24 h-24">
            <text x="50" y="55" textAnchor="middle" className="fill-gray-800 font-black text-xl">C</text>
            <text x="50" y="20" textAnchor="middle" className="fill-gray-400 font-black text-sm">H</text>
            <Dot cx={50} cy={35} /> <Cross x={50} y={28} />
            <text x="50" y="95" textAnchor="middle" className="fill-gray-400 font-black text-sm">H</text>
            <Dot cx={50} cy={65} /> <Cross x={50} y={75} />
            <text x="15" y="55" textAnchor="middle" className="fill-gray-400 font-black text-sm">H</text>
            <Dot cx={35} cy={50} /> <Cross x={28} y={50} />
            <text x="85" y="55" textAnchor="middle" className="fill-gray-400 font-black text-sm">H</text>
            <Dot cx={65} cy={50} /> <Cross x={72} y={50} />
          </svg>
        ),
        displayed: (
          <svg viewBox="0 0 100 100" className="w-24 h-24">
            <text x="50" y="55" textAnchor="middle" className="fill-gray-800 font-black text-xl">C</text>
            <line x1="50" y1="40" x2="50" y2="25" stroke="#10b981" strokeWidth="2" />
            <text x="50" y="20" textAnchor="middle" className="fill-gray-400 font-black text-sm">H</text>
            <line x1="50" y1="60" x2="50" y2="75" stroke="#10b981" strokeWidth="2" />
            <text x="50" y="90" textAnchor="middle" className="fill-gray-400 font-black text-sm">H</text>
            <line x1="40" y1="50" x2="25" y2="50" stroke="#10b981" strokeWidth="2" />
            <text x="15" y="55" textAnchor="middle" className="fill-gray-400 font-black text-sm">H</text>
            <line x1="60" y1="50" x2="75" y2="50" stroke="#10b981" strokeWidth="2" />
            <text x="85" y="55" textAnchor="middle" className="fill-gray-400 font-black text-sm">H</text>
          </svg>
        )
      },
      'H2O': {
        dotCross: (
          <svg viewBox="0 0 100 100" className="w-24 h-24">
            <text x="50" y="55" textAnchor="middle" className="fill-gray-800 font-black text-xl">O</text>
            <Dot cx={40} cy={35} /> <Dot cx={45} cy={30} />
            <Dot cx={60} cy={35} /> <Dot cx={55} cy={30} />
            <text x="20" y="85" textAnchor="middle" className="fill-gray-400 font-black text-sm">H</text>
            <Dot cx={38} cy={65} /> <Cross x={30} y={72} />
            <text x="80" y="85" textAnchor="middle" className="fill-gray-400 font-black text-sm">H</text>
            <Dot cx={62} cy={65} /> <Cross x={70} y={72} />
          </svg>
        ),
        displayed: (
          <svg viewBox="0 0 100 100" className="w-24 h-24">
            <text x="50" y="55" textAnchor="middle" className="fill-gray-800 font-black text-xl">O</text>
            <Dot cx={40} cy={35} /> <Dot cx={45} cy={30} />
            <Dot cx={60} cy={35} /> <Dot cx={55} cy={30} />
            <line x1="42" y1="62" x2="30" y2="75" stroke="#10b981" strokeWidth="2" />
            <text x="20" y="90" textAnchor="middle" className="fill-gray-400 font-black text-sm">H</text>
            <line x1="58" y1="62" x2="70" y2="75" stroke="#10b981" strokeWidth="2" />
            <text x="80" y="90" textAnchor="middle" className="fill-gray-400 font-black text-sm">H</text>
          </svg>
        )
      },
      'CO2': {
        dotCross: (
          <svg viewBox="0 0 100 100" className="w-24 h-24">
            <text x="50" y="55" textAnchor="middle" className="fill-gray-800 font-black text-xl">C</text>
            <text x="15" y="55" textAnchor="middle" className="fill-gray-800 font-black text-xl">O</text>
            <text x="85" y="55" textAnchor="middle" className="fill-gray-800 font-black text-xl">O</text>
            {/* Double bonds */}
            <Dot cx={35} cy={48} /> <Dot cx={35} cy={52} />
            <Cross x={28} y={48} /> <Cross x={28} y={52} />
            <Dot cx={65} cy={48} /> <Dot cx={65} cy={52} />
            <Cross x={72} y={48} /> <Cross x={72} y={52} />
            {/* Lone pairs on O */}
            <Cross x={10} y={35} /> <Cross x={15} y={35} />
            <Cross x={10} y={70} /> <Cross x={15} y={70} />
            <Cross x={85} y={35} /> <Cross x={90} y={35} />
            <Cross x={85} y={70} /> <Cross x={90} y={70} />
          </svg>
        ),
        displayed: (
          <svg viewBox="0 0 100 100" className="w-24 h-24">
            <text x="50" y="55" textAnchor="middle" className="fill-gray-800 font-black text-xl">C</text>
            <text x="15" y="55" textAnchor="middle" className="fill-gray-800 font-black text-xl">O</text>
            <text x="85" y="55" textAnchor="middle" className="fill-gray-800 font-black text-xl">O</text>
            <line x1="25" y1="48" x2="40" y2="48" stroke="#10b981" strokeWidth="2" />
            <line x1="25" y1="52" x2="40" y2="52" stroke="#10b981" strokeWidth="2" />
            <line x1="60" y1="48" x2="75" y2="48" stroke="#10b981" strokeWidth="2" />
            <line x1="60" y1="52" x2="75" y2="52" stroke="#10b981" strokeWidth="2" />
            <Dot cx={10} cy={35} /> <Dot cx={15} cy={35} />
            <Dot cx={10} cy={70} /> <Dot cx={15} cy={70} />
            <Dot cx={85} cy={35} /> <Dot cx={90} cy={35} />
            <Dot cx={85} cy={70} /> <Dot cx={90} cy={70} />
          </svg>
        )
      },
      'SF6': {
        dotCross: (
          <svg viewBox="0 0 100 100" className="w-24 h-24">
            <text x="50" y="55" textAnchor="middle" className="fill-gray-800 font-black text-lg">S</text>
            {[0, 60, 120, 180, 240, 300].map(angle => {
              const rad = (angle * Math.PI) / 180;
              const fx = 50 + Math.cos(rad) * 35;
              const fy = 50 + Math.sin(rad) * 35;
              const dx = 50 + Math.cos(rad) * 18;
              const dy = 50 + Math.sin(rad) * 18;
              const cx = 50 + Math.cos(rad) * 25;
              const cy = 50 + Math.sin(rad) * 25;
              
              // Lone pairs for F (6 crosses)
              const lps = [
                { x: fx + Math.cos(rad + 0.5) * 8, y: fy + Math.sin(rad + 0.5) * 8 },
                { x: fx + Math.cos(rad - 0.5) * 8, y: fy + Math.sin(rad - 0.5) * 8 },
                { x: fx + Math.cos(rad + 0.2) * 10, y: fy + Math.sin(rad + 0.2) * 10 },
                { x: fx + Math.cos(rad - 0.2) * 10, y: fy + Math.sin(rad - 0.2) * 10 },
                { x: fx + Math.cos(rad + 0.8) * 6, y: fy + Math.sin(rad + 0.8) * 6 },
                { x: fx + Math.cos(rad - 0.8) * 6, y: fy + Math.sin(rad - 0.8) * 6 },
              ];

              return (
                <g key={angle}>
                  <text x={fx} y={fy + 3} textAnchor="middle" className="fill-gray-400 font-black text-[10px]">F</text>
                  <Dot cx={dx} cy={dy} />
                  <Cross x={cx} y={cy} />
                  {lps.map((lp, i) => <Cross key={i} x={lp.x} y={lp.y} />)}
                </g>
              );
            })}
          </svg>
        ),
        displayed: (
          <svg viewBox="0 0 100 100" className="w-24 h-24">
            <text x="50" y="55" textAnchor="middle" className="fill-gray-800 font-black text-lg">S</text>
            {[0, 60, 120, 180, 240, 300].map(angle => {
              const rad = (angle * Math.PI) / 180;
              const fx = 50 + Math.cos(rad) * 40;
              const fy = 50 + Math.sin(rad) * 40;
              const x1 = 50 + Math.cos(rad) * 10;
              const y1 = 50 + Math.sin(rad) * 10;
              const x2 = 50 + Math.cos(rad) * 30;
              const y2 = 50 + Math.sin(rad) * 30;
              
              // Lone pairs for F
              const lp1x = fx + Math.cos(rad + 0.4) * 8;
              const lp1y = fy + Math.sin(rad + 0.4) * 8;
              const lp2x = fx + Math.cos(rad - 0.4) * 8;
              const lp2y = fy + Math.sin(rad - 0.4) * 8;
              const lp3x = fx + Math.cos(rad) * 10;
              const lp3y = fy + Math.sin(rad) * 10;

              return (
                <g key={angle}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#10b981" strokeWidth="1.5" />
                  <text x={fx} y={fy + 3} textAnchor="middle" className="fill-gray-400 font-black text-[10px]">F</text>
                  <Dot cx={lp1x} cy={lp1y} color="#94a3b8" />
                  <Dot cx={lp2x} cy={lp2y} color="#94a3b8" />
                  <Dot cx={lp3x} cy={lp3y} color="#94a3b8" />
                </g>
              );
            })}
          </svg>
        )
      }
    };

    const d = visuals[formula] || visuals['NH3'];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-gray-50 p-6 rounded-[2.5rem] border-2 border-gray-100 flex flex-col items-center">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Dot-Cross Structure</p>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm w-full flex justify-center">
            <div className="w-40 h-40">
              {React.cloneElement(d.dotCross as React.ReactElement, { className: "w-full h-full" })}
            </div>
          </div>
        </div>
        <div className="bg-gray-50 p-6 rounded-[2.5rem] border-2 border-gray-100 flex flex-col items-center">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Displayed Formula</p>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm w-full flex justify-center">
            <div className="w-40 h-40">
              {React.cloneElement(d.displayed as React.ReactElement, { className: "w-full h-full" })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const RevisionView = () => (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b-2 border-gray-200 p-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button onClick={() => setMode('dashboard')} className="text-gray-400 hover:text-gray-600">
            <ChevronLeft size={32} />
          </button>
          <h1 className="text-xl font-black text-gray-800 tracking-tight">{selectedUnit?.title} Notes</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-6 space-y-6">
        <div className={`${selectedUnit?.color} rounded-3xl p-8 text-white shadow-lg`}>
          <h2 className="text-3xl font-black mb-2">{selectedUnit?.title}</h2>
          <p className="text-white/90 text-lg">{selectedUnit?.description}</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-black text-gray-400 uppercase tracking-widest">Key Concepts</h3>
          {selectedUnit?.concepts.map((concept, i) => (
            <div 
              key={i} 
              className="bg-white border-2 border-gray-200 rounded-2xl p-5 flex gap-4 items-start shadow-[0_4px_0_0_rgba(0,0,0,0.05)]"
            >
              <div className="bg-blue-100 text-blue-600 p-2 rounded-lg mt-1">
                <CheckCircle2 size={20} />
              </div>
              <div className="flex-1">
                <p className="text-gray-700 text-lg font-medium leading-relaxed">
                  {concept.includes(': ') ? (
                    <>
                      <span className="font-black text-gray-900">{concept.split(': ')[0]}:</span>
                      {concept.substring(concept.indexOf(': ') + 1)}
                    </>
                  ) : (
                    concept
                  )}
                </p>
                {selectedUnit.id === 1 && <S11Graphics index={i} />}
                {selectedUnit.id === 2 && <S12Graphics index={i} />}
                {selectedUnit.id === 3 && <S13Graphics index={i} />}
                {selectedUnit.id === 4 && <S14Graphics index={i} />}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => startQuiz(selectedUnit!)}
          className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-black text-xl uppercase tracking-widest shadow-[0_6px_0_0_#059669] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-3"
        >
          Take the Quiz <ArrowRight size={24} />
        </button>
      </main>
    </div>
  );

  const VocabView = () => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [masteredIndices, setMasteredIndices] = useState<number[]>([]);
    const [remainingIndices, setRemainingIndices] = useState<number[]>([]);
    const [isSimplified, setIsSimplified] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [colorIndex, setColorIndex] = useState(0);
    const [isReviewMode, setIsReviewMode] = useState(false);
    const [reviewView, setReviewView] = useState<'cards' | 'list'>('cards');

    const duolingoColors = [
      'bg-[#58cc02]', // Green
      'bg-[#1cb0f6]', // Blue
      'bg-[#ff9600]', // Orange
      'bg-[#ff4b4b]', // Red
      'bg-[#ce82ff]', // Purple
    ];

    const duolingoShadows = [
      'shadow-[0_8px_0_0_#46a302]',
      'shadow-[0_8px_0_0_#1899d6]',
      'shadow-[0_8px_0_0_#e68700]',
      'shadow-[0_8px_0_0_#e64444]',
      'shadow-[0_8px_0_0_#b975e6]',
    ];

    useEffect(() => {
      if (selectedUnit) {
        const stats = sessionStats[selectedUnit.id] || { attemptedQuestions: [], masteredVocab: [] };
        const alreadyMasteredIndices = selectedUnit.vocab
          .map((v, i) => stats.masteredVocab.includes(v.term) ? i : -1)
          .filter(i => i !== -1);
        
        setMasteredIndices(alreadyMasteredIndices);

        // Only show cards NOT yet mastered in this session's initial queue
        const indices = selectedUnit.vocab
          .map((_, i) => i)
          .filter(i => !alreadyMasteredIndices.includes(i));

        // Shuffle indices for random order
        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        setRemainingIndices(indices);
        setIsCompleted(indices.length === 0);
      }
    }, [selectedUnit]);

    const handleSwipe = (direction: 'left' | 'right') => {
      if (remainingIndices.length === 0) return;
      
      const currentVocabIdx = remainingIndices[0];
      const currentVocab = selectedUnit?.vocab[currentVocabIdx];
      
      if (!currentVocab) return;

      setIsFlipped(false);
      setColorIndex((prev) => (prev + 1) % duolingoColors.length);

      if (direction === 'right') {
        // Mastered
        setMasteredIndices(prev => [...prev, currentVocabIdx]);

        // Track mastered vocab in session stats
        setSessionStats(prev => {
          const unitStats = prev[selectedUnit!.id] || { attemptedQuestions: [], masteredVocab: [] };
          if (!unitStats.masteredVocab.includes(currentVocab.term)) {
            return {
              ...prev,
              [selectedUnit!.id]: {
                ...unitStats,
                masteredVocab: [...unitStats.masteredVocab, currentVocab.term]
              }
            };
          }
          return prev;
        });
        
        setRemainingIndices(prev => {
          const next = prev.slice(1);
          if (next.length === 0) {
            setIsCompleted(true);
          }
          return next;
        });
      } else {
        // Revise Later (Left) - Move to end of queue
        setRemainingIndices(prev => {
          if (prev.length <= 1) return prev;
          return [...prev.slice(1), prev[0]];
        });
      }
    };

    if (isCompleted) {
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="bg-white p-12 rounded-full shadow-2xl mb-8"
          >
            <Trophy size={120} className="text-yellow-400" />
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-black text-gray-800 mb-4 uppercase tracking-tight"
          >
            All mastered! Good job!
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-500 text-xl mb-12"
          >
            You've learned all the key terms for this unit.
          </motion.p>
          <div className="flex flex-col gap-4 w-full max-w-xs">
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={() => {
                setIsCompleted(false);
                setIsReviewMode(true);
              }}
              className="bg-white text-emerald-500 border-2 border-emerald-500 px-12 py-4 rounded-2xl font-black text-xl uppercase tracking-widest shadow-[0_6px_0_0_#10b981] active:shadow-none active:translate-y-1 transition-all"
            >
              Review All
            </motion.button>
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              onClick={() => setMode('dashboard')}
              className="bg-emerald-500 text-white px-12 py-4 rounded-2xl font-black text-xl uppercase tracking-widest shadow-[0_6px_0_0_#059669] active:shadow-none active:translate-y-1 transition-all"
            >
              Back to Dashboard
            </motion.button>
          </div>
        </div>
      );
    }

    const currentVocab = selectedUnit?.vocab[remainingIndices[0]];

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col overflow-hidden">
        <header className="bg-white border-b-2 border-gray-200 p-4 sticky top-0 z-10">
          <div className={`${isReviewMode ? 'max-w-6xl' : 'max-w-2xl'} mx-auto flex items-center justify-between transition-all duration-300`}>
            <div className="flex items-center gap-4">
              <button onClick={() => setMode('dashboard')} className="text-gray-400 hover:text-gray-600">
                <ChevronLeft size={32} />
              </button>
              <div>
                <h1 className="text-lg font-black text-gray-800 uppercase tracking-tight leading-none">Vocab</h1>
                <p className="text-xs font-bold text-gray-400 tracking-widest">{selectedUnit?.title}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="text-right mr-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Progress</p>
                <p className="text-sm font-black text-emerald-500">
                  {masteredIndices.length} / {selectedUnit?.vocab.length}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSimplified(!isSimplified)}
                className="bg-purple-100 text-purple-600 px-3 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider border-2 border-purple-200 flex items-center gap-2"
              >
                <Languages size={16} />
                {isSimplified ? 'Simplified' : 'Traditional'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsReviewMode(!isReviewMode)}
                className={`${isReviewMode ? 'bg-emerald-100 text-emerald-600 border-emerald-200' : 'bg-gray-100 text-gray-600 border-gray-200'} px-3 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider border-2 flex items-center gap-2`}
              >
                {isReviewMode ? <EyeOff size={16} /> : <Eye size={16} />}
                {isReviewMode ? 'Study' : 'Review'}
              </motion.button>
            </div>
          </div>
        </header>

        {isReviewMode ? (
          <main className={`flex-1 overflow-y-auto p-4 ${isReviewMode ? 'max-w-6xl' : 'max-w-2xl'} mx-auto w-full transition-all duration-300`}>
            <div className="flex justify-center mb-6 gap-2">
              <button
                onClick={() => setReviewView('cards')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${reviewView === 'cards' ? 'bg-emerald-500 text-white shadow-[0_4px_0_0_#059669]' : 'bg-white text-gray-400 border-2 border-gray-200 hover:bg-gray-50'}`}
              >
                <LayoutGrid size={16} />
                Cards
              </button>
              <button
                onClick={() => setReviewView('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${reviewView === 'list' ? 'bg-emerald-500 text-white shadow-[0_4px_0_0_#059669]' : 'bg-white text-gray-400 border-2 border-gray-200 hover:bg-gray-50'}`}
              >
                <List size={16} />
                List
              </button>
            </div>

            {reviewView === 'cards' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedUnit?.vocab.map((v, idx) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={idx}
                    className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-[0_4px_0_0_rgba(0,0,0,0.05)]"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest block mb-1">Term</span>
                        <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">{v.term}</h3>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest block mb-1">Chinese</span>
                        <p className="text-lg font-black text-emerald-500">{isSimplified ? v.simplified : v.traditional}</p>
                      </div>
                    </div>
                    <div className="h-px bg-gray-100 w-full mb-4" />
                    <div>
                      <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest block mb-1">Definition</span>
                      <p className="text-gray-600 text-sm font-medium leading-relaxed">{v.definition}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-[0_4px_0_0_rgba(0,0,0,0.05)]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b-2 border-gray-200">
                      <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Vocabulary</th>
                      <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Definition</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedUnit?.vocab.map((v, idx) => (
                      <tr key={idx} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <p className="font-black text-gray-800 uppercase tracking-tight leading-tight">{v.term}</p>
                          <p className="text-emerald-500 font-black text-xs mt-1">{isSimplified ? v.simplified : v.traditional}</p>
                        </td>
                        <td className="p-4 text-sm text-gray-600 font-medium leading-relaxed">
                          {v.definition}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </main>
        ) : (
          <main className="flex-1 flex flex-col items-center justify-center p-6 relative">
          <div className="w-full max-w-sm aspect-[3/4] relative perspective-1000 mb-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={remainingIndices[0]}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_, info) => {
                  if (info.offset.x > 100) handleSwipe('right');
                  else if (info.offset.x < -100) handleSwipe('left');
                }}
                animate={{ 
                  rotateY: isFlipped ? 180 : 0,
                  x: 0,
                  opacity: 1,
                  scale: 1
                }}
                exit={{ 
                  x: 0,
                  opacity: 0,
                  scale: 0.8
                }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                onClick={() => setIsFlipped(!isFlipped)}
                className="w-full h-full cursor-pointer preserve-3d relative transition-shadow duration-300"
              >
                {/* Front */}
                <div 
                  className={`absolute inset-0 backface-hidden rounded-3xl flex flex-col items-center justify-center p-8 text-center ${duolingoColors[colorIndex]} ${duolingoShadows[colorIndex]}`}
                >
                  <span className="text-white/50 text-xs font-black uppercase tracking-[0.2em] mb-4">English Term</span>
                  <h2 className="text-white text-4xl font-black uppercase tracking-tight leading-tight">
                    {currentVocab?.term}
                  </h2>
                  <div className="absolute bottom-8 flex items-center gap-2 text-white/60 font-bold text-sm uppercase tracking-widest">
                    <ArrowRight size={16} className="animate-pulse" /> Tap to flip
                  </div>
                </div>

                {/* Back */}
                <div 
                  className="absolute inset-0 backface-hidden rounded-3xl bg-white flex flex-col items-center justify-center p-8 text-center rotate-y-180 border-4 border-gray-100 shadow-[0_8px_0_0_#e5e5e5]"
                >
                  <div className="space-y-8 w-full">
                    <div>
                      <span className="text-gray-300 text-[10px] font-black uppercase tracking-[0.2em] block mb-2">Translation</span>
                      <h3 className="text-gray-800 text-3xl font-black">
                        {isSimplified ? currentVocab?.simplified : currentVocab?.traditional}
                      </h3>
                    </div>
                    
                    <div className="h-px bg-gray-100 w-full" />
                    
                    <div>
                      <span className="text-gray-300 text-[10px] font-black uppercase tracking-[0.2em] block mb-2">Definition</span>
                      <p className="text-gray-600 text-lg font-medium leading-relaxed">
                        {currentVocab?.definition}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Swipe Indicators - Moved to normal flow to avoid overlapping */}
          <div className="w-full max-w-sm flex justify-between px-4">
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full bg-red-100 border-2 border-red-200 flex items-center justify-center text-red-500 shadow-[0_4px_0_0_#fecaca]">
                <XCircle size={28} />
              </div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Revise Later</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full bg-emerald-100 border-2 border-emerald-200 flex items-center justify-center text-emerald-500 shadow-[0_4px_0_0_#a7f3d0]">
                <CheckCircle2 size={28} />
              </div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mastered</span>
            </div>
          </div>
        </main>
      )}

      {!isReviewMode && (
        <footer className="p-6 text-center">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
            Swipe left to revise • Swipe right to master
          </p>
        </footer>
      )}

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};

  const PlaygroundView = () => {
    const [subMode, setSubMode] = useState<'select' | 'equations' | 'chemicals' | 'graphs' | 'simulations' | 'solubility' | 'mole' | 'mole-calc' | 'ionic'>('select');
    const [selectedEquation, setSelectedEquation] = useState<any>(null);
    const [equationSubject, setEquationSubject] = useState<string>('');
    const [isPracticeMode, setIsPracticeMode] = useState(false);
    const [practiceQuestion, setPracticeQuestion] = useState<any>(null);
    const [practiceAnswer, setPracticeAnswer] = useState<string | null>(null);
    const [isPracticeChecked, setIsPracticeChecked] = useState(false);
    const [selectedChemical, setSelectedChemical] = useState<any>(null);
    const [selectedGraph, setSelectedGraph] = useState<string | null>(null);
    const [graphSpeed1, setGraphSpeed1] = useState(5);
    const [graphSpeed2, setGraphSpeed2] = useState(10);

    const VirtualCalculator = ({ onClose }: { onClose: () => void }) => {
      const [display, setDisplay] = useState('0');
      const [prevValue, setPrevValue] = useState<number | null>(null);
      const [operator, setOperator] = useState<string | null>(null);
      const [waitingForOperand, setWaitingForOperand] = useState(false);

      const inputDigit = (digit: string) => {
        if (waitingForOperand) {
          setDisplay(digit);
          setWaitingForOperand(false);
        } else {
          setDisplay(display === '0' ? digit : display + digit);
        }
      };

      const inputDot = () => {
        if (waitingForOperand) {
          setDisplay('0.');
          setWaitingForOperand(false);
        } else if (display.indexOf('.') === -1) {
          setDisplay(display + '.');
        }
      };

      const clearDisplay = () => {
        setDisplay('0');
        setPrevValue(null);
        setOperator(null);
        setWaitingForOperand(false);
      };

      const performOperation = (nextOperator: string) => {
        const inputValue = parseFloat(display);

        if (prevValue === null) {
          setPrevValue(inputValue);
        } else if (operator) {
          const currentValue = prevValue || 0;
          let newValue = currentValue;

          if (operator === '+') newValue = currentValue + inputValue;
          else if (operator === '-') newValue = currentValue - inputValue;
          else if (operator === '×') newValue = currentValue * inputValue;
          else if (operator === '÷') newValue = currentValue / inputValue;

          setPrevValue(newValue);
          setDisplay(String(newValue));
        }

        setWaitingForOperand(true);
        setOperator(nextOperator);
      };

      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed bottom-24 right-6 z-50 bg-gray-800 p-4 rounded-3xl shadow-2xl border-4 border-gray-700 w-64"
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-400 font-black text-[10px] uppercase tracking-widest">Calculator</span>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <XCircle size={20} />
            </button>
          </div>
          <div className="bg-gray-900 p-4 rounded-2xl mb-4 text-right overflow-hidden">
            <div className="text-gray-500 text-[10px] font-mono h-4">
              {prevValue !== null && `${prevValue} ${operator || ''}`}
            </div>
            <div className="text-white text-2xl font-mono truncate">{display}</div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {['C', '÷', '×', '-'].map(btn => (
              <button
                key={btn}
                onClick={() => btn === 'C' ? clearDisplay() : performOperation(btn)}
                className="p-3 rounded-xl bg-gray-700 text-orange-400 font-black hover:bg-gray-600 transition-colors"
              >
                {btn}
              </button>
            ))}
            {[7, 8, 9, '+'].map(btn => (
              <button
                key={btn}
                onClick={() => typeof btn === 'number' ? inputDigit(String(btn)) : performOperation(btn)}
                className={`p-3 rounded-xl font-black transition-colors ${typeof btn === 'number' ? 'bg-gray-600 text-white hover:bg-gray-500' : 'bg-gray-700 text-orange-400 hover:bg-gray-600'}`}
              >
                {btn}
              </button>
            ))}
            {[4, 5, 6, '='].map(btn => (
              <button
                key={btn}
                onClick={() => typeof btn === 'number' ? inputDigit(String(btn)) : performOperation(btn === '=' ? '=' : btn)}
                className={`p-3 rounded-xl font-black transition-colors ${typeof btn === 'number' ? 'bg-gray-600 text-white hover:bg-gray-500' : 'bg-gray-700 text-emerald-400 hover:bg-gray-600'}`}
              >
                {btn}
              </button>
            ))}
            {[1, 2, 3, '0'].map(btn => (
              <button
                key={btn}
                onClick={() => inputDigit(String(btn))}
                className="p-3 rounded-xl bg-gray-600 text-white font-black hover:bg-gray-500 transition-colors"
              >
                {btn}
              </button>
            ))}
            <button
              onClick={inputDot}
              className="p-3 rounded-xl bg-gray-600 text-white font-black hover:bg-gray-500 transition-colors col-span-4"
            >
              .
            </button>
          </div>
        </motion.div>
      );
    };

    const MoleCalculationPlayground = () => {
      const [calcMode, setCalcMode] = useState<'mass' | 'conc' | 'gas' | 'dimensional'>('mass');
      const [showCalculator, setShowCalculator] = useState(false);
      const [examples, setExamples] = useState<any[]>([]);
      const [userAnswers, setUserAnswers] = useState<string[]>(['', '', '', '', '', '']);
      const [isChecked, setIsChecked] = useState(false);

      const generateExamples = useCallback(() => {
        const massList = [
          { formula: "H2", mr: 2, mass: 4 },
          { formula: "CH4", mr: 16, mass: 3.2 },
          { formula: "CO2", mr: 44, mass: 11 },
          { formula: "NH3", mr: 17, mass: 3.4 },
          { formula: "O2", mr: 32, mass: 1.6 },
          { formula: "N2", mr: 28, mass: 14 },
          { formula: "NaCl", mr: 58.5, mass: 11.7 },
          { formula: "MgO", mr: 40, mass: 8 },
          { formula: "H2O", mr: 18, mass: 3.6 },
          { formula: "HCl", mr: 36.5, mass: 7.3 }
        ];

        const concList = [
          { name: "NaOH", conc: 0.1, vol: 250 },
          { name: "HCl", conc: 2.0, vol: 50 },
          { name: "H2SO4", conc: 0.5, vol: 100 },
          { name: "NaCl", conc: 1.0, vol: 500 },
          { name: "KOH", conc: 0.2, vol: 25 },
          { name: "HNO3", conc: 1.5, vol: 200 }
        ];

        const gasList = [
          { name: "H2", vol: 2400 },
          { name: "O2", vol: 12000 },
          { name: "CO2", vol: 480 },
          { name: "N2", vol: 6000 },
          { name: "CH4", vol: 120 },
          { name: "NH3", vol: 240 }
        ];

        let selected: any[] = [];
        if (calcMode === 'mass') {
          selected = [...massList].sort(() => Math.random() - 0.5).slice(0, 6).map(ex => ({ ...ex, answer: (ex.mass / ex.mr).toFixed(2) }));
        } else if (calcMode === 'conc') {
          selected = [...concList].sort(() => Math.random() - 0.5).slice(0, 6).map(ex => ({ ...ex, answer: (ex.conc * (ex.vol / 1000)).toFixed(3) }));
        } else if (calcMode === 'gas') {
          selected = [...gasList].sort(() => Math.random() - 0.5).slice(0, 6).map(ex => ({ ...ex, answer: (ex.vol / 24000).toFixed(3) }));
        } else if (calcMode === 'dimensional') {
          selected = [
            { type: 'mass', formula: "H2", mr: 2, mass: 4, answer: "2.00" },
            { type: 'conc', name: "NaOH", conc: 0.1, vol: 500, answer: "0.050" },
            { type: 'gas', name: "H2", vol: 480, answer: "0.020" },
            ...massList.sort(() => Math.random() - 0.5).slice(0, 3).map(ex => ({ ...ex, type: 'mass', answer: (ex.mass / ex.mr).toFixed(2) }))
          ];
        }

        setExamples(selected);
        setUserAnswers(['', '', '', '', '', '']);
        setIsChecked(false);
      }, [calcMode]);

      useEffect(() => {
        generateExamples();
      }, [generateExamples]);

      const checkAnswers = () => {
        setIsChecked(true);
      };

      const DimensionalAnalysisView = () => {
        const [activeExampleIndex, setActiveExampleIndex] = useState(0);
        const [placedBlocks, setPlacedBlocks] = useState<any[]>([]);
        const [isDimChecked, setIsDimChecked] = useState(false);
        const [isDimCorrect, setIsDimCorrect] = useState(false);
        
        const ex = examples[activeExampleIndex];
        if (!ex) return null;

        const blocks = [
          { id: 'b1', top: `1 mol`, bottom: `${ex.mr || '2'} g`, val: 1 / (ex.mr || 2) },
          { id: 'b2', top: `1 dm³`, bottom: `1000 cm³`, val: 1 / 1000 },
          { id: 'b3', top: `1 mol`, bottom: `24 dm³`, val: 1 / 24 },
          { id: 'b4', top: `${ex.conc || '0.1'} mol`, bottom: `1 dm³`, val: ex.conc || 0.1 }
        ];

        const [availableBlocks, setAvailableBlocks] = useState(blocks.map(b => ({ ...b, inverted: false })));

        useEffect(() => {
          setAvailableBlocks(blocks.map(b => ({ ...b, inverted: false })));
        }, [activeExampleIndex, examples]);

        const toggleInvert = (id: string, isPlaced: boolean, index?: number) => {
          if (isPlaced && index !== undefined) {
            const newPlaced = [...placedBlocks];
            newPlaced[index] = { ...newPlaced[index], inverted: !newPlaced[index].inverted };
            setPlacedBlocks(newPlaced);
          } else {
            setAvailableBlocks(availableBlocks.map(b => b.id === id ? { ...b, inverted: !b.inverted } : b));
          }
          setIsDimChecked(false);
        };

        const addBlock = (block: any) => {
          setPlacedBlocks([...placedBlocks, { ...block, instanceId: Math.random() }]);
          setIsDimChecked(false);
        };

        const removeBlock = (index: number) => {
          const newPlaced = [...placedBlocks];
          newPlaced.splice(index, 1);
          setPlacedBlocks(newPlaced);
          setIsDimChecked(false);
        };

        const checkDimResult = () => {
          let currentVal = ex.mass || ex.vol || 0;
          placedBlocks.forEach(b => {
            const multiplier = b.inverted ? (1 / b.val) : b.val;
            currentVal *= multiplier;
          });
          
          const diff = Math.abs(currentVal - parseFloat(ex.answer));
          setIsDimCorrect(diff < 0.005);
          setIsDimChecked(true);
        };

        return (
          <div className="space-y-6">
            <div className="bg-purple-50 border-2 border-purple-100 p-6 rounded-3xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-purple-600 font-black text-lg uppercase tracking-tight">Dimensional Analysis</h3>
                {isDimChecked && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`px-4 py-1 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2
                      ${isDimCorrect ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}
                    `}
                  >
                    {isDimCorrect ? <><CheckCircle2 size={14} /> Correct!</> : <><XCircle size={14} /> Incorrect</>}
                  </motion.div>
                )}
              </div>
              
              <div className="flex items-center gap-4 flex-wrap min-h-[100px]">
                <div className="bg-white px-4 py-3 rounded-xl border-2 border-purple-200 font-black text-gray-700 shadow-sm">
                  {ex.mass ? `${ex.mass} g ` : ex.vol ? `${ex.vol} cm³ ` : ''}
                  {formatFormula(ex.formula || ex.name)}
                </div>
                
                {placedBlocks.map((b, i) => (
                  <React.Fragment key={b.instanceId}>
                    <span className="text-2xl font-black text-purple-400">×</span>
                    <div className="relative group">
                      <motion.div 
                        layoutId={b.instanceId}
                        onClick={() => toggleInvert(b.id, true, i)}
                        className="bg-purple-600 p-3 rounded-xl flex flex-col items-center justify-center min-w-[100px] cursor-pointer border-2 border-purple-400 shadow-lg hover:bg-purple-500 transition-colors"
                      >
                        <div className="text-white text-[10px] font-black uppercase tracking-widest">{b.inverted ? b.bottom : b.top}</div>
                        <div className="w-full h-[2px] bg-white my-1" />
                        <div className="text-white text-[10px] font-black uppercase tracking-widest">{b.inverted ? b.top : b.bottom}</div>
                      </motion.div>
                      <button 
                        onClick={() => removeBlock(i)}
                        className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <XCircle size={14} />
                      </button>
                    </div>
                  </React.Fragment>
                ))}
                
                {placedBlocks.length > 0 && (
                  <>
                    <span className="text-2xl font-black text-purple-400">=</span>
                    <div className="bg-emerald-100 px-4 py-3 rounded-xl border-2 border-emerald-200 font-black text-emerald-700 shadow-sm">
                      {isDimChecked && isDimCorrect ? `${ex.answer} mol` : '? mol'}
                    </div>
                  </>
                )}
              </div>
              
              <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mt-6 bg-white/50 p-2 rounded-lg inline-block">
                💡 Click blocks to invert. Click available blocks below to add them.
              </p>
            </div>

            <div className="bg-gray-100 p-6 rounded-3xl">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Available Blocks</p>
              <div className="flex gap-4 flex-wrap">
                {availableBlocks.map((b) => (
                  <motion.div 
                    key={b.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addBlock(b)}
                    className="bg-purple-600 p-3 rounded-xl flex flex-col items-center justify-center min-w-[110px] cursor-pointer border-2 border-purple-400 shadow-lg hover:bg-purple-500 transition-colors"
                  >
                    <div className="text-white text-[10px] font-black uppercase tracking-widest">{b.inverted ? b.bottom : b.top}</div>
                    <div className="w-full h-[2px] bg-white my-1" />
                    <div className="text-white text-[10px] font-black uppercase tracking-widest">{b.inverted ? b.top : b.bottom}</div>
                  </motion.div>
                ))}
                <button
                  onClick={() => setAvailableBlocks(availableBlocks.map(b => ({ ...b, inverted: !b.inverted })))}
                  className="p-3 rounded-xl border-2 border-dashed border-purple-300 text-purple-400 font-black text-[10px] uppercase tracking-widest hover:bg-purple-50 transition-colors"
                >
                  Invert All
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="flex gap-2 bg-white p-2 rounded-2xl border-2 border-gray-100">
                {examples.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setActiveExampleIndex(i); setPlacedBlocks([]); setIsDimChecked(false); }}
                    className={`w-10 h-10 rounded-xl font-black text-sm transition-all
                      ${activeExampleIndex === i ? 'bg-purple-500 text-white shadow-md scale-110' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}
                    `}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={checkDimResult}
                  disabled={placedBlocks.length === 0}
                  className={`px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-[0_6px_0_0_#059669] active:scale-95 transition-all
                    ${placedBlocks.length === 0 ? 'bg-gray-200 text-gray-400 shadow-none cursor-not-allowed' : 'bg-emerald-500 text-white'}
                  `}
                >
                  Check Setup
                </button>
              </div>
            </div>
          </div>
        );
      };

      return (
        <div className="space-y-8">
          <div className="flex gap-2 bg-gray-100 p-1 rounded-2xl overflow-x-auto">
            {(['mass', 'conc', 'gas', 'dimensional'] as const).map(m => (
              <button
                key={m}
                onClick={() => setCalcMode(m)}
                className={`flex-1 min-w-[100px] py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all
                  ${calcMode === m ? 'bg-white text-orange-500 shadow-sm' : 'text-gray-400 hover:text-gray-600'}
                `}
              >
                {m === 'mass' ? 'From Mass' : m === 'conc' ? 'From Conc/Vol' : m === 'gas' ? 'From Gas Vol' : 'Dimensional Analysis'}
              </button>
            ))}
          </div>

          {calcMode !== 'dimensional' ? (
            <>
              <div className="bg-orange-50 border-2 border-orange-100 p-6 rounded-3xl">
                <h3 className="text-orange-600 font-black text-lg uppercase tracking-tight mb-2">Formula</h3>
                <div className="text-2xl font-black text-gray-800 font-mono">
                  {calcMode === 'mass' && <span>n = m / M<sub>r</sub></span>}
                  {calcMode === 'conc' && <span>n = C × V</span>}
                  {calcMode === 'gas' && <span>n = V / 24</span>}
                </div>
                <p className="text-gray-500 text-xs font-bold mt-2 uppercase tracking-widest">
                  {calcMode === 'mass' && "m = mass (g), Mr = molar mass (g/mol)"}
                  {calcMode === 'conc' && "C = conc (mol dm⁻³), V = volume (dm³)"}
                  {calcMode === 'gas' && "V = gas volume (dm³), 24 dm³/mol = molar volume"}
                </p>
                {(calcMode === 'conc' || calcMode === 'gas') && (
                  <div className="mt-4 p-3 bg-amber-100/50 rounded-xl border border-amber-200">
                    <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest leading-tight">
                      ⚠️ Reminder: Convert cm³ to dm³ first (divide by 1000)
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {examples.map((ex, i) => (
                  <div key={i} className={`bg-white border-2 p-4 rounded-2xl shadow-sm transition-all ${isChecked ? (Math.abs(parseFloat(userAnswers[i]) - parseFloat(ex.answer)) < 0.05 ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50') : 'border-gray-100'}`}>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{formatFormula(ex.formula || ex.name)}</p>
                    <div className="space-y-1 mb-4">
                      {ex.mass && <p className="text-xs font-bold text-gray-700">m = <span className="text-orange-500">{ex.mass} g</span></p>}
                      {ex.mr && <p className="text-xs font-bold text-gray-700">M<sub>r</sub> = <span className="text-blue-500">{ex.mr}</span></p>}
                      {ex.conc && <p className="text-xs font-bold text-gray-700">C = <span className="text-orange-500">{ex.conc} mol dm⁻³</span></p>}
                      {ex.vol && <p className="text-xs font-bold text-gray-700">V = <span className="text-blue-500">{ex.vol} cm³</span></p>}
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        value={userAnswers[i]}
                        onChange={(e) => {
                          const newAns = [...userAnswers];
                          newAns[i] = e.target.value;
                          setUserAnswers(newAns);
                        }}
                        placeholder="0.00"
                        className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:border-orange-400 transition-all"
                      />
                      {isChecked && (
                        <div className="absolute -top-2 -right-2">
                          {Math.abs(parseFloat(userAnswers[i]) - parseFloat(ex.answer)) < 0.05 ? (
                            <CheckCircle2 className="text-emerald-500" size={20} />
                          ) : (
                            <XCircle className="text-rose-500" size={20} />
                          )}
                        </div>
                      )}
                    </div>
                    {isChecked && Math.abs(parseFloat(userAnswers[i]) - parseFloat(ex.answer)) >= 0.05 && (
                      <p className="text-[10px] font-black text-rose-500 mt-2 uppercase">Ans: {ex.answer}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={checkAnswers}
                  className="flex items-center justify-center gap-3 px-8 py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-[0_6px_0_0_#059669] active:scale-95 transition-all"
                >
                  <CheckCircle2 size={20} />
                  Check Answers
                </button>
                <button
                  onClick={generateExamples}
                  className="flex items-center justify-center gap-3 px-8 py-4 bg-white border-2 border-gray-200 text-gray-600 rounded-2xl font-black uppercase tracking-widest shadow-[0_6px_0_0_#e5e7eb] hover:border-orange-400 active:scale-95 transition-all"
                >
                  <RefreshCw size={20} />
                  More Questions
                </button>
              </div>
            </>
          ) : (
            <DimensionalAnalysisView />
          )}

          <div className="flex justify-center">
            <button
              onClick={() => setShowCalculator(!showCalculator)}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95
                ${showCalculator ? 'bg-gray-800 text-white shadow-[0_6px_0_0_#000000]' : 'bg-white border-2 border-gray-200 text-gray-600 shadow-[0_6px_0_0_#e5e7eb] hover:border-orange-400'}
              `}
            >
              <Calculator size={20} />
              {showCalculator ? 'Hide Calculator' : 'Show Calculator'}
            </button>
          </div>

          <AnimatePresence>
            {showCalculator && <VirtualCalculator onClose={() => setShowCalculator(false)} />}
          </AnimatePresence>
        </div>
      );
    };

    const SolubilityPlayground = () => {
      const salts = [
        { name: 'Potassium Nitrate', formula: 'KNO₃', soluble: true, rule: 'All K⁺ and NO₃⁻ salts are soluble.' },
        { name: 'Sodium Chloride', formula: 'NaCl', soluble: true, rule: 'All Na⁺ salts are soluble.' },
        { name: 'Ammonium Sulfate', formula: ' (NH₄)₂SO₄', soluble: true, rule: 'All NH₄⁺ salts are soluble.' },
        { name: 'Barium Sulfate', formula: 'BaSO₄', soluble: false, rule: 'Most sulfates are soluble except BaSO₄ and PbSO₄.' },
        { name: 'Silver Chloride', formula: 'AgCl', soluble: false, rule: 'Most halides are soluble except AgX and PbX₂.' },
        { name: 'Lead(II) Iodide', formula: 'PbI₂', soluble: false, rule: 'Most halides are soluble except AgX and PbX₂.' },
        { name: 'Calcium Carbonate', formula: 'CaCO₃', soluble: false, rule: 'Most carbonates are insoluble except those of K⁺/Na⁺/NH₄⁺.' },
        { name: 'Copper(II) Hydroxide', formula: 'Cu(OH)₂', soluble: false, rule: 'Most hydroxides are insoluble except those of K⁺/Na⁺/NH₄⁺.' },
        { name: 'Magnesium Sulfate', formula: 'MgSO₄', soluble: true, rule: 'Most sulfates are soluble.' },
        { name: 'Iron(II) Chloride', formula: 'FeCl₂', soluble: true, rule: 'Most halides are soluble.' },
        { name: 'Sodium Carbonate', formula: 'Na₂CO₃', soluble: true, rule: 'Carbonates of Na⁺ are soluble.' },
        { name: 'Potassium Hydroxide', formula: 'KOH', soluble: true, rule: 'Hydroxides of K⁺ are soluble.' },
      ];

      const [currentIndex, setCurrentIndex] = useState(0);
      const [score, setScore] = useState(0);
      const [showResult, setShowResult] = useState(false);
      const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

      const currentSalt = salts[currentIndex];

      const handleAnswer = (answer: boolean) => {
        if (answer === currentSalt.soluble) {
          setScore(score + 1);
          setFeedback('correct');
        } else {
          setFeedback('wrong');
        }

        setTimeout(() => {
          setFeedback(null);
          if (currentIndex < salts.length - 1) {
            setCurrentIndex(currentIndex + 1);
          } else {
            setShowResult(true);
          }
        }, 1500);
      };

      const reset = () => {
        setCurrentIndex(0);
        setScore(0);
        setShowResult(false);
        setFeedback(null);
      };

      if (showResult) {
        return (
          <main className="max-w-2xl mx-auto p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border-2 border-gray-200 rounded-[2.5rem] p-12 text-center shadow-[0_8px_0_0_rgba(0,0,0,0.05)]"
            >
              <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy size={48} />
              </div>
              <h2 className="text-3xl font-black text-gray-800 uppercase tracking-tight mb-2">Revision Complete!</h2>
              <p className="text-gray-500 font-bold mb-8">You identified {score} out of {salts.length} salts correctly.</p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-100">
                  <p className="text-2xl font-black text-emerald-500">{Math.round((score / salts.length) * 100)}%</p>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Accuracy</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-100">
                  <p className="text-2xl font-black text-blue-500">{score}</p>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Correct</p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={reset}
                className="w-full bg-emerald-500 text-white font-black py-4 rounded-2xl shadow-[0_4px_0_0_#059669] uppercase tracking-widest"
              >
                Try Again
              </motion.button>
            </motion.div>
          </main>
        );
      }

      return (
        <main className="max-w-2xl mx-auto p-6">
          <div className="mb-8 flex justify-between items-end">
            <div>
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Question {currentIndex + 1} of {salts.length}</p>
              <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Is it Soluble?</h2>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Score</p>
              <p className="text-xl font-black text-emerald-500">{score}</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white border-2 border-gray-200 rounded-[2.5rem] p-12 text-center shadow-[0_8px_0_0_rgba(0,0,0,0.05)] relative overflow-hidden"
            >
              <div className="mb-8">
                <h3 className="text-4xl font-black text-gray-800 mb-2">{currentSalt.formula}</h3>
                <p className="text-lg font-bold text-gray-400 uppercase tracking-widest">{currentSalt.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={feedback !== null}
                  onClick={() => handleAnswer(true)}
                  className="bg-emerald-50 border-2 border-emerald-200 p-8 rounded-3xl group hover:bg-emerald-500 transition-colors"
                >
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-500 group-hover:text-emerald-600">
                    <CheckCircle2 size={32} />
                  </div>
                  <span className="font-black text-emerald-600 uppercase tracking-widest group-hover:text-white">Soluble</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={feedback !== null}
                  onClick={() => handleAnswer(false)}
                  className="bg-rose-50 border-2 border-rose-200 p-8 rounded-3xl group hover:bg-rose-500 transition-colors"
                >
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-rose-500 group-hover:text-rose-600">
                    <XCircle size={32} />
                  </div>
                  <span className="font-black text-rose-600 uppercase tracking-widest group-hover:text-white">Insoluble</span>
                </motion.button>
              </div>

              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`absolute inset-0 flex items-center justify-center p-8 z-30 ${
                      feedback === 'correct' ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                  >
                    <div className="text-white text-center">
                      <div className="mb-4 flex justify-center">
                        {feedback === 'correct' ? <CheckCircle2 size={64} /> : <XCircle size={64} />}
                      </div>
                      <h4 className="text-2xl font-black uppercase tracking-tight mb-2">
                        {feedback === 'correct' ? 'Correct!' : 'Incorrect'}
                      </h4>
                      <p className="font-bold text-white/90">{currentSalt.rule}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>

          <div className="mt-12 bg-white border-2 border-gray-200 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Info className="text-blue-500" size={20} />
              <h4 className="font-black text-gray-800 uppercase tracking-tight">Solubility Rules Reminder</h4>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <p className="text-sm font-bold text-gray-600">
                  All <span className="text-emerald-600">K<sup>+</sup></span>, <span className="text-emerald-600">Na<sup>+</sup></span>, <span className="text-emerald-600">NH<sub>4</sub><sup>+</sup></span>, and <span className="text-emerald-600">NO<sub>3</sub><sup>-</sup></span> salts are <span className="text-emerald-600">SOLUBLE</span>.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                <p className="text-sm font-bold text-gray-600">
                  Most <span className="text-sky-600">Sulfates (SO<sub>4</sub><sup>2-</sup>)</span> are soluble except <span className="text-rose-500">BaSO<sub>4</sub></span> and <span className="text-rose-500">PbSO<sub>4</sub></span>.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                <p className="text-sm font-bold text-gray-600">
                  Most <span className="text-sky-600">Halides (Cl<sup>-</sup>, Br<sup>-</sup>, I<sup>-</sup>)</span> are soluble except <span className="text-rose-500">AgX</span> and <span className="text-rose-500">PbX<sub>2</sub></span>.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <p className="text-sm font-bold text-gray-600">
                  Most <span className="text-rose-600">Hydroxides (OH<sup>-</sup>)</span> and <span className="text-rose-600">Carbonates (CO<sub>3</sub><sup>2-</sup>)</span> are <span className="text-rose-600">INSOLUBLE</span> except those of K<sup>+</sup>, Na<sup>+</sup>, and NH<sub>4</sub><sup>+</sup>.
                </p>
              </div>
            </div>
          </div>
        </main>
      );
    };


    const MolePlayground = () => {
      const moleQuestions = [
        {
          equation: "N₂ + 3H₂ → 2NH₃",
          parts: [
            { formula: "N₂", ratio: 1, mr: 28 },
            { formula: "H₂", ratio: 3, mr: 2 },
            { formula: "NH₃", ratio: 2, mr: 17 }
          ],
          known: { index: 0, type: 'mass', value: 28, unit: 'g' },
          unknown: { index: 2, type: 'mass', label: 'mass', unit: 'g' },
          steps: [
            { text: "28 g / 28 g/mol = 1 mol", val: 1 },
            { text: "1 mol × 2 = 2 mol", val: 2 },
            { text: "2 mol × 17 g/mol = 34 g", val: 34 }
          ]
        },
        {
          equation: "2Mg + O₂ → 2MgO",
          parts: [
            { formula: "Mg", ratio: 2, mr: 24 },
            { formula: "O₂", ratio: 1, mr: 32 },
            { formula: "MgO", ratio: 2, mr: 40 }
          ],
          known: { index: 0, type: 'mass', value: 4.8, unit: 'g' },
          unknown: { index: 2, type: 'mass', label: 'mass', unit: 'g' },
          steps: [
            { text: "4.8 g / 24 g/mol = 0.2 mol", val: 0.2 },
            { text: "0.2 mol × (2/2) = 0.2 mol", val: 0.2 },
            { text: "0.2 mol × 40 g/mol = 8 g", val: 8 }
          ]
        },
        {
          equation: "CH₄ + 2O₂ → CO₂ + 2H₂O",
          parts: [
            { formula: "CH₄", ratio: 1, mr: 16 },
            { formula: "O₂", ratio: 2, mr: 32 },
            { formula: "CO₂", ratio: 1, mr: 44 },
            { formula: "H₂O", ratio: 2, mr: 18 }
          ],
          known: { index: 0, type: 'mass', value: 1.6, unit: 'g' },
          unknown: { index: 2, type: 'mass', label: 'mass', unit: 'g' },
          steps: [
            { text: "1.6 g / 16 g/mol = 0.1 mol", val: 0.1 },
            { text: "0.1 mol × 1 = 0.1 mol", val: 0.1 },
            { text: "0.1 mol × 44 g/mol = 4.4 g", val: 4.4 }
          ]
        },
        {
          equation: "CaCO₃ → CaO + CO₂",
          parts: [
            { formula: "CaCO₃", ratio: 1, mr: 100 },
            { formula: "CaO", ratio: 1, mr: 56 },
            { formula: "CO₂", ratio: 1, mr: 44 }
          ],
          known: { index: 0, type: 'mass', value: 20, unit: 'g' },
          unknown: { index: 2, type: 'volume', label: 'volume', unit: 'dm³' },
          steps: [
            { text: "20 g / 100 g/mol = 0.2 mol", val: 0.2 },
            { text: "0.2 mol × 1 = 0.2 mol", val: 0.2 },
            { text: "0.2 mol × 24 dm³/mol = 4.8 dm³", val: 4.8 }
          ]
        },
        {
          equation: "2Na + Cl₂ → 2NaCl",
          parts: [
            { formula: "Na", ratio: 2, mr: 23 },
            { formula: "Cl₂", ratio: 1, mr: 71 },
            { formula: "NaCl", ratio: 2, mr: 58.5 }
          ],
          known: { index: 1, type: 'volume', value: 12, unit: 'dm³' },
          unknown: { index: 2, type: 'mass', label: 'mass', unit: 'g' },
          steps: [
            { text: "12 dm³ / 24 dm³/mol = 0.5 mol", val: 0.5 },
            { text: "0.5 mol × 2 = 1 mol", val: 1 },
            { text: "1 mol × 58.5 g/mol = 58.5 g", val: 58.5 }
          ]
        },
        {
          equation: "Mg + 2HCl → MgCl₂ + H₂",
          parts: [
            { formula: "Mg", ratio: 1, mr: 24 },
            { formula: "HCl", ratio: 2, mr: 36.5 },
            { formula: "MgCl₂", ratio: 1, mr: 95 },
            { formula: "H₂", ratio: 1, mr: 2 }
          ],
          known: { index: 0, type: 'mass', value: 1.2, unit: 'g' },
          unknown: { index: 3, type: 'volume', label: 'volume', unit: 'dm³' },
          steps: [
            { text: "1.2 g / 24 g/mol = 0.05 mol", val: 0.05 },
            { text: "0.05 mol × 1 = 0.05 mol", val: 0.05 },
            { text: "0.05 mol × 24 dm³/mol = 1.2 dm³", val: 1.2 }
          ]
        },
        {
          equation: "2H₂ + O₂ → 2H₂O",
          parts: [
            { formula: "H₂", ratio: 2, mr: 2 },
            { formula: "O₂", ratio: 1, mr: 32 },
            { formula: "H₂O", ratio: 2, mr: 18 }
          ],
          known: { index: 0, type: 'mass', value: 4, unit: 'g' },
          unknown: { index: 2, type: 'mass', label: 'mass', unit: 'g' },
          steps: [
            { text: "4 g / 2 g/mol = 2 mol", val: 2 },
            { text: "2 mol × (2/2) = 2 mol", val: 2 },
            { text: "2 mol × 18 g/mol = 36 g", val: 36 }
          ]
        },
        {
          equation: "S + O₂ → SO₂",
          parts: [
            { formula: "S", ratio: 1, mr: 32 },
            { formula: "O₂", ratio: 1, mr: 32 },
            { formula: "SO₂", ratio: 1, mr: 64 }
          ],
          known: { index: 0, type: 'mass', value: 3.2, unit: 'g' },
          unknown: { index: 2, type: 'volume', label: 'volume', unit: 'dm³' },
          steps: [
            { text: "3.2 g / 32 g/mol = 0.1 mol", val: 0.1 },
            { text: "0.1 mol × 1 = 0.1 mol", val: 0.1 },
            { text: "0.1 mol × 24 dm³/mol = 2.4 dm³", val: 2.4 }
          ]
        }
      ];

      const [qIndex, setQIndex] = useState(0);
      const [step, setStep] = useState(0); // 0: known, 1: known mole, 2: unknown mole, 3: unknown quantity
      const [mode, setMode] = useState<'example' | 'practice'>('example');
      const [practiceInput, setPracticeInput] = useState("");
      const [practiceFeedback, setPracticeFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
      const [showCalculator, setShowCalculator] = useState(false);
      const [calcDisplay, setCalcDisplay] = useState("0");

      const currentQ = moleQuestions[qIndex];

      const nextQ = () => {
        setQIndex((qIndex + 1) % moleQuestions.length);
        setStep(0);
        setPracticeInput("");
        setPracticeFeedback('none');
      };

      const handleStepClick = (clickedStep: number) => {
        if (mode === 'example' && step === clickedStep) {
          setStep(step + 1);
        }
      };

      const checkPracticeAnswer = () => {
        const expected = currentQ.steps[step - 1].val;
        const userVal = parseFloat(practiceInput);
        
        if (Math.abs(userVal - expected) < 0.01) {
          setPracticeFeedback('correct');
          setTimeout(() => {
            setStep(step + 1);
            setPracticeInput("");
            setPracticeFeedback('none');
          }, 1000);
        } else {
          setPracticeFeedback('wrong');
          setTimeout(() => setPracticeFeedback('none'), 1500);
        }
      };

      const VirtualCalculator = () => {
        const buttons = [
          '7', '8', '9', '/',
          '4', '5', '6', '*',
          '1', '2', '3', '-',
          '0', '.', '=', '+',
          'C'
        ];

        const handleCalc = (btn: string) => {
          if (btn === 'C') setCalcDisplay("0");
          else if (btn === '=') {
            try {
              // Using Function constructor as a simple math evaluator for this educational context
              // In a real app, a proper math parser library would be safer
              const result = new Function(`return ${calcDisplay}`)();
              setCalcDisplay(String(Number(result).toFixed(3).replace(/\.?0+$/, "")));
            } catch {
              setCalcDisplay("Error");
            }
          } else {
            setCalcDisplay(prev => prev === "0" || prev === "Error" ? btn : prev + btn);
          }
        };

        return (
          <motion.div 
            drag
            dragMomentum={false}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="fixed bottom-8 right-8 w-64 bg-gray-900 rounded-3xl p-4 shadow-2xl z-50 cursor-move"
          >
            <div className="flex justify-between items-center mb-4 px-2">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Calculator</span>
              <button onClick={() => setShowCalculator(false)} className="text-gray-500 hover:text-white">
                <XCircle size={16} />
              </button>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 mb-4 text-right">
              <p className="text-white font-mono text-2xl truncate">{calcDisplay}</p>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {buttons.map(btn => (
                <button
                  key={btn}
                  onClick={() => handleCalc(btn)}
                  className={`h-12 rounded-xl font-black transition-all active:scale-95 ${
                    btn === '=' ? 'bg-orange-500 text-white col-span-1' : 
                    btn === 'C' ? 'bg-rose-500 text-white' :
                    ['/', '*', '-', '+'].includes(btn) ? 'bg-gray-700 text-orange-400' : 'bg-gray-700 text-white'
                  }`}
                >
                  {btn}
                </button>
              ))}
            </div>
          </motion.div>
        );
      };

      return (
        <div className="space-y-8">
          <div className="bg-white border-2 border-gray-200 rounded-[2.5rem] p-8 shadow-[0_8px_0_0_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">Mole Playground</p>
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Interactive Stoichiometry</h2>
              </div>
              <div className="flex items-center gap-4">
                {/* Mode Toggle */}
                <div className="flex bg-gray-100 p-1 rounded-2xl border-2 border-gray-200">
                  <button
                    onClick={() => { setMode('example'); setStep(0); }}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'example' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400'}`}
                  >
                    Example
                  </button>
                  <button
                    onClick={() => { setMode('practice'); setStep(0); }}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'practice' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-400'}`}
                  >
                    Practice
                  </button>
                </div>

                <button
                  onClick={() => setShowCalculator(!showCalculator)}
                  className={`p-3 rounded-2xl border-2 transition-all ${showCalculator ? 'bg-gray-800 border-gray-900 text-white' : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'}`}
                >
                  <Calculator size={20} />
                </button>

                <button
                  onClick={nextQ}
                  className="bg-orange-500 text-white font-black px-6 py-2 rounded-2xl shadow-[0_4px_0_0_#c2410c] active:shadow-none active:translate-y-1 transition-all uppercase tracking-widest text-xs"
                >
                  Next Example
                </button>
              </div>
            </div>

            <div className="relative min-h-[550px] flex flex-col items-center">
              {/* Equation Header */}
              <div className="flex items-center justify-center gap-8 mb-16 bg-gray-50 px-12 py-6 rounded-[2rem] border-2 border-gray-100">
                {currentQ.equation.split(' ').map((part, i) => {
                  const formulaOnly = part.replace(/^\d+/, '');
                  const coefficient = part.slice(0, part.length - formulaOnly.length);
                  const partIndex = currentQ.parts.findIndex(p => p.formula === formulaOnly);
                  const isKnown = partIndex === currentQ.known.index;
                  const isUnknown = partIndex === currentQ.unknown.index;

                  return (
                    <div key={i} className="relative flex flex-col items-center">
                      <span className={`text-3xl font-black ${part === '→' || part === '+' ? 'text-orange-300' : 'text-gray-800'}`}>
                        {part === '→' || part === '+' ? (
                          part
                        ) : (
                          <>
                            {coefficient && <span className="text-orange-500">{coefficient}</span>}
                            {formulaOnly.split('').map((char, j) => (
                              <span key={j}>{char.match(/\d/) ? <sub>{char}</sub> : char}</span>
                            ))}
                          </>
                        )}
                      </span>
                      
                      {/* Column for this chemical */}
                      <div className="absolute top-12 w-48 flex flex-col items-center pt-4">
                        {/* Row 1: Known Box or Final Box */}
                        <div className="h-28 w-full flex items-center justify-center">
                          {isKnown && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              onClick={() => handleStepClick(0)}
                              className={`w-full p-4 rounded-2xl border-2 text-center cursor-pointer transition-all shadow-sm
                                ${step >= 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-gray-50 border-gray-100 text-gray-400'}
                                ${step === 0 ? 'ring-4 ring-emerald-100 scale-105' : 'hover:scale-102'}
                              `}
                            >
                              <p className="text-[10px] font-black uppercase tracking-widest mb-1">Known Quantity</p>
                              <p className="text-xl font-black">{currentQ.known.value} {currentQ.known.unit}</p>
                            </motion.div>
                          )}
                          {isUnknown && step >= 3 && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="w-full p-4 bg-rose-500 text-white rounded-2xl text-center shadow-lg border-2 border-rose-400"
                            >
                              <p className="text-[10px] font-black text-rose-100 uppercase tracking-widest mb-1">Final {currentQ.unknown.label}</p>
                              {mode === 'example' || step > 3 ? (
                                <>
                                  <p className="text-sm font-bold mb-1">{currentQ.steps[2].text}</p>
                                  <p className="text-xl font-black">{currentQ.steps[2].val} {currentQ.unknown.unit}</p>
                                </>
                              ) : (
                                <div className="flex flex-col items-center gap-2">
                                  <input 
                                    type="number" 
                                    value={practiceInput}
                                    onChange={(e) => setPracticeInput(e.target.value)}
                                    placeholder={`Enter ${currentQ.unknown.unit}`}
                                    className="w-full text-center text-sm font-bold bg-rose-400 border-2 border-rose-300 rounded-xl p-1 focus:outline-none placeholder:text-rose-200"
                                  />
                                </div>
                              )}
                            </motion.div>
                          )}
                        </div>

                        {/* Row 2: Vertical Link */}
                        <div className="h-10 w-full flex items-center justify-center">
                          {isKnown && step >= 1 && (
                            <motion.div 
                              initial={{ height: 0 }} 
                              animate={{ height: 40 }} 
                              className="w-0.5 bg-emerald-200 relative"
                            >
                              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-emerald-200 rounded-full" />
                            </motion.div>
                          )}
                          {isUnknown && step >= 3 && (
                            <motion.div 
                              initial={{ height: 0 }} 
                              animate={{ height: 40 }} 
                              className="w-0.5 bg-rose-200 relative"
                            >
                              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-rose-200 rounded-full" />
                            </motion.div>
                          )}
                        </div>

                        {/* Row 3: Mole Box */}
                        <div className="h-24 w-full flex items-center justify-center">
                          {isKnown && step >= 1 && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              onClick={() => handleStepClick(1)}
                              className={`w-full p-4 bg-white border-2 border-emerald-100 rounded-2xl text-center shadow-sm cursor-pointer hover:scale-102 transition-all
                                ${step === 1 ? 'ring-4 ring-emerald-50' : ''}
                              `}
                            >
                              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Moles of {formulaOnly}</p>
                              {mode === 'example' || step > 1 ? (
                                <p className="text-sm font-bold text-emerald-600">{currentQ.steps[0].text}</p>
                              ) : (
                                <div className="flex flex-col items-center gap-2">
                                  <input 
                                    type="number" 
                                    value={practiceInput}
                                    onChange={(e) => setPracticeInput(e.target.value)}
                                    placeholder="Enter mol"
                                    className="w-full text-center text-sm font-bold bg-emerald-50 border-2 border-emerald-200 rounded-xl p-1 focus:outline-none focus:ring-2 ring-emerald-300"
                                  />
                                </div>
                              )}
                            </motion.div>
                          )}
                          {isUnknown && step >= 2 && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              onClick={() => handleStepClick(2)}
                              className={`w-full p-4 rounded-2xl border-2 text-center cursor-pointer transition-all shadow-sm
                                ${step >= 2 ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-gray-50 border-gray-100 text-gray-400'}
                                ${step === 2 ? 'ring-4 ring-rose-100 scale-105' : 'hover:scale-102'}
                              `}
                            >
                              <p className="text-[10px] font-black uppercase tracking-widest mb-1">Moles of {formulaOnly}</p>
                              {mode === 'example' || step > 2 ? (
                                <p className="text-sm font-bold">{currentQ.steps[1].text}</p>
                              ) : (
                                <div className="flex flex-col items-center gap-2">
                                  <input 
                                    type="number" 
                                    value={practiceInput}
                                    onChange={(e) => setPracticeInput(e.target.value)}
                                    placeholder="Enter mol"
                                    className="w-full text-center text-sm font-bold bg-rose-100 border-2 border-rose-200 rounded-xl p-1 focus:outline-none focus:ring-2 ring-rose-300"
                                  />
                                </div>
                              )}
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Horizontal Link between Moles */}
              {step >= 2 && (
                <motion.div 
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: '40%', opacity: 1 }}
                  className="absolute top-[264px] left-1/2 -translate-x-1/2 h-0.5 bg-orange-200 flex items-center justify-center z-0"
                >
                  <div className="bg-white px-3 py-1 border-2 border-orange-100 rounded-full text-[10px] font-black text-orange-400 uppercase tracking-widest shadow-sm">
                    Mole Ratio
                  </div>
                  <div className="absolute right-0 w-2 h-2 bg-orange-200 rounded-full" />
                  <div className="absolute left-0 w-2 h-2 bg-orange-200 rounded-full" />
                </motion.div>
              )}

              {/* Instructions & Next Step Button */}
              <div className="mt-auto text-center flex flex-col items-center gap-4">
                <div className="inline-flex items-center gap-3 bg-orange-50 px-6 py-3 rounded-2xl border-2 border-orange-100 text-orange-700 font-bold">
                  <Info size={18} />
                  {step === 0 && "Click the known quantity to calculate its moles"}
                  {step === 1 && "Moles calculated! Now find the ratio to the unknown"}
                  {step === 2 && "Click the unknown moles to find the final quantity"}
                  {step === 3 && "Calculation complete! Click Next for another example"}
                  {step > 3 && "Great job! Try another one."}
                </div>

                {step < 3 && (
                  <button
                    onClick={mode === 'practice' && step > 0 ? checkPracticeAnswer : () => setStep(step + 1)}
                    className={`group flex items-center gap-2 font-black px-8 py-4 rounded-2xl transition-all uppercase tracking-widest shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-[4px]
                      ${mode === 'practice' && step > 0 ? 'bg-emerald-500 text-white shadow-[#059669]' : 'bg-emerald-500 text-white shadow-[#059669]'}
                    `}
                  >
                    {mode === 'practice' && step > 0 ? 'Check Answer' : 'Next Step'}
                    <motion.div
                      animate={practiceFeedback === 'correct' ? { scale: [1, 1.2, 1] } : practiceFeedback === 'wrong' ? { x: [-5, 5, -5, 5, 0] } : { x: [0, 5, 0] }}
                      transition={{ repeat: practiceFeedback === 'none' ? Infinity : 0, duration: 0.5 }}
                    >
                      {practiceFeedback === 'correct' ? <CheckCircle2 size={20} /> : 
                       practiceFeedback === 'wrong' ? <XCircle size={20} /> : 
                       <RefreshCw size={20} className="rotate-90" />}
                    </motion.div>
                  </button>
                )}
              </div>
            </div>

            {showCalculator && <VirtualCalculator />}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <div className="bg-blue-50 border-2 border-blue-100 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Info size={16} className="text-blue-500" />
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Atomic Masses</p>
                </div>
                <p className="text-xs font-bold text-gray-600">H=1, C=12, N=14, O=16, Na=23, Mg=24, Cl=35.5, Ca=40</p>
              </div>
              <div className="bg-emerald-50 border-2 border-emerald-100 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Wind size={16} className="text-emerald-500" />
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Gas Volume</p>
                </div>
                <p className="text-xs font-bold text-gray-600">1 mole of any gas occupies 24 dm³ at RTP.</p>
              </div>
            </div>
          </div>
        </div>
      );
    };


    const equations = [
      {
        id: 'ram',
        name: 'Relative Atomic Mass (RAM)',
        formula: 'RAM = Σ (% abundance × mass number)',
        unit: '',
        variables: [
          { symbol: 'RAM', name: 'Relative Atomic Mass', unit: '' },
          { symbol: '%', name: 'Abundance', unit: '%' },
          { symbol: 'Ar', name: 'Mass Number', unit: '' }
        ]
      },
      {
        id: 'particles',
        name: 'Number of Particles',
        formula: 'N = n × L',
        unit: '',
        variables: [
          { symbol: 'N', name: 'Number of particles', unit: '' },
          { symbol: 'n', name: 'Moles', unit: 'mol' },
          { symbol: 'L', name: "Avogadro's constant", unit: 'mol⁻¹' }
        ]
      },
      {
        id: 'mole_mass',
        name: 'Mole (Mass)',
        formula: 'n = m / M',
        unit: 'mol',
        variables: [
          { symbol: 'n', name: 'Moles', unit: 'mol' },
          { symbol: 'm', name: 'Mass', unit: 'g' },
          { symbol: 'M', name: 'Molar Mass', unit: 'g/mol' }
        ]
      },
      {
        id: 'mole_conc',
        name: 'Mole (Concentration)',
        formula: 'n = C × V',
        unit: 'mol',
        variables: [
          { symbol: 'n', name: 'Moles', unit: 'mol' },
          { symbol: 'C', name: 'Concentration', unit: 'mol dm⁻³' },
          { symbol: 'V', name: 'Volume', unit: 'dm³' }
        ]
      },
      {
        id: 'mole_gas',
        name: 'Mole (Gas Volume)',
        formula: 'n = V / Vm',
        unit: 'mol',
        variables: [
          { symbol: 'n', name: 'Moles', unit: 'mol' },
          { symbol: 'V', name: 'Gas Volume', unit: 'dm³' },
          { symbol: 'Vm', name: 'Molar Volume', unit: '24 dm³/mol' }
        ]
      },
      {
        id: 'yield',
        name: 'Percentage Yield',
        formula: '% = (Actual / Theoretical) × 100',
        unit: '%',
        variables: [
          { symbol: '%', name: 'Percentage Yield', unit: '%' },
          { symbol: 'Actual', name: 'Actual Yield', unit: 'g' },
          { symbol: 'Theoretical', name: 'Theoretical Yield', unit: 'g' }
        ]
      },
      {
        id: 'enthalpy',
        name: 'Enthalpy Change (ΔH)',
        formula: 'ΔH = Σ(Reactant Bonds) - Σ(Product Bonds)',
        unit: 'kJ/mol',
        variables: [
          { symbol: 'ΔH', name: 'Enthalpy Change', unit: 'kJ/mol' },
          { symbol: 'R', name: 'Reactant Bonds', unit: 'kJ/mol' },
          { symbol: 'P', name: 'Product Bonds', unit: 'kJ/mol' }
        ]
      }
    ];

    const equationRearrangements: Record<string, Record<string, string>> = {
      ram: { 'RAM': 'RAM = % × Ar', '%': '% = RAM / Ar', 'Ar': 'Ar = RAM / %' },
      particles: { 'N': 'N = n × L', 'n': 'n = N / L', 'L': 'L = N / n' },
      mole_mass: { 'n': 'n = m / M', 'm': 'm = n × M', 'M': 'M = m / n' },
      mole_conc: { 'n': 'n = C × V', 'C': 'C = n / V', 'V': 'V = n / C' },
      mole_gas: { 'n': 'n = V / Vm', 'V': 'V = n × Vm', 'Vm': 'Vm = V / n' },
      yield: { '%': '% = (Actual / Theoretical) × 100', 'Actual': 'Actual = (% × Theoretical) / 100', 'Theoretical': 'Theoretical = (Actual / %) × 100' },
      enthalpy: { 'ΔH': 'ΔH = R - P', 'R': 'R = ΔH + P', 'P': 'P = R - ΔH' }
    };

    const chemicals = [
      { 
        name: 'Hydrogen', 
        formula: 'H₂', 
        details: 'The simplest and most abundant chemical substance in the universe.', 
        icon: <Wind size={32} />, 
        color: 'bg-gray-400',
        state: 'gas',
        composition: [{ type: 'H', count: 2, color: 'bg-white border-blue-200 text-blue-500' }],
        lewis: 'H : H'
      },
      { 
        name: 'Chlorine', 
        formula: 'Cl₂', 
        details: 'A yellow-green gas with a choking smell, used to disinfect water.', 
        icon: <Wind size={32} />, 
        color: 'bg-yellow-400',
        state: 'gas',
        composition: [{ type: 'Cl', count: 2, color: 'bg-green-500 text-white' }],
        lewis: '..    ..\n:Cl : Cl:\n ˙˙    ˙˙'
      },
      { 
        name: 'Water', 
        formula: 'H₂O', 
        details: 'A vital compound for all known forms of life.', 
        icon: <Droplets size={32} />, 
        color: 'bg-blue-500',
        state: 'liquid',
        composition: [
          { type: 'H', count: 2, color: 'bg-white border-blue-200 text-blue-500' },
          { type: 'O', count: 1, color: 'bg-red-500 text-white' }
        ],
        lewis: '  .. \nH:O:H\n  ˙˙ '
      },
      { 
        name: 'Methane', 
        formula: 'CH₄', 
        details: 'A potent greenhouse gas and the primary component of natural gas.', 
        icon: <Flame size={32} />, 
        color: 'bg-orange-500',
        state: 'gas',
        composition: [
          { type: 'C', count: 1, color: 'bg-gray-800 text-white' },
          { type: 'H', count: 4, color: 'bg-white border-blue-200 text-blue-500' }
        ],
        lewis: '  H  \n  :  \nH:C:H\n  :  \n  H  '
      },
      { 
        name: 'Ammonia', 
        formula: 'NH₃', 
        details: 'A colorless gas with a characteristic pungent smell, used in fertilizers.', 
        icon: <Atom size={32} />, 
        color: 'bg-purple-500',
        state: 'gas',
        composition: [
          { type: 'N', count: 1, color: 'bg-blue-600 text-white' },
          { type: 'H', count: 3, color: 'bg-white border-blue-200 text-blue-500' }
        ],
        lewis: '  .. \nH:N:H\n  :  \n  H  '
      },
      { 
        name: 'Hydrogen Chloride', 
        formula: 'HCl', 
        details: 'A colorless gas that forms hydrochloric acid when dissolved in water.', 
        icon: <Wind size={32} />, 
        color: 'bg-gray-300',
        state: 'gas',
        composition: [
          { type: 'H', count: 1, color: 'bg-white border-blue-200 text-blue-500' },
          { type: 'Cl', count: 1, color: 'bg-green-500 text-white' }
        ],
        lewis: '    ..\nH : Cl:\n    ˙˙ '
      },
      { 
        name: 'Methanol', 
        formula: 'CH₃OH', 
        details: 'The simplest alcohol, used as a solvent and fuel.', 
        icon: <Droplets size={32} />, 
        color: 'bg-blue-600',
        state: 'liquid',
        composition: [
          { type: 'C', count: 1, color: 'bg-gray-800 text-white' },
          { type: 'H', count: 4, color: 'bg-white border-blue-200 text-blue-500' },
          { type: 'O', count: 1, color: 'bg-red-500 text-white' }
        ],
        lewis: '  H  .. \n  :  :  \nH:C:O:H\n  :  ˙˙ \n  H    '
      },
      { 
        name: 'Ethene', 
        formula: 'C₂H₄', 
        details: 'A hydrocarbon with a double bond, used to make plastics.', 
        icon: <Flame size={32} />, 
        color: 'bg-orange-400',
        state: 'gas',
        composition: [
          { type: 'C', count: 2, color: 'bg-gray-800 text-white' },
          { type: 'H', count: 4, color: 'bg-white border-blue-200 text-blue-500' }
        ],
        lewis: 'H   H\n : : \nC::C\n : : \nH   H'
      },
      { 
        name: 'Oxygen', 
        formula: 'O₂', 
        details: 'Essential for respiration in most living organisms.', 
        icon: <Wind size={32} />, 
        color: 'bg-blue-400',
        state: 'gas',
        composition: [
          { type: 'O', count: 2, color: 'bg-red-500 text-white' }
        ],
        lewis: '..  ..\nO::O\n˙˙  ˙˙'
      },
      { 
        name: 'Carbon Dioxide', 
        formula: 'CO₂', 
        details: 'A greenhouse gas essential for photosynthesis.', 
        icon: <Wind size={32} />, 
        color: 'bg-gray-500',
        state: 'gas',
        composition: [
          { type: 'C', count: 1, color: 'bg-gray-800 text-white' },
          { type: 'O', count: 2, color: 'bg-red-500 text-white' }
        ],
        lewis: '..     ..\nO::C::O\n˙˙     ˙˙'
      },
      { 
        name: 'Nitrogen', 
        formula: 'N₂', 
        details: 'Makes up about 78% of Earth\'s atmosphere.', 
        icon: <Wind size={32} />, 
        color: 'bg-blue-300',
        state: 'gas',
        composition: [
          { type: 'N', count: 2, color: 'bg-blue-600 text-white' }
        ],
        lewis: ':N:::N:'
      }
    ];

    const MolecularAnimation = ({ state, formula, color }: { state: 'gas' | 'liquid' | 'solid', formula: string, color: string }) => {
      const moleculeCount = state === 'gas' ? 6 : 15;
      const molecules = Array.from({ length: moleculeCount });

      return (
        <div className="relative w-full h-48 bg-gray-900 rounded-2xl overflow-hidden border-2 border-gray-800">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent" />
          {molecules.map((_, i) => (
            <motion.div
              key={i}
              className={`absolute flex items-center justify-center rounded-full text-[10px] font-bold text-white shadow-lg ${color}`}
              style={{
                width: 32,
                height: 32,
                left: `${Math.random() * 80 + 10}%`,
                top: `${Math.random() * 80 + 10}%`,
              }}
              animate={state === 'gas' ? {
                x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
                y: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
                rotate: [0, 360],
              } : {
                x: [0, Math.random() * 20 - 10, Math.random() * 20 - 10, 0],
                y: [0, Math.random() * 10 - 5, Math.random() * 10 - 5, 0],
              }}
              transition={{
                duration: state === 'gas' ? 2 + Math.random() * 2 : 4 + Math.random() * 2,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              {formula}
            </motion.div>
          ))}
          <div className="absolute bottom-2 right-3">
            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">
              State: {state === 'gas' ? 'Gas (g)' : 'Liquid (l)'}
            </span>
          </div>
        </div>
      );
    };

    const NetIonicPlayground = () => {
      const [exampleIndex, setExampleIndex] = useState(0);
      const [step, setStep] = useState(0); // 0: Molecular, 1: Complete Ionic, 2: Net Ionic
      const [removedIons, setRemovedIons] = useState<string[]>([]);
      const [practiceMode, setPracticeMode] = useState(false);
      const [practiceQuestion, setPracticeQuestion] = useState<any>(null);
      const [practiceAnswer, setPracticeAnswer] = useState<string[]>([]);
      const [practiceFeedback, setPracticeFeedback] = useState<string | null>(null);

      const examples = [
        {
          name: "Silver Nitrate + Potassium Chloride",
          molecular: {
            reactants: ["AgNO3(aq)", "KCl(aq)"],
            products: ["AgCl(s)", "KNO3(aq)"]
          },
          ionic: {
            reactants: ["Ag+(aq)", "NO3-(aq)", "K+(aq)", "Cl-(aq)"],
            products: ["AgCl(s)", "K+(aq)", "NO3-(aq)"]
          },
          spectators: ["K+(aq)", "NO3-(aq)"],
          net: {
            reactants: ["Ag+(aq)", "Cl-(aq)"],
            products: ["AgCl(s)"]
          }
        },
        {
          name: "Barium Nitrate + Sodium Sulfate",
          molecular: {
            reactants: ["Ba(NO3)2(aq)", "Na2SO4(aq)"],
            products: ["BaSO4(s)", "2NaNO3(aq)"]
          },
          ionic: {
            reactants: ["Ba2+(aq)", "2NO3-(aq)", "2Na+(aq)", "SO42-(aq)"],
            products: ["BaSO4(s)", "2Na+(aq)", "2NO3-(aq)"]
          },
          spectators: ["2Na+(aq)", "2NO3-(aq)"],
          net: {
            reactants: ["Ba2+(aq)", "SO42-(aq)"],
            products: ["BaSO4(s)"]
          }
        },
        {
          name: "Lead(II) Nitrate + Potassium Iodide",
          molecular: {
            reactants: ["Pb(NO3)2(aq)", "2KI(aq)"],
            products: ["PbI2(s)", "2KNO3(aq)"]
          },
          ionic: {
            reactants: ["Pb2+(aq)", "2NO3-(aq)", "2K+(aq)", "2I-(aq)"],
            products: ["PbI2(s)", "2K+(aq)", "2NO3-(aq)"]
          },
          spectators: ["2K+(aq)", "2NO3-(aq)"],
          net: {
            reactants: ["Pb2+(aq)", "2I-(aq)"],
            products: ["PbI2(s)"]
          }
        },
        {
          name: "Calcium Chloride + Sodium Carbonate",
          molecular: {
            reactants: ["CaCl2(aq)", "Na2CO3(aq)"],
            products: ["CaCO3(s)", "2NaCl(aq)"]
          },
          ionic: {
            reactants: ["Ca2+(aq)", "2Cl-(aq)", "2Na+(aq)", "CO32-(aq)"],
            products: ["CaCO3(s)", "2Na+(aq)", "2Cl-(aq)"]
          },
          spectators: ["2Na+(aq)", "2Cl-(aq)"],
          net: {
            reactants: ["Ca2+(aq)", "CO32-(aq)"],
            products: ["CaCO3(s)"]
          }
        }
      ];

      const current = examples[exampleIndex];

      const generatePractice = () => {
        const ex = examples[Math.floor(Math.random() * examples.length)];
        setPracticeQuestion(ex);
        setPracticeAnswer([]);
        setPracticeFeedback(null);
        setPracticeMode(true);
      };

      const togglePracticeIon = (ion: string) => {
        if (practiceAnswer.includes(ion)) {
          setPracticeAnswer(practiceAnswer.filter(i => i !== ion));
        } else {
          setPracticeAnswer([...practiceAnswer, ion]);
        }
      };

      const checkPractice = () => {
        const correctSpectators = practiceQuestion.spectators;
        const isCorrect = practiceAnswer.length === correctSpectators.length && 
                          practiceAnswer.every(ion => correctSpectators.includes(ion));
        
        setPracticeFeedback(isCorrect ? 'correct' : 'incorrect');
      };

      const renderEquation = (parts: string[], isRed?: (p: string) => boolean) => (
        <div className="flex flex-wrap items-center justify-center gap-2 text-lg font-bold">
          {parts.map((p, i) => (
            <React.Fragment key={i}>
              <span 
                className={isRed?.(p) ? 'text-rose-500' : 'text-blue-600'}
                dangerouslySetInnerHTML={{ __html: p.replace(/(\d+[\+\-])/g, '<sup>$1</sup>').replace(/([\+\-])/g, '<sup>$1</sup>').replace(/(\d+)/g, '<sub>$1</sub>') }}
              />
              {i < parts.length - 1 && <span className="text-gray-400">+</span>}
            </React.Fragment>
          ))}
        </div>
      );

      return (
        <div className="space-y-8">
          {!practiceMode ? (
            <div className="bg-white border-2 border-gray-200 p-8 rounded-3xl shadow-[0_6px_0_0_#e5e7eb]">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Net Ionic Explorer</h3>
                  <p className="text-blue-500 font-black text-xl uppercase tracking-widest text-xs">Step-by-Step Dissociation</p>
                </div>
                <div className="bg-blue-100 text-blue-600 p-4 rounded-2xl">
                  <Droplets size={32} />
                </div>
              </div>

              <div className="space-y-12">
                {/* Example Selector */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {examples.map((ex, i) => (
                    <button
                      key={i}
                      onClick={() => { setExampleIndex(i); setStep(0); setRemovedIons([]); }}
                      className={`px-4 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition-all border-2 ${exampleIndex === i ? 'bg-blue-500 text-white border-blue-600' : 'bg-white text-gray-500 border-gray-200 hover:border-blue-300'}`}
                    >
                      {ex.name}
                    </button>
                  ))}
                </div>

                {/* Equation Display */}
                <div className="bg-gray-50 p-8 rounded-3xl border-2 border-gray-100 space-y-6 text-center">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                      {step === 0 ? "Molecular Equation" : step === 1 ? "Complete Ionic Equation" : "Net Ionic Equation"}
                    </p>
                    
                    <div className="space-y-4">
                      {/* Reactants */}
                      {step === 0 ? renderEquation(current.molecular.reactants) : 
                       step === 1 ? renderEquation(current.ionic.reactants) : 
                       renderEquation(current.net.reactants)}

                      <div className="flex justify-center">
                        <ArrowDown className="text-gray-300" size={32} />
                      </div>

                      {/* Products */}
                      {step === 0 ? renderEquation(current.molecular.products, p => p.includes('(s)')) : 
                       step === 1 ? renderEquation(current.ionic.products, p => p.includes('(s)')) : 
                       renderEquation(current.net.products, p => p.includes('(s)'))}
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col items-center gap-6">
                  <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-100 w-full text-center">
                    <p className="text-blue-700 font-bold text-sm">
                      {step === 0 && "Soluble salts (aq) dissociate into ions in water. Insoluble salts (s) stay together."}
                      {step === 1 && "Spectator ions appear on both sides of the equation. They don't participate in the reaction."}
                      {step === 2 && "The net ionic equation shows only the species that change state."}
                    </p>
                  </div>

                  <div className="flex gap-4 w-full">
                    {step < 2 && (
                      <button
                        onClick={() => setStep(step + 1)}
                        className="flex-1 bg-blue-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-[0_4px_0_0_#1d4ed8] hover:shadow-none hover:translate-y-1 transition-all"
                      >
                        {step === 0 ? "Dissociate Ions" : "Remove Spectators"}
                      </button>
                    )}
                    {step > 0 && (
                      <button
                        onClick={() => setStep(0)}
                        className="flex-1 bg-gray-100 text-gray-500 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  <button
                    onClick={generatePractice}
                    className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-[0_4px_0_0_#059669] hover:shadow-none hover:translate-y-1 transition-all flex items-center justify-center gap-3"
                  >
                    <Zap size={24} />
                    Practice Mode
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border-2 border-gray-200 p-8 rounded-3xl shadow-[0_6px_0_0_#e5e7eb]">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Practice Challenge</h3>
                  <p className="text-emerald-500 font-black text-xl uppercase tracking-widest text-xs">Identify Spectator Ions</p>
                </div>
                <button onClick={() => setPracticeMode(false)} className="text-gray-400 hover:text-gray-600">
                  <XCircle size={32} />
                </button>
              </div>

              <div className="space-y-8">
                <div className="bg-gray-50 p-6 rounded-2xl border-2 border-gray-100 text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Complete Ionic Equation</p>
                  <div className="space-y-4">
                    {renderEquation(practiceQuestion.ionic.reactants)}
                    <div className="flex justify-center"><ArrowDown className="text-gray-300" size={24} /></div>
                    {renderEquation(practiceQuestion.ionic.products, p => p.includes('(s)'))}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-center font-black text-gray-700 uppercase text-sm">Select the Spectator Ions:</p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {Array.from(new Set([...practiceQuestion.ionic.reactants, ...practiceQuestion.ionic.products])).map((ion, i) => (
                      <button
                        key={i}
                        onClick={() => togglePracticeIon(ion)}
                        disabled={practiceFeedback !== null}
                        className={`px-4 py-3 rounded-xl font-bold border-2 transition-all ${practiceAnswer.includes(ion) ? 'bg-emerald-500 text-white border-emerald-600 shadow-[0_4px_0_0_#059669]' : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300'}`}
                        dangerouslySetInnerHTML={{ __html: ion.replace(/(\d+)/g, '<sub>$1</sub>').replace(/(\^[\+\-\d]+)/g, (m) => `<sup>${m.slice(1)}</sup>`) }}
                      />
                    ))}
                  </div>
                </div>

                {practiceFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-2xl text-center font-bold ${practiceFeedback === 'correct' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}
                  >
                    {practiceFeedback === 'correct' ? "Correct! Spectator ions appear unchanged on both sides." : "Not quite. Spectator ions are the ones that are exactly the same on both sides."}
                  </motion.div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={checkPractice}
                    disabled={practiceAnswer.length === 0 || practiceFeedback !== null}
                    className="flex-1 bg-emerald-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-[0_4px_0_0_#059669] disabled:opacity-50 transition-all"
                  >
                    Check Answer
                  </button>
                  <button
                    onClick={generatePractice}
                    className="flex-1 bg-white border-2 border-gray-200 text-gray-500 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-50 transition-all"
                  >
                    Next Challenge
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    };

    const SimulationPlayground = () => {
      const [selectedSim, setSelectedSim] = useState<string | null>(null);
      
      // Diffusion State
      const [redLeft, setRedLeft] = useState(20);
      const [blueLeft, setBlueLeft] = useState(5);
      const [redRight, setRedRight] = useState(5);
      const [blueRight, setBlueRight] = useState(20);
      const [isPartitionRemoved, setIsPartitionRemoved] = useState(false);
      const [particles, setParticles] = useState<any[]>([]);
      const [diffusionTemp, setDiffusionTemp] = useState(25);
      const [diffusionPractice, setDiffusionPractice] = useState<any>(null);
      const [diffusionAnswer, setDiffusionAnswer] = useState<string | null>(null);
      const [diffusionFeedback, setDiffusionFeedback] = useState<string | null>(null);
      
      // AXZ State
      const [axzProtons, setAxzProtons] = useState(6);
      const [axzNeutrons, setAxzNeutrons] = useState(6);
      const [axzElectrons, setAxzElectrons] = useState(6);
      const [axzPractice, setAxzPractice] = useState<any>(null);
      const [axzAnswer, setAxzAnswer] = useState<any>({ p: '', n: '', e: '' });
      const [axzFeedback, setAxzFeedback] = useState<string | null>(null);

      const simRef = useRef<HTMLDivElement>(null);

      // Shells State
      const [shellZ, setShellZ] = useState(1);
      const [shellPractice, setShellPractice] = useState<any>(null);
      const [shellAnswer, setShellAnswer] = useState('');
      const [shellFeedback, setShellFeedback] = useState<string | null>(null);

      // Balancing Equations State
      const [balancingIndex, setBalancingIndex] = useState(0);
      const [coefficients, setCoefficients] = useState<number[]>([]);
      const [isBalanced, setIsBalanced] = useState(false);

      const equations = [
        { reactants: [{ s: 'H2', atoms: { H: 2 } }, { s: 'O2', atoms: { O: 2 } }], products: [{ s: 'H2O', atoms: { H: 2, O: 1 } }] },
        { reactants: [{ s: 'N2', atoms: { N: 2 } }, { s: 'H2', atoms: { H: 2 } }], products: [{ s: 'NH3', atoms: { N: 1, H: 3 } }] },
        { reactants: [{ s: 'CH4', atoms: { C: 1, H: 4 } }, { s: 'O2', atoms: { O: 2 } }], products: [{ s: 'CO2', atoms: { C: 1, O: 2 } }, { s: 'H2O', atoms: { H: 2, O: 1 } }] },
        { reactants: [{ s: 'Mg', atoms: { Mg: 1 } }, { s: 'O2', atoms: { O: 2 } }], products: [{ s: 'MgO', atoms: { Mg: 1, O: 1 } }] },
        { reactants: [{ s: 'Al', atoms: { Al: 1 } }, { s: 'O2', atoms: { O: 2 } }], products: [{ s: 'Al2O3', atoms: { Al: 2, O: 3 } }] },
        { reactants: [{ s: 'Na', atoms: { Na: 1 } }, { s: 'Cl2', atoms: { Cl: 2 } }], products: [{ s: 'NaCl', atoms: { Na: 1, Cl: 1 } }] },
        { reactants: [{ s: 'Fe', atoms: { Fe: 1 } }, { s: 'O2', atoms: { O: 2 } }], products: [{ s: 'Fe2O3', atoms: { Fe: 2, O: 3 } }] },
        { reactants: [{ s: 'H2', atoms: { H: 2 } }, { s: 'Cl2', atoms: { Cl: 2 } }], products: [{ s: 'HCl', atoms: { H: 1, Cl: 1 } }] },
        { reactants: [{ s: 'P', atoms: { P: 1 } }, { s: 'O2', atoms: { O: 2 } }], products: [{ s: 'P4O10', atoms: { P: 4, O: 10 } }] },
        { reactants: [{ s: 'KClO3', atoms: { K: 1, Cl: 1, O: 3 } }], products: [{ s: 'KCl', atoms: { K: 1, Cl: 1 } }, { s: 'O2', atoms: { O: 2 } }] },
        { reactants: [{ s: 'C3H8', atoms: { C: 3, H: 8 } }, { s: 'O2', atoms: { O: 2 } }], products: [{ s: 'CO2', atoms: { C: 1, O: 2 } }, { s: 'H2O', atoms: { H: 2, O: 1 } }] },
        { reactants: [{ s: 'C2H6', atoms: { C: 2, H: 6 } }, { s: 'O2', atoms: { O: 2 } }], products: [{ s: 'CO2', atoms: { C: 1, O: 2 } }, { s: 'H2O', atoms: { H: 2, O: 1 } }] },
        { reactants: [{ s: 'Cu', atoms: { Cu: 1 } }, { s: 'AgNO3', atoms: { Ag: 1, N: 1, O: 3 } }], products: [{ s: 'Cu(NO3)2', atoms: { Cu: 1, N: 2, O: 6 } }, { s: 'Ag', atoms: { Ag: 1 } }] },
        { reactants: [{ s: 'Zn', atoms: { Zn: 1 } }, { s: 'HCl', atoms: { H: 1, Cl: 1 } }], products: [{ s: 'ZnCl2', atoms: { Zn: 1, Cl: 2 } }, { s: 'H2', atoms: { H: 2 } }] },
        { reactants: [{ s: 'NaOH', atoms: { Na: 1, O: 1, H: 1 } }, { s: 'H2SO4', atoms: { H: 2, S: 1, O: 4 } }], products: [{ s: 'Na2SO4', atoms: { Na: 2, S: 1, O: 4 } }, { s: 'H2O', atoms: { H: 2, O: 1 } }] },
        { reactants: [{ s: 'CaCO3', atoms: { Ca: 1, C: 1, O: 3 } }, { s: 'HCl', atoms: { H: 1, Cl: 1 } }], products: [{ s: 'CaCl2', atoms: { Ca: 1, Cl: 2 } }, { s: 'CO2', atoms: { C: 1, O: 2 } }, { s: 'H2O', atoms: { H: 2, O: 1 } }] },
        { reactants: [{ s: 'Pb(NO3)2', atoms: { Pb: 1, N: 2, O: 6 } }, { s: 'KI', atoms: { K: 1, I: 1 } }], products: [{ s: 'PbI2', atoms: { Pb: 1, I: 2 } }, { s: 'KNO3', atoms: { K: 1, N: 1, O: 3 } }] },
        { reactants: [{ s: 'Al', atoms: { Al: 1 } }, { s: 'HCl', atoms: { H: 1, Cl: 1 } }], products: [{ s: 'AlCl3', atoms: { Al: 1, Cl: 3 } }, { s: 'H2', atoms: { H: 2 } }] },
        { reactants: [{ s: 'C2H4', atoms: { C: 2, H: 4 } }, { s: 'O2', atoms: { O: 2 } }], products: [{ s: 'CO2', atoms: { C: 1, O: 2 } }, { s: 'H2O', atoms: { H: 2, O: 1 } }] },
        { reactants: [{ s: 'Fe', atoms: { Fe: 1 } }, { s: 'H2O', atoms: { H: 2, O: 1 } }], products: [{ s: 'Fe3O4', atoms: { Fe: 3, O: 4 } }, { s: 'H2', atoms: { H: 2 } }] },
      ];

      useEffect(() => {
        if (selectedSim === 'balancing') {
          const eq = equations[balancingIndex];
          setCoefficients(new Array(eq.reactants.length + eq.products.length).fill(1));
        }
      }, [selectedSim, balancingIndex]);

      const getAtomCounts = () => {
        if (!selectedSim || selectedSim !== 'balancing' || !coefficients.length) return { reactantAtoms: {}, productAtoms: {} };
        const eq = equations[balancingIndex];
        const reactantAtoms: any = {};
        const productAtoms: any = {};

        eq.reactants.forEach((r, i) => {
          const coeff = coefficients[i] || 1;
          Object.entries(r.atoms).forEach(([atom, count]) => {
            reactantAtoms[atom] = (reactantAtoms[atom] || 0) + (count as number) * coeff;
          });
        });

        eq.products.forEach((p, i) => {
          const coeff = coefficients[eq.reactants.length + i] || 1;
          Object.entries(p.atoms).forEach(([atom, count]) => {
            productAtoms[atom] = (productAtoms[atom] || 0) + (count as number) * coeff;
          });
        });

        return { reactantAtoms, productAtoms };
      };

      const checkBalancing = () => {
        const { reactantAtoms, productAtoms } = getAtomCounts();
        const atoms = Array.from(new Set([...Object.keys(reactantAtoms), ...Object.keys(productAtoms)]));
        const balanced = atoms.length > 0 && atoms.every(atom => reactantAtoms[atom] === productAtoms[atom]);
        setIsBalanced(balanced);
      };

      useEffect(() => {
        if (selectedSim === 'balancing') {
          checkBalancing();
        }
      }, [coefficients]);

      // States of Matter State
      const [matterTemp, setMatterTemp] = useState(25);
      const [selectedMatter, setSelectedMatter] = useState('Water');
      const [matterPractice, setMatterPractice] = useState<any>(null);
      const [matterAnswer, setMatterAnswer] = useState('');
      const [matterFeedback, setMatterFeedback] = useState<string | null>(null);

      const chemicals = [
        { name: 'Water', mp: 0, bp: 100, color: 'text-blue-400', bg: 'bg-blue-400' },
        { name: 'Ethanol', mp: -114, bp: 78, color: 'text-orange-400', bg: 'bg-orange-400' },
        { name: 'Iron', mp: 1538, bp: 2862, color: 'text-gray-400', bg: 'bg-gray-400' },
        { name: 'Oxygen', mp: -218, bp: -183, color: 'text-sky-300', bg: 'bg-sky-300' },
        { name: 'Mercury', mp: -39, bp: 357, color: 'text-slate-300', bg: 'bg-slate-300' },
        { name: 'Ammonia', mp: -78, bp: -33, color: 'text-emerald-300', bg: 'bg-emerald-300' },
      ];

      const getMatterState = (temp: number, chemical: any) => {
        if (temp <= chemical.mp) return 'Solid';
        if (temp >= chemical.bp) return 'Gas';
        return 'Liquid';
      };

      const generateMatterPractice = () => {
        const chem = chemicals[Math.floor(Math.random() * chemicals.length)];
        const states = ['Solid', 'Liquid', 'Gas'];
        const targetState = states[Math.floor(Math.random() * states.length)];
        
        let temp = 0;
        if (targetState === 'Solid') {
          temp = chem.mp - Math.floor(Math.random() * 50) - 10;
        } else if (targetState === 'Gas') {
          temp = chem.bp + Math.floor(Math.random() * 50) + 10;
        } else {
          temp = Math.floor((chem.mp + chem.bp) / 2);
        }

        setMatterPractice({ chem, temp, targetState });
        setMatterAnswer('');
        setMatterFeedback(null);
      };

      const elements = [
        { z: 1, symbol: 'H', name: 'Hydrogen', mass: 1, shells: [1] },
        { z: 2, symbol: 'He', name: 'Helium', mass: 4, shells: [2] },
        { z: 3, symbol: 'Li', name: 'Lithium', mass: 7, shells: [2, 1] },
        { z: 4, symbol: 'Be', name: 'Beryllium', mass: 9, shells: [2, 2] },
        { z: 5, symbol: 'B', name: 'Boron', mass: 11, shells: [2, 3] },
        { z: 6, symbol: 'C', name: 'Carbon', mass: 12, shells: [2, 4] },
        { z: 7, symbol: 'N', name: 'Nitrogen', mass: 14, shells: [2, 5] },
        { z: 8, symbol: 'O', name: 'Oxygen', mass: 16, shells: [2, 6] },
        { z: 9, symbol: 'F', name: 'Fluorine', mass: 19, shells: [2, 7] },
        { z: 10, symbol: 'Ne', name: 'Neon', mass: 20, shells: [2, 8] },
        { z: 11, symbol: 'Na', name: 'Sodium', mass: 23, shells: [2, 8, 1] },
        { z: 12, symbol: 'Mg', name: 'Magnesium', mass: 24, shells: [2, 8, 2] },
        { z: 13, symbol: 'Al', name: 'Aluminium', mass: 27, shells: [2, 8, 3] },
        { z: 14, symbol: 'Si', name: 'Silicon', mass: 28, shells: [2, 8, 4] },
        { z: 15, symbol: 'P', name: 'Phosphorus', mass: 31, shells: [2, 8, 5] },
        { z: 16, symbol: 'S', name: 'Sulfur', mass: 32, shells: [2, 8, 6] },
        { z: 17, symbol: 'Cl', name: 'Chlorine', mass: 35, shells: [2, 8, 7] },
        { z: 18, symbol: 'Ar', name: 'Argon', mass: 40, shells: [2, 8, 8] },
        { z: 19, symbol: 'K', name: 'Potassium', mass: 39, shells: [2, 8, 8, 1] },
        { z: 20, symbol: 'Ca', name: 'Calcium', mass: 40, shells: [2, 8, 8, 2] },
      ];

      const getElementByZ = (z: number) => elements.find(e => e.z === z) || elements[0];

      const generateAxzPractice = () => {
        const el = elements[Math.floor(Math.random() * elements.length)];
        let charge = 0;
        const rand = Math.random();
        if (rand < 0.3 && [1, 3, 11, 12, 13, 19, 20].includes(el.z)) {
          // Cation
          charge = el.z <= 3 || el.z === 11 || el.z === 19 ? 1 : (el.z === 12 || el.z === 20 ? 2 : 3);
        } else if (rand < 0.6 && [7, 8, 9, 15, 16, 17].includes(el.z)) {
          // Anion
          charge = el.z === 9 || el.z === 17 ? -1 : (el.z === 8 || el.z === 16 ? -2 : -3);
        }
        
        setAxzPractice({
          ...el,
          charge,
          p: el.z,
          n: el.mass - el.z,
          e: el.z - charge
        });
        setAxzAnswer({ p: '', n: '', e: '' });
        setAxzFeedback(null);
      };

      const checkAxzPractice = () => {
        if (parseInt(axzAnswer.p) === axzPractice.p && 
            parseInt(axzAnswer.n) === axzPractice.n && 
            parseInt(axzAnswer.e) === axzPractice.e) {
          setAxzFeedback('correct');
        } else {
          setAxzFeedback('incorrect');
        }
      };

      const generateShellPractice = () => {
        const el = elements[Math.floor(Math.random() * elements.length)];
        setShellPractice(el);
        setShellAnswer('');
        setShellFeedback(null);
      };

      const checkShellPractice = () => {
        if (shellAnswer.replace(/\s/g, '') === shellPractice.shells.join(',')) {
          setShellFeedback('correct');
        } else {
          setShellFeedback('incorrect');
        }
      };

      const generateDiffusionPractice = () => {
        const types = ['red', 'blue'];
        const type = types[Math.floor(Math.random() * types.length)];
        const l = Math.floor(Math.random() * 40) + 5;
        const r = Math.floor(Math.random() * 40) + 5;
        
        let correctAnswer = '';
        if (l > r + 5) correctAnswer = 'Left to Right';
        else if (r > l + 5) correctAnswer = 'Right to Left';
        else correctAnswer = 'No Net Movement';

        setDiffusionPractice({
          type,
          l,
          r,
          correctAnswer,
          options: ['Left to Right', 'Right to Left', 'No Net Movement']
        });
        setDiffusionAnswer(null);
        setDiffusionFeedback(null);
        
        // Set the simulation to match the practice question
        if (type === 'red') {
          setRedLeft(l);
          setRedRight(r);
          setBlueLeft(10);
          setBlueRight(10);
        } else {
          setBlueLeft(l);
          setBlueRight(r);
          setRedLeft(10);
          setRedRight(10);
        }
        setIsPartitionRemoved(false);
      };

      const checkDiffusionPractice = () => {
        if (diffusionAnswer === diffusionPractice.correctAnswer) {
          setDiffusionFeedback('correct');
        } else {
          setDiffusionFeedback('incorrect');
        }
      };

      const initParticles = () => {
        const newParticles = [];
        // Left side
        for (let i = 0; i < redLeft; i++) newParticles.push({ id: `rl-${i}`, type: 'red', x: Math.random() * 45, y: Math.random() * 90, vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2 });
        for (let i = 0; i < blueLeft; i++) newParticles.push({ id: `bl-${i}`, type: 'blue', x: Math.random() * 45, y: Math.random() * 90, vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2 });
        // Right side
        for (let i = 0; i < redRight; i++) newParticles.push({ id: `rr-${i}`, type: 'red', x: 55 + Math.random() * 40, y: Math.random() * 90, vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2 });
        for (let i = 0; i < blueRight; i++) newParticles.push({ id: `br-${i}`, type: 'blue', x: 55 + Math.random() * 40, y: Math.random() * 90, vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2 });
        setParticles(newParticles);
      };

      useEffect(() => {
        if (selectedSim === 'diffusion') initParticles();
      }, [selectedSim, redLeft, blueLeft, redRight, blueRight]);

      useEffect(() => {
        if (!isPartitionRemoved || selectedSim !== 'diffusion') return;

        const interval = setInterval(() => {
          const speedFactor = (diffusionTemp + 273) / 298; // Simple speed scaling based on Kelvin
          setParticles(prev => prev.map(p => {
            let nx = p.x + p.vx * speedFactor;
            let ny = p.y + p.vy * speedFactor;
            let nvx = p.vx;
            let nvy = p.vy;

            if (nx < 0 || nx > 98) nvx *= -1;
            if (ny < 0 || ny > 98) nvy *= -1;

            return { ...p, x: nx, y: ny, vx: nvx, vy: nvy };
          }));
        }, 30);

        return () => clearInterval(interval);
      }, [isPartitionRemoved, selectedSim]);

      const counts = useMemo(() => {
        const left = particles.filter(p => p.x < 50);
        const right = particles.filter(p => p.x >= 50);
        return {
          leftRed: left.filter(p => p.type === 'red').length,
          leftBlue: left.filter(p => p.type === 'blue').length,
          rightRed: right.filter(p => p.type === 'red').length,
          rightBlue: right.filter(p => p.type === 'blue').length,
        };
      }, [particles]);

      const netDiffusion = useMemo(() => {
        if (!isPartitionRemoved) return null;
        const redDiff = counts.leftRed - counts.rightRed;
        const blueDiff = counts.leftBlue - counts.rightBlue;
        
        if (Math.abs(redDiff) < 2 && Math.abs(blueDiff) < 2) return 'equilibrium';
        
        let msg = '';
        if (Math.abs(redDiff) >= 2) msg += `Red diffusing ${redDiff > 0 ? 'Right' : 'Left'}. `;
        if (Math.abs(blueDiff) >= 2) msg += `Blue diffusing ${blueDiff > 0 ? 'Right' : 'Left'}.`;
        return msg;
      }, [counts, isPartitionRemoved]);

      return (
        <div className="space-y-8">
          {!selectedSim ? (
            <div className="grid grid-cols-1 gap-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedSim('axz')}
                className="bg-white border-2 border-gray-200 p-8 rounded-3xl flex items-center gap-6 shadow-[0_6px_0_0_#e5e7eb] hover:border-blue-400 transition-all group"
              >
                <div className="bg-blue-100 text-blue-600 p-5 rounded-2xl group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <Atom size={40} />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tight">AXZ Notation</h3>
                  <p className="text-gray-500 font-medium">Learn about Mass Number, Atomic Number and Charge.</p>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedSim('shells')}
                className="bg-white border-2 border-gray-200 p-8 rounded-3xl flex items-center gap-6 shadow-[0_6px_0_0_#e5e7eb] hover:border-emerald-400 transition-all group"
              >
                <div className="bg-emerald-100 text-emerald-600 p-5 rounded-2xl group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  <Zap size={40} />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Electron Shells</h3>
                  <p className="text-gray-500 font-medium">Visualize electronic arrangements up to Calcium (Z=20).</p>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedSim('matter')}
                className="bg-white border-2 border-gray-200 p-8 rounded-3xl flex items-center gap-6 shadow-[0_6px_0_0_#e5e7eb] hover:border-sky-400 transition-all group"
              >
                <div className="bg-sky-100 text-sky-600 p-5 rounded-2xl group-hover:bg-sky-500 group-hover:text-white transition-colors">
                  <Thermometer size={40} />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tight">States of Matter</h3>
                  <p className="text-gray-500 font-medium">Explore how temperature affects particle arrangements.</p>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedSim('diffusion')}
                className="bg-white border-2 border-gray-200 p-8 rounded-3xl flex items-center gap-6 shadow-[0_6px_0_0_#e5e7eb] hover:border-orange-400 transition-all group"
              >
                <div className="bg-orange-100 text-orange-600 p-5 rounded-2xl group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <ArrowRightLeft size={40} />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Diffusion Chamber</h3>
                  <p className="text-gray-500 font-medium">Visualize net movement of particles across a gradient.</p>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedSim('balancing')}
                className="bg-white border-2 border-gray-200 p-8 rounded-3xl flex items-center gap-6 shadow-[0_6px_0_0_#e5e7eb] hover:border-violet-400 transition-all group"
              >
                <div className="bg-violet-100 text-violet-600 p-5 rounded-2xl group-hover:bg-violet-500 group-hover:text-white transition-colors">
                  <Calculator size={40} />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Balancing Equations</h3>
                  <p className="text-gray-500 font-medium">Master the law of conservation of mass through balancing.</p>
                </div>
              </motion.button>


            </div>
          ) : (
            <div className="space-y-6">
              {selectedSim === 'axz' && (
                <div className="bg-white border-2 border-gray-200 p-8 rounded-3xl shadow-[0_6px_0_0_#e5e7eb]">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tight">AXZ Notation</h3>
                      <p className="text-blue-500 font-black text-xl uppercase tracking-widest text-xs">Atomic Structure & Isotopes</p>
                    </div>
                    <div className="bg-blue-100 text-blue-600 p-4 rounded-2xl">
                      <Atom size={32} />
                    </div>
                  </div>

                  <div className="space-y-8 mb-8">
                    <div className="flex flex-col items-center gap-8">
                      <div className="bg-gray-50 p-10 rounded-3xl border-2 border-gray-100 flex items-center justify-center w-full">
                        <div className="relative text-8xl font-black text-gray-800 flex items-center">
                          <div className="flex flex-col text-4xl mr-3 text-right">
                            <span className="leading-none text-gray-400">{axzProtons + axzNeutrons}</span>
                            <span className="leading-none text-blue-500">{axzProtons}</span>
                          </div>
                          <span className="leading-none">{getElementByZ(axzProtons).symbol}</span>
                          {axzProtons !== axzElectrons && (
                            <span className="text-4xl align-top ml-2 leading-none text-orange-500 font-black">
                              {Math.abs(axzProtons - axzElectrons) === 1 ? '' : Math.abs(axzProtons - axzElectrons)}{axzProtons > axzElectrons ? '+' : '-'}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                        <div className="bg-red-50 p-4 rounded-2xl border-2 border-red-100 space-y-3">
                          <div className="flex justify-between items-center">
                            <label className="text-xs font-black text-red-600 uppercase tracking-widest">Protons (Z)</label>
                            <span className="text-xl font-black text-red-600">{axzProtons}</span>
                          </div>
                          <input type="range" min="1" max="20" value={axzProtons} onChange={e => setAxzProtons(parseInt(e.target.value))} className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer accent-red-500" />
                        </div>
                        <div className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-100 space-y-3">
                          <div className="flex justify-between items-center">
                            <label className="text-xs font-black text-gray-600 uppercase tracking-widest">Neutrons</label>
                            <span className="text-xl font-black text-gray-600">{axzNeutrons}</span>
                          </div>
                          <input type="range" min="0" max="25" value={axzNeutrons} onChange={e => setAxzNeutrons(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-500" />
                        </div>
                        <div className="bg-blue-50 p-4 rounded-2xl border-2 border-blue-100 space-y-3">
                          <div className="flex justify-between items-center">
                            <label className="text-xs font-black text-blue-600 uppercase tracking-widest">Electrons</label>
                            <span className="text-xl font-black text-blue-600">{axzElectrons}</span>
                          </div>
                          <input type="range" min="0" max="20" value={axzElectrons} onChange={e => setAxzElectrons(parseInt(e.target.value))} className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t-2 border-gray-100">
                    <div className="bg-blue-50 p-6 rounded-3xl border-2 border-blue-100">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-black text-blue-600 uppercase tracking-widest">Practice Mode</h4>
                        {axzPractice && (
                          <button onClick={() => setAxzPractice(null)} className="text-blue-400 hover:text-blue-600 font-bold text-xs uppercase">Close</button>
                        )}
                      </div>
                      {!axzPractice ? (
                        <button onClick={generateAxzPractice} className="w-full bg-blue-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-[0_4px_0_0_#1d4ed8] hover:shadow-none hover:translate-y-1 transition-all">
                          Start Practice Challenge
                        </button>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                          <div className="text-center p-6 bg-white rounded-2xl border-2 border-blue-200">
                            <div className="relative text-5xl font-black text-gray-800 inline-flex items-center">
                              <div className="flex flex-col text-2xl mr-1 text-right">
                                <span className="leading-none">{axzPractice.mass}</span>
                                <span className="leading-none">{axzPractice.z}</span>
                              </div>
                              <span className="leading-none">{axzPractice.symbol}</span>
                              {axzPractice.charge !== 0 && (
                                <span className="text-2xl align-top ml-1 leading-none">
                                  {Math.abs(axzPractice.charge) === 1 ? '' : Math.abs(axzPractice.charge)}{axzPractice.charge > 0 ? '+' : '-'}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-3">
                              <div className="space-y-1">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase text-center">Protons</label>
                                <input type="number" placeholder="P" value={axzAnswer.p} onChange={e => setAxzAnswer({...axzAnswer, p: e.target.value})} className="w-full p-3 border-2 border-gray-200 rounded-xl text-center font-black text-xl focus:border-blue-500 outline-none transition-colors" />
                              </div>
                              <div className="space-y-1">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase text-center">Neutrons</label>
                                <input type="number" placeholder="N" value={axzAnswer.n} onChange={e => setAxzAnswer({...axzAnswer, n: e.target.value})} className="w-full p-3 border-2 border-gray-200 rounded-xl text-center font-black text-xl focus:border-blue-500 outline-none transition-colors" />
                              </div>
                              <div className="space-y-1">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase text-center">Electrons</label>
                                <input type="number" placeholder="E" value={axzAnswer.e} onChange={e => setAxzAnswer({...axzAnswer, e: e.target.value})} className="w-full p-3 border-2 border-gray-200 rounded-xl text-center font-black text-xl focus:border-blue-500 outline-none transition-colors" />
                              </div>
                            </div>
                            <button onClick={checkAxzPractice} className="w-full bg-blue-500 text-white py-3 rounded-xl font-black uppercase tracking-widest shadow-[0_4px_0_0_#1d4ed8] active:shadow-none active:translate-y-1 transition-all">
                              Check Answer
                            </button>
                            {axzFeedback && (
                              <div className={`p-3 rounded-xl text-center font-bold ${axzFeedback === 'correct' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                {axzFeedback === 'correct' ? 'Correct! Well done.' : 'Try again! Check your math.'}
                              </div>
                            )}
                            <button onClick={generateAxzPractice} className="w-full text-blue-500 font-bold uppercase text-xs hover:underline">Next Question</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <button onClick={() => setSelectedSim(null)} className="w-full bg-gray-200 text-gray-500 py-4 rounded-2xl font-black text-xl uppercase tracking-widest hover:bg-gray-300 transition-all">
                    Back to Selection
                  </button>
                </div>
              )}

              {selectedSim === 'shells' && (
                <div className="bg-white border-2 border-gray-200 p-8 rounded-3xl shadow-[0_6px_0_0_#e5e7eb]">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Electron Shells</h3>
                      <p className="text-emerald-500 font-black text-xl uppercase tracking-widest text-xs">Atomic Structure & Periodic Trends</p>
                    </div>
                    <div className="bg-emerald-100 text-emerald-600 p-4 rounded-2xl">
                      <Zap size={32} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Panel: Controls & Periodic Table */}
                    <div className="lg:col-span-5 space-y-6">
                      <div className="bg-gray-50 p-6 rounded-3xl border-2 border-gray-100 shadow-inner">
                        <div className="flex justify-between items-end mb-6">
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Current Element</p>
                            <h4 className="text-3xl font-black text-gray-800 uppercase tracking-tight">
                              {getElementByZ(shellZ).name}
                            </h4>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Arrangement</p>
                            <p className="text-xl font-black text-emerald-600 tracking-widest">
                              {getElementByZ(shellZ).shells.join(', ')}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="bg-white p-5 rounded-2xl border-2 border-gray-200">
                            <div className="flex justify-between items-center mb-3">
                              <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Atomic Number (Z)</label>
                              <span className="text-3xl font-black text-emerald-600">{shellZ}</span>
                            </div>
                            <input 
                              type="range" 
                              min="1" 
                              max="20" 
                              value={shellZ} 
                              onChange={e => setShellZ(parseInt(e.target.value))} 
                              className="w-full h-3 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-500" 
                            />
                          </div>

                          {/* Mini Periodic Table */}
                          <div className="bg-white p-4 rounded-2xl border-2 border-gray-200">
                            <div className="grid grid-cols-8 gap-1">
                              {(() => {
                                const pt = [
                                  [ { z: 1, s: 'H' }, null, null, null, null, null, null, { z: 2, s: 'He' } ],
                                  [ { z: 3, s: 'Li' }, { z: 4, s: 'Be' }, { z: 5, s: 'B' }, { z: 6, s: 'C' }, { z: 7, s: 'N' }, { z: 8, s: 'O' }, { z: 9, s: 'F' }, { z: 10, s: 'Ne' } ],
                                  [ { z: 11, s: 'Na' }, { z: 12, s: 'Mg' }, { z: 13, s: 'Al' }, { z: 14, s: 'Si' }, { z: 15, s: 'P' }, { z: 16, s: 'S' }, { z: 17, s: 'Cl' }, { z: 18, s: 'Ar' } ],
                                  [ { z: 19, s: 'K' }, { z: 20, s: 'Ca' }, null, null, null, null, null, null ]
                                ];
                                return pt.map((row, rIdx) => (
                                  row.map((el, cIdx) => (
                                    <div 
                                      key={`${rIdx}-${cIdx}`}
                                      className={`aspect-square flex flex-col items-center justify-center rounded-md text-[9px] font-black transition-all border ${
                                        !el ? 'opacity-0' : 
                                        el.z === shellZ ? 'bg-emerald-500 text-white border-emerald-600 scale-105 z-10 shadow-md' : 
                                        'bg-gray-50 text-gray-400 border-gray-200'
                                      }`}
                                    >
                                      {el && (
                                        <>
                                          <span className="text-[7px] opacity-60 leading-none">{el.z}</span>
                                          <span className="leading-none">{el.s}</span>
                                        </>
                                      )}
                                    </div>
                                  ))
                                ));
                              })()}
                            </div>
                            <div className="mt-3 flex justify-center gap-4 text-[9px] font-black uppercase tracking-widest">
                              <span className="text-emerald-600">Period: {Math.ceil(shellZ <= 2 ? 1 : shellZ <= 10 ? 2 : shellZ <= 18 ? 3 : 4)}</span>
                              <span className="text-blue-600">Group: {(() => {
                                if (shellZ === 1) return 'I';
                                if (shellZ === 2) return 'VIII';
                                const mod = (shellZ - 2) % 8;
                                const groups = ['VIII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
                                if (shellZ > 2 && shellZ <= 10) return groups[mod];
                                if (shellZ > 10 && shellZ <= 18) return groups[(shellZ - 10) % 8];
                                if (shellZ === 19) return 'I';
                                if (shellZ === 20) return 'II';
                                return '-';
                              })()}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-emerald-50 p-6 rounded-3xl border-2 border-emerald-100">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-sm font-black text-emerald-600 uppercase tracking-tight">Practice Challenge</h4>
                          {shellPractice && (
                            <button onClick={() => setShellPractice(null)} className="text-emerald-400 hover:text-emerald-600 font-bold text-[10px] uppercase">Exit</button>
                          )}
                        </div>
                        {!shellPractice ? (
                          <button onClick={generateShellPractice} className="w-full bg-emerald-500 text-white py-3 rounded-xl font-black uppercase tracking-widest shadow-[0_4px_0_0_#059669] hover:shadow-none hover:translate-y-1 transition-all">
                            Start Practice
                          </button>
                        ) : (
                          <div className="space-y-4">
                            <div className="text-center">
                              <p className="text-[10px] font-black text-emerald-400 uppercase mb-1">Electronic Arrangement for:</p>
                              <p className="text-xl font-black text-gray-800">{shellPractice.name} (Z={shellPractice.z})</p>
                            </div>
                            <div className="flex gap-2">
                              <input 
                                type="text" 
                                placeholder="e.g. 2,8,3" 
                                value={shellAnswer} 
                                onChange={e => setShellAnswer(e.target.value)}
                                className="flex-1 p-3 border-2 border-emerald-200 rounded-xl text-center font-black text-lg focus:border-emerald-500 outline-none transition-all"
                              />
                              <button onClick={checkShellPractice} className="bg-emerald-500 text-white px-6 rounded-xl font-black uppercase shadow-[0_4px_0_0_#059669] active:shadow-none active:translate-y-1 transition-all">
                                Check
                              </button>
                            </div>
                            {shellFeedback && (
                              <div className={`p-3 rounded-xl text-center font-bold text-xs ${shellFeedback === 'correct' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                {shellFeedback === 'correct' ? 'Correct! Well done.' : 'Try again! Remember shell limits (2, 8, 8).'}
                              </div>
                            )}
                            <button onClick={generateShellPractice} className="w-full text-emerald-500 font-bold uppercase text-[10px] hover:underline">Next Element</button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Panel: 2D Atom Diagram */}
                    <div className="lg:col-span-7 bg-gray-900 rounded-[2.5rem] flex items-center justify-center overflow-hidden border-8 border-gray-200 shadow-2xl min-h-[500px] relative">
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/20 to-transparent" />
                      
                      {/* Nucleus */}
                      <div className="w-24 h-24 bg-red-500 rounded-full shadow-[0_0_40px_rgba(239,68,68,0.6)] z-10 flex flex-col items-center justify-center text-white font-black border-4 border-red-400">
                        <span className="text-3xl leading-none">{shellZ}</span>
                        <span className="text-[10px] uppercase tracking-widest opacity-80">Protons</span>
                      </div>
                      
                      {/* Shells */}
                      {getElementByZ(shellZ).shells.map((count, shellIdx) => {
                        const radius = 80 + shellIdx * 55;
                        return (
                          <div key={shellIdx} className="absolute flex items-center justify-center">
                            {/* Shell Circle */}
                            <div 
                              className="absolute border-2 border-white/20 rounded-full"
                              style={{ width: radius * 2, height: radius * 2 }}
                            />
                            {/* Electrons */}
                            {[...Array(count)].map((_, eIdx) => {
                              const angle = (eIdx * 2 * Math.PI) / count - Math.PI / 2;
                              const x = radius * Math.cos(angle);
                              const y = radius * Math.sin(angle);
                              return (
                                <div
                                  key={eIdx}
                                  className="absolute w-7 h-7 bg-blue-400 rounded-full shadow-[0_0_15px_rgba(96,165,250,0.8)] border-2 border-blue-200 flex items-center justify-center z-20"
                                  style={{ 
                                    transform: `translate(${x}px, ${y}px)`,
                                  }}
                                >
                                  <span className="text-[10px] font-black text-blue-900">e⁻</span>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                      
                      <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                        <span>Shell 1: max 2</span>
                        <span>Shell 2: max 8</span>
                        <span>Shell 3: max 8</span>
                      </div>
                    </div>
                  </div>

                  <button onClick={() => setSelectedSim(null)} className="w-full mt-8 bg-gray-100 text-gray-400 py-4 rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-gray-200 transition-all">
                    Back to Selection
                  </button>
                </div>
              )}

              {selectedSim === 'balancing' && (
                <div className="bg-white border-2 border-gray-200 p-8 rounded-3xl shadow-[0_6px_0_0_#e5e7eb]">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Balancing Equations</h3>
                      <p className="text-violet-500 font-black text-xl uppercase tracking-widest text-xs">Conservation of Mass</p>
                    </div>
                    <div className="bg-violet-100 text-violet-600 p-4 rounded-2xl">
                      <Calculator size={32} />
                    </div>
                  </div>

                  <div className="space-y-12">
                    {/* Equation Display */}
                    <div className="bg-gray-50 p-10 rounded-[3rem] border-2 border-gray-100 shadow-inner flex flex-wrap items-center justify-center gap-4 text-4xl font-black text-gray-800">
                      {equations[balancingIndex].reactants.map((r, i) => (
                        <React.Fragment key={`r-${i}`}>
                          <div className="flex items-center gap-3">
                            <input 
                              type="number" 
                              min="1" 
                              max="10" 
                              value={coefficients[i] || 1} 
                              onChange={e => {
                                const newCoeffs = [...coefficients];
                                newCoeffs[i] = parseInt(e.target.value) || 1;
                                setCoefficients(newCoeffs);
                              }}
                              className="w-16 h-16 bg-white border-4 border-violet-200 rounded-2xl text-center text-2xl text-violet-600 outline-none focus:border-violet-500 transition-all"
                            />
                            <span dangerouslySetInnerHTML={{ __html: r.s.replace(/(\d+)/g, '<sub>$1</sub>') }} />
                          </div>
                          {i < equations[balancingIndex].reactants.length - 1 && <span className="text-gray-300">+</span>}
                        </React.Fragment>
                      ))}
                      
                      <ArrowRight className="text-violet-400 mx-4" size={48} />

                      {equations[balancingIndex].products.map((p, i) => (
                        <React.Fragment key={`p-${i}`}>
                          <div className="flex items-center gap-3">
                            <input 
                              type="number" 
                              min="1" 
                              max="10" 
                              value={coefficients[equations[balancingIndex].reactants.length + i] || 1} 
                              onChange={e => {
                                const newCoeffs = [...coefficients];
                                newCoeffs[equations[balancingIndex].reactants.length + i] = parseInt(e.target.value) || 1;
                                setCoefficients(newCoeffs);
                              }}
                              className="w-16 h-16 bg-white border-4 border-violet-200 rounded-2xl text-center text-2xl text-violet-600 outline-none focus:border-violet-500 transition-all"
                            />
                            <span dangerouslySetInnerHTML={{ __html: p.s.replace(/(\d+)/g, '<sub>$1</sub>') }} />
                          </div>
                          {i < equations[balancingIndex].products.length - 1 && <span className="text-gray-300">+</span>}
                        </React.Fragment>
                      ))}
                    </div>

                    {/* Atom Counts Comparison */}
                    {(() => {
                      const { reactantAtoms, productAtoms } = getAtomCounts();
                      return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="bg-blue-50 p-8 rounded-3xl border-2 border-blue-100">
                            <h4 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-6 text-center">Reactant Atoms</h4>
                            <div className="grid grid-cols-2 gap-4">
                              {Object.entries(reactantAtoms).map(([atom, count]: [string, any]) => (
                                <div key={atom} className="bg-white p-4 rounded-2xl border-2 border-blue-200 flex justify-between items-center">
                                  <span className="font-black text-gray-700">{atom}</span>
                                  <span className="text-2xl font-black text-blue-600">{count}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="bg-emerald-50 p-8 rounded-3xl border-2 border-emerald-100">
                            <h4 className="text-sm font-black text-emerald-600 uppercase tracking-widest mb-6 text-center">Product Atoms</h4>
                            <div className="grid grid-cols-2 gap-4">
                              {Object.entries(productAtoms).map(([atom, count]: [string, any]) => (
                                <div key={atom} className="bg-white p-4 rounded-2xl border-2 border-emerald-200 flex justify-between items-center">
                                  <span className="font-black text-gray-700">{atom}</span>
                                  <span className="text-2xl font-black text-emerald-600">{count}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Feedback & Navigation */}
                    <div className="flex flex-col items-center gap-6">
                      <AnimatePresence>
                        {isBalanced && (
                          <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-emerald-500 text-white px-10 py-4 rounded-2xl font-black text-xl uppercase tracking-widest flex items-center gap-3 shadow-lg"
                          >
                            <CheckCircle2 size={32} />
                            Equation Balanced!
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="flex gap-4 w-full">
                        <button 
                          onClick={() => {
                            setBalancingIndex(prev => (prev - 1 + equations.length) % equations.length);
                            setIsBalanced(false);
                          }}
                          className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
                        >
                          Previous
                        </button>
                        <button 
                          onClick={() => {
                            setBalancingIndex(prev => (prev + 1) % equations.length);
                            setIsBalanced(false);
                          }}
                          className="flex-1 bg-violet-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-[0_4px_0_0_#7c3aed] hover:shadow-none hover:translate-y-1 transition-all"
                        >
                          Next Equation
                        </button>
                      </div>
                    </div>
                  </div>

                  <button onClick={() => setSelectedSim(null)} className="w-full mt-12 bg-gray-100 text-gray-400 py-4 rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-gray-200 transition-all">
                    Back to Selection
                  </button>
                </div>
              )}
              {selectedSim === 'matter' && (
                <div className="bg-white border-2 border-gray-200 p-8 rounded-3xl shadow-[0_6px_0_0_#e5e7eb]">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tight">States of Matter</h3>
                      <p className="text-sky-500 font-black text-xl uppercase tracking-widest text-xs">Particle Arrangement & Kinetic Theory</p>
                    </div>
                    <div className="bg-sky-100 text-sky-600 p-4 rounded-2xl">
                      <Thermometer size={32} />
                    </div>
                  </div>

                  <div className="space-y-8 mb-8">
                    <div className="flex flex-col gap-8">
                      {/* Top Controls: Chemical Selection */}
                      <div className="bg-gray-50 p-6 rounded-3xl border-2 border-gray-100">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 text-center">Select Substance</p>
                        <div className="flex flex-wrap justify-center gap-3">
                          {chemicals.map(c => (
                            <button
                              key={c.name}
                              onClick={() => setSelectedMatter(c.name)}
                              className={`px-6 py-3 rounded-2xl font-black text-sm transition-all border-2 ${selectedMatter === c.name ? 'bg-sky-500 text-white border-sky-600 shadow-[0_4px_0_0_#0369a1]' : 'bg-white text-gray-600 border-gray-200 hover:border-sky-300 shadow-[0_2px_0_0_#e5e7eb]'}`}
                            >
                              {c.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Main Simulation Area */}
                      <div className="space-y-6">
                        {(() => {
                          const chem = chemicals.find(c => c.name === selectedMatter)!;
                          const state = getMatterState(matterTemp, chem);
                          
                          const stateData = {
                            Solid: {
                              movement: "Vibrating about fixed positions",
                              arrangement: "Regular lattice / Closely packed",
                              volume: "Fixed",
                              shape: "Fixed"
                            },
                            Liquid: {
                              movement: "Able to slide past each other",
                              arrangement: "Irregular / Closely packed",
                              volume: "Fixed",
                              shape: "Variable (takes shape of container)"
                            },
                            Gas: {
                              movement: "Rapid random motion in all directions",
                              arrangement: "Irregular / Far apart",
                              volume: "Variable (expands to fill container)",
                              shape: "Variable (takes shape of container)"
                            }
                          }[state as 'Solid' | 'Liquid' | 'Gas'];

                          return (
                            <div className="space-y-8">
                              <div className="relative h-96 bg-gray-900 rounded-[2.5rem] overflow-hidden border-4 border-gray-200 shadow-2xl group">
                                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-sky-500/10 to-transparent" />
                                
                                {/* State Badge */}
                                <div className="absolute top-6 left-6 z-20">
                                  <div className="bg-black/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 shadow-xl">
                                    <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] mb-1">Current State</p>
                                    <h4 className={`text-3xl font-black uppercase tracking-tight ${state === 'Solid' ? 'text-blue-400' : state === 'Liquid' ? 'text-sky-400' : 'text-orange-400'}`}>
                                      {state}
                                    </h4>
                                  </div>
                                </div>

                                {/* Temp Badge */}
                                <div className="absolute top-6 right-6 z-20">
                                  <div className="bg-black/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 shadow-xl text-right">
                                    <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] mb-1">Temperature</p>
                                    <h4 className="text-3xl font-black text-white tracking-tight">{matterTemp}°C</h4>
                                  </div>
                                </div>

                                {/* Particles */}
                                {[...Array(48)].map((_, i) => {
                                  const row = Math.floor(i / 8);
                                  const col = i % 8;
                                  const solidX = 30 + col * 6;
                                  const solidY = 40 + row * 6;
                                  const liquidX = 20 + Math.random() * 60;
                                  const liquidY = 65 + Math.random() * 25;
                                  const gasX = Math.random() * 90;
                                  const gasY = Math.random() * 90;

                                  return (
                                    <motion.div
                                      key={`${selectedMatter}-${state}-${i}`}
                                      className={`absolute w-6 h-6 rounded-full ${chem.bg} shadow-lg border border-white/20`}
                                      initial={state === 'Solid' ? { left: `${solidX}%`, top: `${solidY}%` } : 
                                               state === 'Liquid' ? { left: `${liquidX}%`, top: `${liquidY}%` } : 
                                               { left: `${gasX}%`, top: `${gasY}%` }}
                                      animate={state === 'Solid' ? {
                                        x: [0, 1, -1, 0],
                                        y: [0, -1, 1, 0],
                                      } : state === 'Liquid' ? {
                                        x: [0, Math.random() * 20 - 10, Math.random() * 20 - 10, 0],
                                        y: [0, Math.random() * 10 - 5, Math.random() * 10 - 5, 0],
                                        left: [`${liquidX}%`, `${(liquidX + 5) % 100}%`, `${liquidX}%`]
                                      } : {
                                        left: [`${gasX}%`, `${Math.random() * 90}%`, `${Math.random() * 90}%`, `${gasX}%`],
                                        top: [`${gasY}%`, `${Math.random() * 90}%`, `${Math.random() * 90}%`, `${gasY}%`],
                                      }}
                                      transition={{
                                        duration: state === 'Solid' ? 0.15 : state === 'Liquid' ? 2.5 : 4,
                                        repeat: Infinity,
                                        ease: "linear"
                                      }}
                                    />
                                  );
                                })}
                                
                                {/* Bottom Info Bar */}
                                <div className="absolute bottom-0 inset-x-0 bg-black/40 backdrop-blur-md p-4 border-t border-white/10 flex justify-around">
                                  <div className="text-center">
                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Melting Point</p>
                                    <p className="text-white font-bold">{chem.mp}°C</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Boiling Point</p>
                                    <p className="text-white font-bold">{chem.bp}°C</p>
                                  </div>
                                </div>
                              </div>

                              {/* Temperature Slider */}
                              <div className="bg-white p-8 rounded-3xl border-2 border-gray-100 shadow-sm">
                                <div className="flex justify-between items-center mb-4">
                                  <div className="flex items-center gap-3">
                                    <div className="bg-sky-100 text-sky-600 p-2 rounded-xl">
                                      <Thermometer size={20} />
                                    </div>
                                    <h5 className="font-black text-gray-800 uppercase tracking-tight">Adjust Temperature</h5>
                                  </div>
                                  <span className="text-2xl font-black text-sky-600">{matterTemp}°C</span>
                                </div>
                                <input 
                                  type="range" 
                                  min="-273" 
                                  max="3000" 
                                  value={matterTemp} 
                                  onChange={e => setMatterTemp(parseInt(e.target.value))} 
                                  className="w-full h-4 bg-gray-200 rounded-xl appearance-none cursor-pointer accent-sky-500" 
                                />
                                <div className="flex justify-between mt-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                  <span>Absolute Zero (-273°C)</span>
                                  <span>Extreme Heat (3000°C)</span>
                                </div>
                              </div>

                              {/* State Properties Grid */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-white p-5 rounded-2xl border-2 border-gray-100 shadow-sm">
                                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Arrangement</p>
                                  <p className="text-sm font-bold text-gray-800 leading-tight">{stateData.arrangement}</p>
                                </div>
                                <div className="bg-white p-5 rounded-2xl border-2 border-gray-100 shadow-sm">
                                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Movement</p>
                                  <p className="text-sm font-bold text-gray-800 leading-tight">{stateData.movement}</p>
                                </div>
                                <div className="bg-white p-5 rounded-2xl border-2 border-gray-100 shadow-sm">
                                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Volume</p>
                                  <p className="text-sm font-bold text-gray-800 leading-tight">{stateData.volume}</p>
                                </div>
                                <div className="bg-white p-5 rounded-2xl border-2 border-gray-100 shadow-sm">
                                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Shape</p>
                                  <p className="text-sm font-bold text-gray-800 leading-tight">{stateData.shape}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t-2 border-gray-100">
                    <div className="bg-sky-50 p-6 rounded-3xl border-2 border-sky-100">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-black text-sky-600 uppercase tracking-widest">Practice Mode</h4>
                        {matterPractice && (
                          <button onClick={() => setMatterPractice(null)} className="text-sky-400 hover:text-sky-600 font-bold text-xs uppercase">Close</button>
                        )}
                      </div>
                      {!matterPractice ? (
                        <button onClick={generateMatterPractice} className="w-full bg-sky-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-[0_4px_0_0_#0369a1] hover:shadow-none hover:translate-y-1 transition-all">
                          Start State Challenge
                        </button>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                          <div className="text-center p-6 bg-white rounded-2xl border-2 border-sky-200">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">What is the state of</p>
                            <h5 className="text-3xl font-black text-gray-800 uppercase tracking-tight">{matterPractice.chem.name}</h5>
                            <p className="text-sky-500 font-black text-2xl">at {matterPractice.temp}°C?</p>
                          </div>
                          <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-3">
                              {['Solid', 'Liquid', 'Gas'].map(s => (
                                <button
                                  key={s}
                                  onClick={() => setMatterAnswer(s)}
                                  className={`py-4 rounded-2xl font-black uppercase tracking-widest border-2 transition-all ${matterAnswer === s ? 'bg-sky-500 text-white border-sky-600 shadow-[0_4px_0_0_#0369a1]' : 'bg-white text-gray-500 border-gray-200 hover:border-sky-300'}`}
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                            <button onClick={() => {
                              if (matterAnswer === matterPractice.targetState) setMatterFeedback('correct');
                              else setMatterFeedback('incorrect');
                            }} className="w-full bg-sky-500 text-white py-3 rounded-xl font-black uppercase tracking-widest shadow-[0_4px_0_0_#0369a1] active:shadow-none active:translate-y-1 transition-all">
                              Check Answer
                            </button>
                            {matterFeedback && (
                              <div className={`p-3 rounded-xl text-center font-bold ${matterFeedback === 'correct' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                {matterFeedback === 'correct' ? 'Correct! You understand state changes.' : `Incorrect. At ${matterPractice.temp}°C, ${matterPractice.chem.name} is a ${matterPractice.targetState}.`}
                              </div>
                            )}
                            <button onClick={generateMatterPractice} className="w-full text-sky-500 font-bold uppercase text-xs hover:underline">Next Question</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <button onClick={() => setSelectedSim(null)} className="w-full bg-gray-200 text-gray-500 py-4 rounded-2xl font-black text-xl uppercase tracking-widest hover:bg-gray-300 transition-all">
                    Back to Selection
                  </button>
                </div>
              )}

              {selectedSim === 'diffusion' && (
                <div className="bg-white border-2 border-gray-200 p-8 rounded-3xl shadow-[0_6px_0_0_#e5e7eb]">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Diffusion Chamber</h3>
                      <p className="text-orange-500 font-black text-xl uppercase tracking-widest text-xs">Concentration Gradient & Kinetic Theory</p>
                    </div>
                    <div className="bg-orange-100 text-orange-600 p-4 rounded-2xl">
                      <ArrowRightLeft size={32} />
                    </div>
                  </div>

                  <div className="space-y-8 mb-8">
                    <div className="flex flex-col gap-8">
                      {/* Main Simulation Area */}
                      <div className="relative h-[500px] bg-gray-900 rounded-[2.5rem] overflow-hidden border-4 border-gray-200 shadow-2xl" ref={simRef}>
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500/20 to-transparent" />
                        
                        {/* Partition */}
                        {!isPartitionRemoved && (
                          <div className="absolute top-0 bottom-0 left-1/2 w-2 bg-gray-400/50 backdrop-blur-sm z-10 shadow-[0_0_20px_rgba(255,255,255,0.2)]" />
                        )}

                        {/* Particles */}
                        {particles.map(p => (
                          <motion.div
                            key={p.id}
                            className={`absolute w-4 h-4 rounded-full shadow-lg border border-white/20 ${p.type === 'red' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'}`}
                            style={{ left: `${p.x}%`, top: `${p.y}%` }}
                            animate={{
                              x: [0, Math.random() * 10 - 5, Math.random() * 10 - 5, 0],
                              y: [0, Math.random() * 10 - 5, Math.random() * 10 - 5, 0],
                            }}
                            transition={{
                              duration: 0.5 / (diffusionTemp / 50 + 0.1),
                              repeat: Infinity,
                              ease: "linear"
                            }}
                          />
                        ))}

                        {/* Labels */}
                        {!isPartitionRemoved && (
                          <>
                            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 text-center z-20">
                              <p className="text-4xl font-black text-red-400/20 uppercase tracking-widest">High Concentration</p>
                            </div>
                            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 text-center z-20">
                              <p className="text-4xl font-black text-blue-400/20 uppercase tracking-widest">Low Concentration</p>
                            </div>
                          </>
                        )}

                        {/* Particle Counts Overlay */}
                        <div className="absolute bottom-6 inset-x-6 flex justify-between gap-6 pointer-events-none">
                          <div className="bg-black/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 flex gap-8">
                            <div className="text-center">
                              <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">Left Red</p>
                              <p className="text-2xl font-black text-white">{counts.leftRed}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Left Blue</p>
                              <p className="text-2xl font-black text-white">{counts.leftBlue}</p>
                            </div>
                          </div>
                          <div className="bg-black/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 flex gap-8">
                            <div className="text-center">
                              <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">Right Red</p>
                              <p className="text-2xl font-black text-white">{counts.rightRed}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Right Blue</p>
                              <p className="text-2xl font-black text-white">{counts.rightBlue}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Controls Area */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-8 rounded-3xl border-2 border-gray-100 shadow-sm space-y-6">
                          <div className="flex items-center gap-3">
                            <div className="bg-orange-100 text-orange-600 p-2 rounded-xl">
                              <RefreshCw size={20} />
                            </div>
                            <h5 className="font-black text-gray-800 uppercase tracking-tight">Initial Setup</h5>
                          </div>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[10px] font-black text-red-500 uppercase tracking-widest">Left Red: {redLeft}</label>
                                <input type="range" min="0" max="50" value={redLeft} onChange={e => setRedLeft(parseInt(e.target.value))} disabled={isPartitionRemoved} className="w-full h-2 bg-red-100 rounded-lg appearance-none cursor-pointer accent-red-500" />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Left Blue: {blueLeft}</label>
                                <input type="range" min="0" max="50" value={blueLeft} onChange={e => setBlueLeft(parseInt(e.target.value))} disabled={isPartitionRemoved} className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <button 
                                onClick={() => {
                                  setIsPartitionRemoved(false);
                                  initParticles();
                                }} 
                                className="px-6 py-4 bg-gray-100 text-gray-600 rounded-2xl font-black text-sm hover:bg-gray-200 transition-all border-2 border-transparent active:scale-95"
                              >
                                Reset
                              </button>
                              <button 
                                onClick={() => setIsPartitionRemoved(true)} 
                                disabled={isPartitionRemoved}
                                className="px-6 py-4 bg-orange-600 text-white rounded-2xl font-black text-sm hover:bg-orange-700 transition-all shadow-lg shadow-orange-200 disabled:opacity-50 active:scale-95"
                              >
                                Open Partition
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border-2 border-gray-100 shadow-sm space-y-6">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div className="bg-orange-100 text-orange-600 p-2 rounded-xl">
                                <Thermometer size={20} />
                              </div>
                              <h5 className="font-black text-gray-800 uppercase tracking-tight">Temperature</h5>
                            </div>
                            <span className="text-2xl font-black text-orange-600">{diffusionTemp}°C</span>
                          </div>
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={diffusionTemp} 
                            onChange={e => setDiffusionTemp(parseInt(e.target.value))} 
                            className="w-full h-4 bg-gray-200 rounded-xl appearance-none cursor-pointer accent-orange-500" 
                          />
                          <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <span>Cold (0°C)</span>
                            <span>Hot (100°C)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {isPartitionRemoved && (
                    <div className={`p-4 rounded-2xl mb-8 text-center font-black uppercase tracking-tight ${netDiffusion === 'equilibrium' ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-200' : 'bg-orange-100 text-orange-700 border-2 border-orange-200'}`}>
                      {netDiffusion === 'equilibrium' ? (
                        <div className="flex items-center justify-center gap-2">
                          <CheckCircle2 size={20} />
                          Dynamic Equilibrium Reached: No Net Diffusion
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <RefreshCw size={20} className="animate-spin" />
                          {netDiffusion}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Practice Mode Section */}
                  <div className="mt-12 pt-8 border-t-2 border-gray-100">
                    <div className="bg-orange-50/50 rounded-3xl p-8 border-2 border-orange-100">
                      <div className="flex justify-between items-center mb-6">
                        <h4 className="text-sm font-black text-orange-600 uppercase tracking-widest">Practice Mode</h4>
                        {diffusionPractice && (
                          <button onClick={() => setDiffusionPractice(null)} className="text-orange-400 hover:text-orange-600 font-bold text-xs uppercase">Close</button>
                        )}
                      </div>

                      {!diffusionPractice ? (
                        <div className="text-center py-8">
                          <p className="text-gray-500 mb-6 font-medium">Test your understanding of concentration gradients and net movement.</p>
                          <button onClick={generateDiffusionPractice} className="bg-orange-500 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-[0_4px_0_0_#c2410c] hover:shadow-none hover:translate-y-1 transition-all">
                            Start Practice Challenge
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-8">
                          <div className="bg-white p-6 rounded-2xl border-2 border-orange-100 shadow-sm">
                            <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mb-2">Question</p>
                            <h5 className="text-xl font-black text-gray-800 uppercase tracking-tight">
                              Predict the net movement of <span className={diffusionPractice.type === 'red' ? 'text-red-500' : 'text-blue-500'}>{diffusionPractice.type.toUpperCase()}</span> particles when the partition is removed.
                            </h5>
                            <div className="mt-4 flex gap-4">
                              <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                                <span className="text-[10px] font-bold text-gray-400 uppercase block">Left Chamber</span>
                                <span className="font-black text-gray-700">{diffusionPractice.l} particles</span>
                              </div>
                              <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                                <span className="text-[10px] font-bold text-gray-400 uppercase block">Right Chamber</span>
                                <span className="font-black text-gray-700">{diffusionPractice.r} particles</span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {diffusionPractice.options.map((option: string) => (
                              <button
                                key={option}
                                onClick={() => setDiffusionAnswer(option)}
                                disabled={diffusionFeedback !== null}
                                className={`p-4 rounded-xl font-black uppercase tracking-widest border-2 transition-all ${
                                  diffusionAnswer === option
                                    ? 'bg-orange-500 text-white border-orange-600 shadow-[0_4px_0_0_#c2410c]'
                                    : 'bg-white text-gray-600 border-gray-100 hover:border-orange-200'
                                }`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>

                          {diffusionAnswer && !diffusionFeedback && (
                            <button onClick={checkDiffusionPractice} className="w-full bg-orange-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-[0_4px_0_0_#c2410c] active:shadow-none active:translate-y-1 transition-all">
                              Check Answer
                            </button>
                          )}

                          {diffusionFeedback && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`p-6 rounded-2xl text-center ${
                                diffusionFeedback === 'correct' ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-200' : 'bg-red-100 text-red-700 border-2 border-red-200'
                              }`}
                            >
                              <div className="flex items-center justify-center gap-2 mb-2">
                                {diffusionFeedback === 'correct' ? <CheckCircle2 size={24} /> : <ArrowRightLeft size={24} />}
                                <p className="text-xl font-black uppercase tracking-tight">
                                  {diffusionFeedback === 'correct' ? 'Correct!' : 'Try Again!'}
                                </p>
                              </div>
                              <p className="font-bold">
                                {diffusionFeedback === 'correct' 
                                  ? `Particles move from high concentration (${Math.max(diffusionPractice.l, diffusionPractice.r)}) to low concentration (${Math.min(diffusionPractice.l, diffusionPractice.r)}).` 
                                  : `Remember: Net movement is always from high concentration to low concentration.`}
                              </p>
                              <div className="mt-4 flex gap-4">
                                <button onClick={generateDiffusionPractice} className="flex-1 bg-white/50 hover:bg-white/80 py-2 rounded-xl font-bold uppercase text-xs transition-all">Next Question</button>
                                <button onClick={() => { setIsPartitionRemoved(true); setDiffusionFeedback(null); }} className="flex-1 bg-white/50 hover:bg-white/80 py-2 rounded-xl font-bold uppercase text-xs transition-all">Watch Simulation</button>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelectedSim(null)}
                className="w-full bg-gray-200 text-gray-500 py-4 rounded-2xl font-black text-xl uppercase tracking-widest hover:bg-gray-300 transition-all"
              >
                Back to Simulations
              </button>
            </div>
          )}
        </div>
      );
    };

    const GraphPlayground = () => {
      const [isPractice, setIsPractice] = useState(false);
      const [practiceData, setPracticeData] = useState<any>(null);
      const [userAnswer, setUserAnswer] = useState('');
      const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

      const generatePractice = () => {
        const speed = Math.floor(Math.random() * 10) + 1;
        const data = [];
        for (let t = 0; t <= 10; t++) {
          data.push({ time: t, distance: speed * t });
        }
        setPracticeData({ speed, data });
        setUserAnswer('');
        setFeedback(null);
      };

      const checkAnswer = () => {
        if (parseInt(userAnswer) === practiceData.speed) {
          setFeedback('correct');
        } else {
          setFeedback('incorrect');
        }
      };

      const generateData = () => {
        const data = [];
        for (let t = 0; t <= 10; t++) {
          data.push({
            time: t,
            obj1: graphSpeed1 * t,
            obj2: graphSpeed2 * t
          });
        }
        return data;
      };

      const data = generateData();

      const ObjectAnimation = ({ speed, color }: { speed: number; color: string }) => {
        const duration = 10 / speed;
        return (
          <div className="relative h-12 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 mt-2">
            <motion.div
              key={speed}
              animate={{ left: ['0%', '100%'], x: ['0%', '-100%'] }}
              transition={{ duration, repeat: Infinity, ease: 'linear' }}
              className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full ${color} shadow-lg`}
            />
            <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none opacity-20">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="w-px h-4 bg-gray-400" />
              ))}
            </div>
          </div>
        );
      };

      return (
        <div className="space-y-8">
          {!selectedGraph ? (
            <div className="grid grid-cols-1 gap-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedGraph('speed')}
                className="bg-white border-2 border-gray-200 p-8 rounded-3xl flex items-center gap-6 shadow-[0_6px_0_0_#e5e7eb] hover:border-indigo-400 transition-all group"
              >
                <div className="bg-indigo-100 text-indigo-600 p-5 rounded-2xl group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                  <TrendingUp size={40} />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Speed: Distance-time graph</h3>
                  <p className="text-gray-500 font-medium">Visualize how speed affects distance over time.</p>
                </div>
              </motion.button>
            </div>
          ) : isPractice ? (
            <div className="space-y-6">
              <div className="bg-white border-2 border-gray-200 p-8 rounded-3xl shadow-[0_6px_0_0_#e5e7eb]">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Practice: Calculate Speed</h3>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Find the slope (v = d / t)</p>
                  </div>
                  <button 
                    onClick={() => setIsPractice(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle size={32} />
                  </button>
                </div>

                {!practiceData ? (
                  <div className="text-center py-12">
                    <button
                      onClick={generatePractice}
                      className="bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black text-xl uppercase tracking-widest shadow-[0_6px_0_0_#4338ca] active:shadow-none active:translate-y-1 transition-all"
                    >
                      Start Practice
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={practiceData.data}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis 
                            dataKey="time" 
                            label={{ value: 'Time (s)', position: 'insideBottom', offset: -5, fontSize: 10, fontWeight: 'bold' }} 
                            tick={{ fontSize: 10, fontWeight: 'bold' }}
                          />
                          <YAxis 
                            label={{ value: 'Distance (m)', angle: -90, position: 'insideLeft', fontSize: 10, fontWeight: 'bold' }} 
                            tick={{ fontSize: 10, fontWeight: 'bold' }}
                          />
                          <Tooltip 
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="distance" 
                            stroke="#6366f1" 
                            strokeWidth={4} 
                            dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-2xl border-2 border-gray-100">
                      <p className="text-sm font-black text-gray-500 uppercase tracking-widest mb-4">What is the speed of this object?</p>
                      <div className="flex gap-4">
                        <input
                          type="number"
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          placeholder="Enter speed..."
                          className="flex-1 bg-white border-2 border-gray-200 p-4 rounded-xl font-black text-xl focus:border-indigo-500 outline-none transition-all"
                        />
                        <div className="flex items-center text-gray-400 font-black text-xl">m/s</div>
                      </div>

                      {feedback && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`mt-4 p-4 rounded-xl flex items-center gap-3 ${
                            feedback === 'correct' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {feedback === 'correct' ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                          <span className="font-black uppercase tracking-tight">
                            {feedback === 'correct' ? 'Correct! Well done!' : 'Not quite. Try again!'}
                          </span>
                        </motion.div>
                      )}

                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <button
                          onClick={checkAnswer}
                          className="bg-indigo-500 text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-[0_4px_0_0_#4338ca] active:shadow-none active:translate-y-1 transition-all"
                        >
                          Check
                        </button>
                        <button
                          onClick={generatePractice}
                          className="bg-white border-2 border-gray-200 text-gray-500 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-gray-50 transition-all"
                        >
                          Next Graph
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white border-2 border-gray-200 p-8 rounded-3xl shadow-[0_6px_0_0_#e5e7eb]">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Distance-Time Graph</h3>
                    <p className="text-indigo-500 font-black text-xl">v = d / t</p>
                  </div>
                  <div className="bg-indigo-100 text-indigo-600 p-4 rounded-2xl">
                    <TrendingUp size={32} />
                  </div>
                </div>

                <div className="h-64 w-full mb-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="time" 
                        label={{ value: 'Time (s)', position: 'insideBottom', offset: -5, fontSize: 10, fontWeight: 'bold' }} 
                        tick={{ fontSize: 10, fontWeight: 'bold' }}
                      />
                      <YAxis 
                        label={{ value: 'Distance (m)', angle: -90, position: 'insideLeft', fontSize: 10, fontWeight: 'bold' }} 
                        tick={{ fontSize: 10, fontWeight: 'bold' }}
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                        labelStyle={{ fontWeight: 'bold' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="obj1" 
                        name="Object 1"
                        stroke="#3b82f6" 
                        strokeWidth={4} 
                        dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 8 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="obj2" 
                        name="Object 2"
                        stroke="#ef4444" 
                        strokeWidth={4} 
                        dot={{ r: 4, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-black text-blue-500 uppercase tracking-widest">Object 1 Speed: {graphSpeed1} m/s</label>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="20" 
                      value={graphSpeed1} 
                      onChange={(e) => setGraphSpeed1(parseInt(e.target.value))}
                      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <ObjectAnimation speed={graphSpeed1} color="bg-blue-500" />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-black text-red-500 uppercase tracking-widest">Object 2 Speed: {graphSpeed2} m/s</label>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="20" 
                      value={graphSpeed2} 
                      onChange={(e) => setGraphSpeed2(parseInt(e.target.value))}
                      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500"
                    />
                    <ObjectAnimation speed={graphSpeed2} color="bg-red-500" />
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsPractice(true);
                    generatePractice();
                  }}
                  className="w-full mt-8 bg-emerald-500 text-white py-4 rounded-2xl font-black text-xl uppercase tracking-widest shadow-[0_6px_0_0_#059669] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-3"
                >
                  <Zap size={24} />
                  Practice Mode
                </button>
              </div>

              <button
                onClick={() => setSelectedGraph(null)}
                className="w-full bg-gray-200 text-gray-500 py-4 rounded-2xl font-black text-xl uppercase tracking-widest hover:bg-gray-300 transition-all"
              >
                Back to Graphs
              </button>
            </div>
          )}
        </div>
      );
    };

    const generatePracticeQuestion = (equation: any) => {
      const v1 = Math.floor(Math.random() * 10) + 1;
      const v2 = Math.floor(Math.random() * 10) + 1;
      let questionText = '';
      let correctAnswer = 0;
      let unit = '';

      if (equation.id === 'ram') {
        questionText = `If an element has an isotope with 75% abundance and mass number 35, and another with 25% abundance and mass number 37, what is the RAM?`;
        correctAnswer = 35.5;
        unit = '';
      } else if (equation.id === 'particles') {
        questionText = `If you have ${v1} moles of particles, how many particles are there? (L = 6.02 × 10²³)`;
        correctAnswer = v1 * 6.02;
        unit = '× 10²³';
      } else if (equation.id === 'mole_mass') {
        questionText = `If the mass is ${v1 * v2}g and the Molar Mass is ${v2}g/mol, how many moles are there?`;
        correctAnswer = v1;
        unit = 'mol';
      } else if (equation.id === 'mole_conc') {
        questionText = `If the concentration is ${v1}mol dm⁻³ and the volume is ${v2}dm³, how many moles are there?`;
        correctAnswer = v1 * v2;
        unit = 'mol';
      } else if (equation.id === 'mole_gas') {
        questionText = `If the gas volume is ${v1 * 24}dm³, how many moles are there? (Molar volume = 24 dm³/mol)`;
        correctAnswer = v1;
        unit = 'mol';
      } else if (equation.id === 'yield') {
        questionText = `If the actual yield is ${v1}g and the theoretical yield is ${v1 * 2}g, what is the percentage yield?`;
        correctAnswer = 50;
        unit = '%';
      } else if (equation.id === 'enthalpy') {
        questionText = `If the bond enthalpies of reactants is ${v1 + v2}kJ/mol and products is ${v2}kJ/mol, what is ΔH?`;
        correctAnswer = v1;
        unit = 'kJ/mol';
      } else {
        questionText = `If Part is ${v1} and Whole is ${v1 * 10}, what is the Percentage?`;
        correctAnswer = 10;
        unit = '%';
      }

      const options = [
        correctAnswer.toString(),
        (correctAnswer + 2).toString(),
        (correctAnswer * 2).toString(),
        (Math.max(1, correctAnswer - 1)).toString()
      ].sort(() => Math.random() - 0.5);

      setPracticeQuestion({ text: questionText, correctAnswer: correctAnswer.toString(), options, unit });
      setPracticeAnswer(null);
      setIsPracticeChecked(false);
    };

    if (subMode === 'select') {
      return (
        <div className="min-h-screen bg-gray-50 pb-24">
          <header className="bg-white border-b-2 border-gray-200 p-6 sticky top-0 z-10">
            <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tight">Playground</h1>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-1">Interactive Learning</p>
          </header>
          <main className="max-w-2xl mx-auto p-6 space-y-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSubMode('equations')}
              className="w-full bg-white border-2 border-gray-200 p-8 rounded-3xl flex items-center gap-6 shadow-[0_6px_0_0_#e5e7eb] hover:border-blue-400 hover:shadow-[0_6px_0_0_#60a5fa] transition-all group"
            >
              <div className="bg-blue-100 text-blue-600 p-5 rounded-2xl group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <Calculator size={40} />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Equation Playground</h2>
                <p className="text-gray-500 font-medium">Rearrange and practice key scientific formulas.</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSubMode('chemicals')}
              className="w-full bg-white border-2 border-gray-200 p-8 rounded-3xl flex items-center gap-6 shadow-[0_6px_0_0_#e5e7eb] hover:border-emerald-400 hover:shadow-[0_6px_0_0_#34d399] transition-all group"
            >
              <div className="bg-emerald-100 text-emerald-600 p-5 rounded-2xl group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <Atom size={40} />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Chemical Playground</h2>
                <p className="text-gray-500 font-medium">Explore common chemicals and their properties.</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSubMode('graphs')}
              className="w-full bg-white border-2 border-gray-200 p-8 rounded-3xl flex items-center gap-6 shadow-[0_6px_0_0_#e5e7eb] hover:border-indigo-400 hover:shadow-[0_6px_0_0_#818cf8] transition-all group"
            >
              <div className="bg-indigo-100 text-indigo-600 p-5 rounded-2xl group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                <TrendingUp size={40} />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Graph Playground</h2>
                <p className="text-gray-500 font-medium">Experiment with dynamic scientific graphs.</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSubMode('simulations')}
              className="w-full bg-white border-2 border-gray-200 p-8 rounded-3xl flex items-center gap-6 shadow-[0_6px_0_0_#e5e7eb] hover:border-orange-400 hover:shadow-[0_6px_0_0_#fb923c] transition-all group"
            >
              <div className="bg-orange-100 text-orange-600 p-5 rounded-2xl group-hover:bg-orange-500 group-hover:text-white transition-colors">
                <ArrowRightLeft size={40} />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Simulation Playground</h2>
                <p className="text-gray-500 font-medium">Interactive simulations for complex scientific concepts.</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSubMode('solubility')}
              className="w-full bg-white border-2 border-gray-200 p-8 rounded-3xl flex items-center gap-6 shadow-[0_6px_0_0_#e5e7eb] hover:border-emerald-400 hover:shadow-[0_6px_0_0_#34d399] transition-all group"
            >
              <div className="bg-emerald-100 text-emerald-600 p-5 rounded-2xl group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <Droplets size={40} />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Solubility Playground</h2>
                <p className="text-gray-500 font-medium">Test your knowledge of salt solubility rules.</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSubMode('mole-calc')}
              className="w-full bg-white border-2 border-gray-200 p-8 rounded-3xl flex items-center gap-6 shadow-[0_6px_0_0_#e5e7eb] hover:border-orange-400 hover:shadow-[0_6px_0_0_#fb923c] transition-all group"
            >
              <div className="bg-orange-100 text-orange-600 p-5 rounded-2xl group-hover:bg-orange-500 group-hover:text-white transition-colors">
                <Variable size={40} />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Mole Calculation Playground</h2>
                <p className="text-gray-500 font-medium">Calculate moles from mass, concentration, and volume.</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSubMode('mole')}
              className="w-full bg-white border-2 border-gray-200 p-8 rounded-3xl flex items-center gap-6 shadow-[0_6px_0_0_#e5e7eb] hover:border-orange-400 hover:shadow-[0_6px_0_0_#fb923c] transition-all group"
            >
              <div className="bg-orange-100 text-orange-600 p-5 rounded-2xl group-hover:bg-orange-500 group-hover:text-white transition-colors">
                <Calculator size={40} />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Mole Playground</h2>
                <p className="text-gray-500 font-medium">Practice stoichiometry and mole calculations.</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSubMode('ionic')}
              className="w-full bg-white border-2 border-gray-200 p-8 rounded-3xl flex items-center gap-6 shadow-[0_6px_0_0_#e5e7eb] hover:border-blue-400 hover:shadow-[0_6px_0_0_#60a5fa] transition-all group"
            >
              <div className="bg-blue-100 text-blue-600 p-5 rounded-2xl group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <Droplets size={40} />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Net Ionic Playground</h2>
                <p className="text-gray-500 font-medium">Master the art of simplifying ionic equations.</p>
              </div>
            </motion.button>
          </main>
        </div>
      );
    }

    if (subMode === 'ionic') {
      return (
        <div className="min-h-screen bg-gray-50 pb-24">
          <header className="bg-white border-b-2 border-gray-200 p-4 sticky top-0 z-10">
            <div className="max-w-2xl mx-auto flex items-center gap-4">
              <button onClick={() => setSubMode('select')} className="text-gray-400 hover:text-gray-600">
                <ChevronLeft size={32} />
              </button>
              <div>
                <h1 className="text-lg font-black text-gray-800 uppercase tracking-tight leading-none">Net Ionic Playground</h1>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Equation Simplification</p>
              </div>
            </div>
          </header>
          <main className="max-w-2xl mx-auto p-6">
            <NetIonicPlayground />
          </main>
        </div>
      );
    }

    if (subMode === 'mole-calc') {
      return (
        <div className="min-h-screen bg-gray-50 pb-24">
          <header className="bg-white border-b-2 border-gray-200 p-4 sticky top-0 z-10">
            <div className="max-w-2xl mx-auto flex items-center gap-4">
              <button onClick={() => setSubMode('select')} className="text-gray-400 hover:text-gray-600">
                <ChevronLeft size={32} />
              </button>
              <div>
                <h1 className="text-lg font-black text-gray-800 uppercase tracking-tight leading-none">Mole Calculation Playground</h1>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Formula Practice</p>
              </div>
            </div>
          </header>
          <main className="max-w-2xl mx-auto p-6">
            <MoleCalculationPlayground />
          </main>
        </div>
      );
    }

    if (subMode === 'mole') {
      return (
        <div className="min-h-screen bg-gray-50 pb-24">
          <header className="bg-white border-b-2 border-gray-200 p-4 sticky top-0 z-10">
            <div className="max-w-2xl mx-auto flex items-center gap-4">
              <button onClick={() => setSubMode('select')} className="text-gray-400 hover:text-gray-600">
                <ChevronLeft size={32} />
              </button>
              <div>
                <h1 className="text-lg font-black text-gray-800 uppercase tracking-tight leading-none">Mole Playground</h1>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Stoichiometry Practice</p>
              </div>
            </div>
          </header>
          <main className="max-w-2xl mx-auto p-6">
            <MolePlayground />
          </main>
        </div>
      );
    }

    if (subMode === 'solubility') {
      return (
        <div className="min-h-screen bg-gray-50 pb-24">
          <header className="bg-white border-b-2 border-gray-200 p-4 sticky top-0 z-10">
            <div className="max-w-2xl mx-auto flex items-center gap-4">
              <button onClick={() => setSubMode('select')} className="text-gray-400 hover:text-gray-600">
                <ChevronLeft size={32} />
              </button>
              <div>
                <h1 className="text-lg font-black text-gray-800 uppercase tracking-tight leading-none">Solubility Playground</h1>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Salt Solubility Revision</p>
              </div>
            </div>
          </header>
          <SolubilityPlayground />
        </div>
      );
    }

    if (subMode === 'simulations') {
      return (
        <div className="min-h-screen bg-gray-50 pb-24">
          <header className="bg-white border-b-2 border-gray-200 p-4 sticky top-0 z-10">
            <div className="max-w-2xl mx-auto flex items-center gap-4">
              <button onClick={() => setSubMode('select')} className="text-gray-400 hover:text-gray-600">
                <ChevronLeft size={32} />
              </button>
              <div>
                <h1 className="text-lg font-black text-gray-800 uppercase tracking-tight leading-none">Simulation Playground</h1>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Interactive Simulations</p>
              </div>
            </div>
          </header>

          <main className="max-w-2xl mx-auto p-6">
            <SimulationPlayground />
          </main>
        </div>
      );
    }

    if (subMode === 'equations') {
      return (
        <div className="min-h-screen bg-gray-50 pb-24">
          <header className="bg-white border-b-2 border-gray-200 p-4 sticky top-0 z-10">
            <div className="max-w-2xl mx-auto flex items-center gap-4">
              <button onClick={() => {
                if (isPracticeMode) setIsPracticeMode(false);
                else if (selectedEquation) setSelectedEquation(null);
                else setSubMode('select');
              }} className="text-gray-400 hover:text-gray-600">
                <ChevronLeft size={32} />
              </button>
              <div>
                <h1 className="text-lg font-black text-gray-800 uppercase tracking-tight leading-none">Equations</h1>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  {selectedEquation ? selectedEquation.name : 'Select a formula'}
                </p>
              </div>
            </div>
          </header>

          <main className="max-w-2xl mx-auto p-6">
            {isPracticeMode ? (
              <div className="space-y-8">
                <div className="bg-white border-2 border-gray-200 p-8 rounded-3xl shadow-[0_6px_0_0_#e5e7eb]">
                  <h2 className="text-2xl font-black text-gray-800 mb-6">{practiceQuestion.text}</h2>
                  <div className="grid gap-4">
                    {practiceQuestion.options.map((option: string) => (
                      <button
                        key={option}
                        disabled={isPracticeChecked}
                        onClick={() => setPracticeAnswer(option)}
                        className={`w-full p-4 text-left rounded-2xl border-2 transition-all font-bold text-lg
                          ${practiceAnswer === option 
                            ? 'border-blue-400 bg-blue-50 text-blue-600 shadow-[0_4px_0_0_#60a5fa]' 
                            : 'border-gray-200 hover:bg-gray-50 text-gray-700 shadow-[0_4px_0_0_#e5e7eb]'
                          }
                          ${isPracticeChecked && option === practiceQuestion.correctAnswer ? 'border-emerald-400 bg-emerald-50 text-emerald-600 shadow-[0_4px_0_0_#34d399]' : ''}
                          ${isPracticeChecked && practiceAnswer === option && practiceAnswer !== practiceQuestion.correctAnswer ? 'border-red-400 bg-red-50 text-red-600 shadow-[0_4px_0_0_#f87171]' : ''}
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option} {practiceQuestion.unit}</span>
                          {isPracticeChecked && option === practiceQuestion.correctAnswer && <CheckCircle2 size={24} />}
                          {isPracticeChecked && practiceAnswer === option && practiceAnswer !== practiceQuestion.correctAnswer && <XCircle size={24} />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (isPracticeChecked) generatePracticeQuestion(selectedEquation);
                    else setIsPracticeChecked(true);
                  }}
                  disabled={!practiceAnswer}
                  className={`w-full py-4 rounded-2xl font-black text-xl uppercase tracking-widest transition-all
                    ${!practiceAnswer ? 'bg-gray-200 text-gray-400' : 'bg-emerald-500 text-white shadow-[0_6px_0_0_#059669] active:shadow-none active:translate-y-1'}
                  `}
                >
                  {isPracticeChecked ? 'Next Question' : 'Check Answer'}
                </button>
              </div>
            ) : selectedEquation ? (
              <div className="space-y-8">
                <div className="bg-white border-2 border-gray-200 p-12 rounded-3xl shadow-[0_8px_0_0_#e5e7eb] text-center">
                  <span className="text-gray-400 text-xs font-black uppercase tracking-[0.2em] block mb-4">Rearrange the formula</span>
                  <div className="text-5xl font-black text-gray-800 mb-8 flex items-center justify-center gap-4 flex-wrap">
                    {equationRearrangements[selectedEquation.id][equationSubject || selectedEquation.variables[0].symbol].split(' ').map((part, i) => (
                      <span key={i} className={selectedEquation.variables.some((v: any) => v.symbol === part) ? 'text-blue-500' : ''}>
                        {part}
                      </span>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {selectedEquation.variables.map((v: any) => (
                      <button
                        key={v.symbol}
                        onClick={() => setEquationSubject(v.symbol)}
                        className={`p-4 rounded-2xl border-2 font-black text-xl transition-all
                          ${(equationSubject || selectedEquation.variables[0].symbol) === v.symbol 
                            ? 'bg-blue-500 text-white border-blue-600 shadow-[0_4px_0_0_#1e40af]' 
                            : 'bg-white text-gray-400 border-gray-200 hover:border-blue-300 shadow-[0_4px_0_0_#e5e7eb]'
                          }
                        `}
                      >
                        {v.symbol}
                      </button>
                    ))}
                  </div>
                  <p className="mt-8 text-gray-400 font-bold text-sm uppercase tracking-widest">Click a variable to make it the subject</p>
                </div>

                <div className="grid gap-4">
                  {selectedEquation.variables.map((v: any) => (
                    <div key={v.symbol} className="bg-white border-2 border-gray-200 p-4 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-xl flex items-center justify-center font-black">
                          {v.symbol}
                        </div>
                        <div>
                          <p className="font-black text-gray-800 uppercase text-sm">{v.name}</p>
                          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Unit: {v.unit || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setIsPracticeMode(true);
                    generatePracticeQuestion(selectedEquation);
                  }}
                  className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-black text-xl uppercase tracking-widest shadow-[0_6px_0_0_#059669] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-3"
                >
                  <Zap size={24} />
                  Practice Mode
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {equations.map((eq) => (
                  <motion.button
                    key={eq.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedEquation(eq);
                      setEquationSubject(eq.variables[0].symbol);
                    }}
                    className="w-full bg-white border-2 border-gray-200 p-6 rounded-3xl flex items-center justify-between shadow-[0_4px_0_0_#e5e7eb] hover:border-blue-400 transition-all"
                  >
                    <div className="text-left">
                      <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">{eq.name}</h3>
                      <p className="text-blue-500 font-black text-lg">{eq.formula}</p>
                    </div>
                    <div className="bg-gray-100 text-gray-400 p-2 rounded-xl">
                      <ArrowRight size={24} />
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </main>
        </div>
      );
    }

    if (subMode === 'chemicals') {
      return (
        <div className="min-h-screen bg-gray-50 pb-24">
          <header className="bg-white border-b-2 border-gray-200 p-4 sticky top-0 z-10">
            <div className="max-w-2xl mx-auto flex items-center gap-4">
              <button onClick={() => {
                if (selectedChemical) setSelectedChemical(null);
                else setSubMode('select');
              }} className="text-gray-400 hover:text-gray-600">
                <ChevronLeft size={32} />
              </button>
              <div className="flex-1">
                <h1 className="text-lg font-black text-gray-800 uppercase tracking-tight leading-none">Chemicals</h1>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  {selectedChemical ? selectedChemical.name : 'Explore common compounds'}
                </p>
              </div>
            </div>
          </header>

          <main className="max-w-2xl mx-auto p-6">
            {selectedChemical ? (
              <div className="space-y-8">
                <div className="bg-white border-2 border-gray-200 p-8 rounded-3xl shadow-[0_6px_0_0_#e5e7eb]">
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <h2 className="text-4xl font-black text-gray-800 uppercase tracking-tight">{selectedChemical.name}</h2>
                      <p className="text-emerald-500 font-black text-2xl">{selectedChemical.formula}</p>
                    </div>
                    <div className={`${selectedChemical.color} text-white p-6 rounded-3xl shadow-xl`}>
                      {selectedChemical.icon}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Composition</h3>
                      <div className="flex flex-wrap gap-4">
                        {selectedChemical.composition.map((comp: any, i: number) => (
                          <div key={i} className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border-2 border-gray-100">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black border-2 ${comp.color}`}>
                              {comp.type}
                            </div>
                            <div>
                              <p className="font-black text-gray-800 text-xl">× {comp.count}</p>
                              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Atoms</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="pt-4">
                        <p className="text-gray-600 font-medium leading-relaxed">
                          {selectedChemical.details}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Lewis Structure</h3>
                      <div className="bg-gray-900 p-6 rounded-2xl border-2 border-gray-800 flex items-center justify-center min-h-[120px]">
                        <pre className="text-emerald-400 font-mono text-xl leading-tight whitespace-pre">
                          {selectedChemical.lewis}
                        </pre>
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">
                        Visual representation of valence electrons
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Molecular View</h3>
                      <MolecularAnimation 
                        state={selectedChemical.state} 
                        formula={selectedChemical.formula} 
                        color={selectedChemical.color} 
                      />
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">
                        {selectedChemical.state === 'gas' 
                          ? 'Molecules move rapidly and are far apart' 
                          : 'Molecules slide past each other and are close together'}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedChemical(null)}
                  className="w-full bg-gray-200 text-gray-500 py-4 rounded-2xl font-black text-xl uppercase tracking-widest hover:bg-gray-300 transition-all"
                >
                  Back to List
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {chemicals.map((chem, idx) => (
                  <motion.div
                    key={chem.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => setSelectedChemical(chem)}
                    className={`cursor-pointer bg-white border-2 border-gray-200 rounded-3xl p-6 shadow-[0_6px_0_0_#e5e7eb] transition-all relative overflow-hidden group hover:border-emerald-400`}
                  >
                    <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 transition-transform group-hover:scale-150 ${chem.color}`} />
                    
                    <div className="relative z-10">
                      <div className={`${chem.color} text-white p-4 rounded-2xl w-fit mb-4 shadow-lg`}>
                        {chem.icon}
                      </div>
                      <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tight leading-none mb-1">{chem.name}</h3>
                      <p className="text-emerald-500 font-black text-xl">{chem.formula}</p>
                      <p className="text-gray-300 text-[10px] font-black uppercase tracking-widest mt-4">Tap to explore</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </main>
        </div>
      );
    }

    if (subMode === 'graphs') {
      return (
        <div className="min-h-screen bg-gray-50 pb-24">
          <header className="bg-white border-b-2 border-gray-200 p-4 sticky top-0 z-10">
            <div className="max-w-2xl mx-auto flex items-center gap-4">
              <button onClick={() => {
                if (selectedGraph) setSelectedGraph(null);
                else setSubMode('select');
              }} className="text-gray-400 hover:text-gray-600">
                <ChevronLeft size={32} />
              </button>
              <div>
                <h1 className="text-lg font-black text-gray-800 uppercase tracking-tight leading-none">Graph Playground</h1>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  {selectedGraph ? 'Speed: Distance-time' : 'Experiment with parameters'}
                </p>
              </div>
            </div>
          </header>

          <main className="max-w-2xl mx-auto p-6">
            <GraphPlayground />
          </main>
        </div>
      );
    }

    return null;
  };

  const UserDashboardView = () => {
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        <header className="bg-white border-b-2 border-gray-200 p-6 sticky top-0 z-10">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tight">Dashboard</h1>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-1">Session Statistics</p>
          </div>
        </header>

        <main className="max-w-2xl mx-auto p-4 space-y-6 mt-4">
          <div className="flex bg-gray-200 p-1 rounded-2xl">
            <button
              onClick={() => setActiveCategory('structure')}
              className={`flex-1 py-3 rounded-xl font-black uppercase tracking-widest transition-all ${activeCategory === 'structure' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Structure
            </button>
            <button
              onClick={() => setActiveCategory('reactivity')}
              className={`flex-1 py-3 rounded-xl font-black uppercase tracking-widest transition-all ${activeCategory === 'reactivity' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Reactivity
            </button>
          </div>

          {units.filter(u => u.category === activeCategory).map((unit) => {
            const stats = sessionStats[unit.id] || { attemptedQuestions: [], masteredVocab: [] };
            const attemptedCount = stats.attemptedQuestions.length;
            const totalQuestions = unit.questions.length;
            const notAttemptedCount = totalQuestions - attemptedCount;
            const masteredCount = stats.masteredVocab.length;
            const totalVocab = unit.vocab.length;
            const totalNotes = unit.concepts.length;

            return (
              <motion.div
                key={unit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border-2 border-gray-200 rounded-3xl overflow-hidden shadow-[0_4px_0_0_rgba(0,0,0,0.05)]"
              >
                <div className={`${unit.color} p-4 text-white flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                      <BookOpen size={20} />
                    </div>
                    <h3 className="font-black tracking-wide">{unit.title}</h3>
                  </div>
                  <span className="text-xs font-black bg-black/10 px-3 py-1 rounded-full uppercase tracking-widest">Unit {unit.id}</span>
                </div>

                <div className="p-6 grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 border-2 border-blue-100 rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-blue-500 mb-1">
                      <CheckCircle2 size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Quiz Attempted</span>
                    </div>
                    <p className="text-2xl font-black text-blue-700">{attemptedCount}</p>
                    <p className="text-[10px] text-blue-400 font-bold uppercase">Questions</p>
                  </div>

                  <div className="bg-orange-50 border-2 border-orange-100 rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-orange-500 mb-1">
                      <XCircle size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Not Attempted</span>
                    </div>
                    <p className="text-2xl font-black text-orange-700">{notAttemptedCount}</p>
                    <p className="text-[10px] text-orange-400 font-bold uppercase">Questions</p>
                  </div>

                  <div className="bg-emerald-50 border-2 border-emerald-100 rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-emerald-500 mb-1">
                      <GraduationCap size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Vocab Mastered</span>
                    </div>
                    <p className="text-2xl font-black text-emerald-700">{masteredCount} / {totalVocab}</p>
                    <p className="text-[10px] text-emerald-400 font-bold uppercase">Items</p>
                  </div>

                  <div className="bg-purple-50 border-2 border-purple-100 rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-purple-500 mb-1">
                      <Languages size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Total Notes</span>
                    </div>
                    <p className="text-2xl font-black text-purple-700">{totalNotes}</p>
                    <p className="text-[10px] text-purple-400 font-bold uppercase">Concepts</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </main>
      </div>
    );
  };

  const AboutView = () => {
    const revisionNumber = "1.7.0";
    
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        <header className="bg-white border-b-2 border-gray-200 p-6 sticky top-0 z-10">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tight">About</h1>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-1">App Information</p>
          </div>
        </header>

        <main className="max-w-2xl mx-auto p-4 space-y-6 mt-4">
          {/* Creator Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border-2 border-gray-200 rounded-3xl overflow-hidden shadow-[0_4px_0_0_rgba(0,0,0,0.05)]"
          >
            <div className="bg-emerald-500 p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                  <GraduationCap size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tight">Creator</h3>
                  <p className="text-emerald-100 font-bold text-sm uppercase tracking-widest opacity-90">Mr. LAM</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="relative pl-6 border-l-2 border-emerald-100 space-y-1">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow-sm" />
                <p className="text-gray-800 font-black text-sm uppercase tracking-tight">
                  Bachelor of Science
                </p>
                <p className="text-gray-500 font-bold text-xs uppercase tracking-wider">
                  Biochemistry major, Psychology Minor
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest">
                    University of Hong Kong
                  </span>
                  <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest">
                    2013
                  </span>
                </div>
              </div>

              <div className="relative pl-6 border-l-2 border-emerald-100 space-y-1">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow-sm" />
                <p className="text-gray-800 font-black text-sm uppercase tracking-tight">
                  Post Graduate Certificate in Education
                </p>
                <p className="text-gray-500 font-bold text-xs uppercase tracking-wider">
                  Secondary Education
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest">
                    University of Sunderland
                  </span>
                  <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest">
                    2025
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* GitHub Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border-2 border-gray-200 rounded-3xl p-6 shadow-[0_4px_0_0_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-gray-100 p-3 rounded-2xl text-gray-800">
                <Github size={24} />
              </div>
              <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">Repository</h3>
            </div>
            <a 
              href="https://github.com/Tomanlam/Y13IB" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between bg-gray-900 text-white p-4 rounded-2xl hover:bg-gray-800 transition-colors group"
            >
              <span className="font-bold text-sm truncate mr-2">github.com/Tomanlam/Y13IB</span>
              <ExternalLink size={18} className="flex-shrink-0 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          </motion.div>

          {/* Tech Stack Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white border-2 border-gray-200 rounded-3xl p-6 shadow-[0_4px_0_0_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-orange-100 p-3 rounded-2xl text-orange-600">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">Tech Stack</h3>
            </div>
            <div className="bg-orange-50 border-2 border-orange-100 p-4 rounded-2xl text-center">
              <p className="text-xl font-black text-orange-700">Powered by React + Vite</p>
              <p className="text-orange-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">Modern Web Technologies</p>
            </div>
          </motion.div>

          {/* Revision Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border-2 border-gray-200 rounded-3xl p-6 shadow-[0_4px_0_0_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-100 p-3 rounded-2xl text-blue-600">
                <RefreshCw size={24} />
              </div>
              <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">Version</h3>
            </div>
            <div className="bg-blue-50 border-2 border-blue-100 p-4 rounded-2xl text-center">
              <p className="text-3xl font-black text-blue-700">v{revisionNumber}</p>
              <p className="text-blue-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">Revision Number</p>
            </div>
          </motion.div>
        </main>
      </div>
    );
  };

  return (
    <div className="font-sans selection:bg-emerald-200">
      <AnimatePresence mode="wait">
        {mode === 'splash' && <SplashScreen key="splash" />}
        {mode === 'dashboard' && <Dashboard key="dashboard" />}
        {mode === 'facts' && <QuickFacts key="facts" />}
        {mode === 'quiz-select' && <QuizSelectView key="quiz-select" />}
        {mode === 'quiz' && <QuizView key="quiz" />}
        {mode === 'result' && <ResultView key="result" />}
        {mode === 'revision' && <RevisionView key="revision" />}
        {mode === 'vocab' && <VocabView key="vocab" />}
        {mode === 'user-stats' && <UserDashboardView key="user-stats" />}
        {mode === 'about' && <AboutView key="about" />}
        {mode === 'playground' && <PlaygroundView key="playground" />}
      </AnimatePresence>

      {/* Bottom Nav for Dashboard, User Stats, and About */}
      {['dashboard', 'facts', 'playground', 'user-stats', 'about'].includes(mode) && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 p-4 z-20">
          <div className="max-w-2xl mx-auto flex justify-around items-center">
            <button 
              onClick={() => setMode('dashboard')}
              className={`flex flex-col items-center gap-1 transition-colors ${mode === 'dashboard' ? 'text-emerald-500' : 'text-gray-400 hover:text-emerald-400'}`}
            >
              <Home size={28} fill={mode === 'dashboard' ? "currentColor" : "none"} />
              <span className="text-[10px] font-black uppercase">Home</span>
            </button>
            <button 
              onClick={() => setMode('facts')}
              className={`flex flex-col items-center gap-1 transition-colors ${mode === 'facts' ? 'text-emerald-500' : 'text-gray-400 hover:text-emerald-400'}`}
            >
              <BookOpen size={28} fill={mode === 'facts' ? "currentColor" : "none"} />
              <span className="text-[10px] font-black uppercase">Quick Facts</span>
            </button>
            <button 
              onClick={() => setMode('playground')}
              className={`flex flex-col items-center gap-1 transition-colors ${mode === 'playground' ? 'text-emerald-500' : 'text-gray-400 hover:text-emerald-400'}`}
            >
              <FlaskConical size={28} fill={mode === 'playground' ? "currentColor" : "none"} />
              <span className="text-[10px] font-black uppercase">Playground</span>
            </button>
            <button 
              onClick={() => setMode('user-stats')}
              className={`flex flex-col items-center gap-1 transition-colors ${mode === 'user-stats' ? 'text-emerald-500' : 'text-gray-400 hover:text-emerald-400'}`}
            >
              <Trophy size={28} fill={mode === 'user-stats' ? "currentColor" : "none"} />
              <span className="text-[10px] font-black uppercase">Dashboard</span>
            </button>
            <button 
              onClick={() => setMode('about')}
              className={`flex flex-col items-center gap-1 transition-colors ${mode === 'about' ? 'text-emerald-500' : 'text-gray-400 hover:text-emerald-400'}`}
            >
              <Info size={28} fill={mode === 'about' ? "currentColor" : "none"} />
              <span className="text-[10px] font-black uppercase">About</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}

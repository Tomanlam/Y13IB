export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
}

export interface Vocab {
  term: string;
  definition: string;
  traditional: string;
  simplified: string;
}

export interface Unit {
  id: number;
  title: string;
  description: string;
  color: string;
  category: 'structure' | 'reactivity';
  concepts: string[];
  vocab: Vocab[];
  questions: Question[];
}

export const units: Unit[] = [
  {
    id: 1,
    title: "Structure 1.1 — Introduction to the particulate nature of matter",
    description: "Understanding the basic building blocks of matter.",
    color: "bg-emerald-500",
    category: 'structure',
    concepts: ["Matter is composed of particles."],
    vocab: [],
    questions: []
  },
  {
    id: 2,
    title: "Structure 1.2 — The nuclear atom",
    description: "Exploring the structure of the atom's nucleus.",
    color: "bg-blue-500",
    category: 'structure',
    concepts: ["Protons, neutrons, and electrons."],
    vocab: [],
    questions: []
  },
  {
    id: 3,
    title: "Structure 1.3 — Electron configurations",
    description: "How electrons are arranged in atoms.",
    color: "bg-indigo-500",
    category: 'structure',
    concepts: ["Shells, subshells, and orbitals."],
    vocab: [],
    questions: []
  },
  {
    id: 4,
    title: "Structure 1.4 — Counting particles by mass: the mole",
    description: "The fundamental unit for measuring amount of substance.",
    color: "bg-purple-500",
    category: 'structure',
    concepts: ["Avogadro's constant and molar mass."],
    vocab: [],
    questions: []
  },
  {
    id: 5,
    title: "Structure 1.5 — Ideal gases",
    description: "Behavior of gases under different conditions.",
    color: "bg-cyan-500",
    category: 'structure',
    concepts: ["Gas laws and the ideal gas equation."],
    vocab: [],
    questions: []
  },
  {
    id: 6,
    title: "Structure 2.1 — The ionic model",
    description: "Bonding between metals and non-metals.",
    color: "bg-teal-500",
    category: 'structure',
    concepts: ["Electrostatic attraction and lattice structures."],
    vocab: [],
    questions: []
  },
  {
    id: 7,
    title: "Structure 2.2 — The covalent model",
    description: "Sharing of electrons between non-metals.",
    color: "bg-sky-500",
    category: 'structure',
    concepts: ["Lewis structures and molecular geometry."],
    vocab: [],
    questions: []
  },
  {
    id: 8,
    title: "Structure 2.3 — The metallic model",
    description: "Bonding in metals.",
    color: "bg-slate-500",
    category: 'structure',
    concepts: ["Sea of delocalized electrons."],
    vocab: [],
    questions: []
  },
  {
    id: 9,
    title: "Structure 2.4 — From models to materials",
    description: "How bonding models explain material properties.",
    color: "bg-gray-500",
    category: 'structure',
    concepts: ["Physical properties and bonding types."],
    vocab: [],
    questions: []
  },
  {
    id: 10,
    title: "Structure 3.1 — The periodic table: classification of elements",
    description: "Trends and patterns in the periodic table.",
    color: "bg-rose-500",
    category: 'structure',
    concepts: ["Groups, periods, and periodic trends."],
    vocab: [],
    questions: []
  },
  {
    id: 11,
    title: "Structure 3.2 — Functional groups: classification of organic compounds",
    description: "Identifying organic molecules by their functional groups.",
    color: "bg-orange-500",
    category: 'structure',
    concepts: ["Alkanes, alkenes, alcohols, etc."],
    vocab: [],
    questions: []
  },
  {
    id: 12,
    title: "Reactivity 1.1 — Measuring enthalpy changes",
    description: "Quantifying heat energy in chemical reactions.",
    color: "bg-red-500",
    category: 'reactivity',
    concepts: ["Calorimetry and enthalpy."],
    vocab: [],
    questions: []
  },
  {
    id: 13,
    title: "Reactivity 1.2 — Energy cycles in reactions",
    description: "Using Hess's Law and energy cycles.",
    color: "bg-orange-600",
    category: 'reactivity',
    concepts: ["Hess's Law and bond enthalpies."],
    vocab: [],
    questions: []
  },
  {
    id: 14,
    title: "Reactivity 1.3 — Energy from fuels",
    description: "Combustion and energy production.",
    color: "bg-yellow-600",
    category: 'reactivity',
    concepts: ["Fuel efficiency and combustion."],
    vocab: [],
    questions: []
  },
  {
    id: 15,
    title: "Reactivity 1.4 — Entropy and spontaneity (additional higher level)",
    description: "Predicting if a reaction will occur spontaneously.",
    color: "bg-lime-600",
    category: 'reactivity',
    concepts: ["Entropy and Gibbs free energy."],
    vocab: [],
    questions: []
  },
  {
    id: 16,
    title: "Reactivity 2.1 — How much? the amount of chemical change",
    description: "Stoichiometry and yield calculations.",
    color: "bg-emerald-600",
    category: 'reactivity',
    concepts: ["Limiting reactants and percentage yield."],
    vocab: [],
    questions: []
  },
  {
    id: 17,
    title: "Reactivity 2.2 — How fast? the rate of chemical change",
    description: "Factors affecting reaction speed.",
    color: "bg-teal-600",
    category: 'reactivity',
    concepts: ["Collision theory and activation energy."],
    vocab: [],
    questions: []
  },
  {
    id: 18,
    title: "Reactivity 2.3 — How far? the extent of chemical change",
    description: "Chemical equilibrium and its position.",
    color: "bg-cyan-600",
    category: 'reactivity',
    concepts: ["Equilibrium constant and Le Chatelier's principle."],
    vocab: [],
    questions: []
  },
  {
    id: 19,
    title: "Reactivity 3.1 — Proton transfer reactions",
    description: "Acids and bases in chemical reactions.",
    color: "bg-blue-600",
    category: 'reactivity',
    concepts: ["Bronsted-Lowry theory and pH."],
    vocab: [],
    questions: []
  },
  {
    id: 20,
    title: "Reactivity 3.2 — Electron transfer reactions",
    description: "Oxidation and reduction processes.",
    color: "bg-indigo-600",
    category: 'reactivity',
    concepts: ["Redox reactions and oxidation states."],
    vocab: [],
    questions: []
  },
  {
    id: 21,
    title: "Reactivity 3.3 — Electron sharing reactions",
    description: "Covalent bonding and reactivity.",
    color: "bg-violet-600",
    category: 'reactivity',
    concepts: ["Covalent bond formation and properties."],
    vocab: [],
    questions: []
  },
  {
    id: 22,
    title: "Reactivity 3.4 — Electron-pair sharing reactions",
    description: "Lewis acids and bases.",
    color: "bg-purple-600",
    category: 'reactivity',
    concepts: ["Coordinate covalent bonds."],
    vocab: [],
    questions: []
  }
];

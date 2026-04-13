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
    title: "S1.1 — Introduction to the particulate nature of matter",
    description: "Understanding the basic building blocks of matter.",
    color: "bg-emerald-500",
    category: 'structure',
    concepts: [
      "Element: a substance made from one kind of atom.",
      "Compound: made from two or more elements chemically combined in fixed ratios.",
      "In chemical reactions, atoms rearrange and often involve an energy change.",
      "Compounds can have very different properties from the elements that form them.",
      "Mixture: substances are interspersed but not chemically combined, so components retain their properties.",
      "Homogeneous mixture: uniform composition and properties throughout.",
      "Heterogeneous mixture: non-uniform composition; properties vary through the sample.",
      "Separation of mixtures uses differences in physical properties (e.g. boiling point, solubility, magnetism, adsorption).",
      "Solids: particles closely packed, vibrate about fixed positions, fixed shape and volume, high density.",
      "Liquids: particles close but can move/slide, fixed volume but take container shape.",
      "Gases: particles far apart, random rapid motion, compressible, fill container, low density.",
      "Changes of state are physical and usually reversible.",
      "Vaporisation includes evaporation (surface, below boiling point) and boiling (throughout liquid at boiling point).",
      "Boiling occurs when vapour pressure equals external pressure.",
      "During state changes, temperature stays constant while energy is used to overcome intermolecular attractions.",
      "Average kinetic energy is proportional to absolute temperature (K).",
      "Kelvin conversion: T/K = θ/°C + 273 and θ/°C = T/K - 273.",
      "At the same temperature, particles have the same average kinetic energy, but not the same speed."
    ],
    vocab: [
      { term: "Element", traditional: "元素", simplified: "元素", definition: "One type of atom" },
      { term: "Compound", traditional: "化合物", simplified: "化合物", definition: "Chemically combined; fixed ratio" },
      { term: "Mixture", traditional: "混合物", simplified: "混合物", definition: "Not chemically combined; retain properties" },
      { term: "Homogeneous", traditional: "均質", simplified: "均质", definition: "Uniform throughout" },
      { term: "Heterogeneous", traditional: "非均質", simplified: "非均质", definition: "Non-uniform throughout" },
      { term: "Physical property", traditional: "物理性質", simplified: "物理性质", definition: "Used for separation (bp, solubility, magnetism, adsorption)" },
      { term: "Filtration", traditional: "過濾", simplified: "过滤", definition: "Separates insoluble solid from liquid (residue/filtrate)" },
      { term: "Centrifugation", traditional: "離心分離", simplified: "离心分离", definition: "Separates suspended solids from liquid by spinning" },
      { term: "Crystallisation", traditional: "結晶", simplified: "结晶", definition: "Recovers dissolved solid when solubility decreases" },
      { term: "Recrystallisation", traditional: "重結晶", simplified: "重结晶", definition: "Purifies an impure solid using hot solvent then cooling" },
      { term: "Simple distillation", traditional: "簡單蒸餾", simplified: "简单蒸馏", definition: "Separates solvent from solution" },
      { term: "Fractional distillation", traditional: "分餾", simplified: "分馏", definition: "Separates miscible liquids with different boiling points" },
      { term: "Chromatography", traditional: "層析法", simplified: "层析法", definition: "Separates based on different solubilities/attractions" },
      { term: "Kinetic molecular theory", traditional: "分子動力論", simplified: "分子动力论", definition: "Particle model explaining states; motion relates to temperature" },
      { term: "Evaporation", traditional: "蒸發", simplified: "蒸发", definition: "Liquid -> gas at surface below boiling point" },
      { term: "Boiling", traditional: "沸騰", simplified: "沸腾", definition: "Liquid -> gas throughout at boiling point" },
      { term: "Vapour pressure", traditional: "蒸氣壓", simplified: "蒸气压", definition: "Pressure of vapour above liquid" },
      { term: "Absolute zero", traditional: "絕對零度", simplified: "绝对零度", definition: "0 K = -273.15 °C" },
      { term: "Average kinetic energy", traditional: "平均動能", simplified: "平均动能", definition: "Depends on temperature in kelvin" }
    ],
    questions: [
      { id: "1.1-1", text: "Which statement best defines an element?", options: ["A substance made from one kind of atom", "A substance made from two or more elements physically mixed", "A substance made from ions only", "A substance that can be separated by filtration"], correctAnswer: "A substance made from one kind of atom" },
      { id: "1.1-2", text: "Which statement best defines a compound?", options: ["Two or more elements mixed together in any proportion", "Two or more elements chemically combined in fixed ratios", "A substance that always forms crystals", "A homogeneous mixture"], correctAnswer: "Two or more elements chemically combined in fixed ratios" },
      { id: "1.1-3", text: "Which is true about mixtures?", options: ["Components are chemically bonded", "Components form in fixed ratios", "Components retain their characteristic properties", "Mixtures cannot be separated by physical methods"], correctAnswer: "Components retain their characteristic properties" },
      { id: "1.1-4", text: "Air is best described as:", options: ["A heterogeneous mixture", "A homogeneous mixture", "A pure compound", "A pure element"], correctAnswer: "A homogeneous mixture" },
      { id: "1.1-5", text: "Concrete is best described as:", options: ["A homogeneous mixture", "A heterogeneous mixture", "A pure element", "A pure compound"], correctAnswer: "A heterogeneous mixture" },
      { id: "1.1-6", text: "In a homogeneous mixture:", options: ["Composition varies from place to place", "Components are visible as separate layers", "Composition and properties are uniform throughout", "Components are chemically combined"], correctAnswer: "Composition and properties are uniform throughout" },
      { id: "1.1-7", text: "Which separation technique relies primarily on differences in boiling point?", options: ["Filtration", "Distillation", "Magnetism", "Decanting"], correctAnswer: "Distillation" },
      { id: "1.1-8", text: "Which separation technique is suitable for separating salt and sand?", options: ["Filtration after dissolving salt in water", "Chromatography", "Using a magnet", "Fractional distillation"], correctAnswer: "Filtration after dissolving salt in water" },
      { id: "1.1-9", text: "Which property difference allows separation of an iron–sulfur mixture using a magnet?", options: ["Boiling point", "Solubility", "Magnetism", "Density"], correctAnswer: "Magnetism" },
      { id: "1.1-10", text: "Paper chromatography separates substances mainly because they have different:", options: ["Melting points", "Solubilities in the solvent (and attraction to the paper)", "Densities", "Molecular masses only"], correctAnswer: "Solubilities in the solvent (and attraction to the paper)" },
      { id: "1.1-11", text: "Why is a pencil line used in paper chromatography?", options: ["Pencil contains pigments that separate well", "Pencil marks are insoluble and do not run with the solvent", "Pencil improves capillary action", "Pencil makes the solvent evaporate faster"], correctAnswer: "Pencil marks are insoluble and do not run with the solvent" },
      { id: "1.1-12", text: "In filtration, the solid left on the filter paper is called the:", options: ["Filtrate", "Residue", "Distillate", "Condensate"], correctAnswer: "Residue" },
      { id: "1.1-13", text: "In filtration, the liquid that passes through the filter paper is called the:", options: ["Filtrate", "Residue", "Sublimate", "Precipitate"], correctAnswer: "Filtrate" },
      { id: "1.1-14", text: "Vacuum filtration is especially useful when:", options: ["The solid is very soluble", "The solid particles are very fine and clog gravity filtration", "The mixture contains two miscible liquids", "The solvent is flammable"], correctAnswer: "The solid particles are very fine and clog gravity filtration" },
      { id: "1.1-15", text: "Crystallisation is used to:", options: ["Separate an insoluble solid from a liquid", "Purify a liquid mixture of close boiling points", "Obtain a dissolved solid from a solution by forming crystals", "Separate magnetic from non-magnetic substances"], correctAnswer: "Obtain a dissolved solid from a solution by forming crystals" },
      { id: "1.1-16", text: "Recrystallisation is primarily used to:", options: ["Purify an impure solid", "Separate two miscible liquids", "Separate a solid mixture by particle size", "Increase boiling point"], correctAnswer: "Purify an impure solid" },
      { id: "1.1-17", text: "A key idea in recrystallisation is to use:", options: ["The maximum volume of solvent", "The minimum amount of hot solvent needed to dissolve the solid", "Only cold solvent", "No filtration at all"], correctAnswer: "The minimum amount of hot solvent needed to dissolve the solid" },
      { id: "1.1-18", text: "Simple distillation is best for separating:", options: ["Two miscible liquids with similar boiling points", "A solvent from a solution containing a dissolved solid", "Two immiscible liquids", "A suspension using filter paper"], correctAnswer: "A solvent from a solution containing a dissolved solid" },
      { id: "1.1-19", text: "Fractional distillation is best for separating:", options: ["Insoluble solids from liquids", "Miscible liquids with different boiling points", "Magnetic mixtures", "Coloured pigments in ink"], correctAnswer: "Miscible liquids with different boiling points" },
      { id: "1.1-20", text: "In fractional distillation of ethanol and water, ethanol is collected first because it has:", options: ["A higher melting point", "A lower boiling point", "A higher density", "Stronger hydrogen bonds than water"], correctAnswer: "A lower boiling point" },
      { id: "1.1-21", text: "In the kinetic molecular theory, particles in a solid:", options: ["Move randomly and rapidly throughout the container", "Vibrate about fixed positions", "Are very far apart and compress easily", "Have no attractive forces"], correctAnswer: "Vibrate about fixed positions" },
      { id: "1.1-22", text: "Which state has the most compressible volume?", options: ["Solid", "Liquid", "Gas", "Solid and liquid equally"], correctAnswer: "Gas" },
      { id: "1.1-23", text: "Gases can be compressed mainly because:", options: ["Gas particles are very large", "There is lots of empty space between gas particles", "Gas particles are attracted strongly", "Gas particles are arranged in a regular lattice"], correctAnswer: "There is lots of empty space between gas particles" },
      { id: "1.1-24", text: "Which is true of liquids?", options: ["Fixed shape and fixed volume", "Fixed volume but take the shape of the container", "Fill the whole container and are highly compressible", "Have particles arranged in a regular pattern"], correctAnswer: "Fixed volume but take the shape of the container" },
      { id: "1.1-25", text: "Which statement about changes of state is correct?", options: ["They are chemical changes forming new substances", "They are physical changes and are usually reversible", "They always involve bond making", "They always change chemical composition"], correctAnswer: "They are physical changes and are usually reversible" },
      { id: "1.1-26", text: "Evaporation differs from boiling because evaporation:", options: ["Occurs throughout the liquid", "Occurs only at the surface and can occur below boiling point", "Occurs only above boiling point", "Requires no energy input"], correctAnswer: "Occurs only at the surface and can occur below boiling point" },
      { id: "1.1-27", text: "Boiling occurs when:", options: ["The liquid reaches 0 °C", "The vapour pressure equals the external pressure", "The liquid becomes a solid", "The particles stop moving"], correctAnswer: "The vapour pressure equals the external pressure" },
      { id: "1.1-28", text: "During melting, the temperature of a pure substance typically:", options: ["Increases continuously", "Decreases continuously", "Stays constant while energy is absorbed", "Becomes negative"], correctAnswer: "Stays constant while energy is absorbed" },
      { id: "1.1-29", text: "During a phase change at constant temperature, added energy is mainly used to:", options: ["Increase average kinetic energy", "Overcome attractive forces between particles", "Increase nuclear binding energy", "Create new atoms"], correctAnswer: "Overcome attractive forces between particles" },
      { id: "1.1-30", text: "As temperature increases (in kelvin), the average kinetic energy of particles:", options: ["Decreases", "Increases", "Stays the same", "Becomes zero"], correctAnswer: "Increases" },
      { id: "1.1-31", text: "The SI unit of temperature is:", options: ["°C", "°F", "K", "J"], correctAnswer: "K" },
      { id: "1.1-32", text: "Convert 25 °C to kelvin (using +273).", options: ["248 K", "298 K", "302 K", "325 K"], correctAnswer: "298 K" },
      { id: "1.1-33", text: "Convert 300 K to °C (using −273).", options: ["27 °C", "73 °C", "300 °C", "−27 °C"], correctAnswer: "27 °C" },
      { id: "1.1-34", text: "Absolute zero is approximately:", options: ["0 °C", "−100 °C", "-273 °C", "273 °C"], correctAnswer: "-273 °C" },
      { id: "1.1-35", text: "Two samples at the same temperature have the same:", options: ["Speed for every particle", "Average kinetic energy of particles", "Mass of every particle", "Density of every substance"], correctAnswer: "Average kinetic energy of particles" },
      { id: "1.1-36", text: "At a given temperature, some particles move faster than others because:", options: ["Kinetic energies are all identical", "There is a distribution of particle speeds", "All particles have the same mass", "Temperature measures the fastest particle only"], correctAnswer: "There is a distribution of particle speeds" },
      { id: "1.1-37", text: "Different gases at the same temperature diffuse at different speeds mainly because they have different:", options: ["Colours", "Masses", "Boiling points", "Melting points"], correctAnswer: "Masses" },
      { id: "1.1-38", text: "Which expression relates kinetic energy to mass and speed (as used in the notes)?", options: ["E = mv", "E = mv^2", "E = 1/2mv^2", "E = 1/2m^2v"], correctAnswer: "E = 1/2mv^2" },
      { id: "1.1-39", text: "Which statement about compounds is correct?", options: ["They can be separated into elements by physical methods only", "They have properties identical to their elements", "They form when atoms combine in fixed ratios", "They are always heterogeneous"], correctAnswer: "They form when atoms combine in fixed ratios" },
      { id: "1.1-40", text: "Which best describes a mixture at the molecular level?", options: ["Atoms are bonded into a repeating lattice of one type", "Different particles are present together without chemical bonding", "Only ions are present", "Particles are always in fixed ratios"], correctAnswer: "Different particles are present together without chemical bonding" },
      { id: "1.1-41", text: "Bronze is best described as:", options: ["A heterogeneous mixture", "A homogeneous mixture (alloy)", "A pure compound", "A pure element"], correctAnswer: "A homogeneous mixture (alloy)" },
      { id: "1.1-42", text: "Orange juice with pulp is best described as:", options: ["Homogeneous", "Heterogeneous", "A pure substance", "An element"], correctAnswer: "Heterogeneous" },
      { id: "1.1-43", text: "The main reason separation methods work is that components in a mixture often have different:", options: ["Nuclear charges", "Physical properties", "Numbers of protons only", "Chemical formulas in fixed ratios"], correctAnswer: "Physical properties" },
      { id: "1.1-44", text: "In simple distillation, the substance collected after condensation is called the:", options: ["Residue", "Filtrate", "Distillate", "Solute"], correctAnswer: "Distillate" },
      { id: "1.1-45", text: "A fractionating column is used to:", options: ["Increase solubility", "Improve separation of liquids with similar boiling points", "Filter insoluble solids", "Stop evaporation"], correctAnswer: "Improve separation of liquids with similar boiling points" },
      { id: "1.1-46", text: "Which state has particles that move randomly and quickly in all directions?", options: ["Solid", "Liquid", "Gas", "Solid only at high temperature"], correctAnswer: "Gas" },
      { id: "1.1-47", text: "Compared with liquids, solids generally have:", options: ["Lower density", "Higher density and fixed shape", "No fixed volume", "Particles that are far apart"], correctAnswer: "Higher density and fixed shape" },
      { id: "1.1-48", text: "When a liquid is heated but not yet boiling, energy mainly causes the particles to:", options: ["Lose kinetic energy", "Gain kinetic energy and move faster", "Become chemically different", "Stop vibrating"], correctAnswer: "Gain kinetic energy and move faster" },
      { id: "1.1-49", text: "During boiling at constant temperature, energy is mainly used to:", options: ["Increase temperature", "Break intermolecular attractions so particles can separate", "Form new chemical bonds", "Turn ions into atoms"], correctAnswer: "Break intermolecular attractions so particles can separate" },
      { id: "1.1-50", text: "Which pairing of mixture and separation method is correct?", options: ["Ink pigments -> filtration", "Saltwater -> chromatography", "Air -> fractional distillation", "Iron and sulfur -> crystallisation"], correctAnswer: "Air -> fractional distillation" }
    ]
  },
  {
    id: 2,
    title: "S1.2 — The nuclear atom",
    description: "Exploring the structure of the atom's nucleus.",
    color: "bg-blue-500",
    category: 'structure',
    concepts: [
      "Subatomic particles: protons, neutrons, electrons.",
      "Relative values are used for mass and charge due to the small size of particles.",
      "Proton: relative charge +1, relative mass 1.",
      "Neutron: relative charge 0, relative mass 1.",
      "Electron: relative charge -1, relative mass negligible (about 1/1836 of a proton).",
      "Nucleus: dense, positively charged, contains protons and neutrons (nucleons).",
      "Electrons: occupy space outside the nucleus, forming a negative electron cloud.",
      "Atoms are held together by electrostatic attraction between the positive nucleus and negative electrons.",
      "Atomic number (Z) = number of protons. In a neutral atom, electrons = Z.",
      "Mass number (A) = number of protons + neutrons.",
      "Number of neutrons: n = A - Z.",
      "Ions: Protons do not change. Cations (positive) lose electrons; Anions (negative) gain electrons.",
      "Isotopes: atoms of the same element with the same number of protons but different numbers of neutrons.",
      "Isotopes have different mass numbers (A).",
      "Relative atomic mass (Ar): average mass of atoms of an element relative to 1/12 of the mass of a carbon-12 atom.",
      "Ar calculation: Ar = (total mass of 100 atoms) / 100.",
      "Mass spectrometer processes: vapourised -> ionised -> accelerated -> detected as m/e ratio.",
      "Mass spectra provide percentage abundances used to calculate Ar."
    ],
    vocab: [
      { term: "Subatomic particles", traditional: "亞原子粒子", simplified: "亚原子粒子", definition: "Proton, neutron, electron" },
      { term: "Relative charge", traditional: "相對電荷", simplified: "相对电荷", definition: "Charge compared to proton/electron values (+1, -1)" },
      { term: "Relative mass", traditional: "相對質量", simplified: "相对质量", definition: "Mass compared to proton/neutron (≈1); electron negligible" },
      { term: "Nucleus", traditional: "原子核", simplified: "原子核", definition: "Dense, positively charged; contains nucleons" },
      { term: "Nucleons", traditional: "核子", simplified: "核子", definition: "Protons + neutrons" },
      { term: "Electron cloud", traditional: "電子雲", simplified: "电子云", definition: "Region outside nucleus occupied by electrons" },
      { term: "Electrostatic attraction", traditional: "靜電引力", simplified: "静电引力", definition: "Attraction between opposite charges holding atom together" },
      { term: "Atomic number (Z)", traditional: "原子序數", simplified: "原子序数", definition: "Number of protons" },
      { term: "Mass number (A)", traditional: "質量數", simplified: "质量数", definition: "Protons + neutrons" },
      { term: "Ion", traditional: "離子", simplified: "离子", definition: "Charged particle formed by gaining/losing electrons" },
      { term: "Isotopes", traditional: "同位素", simplified: "同位素", definition: "Same Z, different neutrons, different A" },
      { term: "Relative atomic mass (Ar)", traditional: "相對原子質量", simplified: "相对原子质量", definition: "Weighted average isotopic mass relative to 1/12 of carbon-12" },
      { term: "Percentage abundance", traditional: "百分比豐度", simplified: "百分比丰度", definition: "Proportion of each isotope in a sample" },
      { term: "Mass-to-charge ratio (m/e)", traditional: "質荷比", simplified: "质荷比", definition: "Output axis in mass spectrometry" }
    ],
    questions: [
      { id: "1.2-1", text: "Which set lists the three subatomic particles found in atoms?", options: ["Protons, neutrons, molecules", "Protons, neutrons, electrons", "Electrons, ions, neutrons", "Nucleons, ions, electrons"], correctAnswer: "Protons, neutrons, electrons" },
      { id: "1.2-2", text: "What is the relative charge of a proton?", options: ["-1", "0", "+1", "+2"], correctAnswer: "+1" },
      { id: "1.2-3", text: "What is the relative charge of an electron?", options: ["-1", "0", "+1", "negligible"], correctAnswer: "-1" },
      { id: "1.2-4", text: "What is the relative charge of a neutron?", options: ["-1", "0", "+1", "+2"], correctAnswer: "0" },
      { id: "1.2-5", text: "Which statement about relative mass is correct?", options: ["Protons have relative mass 0", "Neutrons have relative mass 2", "Protons and neutrons each have relative mass about 1", "Electrons have relative mass 1"], correctAnswer: "Protons and neutrons each have relative mass about 1" },
      { id: "1.2-6", text: "Compared with a proton, the mass of an electron is approximately:", options: ["The same", "Twice as large", "1/1836 as large", "1836 times larger"], correctAnswer: "1/1836 as large" },
      { id: "1.2-7", text: "Which subatomic particles are found in the nucleus?", options: ["Protons only", "Electrons only", "Protons and neutrons", "Neutrons and electrons"], correctAnswer: "Protons and neutrons" },
      { id: "1.2-8", text: "Why is the nucleus described as dense?", options: ["It contains most of the atom’s volume", "It contains most of the atom’s mass in a very small volume", "It contains only electrons", "It contains no particles"], correctAnswer: "It contains most of the atom’s mass in a very small volume" },
      { id: "1.2-9", text: "What causes the nucleus to be positively charged?", options: ["Neutrons", "Electrons", "Protons", "Nucleons"], correctAnswer: "Protons" },
      { id: "1.2-10", text: "Electrons in an atom are found:", options: ["Inside the nucleus", "In fixed shells as solid rings only", "Outside the nucleus forming a cloud of negative charge", "Only attached to neutrons"], correctAnswer: "Outside the nucleus forming a cloud of negative charge" },
      { id: "1.2-11", text: "What holds an atom together?", options: ["Gravitational attraction between particles", "Electrostatic attraction between nucleus and electrons", "Magnetic attraction between protons and neutrons", "Covalent bonds inside the nucleus"], correctAnswer: "Electrostatic attraction between nucleus and electrons" },
      { id: "1.2-12", text: "The term “nucleons” refers to:", options: ["Protons and electrons", "Neutrons and electrons", "Protons and neutrons", "All subatomic particles"], correctAnswer: "Protons and neutrons" },
      { id: "1.2-13", text: "The atomic number (Z) is the number of:", options: ["Neutrons", "Protons", "Nucleons", "Electrons + neutrons"], correctAnswer: "Protons" },
      { id: "1.2-14", text: "In a neutral atom, the number of electrons equals:", options: ["The mass number", "The number of neutrons", "The atomic number", "Twice the atomic number"], correctAnswer: "The atomic number" },
      { id: "1.2-15", text: "The mass number (A) is the total number of:", options: ["Electrons + protons", "Protons + neutrons", "Neutrons + electrons", "Protons only"], correctAnswer: "Protons + neutrons" },
      { id: "1.2-16", text: "The number of neutrons in an atom can be found using:", options: ["n = Z - A", "n = A - Z", "n = A + Z", "n = A / Z"], correctAnswer: "n = A - Z" },
      { id: "1.2-17", text: "Lithium has atomic number 3. A neutral lithium atom has:", options: ["3 protons and 3 electrons", "3 protons and 6 electrons", "6 protons and 3 electrons", "3 neutrons and 3 electrons only"], correctAnswer: "3 protons and 3 electrons" },
      { id: "1.2-18", text: "Which quantity determines the identity of an element?", options: ["Number of neutrons", "Number of protons", "Number of electrons", "Relative atomic mass"], correctAnswer: "Number of protons" },
      { id: "1.2-19", text: "When an ion forms, which subatomic particle number does NOT change?", options: ["Electrons", "Protons", "Charge", "Electron arrangement"], correctAnswer: "Protons" },
      { id: "1.2-20", text: "A positive ion forms when an atom:", options: ["Gains electrons", "Loses electrons", "Gains protons", "Loses neutrons"], correctAnswer: "Loses electrons" },
      { id: "1.2-21", text: "A negative ion forms when an atom:", options: ["Gains electrons", "Loses electrons", "Gains protons", "Loses neutrons"], correctAnswer: "Gains electrons" },
      { id: "1.2-22", text: "Magnesium has atomic number 12. How many protons are in an Mg2+ ion?", options: ["10", "12", "14", "24"], correctAnswer: "12" },
      { id: "1.2-23", text: "Magnesium has atomic number 12. How many electrons are in an Mg2+ ion?", options: ["12", "14", "10", "2"], correctAnswer: "10" },
      { id: "1.2-24", text: "Carbon has atomic number 6. A neutral carbon atom has:", options: ["6 protons and 6 electrons", "6 protons and 12 electrons", "12 protons and 6 electrons", "6 neutrons only"], correctAnswer: "6 protons and 6 electrons" },
      { id: "1.2-25", text: "An atom has mass number 63 and 34 neutrons. What is its atomic number?", options: ["29", "34", "63", "97"], correctAnswer: "29" },
      { id: "1.2-26", text: "An atom has mass number 63 and atomic number 29. How many neutrons does it have?", options: ["29", "34", "63", "92"], correctAnswer: "34" },
      { id: "1.2-27", text: "Which statement best defines isotopes?", options: ["Atoms with different numbers of protons", "Atoms of different elements with the same mass number", "Atoms of the same element with different numbers of neutrons", "Ions of the same element with different charges"], correctAnswer: "Atoms of the same element with different numbers of neutrons" },
      { id: "1.2-28", text: "Isotopes of the same element have the same:", options: ["Mass number", "Number of neutrons", "Number of protons", "Relative mass of electrons"], correctAnswer: "Number of protons" },
      { id: "1.2-29", text: "Carbon-12 and carbon-14 differ in their number of:", options: ["Protons", "Electrons (in neutral atoms)", "Neutrons", "Nuclear charge"], correctAnswer: "Neutrons" },
      { id: "1.2-30", text: "Relative atomic mass (Ar) is based on the mass of:", options: ["1 proton", "1 neutron", "1/12 of a carbon-12 atom", "1 carbon-14 atom"], correctAnswer: "1/12 of a carbon-12 atom" },
      { id: "1.2-31", text: "Which is the best description of relative atomic mass (Ar)?", options: ["Mass number of the most common isotope", "Average mass of an atom compared with 1/12 of carbon-12", "Mass of one mole of atoms in grams", "Number of neutrons in an atom"], correctAnswer: "Average mass of an atom compared with 1/12 of carbon-12" },
      { id: "1.2-32", text: "To calculate Ar from isotopes and abundances, you must:", options: ["Add the isotope masses only", "Multiply each isotope mass by its percentage abundance, add, then divide by 100", "Divide each isotope mass by its abundance", "Use atomic number instead"], correctAnswer: "Multiply each isotope mass by its percentage abundance, add, then divide by 100" },
      { id: "1.2-33", text: "Oxygen isotopes: 99.76% 16O, 0.04% 17O, 0.20% 18O. Which is closest to Ar?", options: ["16.00", "16.90", "17.00", "18.00"], correctAnswer: "16.00" },
      { id: "1.2-34", text: "The percentage abundance of isotopes is obtained from:", options: ["A titration curve", "A pH curve", "A mass spectrum", "A calorimetry graph"], correctAnswer: "A mass spectrum" },
      { id: "1.2-35", text: "In mass spectrometry, the sample is first:", options: ["Frozen", "Vapourised", "Neutralised", "Precipitated"], correctAnswer: "Vapourised" },
      { id: "1.2-36", text: "In mass spectrometry, the sample is ionised to form:", options: ["Negative ions only", "Positive ions", "Neutrons", "Electrons"], correctAnswer: "Positive ions" },
      { id: "1.2-37", text: "In mass spectrometry, ions are then:", options: ["Accelerated", "Dissolved", "Burned", "Crystallised"], correctAnswer: "Accelerated" }
    ]
  },
  {
    id: 3,
    title: "S1.3 — Electron configurations",
    description: "How electrons are arranged in atoms.",
    color: "bg-indigo-500",
    category: 'structure',
    concepts: [
      "Electromagnetic spectrum: range of all EM radiation arranged by frequency (f), wavelength (λ), and energy.",
      "All EM waves travel at speed of light in vacuum: c = 3.00 × 10^8 m s⁻¹.",
      "Relationship: c = fλ. Frequency is inversely proportional to wavelength.",
      "Higher frequency radiation has higher energy (e.g., γ rays, X-rays, UV).",
      "Continuous spectrum contains all visible frequencies; Line spectrum shows only certain frequencies.",
      "Line spectra provide evidence that energy is quantised (discrete packets).",
      "Emission spectra: electrons excited to higher levels emit radiation when falling back to lower levels.",
      "Hydrogen visible lines (Balmer series) correspond to transitions down to n = 2.",
      "Convergence: lines in a spectrum get closer together at higher energy.",
      "Convergence limit corresponds to the maximum energy and relates to ionisation energy.",
      "Electronic configuration: arrangement of electrons in shells (n), subshells (s, p, d, f), and orbitals.",
      "Maximum electrons in shell: 2n². Subshell energies generally: s < p < d < f (Exception: 4s fills before 3d).",
      "Orbitals: s (1), p (3), d (5), f (7). Each orbital holds a maximum of 2 electrons.",
      "Shapes: s orbitals are spherical; p orbitals are dumbbell-shaped along x, y, z axes.",
      "Degenerate orbitals have the same energy in the ground state.",
      "Aufbau principle: fill lowest energy subshells first.",
      "Hund’s rule: singly occupy degenerate orbitals with parallel spins before pairing.",
      "Pauli exclusion principle: max 2 electrons per orbital with opposite spin.",
      "Exceptions: Cr ([Ar] 3d⁵ 4s¹) and Cu ([Ar] 3d¹⁰ 4s¹) due to stability of half/full d-subshells.",
      "Ions: transition metals lose electrons from 4s before 3d.",
      "HL: First ionisation energy (IE₁) can be found from the limit of convergence (ΔE = hν).",
      "HL: Successive ionisation energies increase; large jumps indicate a change of shell.",
      "IE₁ trends: increases across a period (nuclear charge ↑, radius ↓), decreases down a group (distance ↑, shielding ↑).",
      "IE₁ dips: Be → B (2p higher energy), N → O (spin-pair repulsion in p orbital)."
    ],
    vocab: [
      { term: "Electromagnetic spectrum", traditional: "電磁波譜", simplified: "电磁波谱", definition: "Range of all EM radiation by f, λ, energy" },
      { term: "Frequency (f)", traditional: "頻率", simplified: "频率", definition: "Waves per second (s⁻¹)" },
      { term: "Wavelength (λ)", traditional: "波長", simplified: "波长", definition: "Distance between peaks (m)" },
      { term: "Speed of light (c)", traditional: "光速", simplified: "光速", definition: "3.00 × 10^8 m s⁻¹" },
      { term: "Quantised", traditional: "量子化", simplified: "量子化", definition: "Only specific energy values allowed" },
      { term: "Continuous spectrum", traditional: "連續光譜", simplified: "连续光谱", definition: "All visible frequencies" },
      { term: "Line spectrum", traditional: "線狀光譜", simplified: "线状光谱", definition: "Discrete wavelengths/frequencies" },
      { term: "Emission spectrum", traditional: "發射光譜", simplified: "发射光谱", definition: "Light emitted as electrons drop levels" },
      { term: "Convergence", traditional: "收斂", simplified: "收敛", definition: "Lines get closer at high energy" },
      { term: "Limit of convergence", traditional: "收斂極限", simplified: "收敛极限", definition: "Point where lines converge; relates to IE" },
      { term: "Shell (energy level)", traditional: "電子層", simplified: "电子层", definition: "Principal level n" },
      { term: "Subshell", traditional: "分層", simplified: "分层", definition: "s, p, d, f" },
      { term: "Orbital", traditional: "軌域", simplified: "轨域", definition: "Region of space; max 2 electrons" },
      { term: "Degenerate", traditional: "簡併", simplified: "简并", definition: "Equal-energy orbitals" },
      { term: "Aufbau", traditional: "遞建原理", simplified: "递建原理", definition: "Fill lowest energy first" },
      { term: "Hund’s rule", traditional: "洪德規則", simplified: "洪德规则", definition: "Singly occupy degenerate orbitals first" },
      { term: "Pauli exclusion", traditional: "包立不相容原理", simplified: "包立不相容原理", definition: "Max 2 electrons per orbital, opposite spin" },
      { term: "Shorthand configuration", traditional: "簡寫電子組態", simplified: "简写电子组态", definition: "Noble gas core in brackets" },
      { term: "Ionisation energy (IE₁)", traditional: "游離能", simplified: "游离能", definition: "Energy to remove 1 mol of outer electrons" },
      { term: "Successive IEs", traditional: "逐級游離能", simplified: "逐级游离能", definition: "IE₁, IE₂, IE₃ ...; increase with removal" },
      { term: "Shielding", traditional: "屏蔽效應", simplified: "屏蔽效应", definition: "Inner electrons reduce attraction to nucleus" },
      { term: "Spin-pair repulsion", traditional: "自旋對排斥", simplified: "自旋对排斥", definition: "Repulsion between paired electrons in same orbital" }
    ],
    questions: [
      { id: "1.3-1", text: "Which statement best describes the electromagnetic spectrum?", options: ["A range of particle masses", "A range of frequencies covering all electromagnetic radiation", "A list of chemical elements", "A spectrum showing only visible light"], correctAnswer: "A range of frequencies covering all electromagnetic radiation" },
      { id: "1.3-2", text: "Which relationship links speed of light (c), frequency (f) and wavelength (λ)?", options: ["c = f / λ", "c = fλ", "c = λ - f", "c = f + λ"], correctAnswer: "c = fλ" },
      { id: "1.3-3", text: "If the frequency of radiation increases, its wavelength:", options: ["Increases", "Decreases", "Stays constant", "Becomes zero"], correctAnswer: "Decreases" },
      { id: "1.3-4", text: "Which region has the highest energy?", options: ["Radio waves", "Infrared", "Visible", "Gamma rays"], correctAnswer: "Gamma rays" },
      { id: "1.3-5", text: "Which statement about electromagnetic waves is correct?", options: ["Different colours of light travel at different speeds in vacuum", "All EM waves travel at the same speed in vacuum", "Only visible light travels at speed c", "X-rays travel slower than radio waves"], correctAnswer: "All EM waves travel at the same speed in vacuum" },
      { id: "1.3-6", text: "A continuous spectrum in the visible region contains:", options: ["Only red and blue light", "Only certain fixed frequencies", "All colours/frequencies in the visible range", "Only ultraviolet frequencies"], correctAnswer: "All colours/frequencies in the visible range" },
      { id: "1.3-7", text: "A line spectrum indicates that energy is:", options: ["Continuous", "Quantised", "Always absorbed", "Not related to electrons"], correctAnswer: "Quantised" },
      { id: "1.3-8", text: "In an emission process, an electron:", options: ["Moves from lower to higher energy level and absorbs energy", "Moves from higher to lower energy level and emits energy", "Leaves the nucleus", "Becomes a proton"], correctAnswer: "Moves from higher to lower energy level and emits energy" },
      { id: "1.3-9", text: "The visible emission lines of hydrogen (Balmer series) correspond to transitions:", options: ["To n = 1", "To n = 2", "To n = 3", "From n = 1 to n = 2"], correctAnswer: "To n = 2" },
      { id: "1.3-10", text: "“Convergence” in a hydrogen line spectrum means:", options: ["Lines are equally spaced", "Lines disappear at low energy", "Lines get closer together toward higher energy", "Lines move to longer wavelength only"], correctAnswer: "Lines get closer together toward higher energy" },
      { id: "1.3-11", text: "The convergence limit in an emission spectrum corresponds to:", options: ["Minimum energy of an electron", "Ionisation energy threshold", "Melting point", "Neutron emission"], correctAnswer: "Ionisation energy threshold" },
      { id: "1.3-12", text: "The arrangement of electrons in an atom is called:", options: ["Isotopic abundance", "Electronic configuration", "Nuclear charge", "Relative atomic mass"], correctAnswer: "Electronic configuration" },
      { id: "1.3-13", text: "Principal quantum number (n) labels:", options: ["Orbitals only", "Shells (principal energy levels)", "Protons", "Neutrons"], correctAnswer: "Shells (principal energy levels)" },
      { id: "1.3-14", text: "Which shell can hold a maximum of 8 electrons?", options: ["n = 1", "n = 2", "n = 3", "n = 4"], correctAnswer: "n = 2" },
      { id: "1.3-15", text: "The maximum number of electrons in shell n is given by:", options: ["n^2", "2n", "2n^2", "2^n"], correctAnswer: "2n^2" },
      { id: "1.3-16", text: "Which subshell order represents increasing energy (general trend)?", options: ["p < s < d < f", "s < p < d < f", "d < p < s < f", "f < d < p < s"], correctAnswer: "s < p < d < f" },
      { id: "1.3-17", text: "Which statement is consistent with the notes for transition metals?", options: ["3d fills before 4s", "4s fills before 3d", "4p fills before 4s", "2p fills before 1s"], correctAnswer: "4s fills before 3d" },
      { id: "1.3-18", text: "How many orbitals are in an s subshell?", options: ["1", "2", "3", "5"], correctAnswer: "1" },
      { id: "1.3-19", text: "How many orbitals are in a p subshell?", options: ["1", "2", "3", "6"], correctAnswer: "3" },
      { id: "1.3-20", text: "How many orbitals are in a d subshell?", options: ["3", "5", "7", "10"], correctAnswer: "5" },
      { id: "1.3-21", text: "The maximum number of electrons in a single orbital is:", options: ["1", "2", "6", "10"], correctAnswer: "2" },
      { id: "1.3-22", text: "The maximum number of electrons in a p subshell is:", options: ["2", "4", "6", "10"], correctAnswer: "6" },
      { id: "1.3-23", text: "The maximum number of electrons in a d subshell is:", options: ["6", "8", "10", "14"], correctAnswer: "10" },
      { id: "1.3-24", text: "Orbitals in the same subshell have the same energy (ground state) and are called:", options: ["isotopic", "degenerate", "ionised", "polar"], correctAnswer: "degenerate" },
      { id: "1.3-25", text: "The shape of an s orbital is best described as:", options: ["dumbbell-shaped", "spherical", "tetrahedral", "linear"], correctAnswer: "spherical" },
      { id: "1.3-26", text: "The shape of a p orbital is best described as:", options: ["spherical", "dumbbell-shaped", "cubic", "planar triangle"], correctAnswer: "dumbbell-shaped" },
      { id: "1.3-27", text: "Which principle states electrons fill lowest energy subshells first?", options: ["Hund’s rule", "Aufbau principle", "Pauli exclusion principle", "Le Chatelier’s principle"], correctAnswer: "Aufbau principle" },
      { id: "1.3-28", text: "Hund’s rule predicts that electrons in a p subshell will:", options: ["pair up in one orbital before occupying others", "occupy separate orbitals first with parallel spin", "always have opposite spins in different orbitals", "occupy d orbitals first"], correctAnswer: "occupy separate orbitals first with parallel spin" },
      { id: "1.3-29", text: "Pauli exclusion principle states that an orbital can contain:", options: ["unlimited electrons", "2 electrons with the same spin", "2 electrons with opposite spin", "3 electrons maximum"], correctAnswer: "2 electrons with opposite spin" },
      { id: "1.3-30", text: "Shorthand electron configurations use:", options: ["A preceding noble gas in brackets", "The atomic number only", "The mass number only", "Only p orbitals"], correctAnswer: "A preceding noble gas in brackets" },
      { id: "1.3-31", text: "Which electron configuration is an Aufbau exception mentioned?", options: ["Na: [Ne] 3s¹", "Mg: [Ne] 3s²", "Cr: [Ar] 3d⁵ 4s¹", "Ca: [Ar] 4s²"], correctAnswer: "Cr: [Ar] 3d⁵ 4s¹" },
      { id: "1.3-32", text: "Copper’s favourable configuration mentioned is:", options: ["[Ar] 3d⁹ 4s²", "[Ar] 3d¹⁰ 4s¹", "[Ne] 3s² 3p⁶", "[Kr] 4d¹⁰ 5s¹"], correctAnswer: "[Ar] 3d¹⁰ 4s¹" },
      { id: "1.3-33", text: "The reason Cr and Cu have exceptions is because half/full d-subshells are:", options: ["less stable", "energetically favourable", "impossible", "caused by neutrons"], correctAnswer: "energetically favourable" },
      { id: "1.3-34", text: "When forming a cation, electrons are removed from:", options: ["the nucleus", "the outer subshell", "inner shells first always", "protons"], correctAnswer: "the outer subshell" },
      { id: "1.3-35", text: "Transition metals lose electrons first from:", options: ["3d before 4s", "4s before 3d", "2p before 2s", "1s before 2s"], correctAnswer: "4s before 3d" },
      { id: "1.3-36", text: "The periodic table s-block elements have valence electrons in the:", options: ["s subshell", "p subshell", "d subshell", "f subshell"], correctAnswer: "s subshell" },
      { id: "1.3-37", text: "The periodic table d-block elements have valence electrons in the:", options: ["s subshell", "p subshell", "d subshell", "f subshell"], correctAnswer: "d subshell" },
      { id: "1.3-38", text: "The limit of convergence frequency can be used to determine:", options: ["melting point", "first ionisation energy", "density", "lattice enthalpy"], correctAnswer: "first ionisation energy" },
      { id: "1.3-39", text: "The equation linking energy change and frequency is:", options: ["ΔE = cλ", "ΔE = hν", "ΔE = ν / λ", "ΔE = h / ν"], correctAnswer: "ΔE = hν" },
      { id: "1.3-40", text: "If wavelength λ is known, frequency ν can be found using:", options: ["ν = cλ", "ν = c / λ", "ν = λ / c", "ν = hλ"], correctAnswer: "ν = c / λ" },
      { id: "1.3-41", text: "Successive ionisation energies generally:", options: ["decrease", "stay constant", "increase", "are random"], correctAnswer: "increase" },
      { id: "1.3-42", text: "The main reason successive IEs increase is that removing an electron from a:", options: ["neutral atom is harder than from a cation", "cation is harder than from a neutral atom", "neutron is easy", "nucleus is easy"], correctAnswer: "cation is harder than from a neutral atom" },
      { id: "1.3-43", text: "A large jump in successive ionisation energies indicates:", options: ["a change of shell (inner electron removal)", "a change of isotope", "a phase change", "a higher melting point"], correctAnswer: "a change of shell (inner electron removal)" },
      { id: "1.3-44", text: "Successive IE data can be used to deduce:", options: ["the group an element belongs to", "the boiling point of water", "the colour of the element", "the density of the nucleus"], correctAnswer: "the group an element belongs to" },
      { id: "1.3-45", text: "First ionisation energy generally increases across a period because:", options: ["shielding increases greatly", "nuclear charge increases and atomic radius decreases", "the nucleus gains neutrons only", "electrons move further from the nucleus"], correctAnswer: "nuclear charge increases and atomic radius decreases" },
      { id: "1.3-46", text: "First ionisation energy generally decreases down a group because:", options: ["nuclear charge decreases", "outer electrons are further from nucleus and shielding increases", "electrons move into lower shells", "proton number becomes zero"], correctAnswer: "outer electrons are further from nucleus and shielding increases" },
      { id: "1.3-47", text: "The dip from Be to B in IE₁ is explained by:", options: ["an electron entering the 2p subshell which is higher in energy/further", "Be having no electrons", "B having a lower nuclear charge", "B being a noble gas"], correctAnswer: "an electron entering the 2p subshell which is higher in energy/further" },
      { id: "1.3-48", text: "The dip from N to O in IE₁ is explained by:", options: ["oxygen having fewer protons", "spin-pair repulsion in an oxygen 2p orbital", "nitrogen having electrons in 3d", "oxygen having no shielding"], correctAnswer: "spin-pair repulsion in an oxygen 2p orbital" },
      { id: "1.3-49", text: "Which factor does NOT increase IE₁ across a period?", options: ["Increasing nuclear charge", "Decreasing atomic radius", "Large increase in shielding within the same shell", "Greater attraction between nucleus and outer electron"], correctAnswer: "Large increase in shielding within the same shell" },
      { id: "1.3-50", text: "Which statement best describes a photon in this context?", options: ["A continuous flow of energy without discrete amounts", "A packet of electromagnetic energy emitted/absorbed during transitions", "A proton in the nucleus", "A neutron in the nucleus"], correctAnswer: "A packet of electromagnetic energy emitted/absorbed during transitions" }
    ]
  },
  {
    id: 4,
    title: "S1.4 — Counting particles by mass: the mole",
    description: "The fundamental unit for measuring amount of substance.",
    color: "bg-purple-500",
    category: 'structure',
    concepts: [
      "Avogadro constant (NA or L): 6.02 × 10²³ mol⁻¹, the number of particles in 1 mol.",
      "1 mole contains the same number of units as atoms in 12.00 g of carbon-12.",
      "Molar mass (M): mass of 1 mol of a substance in g mol⁻¹.",
      "Relative atomic mass (Ar): weighted average mass of an atom compared to 1/12 of a carbon-12 atom (unitless).",
      "Relative molecular mass (Mr): sum of Ar for a molecule.",
      "Relative formula mass (Mr): sum of Ar for a formula unit (ionic compounds).",
      "Particles = moles × NA; Moles = particles ÷ NA.",
      "Moles = mass ÷ molar mass (n = m/M).",
      "Molecular formula: actual number of each type of atom in a molecule.",
      "Empirical formula: simplest whole-number ratio of atoms in a compound.",
      "Molar concentration: c = n/V (mol dm⁻³).",
      "1 dm³ = 1000 cm³.",
      "ppm (parts per million): 1 mg per 1 dm³ of water (≈ 1 mg per 1 kg).",
      "Avogadro’s law: equal volumes of gases (same T and P) contain the same number of molecules.",
      "STP (Standard Temperature and Pressure): 0 °C (273 K) and 100 kPa. Molar gas volume = 22.7 dm³ mol⁻¹.",
      "Limiting reactant: the reactant that is used up first in a chemical reaction."
    ],
    vocab: [
      { term: "Mole (mol)", traditional: "摩爾", simplified: "摩尔", definition: "Amount of substance containing NA particles" },
      { term: "Avogadro constant (NA)", traditional: "阿佛加德羅常數", simplified: "阿佛加德罗常数", definition: "6.02 × 10²³ mol⁻¹" },
      { term: "Molar mass (M)", traditional: "摩爾質量", simplified: "摩尔质量", definition: "Mass of 1 mol (g mol⁻¹)" },
      { term: "Ar", traditional: "相對原子質量", simplified: "相对原子质量", definition: "Relative atomic mass (weighted average vs 1/12 C-12)" },
      { term: "Mr", traditional: "相對分子/化學式質量", simplified: "相对分子/化学式质量", definition: "Relative molecular/formula mass (sum of Ar)" },
      { term: "Formula unit", traditional: "化學式單位", simplified: "化学式单位", definition: "Simplest ratio unit in ionic compounds" },
      { term: "Empirical formula", traditional: "實驗式", simplified: "实验式", definition: "Simplest whole-number ratio" },
      { term: "Molecular formula", traditional: "分子式", simplified: "分子式", definition: "Actual numbers of atoms" },
      { term: "Percentage composition", traditional: "百分比組成", simplified: "百分比组成", definition: "% by mass of each element" },
      { term: "Concentration (c)", traditional: "濃度", simplified: "浓度", definition: "Moles per dm³ (mol dm⁻³)" },
      { term: "Solute", traditional: "溶質", simplified: "溶质", definition: "Substance dissolved" },
      { term: "Solvent", traditional: "溶劑", simplified: "溶剂", definition: "Liquid doing the dissolving" },
      { term: "ppm", traditional: "百萬分率", simplified: "百万分率", definition: "Parts per million (very low concentration)" },
      { term: "Avogadro’s law", traditional: "阿佛加德羅定律", simplified: "阿佛加德罗定律", definition: "Equal gas volumes contain equal numbers of molecules" },
      { term: "STP", traditional: "標準狀況", simplified: "标准状况", definition: "0 °C, 100 kPa; molar gas volume 22.7 dm³ mol⁻¹" },
      { term: "Limiting reactant", traditional: "限量試劑", simplified: "限量试剂", definition: "Reactant used up first" }
    ],
    questions: [
      { id: "1.4-1", text: "The Avogadro constant (NA) is the number of particles in:", options: ["1 g of any substance", "1 mol of any substance", "1 dm³ of any gas at room temperature", "1 atom of carbon-12"], correctAnswer: "1 mol of any substance" },
      { id: "1.4-2", text: "The value of NA is approximately:", options: ["6.02 × 10²² mol⁻¹", "6.02 × 10²³ mol⁻¹", "6.02 × 10²⁴ mol⁻¹", "3.00 × 10⁸ mol⁻¹"], correctAnswer: "6.02 × 10²³ mol⁻¹" },
      { id: "1.4-3", text: "One mole contains the same number of particles as the number of atoms in:", options: ["1.00 g of carbon-12", "12.00 g of carbon-12", "16.00 g of oxygen-16", "22.7 dm³ of gas at STP"], correctAnswer: "12.00 g of carbon-12" },
      { id: "1.4-4", text: "The molar mass (M) of a substance is:", options: ["The mass of one atom in grams", "The mass of one mole in g mol⁻¹", "The volume of one mole in dm³", "The number of moles in 1 dm³"], correctAnswer: "The mass of one mole in g mol⁻¹" },
      { id: "1.4-5", text: "Which is correct for calculating number of particles from moles?", options: ["particles = moles ÷ NA", "particles = moles × NA", "particles = mass × NA", "particles = concentration × NA"], correctAnswer: "particles = moles × NA" },
      { id: "1.4-6", text: "Which is correct for calculating moles from number of particles?", options: ["moles = particles × NA", "moles = particles ÷ NA", "moles = particles ÷ molar mass", "moles = particles × molar mass"], correctAnswer: "moles = particles ÷ NA" },
      { id: "1.4-7", text: "1 mol of Na contains:", options: ["6.02 × 10²³ sodium molecules", "6.02 × 10²³ sodium atoms", "6.02 × 10²³ sodium ions only", "3.01 × 10²³ sodium atoms"], correctAnswer: "6.02 × 10²³ sodium atoms" },
      { id: "1.4-8", text: "1 mol of H2 molecules contains how many moles of hydrogen atoms?", options: ["0.5 mol", "1 mol", "2 mol", "6.02 mol"], correctAnswer: "2 mol" },
      { id: "1.4-9", text: "1 mol of NaCl contains approximately how many formula units?", options: ["6.02 × 10²³", "1.20 × 10²⁴", "3.01 × 10²³", "58.44"], correctAnswer: "6.02 × 10²³" },
      { id: "1.4-10", text: "Relative atomic mass (Ar) is best defined as:", options: ["Mass of 1 mol in grams", "Weighted average mass of an atom compared with 1/12 of carbon-12", "Number of neutrons in the nucleus", "Mass number of the most common isotope"], correctAnswer: "Weighted average mass of an atom compared with 1/12 of carbon-12" },
      { id: "1.4-11", text: "Ar has:", options: ["units of g mol⁻¹", "units of kg", "no units", "units of dm³"], correctAnswer: "no units" },
      { id: "1.4-12", text: "Relative formula mass is used mainly for:", options: ["covalent molecules only", "ionic compounds", "noble gases", "solutions only"], correctAnswer: "ionic compounds" },
      { id: "1.4-13", text: "The molar mass of water, H2O, is closest to:", options: ["16.00 g mol⁻¹", "17.00 g mol⁻¹", "18.02 g mol⁻¹", "20.02 g mol⁻¹"], correctAnswer: "18.02 g mol⁻¹" },
      { id: "1.4-14", text: "Which expression gives the number of moles (n) from mass (m) and molar mass (M)?", options: ["n = mM", "n = m / M", "n = M / m", "n = m + M"], correctAnswer: "n = m / M" },
      { id: "1.4-15", text: "Which expression gives the mass (m) from moles (n) and molar mass (M)?", options: ["m = n / M", "m = M / n", "m = nM", "m = n + M"], correctAnswer: "m = nM" },
      { id: "1.4-16", text: "The molar mass of Zn is 65.38 g mol⁻¹. The mass of 0.250 mol Zn is closest to:", options: ["16.3 g", "26.2 g", "6.54 g", "130.8 g"], correctAnswer: "16.3 g" },
      { id: "1.4-17", text: "If 2.64 g of sucrose has M = 342.3 g mol⁻¹, the moles is closest to:", options: ["7.71 × 10⁻³ mol", "7.71 × 10⁻² mol", "7.71 × 10⁻¹ mol", "7.71 × 10³ mol"], correctAnswer: "7.71 × 10⁻³ mol" },
      { id: "1.4-18", text: "The empirical formula is:", options: ["the actual numbers of each atom in a molecule", "the simplest whole-number ratio of atoms", "always the same as the molecular formula", "used only for elements"], correctAnswer: "the simplest whole-number ratio of atoms" },
      { id: "1.4-19", text: "The molecular formula is:", options: ["always the simplest ratio", "the actual numbers of atoms of each element", "only used for ionic compounds", "found directly from Ar values without calculation"], correctAnswer: "the actual numbers of atoms of each element" },
      { id: "1.4-20", text: "Which statement is correct?", options: ["Ionic compounds are written with molecular formulae", "Ionic compounds are always written with empirical formulae", "Empirical formulae can contain fractions", "Molecular formulae must be simplest ratio"], correctAnswer: "Ionic compounds are always written with empirical formulae" },
      { id: "1.4-21", text: "A compound has molecular formula C2H4O2. A possible empirical formula is:", options: ["C2H4O2", "CH2O", "C4H8O4", "CHO"], correctAnswer: "CH2O" },
      { id: "1.4-22", text: "To determine an empirical formula from percentage composition, a common first step is to:", options: ["divide % by 100 only", "assume 100 g of sample and convert masses to moles", "multiply by Avogadro’s constant immediately", "divide all values by molar volume"], correctAnswer: "assume 100 g of sample and convert masses to moles" },
      { id: "1.4-23", text: "A compound contains 10 g H and 80 g O. The simplest ratio corresponds to:", options: ["HO", "H2O", "H2O2", "H4O"], correctAnswer: "H2O" },
      { id: "1.4-24", text: "A compound is 85.7% C and 14.3% H. The empirical formula is:", options: ["CH", "CH2", "C2H", "C2H4"], correctAnswer: "CH2" },
      { id: "1.4-25", text: "To find the molecular formula from an empirical formula you need:", options: ["only atomic numbers", "relative molecular mass and empirical formula mass", "melting point", "density only"], correctAnswer: "relative molecular mass and empirical formula mass" },
      { id: "1.4-26", text: "The multiple linking empirical to molecular formula is:", options: ["Mr(empirical) / Mr(molecule)", "Mr(molecule) / Mr(empirical)", "Mr(molecule) - Mr(empirical)", "Mr(molecule) + Mr(empirical)"], correctAnswer: "Mr(molecule) / Mr(empirical)" },
      { id: "1.4-27", text: "Concentration in mol dm⁻³ is defined as:", options: ["c = V / n", "c = n / V", "c = nV", "c = m / n"], correctAnswer: "c = n / V" },
      { id: "1.4-28", text: "When using c = n/V, V must be in:", options: ["cm³", "dm³", "m³ only", "g"], correctAnswer: "dm³" },
      { id: "1.4-29", text: "To convert 250 cm³ to dm³ you should:", options: ["multiply by 1000", "divide by 1000", "add 1000", "divide by 250"], correctAnswer: "divide by 1000" },
      { id: "1.4-30", text: "A solution has c = 0.200 mol dm⁻³ and V = 0.250 dm³. The moles of solute is:", options: ["0.500 mol", "0.0500 mol", "0.0200 mol", "0.800 mol"], correctAnswer: "0.0500 mol" },
      { id: "1.4-31", text: "If 0.0500 mol of NaOH is required, and M(NaOH) = 40.00 g mol⁻¹, the mass needed is:", options: ["2.00 g", "0.800 g", "40.0 g", "0.0500 g"], correctAnswer: "2.00 g" },
      { id: "1.4-32", text: "A “concentrated” solution means:", options: ["low amount of solute per volume", "high amount of solute per volume", "the solute is a gas", "the solvent is always ethanol"], correctAnswer: "high amount of solute per volume" },
      { id: "1.4-33", text: "ppm is useful for describing:", options: ["extremely high concentrations", "extremely low concentrations", "molar mass of solids", "electron configurations"], correctAnswer: "extremely low concentrations" },
      { id: "1.4-34", text: "1 ppm in water is approximately:", options: ["1 g in 1 dm³", "1 mg in 1 dm³", "1 kg in 1 dm³", "1 mol in 1 dm³"], correctAnswer: "1 mg in 1 dm³" }
    ]
  },
  {
    id: 5,
    title: "S1.5 — Ideal gases",
    description: "Behavior of gases under different conditions.",
    color: "bg-cyan-500",
    category: 'structure',
    concepts: [
      "Kinetic theory of gases: gas molecules are in constant random motion.",
      "Ideal gas assumptions: negligible particle volume, no intermolecular forces, elastic collisions.",
      "Temperature (K) is proportional to average kinetic energy.",
      "Real gases deviate from ideal behaviour at low temperature and high pressure.",
      "Gas pressure arises from collisions with container walls.",
      "Boyle’s law (constant T): P ∝ 1/V, so PV = constant.",
      "Charles’ law (constant P): V ∝ T (K), so V/T = constant.",
      "Pressure law (constant V): P ∝ T (K), so P/T = constant.",
      "Combined gas law: P1V1/T1 = P2V2/T2.",
      "Ideal gas equation: PV = nRT (P in Pa, V in m³, T in K, n in mol).",
      "Gas constant R = 8.31 J K⁻¹ mol⁻¹.",
      "Unit conversions: kPa to Pa (×1000), dm³ to m³ (÷1000), cm³ to m³ (÷10^6).",
      "Real gas deviation reasons: molecular volume and intermolecular attractions."
    ],
    vocab: [
      { term: "Ideal gas", traditional: "理想氣體", simplified: "理想气体", definition: "Follows kinetic theory assumptions closely" },
      { term: "Real gas", traditional: "真實氣體", simplified: "真实气体", definition: "Deviates from ideal behaviour (esp. low T, high P)" },
      { term: "Elastic collision", traditional: "彈性碰撞", simplified: "弹性碰撞", definition: "Kinetic energy conserved" },
      { term: "Inelastic collision", traditional: "非彈性碰撞", simplified: "非弹性碰撞", definition: "Kinetic energy not conserved" },
      { term: "Pressure", traditional: "壓力", simplified: "压力", definition: "Force per area from particle-wall collisions" },
      { term: "Boyle’s law", traditional: "波以耳定律", simplified: "波以耳定律", definition: "PV constant (T constant)" },
      { term: "Charles’ law", traditional: "查理定律", simplified: "查理定律", definition: "V/T constant (P constant; T in K)" },
      { term: "Pressure law", traditional: "壓力定律", simplified: "压力定律", definition: "P/T constant (V constant; T in K)" },
      { term: "Ideal gas equation", traditional: "理想氣體狀態方程", simplified: "理想气体状态方程", definition: "PV=nRT" },
      { term: "Gas constant (R)", traditional: "氣體常數", simplified: "气体常数", definition: "8.31 J K⁻¹ mol⁻¹" },
      { term: "Molar gas volume", traditional: "摩爾氣體體積", simplified: "摩尔气体体积", definition: "Volume per mole at stated conditions" },
      { term: "Deviation", traditional: "偏差", simplified: "偏差", definition: "Difference from ideal prediction" }
    ],
    questions: [
      { id: "1.5-1", text: "The kinetic theory of gases states that gas molecules are:", options: ["stationary", "constantly moving", "always bonded together", "arranged in a lattice"], correctAnswer: "constantly moving" },
      { id: "1.5-2", text: "Which is an assumption of an ideal gas?", options: ["Gas molecules strongly attract each other", "Gas molecules have large volume compared with the container", "Collisions are elastic", "Temperature is unrelated to kinetic energy"], correctAnswer: "Collisions are elastic" },
      { id: "1.5-3", text: "In an ideal gas, intermolecular forces are assumed to be:", options: ["strong attractions", "strong repulsions", "absent", "only present at high temperature"], correctAnswer: "absent" },
      { id: "1.5-4", text: "What is meant by an elastic collision?", options: ["Particles stick together", "Kinetic energy is conserved", "Particles stop after collision", "Potential energy is destroyed"], correctAnswer: "Kinetic energy is conserved" },
      { id: "1.5-5", text: "Gas pressure in a container is caused by:", options: ["gas molecules sinking to the bottom", "collisions of gas molecules with the container walls", "gas molecules expanding into the nucleus", "chemical bonding between molecules"], correctAnswer: "collisions of gas molecules with the container walls" },
      { id: "1.5-6", text: "Decreasing the volume of a gas at constant temperature causes pressure to:", options: ["decrease", "increase", "remain constant", "become zero"], correctAnswer: "increase" },
      { id: "1.5-7", text: "Boyle’s law applies when:", options: ["pressure is constant", "temperature is constant", "volume is constant", "moles are changing"], correctAnswer: "temperature is constant" },
      { id: "1.5-8", text: "Boyle’s law can be written as:", options: ["V/T = constant", "P/T = constant", "PV = constant", "P = constant"], correctAnswer: "PV = constant" },
      { id: "1.5-9", text: "At constant temperature, pressure is proportional to:", options: ["V", "1/V", "T", "n"], correctAnswer: "1/V" },
      { id: "1.5-10", text: "Which graph would be a straight line for Boyle’s law?", options: ["P vs V", "P vs 1/V", "V vs T in °C", "PV vs V"], correctAnswer: "P vs 1/V" },
      { id: "1.5-11", text: "Heating a gas at constant pressure causes its volume to:", options: ["decrease", "increase", "stay constant", "become unrelated to temperature"], correctAnswer: "increase" },
      { id: "1.5-12", text: "Charles’ law states that at constant pressure:", options: ["P ∝ 1/V", "V ∝ T (K)", "P ∝ T (K)", "PV ∝ 1/T"], correctAnswer: "V ∝ T (K)" },
      { id: "1.5-13", text: "In Charles’ law, temperature must be measured in:", options: ["°C", "K", "Pa", "dm³"], correctAnswer: "K" },
      { id: "1.5-14", text: "Increasing temperature at constant volume causes pressure to:", options: ["decrease", "increase", "remain constant", "become negative"], correctAnswer: "increase" },
      { id: "1.5-15", text: "At constant volume, pressure is proportional to:", options: ["1/T", "T (K)", "V", "1/V"], correctAnswer: "T (K)" },
      { id: "1.5-16", text: "Combining Boyle’s, Charles’ and pressure laws gives:", options: ["PV/T = constant", "P/VT = constant", "V/PT = constant", "PVT = constant"], correctAnswer: "PV/T = constant" },
      { id: "1.5-17", text: "For a fixed amount of gas, a useful relationship is:", options: ["P1 + V1 = T1", "P1V1/T1 = P2V2/T2", "P1/V1 = T2/P2", "T1/V1 = P2/V2"], correctAnswer: "P1V1/T1 = P2V2/T2" },
      { id: "1.5-18", text: "The ideal gas equation is:", options: ["PV = nRT", "PV = n/RT", "P = VnRT", "V = PRT"], correctAnswer: "PV = nRT" },
      { id: "1.5-19", text: "In PV = nRT, the unit of pressure P should be:", options: ["kPa", "Pa", "atm only", "mol dm⁻³"], correctAnswer: "Pa" },
      { id: "1.5-20", text: "In PV = nRT, the unit of volume V should be:", options: ["dm³", "cm³", "m³", "L mol⁻¹"], correctAnswer: "m³" },
      { id: "1.5-21", text: "In PV = nRT, temperature must be in:", options: ["°C", "K", "Pa", "J"], correctAnswer: "K" },
      { id: "1.5-22", text: "The gas constant R is approximately:", options: ["6.02 × 10²³", "8.31 J K⁻¹ mol⁻¹", "3.00 × 10⁸ m s⁻¹", "22.7 dm³ mol⁻¹"], correctAnswer: "8.31 J K⁻¹ mol⁻¹" },
      { id: "1.5-23", text: "Convert 220 kPa to Pa.", options: ["220 Pa", "2.20 × 10³ Pa", "2.20 × 10⁵ Pa", "2.20 × 10⁸ Pa"], correctAnswer: "2.20 × 10⁵ Pa" },
      { id: "1.5-24", text: "Convert 10.1 dm³ to m³.", options: ["10.1 m³", "0.101 m³", "0.0101 m³", "0.00101 m³"], correctAnswer: "0.0101 m³" },
      { id: "1.5-25", text: "Convert 1000 cm³ to m³.", options: ["1.0 m³", "0.001 m³", "0.01 m³", "0.0001 m³"], correctAnswer: "0.001 m³" },
      { id: "1.5-26", text: "To convert °C to K, you:", options: ["subtract 273", "add 273", "multiply by 273", "divide by 273"], correctAnswer: "add 273" },
      { id: "1.5-27", text: "If volume halves at constant pressure, the temperature (K) will:", options: ["double", "halve", "stay the same", "become zero"], correctAnswer: "halve" },
      { id: "1.5-28", text: "At 25 °C a gas has T =", options: ["25 K", "52 K", "298 K", "373 K"], correctAnswer: "298 K" },
      { id: "1.5-29", text: "Which change increases collision frequency with the container wall?", options: ["decreasing pressure at constant volume", "increasing temperature at constant volume", "decreasing temperature at constant volume", "increasing volume at constant temperature"], correctAnswer: "increasing temperature at constant volume" },
      { id: "1.5-30", text: "The ideal gas equation is derived by combining relationships between:", options: ["mass, moles, concentration", "pressure, volume, temperature", "charge, mass, radius", "frequency, wavelength, energy"], correctAnswer: "pressure, volume, temperature" },
      { id: "1.5-31", text: "Real gases deviate most from ideal behaviour at:", options: ["high temperature and low pressure", "low temperature and high pressure", "low temperature and low pressure", "high temperature and high pressure"], correctAnswer: "low temperature and high pressure" },
      { id: "1.5-32", text: "At high pressure, one reason real gases deviate is because:", options: ["molecules have no volume", "molecules take up a significant fraction of container volume", "pressure becomes independent of collisions", "temperature stops affecting kinetic energy"], correctAnswer: "molecules take up a significant fraction of container volume" },
      { id: "1.5-33", text: "At low temperature, real gas pressure can be lower than ideal because:", options: ["intermolecular attractions reduce collisions with the walls", "molecules repel strongly", "molecules become ions", "R changes value"], correctAnswer: "intermolecular attractions reduce collisions with the walls" },
      { id: "1.5-34", text: "In the kinetic theory, the temperature of a gas is proportional to:", options: ["average kinetic energy of the molecules", "average potential energy only", "the volume of the container only", "the molar mass only"], correctAnswer: "average kinetic energy of the molecules" },
      { id: "1.5-35", text: "A gas that closely follows kinetic theory assumptions is called:", options: ["a plasma", "a real gas", "an ideal gas", "a solid"], correctAnswer: "an ideal gas" },
      { id: "1.5-36", text: "For a fixed amount of gas, if T increases and V is constant, P will:", options: ["decrease", "increase", "stay the same", "become inversely proportional to T"], correctAnswer: "increase" },
      { id: "1.5-37", text: "For a fixed amount of gas, if P is constant and T increases, V will:", options: ["decrease", "increase", "stay constant", "become zero"], correctAnswer: "increase" },
      { id: "1.5-38", text: "For a fixed amount of gas, if T is constant and V decreases, P will:", options: ["decrease", "increase", "stay constant", "not change because n changes"], correctAnswer: "increase" },
      { id: "1.5-39", text: "Which of the following must be kept constant for Boyle’s law?", options: ["pressure", "volume", "temperature", "number of collisions"], correctAnswer: "temperature" },
      { id: "1.5-40", text: "Which of the following must be kept constant for Charles’ law?", options: ["pressure", "volume", "number of moles", "kinetic energy"], correctAnswer: "pressure" },
      { id: "1.5-41", text: "Which of the following must be kept constant for the pressure law (P ∝ T)?", options: ["pressure", "temperature", "volume", "wavelength"], correctAnswer: "volume" },
      { id: "1.5-42", text: "In PV = nRT, if n increases while P and T are constant, V will:", options: ["decrease", "increase", "stay constant", "become inversely proportional to n"], correctAnswer: "increase" },
      { id: "1.5-43", text: "If P is in Pa and V is in m³, then PV has units of:", options: ["mol", "K", "J", "dm³"], correctAnswer: "J" },
      { id: "1.5-44", text: "Why is using Kelvin necessary in gas laws?", options: ["Celsius cannot be measured", "Kelvin is an absolute scale proportional to kinetic energy", "Kelvin gives smaller numbers", "Kelvin cancels pressure"], correctAnswer: "Kelvin is an absolute scale proportional to kinetic energy" },
      { id: "1.5-45", text: "A sample of gas is heated. The average kinetic energy of molecules:", options: ["decrease", "increase", "stay constant", "become zero"], correctAnswer: "increase" },
      { id: "1.5-46", text: "If a gas deviates from ideal behaviour, which assumption is most likely failing?", options: ["molecules have mass", "molecules have no volume and no intermolecular forces", "molecules move randomly", "molecules collide with walls"], correctAnswer: "molecules have no volume and no intermolecular forces" },
      { id: "1.5-47", text: "Which statement is correct about ideal gases?", options: ["They exist only at STP", "They perfectly follow all kinetic theory assumptions", "They always have strong intermolecular forces", "They are liquids"], correctAnswer: "They perfectly follow all kinetic theory assumptions" },
      { id: "1.5-48", text: "Which condition increases deviation from ideal gas behaviour?", options: ["increasing temperature", "decreasing pressure", "increasing pressure", "decreasing molar mass"], correctAnswer: "increasing pressure" },
      { id: "1.5-49", text: "Which condition increases deviation from ideal gas behaviour?", options: ["increasing temperature", "decreasing temperature", "decreasing pressure", "decreasing volume only at high temperature"], correctAnswer: "decreasing temperature" }
    ]
  },
  {
    id: 6,
    title: "S2.1 — The ionic model",
    description: "Bonding between metals and non-metals.",
    color: "bg-teal-500",
    category: 'structure',
    concepts: ["Electrostatic attraction and lattice structures."],
    vocab: [],
    questions: []
  },
  {
    id: 7,
    title: "S2.2 — The covalent model",
    description: "Sharing of electrons between non-metals.",
    color: "bg-sky-500",
    category: 'structure',
    concepts: ["Lewis structures and molecular geometry."],
    vocab: [],
    questions: []
  },
  {
    id: 8,
    title: "S2.3 — The metallic model",
    description: "Bonding in metals.",
    color: "bg-slate-500",
    category: 'structure',
    concepts: ["Sea of delocalized electrons."],
    vocab: [],
    questions: []
  },
  {
    id: 9,
    title: "S2.4 — From models to materials",
    description: "How bonding models explain material properties.",
    color: "bg-gray-500",
    category: 'structure',
    concepts: ["Physical properties and bonding types."],
    vocab: [],
    questions: []
  },
  {
    id: 10,
    title: "S3.1 — The periodic table: classification of elements",
    description: "Trends and patterns in the periodic table.",
    color: "bg-rose-500",
    category: 'structure',
    concepts: ["Groups, periods, and periodic trends."],
    vocab: [],
    questions: []
  },
  {
    id: 11,
    title: "S3.2 — Functional groups: classification of organic compounds",
    description: "Identifying organic molecules by their functional groups.",
    color: "bg-orange-500",
    category: 'structure',
    concepts: ["Alkanes, alkenes, alcohols, etc."],
    vocab: [],
    questions: []
  },
  {
    id: 12,
    title: "R1.1 — Measuring enthalpy changes",
    description: "Quantifying heat energy in chemical reactions.",
    color: "bg-red-500",
    category: 'reactivity',
    concepts: ["Calorimetry and enthalpy."],
    vocab: [],
    questions: []
  },
  {
    id: 13,
    title: "R1.2 — Energy cycles in reactions",
    description: "Using Hess's Law and energy cycles.",
    color: "bg-orange-600",
    category: 'reactivity',
    concepts: ["Hess's Law and bond enthalpies."],
    vocab: [],
    questions: []
  },
  {
    id: 14,
    title: "R1.3 — Energy from fuels",
    description: "Combustion and energy production.",
    color: "bg-yellow-600",
    category: 'reactivity',
    concepts: ["Fuel efficiency and combustion."],
    vocab: [],
    questions: []
  },
  {
    id: 15,
    title: "R1.4 — Entropy and spontaneity (additional higher level)",
    description: "Predicting if a reaction will occur spontaneously.",
    color: "bg-lime-600",
    category: 'reactivity',
    concepts: ["Entropy and Gibbs free energy."],
    vocab: [],
    questions: []
  },
  {
    id: 16,
    title: "R2.1 — How much? the amount of chemical change",
    description: "Stoichiometry and yield calculations.",
    color: "bg-emerald-600",
    category: 'reactivity',
    concepts: ["Limiting reactants and percentage yield."],
    vocab: [],
    questions: []
  },
  {
    id: 17,
    title: "R2.2 — How fast? the rate of chemical change",
    description: "Factors affecting reaction speed.",
    color: "bg-teal-600",
    category: 'reactivity',
    concepts: ["Collision theory and activation energy."],
    vocab: [],
    questions: []
  },
  {
    id: 18,
    title: "R2.3 — How far? the extent of chemical change",
    description: "Chemical equilibrium and its position.",
    color: "bg-cyan-600",
    category: 'reactivity',
    concepts: ["Equilibrium constant and Le Chatelier's principle."],
    vocab: [],
    questions: []
  },
  {
    id: 19,
    title: "R3.1 — Proton transfer reactions",
    description: "Acids and bases in chemical reactions.",
    color: "bg-blue-600",
    category: 'reactivity',
    concepts: [
      "Brønsted–Lowry acid: proton (H⁺) donor.",
      "Brønsted–Lowry base: proton (H⁺) acceptor (uses a lone pair).",
      "In aqueous solutions, H⁺ is commonly written as H₃O⁺ (hydronium).",
      "Conjugate acid–base pair: two species that differ by exactly one H⁺.",
      "Amphiprotic species: can both donate and accept H⁺ (e.g. H₂O).",
      "Amphoteric substance: can behave as an acid or base (not necessarily via H⁺ transfer). Example: Al₂O₃ reacts with acids and bases.",
      "pH: pH = −log₁₀[H⁺] where [H⁺] is in mol dm⁻³.",
      "[H⁺] = 10^(−pH).",
      "pOH: pOH = −log₁₀[OH⁻].",
      "At 298 K: Kᵥ (K₍w₎) = [H⁺][OH⁻] = 1.00 × 10⁻¹⁴.",
      "At 298 K: pH + pOH = 14.",
      "Strong acid/base: (almost) complete dissociation in water.",
      "Weak acid/base: partial dissociation; equilibrium established.",
      "Strong acid → very weak conjugate base.",
      "Weak acid → relatively stronger conjugate base.",
      "Neutralisation: acid + base → salt + water; net ionic: H⁺(aq) + OH⁻(aq) → H₂O(l).",
      "Salt hydrolysis: ions from salts may react with water, affecting pH (depends on parent acid/base strengths).",
      "Indicators are weak acids/bases with differently coloured conjugate forms; colour change occurs over a pH range (typically pKₐ ± 1).",
      "Choosing indicators: match indicator transition range to steep pH change near equivalence point.",
      "Buffer: resists pH change; made from weak acid + its conjugate base, or weak base + its conjugate acid.",
      "Henderson–Hasselbalch (acidic buffer): pH = pKₐ + log₁₀([A⁻]/[HA]).",
      "Henderson–Hasselbalch (basic buffer): pOH = pK_b + log₁₀([BH⁺]/[B]); then pH = 14 − pOH (at 298 K)."
    ],
    vocab: [
      { term: "Brønsted–Lowry acid", traditional: "布忍斯特-洛里酸", simplified: "布忍斯特-洛里酸", definition: "proton donor, H⁺, dissociation, H₃O⁺" },
      { term: "Brønsted–Lowry base", traditional: "布忍斯特-洛里鹼", simplified: "布忍斯特-洛里碱", definition: "proton acceptor, lone pair, NH₃" },
      { term: "Conjugate pair", traditional: "共軛對", simplified: "共轭对", definition: "differs by one H⁺, related species" },
      { term: "Amphiprotic", traditional: "兩性質子", simplified: "两性质子", definition: "donor and acceptor, H₂O, HCO₃⁻, H₂PO₄⁻" },
      { term: "Amphoteric", traditional: "兩性", simplified: "两性", definition: "reacts with acids and bases, Al₂O₃, ZnO" },
      { term: "pH", traditional: "pH值", simplified: "pH值", definition: "−log[H⁺], logarithmic scale, 0–14 (typical)" },
      { term: "K₍w₎", traditional: "水的離子積", simplified: "水的离子积", definition: "[H⁺][OH⁻], 1.00×10⁻¹⁴ at 298 K, temperature dependence" },
      { term: "Strong acid/base", traditional: "強酸/強鹼", simplified: "强酸/强碱", definition: "complete dissociation, high conductivity" },
      { term: "Weak acid/base", traditional: "弱酸/弱鹼", simplified: "弱酸/弱碱", definition: "equilibrium, Kₐ/K_b, buffer region in titration" },
      { term: "Neutralisation", traditional: "中和反應", simplified: "中和反应", definition: "salt + water, enthalpy of neutralisation ≈ −57 kJ mol⁻¹ (strong acid + strong base)" },
      { term: "Indicator", traditional: "指示劑", simplified: "指示剂", definition: "weak acid/base, colour change range, endpoint vs equivalence point" },
      { term: "Buffer", traditional: "緩衝溶液", simplified: "缓冲溶液", definition: "resists pH change, conjugate pair mixture, buffer capacity" }
    ],
    questions: [
      { id: "3.1-1", text: "In Brønsted–Lowry theory, an acid is a species that:", options: ["Accepts an electron pair", "Donates a proton", "Donates a hydroxide ion", "Accepts a proton"], correctAnswer: "Donates a proton" },
      { id: "3.1-2", text: "A Brønsted–Lowry base is best described as a species that:", options: ["Accepts a proton using a lone pair", "Donates a proton to water only", "Produces OH⁻ in every reaction", "Accepts an electron pair only in water"], correctAnswer: "Accepts a proton using a lone pair" },
      { id: "3.1-3", text: "Which pair differs by exactly one proton and is therefore a conjugate acid–base pair?", options: ["H₂O and O₂", "HCl and Cl⁻", "Na⁺ and Na", "NH₃ and NO₃⁻"], correctAnswer: "HCl and Cl⁻" },
      { id: "3.1-4", text: "In the reaction HCl(g) + H₂O(l) → H₃O⁺(aq) + Cl⁻(aq), H₂O acts as:", options: ["An acid", "A base", "Neither acid nor base", "An oxidising agent"], correctAnswer: "A base" },
      { id: "3.1-5", text: "Which species is amphiprotic?", options: ["Cl⁻", "Na⁺", "H₂O", "CH₃COO⁻"], correctAnswer: "H₂O" },
      { id: "3.1-6", text: "Amphoteric substances:", options: ["Must donate and accept H⁺", "Can behave as acids or bases, not necessarily via H⁺ transfer", "Only react with acids", "Only react with bases"], correctAnswer: "Can behave as acids or bases, not necessarily via H⁺ transfer" },
      { id: "3.1-7", text: "Which statement about pH is correct?", options: ["pH = log₁₀[H⁺]", "pH = −log₁₀[H⁺]", "pH = −log₁₀[OH⁻]", "pH = log₁₀[OH⁻]"], correctAnswer: "pH = −log₁₀[H⁺]" },
      { id: "3.1-8", text: "If pH = 3.00, [H⁺] is:", options: ["3.00 mol dm⁻³", "1.00 × 10⁻³ mol dm⁻³", "1.00 × 10³ mol dm⁻³", "3.00 × 10⁻³ mol dm⁻³"], correctAnswer: "1.00 × 10⁻³ mol dm⁻³" },
      { id: "3.1-9", text: "At 298 K, K₍w₎ equals:", options: ["1.00 × 10⁻⁷", "1.00 × 10⁻¹⁴", "14", "7"], correctAnswer: "1.00 × 10⁻¹⁴" },
      { id: "3.1-10", text: "At 298 K, if [OH⁻] = 1.0 × 10⁻³ mol dm⁻³, then [H⁺] is:", options: ["1.0 × 10⁻¹¹", "1.0 × 10⁻³", "1.0 × 10⁻⁷", "1.0 × 10⁻¹"], correctAnswer: "1.0 × 10⁻¹¹" },
      { id: "3.1-11", text: "For an acidic solution at 298 K:", options: ["[H⁺] = [OH⁻]", "[H⁺] > [OH⁻]", "[H⁺] < [OH⁻]", "[H⁺][OH⁻] > 1.0 × 10⁻¹⁴"], correctAnswer: "[H⁺] > [OH⁻]" },
      { id: "3.1-12", text: "Which is true for pure water at 298 K?", options: ["pH = 0", "pH = 14", "pH = 7", "pH depends only on pressure"], correctAnswer: "pH = 7" },
      { id: "3.1-13", text: "Increasing temperature generally increases K₍w₎ because water ionisation is:", options: ["Exothermic", "Endothermic", "Catalytic", "Photochemical"], correctAnswer: "Endothermic" },
      { id: "3.1-14", text: "At temperatures above 298 K, pure water has pH < 7 but remains neutral because:", options: ["[H⁺] = 0", "[OH⁻] = 0", "[H⁺] = [OH⁻]", "K₍w₎ decreases"], correctAnswer: "[H⁺] = [OH⁻]" },
      { id: "3.1-15", text: "A strong acid is one that:", options: ["Has high concentration", "Dissociates almost completely", "Has pH always below 1", "Reacts only with bases"], correctAnswer: "Dissociates almost completely" },
      { id: "3.1-16", text: "A weak acid compared with a strong acid of the same concentration generally has:", options: ["Lower pH", "Higher [H⁺]", "Higher pH", "Complete dissociation"], correctAnswer: "Higher pH" },
      { id: "3.1-17", text: "The terms “concentrated” and “dilute” refer to:", options: ["Degree of dissociation", "Strength of an acid", "Amount of solute per unit volume", "pKₐ value"], correctAnswer: "Amount of solute per unit volume" },
      { id: "3.1-18", text: "In general, a strong acid produces a conjugate base that is:", options: ["Strong", "Weak", "Amphiprotic", "Insoluble"], correctAnswer: "Weak" },
      { id: "3.1-19", text: "Which acid strength order is correct for hydrogen halides?", options: ["HI < HBr < HCl < HF", "HF < HCl < HBr < HI", "HF < HI < HBr < HCl", "HCl < HF < HI < HBr"], correctAnswer: "HF < HCl < HBr < HI" },
      { id: "3.1-20", text: "A neutralisation reaction always produces:", options: ["Salt only", "Water only", "Water and a salt", "Hydrogen gas and a salt"], correctAnswer: "Water and a salt" },
      { id: "3.1-21", text: "Net ionic equation for strong acid + strong base neutralisation is:", options: ["Na⁺ + Cl⁻ → NaCl", "H⁺ + Cl⁻ → HCl", "H⁺ + OH⁻ → H₂O", "OH⁻ + Na⁺ → NaOH"], correctAnswer: "H⁺ + OH⁻ → H₂O" },
      { id: "3.1-22", text: "Reaction of an acid with a metal carbonate typically produces:", options: ["Salt + water", "Salt + hydrogen", "Salt + water + carbon dioxide", "Salt + oxygen"], correctAnswer: "Salt + water + carbon dioxide" },
      { id: "3.1-23", text: "Which is an example of a strong base?", options: ["NH₃", "NaOH", "CH₃NH₂", "Al(OH)₃"], correctAnswer: "NaOH" },
      { id: "3.1-24", text: "A strong base in water has equilibrium position:", options: ["Far to the left", "Far to the right", "Exactly in the middle", "No equilibrium exists in solution"], correctAnswer: "Far to the right" },
      { id: "3.1-25", text: "Conductivity of solutions at the same concentration is highest for:", options: ["Weak acids", "Strong acids", "Pure water", "Non-electrolytes"], correctAnswer: "Strong acids" },
      { id: "3.1-26", text: "A titration curve equivalence point is:", options: ["Where indicator changes colour", "Where pH = 7 always", "Where stoichiometrically equal moles have reacted", "Where solution becomes colourless"], correctAnswer: "Where stoichiometrically equal moles have reacted" },
      { id: "3.1-27", text: "Strong acid–strong base titration equivalence point (at 298 K) is typically near:", options: ["pH 3", "pH 5", "pH 7", "pH 11"], correctAnswer: "pH 7" },
      { id: "3.1-28", text: "Weak acid–strong base titration equivalence point is typically:", options: ["Below 7", "At 7", "Above 7", "Always at pH 14"], correctAnswer: "Above 7" },
      { id: "3.1-29", text: "Strong acid–weak base titration equivalence point is typically:", options: ["Above 7", "At 7", "Below 7", "Unmeasurable"], correctAnswer: "Below 7" },
      { id: "3.1-30", text: "In a weak acid–strong base titration, the half-equivalence point satisfies:", options: ["[HA] = 0", "[A⁻] = 0", "[HA] = [A⁻]", "pH = 7"], correctAnswer: "[HA] = [A⁻]" },
      { id: "3.1-31", text: "In a weak acid–strong base titration, pH at half-equivalence equals:", options: ["pKₐ", "pK_b", "pK_w", "14"], correctAnswer: "pKₐ" },
      { id: "3.1-32", text: "Which indicator is generally suitable for weak acid–strong base titrations?", options: ["Methyl orange", "Bromophenol blue", "Methyl red", "Phenolphthalein"], correctAnswer: "Phenolphthalein" },
      { id: "3.1-33", text: "For strong acid–strong base titration, suitable indicators include:", options: ["Only phenolphthalein", "Only methyl orange", "Methyl red and phenolphthalein", "No indicators"], correctAnswer: "Methyl red and phenolphthalein" },
      { id: "3.1-34", text: "An indicator is typically a:", options: ["Strong acid", "Weak acid or weak base with different coloured forms", "Neutral salt", "Catalyst"], correctAnswer: "Weak acid or weak base with different coloured forms" },
      { id: "3.1-35", text: "For an indicator HIn ⇌ H⁺ + In⁻, the endpoint occurs approximately when:", options: ["[HIn] ≫ [In⁻]", "[HIn] = [In⁻]", "[H⁺] = 0", "[OH⁻] = 0"], correctAnswer: "[HIn] = [In⁻]" },
      { id: "3.1-36", text: "Therefore, at the endpoint of a weak acid indicator, pH ≈:", options: ["Kₐ", "pKₐ", "K_b", "pK_w"], correctAnswer: "pKₐ" },
      { id: "3.1-37", text: "A buffer solution contains significant amounts of:", options: ["A strong acid and its conjugate base", "A strong base and its conjugate acid", "A weak acid and its conjugate base", "Only neutral salt"], correctAnswer: "A weak acid and its conjugate base" },
      { id: "3.1-38", text: "Which mixture makes an acidic buffer?", options: ["HCl + NaCl", "CH₃COOH + CH₃COONa", "NaOH + NaCl", "HNO₃ + KNO₃"], correctAnswer: "CH₃COOH + CH₃COONa" },
      { id: "3.1-39", text: "Which mixture makes a basic buffer?", options: ["NH₃ + NH₄Cl", "HCl + NaCl", "NaOH + NaCl", "CH₃COOH + NaCl"], correctAnswer: "NH₃ + NH₄Cl" },
      { id: "3.1-40", text: "Henderson–Hasselbalch for an acidic buffer is:", options: ["pH = pKₐ + log([A⁻]/[HA])", "pH = pKₐ − log([A⁻]/[HA])", "pH = −log([A⁻]/[HA])", "pH = pK_w + log([A⁻]/[HA])"], correctAnswer: "pH = pKₐ + log([A⁻]/[HA])" },
      { id: "3.1-41", text: "If [A⁻] increases while [HA] constant (buffer), pH:", options: ["Decreases", "Increases", "Stays exactly 7", "Becomes undefined"], correctAnswer: "Increases" },
      { id: "3.1-42", text: "Adding a small amount of H⁺ to CH₃COOH/CH₃COO⁻ buffer mainly causes:", options: ["CH₃COOH → CH₃COO⁻ + H⁺", "CH₃COO⁻ + H⁺ → CH₃COOH", "H⁺ + OH⁻ → H₂O only", "No reaction"], correctAnswer: "CH₃COO⁻ + H⁺ → CH₃COOH" },
      { id: "3.1-43", text: "Adding a small amount of OH⁻ to CH₃COOH/CH₃COO⁻ buffer mainly causes:", options: ["OH⁻ + H⁺ → H₂O, shifting equilibrium to form more H⁺", "OH⁻ oxidises acetate", "OH⁻ precipitates sodium ions", "pH always stays exactly constant"], correctAnswer: "OH⁻ + H⁺ → H₂O, shifting equilibrium to form more H⁺" },
      { id: "3.1-44", text: "Dilution of a buffer generally causes pH to:", options: ["Change greatly", "Change only slightly (ratio similar), but capacity decreases", "Become 7", "Become 14"], correctAnswer: "Change only slightly (ratio similar), but capacity decreases" },
      { id: "3.1-45", text: "A salt made from strong acid + strong base typically gives a solution that is:", options: ["Acidic", "Basic", "Neutral", "Always a buffer"], correctAnswer: "Neutral" },
      { id: "3.1-46", text: "A salt made from strong acid + weak base typically gives a solution that is:", options: ["Neutral", "Basic", "Acidic", "Always pH 3"], correctAnswer: "Acidic" },
      { id: "3.1-47", text: "A salt made from weak acid + strong base typically gives a solution that is:", options: ["Acidic", "Basic", "Neutral", "Always pH 7"], correctAnswer: "Basic" },
      { id: "3.1-48", text: "Small highly charged metal ions (e.g. Al³⁺) can make solutions acidic because they:", options: ["Donate OH⁻", "Hydrolyse coordinated water, releasing H⁺", "React with Cl⁻ to form HCl", "Always act as strong bases"], correctAnswer: "Hydrolyse coordinated water, releasing H⁺" },
      { id: "3.1-49", text: "Which statement about pKₐ is correct?", options: ["Higher pKₐ means stronger acid", "Higher pKₐ means weaker acid", "pKₐ = logKₐ", "pKₐ is only for strong acids"], correctAnswer: "Higher pKₐ means weaker acid" },
      { id: "3.1-50", text: "For a conjugate acid–base pair at 298 K, the relationship between Kₐ and K_b is:", options: ["Kₐ + K_b = K₍w₎", "Kₐ × K_b = K₍w₎", "Kₐ = K_b", "Kₐ − K_b = K₍w₎"], correctAnswer: "Kₐ × K_b = K₍w₎" }
    ]
  },
  {
    id: 20,
    title: "R3.2 — Electron transfer reactions",
    description: "Oxidation and reduction processes.",
    color: "bg-indigo-600",
    category: 'reactivity',
    concepts: [
      "Oxidising agent: causes another species to lose electrons; oxidising agent is reduced (oxidation number decreases).",
      "Reducing agent: causes another species to gain electrons; reducing agent is oxidised (oxidation number increases).",
      "Oxidation: loss of electrons (often gain of oxygen or loss of hydrogen).",
      "Reduction: gain of electrons (often loss of oxygen or gain of hydrogen).",
      "Half-equation: equation showing oxidation or reduction separately.",
      "Redox titration: titration where electrons transfer between oxidant and reductant.",
      "Voltaic (galvanic) cell: generates electrical energy from a spontaneous redox reaction.",
      "Electrolytic cell: uses electrical energy to drive a non-spontaneous reaction.",
      "Electrode: solid conductor where oxidation/reduction occurs.",
      "Anode: electrode where oxidation occurs.",
      "Cathode: electrode where reduction occurs.",
      "Salt bridge: allows ion flow to complete circuit and maintain charge balance.",
      "Electrode potential (E): potential difference between an electrode and its ions in solution at equilibrium.",
      "Standard hydrogen electrode (SHE): reference half-cell with E° = 0.00 V.",
      "Standard electrode potential (E°): electrode potential measured under standard conditions.",
      "Standard conditions (for E°): 298 K, 100 kPa gases, 1.0 mol dm⁻³ solutions.",
      "Cell potential / EMF (E_cell or ΔE): potential difference of a complete cell.",
      "EMF calculation: E_cell = E°(right) − E°(left) (equivalently, E°(cathode) − E°(anode)).",
      "Spontaneity (standard conditions): E_cell > 0 means reaction is spontaneous as written.",
      "Free energy link (HL): ΔG° = −nF E° (n = electrons transferred; F = 96 500 C mol⁻¹).",
      "Primary cell: single-use; not rechargeable.",
      "Secondary cell: rechargeable; reaction can be reversed by applying voltage.",
      "Electrolysis: decomposition using electricity; ions migrate to electrodes.",
      "Aqueous electrolysis (HL): water can be oxidised/reduced; products depend on E° values, ion concentration, and electrode identity.",
      "Active electrode: participates in redox (e.g., Cu anode dissolves in CuSO₄ electrolysis).",
      "Inert electrode: does not participate (e.g., Pt, graphite).",
      "Oxidation of alcohols: 1° alcohol → aldehyde → carboxylic acid; 2° alcohol → ketone; 3° alcohol: no oxidation (typical conditions).",
      "Reducing agents (organic): LiAlH₄ (strong; can reduce carboxylic acids), NaBH₄ (milder; cannot reduce carboxylic acids).",
      "Hydrogenation: reduction of C=C / C≡C using H₂ with a catalyst (e.g., Ni)."
    ],
    vocab: [
      { term: "Oxidising agent", traditional: "氧化劑", simplified: "氧化剂", definition: "accepts e⁻, is reduced, oxidation number decreases" },
      { term: "Reducing agent", traditional: "還原劑", simplified: "还原剂", definition: "donates e⁻, is oxidised, oxidation number increases" },
      { term: "Voltaic cell", traditional: "伏打電池", simplified: "伏打电池", definition: "spontaneous, anode (−), cathode (+)" },
      { term: "Electrolytic cell", traditional: "電解池", simplified: "电解池", definition: "non-spontaneous, anode (+), cathode (−)" },
      { term: "Anode", traditional: "陽極", simplified: "阳极", definition: "oxidation, electrons produced" },
      { term: "Cathode", traditional: "陰極", simplified: "阴极", definition: "reduction, electrons consumed" },
      { term: "Salt bridge", traditional: "鹽橋", simplified: "盐桥", definition: "ion migration, charge balance, completes circuit" },
      { term: "E° more positive", traditional: "E° 更正", simplified: "E° 更正", definition: "more easily reduced, stronger oxidising agent" },
      { term: "E° more negative", traditional: "E° 更負", simplified: "E° 更负", definition: "more easily oxidised, stronger reducing agent" },
      { term: "Aqueous electrolysis factors", traditional: "水溶液電解因素", simplified: "水溶液电解因素", definition: "E°, concentration, electrode material" },
      { term: "ΔG° sign", traditional: "ΔG° 符號", simplified: "ΔG° 符号", definition: "E° sign (ΔG° = −nF E°)" }
    ],
    questions: [
      {
        id: "3.2-1",
        text: "An oxidising agent is best defined as a species that:",
        options: ["donates electrons and is reduced", "accepts electrons and is reduced", "accepts electrons and is oxidised", "donates electrons and is oxidised"],
        correctAnswer: "accepts electrons and is reduced"
      },
      {
        id: "3.2-2",
        text: "In a redox reaction, the reducing agent is the species that:",
        options: ["gains electrons", "loses electrons", "decreases oxidation number", "is reduced"],
        correctAnswer: "loses electrons"
      },
      {
        id: "3.2-3",
        text: "Which change indicates oxidation?",
        options: ["+3 to +2", "+2 to 0", "0 to +2", "+7 to +6"],
        correctAnswer: "0 to +2"
      },
      {
        id: "3.2-4",
        text: "Which change indicates reduction?",
        options: ["0 to +1", "+2 to +3", "−1 to 0", "+2 to +4"],
        correctAnswer: "−1 to 0"
      },
      {
        id: "3.2-5",
        text: "Which statement is always true about a redox reaction?",
        options: ["Only oxidation occurs", "Only reduction occurs", "Oxidation and reduction occur simultaneously", "No electrons are transferred"],
        correctAnswer: "Oxidation and reduction occur simultaneously"
      },
      {
        id: "3.2-6",
        text: "The half-equation for oxidation of iron(II) to iron(III) is:",
        options: ["Fe²⁺ + e⁻ → Fe³⁺", "Fe³⁺ + e⁻ → Fe²⁺", "Fe²⁺ → Fe³⁺ + e⁻", "Fe³⁺ → Fe²⁺ + e⁻"],
        correctAnswer: "Fe²⁺ → Fe³⁺ + e⁻"
      },
      {
        id: "3.2-7",
        text: "In acidic solution, the reduction half-equation for MnO₄⁻ to Mn²⁺ is:",
        options: ["MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O", "MnO₄⁻ + 4H⁺ + 3e⁻ → MnO₂ + 2H₂O", "MnO₄⁻ + e⁻ → MnO₄²⁻", "MnO₄⁻ + 2H₂O + 3e⁻ → MnO₂ + 4OH⁻"],
        correctAnswer: "MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O"
      },
      {
        id: "3.2-8",
        text: "In a manganate(VII) titration with Fe²⁺ in acid, the ratio MnO₄⁻ : Fe²⁺ is:",
        options: ["1:1", "1:2", "1:5", "5:1"],
        correctAnswer: "1:5"
      },
      {
        id: "3.2-9",
        text: "In iodine–thiosulfate titrations, thiosulfate ions reduce iodine to iodide. The balanced overall equation is:",
        options: ["S₂O₃²⁻ + I₂ → I⁻ + S₄O₆²⁻", "2S₂O₃²⁻ + I₂ → 2I⁻ + S₄O₆²⁻", "S₂O₃²⁻ + 2I⁻ → I₂ + S₄O₆²⁻", "2S₂O₃²⁻ + 2I⁻ → I₂ + S₄O₆²⁻"],
        correctAnswer: "2S₂O₃²⁻ + I₂ → 2I⁻ + S₄O₆²⁻"
      },
      {
        id: "3.2-10",
        text: "In a voltaic (galvanic) cell, the anode is:",
        options: ["positive and site of reduction", "positive and site of oxidation", "negative and site of oxidation", "negative and site of reduction"],
        correctAnswer: "negative and site of oxidation"
      },
      {
        id: "3.2-11",
        text: "In an electrolytic cell, the anode is:",
        options: ["negative and site of oxidation", "negative and site of reduction", "positive and site of oxidation", "positive and site of reduction"],
        correctAnswer: "positive and site of oxidation"
      },
      {
        id: "3.2-12",
        text: "RED CAT helps you remember that:",
        options: ["oxidation occurs at the cathode", "reduction occurs at the cathode", "reduction occurs at the anode", "oxidation occurs at the salt bridge"],
        correctAnswer: "reduction occurs at the cathode"
      },
      {
        id: "3.2-13",
        text: "The purpose of a salt bridge in a voltaic cell is primarily to:",
        options: ["provide electrons to the circuit", "prevent any ion movement", "allow ion flow to maintain charge balance", "increase the concentration of metal ions"],
        correctAnswer: "allow ion flow to maintain charge balance"
      },
      {
        id: "3.2-14",
        text: "In the Daniell cell Zn(s)|Zn²⁺||Cu²⁺|Cu(s), electrons flow from:",
        options: ["Cu to Zn", "Zn to Cu", "salt bridge to Cu", "Cu²⁺ to Zn²⁺"],
        correctAnswer: "Zn to Cu"
      },
      {
        id: "3.2-15",
        text: "In the cell Zn(s)|Zn²⁺||Cu²⁺|Cu(s), the overall spontaneous reaction is:",
        options: ["Zn²⁺ + Cu → Zn + Cu²⁺", "Zn + Cu²⁺ → Zn²⁺ + Cu", "Zn + Cu → Zn²⁺ + Cu²⁺", "Zn²⁺ + Cu²⁺ → Zn + Cu"],
        correctAnswer: "Zn + Cu²⁺ → Zn²⁺ + Cu"
      },
      {
        id: "3.2-16",
        text: "Standard electrode potentials are measured relative to the:",
        options: ["standard lithium electrode", "standard copper electrode", "standard hydrogen electrode", "standard silver electrode"],
        correctAnswer: "standard hydrogen electrode"
      },
      {
        id: "3.2-17",
        text: "The standard hydrogen electrode has an assigned value of:",
        options: ["+1.00 V", "0.00 V", "−1.00 V", "depends on temperature only"],
        correctAnswer: "0.00 V"
      },
      {
        id: "3.2-18",
        text: "Standard electrode potential measurements require (among others):",
        options: ["273 K and 1 atm", "298 K and 1.0 mol dm⁻³", "310 K and 0.1 mol dm⁻³", "298 K and 0.10 mol dm⁻³"],
        correctAnswer: "298 K and 1.0 mol dm⁻³"
      },
      {
        id: "3.2-19",
        text: "Using the convention in these notes, the EMF is calculated as:",
        options: ["E_left − E_right", "E_right − E_left", "E_anode + E_cathode", "E_cathode − E_right"],
        correctAnswer: "E_right − E_left"
      },
      {
        id: "3.2-20",
        text: "A positive E_cell under standard conditions indicates that:",
        options: ["the forward reaction is spontaneous as written", "the reverse reaction is spontaneous as written", "the reaction is at equilibrium", "the reaction rate must be fast"],
        correctAnswer: "the forward reaction is spontaneous as written"
      },
      {
        id: "3.2-21",
        text: "A more positive E° value generally indicates the species is:",
        options: ["a better reducing agent", "less easily reduced", "more easily reduced and a better oxidising agent", "always a metal"],
        correctAnswer: "more easily reduced and a better oxidising agent"
      },
      {
        id: "3.2-22",
        text: "A more negative E° value generally indicates the species is:",
        options: ["more easily oxidised and a better reducing agent", "more easily reduced and a better oxidising agent", "always a non-metal", "unable to participate in redox"],
        correctAnswer: "more easily oxidised and a better reducing agent"
      },
      {
        id: "3.2-23",
        text: "The equation linking free energy and standard cell potential is:",
        options: ["ΔG° = +nFE°", "ΔG° = −nFE°", "ΔG° = −(n/F)E°", "ΔG° = −E°/nF"],
        correctAnswer: "ΔG° = −nFE°"
      },
      {
        id: "3.2-24",
        text: "In ΔG° = −nFE°, n represents:",
        options: ["number of moles of solution", "number of electrons transferred", "number of half-cells", "number of ions in the salt bridge"],
        correctAnswer: "number of electrons transferred"
      },
      {
        id: "3.2-25",
        text: "The Faraday constant F is approximately:",
        options: ["9.65 × 10² C mol⁻¹", "9.65 × 10³ C mol⁻¹", "9.65 × 10⁴ C mol⁻¹", "9.65 × 10⁵ C mol⁻¹"],
        correctAnswer: "9.65 × 10⁴ C mol⁻¹"
      },
      {
        id: "3.2-26",
        text: "If E° is positive, ΔG° is:",
        options: ["positive", "negative", "zero", "undefined"],
        correctAnswer: "negative"
      },
      {
        id: "3.2-27",
        text: "Which is a key difference between a primary cell and a secondary cell?",
        options: ["Primary cells are rechargeable", "Secondary cells are not rechargeable", "Secondary cells can be recharged by reversing the reaction", "Primary cells require a salt bridge"],
        correctAnswer: "Secondary cells can be recharged by reversing the reaction"
      },
      {
        id: "3.2-28",
        text: "In a lead-acid battery on discharge, the negative electrode is primarily:",
        options: ["PbO₂", "Pb", "Pt", "graphite"],
        correctAnswer: "Pb"
      },
      {
        id: "3.2-29",
        text: "In a lead-acid battery, the electrolyte is:",
        options: ["NaOH(aq)", "H₂SO₄(aq)", "KNO₃(aq)", "HCl(aq)"],
        correctAnswer: "H₂SO₄(aq)"
      },
      {
        id: "3.2-30",
        text: "In electrolysis of molten PbBr₂, the cathode product is:",
        options: ["Br₂", "Pb", "H₂", "O₂"],
        correctAnswer: "Pb"
      },
      {
        id: "3.2-31",
        text: "In electrolysis of molten PbBr₂, the anode product is:",
        options: ["Pb", "Pb²⁺", "Br₂", "Br⁻"],
        correctAnswer: "Br₂"
      },
      {
        id: "3.2-32",
        text: "During electrolysis, anions move to the:",
        options: ["cathode and gain electrons", "cathode and lose electrons", "anode and gain electrons", "anode and lose electrons"],
        correctAnswer: "anode and lose electrons"
      },
      {
        id: "3.2-33",
        text: "During electrolysis, cations move to the:",
        options: ["anode and gain electrons", "cathode and gain electrons", "anode and lose electrons", "cathode and lose electrons"],
        correctAnswer: "cathode and gain electrons"
      },
      {
        id: "3.2-34",
        text: "Which statement about molten salt electrolysis is correct?",
        options: ["Metals form at the anode", "Non-metals form at the cathode", "Metals form at the cathode", "Water is always discharged preferentially"],
        correctAnswer: "Metals form at the cathode"
      },
      {
        id: "3.2-35",
        text: "In aqueous electrolysis, product prediction depends on:",
        options: ["only the electrolyte concentration", "only the electrode material", "E° values, ion concentration, and electrode identity", "only the colour of ions"],
        correctAnswer: "E° values, ion concentration, and electrode identity"
      },
      {
        id: "3.2-36",
        text: "In acidified water electrolysis, hydrogen is produced at the cathode mainly because:",
        options: ["H⁺ has a more favourable reduction than H₂O", "SO₄²⁻ is reduced first", "O₂ is reduced to H₂O", "Na⁺ is reduced first"],
        correctAnswer: "H⁺ has a more favourable reduction than H₂O"
      },
      {
        id: "3.2-37",
        text: "Why is SO₄²⁻ not oxidised at the anode in acidic aqueous electrolysis?",
        options: ["It is insoluble", "Sulfur is already at its maximum oxidation state", "It has a positive charge", "It is a stronger reducing agent than water"],
        correctAnswer: "Sulfur is already at its maximum oxidation state"
      },
      {
        id: "3.2-38",
        text: "In concentrated NaCl(aq) electrolysis, chlorine is produced at the anode mainly due to:",
        options: ["the high concentration of Cl⁻ ions", "Na⁺ being oxidised", "H₂ being oxidised", "sulfate ions being oxidised"],
        correctAnswer: "the high concentration of Cl⁻ ions"
      },
      {
        id: "3.2-39",
        text: "In electrolysis of CuSO₄(aq) using inert electrodes, the cathode product is typically:",
        options: ["H₂", "O₂", "Cu(s)", "SO₂"],
        correctAnswer: "Cu(s)"
      },
      {
        id: "3.2-40",
        text: "In electrolysis of CuSO₄(aq) using inert electrodes, the anode product is typically:",
        options: ["Cu(s)", "O₂(g)", "H₂(g)", "Cl₂(g)"],
        correctAnswer: "O₂(g)"
      },
      {
        id: "3.2-41",
        text: "In electrolysis of CuSO₄(aq) using copper electrodes, the anode reaction is:",
        options: ["Cu²⁺ + 2e⁻ → Cu", "Cu → Cu²⁺ + 2e⁻", "2H₂O → O₂ + 4H⁺ + 4e⁻", "2Cl⁻ → Cl₂ + 2e⁻"],
        correctAnswer: "Cu → Cu²⁺ + 2e⁻"
      },
      {
        id: "3.2-42",
        text: "An electrode that participates in the redox process is called:",
        options: ["passive", "inert", "active", "neutral"],
        correctAnswer: "active"
      },
      {
        id: "3.2-43",
        text: "Primary alcohol oxidation (typical) gives:",
        options: ["ketone only", "aldehyde, then carboxylic acid on further oxidation", "carboxylic acid only", "no reaction"],
        correctAnswer: "aldehyde, then carboxylic acid on further oxidation"
      },
      {
        id: "3.2-44",
        text: "Secondary alcohol oxidation (typical) gives:",
        options: ["aldehyde", "carboxylic acid", "ketone", "ester"],
        correctAnswer: "ketone"
      },
      {
        id: "3.2-45",
        text: "Tertiary alcohols generally do not oxidise under these conditions because:",
        options: ["they contain no oxygen", "there is no hydrogen on the functional group carbon", "they have too low a boiling point", "they always form alkenes instead"],
        correctAnswer: "there is no hydrogen on the functional group carbon"
      },
      {
        id: "3.2-46",
        text: "A common oxidising agent for alcohols in acidic solution is:",
        options: ["NaBH₄", "LiAlH₄", "acidified K₂Cr₂O₇", "H₂/Ni"],
        correctAnswer: "acidified K₂Cr₂O₇"
      },
      {
        id: "3.2-47",
        text: "LiAlH₄ differs from NaBH₄ because LiAlH₄:",
        options: ["cannot reduce aldehydes", "can reduce carboxylic acids", "is used only in water", "is an oxidising agent"],
        correctAnswer: "can reduce carboxylic acids"
      },
      {
        id: "3.2-48",
        text: "Hydrogenation of alkenes typically uses:",
        options: ["H₂ with Ni catalyst", "O₂ with Pt catalyst", "NaBH₄ in water", "acidified KMnO₄"],
        correctAnswer: "H₂ with Ni catalyst"
      },
      {
        id: "3.2-49",
        text: "For an alkyne to be fully hydrogenated to an alkane, it requires:",
        options: ["1 mol H₂ per mol alkyne", "2 mol H₂ per mol alkyne", "3 mol H₂ per mol alkyne", "no hydrogen"],
        correctAnswer: "2 mol H₂ per mol alkyne"
      },
      {
        id: "3.2-50",
        text: "If an experimentally predicted spontaneous cell shows no visible reaction, the best explanation is:",
        options: ["E° is unrelated to feasibility", "kinetics may be too slow despite thermodynamic feasibility", "oxidation and reduction cannot occur together", "the salt bridge prevents any reaction"],
        correctAnswer: "kinetics may be too slow despite thermodynamic feasibility"
      }
    ]
  },
  {
    id: 21,
    title: "R3.3 — Electron sharing reactions",
    description: "Covalent bonding and reactivity.",
    color: "bg-violet-600",
    category: 'reactivity',
    concepts: [
      "Reaction equation: shows reactants and products and their stoichiometry.",
      "Reaction mechanism: shows how a reaction happens, including movement of electrons and intermediate species.",
      "Radical: chemical species with an unpaired electron (shown by a dot •).",
      "Radicals can be atomic (one atom), molecular/polyatomic (group of atoms), and can be neutral or charged.",
      "Single-headed curly arrow: shows movement of one electron (also called fish-hook / half-curly arrow).",
      "Homolytic fission: even breaking of a covalent bond where each atom takes one electron → two radicals form.",
      "Thermolytic fission: homolytic fission caused by heat (more likely for weaker bonds).",
      "Photolytic fission: homolytic fission caused by UV light (often for halogen–halogen bonds).",
      "Free-radical substitution: substitution reaction where a H atom on an alkane is replaced by a halogen via a radical chain mechanism.",
      "Initiation: first step; radicals are generated (e.g., UV splits Cl₂ → 2Cl•).",
      "Propagation: chain “grows”; radicals react to form products and regenerate radicals.",
      "Termination: chain stops; two radicals combine to form a stable molecule.",
      "Why alkanes are unreactive: strong C–C / C–H bonds and nonpolar nature."
    ],
    vocab: [
      { term: "Radical", traditional: "自由基", simplified: "自由基", definition: "unpaired electron, dot notation (•), high reactivity" },
      { term: "Mechanism", traditional: "機理", simplified: "机理", definition: "electron movement, curly arrows, stepwise" },
      { term: "Single-headed arrow", traditional: "單頭彎箭頭", simplified: "单头弯箭头", definition: "one electron, fish-hook, radical mechanisms" },
      { term: "Homolytic fission", traditional: "均裂", simplified: "均裂", definition: "even bond breaking, two radicals, each atom takes 1 e⁻" },
      { term: "Photolytic fission", traditional: "光解", simplified: "光解", definition: "UV light, initiation, X₂ → 2X•" },
      { term: "Thermolytic fission", traditional: "熱解", simplified: "热解", definition: "heat, bond enthalpy, radical formation" },
      { term: "Free-radical substitution", traditional: "自由基取代", simplified: "自由基取代", definition: "alkane + halogen, UV, substitution" },
      { term: "Initiation", traditional: "引發", simplified: "引发", definition: "radicals formed, start of chain" },
      { term: "Propagation", traditional: "增長", simplified: "增长", definition: "H abstraction, alkyl radical, radical regenerated" },
      { term: "Termination", traditional: "終止", simplified: "终止", definition: "radical + radical, stable molecule, chain stops" },
      { term: "Alkane stability", traditional: "烷烴穩定性", simplified: "烷烃稳定性", definition: "strong sigma bonds, nonpolar, low reactivity" }
    ],
    questions: [
      {
        id: "3.3-1",
        text: "A radical is a species that contains:",
        options: ["a lone pair", "a positive charge", "an unpaired electron", "a double bond"],
        correctAnswer: "an unpaired electron"
      },
      {
        id: "3.3-2",
        text: "In structural formulae, radicals are indicated by:",
        options: ["δ+", "•", "(aq)", "a wavy bond"],
        correctAnswer: "•"
      },
      {
        id: "3.3-3",
        text: "Which species is a radical?",
        options: ["NH₃", "Mg²⁺", "NO•", "Cl⁻"],
        correctAnswer: "NO•"
      },
      {
        id: "3.3-4",
        text: "Radicals are highly reactive mainly because they:",
        options: ["have a full octet", "contain an unpaired electron", "are always ionic", "have strong hydrogen bonding"],
        correctAnswer: "contain an unpaired electron"
      },
      {
        id: "3.3-5",
        text: "Reaction mechanisms differ from reaction equations because mechanisms show:",
        options: ["only the final products", "the movement of electrons and steps", "only stoichiometric ratios", "only state symbols"],
        correctAnswer: "the movement of electrons and steps"
      },
      {
        id: "3.3-6",
        text: "A single-headed curly arrow shows movement of:",
        options: ["two electrons", "one electron", "a proton", "a lone pair only"],
        correctAnswer: "one electron"
      },
      {
        id: "3.3-7",
        text: "Single-headed curly arrows are also called:",
        options: ["equilibrium arrows", "fish-hook arrows", "resonance arrows", "double-headed arrows"],
        correctAnswer: "fish-hook arrows"
      },
      {
        id: "3.3-8",
        text: "Homolytic fission is bond breaking where:",
        options: ["one atom takes both electrons", "each atom takes one electron", "no electrons move", "ions form directly"],
        correctAnswer: "each atom takes one electron"
      },
      {
        id: "3.3-9",
        text: "The homolytic fission of Cl₂ produces:",
        options: ["Cl⁺ and Cl⁻", "2Cl•", "2Cl⁻", "Cl₂⁺"],
        correctAnswer: "2Cl•"
      },
      {
        id: "3.3-10",
        text: "In homolytic fission, curly arrows should start:",
        options: ["from an electron-rich region (e.g., the bond)", "from an electron-poor region", "from the product radical dot", "from the nucleus"],
        correctAnswer: "from an electron-rich region (e.g., the bond)"
      },
      {
        id: "3.3-11",
        text: "Photolytic fission typically requires:",
        options: ["UV light", "cold conditions", "aqueous acid", "a base catalyst"],
        correctAnswer: "UV light"
      },
      {
        id: "3.3-12",
        text: "Thermolytic fission is caused primarily by:",
        options: ["pressure", "heat", "light", "electricity"],
        correctAnswer: "heat"
      },
      {
        id: "3.3-13",
        text: "The initiation step in free-radical substitution is usually:",
        options: ["radical + radical → stable molecule", "X₂ → 2X•", "alkyl radical + X₂ → haloalkane + X•", "alkane + X₂ → haloalkane + HX (one step)"],
        correctAnswer: "X₂ → 2X•"
      },
      {
        id: "3.3-14",
        text: "The propagation step is characterised by:",
        options: ["radicals being produced and regenerated", "radicals never being used", "the chain stopping", "formation of ions"],
        correctAnswer: "radicals being produced and regenerated"
      },
      {
        id: "3.3-15",
        text: "The termination step occurs when:",
        options: ["UV light is switched on", "two radicals combine to form a stable molecule", "a halogen molecule splits", "a catalyst is added"],
        correctAnswer: "two radicals combine to form a stable molecule"
      },
      {
        id: "3.3-16",
        text: "Alkanes are relatively unreactive mainly because:",
        options: ["they contain C=C bonds", "they are nonpolar and have strong C–C and C–H bonds", "they are strong bases", "they contain ionic bonds"],
        correctAnswer: "they are nonpolar and have strong C–C and C–H bonds"
      },
      {
        id: "3.3-17",
        text: "The C–H bond in an alkane is usually:",
        options: ["highly polar", "nonpolar or only slightly polar", "ionic", "metallic"],
        correctAnswer: "nonpolar or only slightly polar"
      },
      {
        id: "3.3-18",
        text: "Alkanes do not readily react with polar reagents because alkanes:",
        options: ["have strong dipoles", "lack electron-deficient and electron-rich regions", "contain O–H groups", "are aromatic"],
        correctAnswer: "lack electron-deficient and electron-rich regions"
      },
      {
        id: "3.3-19",
        text: "Free-radical substitution of alkanes requires UV light mainly to:",
        options: ["heat the mixture", "generate radicals in initiation", "remove products", "make alkanes more polar"],
        correctAnswer: "generate radicals in initiation"
      },
      {
        id: "3.3-20",
        text: "In chlorination of ethane, one propagation step is:",
        options: ["CH₃CH₃ + Cl• → •CH₂CH₃ + HCl", "Cl• + Cl• → Cl₂", "Cl₂ → 2Cl•", "•CH₂CH₃ + •CH₂CH₃ → C₄H₁₀"],
        correctAnswer: "CH₃CH₃ + Cl• → •CH₂CH₃ + HCl"
      },
      {
        id: "3.3-21",
        text: "The other key propagation step in chlorination of ethane is:",
        options: ["•CH₂CH₃ + Cl₂ → CH₃CH₂Cl + Cl•", "Cl₂ → 2Cl•", "Cl• + Cl• → Cl₂", "CH₃CH₃ + Cl₂ → CH₃CH₂Cl + HCl (one step)"],
        correctAnswer: "•CH₂CH₃ + Cl₂ → CH₃CH₂Cl + Cl•"
      },
      {
        id: "3.3-22",
        text: "In propagation, the halogen radical is:",
        options: ["consumed and not regenerated", "regenerated, allowing the chain to continue", "converted into a halide ion", "converted into a carbocation"],
        correctAnswer: "regenerated, allowing the chain to continue"
      },
      {
        id: "3.3-23",
        text: "A termination step could be:",
        options: ["Cl₂ → 2Cl•", "Cl• + Cl• → Cl₂", "CH₃CH₃ + Cl• → •CH₂CH₃ + HCl", "•CH₂CH₃ + Cl₂ → CH₃CH₂Cl + Cl•"],
        correctAnswer: "Cl• + Cl• → Cl₂"
      },
      {
        id: "3.3-24",
        text: "Formation of butane in a termination step is:",
        options: ["•CH₂CH₃ + •CH₂CH₃ → CH₃CH₂CH₂CH₃", "CH₃CH₃ + Cl₂ → CH₃CH₂Cl + HCl", "Cl• + Cl• → Cl₂", "•CH₂CH₃ + Cl₂ → CH₃CH₂Cl + Cl•"],
        correctAnswer: "•CH₂CH₃ + •CH₂CH₃ → CH₃CH₂CH₂CH₃"
      },
      {
        id: "3.3-25",
        text: "A common experimental observation showing UV is needed is:",
        options: ["bromine decolourises in the dark", "bromine decolourises only in sunlight when mixed with an alkane", "bromine turns blue-black with starch", "a precipitate forms immediately"],
        correctAnswer: "bromine decolourises only in sunlight when mixed with an alkane"
      },
      {
        id: "3.3-26",
        text: "Free-radical substitution is called a chain reaction because:",
        options: ["radicals are never consumed", "radicals are regenerated during propagation", "it occurs in a single step", "it requires a salt bridge"],
        correctAnswer: "radicals are regenerated during propagation"
      },
      {
        id: "3.3-27",
        text: "A disadvantage of free-radical halogenation for synthesis is that it:",
        options: ["cannot occur with alkanes", "often gives a mixture of products", "always gives only one product", "requires a strong acid catalyst"],
        correctAnswer: "often gives a mixture of products"
      },
      {
        id: "3.3-28",
        text: "If excess halogen is present, substitution can:",
        options: ["stop after one substitution", "continue, forming more substituted products", "only occur at carbon-1", "produce only alkenes"],
        correctAnswer: "continue, forming more substituted products"
      },
      {
        id: "3.3-29",
        text: "The statement CH₃CH₃ + Cl• → CH₃CH₂Cl + H• is incorrect as a propagation step mainly because it:",
        options: ["produces a hydrogen radical in propagation", "is always endothermic", "produces ions", "breaks an ionic bond"],
        correctAnswer: "produces a hydrogen radical in propagation"
      },
      {
        id: "3.3-30",
        text: "In homolytic fission, each product radical has:",
        options: ["no electrons", "a full octet", "an unpaired electron", "two positive charges"],
        correctAnswer: "an unpaired electron"
      },
      {
        id: "3.3-31",
        text: "Which is an example of an atomic radical?",
        options: ["Br•", "NH₄⁺", "H₂O", "Cl⁻"],
        correctAnswer: "Br•"
      },
      {
        id: "3.3-32",
        text: "Which is an example of a molecular (polyatomic) radical?",
        options: ["Na⁺", "OH•", "Mg²⁺", "CH₄"],
        correctAnswer: "OH•"
      },
      {
        id: "3.3-33",
        text: "A radical may be neutral or charged because the only requirement is:",
        options: ["having a double bond", "having an unpaired electron", "having an overall charge of zero", "being an alkane"],
        correctAnswer: "having an unpaired electron"
      },
      {
        id: "3.3-34",
        text: "Radicals are often short-lived because they:",
        options: ["are too stable", "react quickly to form lower-enthalpy products", "do not collide", "cannot form bonds"],
        correctAnswer: "react quickly to form lower-enthalpy products"
      },
      {
        id: "3.3-35",
        text: "The propagation step is described as “growing” because:",
        options: ["the number of atoms increases each step", "it repeats in cycles, producing product while maintaining radicals", "the reaction stops", "the halogen becomes ionic"],
        correctAnswer: "it repeats in cycles, producing product while maintaining radicals"
      },
      {
        id: "3.3-36",
        text: "A C–H bond in propagation breaks:",
        options: ["heterolytically to form ions", "homolytically to form a radical", "to form a carbocation", "to form a carbanion only"],
        correctAnswer: "homolytically to form a radical"
      },
      {
        id: "3.3-37",
        text: "The main product of single substitution chlorination of ethane is:",
        options: ["CH₃CH₂Cl", "CH₂=CH₂", "C₂H₅OH", "CH₃COOH"],
        correctAnswer: "CH₃CH₂Cl"
      },
      {
        id: "3.3-38",
        text: "CH₃CH₂Cl is classified as a:",
        options: ["halogenoalkane", "haloarene", "alcohol", "ketone"],
        correctAnswer: "halogenoalkane"
      },
      {
        id: "3.3-39",
        text: "The step X₂ → 2X• is:",
        options: ["initiation", "propagation", "termination", "rearrangement"],
        correctAnswer: "initiation"
      },
      {
        id: "3.3-40",
        text: "The step radical + radical → stable molecule is:",
        options: ["initiation", "propagation", "termination", "substitution"],
        correctAnswer: "termination"
      },
      {
        id: "3.3-41",
        text: "Which sequence correctly names the stages?",
        options: ["initiation → propagation → termination", "propagation → initiation → termination", "termination → propagation → initiation", "initiation → termination → propagation"],
        correctAnswer: "initiation → propagation → termination"
      },
      {
        id: "3.3-42",
        text: "Which condition is most associated with photolytic fission?",
        options: ["UV light", "aqueous alkali", "reflux with acid", "high pressure only"],
        correctAnswer: "UV light"
      },
      {
        id: "3.3-43",
        text: "The dot in a radical formula should be placed:",
        options: ["on the atom with the unpaired electron", "on the most electronegative atom always", "at the end of the formula only", "anywhere on the structure"],
        correctAnswer: "on the atom with the unpaired electron"
      },
      {
        id: "3.3-44",
        text: "A key role of radicals in propagation is to:",
        options: ["form ions", "abstract H and create new radicals", "stop the reaction", "catalyse without being regenerated"],
        correctAnswer: "abstract H and create new radicals"
      },
      {
        id: "3.3-45",
        text: "The ethyl radical is:",
        options: ["CH₃CH₂•", "CH₃CH₂⁻", "CH₃CH₂⁺", "CH₃CH₂:"],
        correctAnswer: "CH₃CH₂•"
      },
      {
        id: "3.3-46",
        text: "In •CH₂CH₃ + Cl₂ → CH₃CH₂Cl + Cl•, the number of radicals on each side is:",
        options: ["0 left, 1 right", "1 left, 1 right", "2 left, 0 right", "1 left, 0 right"],
        correctAnswer: "1 left, 1 right"
      },
      {
        id: "3.3-47",
        text: "The reason alkanes do not undergo electrophilic addition is that they:",
        options: ["are nonpolar and have only sigma bonds", "have multiple bonds", "are ionic", "contain OH groups"],
        correctAnswer: "are nonpolar and have only sigma bonds"
      },
      {
        id: "3.3-48",
        text: "A typical halogen used in free-radical substitution is:",
        options: ["chlorine or bromine", "nitrogen", "helium", "sodium"],
        correctAnswer: "chlorine or bromine"
      },
      {
        id: "3.3-49",
        text: "The term “stoichiometry” refers to:",
        options: ["electron movement", "relative quantities of reactants and products", "reaction rate only", "bond polarity only"],
        correctAnswer: "relative quantities of reactants and products"
      },
      {
        id: "3.3-50",
        text: "The strongest evidence that a reaction is a chain reaction is that:",
        options: ["radicals are produced only once and never regenerated", "radicals are regenerated in propagation steps", "the reaction requires water", "the reaction is reversible"],
        correctAnswer: "radicals are regenerated in propagation steps"
      }
    ]
  },
  {
    id: 22,
    title: "R3.4 — Electron-pair sharing reactions",
    description: "Lewis acids and bases.",
    color: "bg-purple-600",
    category: 'reactivity',
    concepts: [
      "Nucleophile: electron-rich species that donates a lone pair; attracted to δ⁺/positive centres.",
      "Electrophile: electron-deficient species that accepts electrons (accepts a lone pair) to form a covalent bond.",
      "Nucleophilic substitution: nucleophile attacks a δ⁺ carbon and replaces a leaving group (commonly X⁻ in halogenoalkanes).",
      "Leaving group: atom/group that departs with the bonding electron pair (e.g. halide ion).",
      "Heterolytic fission: covalent bond breaks with both bonding electrons going to one atom → forms a cation and an anion.",
      "Curly arrow (double-headed): movement of an electron pair from a lone pair or region of high electron density to an electron-poor site.",
      "Electrophilic addition: electrophile adds across a C=C; π bond breaks and new σ bonds form.",
      "Lewis acid: lone pair acceptor.",
      "Lewis base: lone pair donor.",
      "Coordinate (dative) bond: covalent bond where both electrons are donated by the same atom (Lewis base → Lewis acid).",
      "Ligand: molecule/ion that donates a lone pair to a metal ion to form a coordinate bond.",
      "Complex ion: central metal ion with ligands in square brackets.",
      "Coordination number: number of coordinate bonds to the central metal ion.",
      "SN1: substitution nucleophilic unimolecular; two-step; carbocation intermediate; rate = k[halogenoalkane].",
      "SN2: substitution nucleophilic bimolecular; one-step; backside attack; transition state; rate = k[halogenoalkane][nucleophile].",
      "Carbocation: positively charged carbon with three covalent bonds.",
      "Inductive effect (+I): alkyl groups donate electron density and stabilise carbocations.",
      "Markovnikov’s rule: in addition to an unsymmetrical alkene, the electrophile adds to give the more stable carbocation; substituent (e.g. X) ends up on the more substituted carbon.",
      "Electrophilic substitution (benzene): electrophile substitutes for H on the ring; aromaticity is temporarily lost then regenerated."
    ],
    vocab: [
      { term: "Nucleophile", traditional: "親核試劑", simplified: "亲核试剂", definition: "electron-rich, lone pair donor, attacks δ⁺ carbon, e.g. OH⁻, CN⁻, NH₃, H₂O" },
      { term: "Electrophile", traditional: "親電試劑", simplified: "亲电试剂", definition: "electron-poor, lone pair acceptor, δ⁺/positive, e.g. H⁺, carbocations, NO₂⁺" },
      { term: "Heterolytic fission", traditional: "異裂", simplified: "异裂", definition: "bond breaks, both electrons to one atom, ions formed, curly arrow" },
      { term: "Electrophilic addition", traditional: "親電加成", simplified: "亲电加成", definition: "alkene π bond, carbocation intermediate, two-step, halogens/HX/H₂O (acid-catalysed for hydration)" },
      { term: "Lewis acid/base", traditional: "路易斯酸/鹼", simplified: "路易斯酸/碱", definition: "accept/donate lone pair, coordinate bond" },
      { term: "Ligand/complex", traditional: "配體/配合物", simplified: "配体/配合物", definition: "ligand donates lone pair, complex ion in [ ], charge from oxidation states and ligand charges" },
      { term: "SN1", traditional: "SN1反應", simplified: "SN1反应", definition: "tertiary, carbocation, two-step, unimolecular, racemisation possible" },
      { term: "SN2", traditional: "SN2反應", simplified: "SN2反应", definition: "primary, one-step, transition state, backside attack, inversion of configuration" },
      { term: "Leaving group", traditional: "離去基團", simplified: "离去集团", definition: "halide, weaker C–X bond gives faster substitution, trend C–I fastest, C–F slowest" },
      { term: "Silver nitrate test", traditional: "硝酸銀測試", simplified: "硝酸银测试", definition: "AgCl white, AgBr cream, AgI yellow; F⁻ no precipitate" }
    ],
    questions: [
      { id: "3.4-1", text: "A nucleophile is best described as a species that:", options: ["accepts a proton", "donates a lone pair of electrons", "donates a hydrogen atom", "accepts a lone pair of electrons"], correctAnswer: "donates a lone pair of electrons" },
      { id: "3.4-2", text: "Which is generally the stronger nucleophile?", options: ["H₂O", "OH⁻", "CH₃OH", "NH₄⁺"], correctAnswer: "OH⁻" },
      { id: "3.4-3", text: "Which list contains only nucleophiles?", options: ["OH⁻, NH₃, CN⁻", "H⁺, NO₂⁺, Br⁻", "BF₃, H₂O, H⁺", "NO₂⁺, Br₂, HCl"], correctAnswer: "OH⁻, NH₃, CN⁻" },
      { id: "3.4-4", text: "In a nucleophilic substitution of a halogenoalkane, the leaving group is typically:", options: ["the nucleophile", "the halogen atom that departs as X⁻", "the carbon atom being attacked", "the solvent"], correctAnswer: "the halogen atom that departs as X⁻" },
      { id: "3.4-5", text: "Heterolytic fission of a covalent bond produces:", options: ["two radicals", "two cations", "a cation and an anion", "two anions"], correctAnswer: "a cation and an anion" },
      { id: "3.4-6", text: "Curly arrows in organic mechanisms are used to show:", options: ["movement of atoms", "movement of an electron pair", "movement of a single electron", "changes in temperature"], correctAnswer: "movement of an electron pair" },
      { id: "3.4-7", text: "Which bond is most likely to undergo heterolytic fission in HCl?", options: ["H–Cl producing H· and Cl·", "H–Cl producing H⁺ and Cl⁻", "H–Cl producing H⁻ and Cl⁺", "H–Cl producing H₂ and Cl₂"], correctAnswer: "H–Cl producing H⁺ and Cl⁻" },
      { id: "3.4-8", text: "An electrophile is best described as a species that:", options: ["donates a lone pair", "accepts a lone pair", "donates electrons to become oxidised", "accepts neutrons"], correctAnswer: "accepts a lone pair" },
      { id: "3.4-9", text: "The C=C bond in alkenes is reactive toward electrophiles mainly because:", options: ["it contains a strong σ bond", "the π bond is electron-rich and weaker than the σ bond", "the alkene is always ionic", "alkenes have higher bond angles than alkanes"], correctAnswer: "the π bond is electron-rich and weaker than the σ bond" },
      { id: "3.4-10", text: "Electrophilic addition to an alkene results in:", options: ["formation of a C=C bond", "replacement of a C=C by a C–C and two new σ bonds", "formation of a radical intermediate only", "substitution on a benzene ring"], correctAnswer: "replacement of a C=C by a C–C and two new σ bonds" },
      { id: "3.4-11", text: "Hydration of an alkene to form an alcohol typically requires:", options: ["UV light only", "a strong acid catalyst", "a base catalyst only", "a free-radical initiator"], correctAnswer: "a strong acid catalyst" },
      { id: "3.4-12", text: "In electrophilic addition of HBr to ethene, the first step is:", options: ["Br⁻ attacks the alkene", "π electrons attack δ⁺ H and H–Br breaks heterolytically", "homolytic fission of H–Br", "formation of NO₂⁺"], correctAnswer: "π electrons attack δ⁺ H and H–Br breaks heterolytically" },
      { id: "3.4-13", text: "Halogen molecules (e.g. Br₂) behave as electrophiles toward alkenes because they:", options: ["are permanently polar", "become polarised near the electron-rich π bond", "always form radicals first", "donate lone pairs to the alkene"], correctAnswer: "become polarised near the electron-rich π bond" },
      { id: "3.4-14", text: "A Lewis acid is a:", options: ["proton donor", "proton acceptor", "lone pair acceptor", "lone pair donor"], correctAnswer: "lone pair acceptor" },
      { id: "3.4-15", text: "A Lewis base is a:", options: ["lone pair donor", "lone pair acceptor", "electron pair remover", "proton donor only"], correctAnswer: "lone pair donor" },
      { id: "3.4-16", text: "A coordinate bond forms when:", options: ["each atom contributes one electron", "both electrons in the bond are donated by one atom", "a proton is transferred", "a bond breaks homolytically"], correctAnswer: "both electrons in the bond are donated by one atom" },
      { id: "3.4-17", text: "In BF₃ + NH₃ → F₃B←NH₃, BF₃ acts as:", options: ["Lewis base", "Brønsted–Lowry base", "Lewis acid", "nucleophile"], correctAnswer: "Lewis acid" },
      { id: "3.4-18", text: "In the formation of [Cu(H₂O)₆]²⁺, Cu²⁺ is:", options: ["Lewis base", "Lewis acid", "leaving group", "nucleophile"], correctAnswer: "Lewis acid" },
      { id: "3.4-19", text: "A ligand is best defined as:", options: ["an electrophile that attacks benzene", "a molecule/ion that donates a lone pair to a metal ion", "a species that always has a +1 charge", "a radical formed by homolytic fission"], correctAnswer: "a molecule/ion that donates a lone pair to a metal ion" },
      { id: "3.4-20", text: "Coordination number is the:", options: ["oxidation state of the metal", "number of ligands only (always)", "number of coordinate bonds to the central metal ion", "number of electrons in the d subshell"], correctAnswer: "number of coordinate bonds to the central metal ion" },
      { id: "3.4-21", text: "Which is a bidentate ligand?", options: ["H₂O", "NH₃", "1,2-diaminoethane (en)", "Cl⁻"], correctAnswer: "1,2-diaminoethane (en)" },
      { id: "3.4-22", text: "EDTA is described as:", options: ["monodentate", "bidentate", "hexadentate", "non-ligand"], correctAnswer: "hexadentate" },
      { id: "3.4-23", text: "The charge on [CuCl₄]²⁻ can be explained because:", options: ["Cu is +4", "four Cl⁻ ligands contribute a total of −4 with Cu²⁺ giving −2 overall", "Cl⁻ ligands are neutral", "complex ions are always neutral"], correctAnswer: "four Cl⁻ ligands contribute a total of −4 with Cu²⁺ giving −2 overall" },
      { id: "3.4-24", text: "In [Fe(H₂O)₆]³⁺, the overall charge is +3 because:", options: ["water is −1", "water is neutral and Fe is +3", "Fe is +6", "there are three waters"], correctAnswer: "water is neutral and Fe is +3" },
      { id: "3.4-25", text: "Which statement about SN1 is correct?", options: ["one-step mechanism with transition state only", "rate depends on both halogenoalkane and nucleophile", "carbocation intermediate is formed", "occurs mainly in primary halogenoalkanes"], correctAnswer: "carbocation intermediate is formed" },
      { id: "3.4-26", text: "Which statement about SN2 is correct?", options: ["two-step mechanism", "carbocation intermediate is formed", "backside attack occurs", "rate depends only on halogenoalkane concentration"], correctAnswer: "backside attack occurs" },
      { id: "3.4-27", text: "The rate equation for an SN1 reaction is typically:", options: ["rate = k[Nu⁻]", "rate = k[halogenoalkane]", "rate = k[halogenoalkane][Nu⁻]", "rate = k[product]"], correctAnswer: "rate = k[halogenoalkane]" },
      { id: "3.4-28", text: "The rate equation for an SN2 reaction is typically:", options: ["rate = k[halogenoalkane][nucleophile]", "rate = k[halogenoalkane]", "rate = k[nucleophile]", "rate = k[solvent]"], correctAnswer: "rate = k[halogenoalkane][nucleophile]" },
      { id: "3.4-29", text: "SN1 reactions are favoured for:", options: ["tertiary halogenoalkanes", "primary halogenoalkanes", "methane", "ethene"], correctAnswer: "tertiary halogenoalkanes" },
      { id: "3.4-30", text: "SN2 reactions are favoured for:", options: ["tertiary halogenoalkanes", "primary halogenoalkanes", "benzene", "tertiary carbocations"], correctAnswer: "primary halogenoalkanes" },
      { id: "3.4-31", text: "In an SN2 mechanism, the nucleophile attacks:", options: ["from the same side as the leaving group", "from the opposite side of the leaving group", "randomly from either side equally", "only after a carbocation forms"], correctAnswer: "from the opposite side of the leaving group" },
      { id: "3.4-32", text: "Inversion of configuration is characteristic of:", options: ["electrophilic substitution", "SN1", "SN2", "hydration"], correctAnswer: "SN2" },
      { id: "3.4-33", text: "The transition state in SN2 is best described as:", options: ["a stable intermediate that can be isolated", "a high-energy arrangement with partial bonds", "a carbocation", "a radical"], correctAnswer: "a high-energy arrangement with partial bonds" },
      { id: "3.4-34", text: "Carbocation stability increases in the order:", options: ["tertiary > secondary > primary", "primary > secondary > tertiary", "secondary > tertiary > primary", "primary > tertiary > secondary"], correctAnswer: "tertiary > secondary > primary" },
      { id: "3.4-35", text: "The inductive effect in alkyl groups generally:", options: ["withdraws electron density and destabilises carbocations", "donates electron density and stabilises carbocations", "has no effect on carbocations", "makes benzene non-aromatic"], correctAnswer: "donates electron density and stabilises carbocations" },
      { id: "3.4-36", text: "Which C–X bond leads to the fastest substitution (all else equal)?", options: ["C–F", "C–Cl", "C–Br", "C–I"], correctAnswer: "C–I" },
      { id: "3.4-37", text: "Which halide gives a yellow precipitate with aqueous AgNO₃?", options: ["Cl⁻", "Br⁻", "I⁻", "F⁻"], correctAnswer: "I⁻" },
      { id: "3.4-38", text: "Which halide gives no visible precipitate with aqueous AgNO₃?", options: ["Cl⁻", "Br⁻", "I⁻", "F⁻"], correctAnswer: "F⁻" },
      { id: "3.4-39", text: "The bromine water test for unsaturation is positive when:", options: ["the solution becomes more orange", "the orange/brown colour is decolourised", "a yellow precipitate forms", "the pH decreases only"], correctAnswer: "the orange/brown colour is decolourised" },
      { id: "3.4-40", text: "Electrophilic addition of Br₂ to ethene is faster than addition of H₂O because:", options: ["water is non-polar", "water is a weak electrophile and needs an acid catalyst", "bromine cannot be polarised", "ethene is saturated"], correctAnswer: "water is a weak electrophile and needs an acid catalyst" },
      { id: "3.4-41", text: "Markovnikov’s rule predicts that in addition of HBr to propene, the major product is:", options: ["1-bromopropane", "2-bromopropane", "1-chloropropane", "propan-1-ol"], correctAnswer: "2-bromopropane" },
      { id: "3.4-42", text: "Markovnikov’s rule is linked to:", options: ["stability of carbocation intermediates", "stability of radicals only", "solubility of silver halides", "coordination number"], correctAnswer: "stability of carbocation intermediates" },
      { id: "3.4-43", text: "Benzene typically undergoes electrophilic substitution rather than addition because:", options: ["benzene has no π electrons", "benzene is aromatic and addition would permanently destroy aromaticity", "benzene is ionic", "benzene contains a C=C that is very weak"], correctAnswer: "benzene is aromatic and addition would permanently destroy aromaticity" },
      { id: "3.4-44", text: "In nitration of benzene, the electrophile is:", options: ["NO₃⁻", "NO₂⁺", "NH₄⁺", "OH⁻"], correctAnswer: "NO₂⁺" },
      { id: "3.4-45", text: "In electrophilic substitution, aromaticity is restored by:", options: ["homolytic cleavage of a C–H bond", "heterolytic cleavage of a C–H bond and reformation of the π system", "breaking a C–C bond", "addition of H₂ across the ring"], correctAnswer: "heterolytic cleavage of a C–H bond and reformation of the π system" },
      { id: "3.4-46", text: "In a mechanism, an electron-pair arrow should start from:", options: ["a δ⁺ atom", "a positive charge only", "a lone pair or region of high electron density", "the reaction arrow (→)"], correctAnswer: "a lone pair or region of high electron density" },
      { id: "3.4-47", text: "Which is both a Lewis base and a Brønsted–Lowry base?", options: ["H⁺", "OH⁻", "BF₃", "NO₂⁺"], correctAnswer: "OH⁻" },
      { id: "3.4-48", text: "In the reaction H⁺ + OH⁻ → H₂O, OH⁻ acts as:", options: ["Lewis acid", "Lewis base", "electrophile only", "leaving group"], correctAnswer: "Lewis base" },
      { id: "3.4-49", text: "Which pair is correctly matched?", options: ["Nucleophile: lone pair acceptor", "Electrophile: electron-rich species", "Lewis acid: lone pair acceptor", "Lewis base: electron-poor species"], correctAnswer: "Lewis acid: lone pair acceptor" },
      { id: "3.4-50", text: "Which statement is correct about halogens in electrophilic addition to alkenes?", options: ["they must be permanently polar", "they become polarised by the alkene π bond", "they always react via radicals", "they act as nucleophiles in step 1"], correctAnswer: "they become polarised by the alkene π bond" }
    ]
  }
];

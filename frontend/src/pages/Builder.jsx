import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useBuilderStore } from "../store/builderStore";
import { useToastStore } from "../store/toastStore";
import { COMPONENTS, FPS_BENCHMARKS, CPU_GAMING_MULTIPLIER } from "../services/mockData";
import {
  Cpu, Layers, HardDrive, Battery, Trash2, AlertTriangle, CheckCircle,
  Plus, ArrowRight, Shield, Sparkles, X, Search, Zap, ChevronRight,
  TrendingUp, Star, Package, Monitor
} from "lucide-react";
import { motion, AnimatePresence, useInView } from "framer-motion";

const sidebarVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.06, duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Builder() {
  const { selectedParts, addPart, removePart, clearBuild, getEstimatedWattage, getCompatibilityErrors } =
    useBuilderStore();
  const addToast = useToastStore((state) => state.addToast);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const listRef = useRef(null);
  const isListVisible = useInView(listRef, { once: true, margin: "-60px" });

  // Part category mapping
  const CATEGORIES = [
    { id: "cpu",         name: "Processor (CPU)",       icon: Cpu,       desc: "Brains of the rig. Socket compatibility is verified." },
    { id: "gpu",         name: "Graphics Card (GPU)",    icon: Monitor,   desc: "GPU clearance and case lengths are checked." },
    { id: "motherboard", name: "Motherboard",             icon: Layers,    desc: "Connects all pieces. Dictates RAM generation." },
    { id: "ram",         name: "Memory (RAM)",            icon: Battery,   desc: "Vitals of compiling speeds and gaming loading times." },
    { id: "storage",     name: "Storage (SSD/HDD)",       icon: HardDrive, desc: "Fast NVMe storage is highly recommended." },
    { id: "psu",         name: "Power Supply (PSU)",      icon: Zap,       desc: "Feeds clean juice. Dynamic wattage checked." },
    { id: "case",        name: "Chassis (Case)",          icon: Package,   desc: "Visual body. Directs GPU card spacing clearance." },
    { id: "cooler",      name: "CPU Cooler",              icon: TrendingUp,desc: "Tames heavy TDP heat outputs." },
  ];

  // Named save modal state
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [buildName, setBuildName] = useState("");

  // FPS mini preview
  const fpsCpu = selectedParts.cpu?.id;
  const fpsGpu = selectedParts.gpu?.id;
  const fpsPreview = (fpsCpu && fpsGpu)
    ? Math.round((FPS_BENCHMARKS[fpsGpu]?.valorant?.["1080p"] || 0) * (CPU_GAMING_MULTIPLIER[fpsCpu] || 1))
    : null;

  // Build score
  const filledParts = Object.values(selectedParts).filter(Boolean);
  const avgBenchmark = filledParts.length > 0
    ? Math.round(filledParts.reduce((s, p) => s + (p.benchmarkScore || 70), 0) / filledParts.length)
    : 0;
  const avgValue = filledParts.length > 0
    ? Math.round(filledParts.reduce((s, p) => s + (p.valueScore || 70), 0) / filledParts.length)
    : 0;

  const handleOpenSelector = (category) => {
    setActiveCategory(category);
    setSearchTerm("");
    setModalOpen(true);
  };

  const handleSelectPart = (part) => {
    if (activeCategory) addPart(activeCategory, part);
    setModalOpen(false);
    addToast(`${part.name} added to your build!`, "success");
  };

  // Get total price
  const totalPrice = Object.values(selectedParts).reduce(
    (sum, part) => sum + (part ? part.price : 0),
    0
  );

  const filledSlots = Object.values(selectedParts).filter(Boolean).length;
  const progressPct = Math.round((filledSlots / CATEGORIES.length) * 100);

  // Get compatibility details
  const compErrors = getCompatibilityErrors();
  const estimatedWattage = getEstimatedWattage();
  const psuWattage = selectedParts.psu ? selectedParts.psu.specs.wattage : 850;
  const wattagePercentage = Math.min((estimatedWattage / psuWattage) * 100, 100);

  const getWattageColor = () => {
    if (estimatedWattage > psuWattage) return "from-red-500 to-rose-600 text-red-400";
    if (estimatedWattage > psuWattage - 150) return "from-amber-500 to-orange-600 text-amber-400";
    return "from-emerald-500 to-teal-500 text-emerald-400";
  };

  const handleSaveBuild = () => {
    const name = buildName.trim() || `Custom Config #${Math.floor(Math.random() * 900) + 100}`;
    const draftBuild = {
      id: `draft-${Date.now()}`,
      name,
      date: new Date().toISOString().split("T")[0],
      totalPrice: totalPrice,
      parts: { ...selectedParts },
      upvotes: 0,
      comments: 0,
    };
    const savedList = localStorage.getItem("icpcs_saved_builds");
    const currentBuilds = savedList ? JSON.parse(savedList) : [];
    currentBuilds.unshift(draftBuild);
    localStorage.setItem("icpcs_saved_builds", JSON.stringify(currentBuilds));
    setSaveModalOpen(false);
    setBuildName("");
    addToast(`"${name}" saved to your dashboard!`, "success");
    navigate("/dashboard");
  };

  // Filter components for modal selection
  const filteredComponents = COMPONENTS.filter((part) => {
    if (part.category !== activeCategory) return false;
    if (searchTerm === "") return true;
    return (
      part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "#050816", color: "#fff" }}>
      {/* Background Lights */}
      <div className="fixed top-[10%] left-[-5%] w-[450px] h-[450px] rounded-full blur-[100px] pointer-events-none -z-10"
        style={{ background: "radial-gradient(circle,rgba(124,58,237,0.09) 0%,transparent 70%)" }} />
      <div className="fixed bottom-[20%] right-[-5%] w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none -z-10"
        style={{ background: "radial-gradient(circle,rgba(59,130,246,0.07) 0%,transparent 70%)" }} />
    <div className="max-w-7xl mx-auto w-full px-6 py-12 relative z-10">

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* ===== Left Side: Category Blocks ===== */}
        <div className="flex-grow w-full flex flex-col gap-4 text-left" ref={listRef}>
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-between items-center pb-6 border-b border-white/5 mb-2"
          >
            <div>
              <div className="section-label mb-2">
                <span className="w-6 h-px" style={{ background: "linear-gradient(90deg,transparent,#7C3AED)" }} />
                <Sparkles className="w-3 h-3" style={{ color: "#06B6D4" }} /> Hardware Pipeline
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight">
                System <span style={{ background: "linear-gradient(90deg,#7C3AED,#3B82F6,#06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Configurator</span>
              </h1>
              <p className="text-xs mt-1" style={{ color: "#94A3B8" }}>Select components. Real-time compatibility + FPS preview.</p>
            </div>
            <motion.button
              onClick={clearBuild}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="text-xs font-bold transition-colors px-4 py-2.5 rounded-xl"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#94A3B8" }}
            >
              Reset Build
            </motion.button>
          </motion.div>

          {/* Build progress bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl p-4 mb-2"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="uppercase tracking-wider" style={{ color: "#94A3B8" }}>Build Progress</span>
              <span style={{ color: "#7C3AED" }}>{filledSlots} / {CATEGORIES.length} components</span>
            </div>
            <div className="w-full rounded-full h-2 overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg,#7C3AED,#3B82F6)" }}
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </motion.div>

          {/* Part Category Rows */}
          <div className="flex flex-col gap-3">
            {CATEGORIES.map((cat, i) => {
              const selectedPart = selectedParts[cat.id];
              const Icon = cat.icon;
              return (
                <motion.div
                  custom={i}
                  variants={rowVariants}
                  initial="hidden"
                  animate={isListVisible ? "visible" : "hidden"}
                  key={cat.id}
                  layout
                  className="rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group transition-all duration-300"
                  style={{
                    background: selectedPart ? "rgba(124,58,237,0.07)" : "rgba(255,255,255,0.04)",
                    border: selectedPart ? "1px solid rgba(124,58,237,0.25)" : "1px solid rgba(255,255,255,0.07)",
                    boxShadow: selectedPart ? "0 4px 20px rgba(124,58,237,0.08)" : "none",
                  }}
                >
                  <div className="flex items-center gap-4 text-left">
                    <div
                      className="p-3 rounded-xl shrink-0 transition-all"
                      style={{
                        background: selectedPart ? "rgba(124,58,237,0.14)" : "rgba(255,255,255,0.05)",
                        border: selectedPart ? "1px solid rgba(124,58,237,0.3)" : "1px solid rgba(255,255,255,0.08)",
                        color: selectedPart ? "#A78BFA" : "#475569",
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold tracking-wider block" style={{ color: "#475569" }}>
                        {cat.name}
                      </span>
                      {selectedPart ? (
                        <div className="flex flex-col text-left">
                          <h4 className="text-sm font-bold text-white mt-0.5">{selectedPart.name}</h4>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-[10px] font-medium" style={{ color: "#475569" }}>{selectedPart.brand}</span>
                            {selectedPart.benchmarkScore && (
                              <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full"
                                style={{ background: "rgba(124,58,237,0.12)", color: "#A78BFA" }}>
                                {selectedPart.benchmarkScore}/100
                              </span>
                            )}
                            {selectedPart.retailers && (() => {
                              const bestPrice = Math.min(...Object.values(selectedPart.retailers).map(r => r.price));
                              return <span className="text-[9px] font-bold" style={{ color: "#10B981" }}>₹{bestPrice.toLocaleString("en-IN")} best</span>;
                            })()}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs font-medium block mt-0.5" style={{ color: "#475569" }}>{cat.desc}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 shrink-0 ml-auto sm:ml-0">
                    {selectedPart ? (
                      <>
                        <span className="text-sm font-black text-white">₹{selectedPart.price.toLocaleString("en-IN")}</span>
                        <motion.button
                          onClick={() => handleOpenSelector(cat.id)}
                          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                          className="p-2.5 rounded-xl transition-colors"
                          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", color: "#94A3B8" }}
                          title="Change part"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          onClick={() => removePart(cat.id)}
                          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                          className="p-2.5 rounded-xl transition-colors"
                          style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.12)", color: "#94A3B8" }}
                          onMouseEnter={e => e.currentTarget.style.color = "#F87171"}
                          onMouseLeave={e => e.currentTarget.style.color = "#94A3B8"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </>
                    ) : (
                      <motion.button
                        onClick={() => handleOpenSelector(cat.id)}
                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                        className="flex items-center gap-1.5 text-xs font-bold text-white px-4 py-2.5 rounded-xl transition-all"
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                      >
                        <Plus className="w-3.5 h-3.5" /> Assign Part
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ===== Right Side: Summary Panel ===== */}
        <motion.aside
          variants={sidebarVariants}
          initial="hidden"
          animate="visible"
          className="w-full lg:w-96 shrink-0 flex flex-col gap-5 sticky top-28 text-left"
        >
          {/* Price & Save Panel */}
          <div className="rounded-3xl p-6 flex flex-col gap-5 relative overflow-hidden"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(16px)" }}>
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle,rgba(124,58,237,0.18) 0%,transparent 70%)", filter: "blur(20px)" }} />

            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl" style={{ background: "rgba(124,58,237,0.14)", border: "1px solid rgba(124,58,237,0.3)" }}>
                <Shield className="w-4 h-4" style={{ color: "#A78BFA" }} />
              </div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Build Summary</h3>
            </div>

            {/* Price Counter */}
            <div className="flex justify-between items-end pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "#475569" }}>Estimated Total</span>
              <motion.span key={totalPrice} initial={{ scale: 1.15, color: "#A78BFA" }} animate={{ scale: 1, color: "#fff" }}
                transition={{ duration: 0.4 }} className="text-3xl font-black tracking-tight">
                ₹{totalPrice.toLocaleString("en-IN")}
              </motion.span>
            </div>

            {/* Build Scores */}
            {filledParts.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl p-3 text-center" style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.18)" }}>
                  <div className="text-[9px] uppercase font-black tracking-widest mb-1" style={{ color: "#475569" }}>Performance</div>
                  <div className="text-xl font-black" style={{ color: "#A78BFA" }}>{avgBenchmark}<span className="text-xs">/100</span></div>
                </div>
                <div className="rounded-2xl p-3 text-center" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.18)" }}>
                  <div className="text-[9px] uppercase font-black tracking-widest mb-1" style={{ color: "#475569" }}>Value Score</div>
                  <div className="text-xl font-black" style={{ color: "#34D399" }}>{avgValue}<span className="text-xs">/100</span></div>
                </div>
              </div>
            )}

            {/* FPS Mini Preview */}
            {fpsPreview !== null && (
              <div className="rounded-2xl px-4 py-3 flex items-center justify-between"
                style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.18)" }}>
                <div>
                  <div className="text-[9px] uppercase font-black tracking-widest" style={{ color: "#475569" }}>Valorant @ 1080p</div>
                  <div className="text-xs font-medium mt-0.5" style={{ color: "#94A3B8" }}>Estimated FPS</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black" style={{ color: fpsPreview >= 120 ? "#3B82F6" : fpsPreview >= 60 ? "#F59E0B" : "#EF4444" }}>
                    {fpsPreview}
                  </div>
                  <Link to="/fps" className="text-[9px] font-bold" style={{ color: "#7C3AED" }}>Full estimator →</Link>
                </div>
              </div>
            )}

            {/* Wattage Progress Bar */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="uppercase tracking-wider flex items-center gap-1" style={{ color: "#94A3B8" }}>
                  <Zap className="w-3.5 h-3.5" /> Power Draw
                </span>
                <span style={{ color: estimatedWattage > psuWattage ? "#EF4444" : estimatedWattage > psuWattage - 150 ? "#F59E0B" : "#10B981" }}>
                  {estimatedWattage}W / {psuWattage}W
                </span>
              </div>
              <div className="w-full rounded-full h-2.5 overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                <motion.div className="h-full rounded-full"
                  style={{ background: estimatedWattage > psuWattage ? "linear-gradient(90deg,#EF4444,#DC2626)" : estimatedWattage > psuWattage - 150 ? "linear-gradient(90deg,#F59E0B,#D97706)" : "linear-gradient(90deg,#10B981,#059669)" }}
                  initial={{ width: 0 }} animate={{ width: `${wattagePercentage}%` }} transition={{ duration: 0.7, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-2.5">
              <motion.button
                onClick={() => totalPrice > 0 && setSaveModalOpen(true)}
                disabled={totalPrice === 0}
                whileHover={totalPrice > 0 ? { scale: 1.02, y: -2 } : {}}
                whileTap={totalPrice > 0 ? { scale: 0.98 } : {}}
                className="w-full py-3.5 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg,#7C3AED,#3B82F6)", boxShadow: totalPrice > 0 ? "0 4px 24px rgba(124,58,237,0.4)" : "none" }}
              >
                Save Configuration <ArrowRight className="w-4 h-4" />
              </motion.button>
              <Link to="/recommend"
                className="w-full py-3 text-center rounded-xl font-bold text-xs uppercase tracking-wider transition-all hover:-translate-y-0.5"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", color: "#94A3B8" }}>
                Budget Recommender
              </Link>
            </div>
          </div>

          {/* Compatibility Checker Panel */}
          <div className="rounded-3xl p-6 flex flex-col gap-4"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(16px)" }}>
            <h3 className="text-xs font-black text-white uppercase tracking-widest">Compatibility Analysis</h3>
            <div className="flex flex-col gap-3">
              <AnimatePresence mode="wait">
                {compErrors.length > 0 ? (
                  compErrors.map((err, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="p-4 rounded-xl flex gap-3"
                      style={err.type === "error"
                        ? { background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#F87171" }
                        : { background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", color: "#FBBF24" }
                      }>
                      <AlertTriangle className="w-5 h-5 shrink-0" />
                      <div className="text-xs">
                        <span className="font-black block uppercase tracking-wider">{err.title}</span>
                        <p className="mt-1 leading-relaxed" style={{ color: "#94A3B8" }}>{err.message}</p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div key="ok" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl flex gap-3"
                    style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", color: "#34D399" }}>
                    <CheckCircle className="w-5 h-5 shrink-0" />
                    <div className="text-xs">
                      <span className="font-black block uppercase tracking-wider">All Parts Compatible</span>
                      <p className="mt-1 leading-relaxed" style={{ color: "#94A3B8" }}>No socket mismatches, power issues, or clearance conflicts detected.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.aside>
      </div>

      {/* ===== Part Selection Modal ===== */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
          >
            <motion.div initial={{ opacity: 0, scale: 0.93, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl w-full rounded-3xl overflow-hidden shadow-2xl"
              style={{ background: "rgba(5,8,22,0.97)", border: "1px solid rgba(124,58,237,0.25)", backdropFilter: "blur(32px)" }}
            >
              <div className="p-5 flex justify-between items-center" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="w-4 h-4" style={{ color: "#7C3AED" }} />
                  Select {activeCategory?.toUpperCase()}
                </h3>
                <motion.button onClick={() => setModalOpen(false)}
                  whileHover={{ scale: 1.1, rotate: 90 }} transition={{ duration: 0.2 }}
                  className="p-2 rounded-xl transition-all" style={{ color: "#475569" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                  onMouseLeave={e => e.currentTarget.style.color = "#475569"}>
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="p-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="relative">
                  <Search className="absolute left-4 top-3.5 w-4 h-4" style={{ color: "#475569" }} />
                  <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search by model or brand..."
                    className="w-full pl-11 pr-4 py-3 rounded-xl text-white text-xs focus:outline-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                    onFocus={e => e.target.style.borderColor = "rgba(124,58,237,0.5)"}
                    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                    autoFocus
                  />
                </div>
              </div>

              <div className="p-4 overflow-y-auto max-h-[400px] flex flex-col gap-2.5">
                {filteredComponents.length > 0 ? (
                  filteredComponents.map((part, i) => (
                    <motion.div key={part.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="p-4 rounded-2xl flex justify-between items-center group cursor-pointer transition-all"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(124,58,237,0.3)"; e.currentTarget.style.background = "rgba(124,58,237,0.07)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                    >
                      <div className="text-left flex-1 mr-4">
                        <h4 className="text-sm font-bold text-white">{part.name}</h4>
                        <div className="flex flex-wrap gap-2.5 text-[10px] font-bold mt-1 uppercase tracking-wider" style={{ color: "#475569" }}>
                          <span>{part.brand}</span>
                          {part.specs.socket && <span>🔌 {part.specs.socket}</span>}
                          {part.specs.vram && <span>💾 {part.specs.vram}</span>}
                          {part.specs.wattage && <span>⚡ {part.specs.wattage}W</span>}
                          {part.specs.capacity && <span>🧠 {part.specs.capacity}</span>}
                          {part.benchmarkScore && (
                            <span className="px-1.5 py-0.5 rounded-full" style={{ background: "rgba(124,58,237,0.12)", color: "#A78BFA" }}>
                              {part.benchmarkScore}/100
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <div className="text-sm font-black text-white">₹{part.price.toLocaleString("en-IN")}</div>
                          {part.retailers && (
                            <div className="text-[9px] font-bold" style={{ color: "#10B981" }}>
                              from ₹{Math.min(...Object.values(part.retailers).map(r => r.price)).toLocaleString("en-IN")}
                            </div>
                          )}
                        </div>
                        <motion.button onClick={() => handleSelectPart(part)}
                          whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }}
                          className="text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all"
                          style={{ background: "linear-gradient(135deg,#7C3AED,#3B82F6)", boxShadow: "0 4px 16px rgba(124,58,237,0.35)" }}
                        >
                          Select
                        </motion.button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12 text-xs" style={{ color: "#475569" }}>No components matched.</div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== Named Save Modal ===== */}
      <AnimatePresence>
        {saveModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
          >
            <motion.div initial={{ opacity: 0, scale: 0.93, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-md w-full rounded-3xl p-7 flex flex-col gap-5"
              style={{ background: "rgba(5,8,22,0.97)", border: "1px solid rgba(124,58,237,0.25)", backdropFilter: "blur(32px)" }}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-base font-black text-white">Name Your Build</h3>
                <button onClick={() => setSaveModalOpen(false)} className="p-2 rounded-xl" style={{ color: "#475569" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                  onMouseLeave={e => e.currentTarget.style.color = "#475569"}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="text-2xl font-black text-white">₹{totalPrice.toLocaleString("en-IN")}</div>
              <input
                type="text"
                value={buildName}
                onChange={e => setBuildName(e.target.value)}
                placeholder="e.g. Gaming Beast Mk2..."
                className="w-full px-4 py-3.5 rounded-xl text-white text-sm focus:outline-none"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(124,58,237,0.3)" }}
                onFocus={e => e.target.style.borderColor = "rgba(124,58,237,0.6)"}
                onBlur={e => e.target.style.borderColor = "rgba(124,58,237,0.3)"}
                autoFocus
                onKeyDown={e => e.key === "Enter" && handleSaveBuild()}
              />
              <div className="flex gap-3">
                <button onClick={() => setSaveModalOpen(false)}
                  className="flex-1 py-3 rounded-xl font-bold text-sm transition-all"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", color: "#94A3B8" }}>
                  Cancel
                </button>
                <motion.button onClick={handleSaveBuild}
                  whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 rounded-xl font-bold text-sm text-white transition-all flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg,#7C3AED,#3B82F6)", boxShadow: "0 4px 24px rgba(124,58,237,0.4)" }}>
                  <CheckCircle className="w-4 h-4" /> Save Build
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}

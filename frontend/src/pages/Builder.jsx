import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useBuilderStore } from "../store/builderStore";
import { useToastStore } from "../store/toastStore";
import { COMPONENTS } from "../services/mockData";
import {
  Cpu, Layers, HardDrive, Pocket, Trash2, AlertTriangle, CheckCircle,
  Plus, ArrowRight, Shield, Sparkles, X, Search, Zap, ChevronRight
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
    { id: "cpu", name: "Processor (CPU)", icon: Cpu, desc: "Brains of the rig. Socket compatibility is verified." },
    { id: "gpu", name: "Graphics Card (GPU)", icon: Layers, desc: "GPU clearance and case lengths are checked." },
    { id: "motherboard", name: "Motherboard", icon: Layers, desc: "Connects all pieces. Dictates RAM generation." },
    { id: "ram", name: "Memory (RAM)", icon: Layers, desc: "Vitals of compiling speeds and gaming loading times." },
    { id: "storage", name: "Storage (SSD/HDD)", icon: HardDrive, desc: "Fast NVMe storage is highly recommended." },
    { id: "psu", name: "Power Supply (PSU)", icon: Pocket, desc: "Feeds clean juice. Dynamic wattage checked." },
    { id: "case", name: "Chassis (Case)", icon: Pocket, desc: "Visual body. Directs GPU card spacing clearance." },
    { id: "cooler", name: "CPU Cooler", icon: Cpu, desc: "Tames heavy TDP heat outputs." },
  ];

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
    const draftBuild = {
      id: `draft-${Date.now()}`,
      name: `Custom Config #${Math.floor(Math.random() * 900) + 100}`,
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

    addToast("Configuration successfully saved to your dashboard!", "success");
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
    <div className="max-w-7xl mx-auto w-full px-6 py-12 relative z-10 text-zinc-100 min-h-screen">
      {/* Background Lights */}
      <div className="fixed top-[10%] left-[-5%] w-[450px] h-[450px] bg-blue-500/4 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="fixed bottom-[20%] right-[-5%] w-[500px] h-[500px] bg-violet-600/4 rounded-full blur-[120px] pointer-events-none -z-10" />

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
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Hardware Pipeline
              </span>
              <h1 className="text-3xl font-black text-white tracking-tight mt-1">
                System <span className="text-gradient-aurora">Configurator</span>
              </h1>
              <p className="text-xs text-zinc-400">Select components to compile your luxury desktop.</p>
            </div>
            <motion.button
              onClick={clearBuild}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="text-xs font-bold text-zinc-500 hover:text-red-400 transition-colors bg-white/5 border border-white/5 hover:border-red-500/20 px-4 py-2.5 rounded-xl"
            >
              Reset Build
            </motion.button>
          </motion.div>

          {/* Build progress bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-zinc-900/50 rounded-2xl p-4 border border-white/5 mb-2"
          >
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="text-zinc-400 uppercase tracking-wider">Build Progress</span>
              <span className="text-blue-400">{filledSlots} / {CATEGORIES.length} components</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden border border-white/5">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-violet-500"
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
                  className={`bg-zinc-900/40 rounded-2xl border transition-all p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group ${
                    selectedPart
                      ? "border-blue-500/20 bg-blue-950/5 shadow-[0_4px_20px_rgba(59,130,246,0.07)]"
                      : "border-white/5 hover:border-white/10"
                  }`}
                >
                  <div className="flex items-center gap-4 text-left">
                    <div
                      className={`p-3 rounded-xl border shrink-0 transition-all ${
                        selectedPart
                          ? "bg-blue-600/10 border-blue-500/20 text-blue-400"
                          : "bg-zinc-900 border-white/5 text-zinc-500 group-hover:text-zinc-300"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold tracking-wider text-zinc-500 block">
                        {cat.name}
                      </span>
                      {selectedPart ? (
                        <div className="flex flex-col text-left">
                          <h4 className="text-sm font-semibold text-white mt-0.5">{selectedPart.name}</h4>
                          <span className="text-[10px] text-zinc-500 font-medium">Brand: {selectedPart.brand}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-zinc-400 font-medium block mt-0.5">{cat.desc}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-4 shrink-0 ml-auto sm:ml-0">
                    {selectedPart ? (
                      <>
                        <span className="text-sm font-black text-white">
                          ₹{selectedPart.price.toLocaleString("en-IN")}
                        </span>
                        <motion.button
                          onClick={() => handleOpenSelector(cat.id)}
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.97 }}
                          className="p-2.5 rounded-xl border border-white/10 hover:border-white/20 text-zinc-500 hover:text-white bg-white/5 transition-colors"
                          title="Change part"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          onClick={() => removePart(cat.id)}
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.97 }}
                          className="p-2.5 rounded-xl border border-red-500/10 hover:border-red-500/20 text-zinc-500 hover:text-red-400 bg-red-950/5 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </>
                    ) : (
                      <motion.button
                        onClick={() => handleOpenSelector(cat.id)}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex items-center gap-1.5 text-xs font-bold bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white px-4 py-2.5 rounded-xl transition-all"
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
          <div className="bg-glass rounded-3xl p-6 border border-white/5 flex flex-col gap-5 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <Shield className="w-4 h-4 text-blue-500" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Build Summary</h3>
            </div>

            {/* Price Counter */}
            <div className="flex justify-between items-end border-b border-white/5 pb-4">
              <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Estimated Total</span>
              <motion.span
                key={totalPrice}
                initial={{ scale: 1.15, color: "#60a5fa" }}
                animate={{ scale: 1, color: "#ffffff" }}
                transition={{ duration: 0.4 }}
                className="text-3xl font-black tracking-tight"
              >
                ₹{totalPrice.toLocaleString("en-IN")}
              </motion.span>
            </div>

            {/* Wattage Progress Bar */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" /> TDP Power Draw
                </span>
                <span className={getWattageColor()}>
                  {estimatedWattage}W / {psuWattage}W
                </span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2.5 overflow-hidden border border-white/5">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${getWattageColor()}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${wattagePercentage}%` }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                />
              </div>
              <span className="text-[10px] text-zinc-500 leading-normal">
                Includes CPU TDP, GPU wattage, and accessory dynamic overhead buffers.
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3 pt-1">
              <motion.button
                onClick={handleSaveBuild}
                disabled={totalPrice === 0}
                whileHover={totalPrice > 0 ? { scale: 1.02, y: -2 } : {}}
                whileTap={totalPrice > 0 ? { scale: 0.98 } : {}}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-center font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/15"
              >
                Save Configuration <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          {/* Compatibility Checker Panel */}
          <div className="bg-glass rounded-3xl p-6 border border-white/5 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest">
              Compatibility Analysis
            </h3>
            <div className="flex flex-col gap-3">
              <AnimatePresence mode="wait">
                {compErrors.length > 0 ? (
                  compErrors.map((err, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`p-4 rounded-xl border flex gap-3 ${
                        err.type === "error"
                          ? "bg-red-950/10 border-red-500/20 text-red-400"
                          : "bg-amber-950/10 border-amber-500/20 text-amber-400"
                      }`}
                    >
                      <AlertTriangle className="w-5 h-5 shrink-0" />
                      <div className="text-xs">
                        <span className="font-extrabold block uppercase tracking-wider">{err.title}</span>
                        <p className="mt-1 text-zinc-300 leading-relaxed">{err.message}</p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    key="ok"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-emerald-950/10 border border-emerald-500/20 rounded-xl flex gap-3 text-emerald-400"
                  >
                    <CheckCircle className="w-5 h-5 shrink-0" />
                    <div className="text-xs">
                      <span className="font-extrabold block uppercase tracking-wider">All Parts Compatible</span>
                      <p className="mt-1 text-zinc-300 leading-relaxed">
                        No power bottlenecks, GPU chassis clearance issues, or socket generation conflicts identified.
                      </p>
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="bg-glass-heavy max-w-2xl w-full rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-500" /> Assign{" "}
                  {activeCategory?.toUpperCase()}
                </h3>
                <motion.button
                  onClick={() => setModalOpen(false)}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                  className="text-zinc-500 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-all"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Search filter in modal */}
              <div className="p-6 border-b border-white/5">
                <div className="relative">
                  <Search className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by hardware model or brand..."
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-900 border border-white/5 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-blue-500 transition-colors"
                    autoFocus
                  />
                </div>
              </div>

              {/* Modal Components List */}
              <div className="p-6 overflow-y-auto max-h-[380px] flex flex-col gap-3">
                {filteredComponents.length > 0 ? (
                  filteredComponents.map((part, i) => (
                    <motion.div
                      key={part.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="p-4 bg-zinc-900/40 hover:bg-zinc-900/80 rounded-2xl border border-white/5 hover:border-blue-500/20 transition-all flex justify-between items-center group"
                    >
                      <div className="text-left">
                        <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                          {part.name}
                        </h4>
                        <div className="flex flex-wrap gap-3 text-[10px] text-zinc-500 font-semibold mt-1 uppercase tracking-wider">
                          <span>Brand: {part.brand}</span>
                          {part.specs.socket && <span>Socket: {part.specs.socket}</span>}
                          {part.specs.vram && <span>VRAM: {part.specs.vram}</span>}
                          {part.specs.wattage && <span>PSU: {part.specs.wattage}W</span>}
                          {part.specs.capacity && <span>RAM: {part.specs.capacity}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-black text-white">
                          ₹{part.price.toLocaleString("en-IN")}
                        </span>
                        <motion.button
                          onClick={() => handleSelectPart(part)}
                          whileHover={{ scale: 1.06 }}
                          whileTap={{ scale: 0.96 }}
                          className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors shadow-lg shadow-blue-500/15"
                        >
                          Select
                        </motion.button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12 text-zinc-500 text-xs">
                    No hardware component models matched your parameters.
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

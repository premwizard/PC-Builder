import React, { useState, useRef } from "react";
import { PREBUILT_PCS } from "../services/mockData";
import { useToastStore } from "../store/toastStore";
import { Search, Star, ArrowRight, ShieldCheck, Monitor, Cpu, Layers } from "lucide-react";
import { motion, AnimatePresence, useInView } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export default function Pcs() {
  const addToast = useToastStore((state) => state.addToast);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const gridRef = useRef(null);
  const isGridVisible = useInView(gridRef, { once: true, margin: "-80px" });

  const categories = ["all", "gaming", "workstation", "budget"];

  // Filter PCs
  const filteredPcs = PREBUILT_PCS.filter((pc) => {
    const matchSearch =
      pc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory =
      selectedCategory === "all" || pc.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  // Track cursor position per card for the spotlight effect
  const [cardMousePos, setCardMousePos] = useState({});

  const handleMouseMove = (e, cardId) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCardMousePos((prev) => ({ ...prev, [cardId]: { x, y } }));
  };

  const handleMouseLeave = (cardId) => {
    setCardMousePos((prev) => ({ ...prev, [cardId]: null }));
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "gaming": return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      case "workstation": return "text-violet-400 bg-violet-500/10 border-violet-500/20";
      case "budget": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      default: return "text-zinc-400 bg-zinc-800 border-white/10";
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "#050816", color: "#fff" }}>
      {/* Background ambient glows */}
      <div className="fixed top-[15%] right-[5%] w-[500px] h-[500px] rounded-full pointer-events-none -z-10"
        style={{ background: "radial-gradient(circle,rgba(124,58,237,0.08) 0%,transparent 70%)", filter: "blur(100px)" }} />
      <div className="fixed bottom-[10%] left-[5%] w-[500px] h-[500px] rounded-full pointer-events-none -z-10"
        style={{ background: "radial-gradient(circle,rgba(59,130,246,0.07) 0%,transparent 70%)", filter: "blur(100px)" }} />

      <div className="max-w-7xl mx-auto w-full px-6 py-12 relative z-10">

      {/* Animated Header Banner */}
      <motion.div
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className="relative overflow-hidden rounded-3xl p-8 md:p-14 border flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12"
        style={{ background: "linear-gradient(135deg,rgba(124,58,237,0.1) 0%,rgba(11,17,32,0.8) 60%,rgba(5,8,22,0.9) 100%)", border: "1px solid rgba(124,58,237,0.18)", backdropFilter: "blur(20px)" }}
      >
        {/* Decorative animated glow */}
        <motion.div
          className="absolute -top-16 -left-16 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-16 right-0 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="flex flex-col gap-4 text-left relative z-10">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1.5"
          >
            <Monitor className="w-3.5 h-3.5" /> High-Performance Desktops
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none"
          >
            Handcrafted Gaming &<br />
            <span className="text-gradient-aurora">Workstation PCs</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="text-sm text-zinc-400 max-w-xl leading-relaxed"
          >
            Acquire liquid-cooled desktop systems designed for maximal graphics workloads,
            heavy compilation pipelines, and multi-threaded processing.
          </motion.p>
        </div>

        {/* Stats pills */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col gap-3 shrink-0 relative z-10"
        >
          {[
            { icon: Cpu, label: "Prebuilt Systems", value: `${PREBUILT_PCS.length}+` },
            { icon: ShieldCheck, label: "QA Certified", value: "100%" },
            { icon: Layers, label: "Warranty", value: "3 Years" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 bg-white/5 border border-white/8 rounded-2xl px-4 py-3 backdrop-blur-sm"
            >
              <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <stat.icon className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold block">{stat.label}</span>
                <span className="text-sm font-black text-white">{stat.value}</span>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Category Pills & Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center pb-6 border-b border-white/5 mb-8"
      >
        <div className="flex gap-2 overflow-x-auto scrollbar-none py-1">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap uppercase tracking-wider transition-all hover:-translate-y-0.5 ${
                selectedCategory === cat
                  ? "text-white"
                  : "text-slate-400 hover:text-white"
              }`}
              style={selectedCategory === cat
                ? { background: "linear-gradient(135deg,#7C3AED,#3B82F6)", border: "1px solid rgba(124,58,237,0.5)", boxShadow: "0 4px 20px rgba(124,58,237,0.3)" }
                : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }
              }
            >
              {cat === "all" ? "All Systems" : `${cat} rigs`}
            </motion.button>
          ))}
        </div>

        <div className="w-full md:w-80 relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search custom prebuilts..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-white/5 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </motion.div>

      {/* Product Grid */}
      <div ref={gridRef}>
        <AnimatePresence mode="wait">
          {filteredPcs.length > 0 ? (
            <motion.div
              key={selectedCategory + searchTerm}
              variants={containerVariants}
              initial="hidden"
              animate={isGridVisible ? "visible" : "hidden"}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {filteredPcs.map((pc) => {
                const mousePos = cardMousePos[pc.id];
                const bgStyle = mousePos
                  ? {
                      background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(59, 130, 246, 0.1), rgba(10, 10, 15, 0.55))`,
                    }
                  : { background: "rgba(10, 10, 15, 0.55)" };

                return (
                  <motion.div
                    key={pc.id}
                    variants={cardVariants}
                    onMouseMove={(e) => handleMouseMove(e, pc.id)}
                    onMouseLeave={() => handleMouseLeave(pc.id)}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    className="h-full flex flex-col justify-between rounded-3xl overflow-hidden border border-white/6 hover:border-blue-500/20 transition-all duration-300 hover:shadow-[0_20px_50px_-15px_rgba(59,130,246,0.15)] group relative"
                    style={{ ...bgStyle, backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
                  >
                    {/* Fixed Height Image Wrapper */}
                    <div className="h-48 w-full flex items-center justify-center p-4 bg-zinc-900/35 overflow-hidden border-b border-white/5 relative">
                      {/* Category + QA badges */}
                      <div className="absolute top-4 left-4 flex gap-1 items-center z-10">
                        <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${getCategoryColor(pc.category)}`}>
                          {pc.category}
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> QA
                        </span>
                      </div>

                      <motion.img
                        src={pc.image}
                        alt={pc.name}
                        className="max-h-full max-w-full object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)] z-10"
                        whileHover={{ scale: 1.07 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      />
                    </div>

                    {/* Specs & Actions */}
                    <div className="p-5 flex flex-col gap-4 text-left flex-grow justify-between">
                      <div>
                        <div className="flex justify-between items-center gap-1.5 mb-1">
                          <h3 className="text-base font-black text-white tracking-tight line-clamp-1 group-hover:text-blue-300 transition-colors">
                            {pc.name}
                          </h3>
                          <div className="flex items-center gap-0.5 text-[10px] text-zinc-400 font-bold shrink-0">
                            <Star className="w-3 h-3 fill-blue-500 text-blue-500" /> {pc.rating}
                          </div>
                        </div>
                        <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">
                          {pc.brand}
                        </span>
                        <p className="text-xs text-zinc-400 leading-relaxed mt-2.5 line-clamp-2">
                          {pc.description}
                        </p>
                      </div>

                      {/* Technical Specs Grid */}
                      <div className="flex flex-col gap-2 bg-zinc-900/40 p-3.5 rounded-xl border border-white/5 text-[10px] text-zinc-300">
                        <div className="flex justify-between">
                          <span className="text-zinc-500 font-medium">Processor</span>
                          <span className="font-bold truncate max-w-[110px]">{pc.specs.cpu}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500 font-medium">Graphics</span>
                          <span className="font-bold text-blue-400 truncate max-w-[110px]">{pc.specs.gpu}</span>
                        </div>
                      </div>

                      {/* Buy / CTA */}
                      <div className="flex justify-between items-center pt-3 border-t border-white/5">
                        <div>
                          <span className="text-[8px] uppercase tracking-widest text-zinc-500 block font-bold">
                            Estimated Cost
                          </span>
                          <span className="text-lg font-black text-white">
                            ₹{pc.price.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <motion.button
                          onClick={() =>
                            addToast(`Initiating builder pipeline for ${pc.name}...`, "info")
                          }
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.96 }}
                          className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all shadow-md shadow-blue-500/15 flex items-center gap-1"
                        >
                          Acquire <ArrowRight className="w-3.5 h-3.5" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-glass border border-white/5 rounded-3xl p-12 text-center"
            >
              <Monitor className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
              <span className="text-sm font-semibold text-zinc-500 block">
                No prebuilt systems found.
              </span>
              <p className="text-xs text-zinc-600 mt-1">
                Try relaxing your search keywords or category filters.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </div>
    </div>
  );
}

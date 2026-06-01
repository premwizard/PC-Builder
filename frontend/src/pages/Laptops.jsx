import React, { useState } from "react";
import { LAPTOPS } from "../services/mockData";
import { useToastStore } from "../store/toastStore";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Star, ArrowRightLeft, Sparkles, X, Check, Laptop } from "lucide-react";

export default function Laptops() {
  const addToast = useToastStore((state) => state.addToast);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Retrieve unique brands and categories
  const brands = ["all", ...Array.from(new Set(LAPTOPS.map((l) => l.brand)))];
  const categories = ["all", ...Array.from(new Set(LAPTOPS.map((l) => l.category)))];

  // Filtering logic
  const filteredLaptops = LAPTOPS.filter((lap) => {
    const matchSearch = lap.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        lap.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchBrand = selectedBrand === "all" || lap.brand === selectedBrand;
    const matchCategory = selectedCategory === "all" || lap.category === selectedCategory;
    return matchSearch && matchBrand && matchCategory;
  });

  const handleToggleCompare = (laptop) => {
    if (compareList.some((item) => item.id === laptop.id)) {
      setCompareList(compareList.filter((item) => item.id !== laptop.id));
    } else {
      if (compareList.length >= 2) {
        addToast("You can compare up to 2 laptops at a time.", "warning");
        return;
      }
      setCompareList([...compareList, laptop]);
    }
  };

  const getBrandCardStyles = (brand) => {
    switch (brand.toLowerCase()) {
      case "razer":
        return {
          glow: "hover:border-emerald-500/35 border-emerald-500/10 hover:shadow-[0_15px_30px_rgba(16,185,129,0.08)]",
          accent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
          btn: "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/15"
        };
      case "asus rog":
        return {
          glow: "hover:border-red-500/35 border-red-500/10 hover:shadow-[0_15px_30px_rgba(239,68,68,0.08)]",
          accent: "text-red-400 bg-red-500/10 border-red-500/20",
          btn: "bg-red-600 hover:bg-red-500 shadow-red-500/15"
        };
      case "alienware":
        return {
          glow: "hover:border-cyan-500/35 border-cyan-500/10 hover:shadow-[0_15px_30px_rgba(6,182,212,0.08)]",
          accent: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
          btn: "bg-cyan-600 hover:bg-cyan-500 shadow-cyan-500/15"
        };
      default:
        return {
          glow: "hover:border-orange-500/35 border-orange-500/10 hover:shadow-[0_15px_30px_rgba(249,115,22,0.08)]",
          accent: "text-orange-400 bg-orange-500/10 border-orange-500/20",
          btn: "bg-orange-600 hover:bg-orange-500 shadow-orange-500/15"
        };
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "#050816", color: "#fff" }}>
      {/* Background Aurora */}
      <div className="fixed top-[10%] left-[-5%] w-[450px] h-[450px] rounded-full blur-[100px] pointer-events-none -z-10"
        style={{ background: "radial-gradient(circle,rgba(6,182,212,0.07) 0%,transparent 70%)" }} />
      <div className="fixed bottom-[20%] right-[-5%] w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none -z-10"
        style={{ background: "radial-gradient(circle,rgba(124,58,237,0.07) 0%,transparent 70%)" }} />

      <div className="max-w-7xl mx-auto w-full px-6 py-12 relative z-10">
      {/* Header section */}
      <div className="rounded-3xl p-8 md:p-12 border flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,rgba(6,182,212,0.08) 0%,rgba(11,17,32,0.8) 60%,rgba(5,8,22,0.9) 100%)", border: "1px solid rgba(6,182,212,0.18)", backdropFilter: "blur(20px)" }}>
        <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,rgba(6,182,212,0.15) 0%,transparent 70%)", filter: "blur(30px)" }} />
        <div className="flex flex-col gap-3 text-left">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Luxury Portables
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">Gaming Laptops</h1>
          <p className="text-xs text-zinc-400 max-w-xl leading-relaxed">
            Acquire top-calibre mobile battle rigs. Engineered with high refresh rate screens, liquid metal cooling profiles, and next-generation architecture.
          </p>
        </div>
        <div className="flex gap-4 items-center shrink-0">
          <button 
            disabled={compareList.length < 2}
            onClick={() => setShowCompareModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 disabled:opacity-50 text-white font-bold text-xs px-6 py-4 rounded-xl transition-all shadow-lg hover:scale-105"
          >
            <ArrowRightLeft className="w-4 h-4" /> Compare Laptops ({compareList.length}/2)
          </button>
        </div>
      </div>

      {/* Search and Filters panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
        {/* Left Filters */}
        <aside className="lg:col-span-3 bg-glass rounded-3xl p-6 border border-white/5 flex flex-col gap-6 text-left">
          <div className="flex justify-between items-center pb-4 border-b border-white/5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-blue-500" /> Filters
            </h3>
            <button 
              onClick={() => {
                setSelectedBrand("all");
                setSelectedCategory("all");
                setSearchTerm("");
              }}
              className="text-[10px] text-zinc-500 hover:text-blue-400 font-bold"
            >
              Reset All
            </button>
          </div>

          {/* Search bar */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Model, specs, or keyword..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-white/5 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Brand select */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Brand</label>
            <div className="flex flex-col gap-1.5">
              {brands.map((b) => (
                <button
                  key={b}
                  onClick={() => setSelectedBrand(b)}
                  className={`text-left text-xs px-3.5 py-2.5 rounded-xl transition-all border flex justify-between items-center ${
                    selectedBrand === b
                      ? "bg-blue-600/10 border-blue-500/20 text-blue-400 font-bold"
                      : "bg-transparent border-transparent text-zinc-400 hover:text-white"
                  }`}
                >
                  <span className="capitalize">{b === "all" ? "All Brands" : b}</span>
                  {selectedBrand === b && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Category select */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Category</label>
            <div className="flex flex-col gap-1.5">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`text-left text-xs px-3.5 py-2.5 rounded-xl transition-all border flex justify-between items-center ${
                    selectedCategory === c
                      ? "bg-blue-600/10 border-blue-500/20 text-blue-400 font-bold"
                      : "bg-transparent border-transparent text-zinc-400 hover:text-white"
                  }`}
                >
                  <span className="capitalize">{c === "all" ? "All Categories" : c}</span>
                  {selectedCategory === c && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Laptops Grid (Symmetrical & Aligned, 4 columns on desktop, 2 on tablet, 1 on mobile) */}
        <main className="lg:col-span-9 flex flex-col gap-4">
          <div className="flex justify-between items-center text-xs text-zinc-400 mb-2">
            <span>Showing {filteredLaptops.length} Laptops</span>
          </div>

          {filteredLaptops.length > 0 ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {filteredLaptops.map((lap) => {
                const isCompared = compareList.some((item) => item.id === lap.id);
                const styles = getBrandCardStyles(lap.brand);
                return (
                  <motion.div
                    variants={itemVariants}
                    whileHover={{ y: -6, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    key={lap.id}
                    className={`h-full flex flex-col justify-between bg-glass rounded-3xl overflow-hidden border transition-all duration-300 hover:shadow-lg group ${styles.glow}`}
                  >
                    {/* Fixed Height Image Wrapper */}
                    <div className="h-48 w-full flex items-center justify-center p-4 bg-zinc-900/35 overflow-hidden border-b border-white/5 relative">
                      <div className="absolute top-4 left-4 flex gap-1 items-center z-10">
                        <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${styles.accent}`}>
                          {lap.brand}
                        </span>
                      </div>
                      
                      <div className="absolute top-4 right-4 z-10">
                        <button
                          onClick={() => handleToggleCompare(lap)}
                          className={`p-2 rounded-lg border transition-all ${
                            isCompared 
                              ? "bg-cyan-600 border-cyan-500 text-white" 
                              : "bg-white/5 border-white/10 hover:border-white/20 text-zinc-400 hover:text-white"
                          }`}
                          title="Add to compare checklist"
                        >
                          <ArrowRightLeft className="w-3 h-3" />
                        </button>
                      </div>

                      <img
                        src={lap.image}
                        alt={lap.name}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                      />
                    </div>

                    {/* Metadata & Specs Sheet */}
                    <div className="p-6 flex flex-col gap-4 text-left flex-grow justify-between">
                      <div>
                        <div className="flex justify-between items-center gap-1.5">
                          <h3 className="text-base font-black text-white tracking-tight line-clamp-1">{lap.name}</h3>
                          <div className="flex items-center gap-0.5 text-[10px] text-zinc-400 font-bold shrink-0">
                            <Star className="w-3.5 h-3.5 fill-blue-500 text-blue-500" /> {lap.rating}
                          </div>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed mt-2.5 line-clamp-2">
                          {lap.description}
                        </p>
                      </div>

                      {/* Highlight Specs */}
                      <div className="flex flex-col gap-2.5 bg-zinc-900/40 p-4 rounded-xl border border-white/5 text-[10px] text-zinc-300">
                        <div className="flex justify-between">
                          <span className="text-zinc-500 font-medium">CPU</span>
                          <span className="font-bold truncate max-w-[100px]">{lap.specs.cpu}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500 font-medium">GPU</span>
                          <span className="font-bold text-blue-400 truncate max-w-[100px]">{lap.specs.gpu}</span>
                        </div>
                      </div>

                      {/* Buy Action Row */}
                      <div className="flex justify-between items-center pt-3 border-t border-white/5">
                        <div>
                          <span className="text-[8px] uppercase tracking-widest text-zinc-500 block font-bold">Price</span>
                          <span className="text-lg font-black text-white">₹{lap.price.toLocaleString("en-IN")}</span>
                        </div>
                        <button
                          onClick={() => addToast(`Redirecting to verified partner store for purchasing ${lap.name}...`, "info")}
                          className={`text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all shadow-md ${styles.btn}`}
                        >
                          Acquire
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <div className="bg-glass rounded-3xl p-12 text-center border border-white/5">
              <Laptop className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
              <span className="text-sm font-semibold text-zinc-500 block">No matching laptops found.</span>
              <p className="text-xs text-zinc-600 mt-1">Try resetting your brand, search strings or filters.</p>
            </div>
          )}
        </main>
      </div>

      {/* Comparison Modal */}
      {showCompareModal && compareList.length >= 2 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <div className="bg-glass-heavy max-w-4xl w-full rounded-3xl border border-white/10 overflow-hidden shadow-2xl relative">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-blue-500" /> Technical comparison
              </h3>
              <button
                onClick={() => setShowCompareModal(false)}
                className="text-zinc-400 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-xs text-zinc-500 uppercase tracking-widest">
                    <th className="py-4 font-bold">Specification</th>
                    <th className="py-4 font-bold text-white text-center w-1/3">{compareList[0].name}</th>
                    <th className="py-4 font-bold text-white text-center w-1/3">{compareList[1].name}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs">
                  <tr className="text-zinc-300">
                    <td className="py-3.5 font-semibold text-zinc-500">Brand</td>
                    <td className="py-3.5 text-center font-bold text-blue-400">{compareList[0].brand}</td>
                    <td className="py-3.5 text-center font-bold text-blue-400">{compareList[1].brand}</td>
                  </tr>
                  <tr className="text-zinc-300">
                    <td className="py-3.5 font-semibold text-zinc-500">Price</td>
                    <td className={`py-3.5 text-center font-bold ${compareList[0].price <= compareList[1].price ? "text-emerald-400" : ""}`}>
                      ₹{compareList[0].price.toLocaleString("en-IN")}
                    </td>
                    <td className={`py-3.5 text-center font-bold ${compareList[1].price <= compareList[0].price ? "text-emerald-400" : ""}`}>
                      ₹{compareList[1].price.toLocaleString("en-IN")}
                    </td>
                  </tr>
                  <tr className="text-zinc-300">
                    <td className="py-3.5 font-semibold text-zinc-500">CPU Chipset</td>
                    <td className="py-3.5 text-center">{compareList[0].specs.cpu}</td>
                    <td className="py-3.5 text-center">{compareList[1].specs.cpu}</td>
                  </tr>
                  <tr className="text-zinc-300">
                    <td className="py-3.5 font-semibold text-zinc-500">GPU Core</td>
                    <td className="py-3.5 text-center">{compareList[0].specs.gpu}</td>
                    <td className="py-3.5 text-center">{compareList[1].specs.gpu}</td>
                  </tr>
                  <tr className="text-zinc-300">
                    <td className="py-3.5 font-semibold text-zinc-500">Display specs</td>
                    <td className="py-3.5 text-center">{compareList[0].specs.display}</td>
                    <td className="py-3.5 text-center">{compareList[1].specs.display}</td>
                  </tr>
                  <tr className="text-zinc-300">
                    <td className="py-3.5 font-semibold text-zinc-500">RAM capacity</td>
                    <td className="py-3.5 text-center">{compareList[0].specs.ram}</td>
                    <td className="py-3.5 text-center">{compareList[1].specs.ram}</td>
                  </tr>
                  <tr className="text-zinc-300">
                    <td className="py-3.5 font-semibold text-zinc-500">Storage capacity</td>
                    <td className="py-3.5 text-center">{compareList[0].specs.storage}</td>
                    <td className="py-3.5 text-center">{compareList[1].specs.storage}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-6 border-t border-white/5 flex justify-end gap-3">
              <button
                onClick={() => setCompareList([])}
                className="text-xs font-bold text-red-400 hover:bg-red-500/10 px-4 py-2.5 rounded-xl transition-all"
              >
                Clear Selections
              </button>
              <button
                onClick={() => setShowCompareModal(false)}
                className="bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-bold px-5 py-2.5 rounded-xl transition-all"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

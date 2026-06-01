import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { COMPONENTS } from "../services/mockData";
import { useBuilderStore } from "../store/builderStore";
import { useToastStore } from "../store/toastStore";
import { Search, SlidersHorizontal, Star, ArrowRightLeft, Plus, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ComponentLibrary() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const addPart = useBuilderStore((state) => state.addPart);
  const addToast = useToastStore((state) => state.addToast);
  const navigate = useNavigate();

  const categories = [
    { id: "all", name: "All Parts" },
    { id: "cpu", name: "CPUs" },
    { id: "gpu", name: "GPUs" },
    { id: "motherboard", name: "Motherboards" },
    { id: "ram", name: "RAM" },
    { id: "storage", name: "Storage" },
    { id: "psu", name: "PSUs" },
    { id: "case", name: "Cases" },
    { id: "cooler", name: "Coolers" },
  ];

  // Retrieve unique brands for filter options
  const allBrands = Array.from(new Set(COMPONENTS.map((c) => c.brand)));

  const handleBrandChange = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  // Filter logic
  const filteredComponents = COMPONENTS.filter((part) => {
    if (activeCategory !== "all" && part.category !== activeCategory) return false;
    if (searchTerm && !part.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (selectedBrands.length > 0 && !selectedBrands.includes(part.brand)) return false;
    return true;
  });

  // Sorting logic
  const sortedComponents = [...filteredComponents].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "reviews") return b.reviews - a.reviews;
    return b.rating - a.rating;
  });

  const handleAddToBuild = (part) => {
    addPart(part.category, part);
    addToast(`${part.name} added to your active configuration!`, "success");
    navigate("/builder");
  };

  // Helper to fetch matching high-quality generated assets per category
  const getCategoryImage = (category) => {
    switch (category) {
      case "cpu":
        return "/images/cpu_chip.png";
      case "gpu":
        return "/images/rtx_gpu.png";
      case "motherboard":
      case "ram":
        return "/images/motherboard.png";
      case "case":
      case "psu":
      case "cooler":
        return "/images/gaming_pc.png";
      default:
        return "/images/cpu_chip.png";
    }
  };

  // Helper to get border glow style depending on category
  const getCategoryGlow = (category) => {
    switch (category) {
      case "cpu":
        return "hover:border-emerald-500/30 shadow-emerald-500/5";
      case "gpu":
        return "hover:border-blue-500/30 shadow-blue-500/5";
      case "motherboard":
        return "hover:border-violet-500/30 shadow-violet-500/5";
      default:
        return "hover:border-cyan-500/30 shadow-cyan-500/5";
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-6 py-12 relative z-10 text-zinc-100 min-h-screen">
      {/* Ambient background glows */}
      <div className="absolute top-[10%] left-[-5%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-5%] w-[450px] h-[450px] bg-violet-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Banner and Search Bar */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center pb-8 border-b border-white/5">
        <div className="text-left">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block">Hardware Catalog</span>
          <h1 className="text-3xl font-black text-white tracking-tight mt-1">Component Library</h1>
          <p className="text-xs text-zinc-400">Search and configure verified standalone parts.</p>
        </div>

        <div className="w-full md:w-96 relative">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search processors, GPUs, RAM..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-900 border border-white/5 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="flex gap-2.5 overflow-x-auto py-4 scrollbar-none border-b border-white/5">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id);
              setSelectedBrands([]);
            }}
            className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all uppercase tracking-wider border ${
              activeCategory === cat.id
                ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/10"
                : "bg-zinc-900 border-white/5 text-zinc-400 hover:text-white"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-start">
        {/* Left Side Sidebar: Filters */}
        <aside className="lg:col-span-3 bg-glass rounded-3xl p-6 border border-white/5 flex flex-col gap-6 text-left">
          <div className="flex justify-between items-center pb-4 border-b border-white/5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-blue-500" /> Filters
            </h3>
            <button
              onClick={() => setSelectedBrands([])}
              className="text-[10px] text-zinc-500 hover:text-blue-400 font-bold"
            >
              Reset
            </button>
          </div>

          {/* Sort selection */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="rating">Best Rated</option>
              <option value="reviews">Most Reviewed</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {/* Brand Filter */}
          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Brand</label>
            <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
              {allBrands.map((brand) => {
                const isSelected = selectedBrands.includes(brand);
                return (
                  <label key={brand} className="flex items-center gap-2.5 text-xs text-zinc-400 cursor-pointer hover:text-white transition-colors">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleBrandChange(brand)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                        isSelected ? "bg-blue-600 border-blue-500" : "bg-zinc-900 border-white/10"
                      }`}>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                    <span>{brand}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Right Side: Component Grid (Aligned 4-2-1 Grid with Symmetrical Aspect) */}
        <main className="lg:col-span-9">
          <div className="flex justify-between items-center text-xs text-zinc-400 mb-6">
            <span>Showing {sortedComponents.length} of {COMPONENTS.length} components</span>
          </div>

          {sortedComponents.length > 0 ? (
            <motion.div 
              layout 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              <AnimatePresence>
                {sortedComponents.map((part) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    key={part.id}
                    className={`h-full flex flex-col justify-between bg-glass rounded-3xl p-5 border border-white/5 hover:-translate-y-1.5 transition-all group ${getCategoryGlow(part.category)}`}
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-[8px] font-extrabold uppercase tracking-widest px-2 py-0.5 bg-zinc-800 border border-white/5 rounded-full text-zinc-400">
                          {part.category}
                        </span>
                        <div className="flex items-center gap-0.5 text-[10px] text-zinc-400 font-bold">
                          <Star className="w-3 h-3 text-blue-500 fill-blue-500" />
                          {part.rating}
                        </div>
                      </div>

                      {/* Fixed Aspect Image Wrapper */}
                      <div className="h-44 w-full flex items-center justify-center p-4 bg-zinc-900/20 rounded-2xl border border-white/5 overflow-hidden mb-4">
                        <img 
                          src={getCategoryImage(part.category)} 
                          alt={part.name} 
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                        />
                      </div>

                      <h4 className="text-sm font-bold text-white line-clamp-1 text-left">{part.name}</h4>
                      <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block text-left mt-0.5">{part.brand}</span>

                      {/* Technical Specifications */}
                      <div className="flex flex-col gap-1.5 mt-4 text-xs text-zinc-400 pb-4 border-b border-white/5">
                        {part.specs.socket && (
                          <div className="flex justify-between">
                            <span className="text-zinc-500 font-medium">Socket</span>
                            <span className="text-white font-bold">{part.specs.socket}</span>
                          </div>
                        )}
                        {part.specs.vram && (
                          <div className="flex justify-between">
                            <span className="text-zinc-500 font-medium">VRAM</span>
                            <span className="text-white font-bold text-blue-400">{part.specs.vram}</span>
                          </div>
                        )}
                        {part.specs.wattage && (
                          <div className="flex justify-between">
                            <span className="text-zinc-500 font-medium">Wattage</span>
                            <span className="text-white font-bold">{part.specs.wattage}W</span>
                          </div>
                        )}
                        {part.specs.capacity && (
                          <div className="flex justify-between">
                            <span className="text-zinc-500 font-medium">Capacity</span>
                            <span className="text-white font-bold">{part.specs.capacity}</span>
                          </div>
                        )}
                        {part.specs.formFactor && (
                          <div className="flex justify-between">
                            <span className="text-zinc-500 font-medium">Form Factor</span>
                            <span className="text-white font-bold">{part.specs.formFactor}</span>
                          </div>
                        )}
                        {part.specs.type && (
                          <div className="flex justify-between">
                            <span className="text-zinc-500 font-medium">Type</span>
                            <span className="text-white font-bold">{part.specs.type}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Price and Add CTA */}
                    <div className="mt-5 flex items-center justify-between gap-2 pt-2">
                      <span className="text-lg font-black text-white">₹{part.price.toLocaleString("en-IN")}</span>
                      <div className="flex gap-2">
                        <Link
                          to="/compare"
                          className="p-2 border border-white/10 hover:border-white/20 rounded-xl text-zinc-400 hover:text-white bg-white/5 transition-colors"
                          title="Compare specifications"
                        >
                          <ArrowRightLeft className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleAddToBuild(part)}
                          className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-0.5"
                        >
                          <Plus className="w-3 h-3" /> Add
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="text-center py-20 bg-glass rounded-3xl border border-white/5">
              <span className="text-sm font-medium text-zinc-500 block">No components found.</span>
              <p className="text-xs text-zinc-500 mt-1">Try relaxing your search keywords or category filters.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

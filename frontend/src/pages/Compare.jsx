import React, { useState } from "react";
import { COMPONENTS } from "../services/mockData";
import { ArrowRightLeft, Star, TrendingUp, AlertTriangle } from "lucide-react";

export default function Compare() {
  const [activeCategory, setActiveCategory] = useState("cpu");
  const [partAId, setPartAId] = useState("");
  const [partBId, setPartBId] = useState("");

  const categories = [
    { id: "cpu", name: "CPUs" },
    { id: "gpu", name: "GPUs" },
    { id: "motherboard", name: "Motherboards" },
    { id: "ram", name: "RAM" },
    { id: "storage", name: "Storage" },
    { id: "psu", name: "PSUs" },
    { id: "case", name: "Cases" },
    { id: "cooler", name: "Coolers" },
  ];

  // Get components in the active category
  const activeCategoryParts = COMPONENTS.filter((c) => c.category === activeCategory);

  const partA = activeCategoryParts.find((c) => c.id === partAId);
  const partB = activeCategoryParts.find((c) => c.id === partBId);

  // Helper to render spec value and highlight if superior
  const renderSpecRow = (label, keyA, keyB, unit = "", higherIsBetter = true) => {
    if (!partA || !partB) return null;

    const valA = partA.specs[keyA];
    const valB = partB.specs[keyB];

    if (valA === undefined || valB === undefined) return null;

    let isABetter = false;
    let isBBetter = false;

    // Convert strings to float if comparing numeric values
    const numA = typeof valA === "string" ? parseFloat(valA) : valA;
    const numB = typeof valB === "string" ? parseFloat(valB) : valB;

    if (numA !== null && numB !== null && !isNaN(numA) && !isNaN(numB)) {
      if (higherIsBetter) {
        isABetter = numA > numB;
        isBBetter = numB > numA;
      } else {
        isABetter = numA < numB;
        isBBetter = numB < numA;
      }
    }

    return (
      <div className="grid grid-cols-3 py-3 border-b border-white/5 text-xs text-zinc-300">
        <span className="text-zinc-500 font-semibold">{label}</span>
        <span className={isABetter ? "text-emerald-400 font-bold" : "text-white"}>
          {valA} {unit}
        </span>
        <span className={isBBetter ? "text-emerald-400 font-bold" : "text-white"}>
          {valB} {unit}
        </span>
      </div>
    );
  };

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    setPartAId("");
    setPartBId("");
  };

  return (
    <div className="max-w-6xl mx-auto w-full px-6 py-12 relative z-10">
      <div className="pb-8 border-b border-white/5 mb-8">
        <h1 className="text-3xl font-black text-white">Compare Components</h1>
        <p className="text-xs text-zinc-400">Select a category and compare two parts side by side.</p>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2.5 overflow-x-auto pb-4 mb-8 scrollbar-none border-b border-white/5">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.id)}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
              activeCategory === cat.id
                ? "bg-blue-600 border-blue-500 text-white"
                : "bg-zinc-900 border-white/5 text-zinc-400 hover:text-white"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Comparison Selectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-8">
        {/* Component Selector A */}
        <div className="bg-glass rounded-3xl p-6 border border-white/5">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-3">
            Component A
          </label>
          <select
            value={partAId}
            onChange={(e) => setPartAId(e.target.value)}
            className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">Select a component...</option>
            {activeCategoryParts.map((p) => (
              <option key={p.id} value={p.id}>
                {p.brand} {p.name} (₹{p.price.toLocaleString("en-IN")})
              </option>
            ))}
          </select>
        </div>

        {/* Component Selector B */}
        <div className="bg-glass rounded-3xl p-6 border border-white/5">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-3">
            Component B
          </label>
          <select
            value={partBId}
            onChange={(e) => setPartBId(e.target.value)}
            className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">Select a component...</option>
            {activeCategoryParts.map((p) => (
              <option key={p.id} value={p.id}>
                {p.brand} {p.name} (₹{p.price.toLocaleString("en-IN")})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Side by Side Specs Sheet */}
      {partA && partB ? (
        <div className="bg-glass rounded-3xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 bg-zinc-900/20 grid grid-cols-3 text-sm font-bold text-white uppercase tracking-wider">
            <span>Metric</span>
            <span>{partA.brand} {partA.name}</span>
            <span>{partB.brand} {partB.name}</span>
          </div>

          <div className="p-6 flex flex-col">
            {/* Price (Cheaper is better) */}
            <div className="grid grid-cols-3 py-3 border-b border-white/5 text-xs text-zinc-300">
              <span className="text-zinc-500 font-semibold">Price</span>
              <span className={partA.price < partB.price ? "text-emerald-400 font-bold" : "text-white"}>
                ₹{partA.price.toLocaleString("en-IN")}
              </span>
              <span className={partB.price < partA.price ? "text-emerald-400 font-bold" : "text-white"}>
                ₹{partB.price.toLocaleString("en-IN")}
              </span>
            </div>

            {/* Rating */}
            <div className="grid grid-cols-3 py-3 border-b border-white/5 text-xs text-zinc-300">
              <span className="text-zinc-500 font-semibold">User Rating</span>
              <span className="flex items-center gap-1 text-white">
                <Star className="w-3.5 h-3.5 fill-blue-500 text-blue-500" />
                {partA.rating} ({partA.reviews})
              </span>
              <span className="flex items-center gap-1 text-white">
                <Star className="w-3.5 h-3.5 fill-blue-500 text-blue-500" />
                {partB.rating} ({partB.reviews})
              </span>
            </div>

            {/* Dynamically render spec rows based on category */}
            {activeCategory === "cpu" && (
              <>
                {renderSpecRow("Socket Type", "socket", "socket")}
                {renderSpecRow("Core Count", "cores", "cores", "", true)}
                {renderSpecRow("Thread Count", "threads", "threads", "", true)}
                {renderSpecRow("Power Draw (TDP)", "tdp", "tdp", "W", false)}
              </>
            )}

            {activeCategory === "gpu" && (
              <>
                {renderSpecRow("VRAM", "vram", "vram")}
                {renderSpecRow("Physical Length", "length", "length", "mm", false)}
                {renderSpecRow("Consumption", "wattage", "wattage", "W", false)}
              </>
            )}

            {activeCategory === "motherboard" && (
              <>
                {renderSpecRow("Socket Support", "socket", "socket")}
                {renderSpecRow("Form Factor", "formFactor", "formFactor")}
                {renderSpecRow("Memory Slots Gen", "memoryType", "memoryType")}
                {renderSpecRow("Max RAM Supported", "maxMemory", "maxMemory")}
              </>
            )}

            {activeCategory === "ram" && (
              <>
                {renderSpecRow("Memory Gen", "type", "type")}
                {renderSpecRow("Speed", "speed", "speed")}
                {renderSpecRow("Kit Capacity", "capacity", "capacity")}
              </>
            )}

            {activeCategory === "storage" && (
              <>
                {renderSpecRow("Drive Type", "type", "type")}
                {renderSpecRow("Storage Capacity", "capacity", "capacity")}
                {renderSpecRow("Read Speed", "readSpeed", "readSpeed")}
              </>
            )}

            {activeCategory === "psu" && (
              <>
                {renderSpecRow("Output Wattage", "wattage", "wattage", "W", true)}
                {renderSpecRow("Efficiency Certificate", "efficiency", "efficiency")}
                {renderSpecRow("Modularity", "modularity", "modularity")}
              </>
            )}

            {activeCategory === "case" && (
              <>
                {renderSpecRow("Chassis Type", "type", "type")}
                {renderSpecRow("Max GPU Length", "gpuMaxLength", "gpuMaxLength", "mm", true)}
                {renderSpecRow("Side Panel Panel", "sidePanel", "sidePanel")}
              </>
            )}

            {activeCategory === "cooler" && (
              <>
                {renderSpecRow("Cooler Type", "type", "type")}
                {renderSpecRow("Radiator Size", "radiatorSize", "radiatorSize")}
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-glass border border-white/5 rounded-3xl flex flex-col items-center justify-center gap-3">
          <ArrowRightLeft className="w-8 h-8 text-zinc-500 animate-pulse" />
          <span className="text-sm font-semibold text-zinc-400">Please select two parts above to start comparison</span>
        </div>
      )}
    </div>
  );
}

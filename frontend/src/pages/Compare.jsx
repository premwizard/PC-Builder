import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { COMPONENTS } from "../services/mockData";
import {
  ArrowRightLeft, Star, TrendingUp, Trophy, ExternalLink,
  Cpu, Layers, HardDrive, Battery, Zap, Package, ShieldCheck, ChevronRight
} from "lucide-react";

/* ─── Category config ─── */
const CATEGORIES = [
  { id: "cpu",         name: "CPUs",        icon: Cpu     },
  { id: "gpu",         name: "GPUs",        icon: Layers  },
  { id: "motherboard", name: "Motherboards",icon: ShieldCheck },
  { id: "ram",         name: "RAM",         icon: Battery },
  { id: "storage",     name: "Storage",     icon: HardDrive },
  { id: "psu",         name: "PSUs",        icon: Zap     },
  { id: "case",        name: "Cases",       icon: Package },
  { id: "cooler",      name: "Coolers",     icon: TrendingUp },
];

/* ─── Spec rows per category ─── */
const SPEC_ROWS = {
  cpu: [
    { label: "Socket", keyA: "socket",  keyB: "socket",  higherBetter: null },
    { label: "Cores",  keyA: "cores",   keyB: "cores",   higherBetter: true },
    { label: "Threads",keyA: "threads", keyB: "threads", higherBetter: true },
    { label: "TDP",    keyA: "tdp",     keyB: "tdp",     higherBetter: false, unit: "W" },
  ],
  gpu: [
    { label: "VRAM",   keyA: "vram",    keyB: "vram",    higherBetter: null },
    { label: "Length", keyA: "length",  keyB: "length",  higherBetter: false, unit: "mm" },
    { label: "Wattage",keyA: "wattage", keyB: "wattage", higherBetter: false, unit: "W" },
  ],
  motherboard: [
    { label: "Socket",      keyA: "socket",     keyB: "socket",     higherBetter: null },
    { label: "Form Factor", keyA: "formFactor", keyB: "formFactor", higherBetter: null },
    { label: "Memory Type", keyA: "memoryType", keyB: "memoryType", higherBetter: null },
    { label: "Max Memory",  keyA: "maxMemory",  keyB: "maxMemory",  higherBetter: true },
    { label: "M.2 Slots",   keyA: "m2Slots",    keyB: "m2Slots",    higherBetter: true },
  ],
  ram: [
    { label: "Type",     keyA: "type",     keyB: "type",    higherBetter: null },
    { label: "Capacity", keyA: "capacity", keyB: "capacity",higherBetter: true },
    { label: "Latency",  keyA: "latency",  keyB: "latency", higherBetter: null },
  ],
  storage: [
    { label: "Type",       keyA: "type",       keyB: "type",      higherBetter: null },
    { label: "Capacity",   keyA: "capacity",   keyB: "capacity",  higherBetter: true },
    { label: "Read Speed", keyA: "readSpeed",  keyB: "readSpeed", higherBetter: true },
    { label: "Write Speed",keyA: "writeSpeed", keyB: "writeSpeed",higherBetter: true },
  ],
  psu: [
    { label: "Wattage",    keyA: "wattage",   keyB: "wattage",    higherBetter: true,  unit: "W" },
    { label: "Efficiency", keyA: "efficiency",keyB: "efficiency",  higherBetter: null },
    { label: "Modularity", keyA: "modularity",keyB: "modularity",  higherBetter: null },
  ],
  case: [
    { label: "Type",         keyA: "type",        keyB: "type",       higherBetter: null },
    { label: "Max GPU",      keyA: "gpuMaxLength",keyB: "gpuMaxLength",higherBetter: true, unit: "mm" },
    { label: "Side Panel",   keyA: "sidePanel",   keyB: "sidePanel",  higherBetter: null },
  ],
  cooler: [
    { label: "Type",     keyA: "type",       keyB: "type",       higherBetter: null },
    { label: "Radiator", keyA: "radiatorSize",keyB: "radiatorSize",higherBetter: null },
    { label: "TDP Rating",keyA: "tdpRating",keyB: "tdpRating",  higherBetter: true, unit: "W" },
  ],
};

/* ─── Score bar ─── */
function ScoreBar({ value, maxValue, color, winner }) {
  const pct = Math.min(Math.round((value / maxValue) * 100), 100);
  return (
    <div className="flex items-center gap-2 flex-1">
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: winner ? "linear-gradient(90deg,#7C3AED,#3B82F6)" : "rgba(148,163,184,0.3)" }} />
      </div>
      <span className="text-[10px] font-black w-6 text-right" style={{ color: winner ? "#A78BFA" : "#475569" }}>
        {pct}%
      </span>
    </div>
  );
}

/* ─── Spec row component ─── */
function SpecRow({ label, valA, valB, unit = "", higherBetter }) {
  if (valA === undefined && valB === undefined) return null;

  let aWins = false, bWins = false;
  if (higherBetter !== null && valA !== undefined && valB !== undefined) {
    const nA = typeof valA === "string" ? parseFloat(valA) : valA;
    const nB = typeof valB === "string" ? parseFloat(valB) : valB;
    if (!isNaN(nA) && !isNaN(nB)) {
      aWins = higherBetter ? nA > nB : nA < nB;
      bWins = higherBetter ? nB > nA : nB < nA;
    }
  }

  // For numeric values, show score bar
  const nA = typeof valA === "string" ? parseFloat(valA) : valA;
  const nB = typeof valB === "string" ? parseFloat(valB) : valB;
  const bothNumeric = !isNaN(nA) && !isNaN(nB) && higherBetter !== null;
  const maxVal = bothNumeric ? Math.max(nA, nB) : 1;

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-3"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      {/* Left value */}
      <div className="flex flex-col gap-1.5">
        <span className={`text-sm font-black ${aWins ? "" : ""}`}
          style={{ color: aWins ? "#A78BFA" : "#94A3B8" }}>
          {valA !== undefined ? `${valA}${unit}` : "—"}
          {aWins && <Trophy className="w-3 h-3 inline ml-1" style={{ color: "#A78BFA" }} />}
        </span>
        {bothNumeric && valA !== undefined && (
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
              <div className="h-full rounded-full" style={{ width: `${Math.min((nA / maxVal) * 100, 100)}%`, background: aWins ? "linear-gradient(90deg,#7C3AED,#3B82F6)" : "rgba(148,163,184,0.25)" }} />
            </div>
          </div>
        )}
      </div>

      {/* Center label */}
      <div className="text-center">
        <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg"
          style={{ background: "rgba(255,255,255,0.05)", color: "#334155" }}>
          {label}
        </span>
      </div>

      {/* Right value */}
      <div className="flex flex-col gap-1.5 items-end text-right">
        <span className="text-sm font-black"
          style={{ color: bWins ? "#A78BFA" : "#94A3B8" }}>
          {bWins && <Trophy className="w-3 h-3 inline mr-1" style={{ color: "#A78BFA" }} />}
          {valB !== undefined ? `${valB}${unit}` : "—"}
        </span>
        {bothNumeric && valB !== undefined && (
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
              <div className="h-full rounded-full" style={{ width: `${Math.min((nB / maxVal) * 100, 100)}%`, background: bWins ? "linear-gradient(90deg,#7C3AED,#3B82F6)" : "rgba(148,163,184,0.25)" }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Part card (selector) ─── */
function PartSelector({ label, value, onChange, options }) {
  return (
    <div className="flex flex-col gap-2.5">
      <label className="text-[9px] uppercase font-black tracking-[0.2em]" style={{ color: "#475569" }}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full text-sm font-semibold px-4 py-3 rounded-xl appearance-none cursor-pointer transition-all focus:outline-none"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", color: value ? "#fff" : "#475569" }}
        onFocus={e => e.target.style.borderColor = "rgba(124,58,237,0.5)"}
        onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.09)"}
      >
        <option value="">Select component...</option>
        {options.map(p => (
          <option key={p.id} value={p.id} style={{ background: "#0B1120" }}>
            {p.brand} {p.name} — ₹{p.price.toLocaleString("en-IN")}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════ */
export default function Compare() {
  const [activeCategory, setActiveCategory] = useState("cpu");
  const [partAId, setPartAId] = useState("");
  const [partBId, setPartBId] = useState("");
  const pageRef = useRef(null);

  const activeParts = COMPONENTS.filter(c => c.category === activeCategory);
  const partA = activeParts.find(c => c.id === partAId);
  const partB = activeParts.find(c => c.id === partBId);

  const handleCategoryChange = cat => {
    setActiveCategory(cat);
    setPartAId("");
    setPartBId("");
  };

  // Overall winner by benchmark score
  const benchmarkWinner = partA && partB
    ? (partA.benchmarkScore > partB.benchmarkScore ? "A" : partA.benchmarkScore < partB.benchmarkScore ? "B" : "TIE")
    : null;
  const valueWinner = partA && partB
    ? (partA.valueScore > partB.valueScore ? "A" : partA.valueScore < partB.valueScore ? "B" : "TIE")
    : null;

  /* GSAP */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".compare-header", { opacity: 0, y: -30, duration: 0.8, ease: "power3.out" });
      gsap.from(".cat-pill", { opacity: 0, y: 12, stagger: 0.05, duration: 0.5, ease: "power3.out", delay: 0.15 });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (partA && partB) {
      gsap.from(".spec-row", { opacity: 0, x: -20, stagger: 0.04, duration: 0.5, ease: "power3.out" });
    }
  }, [partA?.id, partB?.id]);

  return (
    <div ref={pageRef} className="min-h-screen relative overflow-hidden" style={{ background: "#050816", color: "#fff" }}>
      {/* Ambient */}
      <div className="fixed top-[10%] left-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none -z-10"
        style={{ background: "radial-gradient(circle,rgba(124,58,237,0.08) 0%,transparent 70%)", filter: "blur(80px)" }} />

      <div className="max-w-6xl mx-auto px-6 py-14">

        {/* Header */}
        <div className="compare-header mb-10">
          <div className="section-label mb-3">
            <span className="w-8 h-px" style={{ background: "linear-gradient(90deg,transparent,#3B82F6)" }} />
            Side-by-Side Analysis
            <span className="w-8 h-px" style={{ background: "linear-gradient(90deg,#3B82F6,transparent)" }} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-none">
            Compare{" "}
            <span style={{ background: "linear-gradient(90deg,#7C3AED,#3B82F6,#06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Components
            </span>
          </h1>
          <p className="text-sm mt-3 max-w-lg" style={{ color: "#94A3B8" }}>
            Select any two components to compare specs, benchmarks, value scores and Indian retailer pricing side by side.
          </p>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          {CATEGORIES.map(cat => {
            const active = activeCategory === cat.id;
            return (
              <button key={cat.id} onClick={() => handleCategoryChange(cat.id)}
                className="cat-pill flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-black whitespace-nowrap uppercase tracking-wider transition-all hover:-translate-y-0.5"
                style={active
                  ? { background: "linear-gradient(135deg,#7C3AED,#3B82F6)", color: "#fff" }
                  : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#94A3B8" }
                }>
                <cat.icon className="w-3.5 h-3.5" /> {cat.name}
              </button>
            );
          })}
        </div>

        {/* Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="rounded-2xl p-5" style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.18)" }}>
            <PartSelector label="Component A" value={partAId} onChange={setPartAId} options={activeParts.filter(p => p.id !== partBId)} />
          </div>
          <div className="rounded-2xl p-5" style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.18)" }}>
            <PartSelector label="Component B" value={partBId} onChange={setPartBId} options={activeParts.filter(p => p.id !== partAId)} />
          </div>
        </div>

        {/* Comparison table */}
        {partA && partB ? (
          <div className="flex flex-col gap-4">

            {/* Header with names + winner badges */}
            <div className="rounded-3xl p-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}>
              <div className="grid grid-cols-3 gap-4 items-center">
                {/* Part A */}
                <div className="text-left">
                  <div className="text-[9px] uppercase font-black tracking-widest mb-1" style={{ color: "#475569" }}>Component A</div>
                  <div className="text-base font-black text-white leading-tight">{partA.brand}</div>
                  <div className="text-xs font-medium mt-0.5" style={{ color: "#94A3B8" }}>{partA.name}</div>
                  <div className="text-lg font-black mt-2 text-white">₹{partA.price.toLocaleString("en-IN")}</div>
                  {benchmarkWinner === "A" && (
                    <span className="inline-flex items-center gap-1 mt-2 text-[9px] font-black uppercase px-2 py-1 rounded-full"
                      style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", color: "#A78BFA" }}>
                      <Trophy className="w-2.5 h-2.5" /> Faster
                    </span>
                  )}
                  {valueWinner === "A" && (
                    <span className="inline-flex items-center gap-1 mt-1 ml-1 text-[9px] font-black uppercase px-2 py-1 rounded-full"
                      style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)", color: "#34D399" }}>
                      Better Value
                    </span>
                  )}
                </div>

                {/* VS */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}>
                    <ArrowRightLeft className="w-5 h-5" style={{ color: "#7C3AED" }} />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest" style={{ color: "#334155" }}>VS</span>
                  <div className="text-[10px] font-medium text-center" style={{ color: "#475569" }}>
                    Δ Price: ₹{Math.abs(partA.price - partB.price).toLocaleString("en-IN")}
                  </div>
                </div>

                {/* Part B */}
                <div className="text-right">
                  <div className="text-[9px] uppercase font-black tracking-widest mb-1" style={{ color: "#475569" }}>Component B</div>
                  <div className="text-base font-black text-white leading-tight">{partB.brand}</div>
                  <div className="text-xs font-medium mt-0.5" style={{ color: "#94A3B8" }}>{partB.name}</div>
                  <div className="text-lg font-black mt-2 text-white">₹{partB.price.toLocaleString("en-IN")}</div>
                  {benchmarkWinner === "B" && (
                    <span className="inline-flex items-center gap-1 mt-2 text-[9px] font-black uppercase px-2 py-1 rounded-full"
                      style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", color: "#A78BFA" }}>
                      <Trophy className="w-2.5 h-2.5" /> Faster
                    </span>
                  )}
                  {valueWinner === "B" && (
                    <span className="inline-flex items-center gap-1 mt-1 ml-1 text-[9px] font-black uppercase px-2 py-1 rounded-full"
                      style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)", color: "#34D399" }}>
                      Better Value
                    </span>
                  )}
                </div>
              </div>

              {/* Score bars */}
              <div className="mt-6 pt-5 flex flex-col gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                {/* Benchmark */}
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                      <div className="h-full rounded-full" style={{ width: `${(partA.benchmarkScore / 100) * 100}%`, background: benchmarkWinner === "A" ? "linear-gradient(90deg,#7C3AED,#3B82F6)" : "rgba(148,163,184,0.3)" }} />
                    </div>
                    <span className="text-xs font-black whitespace-nowrap" style={{ color: benchmarkWinner === "A" ? "#A78BFA" : "#475569" }}>{partA.benchmarkScore}</span>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg text-center"
                    style={{ background: "rgba(255,255,255,0.05)", color: "#334155" }}>Benchmark</span>
                  <div className="flex items-center gap-2 flex-row-reverse">
                    <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                      <div className="h-full rounded-full" style={{ width: `${(partB.benchmarkScore / 100) * 100}%`, background: benchmarkWinner === "B" ? "linear-gradient(90deg,#7C3AED,#3B82F6)" : "rgba(148,163,184,0.3)" }} />
                    </div>
                    <span className="text-xs font-black whitespace-nowrap" style={{ color: benchmarkWinner === "B" ? "#A78BFA" : "#475569" }}>{partB.benchmarkScore}</span>
                  </div>
                </div>
                {/* Value */}
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                      <div className="h-full rounded-full" style={{ width: `${(partA.valueScore / 100) * 100}%`, background: valueWinner === "A" ? "linear-gradient(90deg,#10B981,#06B6D4)" : "rgba(148,163,184,0.3)" }} />
                    </div>
                    <span className="text-xs font-black whitespace-nowrap" style={{ color: valueWinner === "A" ? "#34D399" : "#475569" }}>{partA.valueScore}</span>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg text-center"
                    style={{ background: "rgba(255,255,255,0.05)", color: "#334155" }}>Value/₹</span>
                  <div className="flex items-center gap-2 flex-row-reverse">
                    <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                      <div className="h-full rounded-full" style={{ width: `${(partB.valueScore / 100) * 100}%`, background: valueWinner === "B" ? "linear-gradient(90deg,#10B981,#06B6D4)" : "rgba(148,163,184,0.3)" }} />
                    </div>
                    <span className="text-xs font-black whitespace-nowrap" style={{ color: valueWinner === "B" ? "#34D399" : "#475569" }}>{partB.valueScore}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Spec rows */}
            <div className="rounded-3xl p-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}>
              <h3 className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: "#475569" }}>Technical Specifications</h3>

              {/* Price row */}
              <div className="spec-row">
                <SpecRow label="Price" valA={`₹${partA.price.toLocaleString("en-IN")}`} valB={`₹${partB.price.toLocaleString("en-IN")}`} higherBetter={false} />
              </div>

              {/* Rating row */}
              <div className="spec-row grid grid-cols-3 items-center py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex items-center gap-1.5 text-sm font-black" style={{ color: "#94A3B8" }}>
                  <Star className="w-3.5 h-3.5 fill-current" style={{ color: "#F59E0B" }} />
                  {partA.rating} <span className="text-[10px] font-medium" style={{ color: "#334155" }}>({partA.reviews})</span>
                </div>
                <div className="text-center">
                  <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg"
                    style={{ background: "rgba(255,255,255,0.05)", color: "#334155" }}>Rating</span>
                </div>
                <div className="flex items-center justify-end gap-1.5 text-sm font-black" style={{ color: "#94A3B8" }}>
                  <span className="text-[10px] font-medium" style={{ color: "#334155" }}>({partB.reviews})</span>
                  {partB.rating}
                  <Star className="w-3.5 h-3.5 fill-current" style={{ color: "#F59E0B" }} />
                </div>
              </div>

              {/* Category-specific specs */}
              {(SPEC_ROWS[activeCategory] || []).map(row => (
                <div key={row.label} className="spec-row">
                  <SpecRow label={row.label} valA={partA.specs[row.keyA]} valB={partB.specs[row.keyB]}
                    unit={row.unit || ""} higherBetter={row.higherBetter} />
                </div>
              ))}
            </div>

            {/* Retailer price comparison */}
            {(partA.retailers || partB.retailers) && (
              <div className="rounded-3xl p-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}>
                <h3 className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: "#475569" }}>Indian Retailer Pricing</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {["amazon","flipkart","mdcomputers","vedant"].map(retailer => {
                    const priceA = partA.retailers?.[retailer]?.price;
                    const priceB = partB.retailers?.[retailer]?.price;
                    const aCheaper = priceA && priceB && priceA < priceB;
                    const bCheaper = priceA && priceB && priceB < priceA;
                    const label = retailer === "mdcomputers" ? "MDComputers" : retailer.charAt(0).toUpperCase() + retailer.slice(1);
                    return (
                      <div key={retailer} className="rounded-2xl p-4 flex flex-col gap-2"
                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                        <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: "#475569" }}>{label}</div>
                        <div className="flex flex-col gap-1.5 text-xs">
                          <div className="flex justify-between items-center">
                            <span style={{ color: "#334155" }}>A</span>
                            <span className="font-black" style={{ color: aCheaper ? "#34D399" : "#94A3B8" }}>
                              {priceA ? `₹${priceA.toLocaleString("en-IN")}` : "N/A"}
                              {aCheaper && <Trophy className="w-3 h-3 inline ml-1" style={{ color: "#34D399" }} />}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span style={{ color: "#334155" }}>B</span>
                            <span className="font-black" style={{ color: bCheaper ? "#34D399" : "#94A3B8" }}>
                              {priceB ? `₹${priceB.toLocaleString("en-IN")}` : "N/A"}
                              {bCheaper && <Trophy className="w-3 h-3 inline ml-1" style={{ color: "#34D399" }} />}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CTA row */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/builder"
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm text-white transition-all hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg,#7C3AED,#3B82F6)", boxShadow: "0 4px 24px rgba(124,58,237,0.3)" }}>
                Build with these parts <ChevronRight className="w-4 h-4" />
              </Link>
              <Link to="/fps"
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-all hover:-translate-y-0.5"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", color: "#94A3B8" }}>
                Check FPS Estimates <TrendingUp className="w-4 h-4" />
              </Link>
            </div>
          </div>

        ) : (
          <div className="rounded-3xl py-20 flex flex-col items-center justify-center gap-4"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="w-16 h-16 rounded-3xl flex items-center justify-center"
              style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.15)" }}>
              <ArrowRightLeft className="w-7 h-7 animate-pulse" style={{ color: "#7C3AED" }} />
            </div>
            <div className="text-center">
              <div className="text-base font-black text-white">Select two components above</div>
              <div className="text-xs mt-1" style={{ color: "#475569" }}>
                Pick a category, then choose Component A and Component B
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

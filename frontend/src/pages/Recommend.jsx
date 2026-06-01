import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import {
  Gamepad2, Video, Monitor, Code2, Brain, Zap, ArrowRight,
  CheckCircle, Cpu, Layers, HardDrive, Battery, Shield,
  TrendingUp, Star, Sparkles, Package, ChevronRight
} from "lucide-react";
import { COMPONENTS, BUDGET_RECOMMENDATIONS, FPS_BENCHMARKS, CPU_GAMING_MULTIPLIER, GAMES } from "../services/mockData";
import { useBuilderStore } from "../store/builderStore";
import { useToastStore } from "../store/toastStore";

/* ── Purpose metadata ── */
const PURPOSES = [
  { id: "gaming",      icon: Gamepad2, label: "Gaming",       desc: "Max FPS at your resolution", color: "#7C3AED" },
  { id: "editing",     icon: Video,    label: "Video Editing", desc: "Smooth 4K timeline rendering", color: "#3B82F6" },
  { id: "streaming",   icon: Monitor,  label: "Streaming",    desc: "Game + stream simultaneously",  color: "#06B6D4" },
  { id: "programming", icon: Code2,    label: "Programming",  desc: "Fast compiles & multi-tasking",  color: "#10B981" },
  { id: "ai",          icon: Brain,    label: "AI / ML",      desc: "LLM inference & model training", color: "#EC4899" },
];

/* ── Budget tiers per purpose ── */
const BUDGET_TIERS = {
  gaming:      [30000, 50000, 75000, 100000, 150000, 200000, 300000],
  editing:     [50000, 100000, 200000],
  streaming:   [50000, 100000, 200000],
  programming: [30000, 75000, 150000],
  ai:          [150000, 250000],
};

/* ── Helpers ── */
function getComponent(id) {
  return COMPONENTS.find(c => c.id === id);
}

function getBestFps(cpuId, gpuId, game = "valorant", res = "1080p") {
  const base = FPS_BENCHMARKS[gpuId]?.[game]?.[res] || 0;
  const mult = CPU_GAMING_MULTIPLIER[cpuId] || 1;
  return Math.round(base * mult);
}

function getTierLabel(fps) {
  if (fps >= 200) return { label: "Extreme", color: "#7C3AED" };
  if (fps >= 120) return { label: "Ultra",   color: "#3B82F6" };
  if (fps >= 80)  return { label: "High",    color: "#10B981" };
  if (fps >= 60)  return { label: "Good",    color: "#F59E0B" };
  return              { label: "Low",        color: "#EF4444" };
}

const CATEGORY_ICONS = {
  cpu: Cpu, gpu: Layers, motherboard: Shield, ram: Battery,
  storage: HardDrive, psu: Zap, case: Package, cooler: TrendingUp,
};

const CATEGORY_LABELS = {
  cpu: "Processor", gpu: "Graphics Card", motherboard: "Motherboard",
  ram: "Memory", storage: "Storage", psu: "Power Supply",
  case: "Chassis", cooler: "CPU Cooler",
};

/* ══════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════ */
export default function Recommend() {
  const pageRef = useRef(null);
  const navigate = useNavigate();
  const { addPart } = useBuilderStore();
  const addToast = useToastStore(s => s.addToast);

  const [purpose, setPurpose]       = useState("gaming");
  const [budget, setBudget]         = useState(100000);
  const [isLoading, setIsLoading]   = useState(false);
  const [showResult, setShowResult] = useState(false);

  const tiers = BUDGET_TIERS[purpose] || [];
  // Find closest tier
  const closestBudget = tiers.reduce((prev, curr) =>
    Math.abs(curr - budget) < Math.abs(prev - budget) ? curr : prev, tiers[0]);
  const recommendation = BUDGET_RECOMMENDATIONS[purpose]?.[closestBudget];

  // Compute total price
  const totalPrice = recommendation
    ? Object.entries(recommendation.components).reduce((sum, [, id]) => {
        const c = getComponent(id);
        return sum + (c?.price || 0);
      }, 0)
    : 0;

  // Reset result on change
  useEffect(() => { setShowResult(false); }, [purpose, budget]);

  /* GSAP */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".rec-header", { opacity: 0, y: -30, duration: 0.9, ease: "power3.out" });
      gsap.from(".purpose-pill", { opacity: 0, y: 16, stagger: 0.07, duration: 0.6, ease: "power3.out", delay: 0.2 });
      gsap.from(".budget-panel", { opacity: 0, y: 30, duration: 0.7, ease: "power3.out", delay: 0.35 });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (showResult && pageRef.current) {
      gsap.from(".part-row", {
        opacity: 0, x: -40, stagger: 0.06, duration: 0.6, ease: "power3.out", delay: 0.1,
      });
      gsap.from(".fps-game", {
        opacity: 0, y: 24, stagger: 0.05, duration: 0.5, ease: "power3.out", delay: 0.3,
      });
    }
  }, [showResult]);

  const handleGenerate = () => {
    setIsLoading(true);
    setTimeout(() => { setIsLoading(false); setShowResult(true); }, 800);
  };

  const handleLoadIntoBuilder = () => {
    if (!recommendation) return;
    Object.entries(recommendation.components).forEach(([cat, id]) => {
      const comp = getComponent(id);
      if (comp) addPart(cat, comp);
    });
    addToast("Recommended build loaded into PC Builder!", "success");
    navigate("/builder");
  };

  const selectedPurpose = PURPOSES.find(p => p.id === purpose);

  return (
    <div ref={pageRef} className="min-h-screen relative overflow-hidden" style={{ background: "#050816", color: "#fff" }}>
      {/* Ambient BG */}
      <div className="fixed top-0 left-0 w-[700px] h-[700px] rounded-full pointer-events-none -z-10"
        style={{ background: "radial-gradient(circle,rgba(124,58,237,0.1) 0%,transparent 70%)", filter: "blur(80px)" }} />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none -z-10"
        style={{ background: "radial-gradient(circle,rgba(59,130,246,0.07) 0%,transparent 70%)", filter: "blur(80px)" }} />

      <div className="max-w-7xl mx-auto px-6 py-14">

        {/* Header */}
        <div className="rec-header mb-12">
          <div className="section-label mb-3">
            <span className="w-8 h-px" style={{ background: "linear-gradient(90deg, transparent, #7C3AED)" }} />
            Intelligent Build Recommender
            <span className="w-8 h-px" style={{ background: "linear-gradient(90deg, #7C3AED, transparent)" }} />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none">
            Find Your{" "}
            <span style={{ background: "linear-gradient(90deg,#7C3AED,#3B82F6,#06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundSize: "200% auto", animation: "shine 4s linear infinite" }}>
              Perfect Build
            </span>
          </h1>
          <p className="text-sm leading-relaxed mt-4 max-w-xl" style={{ color: "#94A3B8" }}>
            Tell us your budget and what you want to do. Our rule-based engine recommends the optimal Indian market parts for your needs — no AI fluff, just real hardware sense.
          </p>
        </div>

        {/* Step 1: Purpose */}
        <div className="mb-10">
          <div className="text-xs font-black uppercase tracking-[0.2em] mb-5" style={{ color: "#475569" }}>
            Step 1 — What will you primarily use this PC for?
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {PURPOSES.map(p => {
              const active = purpose === p.id;
              return (
                <button key={p.id} onClick={() => { setPurpose(p.id); setBudget(BUDGET_TIERS[p.id][Math.floor(BUDGET_TIERS[p.id].length / 2)]); }}
                  className="purpose-pill group rounded-2xl p-5 flex flex-col items-center gap-3 text-center transition-all duration-300 hover:-translate-y-1"
                  style={active
                    ? { background: `${p.color}15`, border: `1px solid ${p.color}40`, boxShadow: `0 0 30px ${p.color}25` }
                    : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }
                  }
                >
                  <div className="p-3 rounded-xl transition-all"
                    style={{ background: active ? `${p.color}20` : "rgba(255,255,255,0.05)" }}>
                    <p.icon className="w-5 h-5" style={{ color: active ? p.color : "#475569" }} />
                  </div>
                  <div>
                    <div className="text-xs font-black" style={{ color: active ? "#FFFFFF" : "#94A3B8" }}>{p.label}</div>
                    <div className="text-[9px] mt-0.5 leading-snug" style={{ color: "#475569" }}>{p.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Budget */}
        <div className="budget-panel mb-10">
          <div className="text-xs font-black uppercase tracking-[0.2em] mb-5" style={{ color: "#475569" }}>
            Step 2 — Select your budget
          </div>
          <div className="rounded-3xl p-6"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}>
            {/* Budget display */}
            <div className="text-center mb-6">
              <div className="text-5xl font-black" style={{ color: selectedPurpose?.color || "#7C3AED" }}>
                ₹{budget.toLocaleString("en-IN")}
              </div>
              <div className="text-xs mt-2 font-medium" style={{ color: "#475569" }}>Approximate budget</div>
            </div>

            {/* Slider */}
            <div className="flex flex-col gap-3 px-2">
              <input
                type="range"
                min={tiers[0]}
                max={tiers[tiers.length - 1]}
                step={5000}
                value={budget}
                onChange={e => setBudget(Number(e.target.value))}
                className="w-full h-2 appearance-none cursor-pointer rounded-full"
                style={{ accentColor: selectedPurpose?.color || "#7C3AED" }}
              />
              <div className="flex justify-between text-[10px] font-bold" style={{ color: "#334155" }}>
                <span>₹{(tiers[0] / 1000).toFixed(0)}K</span>
                <span>₹{(tiers[tiers.length - 1] / 1000).toFixed(0)}K</span>
              </div>
            </div>

            {/* Preset tier pills */}
            <div className="flex flex-wrap gap-2 mt-5 justify-center">
              {tiers.map(t => (
                <button key={t}
                  onClick={() => setBudget(t)}
                  className="px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all hover:-translate-y-0.5"
                  style={closestBudget === t
                    ? { background: selectedPurpose?.color + "20", border: `1px solid ${selectedPurpose?.color}40`, color: selectedPurpose?.color }
                    : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", color: "#94A3B8" }
                  }
                >
                  ₹{t >= 100000 ? `${(t / 100000).toFixed(1)}L` : `${(t / 1000).toFixed(0)}K`}
                </button>
              ))}
            </div>

            {/* Generate */}
            <div className="flex justify-center mt-6">
              <button
                onClick={handleGenerate}
                disabled={!recommendation || isLoading}
                className="flex items-center gap-3 px-8 py-4 rounded-[14px] font-black text-base text-white transition-all hover:-translate-y-1 disabled:opacity-50"
                style={{ background: `linear-gradient(135deg,${selectedPurpose?.color || "#7C3AED"},#3B82F6)`, boxShadow: `0 4px 30px ${selectedPurpose?.color || "#7C3AED"}40` }}
              >
                {isLoading ? (
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : <Sparkles className="w-5 h-5" />}
                {isLoading ? "Generating..." : "Generate Recommendation"}
              </button>
            </div>
          </div>
        </div>

        {/* RESULTS */}
        {showResult && recommendation && (
          <div className="flex flex-col gap-6">
            {/* Summary banner */}
            <div className="rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
              style={{ background: `linear-gradient(135deg,${selectedPurpose?.color || "#7C3AED"}12,rgba(11,17,32,0.8))`, border: `1px solid ${selectedPurpose?.color || "#7C3AED"}25`, backdropFilter: "blur(20px)" }}>
              <div className="flex flex-col gap-3">
                <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em]"
                  style={{ color: selectedPurpose?.color || "#7C3AED" }}>
                  <selectedPurpose.icon className="w-3.5 h-3.5" />
                  {recommendation.label}
                </div>
                <h2 className="text-3xl font-black text-white">{recommendation.tag}</h2>
                <div className="flex items-center gap-3 text-sm">
                  <span className="flex items-center gap-1.5 font-bold" style={{ color: "#10B981" }}>
                    <CheckCircle className="w-4 h-4" /> {recommendation.fpsTarget}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3 shrink-0">
                <div className="text-xs font-bold uppercase tracking-widest" style={{ color: "#475569" }}>Total Build Cost</div>
                <div className="text-4xl font-black text-white">₹{totalPrice.toLocaleString("en-IN")}</div>
                {totalPrice <= budget * 1.15 && (
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full"
                    style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)", color: "#34D399" }}>
                    ✓ Within Budget
                  </span>
                )}
                <button onClick={handleLoadIntoBuilder}
                  className="flex items-center gap-2 px-5 py-3 rounded-[12px] font-bold text-sm text-white transition-all hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(135deg,#7C3AED,#3B82F6)", boxShadow: "0 4px 20px rgba(124,58,237,0.35)" }}>
                  <Zap className="w-4 h-4" /> Load into Builder
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Parts list */}
              <div className="lg:col-span-2 rounded-3xl overflow-hidden"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}>
                <div className="px-6 py-4 flex items-center gap-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                  <Package className="w-4 h-4" style={{ color: "#7C3AED" }} />
                  <h3 className="text-sm font-black text-white uppercase tracking-wide">Recommended Parts</h3>
                </div>
                <div className="p-4 flex flex-col gap-1">
                  {Object.entries(recommendation.components).map(([cat, id]) => {
                    const comp = getComponent(id);
                    if (!comp) return null;
                    const Icon = CATEGORY_ICONS[cat] || Package;
                    const bestPrice = Math.min(...Object.values(comp.retailers).map(r => r.price));
                    const bestRetailer = Object.entries(comp.retailers).find(([, r]) => r.price === bestPrice);

                    return (
                      <div key={cat} className="part-row group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all hover:bg-white/[0.04]">
                        <div className="p-2.5 rounded-xl shrink-0"
                          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                          <Icon className="w-4 h-4" style={{ color: "#94A3B8" }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] uppercase font-black tracking-widest mb-0.5" style={{ color: "#475569" }}>
                            {CATEGORY_LABELS[cat]}
                          </div>
                          <div className="text-sm font-bold text-white truncate">{comp.name}</div>
                          <div className="text-[10px] mt-0.5" style={{ color: "#475569" }}>
                            {comp.brand} • {comp.benchmarkScore}/100 benchmark
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm font-black text-white">₹{comp.price.toLocaleString("en-IN")}</div>
                          {bestRetailer && (
                            <div className="text-[9px] font-bold mt-0.5" style={{ color: "#10B981" }}>
                              Best: {bestRetailer[0].charAt(0).toUpperCase() + bestRetailer[0].slice(1)}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Load button */}
                <div className="px-6 py-4 flex items-center justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                  <span className="text-xs" style={{ color: "#475569" }}>All prices from Indian retailers (Jun 2026)</span>
                  <button onClick={handleLoadIntoBuilder}
                    className="flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl transition-all hover:-translate-y-0.5"
                    style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)", color: "#C4B5FD" }}>
                    Load into Builder <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Right panel: FPS estimates + value scores */}
              <div className="flex flex-col gap-4">
                {/* Gaming FPS (for gaming/streaming) */}
                {(purpose === "gaming" || purpose === "streaming") && (() => {
                  const cpuId = recommendation.components.cpu;
                  const gpuId = recommendation.components.gpu;
                  return (
                    <div className="rounded-3xl p-5"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}>
                      <h3 className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: "#475569" }}>
                        🎮 Estimated FPS at 1080p
                      </h3>
                      <div className="flex flex-col gap-2.5">
                        {["valorant", "cs2", "cyberpunk", "fortnite"].map(gameId => {
                          const fps = getBestFps(cpuId, gpuId, gameId, "1080p");
                          const t = getTierLabel(fps);
                          const pct = Math.min((fps / 300) * 100, 100);
                          const game = GAMES.find(g => g.id === gameId);
                          return (
                            <div key={gameId} className="fps-game flex flex-col gap-1.5">
                              <div className="flex justify-between text-xs font-bold">
                                <span className="flex items-center gap-1.5" style={{ color: "#94A3B8" }}>
                                  <span>{game?.icon}</span> {game?.name}
                                </span>
                                <span style={{ color: t.color }}>{fps} FPS</span>
                              </div>
                              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                                <div className="h-full rounded-full transition-all duration-700"
                                  style={{ width: `${pct}%`, background: t.color }} />
                              </div>
                            </div>
                          );
                        })}
                        <Link to="/fps" className="mt-2 text-xs font-bold flex items-center gap-1.5 transition-colors hover:underline"
                          style={{ color: "#7C3AED" }}>
                          Full FPS breakdown <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })()}

                {/* Build scores */}
                <div className="rounded-3xl p-5 flex flex-col gap-4"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}>
                  <h3 className="text-xs font-black uppercase tracking-widest" style={{ color: "#475569" }}>
                    Build Quality Scores
                  </h3>
                  {[
                    { label: "Performance", score: Math.round(Object.values(recommendation.components).reduce((s, id) => s + (getComponent(id)?.benchmarkScore || 0), 0) / 8), color: "#7C3AED" },
                    { label: "Value for ₹", score: Math.round(Object.values(recommendation.components).reduce((s, id) => s + (getComponent(id)?.valueScore || 0), 0) / 8), color: "#10B981" },
                  ].map(item => (
                    <div key={item.label} className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span style={{ color: "#94A3B8" }}>{item.label}</span>
                        <span style={{ color: item.color }}>{item.score}/100</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${item.score}%`, background: `linear-gradient(90deg, ${item.color}99, ${item.color})` }} />
                      </div>
                    </div>
                  ))}

                  <div className="pt-3 flex flex-col gap-2" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                    <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: "#475569" }}>
                      Retailer Price Comparison
                    </div>
                    {["amazon", "flipkart", "mdcomputers", "vedant"].map(retailer => {
                      const total = Object.values(recommendation.components).reduce((sum, id) => {
                        const c = getComponent(id);
                        return sum + (c?.retailers?.[retailer]?.price || c?.price || 0);
                      }, 0);
                      return (
                        <div key={retailer} className="flex justify-between text-xs">
                          <span className="font-semibold capitalize" style={{ color: "#475569" }}>{retailer === "mdcomputers" ? "MDComputers" : retailer.charAt(0).toUpperCase() + retailer.slice(1)}</span>
                          <span className="font-bold text-white">₹{total.toLocaleString("en-IN")}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Compare or FPS link */}
                <div className="flex flex-col gap-2">
                  <Link to="/fps" className="flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all hover:-translate-y-0.5"
                    style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.22)", color: "#C4B5FD" }}>
                    <TrendingUp className="w-4 h-4" /> Check FPS in Estimator
                  </Link>
                  <Link to="/compare" className="flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all hover:-translate-y-0.5"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#94A3B8" }}>
                    Compare Parts
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty state when no recommendation for exact budget */}
        {showResult && !recommendation && (
          <div className="rounded-3xl p-12 text-center"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="text-sm font-semibold mb-2" style={{ color: "#475569" }}>
              No preset for this exact budget.
            </div>
            <p className="text-xs" style={{ color: "#334155" }}>Try one of the quick-select budget tiers above.</p>
          </div>
        )}
      </div>
    </div>
  );
}

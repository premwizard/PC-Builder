import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Monitor, Cpu, Layers, Zap, ChevronDown, ArrowRight, Info,
  Gamepad2, TrendingUp, AlertTriangle, CheckCircle, Sparkles
} from "lucide-react";
import {
  COMPONENTS, FPS_BENCHMARKS, CPU_GAMING_MULTIPLIER,
  RAM_FPS_MULTIPLIER, GAMES
} from "../services/mockData";
import { useBuilderStore } from "../store/builderStore";

gsap.registerPlugin(ScrollTrigger);

/* ─── Helpers ─── */
const cpus  = COMPONENTS.filter(c => c.category === "cpu");
const gpus  = COMPONENTS.filter(c => c.category === "gpu");
const rams  = COMPONENTS.filter(c => c.category === "ram");

function getFPSTier(fps) {
  if (fps >= 200) return { label: "Extreme",    color: "#7C3AED", bg: "rgba(124,58,237,0.15)" };
  if (fps >= 120) return { label: "Ultra",      color: "#3B82F6", bg: "rgba(59,130,246,0.15)" };
  if (fps >= 80)  return { label: "High",       color: "#10B981", bg: "rgba(16,185,129,0.15)" };
  if (fps >= 60)  return { label: "Playable",   color: "#F59E0B", bg: "rgba(245,158,11,0.15)" };
  if (fps >= 30)  return { label: "Low",        color: "#F97316", bg: "rgba(249,115,22,0.15)" };
  return              { label: "Unplayable",    color: "#EF4444", bg: "rgba(239,68,68,0.15)"  };
}

function getBottleneckInfo(cpuId, gpuId, fps) {
  const cpuMult = CPU_GAMING_MULTIPLIER[cpuId] || 1;
  if (cpuMult < 0.85) return { type: "cpu", severity: "heavy",  msg: "CPU is a significant bottleneck. Consider upgrading your processor." };
  if (cpuMult < 0.93) return { type: "cpu", severity: "medium", msg: "Slight CPU bottleneck detected. Your processor limits peak GPU performance." };
  return                     { type: "none", severity: "none",  msg: "No significant bottleneck detected. Well-balanced configuration!" };
}

/* ─── FPS Gauge ─── */
function FPSGauge({ fps, maxFps = 500 }) {
  const canvasRef = useRef(null);
  const tier = getFPSTier(fps);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H * 0.8;
    const R = W * 0.38;
    const startAngle = Math.PI;
    const endAngle   = 2 * Math.PI;
    const pct = Math.min(fps / maxFps, 1);
    const fillEnd = startAngle + pct * Math.PI;

    ctx.clearRect(0, 0, W, H);

    // Track bg
    ctx.beginPath();
    ctx.arc(cx, cy, R, startAngle, endAngle);
    ctx.lineWidth = 20;
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineCap = "round";
    ctx.stroke();

    // Colored fill
    const grad = ctx.createLinearGradient(0, 0, W, 0);
    grad.addColorStop(0, "#3B82F6");
    grad.addColorStop(0.5, "#7C3AED");
    grad.addColorStop(1, "#06B6D4");
    ctx.beginPath();
    ctx.arc(cx, cy, R, startAngle, fillEnd);
    ctx.lineWidth = 20;
    ctx.strokeStyle = grad;
    ctx.lineCap = "round";
    ctx.stroke();

    // Glow
    ctx.shadowBlur = 18;
    ctx.shadowColor = tier.color;
    ctx.beginPath();
    ctx.arc(cx, cy, R, startAngle, fillEnd);
    ctx.lineWidth = 4;
    ctx.strokeStyle = tier.color;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Tick marks
    for (let i = 0; i <= 10; i++) {
      const a = startAngle + (i / 10) * Math.PI;
      const inner = R - 28, outer = R - 20;
      ctx.beginPath();
      ctx.moveTo(cx + inner * Math.cos(a), cy + inner * Math.sin(a));
      ctx.lineTo(cx + outer * Math.cos(a), cy + outer * Math.sin(a));
      ctx.lineWidth = i % 5 === 0 ? 2 : 1;
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.stroke();
    }

    // FPS number
    ctx.fillStyle = "#FFFFFF";
    ctx.font = `900 ${W * 0.18}px Inter, system-ui`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowBlur = 16;
    ctx.shadowColor = tier.color;
    ctx.fillText(fps, cx, cy - R * 0.08);
    ctx.shadowBlur = 0;

    // "FPS" label
    ctx.fillStyle = "#94A3B8";
    ctx.font = `700 ${W * 0.07}px Inter, system-ui`;
    ctx.fillText("FPS", cx, cy + R * 0.18);

    // Tier label
    ctx.fillStyle = tier.color;
    ctx.font = `800 ${W * 0.075}px Inter, system-ui`;
    ctx.fillText(tier.label.toUpperCase(), cx, cy + R * 0.42);
  }, [fps, tier]);

  return <canvas ref={canvasRef} width={280} height={200} className="mx-auto" />;
}

/* ─── All Games Grid Row ─── */
function AllGamesGrid({ cpuId, gpuId, ramId, resolution }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      {GAMES.map(game => {
        const baseFps = FPS_BENCHMARKS[gpuId]?.[game.id]?.[resolution] || 0;
        const cpuMult = CPU_GAMING_MULTIPLIER[cpuId] || 1;
        const ramMult = RAM_FPS_MULTIPLIER[ramId] || 1;
        const fps = Math.round(baseFps * cpuMult * ramMult);
        const tier = getFPSTier(fps);
        const pct = Math.min((fps / 300) * 100, 100);

        return (
          <div key={game.id}
            className="rounded-2xl p-4 flex flex-col gap-3"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(12px)" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{game.icon}</span>
                <div>
                  <div className="text-xs font-black text-white">{game.name}</div>
                  <div className="text-[9px] font-medium" style={{ color: "#475569" }}>{game.genre}</div>
                </div>
              </div>
              <span className="text-[10px] font-black px-2 py-1 rounded-full" style={{ background: tier.bg, color: tier.color }}>
                {tier.label}
              </span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-black" style={{ color: tier.color }}>{fps || "—"}</span>
              <span className="text-xs font-bold" style={{ color: "#475569" }}>FPS</span>
            </div>
            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${tier.color}99, ${tier.color})` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Custom Select ─── */
function Select({ label, value, onChange, options, placeholder }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] uppercase font-black tracking-[0.18em]" style={{ color: "#475569" }}>
        {label}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full text-sm font-semibold px-4 py-3 rounded-xl appearance-none cursor-pointer transition-all focus:outline-none"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.09)",
          color: value ? "#FFFFFF" : "#475569",
        }}
        onFocus={e => e.target.style.borderColor = "rgba(124,58,237,0.5)"}
        onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.09)"}
      >
        <option value="">{placeholder}</option>
        {options.map(o => (
          <option key={o.value} value={o.value} style={{ background: "#0B1120" }}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════ */
export default function FpsEstimator() {
  const pageRef = useRef(null);
  const { selectedParts } = useBuilderStore();

  const [selectedCpu, setSelectedCpu] = useState(selectedParts.cpu?.id || "");
  const [selectedGpu, setSelectedGpu] = useState(selectedParts.gpu?.id || "");
  const [selectedRam, setSelectedRam] = useState(selectedParts.ram?.id || "");
  const [selectedGame, setSelectedGame] = useState("valorant");
  const [resolution, setResolution]     = useState("1080p");

  // Computed FPS
  const baseFps = selectedGpu && selectedGame
    ? (FPS_BENCHMARKS[selectedGpu]?.[selectedGame]?.[resolution] || 0)
    : 0;
  const cpuMult = CPU_GAMING_MULTIPLIER[selectedCpu] || 1;
  const ramMult = RAM_FPS_MULTIPLIER[selectedRam]    || 1;
  const estimatedFps = Math.round(baseFps * cpuMult * ramMult);

  const tier = getFPSTier(estimatedFps);
  const bottleneck = getBottleneckInfo(selectedCpu, selectedGpu, estimatedFps);
  const canEstimate = !!(selectedCpu && selectedGpu);

  const selectedCpuData = cpus.find(c => c.id === selectedCpu);
  const selectedGpuData = gpus.find(c => c.id === selectedGpu);
  const selectedRamData = rams.find(c => c.id === selectedRam);
  const selectedGameData = GAMES.find(g => g.id === selectedGame);

  /* GSAP */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".fps-header", { opacity: 0, y: -30, duration: 0.9, ease: "power3.out" });
      gsap.from(".fps-panel", { opacity: 0, y: 40, stagger: 0.12, duration: 0.8, ease: "power3.out", delay: 0.2 });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  /* Animate gauge on change */
  const gaugeRef = useRef(null);
  useEffect(() => {
    if (gaugeRef.current) {
      gsap.from(gaugeRef.current, { scale: 0.85, opacity: 0, duration: 0.5, ease: "back.out(1.7)" });
    }
  }, [estimatedFps]);

  return (
    <div ref={pageRef} className="min-h-screen relative overflow-hidden" style={{ background: "#050816", color: "#fff" }}>
      {/* Ambient BG */}
      <div className="fixed top-[10%] left-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none -z-10"
        style={{ background: "radial-gradient(circle,rgba(124,58,237,0.1) 0%,transparent 70%)", filter: "blur(80px)" }} />
      <div className="fixed bottom-0 right-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none -z-10"
        style={{ background: "radial-gradient(circle,rgba(6,182,212,0.07) 0%,transparent 70%)", filter: "blur(80px)" }} />

      <div className="max-w-7xl mx-auto px-6 py-14">

        {/* Header */}
        <div className="fps-header mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="section-label mb-3">
              <span className="w-8 h-px" style={{ background: "linear-gradient(90deg, transparent, #06B6D4)" }} />
              Gaming Performance Engine
              <span className="w-8 h-px" style={{ background: "linear-gradient(90deg, #06B6D4, transparent)" }} />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none">
              FPS{" "}
              <span style={{ background: "linear-gradient(90deg,#7C3AED,#3B82F6,#06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundSize: "200% auto", animation: "shine 4s linear infinite" }}>
                Estimator
              </span>
            </h1>
            <p className="text-sm leading-relaxed mt-4 max-w-xl" style={{ color: "#94A3B8" }}>
              Select your components to get real-world FPS estimates based on aggregated benchmarks.
              Detect CPU bottlenecks and find the perfect hardware combo for your target game.
            </p>
          </div>

          {selectedParts.cpu && selectedParts.gpu && (
            <div className="fps-panel flex-shrink-0 px-5 py-3.5 rounded-2xl text-sm font-bold flex items-center gap-2"
              style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", color: "#34D399" }}>
              <CheckCircle className="w-4 h-4" />
              Builder parts loaded automatically
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* LEFT — Config Panel */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* Component Selectors */}
            <div className="fps-panel rounded-3xl p-6 flex flex-col gap-5"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}>
              <div className="flex items-center gap-2.5 mb-1">
                <div className="p-2 rounded-xl" style={{ background: "rgba(124,58,237,0.15)" }}>
                  <Cpu className="w-4 h-4" style={{ color: "#7C3AED" }} />
                </div>
                <h2 className="text-sm font-black text-white uppercase tracking-wide">Hardware Config</h2>
              </div>

              <Select
                label="Processor (CPU)"
                value={selectedCpu}
                onChange={setSelectedCpu}
                placeholder="Select CPU..."
                options={cpus.map(c => ({ value: c.id, label: `${c.brand} ${c.name}` }))}
              />
              <Select
                label="Graphics Card (GPU)"
                value={selectedGpu}
                onChange={setSelectedGpu}
                placeholder="Select GPU..."
                options={gpus.map(g => ({ value: g.id, label: `${g.brand} ${g.name}` }))}
              />
              <Select
                label="Memory (RAM)"
                value={selectedRam}
                onChange={setSelectedRam}
                placeholder="Select RAM (optional)..."
                options={rams.map(r => ({ value: r.id, label: `${r.brand} ${r.name}` }))}
              />
            </div>

            {/* Game + Resolution */}
            <div className="fps-panel rounded-3xl p-6 flex flex-col gap-5"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}>
              <div className="flex items-center gap-2.5 mb-1">
                <div className="p-2 rounded-xl" style={{ background: "rgba(59,130,246,0.15)" }}>
                  <Gamepad2 className="w-4 h-4" style={{ color: "#3B82F6" }} />
                </div>
                <h2 className="text-sm font-black text-white uppercase tracking-wide">Target Scenario</h2>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-black tracking-[0.18em]" style={{ color: "#475569" }}>Game</label>
                <div className="grid grid-cols-2 gap-2">
                  {GAMES.map(g => (
                    <button key={g.id} onClick={() => setSelectedGame(g.id)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all"
                      style={selectedGame === g.id
                        ? { background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.45)", color: "#C4B5FD" }
                        : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#94A3B8" }
                      }
                    >
                      <span>{g.icon}</span> {g.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-black tracking-[0.18em]" style={{ color: "#475569" }}>Resolution</label>
                <div className="grid grid-cols-3 gap-2">
                  {["1080p", "1440p", "4k"].map(r => (
                    <button key={r} onClick={() => setResolution(r)}
                      className="py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                      style={resolution === r
                        ? { background: "linear-gradient(135deg,#7C3AED,#3B82F6)", color: "#fff", border: "1px solid rgba(124,58,237,0.5)" }
                        : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#94A3B8" }
                      }
                    >
                      {r === "4k" ? "4K" : r}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick tip */}
            <div className="fps-panel rounded-2xl px-4 py-3 flex items-start gap-2.5"
              style={{ background: "rgba(59,130,246,0.07)", border: "1px solid rgba(59,130,246,0.18)" }}>
              <Info className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#3B82F6" }} />
              <p className="text-[11px] leading-relaxed" style={{ color: "#94A3B8" }}>
                FPS values are estimated from real-world aggregate benchmarks. Actual results may vary ±15% depending on drivers, settings, and system config.
              </p>
            </div>
          </div>

          {/* RIGHT — Results Panel */}
          <div className="lg:col-span-3 flex flex-col gap-4">

            {/* Main Gauge Card */}
            <div className="fps-panel rounded-3xl p-8 text-center flex flex-col items-center"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}>

              {canEstimate ? (
                <>
                  {/* Config summary */}
                  <div className="flex items-center gap-2 flex-wrap justify-center mb-6 text-[11px] font-bold" style={{ color: "#94A3B8" }}>
                    <span className="px-2.5 py-1 rounded-full" style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", color: "#C4B5FD" }}>
                      {selectedCpuData?.name.split(" ").slice(-2).join(" ") || "CPU"}
                    </span>
                    <span style={{ color: "#334155" }}>+</span>
                    <span className="px-2.5 py-1 rounded-full" style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: "#93C5FD" }}>
                      {selectedGpuData?.name.split(" ").slice(-3).join(" ") || "GPU"}
                    </span>
                    <span style={{ color: "#334155" }}>in</span>
                    <span className="px-2.5 py-1 rounded-full" style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)", color: "#67E8F9" }}>
                      {selectedGameData?.name} @ {resolution === "4k" ? "4K" : resolution}
                    </span>
                  </div>

                  <div ref={gaugeRef} className="w-full max-w-xs">
                    <FPSGauge fps={estimatedFps} />
                  </div>

                  {/* Bottleneck / Status */}
                  <div className="w-full mt-6 px-4 py-3.5 rounded-2xl flex items-start gap-3"
                    style={bottleneck.type !== "none"
                      ? { background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }
                      : { background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }
                    }>
                    {bottleneck.type !== "none"
                      ? <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#F59E0B" }} />
                      : <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#10B981" }} />
                    }
                    <div className="text-left">
                      <div className="text-xs font-black mb-0.5"
                        style={{ color: bottleneck.type !== "none" ? "#F59E0B" : "#10B981" }}>
                        {bottleneck.type === "cpu" ? `CPU Bottleneck (${((1 - (CPU_GAMING_MULTIPLIER[selectedCpu] || 1)) * 100).toFixed(0)}% impact)` : "Balanced Build"}
                      </div>
                      <div className="text-[11px]" style={{ color: "#94A3B8" }}>{bottleneck.msg}</div>
                    </div>
                  </div>

                  {/* Actionable link */}
                  {bottleneck.type !== "none" && (
                    <Link to="/builder"
                      className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition-all hover:-translate-y-0.5"
                      style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)", color: "#C4B5FD" }}>
                      Upgrade in Builder <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </>
              ) : (
                <div className="py-16 flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-3xl flex items-center justify-center animate-pulse"
                    style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.15)" }}>
                    <Monitor className="w-8 h-8" style={{ color: "#7C3AED" }} />
                  </div>
                  <div>
                    <div className="text-base font-black text-white mb-1">Select CPU + GPU to estimate</div>
                    <div className="text-xs" style={{ color: "#475569" }}>Pick your hardware on the left panel</div>
                  </div>
                  {selectedParts.cpu && selectedParts.gpu && (
                    <button
                      onClick={() => { setSelectedCpu(selectedParts.cpu.id); setSelectedGpu(selectedParts.gpu.id); if (selectedParts.ram) setSelectedRam(selectedParts.ram.id); }}
                      className="text-xs font-bold px-4 py-2.5 rounded-xl transition-all hover:-translate-y-0.5"
                      style={{ background: "linear-gradient(135deg,#7C3AED,#3B82F6)", color: "#fff" }}
                    >
                      <Sparkles className="w-3.5 h-3.5 inline mr-1.5" />
                      Load from Builder
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Resolution Comparison (if GPU selected) */}
            {selectedGpu && (
              <div className="fps-panel rounded-3xl p-6"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}>
                <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4">
                  {selectedGameData?.icon} {selectedGameData?.name} — All Resolutions
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {["1080p", "1440p", "4k"].map(res => {
                    const base = FPS_BENCHMARKS[selectedGpu]?.[selectedGame]?.[res] || 0;
                    const fps  = Math.round(base * (CPU_GAMING_MULTIPLIER[selectedCpu] || 1) * (RAM_FPS_MULTIPLIER[selectedRam] || 1));
                    const t    = getFPSTier(fps);
                    return (
                      <div key={res} className="rounded-2xl p-4 text-center"
                        style={{ background: resolution === res ? `${t.bg}` : "rgba(255,255,255,0.03)", border: `1px solid ${resolution === res ? t.color + "50" : "rgba(255,255,255,0.07)"}` }}>
                        <div className="text-[9px] uppercase font-black tracking-widest mb-2" style={{ color: "#475569" }}>
                          {res === "4k" ? "4K" : res}
                        </div>
                        <div className="text-3xl font-black" style={{ color: fps ? t.color : "#334155" }}>{fps || "—"}</div>
                        <div className="text-[9px] font-bold mt-1" style={{ color: t.color }}>{fps ? t.label : "N/A"}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* All Games Grid */}
        {canEstimate && (
          <div className="mt-10">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5" style={{ color: "#7C3AED" }} />
                Full Game Library — {resolution === "4k" ? "4K" : resolution} Estimates
              </h2>
              <div className="flex gap-1.5">
                {[
                  { color: "#7C3AED", label: "Extreme (200+)" },
                  { color: "#3B82F6", label: "Ultra (120+)" },
                  { color: "#10B981", label: "High (80+)" },
                  { color: "#F59E0B", label: "Playable (60+)" },
                  { color: "#EF4444", label: "<60" },
                ].map(item => (
                  <span key={item.label} className="hidden lg:flex items-center gap-1.5 text-[10px] font-bold" style={{ color: "#475569" }}>
                    <span className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                    {item.label}
                  </span>
                ))}
              </div>
            </div>
            <AllGamesGrid cpuId={selectedCpu} gpuId={selectedGpu} ramId={selectedRam} resolution={resolution} />
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
          style={{ background: "linear-gradient(135deg,rgba(124,58,237,0.1),rgba(11,17,32,0.8))", border: "1px solid rgba(124,58,237,0.2)", backdropFilter: "blur(20px)" }}>
          <div>
            <h3 className="text-xl font-black text-white mb-1">Ready to build this config?</h3>
            <p className="text-sm" style={{ color: "#94A3B8" }}>Head to the builder and put your perfect rig together with real-time compatibility checks.</p>
          </div>
          <Link to="/builder"
            className="flex-shrink-0 flex items-center gap-2 px-6 py-3.5 rounded-[14px] font-bold text-sm text-white transition-all hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg,#7C3AED,#3B82F6)", boxShadow: "0 4px 24px rgba(124,58,237,0.4)" }}>
            Open PC Builder <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

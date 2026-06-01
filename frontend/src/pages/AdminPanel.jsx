import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import {
  Shield, Package, Users, BarChart3, Star, Cpu, Layers,
  TrendingUp, Eye, CheckCircle, XCircle, Lock, LogOut,
  Monitor, Gamepad2, Zap, AlertTriangle, ChevronRight
} from "lucide-react";
import { COMPONENTS, COMMUNITY_BUILDS, PREBUILT_PCS, LAPTOPS } from "../services/mockData";

const ADMIN_PIN = "admin123";

/* ─── Stat Card ─── */
function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-3"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}>
      <div className="flex items-center justify-between">
        <div className="p-2.5 rounded-xl" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        {sub && <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full"
          style={{ background: `${color}12`, color }}>{sub}</span>}
      </div>
      <div>
        <div className="text-2xl font-black text-white">{value}</div>
        <div className="text-xs font-medium mt-0.5" style={{ color: "#475569" }}>{label}</div>
      </div>
    </div>
  );
}

/* ─── Login screen ─── */
function AdminLogin({ onLogin }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const attempt = () => {
    if (pin === ADMIN_PIN) { onLogin(); }
    else { setError(true); setTimeout(() => setError(false), 1500); setPin(""); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#050816" }}>
      <div className="w-full max-w-sm p-8 rounded-3xl flex flex-col gap-6"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(24px)" }}>
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)" }}>
            <Lock className="w-6 h-6" style={{ color: "#A78BFA" }} />
          </div>
          <h1 className="text-xl font-black text-white">Admin Panel</h1>
          <p className="text-xs mt-1" style={{ color: "#475569" }}>Enter your admin PIN to continue</p>
        </div>
        <div className="flex flex-col gap-3">
          <input
            type="password"
            value={pin}
            onChange={e => setPin(e.target.value)}
            onKeyDown={e => e.key === "Enter" && attempt()}
            placeholder="Enter admin PIN..."
            className="w-full px-4 py-3.5 rounded-xl text-white text-sm text-center tracking-[0.3em] font-mono focus:outline-none"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: `1px solid ${error ? "rgba(239,68,68,0.5)" : "rgba(124,58,237,0.3)"}`,
              transition: "border-color 0.2s"
            }}
            autoFocus
          />
          {error && <p className="text-xs text-center" style={{ color: "#EF4444" }}>Incorrect PIN. Try again.</p>}
          <button onClick={attempt}
            className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg,#7C3AED,#3B82F6)", boxShadow: "0 4px 24px rgba(124,58,237,0.35)" }}>
            Access Admin Panel
          </button>
        </div>
        <p className="text-center text-[10px]" style={{ color: "#334155" }}>Hint: admin123</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN ADMIN PANEL
══════════════════════════════════════════════════════ */
export default function AdminPanel() {
  const [authed, setAuthed]         = useState(false);
  const [activeTab, setActiveTab]   = useState("overview");
  const [featured, setFeatured]     = useState({});
  const pageRef = useRef(null);

  // Saved community builds from localStorage
  const [savedBuilds, setSavedBuilds] = useState(() => {
    try { return JSON.parse(localStorage.getItem("icpcs_saved_builds") || "[]"); }
    catch { return []; }
  });

  useEffect(() => {
    if (!authed) return;
    const ctx = gsap.context(() => {
      gsap.from(".admin-stat", { opacity: 0, y: 24, stagger: 0.08, duration: 0.7, ease: "power3.out" });
    }, pageRef);
    return () => ctx.revert();
  }, [authed, activeTab]);

  if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} />;

  const totalComponents = COMPONENTS.length;
  const cpuCount  = COMPONENTS.filter(c => c.category === "cpu").length;
  const gpuCount  = COMPONENTS.filter(c => c.category === "gpu").length;
  const communityCount = COMMUNITY_BUILDS.length + savedBuilds.length;
  const avgBenchmark = Math.round(COMPONENTS.reduce((s, c) => s + (c.benchmarkScore || 0), 0) / totalComponents);

  const TABS = [
    { id: "overview",   label: "Overview",    icon: BarChart3 },
    { id: "components", label: "Components",  icon: Cpu },
    { id: "community",  label: "Community",   icon: Users },
    { id: "prebuilts",  label: "Pre-builts",  icon: Monitor },
  ];

  return (
    <div ref={pageRef} className="min-h-screen" style={{ background: "#050816", color: "#fff" }}>
      {/* Ambient */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full -z-10 pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(124,58,237,0.08) 0%,transparent 70%)", filter: "blur(80px)" }} />

      {/* Header */}
      <div className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{ background: "rgba(5,8,22,0.92)", borderBottom: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(24px)" }}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl" style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)" }}>
            <Shield className="w-4 h-4" style={{ color: "#A78BFA" }} />
          </div>
          <div>
            <div className="text-sm font-black text-white">IC PC's Admin</div>
            <div className="text-[10px] font-medium" style={{ color: "#475569" }}>Platform Management Console</div>
          </div>
        </div>
        <button onClick={() => setAuthed(false)} className="flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-xl transition-all"
          style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.18)", color: "#F87171" }}>
          <LogOut className="w-3.5 h-3.5" /> Logout
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all"
              style={activeTab === t.id
                ? { background: "linear-gradient(135deg,#7C3AED,#3B82F6)", color: "#fff" }
                : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#94A3B8" }
              }>
              <t.icon className="w-3.5 h-3.5" /> {t.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="admin-stat"><StatCard icon={Package} label="Total Components" value={totalComponents} color="#7C3AED" sub="Catalog" /></div>
              <div className="admin-stat"><StatCard icon={Users}   label="Community Builds" value={communityCount} color="#3B82F6" sub="Posts" /></div>
              <div className="admin-stat"><StatCard icon={Monitor} label="Pre-built Systems" value={PREBUILT_PCS.length} color="#06B6D4" sub="SKUs" /></div>
              <div className="admin-stat"><StatCard icon={TrendingUp} label="Avg Benchmark Score" value={avgBenchmark} color="#10B981" sub="/100" /></div>
            </div>

            {/* Breakdown by category */}
            <div className="rounded-3xl p-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <h2 className="text-sm font-black text-white uppercase tracking-widest mb-5">Component Catalog Breakdown</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["cpu","gpu","motherboard","ram","storage","psu","case","cooler"].map(cat => {
                  const count = COMPONENTS.filter(c => c.category === cat).length;
                  const pct = Math.round((count / totalComponents) * 100);
                  return (
                    <div key={cat} className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div className="text-[10px] uppercase font-black tracking-widest mb-2" style={{ color: "#475569" }}>{cat}</div>
                      <div className="text-2xl font-black text-white">{count}</div>
                      <div className="text-[10px] mt-1 font-bold" style={{ color: "#7C3AED" }}>{pct}% of catalog</div>
                      <div className="h-1 rounded-full mt-2 overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                        <div className="h-full rounded-full" style={{ width: `${pct * 3}%`, background: "linear-gradient(90deg,#7C3AED,#3B82F6)" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* System status */}
            <div className="rounded-3xl p-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <h2 className="text-sm font-black text-white uppercase tracking-widest mb-5">System Health</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { label: "FPS Benchmark Data", status: true, detail: "12 GPUs × 8 Games × 3 Resolutions" },
                  { label: "Retailer Pricing", status: true, detail: "Amazon · Flipkart · MDComputers · Vedant" },
                  { label: "Compatibility Engine", status: true, detail: "5 checks: Socket, RAM, PSU, Clearance, Cooler" },
                  { label: "Budget Recommender", status: true, detail: "5 purposes × multiple budget tiers" },
                  { label: "Community Platform", status: true, detail: `${communityCount} builds indexed` },
                  { label: "LocalStorage Persistence", status: true, detail: "Saved builds + wishlist" },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-3 p-3.5 rounded-2xl"
                    style={{ background: item.status ? "rgba(16,185,129,0.07)" : "rgba(239,68,68,0.07)", border: `1px solid ${item.status ? "rgba(16,185,129,0.18)" : "rgba(239,68,68,0.18)"}` }}>
                    {item.status
                      ? <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#34D399" }} />
                      : <XCircle    className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#F87171" }} />
                    }
                    <div>
                      <div className="text-xs font-bold text-white">{item.label}</div>
                      <div className="text-[10px] mt-0.5" style={{ color: "#475569" }}>{item.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* COMPONENTS TAB */}
        {activeTab === "components" && (
          <div className="rounded-3xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="px-6 py-4 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <Cpu className="w-4 h-4" style={{ color: "#7C3AED" }} />
              <h2 className="text-sm font-black text-white uppercase tracking-widest">Component Catalog — {COMPONENTS.length} entries</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                    {["ID", "Name", "Brand", "Category", "Price (₹)", "Benchmark", "Value", "Retailers"].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-black uppercase tracking-widest" style={{ color: "#475569" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPONENTS.map((c, i) => (
                    <tr key={c.id} className="transition-colors"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <td className="px-4 py-3 font-mono" style={{ color: "#334155" }}>{c.id}</td>
                      <td className="px-4 py-3 font-bold text-white max-w-[180px] truncate">{c.name}</td>
                      <td className="px-4 py-3" style={{ color: "#94A3B8" }}>{c.brand}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full font-black uppercase text-[9px]"
                          style={{ background: "rgba(124,58,237,0.12)", color: "#A78BFA" }}>{c.category}</span>
                      </td>
                      <td className="px-4 py-3 font-black text-white">₹{c.price.toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3 font-bold" style={{ color: "#7C3AED" }}>{c.benchmarkScore}/100</td>
                      <td className="px-4 py-3 font-bold" style={{ color: "#10B981" }}>{c.valueScore}/100</td>
                      <td className="px-4 py-3">
                        <span className="text-[9px] font-bold" style={{ color: "#475569" }}>
                          {Object.keys(c.retailers || {}).length} retailers
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* COMMUNITY TAB */}
        {activeTab === "community" && (
          <div className="flex flex-col gap-4">
            <div className="rounded-3xl p-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <h2 className="text-sm font-black text-white uppercase tracking-widest mb-5">
                Community Builds — {COMMUNITY_BUILDS.length} public + {savedBuilds.length} user saved
              </h2>
              <div className="flex flex-col gap-3">
                {COMMUNITY_BUILDS.map(build => (
                  <div key={build.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="flex items-center gap-3">
                      <img src={build.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <div className="text-sm font-bold text-white">{build.name}</div>
                        <div className="text-[10px]" style={{ color: "#475569" }}>by {build.author} · {build.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="text-xs font-black text-white">₹{build.totalPrice.toLocaleString("en-IN")}</span>
                      <span className="text-[10px] px-2 py-1 rounded-full font-bold capitalize"
                        style={{ background: "rgba(124,58,237,0.12)", color: "#A78BFA" }}>{build.category}</span>
                      <span className="text-[10px] font-bold" style={{ color: "#94A3B8" }}>
                        ▲ {build.upvotes} · 💬 {build.comments}
                      </span>
                      <button
                        onClick={() => setFeatured(f => ({ ...f, [build.id]: !f[build.id] }))}
                        className="flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1.5 rounded-lg transition-all"
                        style={featured[build.id]
                          ? { background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", color: "#FBBF24" }
                          : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", color: "#475569" }
                        }>
                        <Star className="w-3 h-3" /> {featured[build.id] ? "Featured" : "Feature"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {savedBuilds.length > 0 && (
              <div className="rounded-3xl p-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <h2 className="text-sm font-black text-white uppercase tracking-widest mb-4">User Saved Builds</h2>
                <div className="flex flex-col gap-2">
                  {savedBuilds.map(b => (
                    <div key={b.id} className="flex items-center justify-between p-3.5 rounded-xl"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <span className="text-sm font-bold text-white">{b.name}</span>
                      <span className="text-xs font-black" style={{ color: "#7C3AED" }}>₹{b.totalPrice.toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* PREBUILTS TAB */}
        {activeTab === "prebuilts" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...PREBUILT_PCS, ...LAPTOPS].map(item => (
              <div key={item.id} className="rounded-3xl p-5 flex flex-col gap-3"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-black text-white">{item.name}</div>
                    <div className="text-[10px] mt-0.5" style={{ color: "#475569" }}>{item.brand}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="text-sm font-black text-white">₹{item.price.toLocaleString("en-IN")}</span>
                    {item.badge && (
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(124,58,237,0.12)", color: "#A78BFA" }}>{item.badge}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-medium" style={{ color: "#475569" }}>
                  <span className="flex items-center gap-1">⭐ {item.rating}</span>
                  <span>·</span>
                  <span>{item.reviews} reviews</span>
                </div>
                <div className="text-[10px] leading-relaxed" style={{ color: "#475569" }}>{item.description}</div>
                {item.retailers && (
                  <div className="grid grid-cols-2 gap-2 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                    {Object.entries(item.retailers).map(([r, d]) => (
                      <div key={r} className="flex justify-between text-[9px]">
                        <span className="capitalize font-bold" style={{ color: "#475569" }}>{r === "mdcomputers" ? "MDComputers" : r.charAt(0).toUpperCase() + r.slice(1)}</span>
                        <span className="font-black text-white">₹{d.price.toLocaleString("en-IN")}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

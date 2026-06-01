import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import {
  Cpu, Trash2, ArrowRight, Eye, Calendar, Sparkles, Edit2, Download,
  TrendingUp, Zap, Package, CheckCircle, Star, BarChart3, Shield,
  Gamepad2, X, ChevronRight, ExternalLink, Plus
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useBuilderStore } from "../store/builderStore";
import { useToastStore } from "../store/toastStore";

/* ─── Stat card ─── */
function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-2.5"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(12px)" }}>
      <div className="p-2.5 rounded-xl w-fit" style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <div>
        <div className="text-2xl font-black text-white">{value}</div>
        <div className="text-[10px] uppercase font-black tracking-widest mt-0.5" style={{ color: "#475569" }}>{label}</div>
        {sub && <div className="text-[10px] mt-1 font-medium" style={{ color: "#334155" }}>{sub}</div>}
      </div>
    </div>
  );
}

/* ─── Rename modal ─── */
function RenameModal({ build, onClose, onSave }) {
  const [name, setName] = useState(build.name);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)" }}>
      <div className="max-w-sm w-full rounded-3xl p-6 flex flex-col gap-5"
        style={{ background: "rgba(5,8,22,0.97)", border: "1px solid rgba(124,58,237,0.3)", backdropFilter: "blur(24px)" }}>
        <div className="flex justify-between items-center">
          <h3 className="text-base font-black text-white">Rename Build</h3>
          <button onClick={onClose} className="p-2 rounded-xl" style={{ color: "#475569" }}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <input
          type="text" value={name} onChange={e => setName(e.target.value)}
          className="w-full px-4 py-3.5 rounded-xl text-white text-sm focus:outline-none"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(124,58,237,0.3)" }}
          onKeyDown={e => e.key === "Enter" && onSave(name)}
          autoFocus
        />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl font-bold text-sm"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", color: "#94A3B8" }}>
            Cancel
          </button>
          <button onClick={() => onSave(name)} className="flex-1 py-3 rounded-xl font-bold text-sm text-white"
            style={{ background: "linear-gradient(135deg,#7C3AED,#3B82F6)" }}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════ */
export default function Dashboard() {
  const pageRef = useRef(null);
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const { addPart } = useBuilderStore();
  const addToast = useToastStore(s => s.addToast);

  const [savedBuilds, setSavedBuilds] = useState([]);
  const [renaming, setRenaming] = useState(null);
  const [activeTab, setActiveTab] = useState("builds");

  // Wishlist from localStorage
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem("icpcs_wishlist") || "[]"); }
    catch { return []; }
  });

  useEffect(() => {
    const list = localStorage.getItem("icpcs_saved_builds");
    if (list) setSavedBuilds(JSON.parse(list));
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".dash-card", { opacity: 0, y: 24, stagger: 0.07, duration: 0.7, ease: "power3.out" });
    }, pageRef);
    return () => ctx.revert();
  }, [activeTab]);

  const handleDelete = id => {
    const updated = savedBuilds.filter(b => b.id !== id);
    setSavedBuilds(updated);
    localStorage.setItem("icpcs_saved_builds", JSON.stringify(updated));
    addToast("Build deleted.", "info");
  };

  const handleRename = (id, newName) => {
    const updated = savedBuilds.map(b => b.id === id ? { ...b, name: newName } : b);
    setSavedBuilds(updated);
    localStorage.setItem("icpcs_saved_builds", JSON.stringify(updated));
    setRenaming(null);
    addToast(`Renamed to "${newName}"`, "success");
  };

  const handleLoadBuild = build => {
    if (!build.parts) return;
    Object.entries(build.parts).forEach(([cat, part]) => { if (part) addPart(cat, part); });
    addToast("Build loaded into PC Builder!", "success");
    navigate("/builder");
  };

  const handleExport = build => {
    const text = `IC PC's Build Export
Name: ${build.name}
Date: ${build.date}
Total: ₹${build.totalPrice.toLocaleString("en-IN")}

Components:
${Object.entries(build.parts || {}).filter(([,v]) => v).map(([cat, p]) => `• ${cat.toUpperCase()}: ${p.brand} ${p.name} — ₹${p.price.toLocaleString("en-IN")}`).join("\n")}
`;
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${build.name.replace(/\s+/g, "_")}.txt`;
    a.click();
    addToast("Build exported as .txt", "success");
  };

  const removeWishlistItem = id => {
    const updated = wishlist.filter(i => i.id !== id);
    setWishlist(updated);
    localStorage.setItem("icpcs_wishlist", JSON.stringify(updated));
  };

  const totalDrafts = savedBuilds.length;
  const totalSpent = savedBuilds.reduce((s, b) => s + (b.totalPrice || 0), 0);
  const mostExpensive = savedBuilds.reduce((max, b) => b.totalPrice > (max?.totalPrice || 0) ? b : max, null);
  const welcomeName = user?.username || "Builder";

  const TABS = [
    { id: "builds",   label: "My Builds",   icon: Package },
    { id: "wishlist", label: "Wishlist",     icon: Star },
    { id: "activity", label: "Activity",     icon: BarChart3 },
  ];

  const mockActivities = [
    { text: "Builder loaded into PC Configurator", time: "Just now", icon: Cpu, color: "#7C3AED" },
    { text: "Compatibility check: Socket + PSU verified", time: "2 hours ago", icon: CheckCircle, color: "#10B981" },
    { text: "FPS Estimated: RTX 4080 @ 1440p", time: "5 hours ago", icon: TrendingUp, color: "#3B82F6" },
    { text: "Upvoted 'Frostbite Gaming Concept'", time: "1 day ago", icon: Star, color: "#F59E0B" },
    { text: "Compared: i9-14900K vs Ryzen 9 7950X", time: "2 days ago", icon: BarChart3, color: "#06B6D4" },
  ];

  return (
    <div ref={pageRef} className="flex flex-col gap-6 w-full">

      {/* Welcome Banner */}
      <div className="dash-card rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,rgba(124,58,237,0.12),rgba(11,17,32,0.8))", border: "1px solid rgba(124,58,237,0.2)" }}>
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(124,58,237,0.2) 0%,transparent 70%)", filter: "blur(20px)" }} />
        <div>
          <div className="text-xl font-black text-white flex items-center gap-2">
            Welcome back, {welcomeName} <Sparkles className="w-4 h-4" style={{ color: "#A78BFA" }} />
          </div>
          <p className="text-xs mt-1" style={{ color: "#94A3B8" }}>
            {totalDrafts > 0
              ? `You have ${totalDrafts} saved build${totalDrafts > 1 ? "s" : ""} — ₹${totalSpent.toLocaleString("en-IN")} total configured.`
              : "Start configuring your dream rig using the PC Builder."}
          </p>
        </div>
        <Link to="/builder"
          className="flex items-center gap-2 px-5 py-3 rounded-[12px] font-bold text-sm text-white whitespace-nowrap transition-all hover:-translate-y-0.5"
          style={{ background: "linear-gradient(135deg,#7C3AED,#3B82F6)", boxShadow: "0 4px 20px rgba(124,58,237,0.35)" }}>
          <Plus className="w-4 h-4" /> New Build
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="dash-card"><StatCard icon={Package} label="Saved Builds" value={totalDrafts} color="#7C3AED" /></div>
        <div className="dash-card"><StatCard icon={Zap} label="Total Configured" value={`₹${Math.round(totalSpent / 1000)}K`} color="#3B82F6" /></div>
        <div className="dash-card"><StatCard icon={TrendingUp} label="Most Expensive" value={mostExpensive ? `₹${(mostExpensive.totalPrice / 1000).toFixed(0)}K` : "—"} color="#06B6D4" sub={mostExpensive?.name} /></div>
        <div className="dash-card"><StatCard icon={Star} label="Wishlist Items" value={wishlist.length} color="#F59E0B" /></div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs transition-all"
            style={activeTab === t.id
              ? { background: "linear-gradient(135deg,#7C3AED,#3B82F6)", color: "#fff" }
              : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#94A3B8" }
            }>
            <t.icon className="w-3.5 h-3.5" /> {t.label}
          </button>
        ))}
      </div>

      {/* BUILDS TAB */}
      {activeTab === "builds" && (
        <div className="flex flex-col gap-3">
          {savedBuilds.length === 0 ? (
            <div className="dash-card rounded-3xl py-16 flex flex-col items-center gap-4"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="w-16 h-16 rounded-3xl flex items-center justify-center"
                style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.15)" }}>
                <Cpu className="w-7 h-7 animate-pulse" style={{ color: "#7C3AED" }} />
              </div>
              <div className="text-center">
                <div className="text-sm font-black text-white">No saved builds yet</div>
                <div className="text-xs mt-1" style={{ color: "#475569" }}>Use the PC Builder to create and save your first rig.</div>
              </div>
              <Link to="/builder" className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-white"
                style={{ background: "linear-gradient(135deg,#7C3AED,#3B82F6)" }}>
                <Plus className="w-4 h-4" /> Open Builder
              </Link>
            </div>
          ) : (
            savedBuilds.map(build => (
              <div key={build.id} className="dash-card rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(12px)" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(124,58,237,0.25)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl shrink-0" style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}>
                    <Cpu className="w-5 h-5" style={{ color: "#A78BFA" }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">{build.name}</h3>
                    <div className="flex items-center gap-3 mt-1 text-[10px]" style={{ color: "#475569" }}>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {build.date}</span>
                      <span>·</span>
                      <span>{Object.values(build.parts || {}).filter(Boolean).length} components</span>
                    </div>
                    <div className="text-base font-black mt-2 text-white">₹{build.totalPrice.toLocaleString("en-IN")}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap justify-end">
                  <button onClick={() => handleExport(build)}
                    className="flex items-center gap-1.5 text-xs font-bold px-3 py-2.5 rounded-xl transition-all hover:-translate-y-0.5"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#94A3B8" }}>
                    <Download className="w-3.5 h-3.5" /> Export
                  </button>
                  <button onClick={() => setRenaming(build)}
                    className="flex items-center gap-1.5 text-xs font-bold px-3 py-2.5 rounded-xl transition-all hover:-translate-y-0.5"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#94A3B8" }}>
                    <Edit2 className="w-3.5 h-3.5" /> Rename
                  </button>
                  <button onClick={() => handleLoadBuild(build)}
                    className="flex items-center gap-1.5 text-xs font-bold px-3 py-2.5 rounded-xl text-white transition-all hover:-translate-y-0.5"
                    style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", color: "#A78BFA" }}>
                    <ArrowRight className="w-3.5 h-3.5" /> Load
                  </button>
                  <button onClick={() => handleDelete(build.id)}
                    className="p-2.5 rounded-xl transition-all"
                    style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.14)", color: "#94A3B8" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#F87171"}
                    onMouseLeave={e => e.currentTarget.style.color = "#94A3B8"}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* WISHLIST TAB */}
      {activeTab === "wishlist" && (
        <div className="flex flex-col gap-3">
          {wishlist.length === 0 ? (
            <div className="dash-card rounded-3xl py-16 flex flex-col items-center gap-4"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <Star className="w-8 h-8" style={{ color: "#F59E0B" }} />
              <div className="text-center">
                <div className="text-sm font-black text-white">Wishlist is empty</div>
                <div className="text-xs mt-1" style={{ color: "#475569" }}>Browse the Component Library and wishlist parts you want.</div>
              </div>
              <Link to="/components" className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-white"
                style={{ background: "linear-gradient(135deg,#7C3AED,#3B82F6)" }}>
                Browse Components
              </Link>
            </div>
          ) : (
            wishlist.map(item => (
              <div key={item.id} className="dash-card rounded-2xl p-4 flex items-center justify-between gap-4"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div>
                  <div className="text-sm font-black text-white">{item.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#475569" }}>{item.brand} · {item.category}</div>
                  <div className="text-sm font-black mt-1" style={{ color: "#A78BFA" }}>₹{item.price?.toLocaleString("en-IN")}</div>
                </div>
                <button onClick={() => removeWishlistItem(item.id)}
                  className="p-2.5 rounded-xl" style={{ color: "#94A3B8" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#F87171"}
                  onMouseLeave={e => e.currentTarget.style.color = "#94A3B8"}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* ACTIVITY TAB */}
      {activeTab === "activity" && (
        <div className="dash-card rounded-3xl p-6 flex flex-col gap-3"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <h3 className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "#475569" }}>Recent Activity</h3>
          {mockActivities.map((item, i) => (
            <div key={i} className="flex items-start gap-3 py-3" style={{ borderBottom: i < mockActivities.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
              <div className="p-2 rounded-xl shrink-0 mt-0.5" style={{ background: `${item.color}12`, border: `1px solid ${item.color}25` }}>
                <item.icon className="w-3.5 h-3.5" style={{ color: item.color }} />
              </div>
              <div className="flex-1">
                <div className="text-xs font-semibold text-white">{item.text}</div>
                <div className="text-[10px] mt-0.5" style={{ color: "#334155" }}>{item.time}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { to: "/builder",   label: "PC Builder",      icon: Cpu,       desc: "Configure a new rig",    color: "#7C3AED" },
          { to: "/fps",       label: "FPS Estimator",   icon: Gamepad2,  desc: "Estimate your game FPS", color: "#3B82F6" },
          { to: "/recommend", label: "Budget Advisor",  icon: Shield,    desc: "Get a build recommended",color: "#06B6D4" },
        ].map(link => (
          <Link key={link.to} to={link.to}
            className="dash-card rounded-2xl p-4 flex items-center gap-3 transition-all hover:-translate-y-1"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = `${link.color}40`}
            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}
          >
            <div className="p-2.5 rounded-xl" style={{ background: `${link.color}12`, border: `1px solid ${link.color}25` }}>
              <link.icon className="w-4 h-4" style={{ color: link.color }} />
            </div>
            <div className="flex-1">
              <div className="text-xs font-black text-white">{link.label}</div>
              <div className="text-[10px]" style={{ color: "#475569" }}>{link.desc}</div>
            </div>
            <ChevronRight className="w-3.5 h-3.5" style={{ color: "#334155" }} />
          </Link>
        ))}
      </div>

      {/* Rename modal */}
      {renaming && (
        <RenameModal
          build={renaming}
          onClose={() => setRenaming(null)}
          onSave={name => handleRename(renaming.id, name)}
        />
      )}
    </div>
  );
}

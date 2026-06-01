import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { COMMUNITY_BUILDS } from "../services/mockData";
import { ThumbsUp, Calendar, ArrowRight, Sparkles, Heart, Star } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BUILD_IMAGES = {
  "build-1": "/images/gaming_pc.png",
  "build-2": "/images/rtx_gpu.png",
  "build-3": "/images/workstation_pc.png",
};
const getBuildImage = (id) => BUILD_IMAGES[id] || "/images/gaming_pc.png";

export default function Community() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [builds, setBuilds] = useState(COMMUNITY_BUILDS);
  const [upvotedBuilds, setUpvotedBuilds] = useState([]);
  const pageRef = useRef(null);
  const headerRef = useRef(null);

  const categories = [
    { id: "all", name: "All Rigs" },
    { id: "gaming", name: "Gaming" },
    { id: "workstation", name: "Workstation" },
    { id: "budget", name: "Budget" },
    { id: "enthusiast", name: "Enthusiast" },
  ];

  const filteredBuilds =
    activeCategory === "all" ? builds : builds.filter((b) => b.category === activeCategory);

  const handleUpvote = (id) => {
    const already = upvotedBuilds.includes(id);
    setUpvotedBuilds(already ? upvotedBuilds.filter((i) => i !== id) : [...upvotedBuilds, id]);
    setBuilds(builds.map((b) => (b.id === id ? { ...b, upvotes: b.upvotes + (already ? -1 : 1) } : b)));
  };

  /* ── GSAP Animations ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".comm-header", {
        opacity: 0, y: -30, duration: 0.9, ease: "power3.out",
      });
      gsap.from(".cat-pill", {
        opacity: 0, y: 16, stagger: 0.06, duration: 0.6, ease: "power3.out", delay: 0.2,
      });
      ScrollTrigger.batch(".build-card", {
        start: "top 90%",
        onEnter: (els) =>
          gsap.from(els, { opacity: 0, y: 55, scale: 0.94, stagger: 0.08, duration: 0.85, ease: "power3.out" }),
        once: true,
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen relative overflow-hidden" style={{ background: "#050816", color: "#fff" }}>
      {/* Ambient glows */}
      <div className="fixed top-0 left-0 w-[700px] h-[700px] rounded-full pointer-events-none -z-10"
        style={{ background: "radial-gradient(circle,rgba(124,58,237,0.1) 0%,transparent 70%)", filter: "blur(80px)" }} />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none -z-10"
        style={{ background: "radial-gradient(circle,rgba(59,130,246,0.08) 0%,transparent 70%)", filter: "blur(80px)" }} />

      <div className="max-w-7xl mx-auto w-full px-6 py-14">

        {/* Header Banner */}
        <div
          ref={headerRef}
          className="comm-header relative overflow-hidden rounded-3xl p-8 md:p-14 mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8"
          style={{
            background: "linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(11,17,32,0.8) 60%, rgba(5,8,22,0.9) 100%)",
            border: "1px solid rgba(124,58,237,0.2)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Glow orb */}
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle,rgba(124,58,237,0.2) 0%,transparent 70%)", filter: "blur(40px)" }} />

          <div className="flex flex-col gap-4 relative z-10">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em]"
              style={{ color: "#06B6D4" }}>
              <Sparkles className="w-3.5 h-3.5" /> Community Gallery
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none">
              Explore Custom{" "}
              <span style={{ background: "linear-gradient(90deg,#7C3AED,#3B82F6,#06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundSize: "200% auto", animation: "shine 4s linear infinite" }}>
                Rigs
              </span>
            </h1>
            <p className="text-sm leading-relaxed max-w-md" style={{ color: "#94A3B8" }}>
              Get design inspiration from rigs built by enthusiasts worldwide.
              Clone any parts list straight into your configurator.
            </p>
          </div>

          <Link
            to="/builder"
            className="relative z-10 flex items-center gap-2 font-bold text-sm text-white px-6 py-4 rounded-[14px] transition-all hover:-translate-y-1 w-fit shrink-0"
            style={{
              background: "linear-gradient(135deg,#7C3AED,#3B82F6)",
              boxShadow: "0 4px 24px rgba(124,58,237,0.4)",
              border: "1px solid rgba(124,58,237,0.4)",
            }}
          >
            Share Your Rig <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2.5 overflow-x-auto pb-4 mb-8 scrollbar-none" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          {categories.map((cat) => {
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="cat-pill px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap uppercase tracking-wider transition-all hover:-translate-y-0.5"
                style={active
                  ? { background: "linear-gradient(135deg,#7C3AED,#3B82F6)", color: "#fff", border: "1px solid rgba(124,58,237,0.5)", boxShadow: "0 4px 20px rgba(124,58,237,0.35)" }
                  : { background: "rgba(255,255,255,0.04)", color: "#94A3B8", border: "1px solid rgba(255,255,255,0.07)" }
                }
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Pinterest Masonry Grid */}
        {filteredBuilds.length > 0 ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-5 space-y-5">
            {filteredBuilds.map((build, idx) => {
              const isUpvoted = upvotedBuilds.includes(build.id);
              return (
                <div
                  key={build.id}
                  className="build-card break-inside-avoid rounded-3xl p-6 group cursor-pointer transition-all duration-400"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}
                  onMouseEnter={e => {
                    gsap.to(e.currentTarget, { y: -8, duration: 0.35, ease: "power2.out" });
                    e.currentTarget.style.borderColor = "rgba(124,58,237,0.3)";
                    e.currentTarget.style.boxShadow = "0 25px 60px -10px rgba(124,58,237,0.18), 0 0 0 1px rgba(124,58,237,0.12)";
                  }}
                  onMouseLeave={e => {
                    gsap.to(e.currentTarget, { y: 0, duration: 0.5, ease: "power2.out" });
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Author row */}
                  <div className="flex items-center gap-3 pb-4 mb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                    <img
                      src={build.avatar || `https://i.pravatar.cc/40?img=${idx + 1}`}
                      alt={build.author}
                      className="w-9 h-9 rounded-full object-cover"
                      style={{ border: "1px solid rgba(124,58,237,0.3)" }}
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">{build.author}</h4>
                      <span className="text-[10px] flex items-center gap-1" style={{ color: "#475569" }}>
                        <Calendar className="w-3 h-3" /> {build.date}
                      </span>
                    </div>
                    <span
                      className="ml-auto text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                      style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)", color: "#C4B5FD" }}
                    >
                      {build.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-black text-white mb-3 group-hover:text-violet-300 transition-colors leading-tight">
                    {build.name}
                  </h3>
                  <p className="text-xs leading-relaxed mb-5" style={{ color: "#94A3B8" }}>
                    {build.description}
                  </p>

                  {/* Image */}
                  <div
                    className="w-full h-48 flex items-center justify-center mb-5 rounded-2xl overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <img
                      src={getBuildImage(build.id)}
                      alt={build.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                      style={{ filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.6))" }}
                    />
                  </div>

                  {/* Specs */}
                  <div className="flex flex-col gap-2 p-4 rounded-2xl mb-5 text-[11px]"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="flex justify-between">
                      <span style={{ color: "#475569" }}>Processor</span>
                      <span className="font-bold text-white truncate max-w-[160px]">{build.cpu}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: "#475569" }}>Graphics</span>
                      <span className="font-bold truncate max-w-[160px]" style={{ color: "#93C5FD" }}>{build.gpu}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: "#475569" }}>Chassis</span>
                      <span className="font-bold truncate max-w-[160px]" style={{ color: "#94A3B8" }}>{build.casePart}</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                    <div>
                      <span className="text-[9px] uppercase tracking-widest font-bold block" style={{ color: "#334155" }}>
                        Total Est. Cost
                      </span>
                      <span className="text-xl font-black text-white">₹{build.totalPrice.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleUpvote(build.id)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all"
                        style={isUpvoted
                          ? { background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.35)", color: "#C4B5FD" }
                          : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#94A3B8" }
                        }
                      >
                        <Heart className={`w-3.5 h-3.5 ${isUpvoted ? "fill-violet-400 text-violet-400" : ""}`} />
                        {build.upvotes}
                      </button>
                      <Link
                        to={`/build/${build.id}`}
                        className="text-xs font-bold px-4 py-2.5 rounded-xl transition-all hover:-translate-y-0.5"
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#94A3B8" }}
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 rounded-3xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <span className="text-sm font-semibold block" style={{ color: "#475569" }}>No community rigs found.</span>
          </div>
        )}
      </div>
    </div>
  );
}

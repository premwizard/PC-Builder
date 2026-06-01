import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Cpu, Zap, Shield, ArrowRight, Star, Users, Package, Award,
  ChevronDown, Sparkles, Layers, Monitor, CheckCircle
} from "lucide-react";
import { PREBUILT_PCS, LAPTOPS, COMMUNITY_BUILDS } from "../services/mockData";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════
   PARTICLE CANVAS
═══════════════════════════════════════ */
function Particles({ count = 80 }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    const COLORS = ["124,58,237", "59,130,246", "6,182,212", "236,72,153"];
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.3,
      dx: (Math.random() - 0.5) * 0.25,
      dy: -Math.random() * 0.5 - 0.08,
      alpha: Math.random() * 0.55 + 0.08,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.y < -5) { p.y = canvas.height + 5; p.x = Math.random() * canvas.width; }
        if (p.x < -5) p.x = canvas.width + 5;
        if (p.x > canvas.width + 5) p.x = -5;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, [count]);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

/* ═══════════════════════════════════════
   LIGHT STREAKS (Layer 3)
═══════════════════════════════════════ */
function LightStreaks() {
  const streaks = [
    { top: "20%", delay: "0s", duration: "5s", color: "124,58,237", width: 200 },
    { top: "45%", delay: "2s", duration: "7s", color: "59,130,246", width: 140 },
    { top: "70%", delay: "1s", duration: "6s", color: "6,182,212",  width: 180 },
    { top: "30%", delay: "3.5s", duration: "8s", color: "236,72,153", width: 120 },
  ];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {streaks.map((s, i) => (
        <div
          key={i}
          className="absolute h-px opacity-70"
          style={{
            top: s.top,
            left: "-20%",
            width: `${s.width}px`,
            background: `linear-gradient(90deg, transparent, rgba(${s.color},0.9), rgba(${s.color},0.5), transparent)`,
            filter: "blur(0.5px)",
            animation: `beam-x ${s.duration} linear ${s.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════
   ANIMATED COUNTER
═══════════════════════════════════════ */
function AnimatedCounter({ target, suffix = "", prefix = "" }) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const trig = ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      onEnter: () => {
        if (started.current) return;
        started.current = true;
        gsap.to({ v: 0 }, {
          v: target, duration: 2.4, ease: "power2.out",
          onUpdate: function () { setValue(Math.round(this.targets()[0].v)); },
        });
      },
    });
    return () => trig.kill();
  }, [target]);
  return <span ref={ref}>{prefix}{value.toLocaleString("en-IN")}{suffix}</span>;
}

/* ═══════════════════════════════════════
   MAGNETIC BUTTON
═══════════════════════════════════════ */
function MagneticBtn({ children, className, style, to, onClick }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    gsap.to(ref.current, {
      x: (e.clientX - r.left - r.width / 2) * 0.38,
      y: (e.clientY - r.top - r.height / 2) * 0.38,
      duration: 0.45, ease: "power2.out",
    });
  };
  const onLeave = () => gsap.to(ref.current, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1,0.4)" });
  const el = (
    <div ref={ref} className={className} style={style}
      onMouseMove={onMove} onMouseLeave={onLeave} onClick={onClick}>
      {children}
    </div>
  );
  return to ? <Link to={to}>{el}</Link> : el;
}

/* ═══════════════════════════════════════
   SECTION EYEBROW
═══════════════════════════════════════ */
function EyeBrow({ children }) {
  return (
    <div className="section-label">
      <span className="w-8 h-px" style={{ background: "linear-gradient(90deg, transparent, #06B6D4)" }} />
      {children}
      <span className="w-8 h-px" style={{ background: "linear-gradient(90deg, #06B6D4, transparent)" }} />
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN HOME PAGE
═══════════════════════════════════════ */
export default function Home() {
  const mainRef   = useRef(null);
  const heroRef   = useRef(null);
  const s2Ref     = useRef(null);
  const hScrollRef = useRef(null);
  const trackRef  = useRef(null);
  const statsRef  = useRef(null);
  const buildRef  = useRef(null);
  const commRef   = useRef(null);
  const ctaRef    = useRef(null);

  /* ── 6-Layer Hero Mouse Parallax ── */
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const LAYERS = [1, 2, 3, 4, 5, 6].map(n => hero.querySelector(`[data-layer='${n}']`));
    const SPEEDS = [0, 0.008, 0.015, -0.02, 0.03, -0.012];
    const onMove = (e) => {
      const { left, top, width, height } = hero.getBoundingClientRect();
      const dx = e.clientX - left - width / 2;
      const dy = e.clientY - top - height / 2;
      LAYERS.forEach((l, i) => {
        if (!l) return;
        gsap.to(l, { x: dx * SPEEDS[i], y: dy * SPEEDS[i], duration: 0.9, ease: "power2.out", overwrite: "auto" });
      });
    };
    hero.addEventListener("mousemove", onMove);
    return () => hero.removeEventListener("mousemove", onMove);
  }, []);

  /* ── GSAP Main Context ── */
  useEffect(() => {
    const ctx = gsap.context(() => {

      /* HERO — stagger word reveal */
      gsap.from(".hw", {
        opacity: 0, y: 80, rotationX: -50, stagger: 0.09, duration: 1.2,
        ease: "power4.out", delay: 0.25,
      });
      gsap.from(".h-sub",      { opacity: 0, y: 35,  duration: 1.1, delay: 1.0,  ease: "power3.out" });
      gsap.from(".h-badge",    { opacity: 0, y: -15, duration: 0.8, delay: 0.1,  ease: "power3.out" });
      gsap.from(".h-cta",      { opacity: 0, y: 25,  duration: 0.9, delay: 1.25, ease: "power3.out", stagger: 0.14 });
      gsap.from(".h-trust",    { opacity: 0, duration: 1, delay: 1.7, ease: "power2.out" });
      gsap.from(".h-scroll",   { opacity: 0, duration: 1, delay: 2.0, ease: "power2.out" });

      /* Hero floating hardware */
      gsap.to(".img-gpu", {
        y: "-20px", rotation: 5, duration: 3.5, repeat: -1, yoyo: true, ease: "sine.inOut",
      });
      gsap.to(".img-laptop", {
        y: "16px", rotation: -4, duration: 4.2, repeat: -1, yoyo: true, ease: "sine.inOut",
      });
      gsap.to(".img-cpu", {
        y: "-13px", rotation: 6, duration: 2.9, repeat: -1, yoyo: true, ease: "sine.inOut",
      });

      /* Aurora orb pulses */
      [".ao1",".ao2",".ao3",".ao4"].forEach((sel, i) => {
        gsap.to(sel, {
          scale: 1.1 + i * 0.03, opacity: 0.6 + i * 0.05,
          duration: 4 + i * 1.5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: i * 0.8,
        });
      });

      /* ── SECTION 2: Pinned Showcase ── */
      const tl2 = gsap.timeline({
        scrollTrigger: {
          trigger: s2Ref.current, start: "top top",
          end: "+=120%", pin: true, scrub: 1.3, anticipatePin: 1,
        },
      });
      tl2
        .from(".sc-gpu",    { opacity: 0, scale: 0.75, rotation: -25, duration: 1 }, 0)
        .to(".sc-gpu",      { rotation: 14, scale: 1.1, duration: 2 }, 0.4)
        .from(".sc-glow",   { opacity: 0, scale: 0.5, duration: 1.2 }, 0)
        .to(".sc-glow",     { opacity: 1, scale: 1.3, duration: 1.5 }, 0.4)
        .from(".spec-card", { opacity: 0, x: -60, stagger: 0.15, duration: 0.9, ease: "power3.out" }, 0.3)
        .from(".sc-badge",  { opacity: 0, y: 24,  stagger: 0.1,  duration: 0.7, ease: "power3.out" }, 0.6)
        .from(".sc-btn",    { opacity: 0, y: 20,  duration: 0.6 }, 0.8);

      /* ── SECTION 3: Horizontal Scroll ── */
      const track = trackRef.current;
      if (track) {
        const dist = track.scrollWidth - window.innerWidth + 48;
        gsap.to(track, {
          x: -dist, ease: "none",
          scrollTrigger: {
            trigger: hScrollRef.current, pin: true, scrub: 1.2,
            end: () => `+=${dist * 1.15}`, invalidateOnRefresh: true,
          },
        });
      }

      /* ── SECTION 4: Stats — fade up stagger ── */
      gsap.from(".stat-c", {
        opacity: 0, y: 55, scale: 0.92, stagger: 0.12, duration: 0.95, ease: "power3.out",
        scrollTrigger: { trigger: statsRef.current, start: "top 75%" },
      });
      gsap.from(".bench-fill", {
        scaleX: 0, transformOrigin: "left", stagger: 0.14, duration: 1.3, ease: "power3.out",
        scrollTrigger: { trigger: ".bench-fill", start: "top 82%" },
      });

      /* ── SECTION 5: Build Exp — fade left / right ── */
      gsap.from(".bl-feat", {
        opacity: 0, x: -60, stagger: 0.18, duration: 1.1, ease: "power3.out",
        scrollTrigger: { trigger: buildRef.current, start: "top 72%" },
      });
      gsap.from(".bl-imgs", {
        opacity: 0, x: 60, duration: 1.1, ease: "power3.out",
        scrollTrigger: { trigger: buildRef.current, start: "top 72%" },
      });

      /* ── SECTION 6: Community — batch stagger ── */
      ScrollTrigger.batch(".comm-card", {
        start: "top 90%",
        onEnter: (els) =>
          gsap.from(els, { opacity: 0, y: 60, scale: 0.93, stagger: 0.09, duration: 0.95, ease: "power3.out" }),
        once: true,
      });

      /* ── SECTION 7: CTA ── */
      gsap.from(".cta-orb",   { opacity: 0, scale: 0, stagger: 0.25, duration: 1.6, ease: "elastic.out(1,0.4)", scrollTrigger: { trigger: ctaRef.current, start: "top 80%" } });
      gsap.from(".cta-head",  { opacity: 0, y: 55, duration: 1.2, ease: "power4.out",  scrollTrigger: { trigger: ctaRef.current, start: "top 78%" } });
      gsap.from(".cta-sub",   { opacity: 0, y: 30, duration: 1.0, ease: "power3.out",  scrollTrigger: { trigger: ctaRef.current, start: "top 75%", delay: 0.2 } });
      gsap.from(".cta-btns",  { opacity: 0, y: 25, duration: 0.9, ease: "power3.out",  scrollTrigger: { trigger: ctaRef.current, start: "top 72%", delay: 0.35 } });

    }, mainRef);
    return () => ctx.revert();
  }, []);

  /* ── Ecosystem Data ── */
  const ecosystem = [
    { label: "Gaming PCs",   img: "/images/gaming_pc.png",     desc: "Liquid-cooled powerhouses",  accent: "#3B82F6", tag: "12 Models" },
    { label: "Laptops",      img: "/images/gaming_laptop.png", desc: "Ultra-portable beasts",       accent: "#7C3AED", tag: "8 Models" },
    { label: "RTX GPUs",     img: "/images/rtx_gpu.png",       desc: "Ray-tracing champions",       accent: "#06B6D4", tag: "16 Cards" },
    { label: "Processors",   img: "/images/cpu_chip.png",      desc: "AM5 & LGA1700 lineup",        accent: "#10B981", tag: "14 CPUs" },
    { label: "Motherboards", img: "/images/motherboard.png",   desc: "ATX to Mini-ITX boards",      accent: "#F59E0B", tag: "10 Boards" },
    { label: "Workstations", img: "/images/workstation_pc.png",desc: "Creator-grade rigs",          accent: "#EC4899", tag: "6 Systems" },
  ];

  const specCards = [
    { label: "VRAM",       value: "32 GB GDDR7",     icon: Layers,  color: "#3B82F6" },
    { label: "CUDA Cores", value: "21,760 Cores",    icon: Cpu,     color: "#7C3AED" },
    { label: "TDP",        value: "575W Full Load",  icon: Zap,     color: "#06B6D4" },
    { label: "PCIe",       value: "5.0 x16",         icon: Shield,  color: "#10B981" },
  ];

  const features = [
    { icon: Shield, color: "#3B82F6",  title: "Real-Time Compatibility",    desc: "Every part selection instantly cross-checks socket, TDP, form-factor, and PCIe generation. Zero mismatches." },
    { icon: Zap,    color: "#7C3AED",  title: "Dynamic Wattage Estimation", desc: "Live PSU load calculator with overhead buffer. Know your true power draw before you buy." },
    { icon: Award,  color: "#06B6D4",  title: "Community Blueprints",       desc: "Clone proven configurations from 50K+ builders. One click to load any rig into your configurator." },
  ];

  const communityBuilds = (COMMUNITY_BUILDS || []).slice(0, 6);
  const buildImgs = ["/images/gaming_pc.png","/images/rtx_gpu.png","/images/workstation_pc.png"];

  return (
    <div ref={mainRef} style={{ background: "#050816", color: "#fff" }} className="relative overflow-hidden">

      {/* Noise Texture */}
      <div className="noise-overlay" />

      {/* ══════════════════════════════════════════════════════════
          SECTION 1 — CINEMATIC HERO (6 Layers)
      ══════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ perspective: "1400px" }}>

        {/* LAYER 1 — Animated Gradient BG */}
        <div data-layer="1" className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124,58,237,0.18) 0%, rgba(11,17,32,0.95) 55%, #050816 100%)" }} />
          <div className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse 50% 40% at 80% 80%, rgba(59,130,246,0.12) 0%, transparent 60%)" }} />
          {/* Animated grid */}
          <div className="absolute inset-0 opacity-[0.045]"
            style={{ backgroundImage: "linear-gradient(rgba(124,58,237,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,0.4) 1px,transparent 1px)", backgroundSize: "70px 70px" }} />
        </div>

        {/* LAYER 2 — Particles */}
        <div data-layer="2" className="absolute inset-0 pointer-events-none opacity-70">
          <Particles count={90} />
        </div>

        {/* LAYER 3 — Light Streaks */}
        <div data-layer="3" className="absolute inset-0 pointer-events-none">
          <LightStreaks />
        </div>

        {/* LAYER 4 — Aurora Orbs */}
        <div data-layer="4" className="absolute inset-0 pointer-events-none">
          <div className="ao1 aurora-orb-1 absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full" />
          <div className="ao2 aurora-orb-2 absolute -bottom-32 -right-32 w-[750px] h-[750px] rounded-full" />
          <div className="ao3 aurora-orb-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full" />
          <div className="ao4 aurora-orb-4 absolute top-[20%] right-[15%] w-[300px] h-[300px] rounded-full" />
        </div>

        {/* LAYER 5 — Floating Hardware Images */}
        <div data-layer="5" className="absolute inset-0 pointer-events-none select-none">
          <img src="/images/rtx_gpu.png" alt="RTX GPU" loading="eager"
            className="img-gpu gsap-float absolute top-[6%] right-[3%] w-[250px] md:w-[330px] object-contain"
            style={{ filter: "drop-shadow(0 30px 70px rgba(59,130,246,0.45))", willChange: "transform" }}
          />
          <img src="/images/gaming_laptop.png" alt="Laptop" loading="eager"
            className="img-laptop gsap-float absolute bottom-[8%] left-[1%] w-[200px] md:w-[290px] object-contain"
            style={{ filter: "drop-shadow(0 30px 60px rgba(124,58,237,0.4))", willChange: "transform" }}
          />
          <img src="/images/cpu_chip.png" alt="CPU" loading="eager"
            className="img-cpu gsap-float absolute top-[35%] left-[6%] w-[110px] md:w-[150px] object-contain"
            style={{ filter: "drop-shadow(0 20px 40px rgba(6,182,212,0.5))", willChange: "transform" }}
          />
        </div>

        {/* LAYER 6 — Content */}
        <div data-layer="6" className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-28 pb-20">
          {/* Badge */}
          <div className="h-badge inline-flex items-center gap-2 px-4 py-2 rounded-full mb-10 text-xs font-bold uppercase tracking-[0.18em]"
            style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.3)", color: "#C4B5FD", backdropFilter: "blur(12px)" }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#7C3AED" }} />
            Next-Gen Hardware Platform 2026
          </div>

          {/* Headline */}
          <h1 className="text-[clamp(2.8rem,9vw,96px)] font-black tracking-[-0.04em] leading-[0.92] mb-8"
            style={{ perspective: "700px" }}>
            {["Build", "Your", "Dream", "Machine."].map((w, i) => (
              <span key={i} className="hw inline-block mr-[0.18em] last:mr-0" style={{ transformOrigin: "bottom center" }}>
                {i === 2
                  ? <span className="text-gradient-aurora">{w}</span>
                  : w
                }
              </span>
            ))}
          </h1>

          <p className="h-sub max-w-2xl mx-auto text-[1.1rem] leading-relaxed mb-12"
            style={{ color: "#94A3B8" }}>
            Configure, compare, and acquire elite gaming and workstation hardware.
            Real-time compatibility checks, AI wattage estimation, and community-driven builds.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <MagneticBtn
              to="/builder"
              className="h-cta inline-flex items-center gap-2.5 px-8 py-4 rounded-[14px] font-bold text-[15px] text-white cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #7C3AED, #3B82F6)",
                boxShadow: "0 0 50px rgba(124,58,237,0.45), 0 4px 24px rgba(0,0,0,0.5)",
                border: "1px solid rgba(124,58,237,0.5)",
              }}
            >
              <Sparkles className="w-5 h-5" /> Configure Your Build
            </MagneticBtn>
            <MagneticBtn
              to="/pcs"
              className="h-cta inline-flex items-center gap-2.5 px-8 py-4 rounded-[14px] font-bold text-[15px] text-white cursor-pointer"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}
            >
              Browse Systems <ArrowRight className="w-5 h-5" />
            </MagneticBtn>
          </div>

          {/* Trust line */}
          <div className="h-trust flex flex-wrap items-center justify-center gap-6 text-xs font-semibold" style={{ color: "#475569" }}>
            {["RTX 5090 Ready", "AM5 Platform", "DDR5 Support", "PCIe 5.0", "Wi-Fi 7"].map(b => (
              <span key={b} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#7C3AED" }} />{b}
              </span>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="h-scroll absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ color: "#334155" }}>
          <span className="text-[10px] uppercase tracking-widest font-bold">Scroll</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 2 — PINNED GPU SHOWCASE
      ══════════════════════════════════════════════════════════ */}
      <section ref={s2Ref} className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ background: "#050816" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(59,130,246,0.1) 0%, transparent 70%)" }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* GPU Visual */}
          <div className="relative flex items-center justify-center">
            <div className="sc-glow absolute w-[480px] h-[480px] rounded-full opacity-0 pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 65%)", filter: "blur(50px)" }} />
            <img src="/images/rtx_gpu.png" alt="RTX GPU" loading="lazy"
              className="sc-gpu relative z-10 w-full max-w-[420px] object-contain"
              style={{ filter: "drop-shadow(0 40px 90px rgba(59,130,246,0.5))", willChange: "transform" }}
            />
            {/* Orbit rings */}
            <div className="absolute w-[400px] h-[400px] rounded-full pointer-events-none animate-spin-slow"
              style={{ border: "1px solid rgba(124,58,237,0.2)" }} />
            <div className="absolute w-[320px] h-[320px] rounded-full pointer-events-none animate-spin-slow"
              style={{ border: "1px solid rgba(59,130,246,0.15)", animationDirection: "reverse", animationDuration: "15s" }} />
          </div>

          {/* Specs */}
          <div className="flex flex-col gap-7">
            <div>
              <EyeBrow>Flagship Hardware</EyeBrow>
              <h2 className="text-[clamp(2rem,4vw,52px)] font-black tracking-tight leading-tight">
                RTX 5090<br />
                <span className="text-gradient-violet">Blackwell Series</span>
              </h2>
            </div>

            <div className="flex flex-col gap-3">
              {specCards.map(s => (
                <div key={s.label} className="spec-card gsap-reveal flex items-center gap-4 p-4 rounded-2xl"
                  style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${s.color}30`, backdropFilter: "blur(12px)" }}>
                  <div className="p-2.5 rounded-xl" style={{ background: `${s.color}15` }}>
                    <s.icon className="w-5 h-5" style={{ color: s.color }} />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-widest font-bold block" style={{ color: "#475569" }}>{s.label}</span>
                    <span className="text-[15px] font-black text-white">{s.value}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {["Ray Tracing", "DLSS 4", "AV1 Encode", "8K Gaming", "AI Frames"].map(b => (
                <span key={b} className="sc-badge px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)", color: "#93C5FD" }}>
                  {b}
                </span>
              ))}
            </div>

            <MagneticBtn to="/components"
              className="sc-btn inline-flex items-center gap-2 text-sm font-bold text-white px-6 py-3.5 rounded-[14px] cursor-pointer w-fit transition-all"
              style={{ background: "linear-gradient(135deg,#7C3AED,#3B82F6)", boxShadow: "0 4px 24px rgba(124,58,237,0.35)" }}
            >
              Explore Full Catalog <ArrowRight className="w-4 h-4" />
            </MagneticBtn>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 3 — HORIZONTAL ECOSYSTEM SCROLL
      ══════════════════════════════════════════════════════════ */}
      <section ref={hScrollRef} className="relative overflow-hidden" style={{ background: "#0B1120" }}>
        <div className="max-w-7xl mx-auto px-6 pt-24 pb-10 text-center">
          <EyeBrow>Hardware Ecosystem</EyeBrow>
          <h2 className="text-[clamp(2rem,4vw,52px)] font-black tracking-tight">
            Every Component,{" "}
            <span className="text-gradient-cyan">One Platform</span>
          </h2>
          <p className="text-sm mt-4 max-w-md mx-auto" style={{ color: "#94A3B8" }}>
            Scroll horizontally through the full hardware lineup.
          </p>
        </div>

        <div className="overflow-hidden">
          <div ref={trackRef} className="flex gap-5 px-12 pb-16 pt-6" style={{ width: "max-content" }}>
            {ecosystem.map((item, i) => (
              <div key={i}
                className="flex-shrink-0 w-[290px] sm:w-[320px] group rounded-3xl p-6 flex flex-col justify-between cursor-pointer transition-all duration-400 hover:-translate-y-4"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${item.accent}22`,
                  backdropFilter: "blur(16px)",
                  boxShadow: `0 0 0 0 ${item.accent}00`,
                  transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = `${item.accent}40`;
                  e.currentTarget.style.boxShadow = `0 25px 60px -10px ${item.accent}25, 0 0 80px -20px ${item.accent}15`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = `${item.accent}22`;
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-full mb-4"
                    style={{ background: `${item.accent}12`, border: `1px solid ${item.accent}30`, color: item.accent }}>
                    <Package className="w-3 h-3" /> {item.tag}
                  </div>
                  <div className="h-44 flex items-center justify-center mb-4 rounded-2xl overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <img src={item.img} alt={item.label}
                      className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500"
                      style={{ filter: `drop-shadow(0 10px 30px ${item.accent}50)` }}
                    />
                  </div>
                  <h3 className="text-[18px] font-black mb-1" style={{ color: item.accent }}>{item.label}</h3>
                  <p className="text-sm" style={{ color: "#94A3B8" }}>{item.desc}</p>
                </div>
                <div className="pt-4 mt-4 flex items-center justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <span className="text-xs font-medium" style={{ color: "#475569" }}>Explore lineup</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" style={{ color: item.accent }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 4 — PERFORMANCE STATS
      ══════════════════════════════════════════════════════════ */}
      <section ref={statsRef} className="relative py-32 overflow-hidden" style={{ background: "#050816" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(124,58,237,0.08) 0%, transparent 70%)" }} />

        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <EyeBrow>Platform Metrics</EyeBrow>
            <h2 className="text-[clamp(2rem,4vw,52px)] font-black tracking-tight">
              Real-World <span className="text-gradient-aurora">Performance</span>
            </h2>
          </div>

          {/* Counters */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
            {[
              { label: "Builds Configured", val: 48000, suf: "+", icon: Cpu,   color: "#3B82F6" },
              { label: "Compatibility Rate", val: 98,    suf: "%", icon: Shield,color: "#10B981" },
              { label: "Community Members", val: 52000, suf: "+", icon: Users,  color: "#7C3AED" },
              { label: "Avg Rating",         val: 4,    suf: ".9★",icon: Star,  color: "#F59E0B", isFixed: true, fixed: "4.9★" },
            ].map(s => (
              <div key={s.label} className="stat-c gsap-reveal rounded-3xl p-6 flex flex-col gap-4"
                style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${s.color}25`, backdropFilter: "blur(14px)" }}>
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: `${s.color}15` }}>
                  <s.icon className="w-5 h-5" style={{ color: s.color }} />
                </div>
                <div>
                  <div className="text-[42px] font-black leading-none" style={{ color: s.color }}>
                    {s.isFixed ? s.fixed : <AnimatedCounter target={s.val} suffix={s.suf} />}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider mt-1.5" style={{ color: "#475569" }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Benchmark bars */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
            {[
              { label: "RTX 5090 — Cyberpunk 2077 (4K Ultra)", score: 183, max: 200, color: "#3B82F6", unit: "FPS" },
              { label: "Ryzen 7 7800X3D — Cinebench R24 Multi", score: 32, max: 40,  color: "#7C3AED", unit: "K pts" },
              { label: "PCIe 5.0 NVMe — Sequential Read",        score: 14, max: 16,  color: "#06B6D4", unit: "GB/s" },
              { label: "DDR5-7200 — Memory Bandwidth",            score: 89, max: 100, color: "#10B981", unit: "GB/s" },
            ].map(b => (
              <div key={b.label} className="flex flex-col gap-2.5">
                <div className="flex justify-between text-xs font-bold">
                  <span style={{ color: "#94A3B8" }}>{b.label}</span>
                  <span style={{ color: b.color }}>{b.score} {b.unit}</span>
                </div>
                <div className="w-full rounded-full h-2.5 overflow-hidden" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="bench-fill h-full rounded-full"
                    style={{ width: `${(b.score / b.max) * 100}%`, background: `linear-gradient(90deg, ${b.color}, ${b.color}bb)`, boxShadow: `0 0 12px ${b.color}60` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 5 — PREMIUM BUILD EXPERIENCE
      ══════════════════════════════════════════════════════════ */}
      <section ref={buildRef} className="relative py-32 overflow-hidden" style={{ background: "#0B1120" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px]"
            style={{ background: "radial-gradient(circle,rgba(124,58,237,0.1) 0%,transparent 70%)", filter: "blur(60px)" }} />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px]"
            style={{ background: "radial-gradient(circle,rgba(59,130,246,0.08) 0%,transparent 70%)", filter: "blur(60px)" }} />
        </div>

        {/* Floating BG hardware */}
        <img src="/images/motherboard.png" aria-hidden alt=""
          className="absolute -right-20 top-10 w-[360px] pointer-events-none select-none object-contain animate-float"
          style={{ opacity: 0.06, willChange: "transform" }}
        />
        <img src="/images/cpu_chip.png" aria-hidden alt=""
          className="absolute -left-12 bottom-10 w-[240px] pointer-events-none select-none object-contain animate-float-reverse"
          style={{ opacity: 0.06, willChange: "transform" }}
        />

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Features list */}
            <div className="flex flex-col gap-10">
              <div className="bl-feat">
                <EyeBrow>The Build Experience</EyeBrow>
                <h2 className="text-[clamp(2rem,4vw,52px)] font-black tracking-tight leading-[1.1]">
                  Intelligent<br />
                  <span className="text-gradient-aurora">Compatibility Engine</span>
                </h2>
              </div>

              {features.map((f, i) => (
                <div key={i} className="bl-feat gsap-reveal flex gap-5">
                  <div className="p-3 rounded-2xl shrink-0 h-fit" style={{ background: `${f.color}14`, border: `1px solid ${f.color}30` }}>
                    <f.icon className="w-5 h-5" style={{ color: f.color }} />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white mb-1">{f.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#94A3B8" }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stacked images */}
            <div className="bl-imgs relative h-[480px] hidden lg:block">
              <img src="/images/gaming_pc.png" alt="Gaming PC"
                className="absolute right-0 top-0 w-72 object-contain animate-float"
                style={{ filter: "drop-shadow(0 30px 70px rgba(59,130,246,0.45))", willChange: "transform" }}
              />
              <img src="/images/rtx_gpu.png" alt="RTX GPU"
                className="absolute left-0 bottom-10 w-60 object-contain animate-float-reverse"
                style={{ filter: "drop-shadow(0 20px 50px rgba(124,58,237,0.45))", willChange: "transform" }}
              />
              <div className="absolute top-28 right-16 w-52 h-52 rounded-full"
                style={{ background: "radial-gradient(circle,rgba(59,130,246,0.25),transparent)", filter: "blur(30px)" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 6 — COMMUNITY SHOWCASE
      ══════════════════════════════════════════════════════════ */}
      <section ref={commRef} className="relative py-32 overflow-hidden" style={{ background: "#050816" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-16">
            <div>
              <EyeBrow>Community Gallery</EyeBrow>
              <h2 className="text-[clamp(2rem,4vw,52px)] font-black tracking-tight">
                Built by{" "}
                <span className="text-gradient-violet">Enthusiasts</span>
              </h2>
            </div>
            <Link to="/community"
              className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all hover:-translate-y-1"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#94A3B8" }}>
              View All Rigs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Masonry grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
            {(communityBuilds.length > 0 ? communityBuilds : Array.from({ length: 6 }, (_, i) => ({
              id: `ph-${i}`, author: "Builder", date: "2026-06-01", category: "gaming",
              name: "Custom Rig", description: "A premium custom build.", avatar: "",
              totalPrice: 150000, upvotes: 42,
            }))).map((build, idx) => (
              <div key={build.id}
                className="comm-card gsap-reveal break-inside-avoid rounded-3xl p-6 group cursor-pointer transition-all duration-400 hover:-translate-y-2"
                style={{
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
                  backdropFilter: "blur(16px)",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(124,58,237,0.3)"; e.currentTarget.style.boxShadow = "0 25px 60px -10px rgba(124,58,237,0.15)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <img src={build.avatar || `https://i.pravatar.cc/40?img=${idx + 1}`} alt={build.author}
                    className="w-8 h-8 rounded-full object-cover" style={{ border: "1px solid rgba(255,255,255,0.12)" }} />
                  <div>
                    <div className="text-xs font-bold text-white">{build.author}</div>
                    <div className="text-[10px]" style={{ color: "#475569" }}>{build.date}</div>
                  </div>
                  <span className="ml-auto text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                    style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)", color: "#C4B5FD" }}>
                    {build.category}
                  </span>
                </div>

                <div className="h-40 rounded-2xl overflow-hidden flex items-center justify-center mb-4"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <img src={buildImgs[idx % 3]} alt={build.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-108 transition-transform duration-500"
                    style={{ filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.5))" }}
                  />
                </div>

                <h3 className="text-[15px] font-black text-white group-hover:text-violet-300 transition-colors mb-1">{build.name}</h3>
                <p className="text-xs leading-relaxed line-clamp-2 mb-4" style={{ color: "#94A3B8" }}>{build.description}</p>

                <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <span className="text-[15px] font-black text-white">₹{build.totalPrice?.toLocaleString("en-IN")}</span>
                  <div className="flex items-center gap-1 text-xs font-bold" style={{ color: "#94A3B8" }}>
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /> {build.upvotes}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 7 — CINEMATIC CTA
      ══════════════════════════════════════════════════════════ */}
      <section ref={ctaRef} className="relative py-44 overflow-hidden" style={{ background: "#0B1120" }}>
        {/* Massive glows */}
        <div className="cta-orb absolute top-[-30%] left-[-15%] w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(124,58,237,0.22) 0%,transparent 65%)", filter: "blur(70px)" }} />
        <div className="cta-orb absolute bottom-[-30%] right-[-15%] w-[800px] h-[800px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(59,130,246,0.18) 0%,transparent 65%)", filter: "blur(90px)" }} />
        <div className="cta-orb absolute top-[35%] right-[25%] w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(6,182,212,0.14) 0%,transparent 65%)", filter: "blur(60px)" }} />

        {/* Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(rgba(124,58,237,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,0.5) 1px,transparent 1px)", backgroundSize: "50px 50px" }} />

        {/* Floating hardware */}
        <img src="/images/gaming_pc.png" aria-hidden alt="" className="absolute left-[4%] top-1/2 -translate-y-1/2 w-[280px] pointer-events-none select-none object-contain animate-float"
          style={{ opacity: 0.05, filter: "blur(3px)", willChange: "transform" }} />
        <img src="/images/gaming_laptop.png" aria-hidden alt="" className="absolute right-[4%] top-1/2 -translate-y-1/2 w-[260px] pointer-events-none select-none object-contain animate-float-reverse"
          style={{ opacity: 0.05, filter: "blur(3px)", willChange: "transform" }} />

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <div className="cta-head inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[0.18em] mb-10"
            style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.28)", color: "#C4B5FD", backdropFilter: "blur(12px)" }}>
            <Sparkles className="w-3.5 h-3.5" /> Start Configuring Today — Free
          </div>

          <h2 className="cta-head text-[clamp(3rem,9vw,96px)] font-black tracking-[-0.04em] leading-[0.9] mb-8">
            Your Perfect<br />
            <span className="text-gradient-aurora">Rig Awaits.</span>
          </h2>

          <p className="cta-sub max-w-xl mx-auto text-[1.1rem] leading-relaxed mb-14" style={{ color: "#94A3B8" }}>
            Join 50,000+ builders who configured their dream machines with IC PC's.
            Zero compromises. Full compatibility. Premium hardware.
          </p>

          <div className="cta-btns flex flex-col sm:flex-row items-center justify-center gap-5">
            <MagneticBtn to="/builder"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-[16px] font-black text-lg text-white cursor-pointer"
              style={{
                background: "linear-gradient(135deg,#7C3AED,#3B82F6,#7C3AED)",
                backgroundSize: "200% auto", animation: "shine 3s linear infinite",
                boxShadow: "0 0 70px rgba(124,58,237,0.5), 0 0 140px rgba(124,58,237,0.2), 0 4px 30px rgba(0,0,0,0.6)",
                border: "1px solid rgba(124,58,237,0.5)",
              }}
            >
              <Sparkles className="w-5 h-5" /> Configure Free
            </MagneticBtn>
            <MagneticBtn to="/community"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-[16px] font-bold text-lg text-white cursor-pointer"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}
            >
              <Users className="w-5 h-5" /> Explore Community
            </MagneticBtn>
          </div>

          {/* Trust row */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-xs font-semibold" style={{ color: "#334155" }}>
            {[
              { icon: Shield, text: "No credit card required" },
              { icon: Zap,    text: "Instant results" },
              { icon: Users,  text: "50K+ builders" },
              { icon: Star,   text: "4.9★ rating" },
            ].map(item => (
              <span key={item.text} className="flex items-center gap-2">
                <item.icon className="w-4 h-4" style={{ color: "#7C3AED" }} />
                {item.text}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

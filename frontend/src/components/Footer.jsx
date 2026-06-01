import React from "react";
import { Link } from "react-router-dom";
import { Cpu, Github, Twitter, MessageSquare, Shield, HelpCircle, Zap } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  const cols = [
    {
      title: "Product",
      links: [
        { label: "PC Configurator",      to: "/builder" },
        { label: "Components Database",  to: "/components" },
        { label: "Side-by-Side Compare", to: "/compare" },
        { label: "FPS Estimator",        to: "/" },
      ],
    },
    {
      title: "Community",
      links: [
        { label: "Explore Builds",    to: "/community" },
        { label: "Share Your Rig",    to: "/builder" },
        { label: "Global Leaderboards", href: "#" },
        { label: "Build Guides",        href: "#" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "FAQs & Knowledge Base", href: "#", icon: HelpCircle },
        { label: "Privacy Policy",         href: "#", icon: Shield },
        { label: "Terms of Service",       href: "#" },
        { label: "Contact Engineering",    href: "#" },
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden pt-20 pb-12 px-6 md:px-12"
      style={{ background: "#0B1120", borderTop: "1px solid rgba(255,255,255,0.07)" }}>

      {/* Ambient glow */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(124,58,237,0.06) 0%,transparent 70%)", filter: "blur(80px)" }} />
      <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(59,130,246,0.05) 0%,transparent 70%)", filter: "blur(80px)" }} />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-14 relative z-10">
        {/* Brand */}
        <div className="flex flex-col gap-5">
          <Link to="/" className="flex items-center gap-2.5 group w-fit">
            <div className="p-2 rounded-xl transition-transform group-hover:scale-110"
              style={{ background: "linear-gradient(135deg,#7C3AED,#3B82F6)", boxShadow: "0 0 20px rgba(124,58,237,0.4)" }}>
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <span className="text-[18px] font-black">
              IC{" "}
              <span style={{ background: "linear-gradient(90deg,#7C3AED,#3B82F6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                PC's
              </span>
            </span>
          </Link>

          <p className="text-sm leading-relaxed max-w-[220px]" style={{ color: "#94A3B8" }}>
            Next-generation custom PC configuration. Compatibility checks, performance estimation, and premium hardware curation.
          </p>

          <div className="flex items-center gap-3">
            {[
              { icon: Github,         href: "https://github.com" },
              { icon: Twitter,        href: "https://twitter.com" },
              { icon: MessageSquare,  href: "https://discord.com" },
            ].map(({ icon: Icon, href }) => (
              <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-xl transition-all hover:-translate-y-1 hover:scale-110"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)", color: "#94A3B8" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(124,58,237,0.35)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#94A3B8"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>

          {/* Status badge */}
          <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-3 py-2 rounded-xl w-fit"
            style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#34D399" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            All Systems Operational
          </div>
        </div>

        {/* Link Columns */}
        {cols.map((col) => (
          <div key={col.title}>
            <h4 className="text-[10px] font-black uppercase tracking-[0.18em] mb-6" style={{ color: "#475569" }}>
              {col.title}
            </h4>
            <ul className="flex flex-col gap-4">
              {col.links.map((link) => {
                const content = (
                  <span className="text-sm flex items-center gap-2 transition-colors"
                    style={{ color: "#94A3B8" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#FFFFFF"}
                    onMouseLeave={e => e.currentTarget.style.color = "#94A3B8"}
                  >
                    {link.icon && <link.icon className="w-3.5 h-3.5 shrink-0" style={{ color: "#7C3AED" }} />}
                    {link.label}
                  </span>
                );
                return (
                  <li key={link.label}>
                    {link.to
                      ? <Link to={link.to}>{content}</Link>
                      : <a href={link.href || "#"}>{content}</a>
                    }
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <p className="text-xs" style={{ color: "#334155" }}>
          © {year} IC PC's Inc. All rights reserved. Built with pride for gaming and workstation enthusiasts worldwide.
        </p>
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest" style={{ color: "#334155" }}>
          <Zap className="w-3.5 h-3.5" style={{ color: "#7C3AED" }} />
          Powered by IC PC's Engine v2.0
        </div>
        <div className="flex gap-6 text-xs" style={{ color: "#334155" }}>
          {["Privacy", "Cookies", "Security"].map(t => (
            <a key={t} href="#"
              onMouseEnter={e => e.currentTarget.style.color = "#94A3B8"}
              onMouseLeave={e => e.currentTarget.style.color = "#334155"}
            >{t}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Cpu, Menu, X, LogOut, LayoutDashboard, Zap } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useToastStore } from "../store/toastStore";
import gsap from "gsap";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const addToast = useToastStore((s) => s.addToast);
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef(null);
  const innerRef = useRef(null);
  const lastY = useRef(0);
  const hidden = useRef(false);

  /* ── GSAP Scroll Shrink + Hide/Show ── */
  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    const onScroll = () => {
      const y = window.scrollY;
      const dir = y > lastY.current ? "down" : "up";
      lastY.current = y;

      // Shrink/deepen on scroll
      if (y > 50) {
        gsap.to(el, {
          paddingTop: 6, paddingBottom: 6,
          boxShadow: "0 4px 40px rgba(0,0,0,0.7), 0 0 80px rgba(124,58,237,0.06)",
          duration: 0.4, ease: "power2.out",
        });
        el.style.background = "rgba(5,8,22,0.92)";
        el.style.backdropFilter = "blur(32px) saturate(200%)";
      } else {
        gsap.to(el, {
          paddingTop: 12, paddingBottom: 12,
          boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
          duration: 0.4, ease: "power2.out",
        });
        el.style.background = "rgba(11,17,32,0.65)";
        el.style.backdropFilter = "blur(20px) saturate(160%)";
      }

      // Hide on scroll down (past 150px), reveal on up
      if (dir === "down" && y > 150 && !hidden.current) {
        hidden.current = true;
        gsap.to(navRef.current, { y: -120, duration: 0.45, ease: "power2.in" });
      } else if (dir === "up" && hidden.current) {
        hidden.current = false;
        gsap.to(navRef.current, { y: 0, duration: 0.5, ease: "power2.out" });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    addToast("Logged out successfully.", "info");
    navigate("/");
  };

  const links = [
    { name: "PCs",        path: "/pcs" },
    { name: "Laptops",    path: "/laptops" },
    { name: "Builder",    path: "/builder" },
    { name: "Components", path: "/components" },
    { name: "Community",  path: "/community" },
    { name: "Compare",    path: "/compare" },
  ];

  const isActive = (p) => location.pathname === p;

  return (
    <nav ref={navRef} className="sticky top-0 z-50 px-4 md:px-8 py-3" style={{ willChange: "transform" }}>
      <div
        ref={innerRef}
        className="max-w-7xl mx-auto flex items-center justify-between px-5 rounded-2xl transition-colors duration-300"
        style={{
          background: "rgba(11,17,32,0.65)",
          backdropFilter: "blur(20px) saturate(160%)",
          WebkitBackdropFilter: "blur(20px) saturate(160%)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
          paddingTop: 12,
          paddingBottom: 12,
        }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div
            className="p-2 rounded-xl group-hover:scale-110 transition-transform duration-300"
            style={{
              background: "linear-gradient(135deg,#7C3AED,#3B82F6)",
              boxShadow: "0 0 20px rgba(124,58,237,0.5), 0 0 40px rgba(124,58,237,0.15)",
            }}
          >
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <span className="text-[18px] font-black tracking-tight">
            IC{" "}
            <span style={{
              background: "linear-gradient(90deg,#7C3AED,#3B82F6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              PC's
            </span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <Link
              key={l.name}
              to={l.path}
              className="text-sm font-semibold relative group transition-colors duration-200"
              style={{ color: isActive(l.path) ? "#A78BFA" : "#94A3B8" }}
              onMouseEnter={e => { if (!isActive(l.path)) e.currentTarget.style.color = "#FFFFFF"; }}
              onMouseLeave={e => { if (!isActive(l.path)) e.currentTarget.style.color = "#94A3B8"; }}
            >
              {l.name}
              <span
                className="absolute -bottom-1 left-0 h-[2px] rounded-full transition-all duration-300"
                style={{
                  width: isActive(l.path) ? "100%" : "0",
                  background: "linear-gradient(90deg,#7C3AED,#3B82F6)",
                }}
              />
            </Link>
          ))}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl transition-all hover:-translate-y-0.5"
                style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.25)", color: "#C4B5FD" }}
              >
                <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
              </Link>
              <div className="flex items-center gap-2 px-2 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <img
                  src={user.avatar || `https://i.pravatar.cc/40?u=${user.username}`}
                  alt="Avatar"
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="text-xs text-white font-semibold pr-1">{user.username}</span>
              </div>
              <button onClick={handleLogout} title="Logout"
                className="p-2 rounded-lg transition-colors hover:bg-red-500/10"
                style={{ color: "#475569" }}
                onMouseEnter={e => e.currentTarget.style.color = "#F87171"}
                onMouseLeave={e => e.currentTarget.style.color = "#475569"}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <Link to="/auth/login"
                className="text-sm font-semibold px-3 py-2 transition-colors"
                style={{ color: "#94A3B8" }}
                onMouseEnter={e => e.currentTarget.style.color = "#FFFFFF"}
                onMouseLeave={e => e.currentTarget.style.color = "#94A3B8"}
              >
                Login
              </Link>
              <Link
                to="/auth/register"
                className="text-sm font-bold px-5 py-2.5 rounded-[12px] text-white transition-all hover:scale-105 hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(135deg,#7C3AED,#3B82F6)",
                  boxShadow: "0 4px 20px rgba(124,58,237,0.4)",
                  border: "1px solid rgba(124,58,237,0.4)",
                }}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden flex items-center gap-3">
          {user && (
            <Link to="/dashboard" className="p-2" style={{ color: "#94A3B8" }}>
              <LayoutDashboard className="w-5 h-5" />
            </Link>
          )}
          <button onClick={() => setIsOpen(!isOpen)} className="p-2 transition-colors"
            style={{ color: "#94A3B8" }}>
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div
          className="md:hidden mt-2 rounded-2xl px-4 py-5 flex flex-col gap-4"
          style={{ background: "rgba(5,8,22,0.97)", backdropFilter: "blur(32px)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="flex flex-col gap-1">
            {links.map(l => (
              <Link key={l.name} to={l.path} onClick={() => setIsOpen(false)}
                className="text-sm font-semibold py-3 px-3 rounded-xl transition-all"
                style={{
                  color: isActive(l.path) ? "#C4B5FD" : "#94A3B8",
                  background: isActive(l.path) ? "rgba(124,58,237,0.1)" : "transparent",
                }}
              >
                {l.name}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            {user ? (
              <>
                <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <img src={user.avatar || `https://i.pravatar.cc/40?u=${user.username}`} alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <div className="text-sm font-bold text-white">{user.username}</div>
                    <div className="text-xs" style={{ color: "#475569" }}>{user.email}</div>
                  </div>
                </div>
                <button onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all"
                  style={{ border: "1px solid rgba(239,68,68,0.25)", color: "#F87171" }}>
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/auth/login" onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center py-3 rounded-xl font-semibold text-sm"
                  style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#94A3B8" }}>
                  Login
                </Link>
                <Link to="/auth/register" onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center py-3 rounded-xl font-bold text-sm text-white"
                  style={{ background: "linear-gradient(135deg,#7C3AED,#3B82F6)" }}>
                  Sign Up Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

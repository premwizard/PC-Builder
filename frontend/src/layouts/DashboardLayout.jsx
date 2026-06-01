import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, User } from "lucide-react";
import { useAuthStore } from "../store/authStore";

export default function DashboardLayout() {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  const menuItems = [
    { name: "My Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Profile Settings", path: "/profile", icon: User },
  ];

  const isLinkActive = (path) => location.pathname === path;

  // Resolve dynamic user info
  const displayName = user ? user.fullName || user.username : "Alex Mercer";
  const displaySub = user ? `@${user.username}` : "Elite PC Builder";
  const displayAvatar = user ? user.avatar : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80";

  return (
    <div className="max-w-7xl mx-auto w-full px-6 py-12 flex flex-col md:flex-row gap-8">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 shrink-0 flex flex-col gap-6">
        <div className="bg-glass rounded-2xl p-6 border border-white/5 flex flex-col gap-4">
          <div className="flex flex-col items-center text-center pb-6 border-b border-white/5">
            <div className="relative">
              <img
                src={displayAvatar}
                alt="Profile Avatar"
                className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-zinc-950 rounded-full" />
            </div>
            <h3 className="text-white font-semibold mt-3">{displayName}</h3>
            <span className="text-xs text-zinc-400">{displaySub}</span>
          </div>

          <nav className="flex flex-col gap-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isLinkActive(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                      : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Quick System Status Card */}
        <div className="hidden md:block bg-zinc-900/40 rounded-2xl p-6 border border-white/5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">System status</h4>
          <div className="flex flex-col gap-3 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-400">Build Counter</span>
              <span className="text-white font-medium">3 Configs</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Rank</span>
              <span className="text-blue-400 font-semibold">Pro Configurator</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-1 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-violet-500 h-full rounded-full w-2/3" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}

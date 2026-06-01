import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Cpu, Trash2, ArrowRight, Eye, Calendar, Sparkles } from "lucide-react";
import { useAuthStore } from "../store/authStore";

export default function Dashboard() {
  const [savedBuilds, setSavedBuilds] = useState([]);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const list = localStorage.getItem("icpcs_saved_builds");
    if (list) {
      setSavedBuilds(JSON.parse(list));
    }
  }, []);

  const handleDeleteBuild = (id) => {
    const updated = savedBuilds.filter((b) => b.id !== id);
    setSavedBuilds(updated);
    localStorage.setItem("icpcs_saved_builds", JSON.stringify(updated));
  };

  // Calculate statistics
  const totalDrafts = savedBuilds.length;
  const avgCost = totalDrafts
    ? savedBuilds.reduce((sum, b) => sum + b.totalPrice, 0) / totalDrafts
    : 0;

  const mockActivities = [
    { text: "Configured parts compatibility clearance checklist", time: "Just now" },
    { text: "Ran simulated bottleneck check on Ryzen 7 7800X3D + RTX 4080 Super", time: "2 hours ago" },
    { text: "Upvoted 'Frostbite Gaming Concept' community build", time: "1 day ago" },
  ];

  const welcomeName = user ? user.username : "Alex";

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-950/20 to-violet-950/20 rounded-3xl p-6 border border-blue-500/10 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Welcome back, {welcomeName} <Sparkles className="w-4 h-4 text-blue-400" />
          </h2>
          <p className="text-xs text-zinc-400 mt-1">Configure, optimize and track your gaming configurations.</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-glass rounded-2xl p-5 border border-white/5">
          <span className="text-[10px] uppercase font-bold text-zinc-500 block">Saved Builds</span>
          <span className="text-3xl font-black text-white mt-1 block">{totalDrafts}</span>
        </div>
        <div className="bg-glass rounded-2xl p-5 border border-white/5">
          <span className="text-[10px] uppercase font-bold text-zinc-500 block">Average Rig Cost</span>
          <span className="text-3xl font-black text-white mt-1 block">
            ₹{Math.round(avgCost).toLocaleString("en-IN")}
          </span>
        </div>
        <div className="bg-glass rounded-2xl p-5 border border-white/5">
          <span className="text-[10px] uppercase font-bold text-zinc-500 block">Current rank</span>
          <span className="text-3xl font-black text-blue-400 mt-1 block">Pro Builder</span>
        </div>
      </div>

      {/* Content Columns: Configurations on left, recent logs on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Saved Builds Catalog */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Saved Configurations</h3>

          {savedBuilds.length > 0 ? (
            <div className="flex flex-col gap-4">
              {savedBuilds.map((build) => (
                <div
                  key={build.id}
                  className="bg-glass rounded-2xl p-5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-zinc-900 border border-white/5 rounded-xl text-blue-400">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{build.name}</h4>
                      <span className="text-[10px] text-zinc-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3.5 h-3.5" /> Saved: {build.date}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 ml-auto sm:ml-0">
                    <span className="text-sm font-black text-white">₹{build.totalPrice.toLocaleString("en-IN")}</span>
                    <div className="flex gap-2">
                      <Link
                        to={`/build/${build.id}`}
                        className="p-2.5 border border-white/10 hover:border-white/20 text-zinc-400 hover:text-white rounded-xl bg-white/5 transition-colors"
                        title="Review specs"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteBuild(build.id)}
                        className="p-2.5 border border-red-500/10 hover:border-red-500/20 text-zinc-500 hover:text-red-400 bg-red-950/5 rounded-xl transition-colors"
                        title="Delete draft"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-glass border border-white/5 rounded-3xl p-8 text-center">
              <span className="text-sm font-medium text-zinc-500 block">No draft configurations saved.</span>
              <Link
                to="/builder"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:underline mt-3"
              >
                Go configure a new PC <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Recent logs */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Recent activity</h3>
          <div className="bg-glass rounded-3xl p-6 border border-white/5 flex flex-col gap-4">
            {mockActivities.map((act, idx) => (
              <div key={idx} className="flex flex-col gap-1 text-xs">
                <span className="text-white leading-relaxed">{act.text}</span>
                <span className="text-zinc-500 text-[10px]">{act.time}</span>
                {idx !== mockActivities.length - 1 && <div className="h-[1px] bg-white/5 mt-3" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

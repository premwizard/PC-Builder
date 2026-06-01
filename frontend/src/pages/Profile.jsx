import React, { useState, useEffect } from "react";
import { User, Mail, ShieldAlert, Award } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useToastStore } from "../store/toastStore";

export default function Profile() {
  const { user, updateProfile } = useAuthStore();
  const addToast = useToastStore((state) => state.addToast);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    preferredBrand: "NVIDIA",
    primaryUse: "gaming",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        username: user.username || "",
        preferredBrand: user.preferredBrand || "NVIDIA",
        primaryUse: user.primaryUse || "gaming",
      });
    }
  }, [user]);

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(formData);
    addToast("Profile settings saved successfully!", "success");
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="pb-6 border-b border-white/5">
        <h2 className="text-xl font-bold text-white">Profile Configurations</h2>
        <p className="text-xs text-zinc-400 mt-1">Manage your account information and builder configurations settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Settings Form */}
        <form onSubmit={handleSave} className="lg:col-span-8 bg-glass rounded-3xl p-6 border border-white/5 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col gap-2 sm:col-span-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Preferred Hardware Brand</label>
              <select
                value={formData.preferredBrand}
                onChange={(e) => setFormData({ ...formData, preferredBrand: e.target.value })}
                className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="NVIDIA">NVIDIA</option>
                <option value="AMD">AMD</option>
                <option value="Intel">Intel</option>
                <option value="ASUS">ASUS</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Primary System Purpose</label>
              <select
                value={formData.primaryUse}
                onChange={(e) => setFormData({ ...formData, primaryUse: e.target.value })}
                className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="gaming">Gaming & Streaming</option>
                <option value="workstation">3D Rendering / Video Editing</option>
                <option value="coding">Software Development</option>
                <option value="budget">Everyday Office Use</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-fit px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-center font-semibold transition-colors mt-4"
          >
            Save Profile Settings
          </button>
        </form>

        {/* Info Column */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-glass rounded-3xl p-6 border border-white/5 flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
              <Award className="w-4 h-4 text-blue-500" /> Member Badges
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] font-bold bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1.5 rounded-full">
                Early Adopter
              </span>
              <span className="text-[10px] font-bold bg-violet-500/10 border border-violet-500/20 text-violet-400 px-3 py-1.5 rounded-full">
                100+ Compatibility Rules
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

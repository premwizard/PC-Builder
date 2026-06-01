import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Cpu, Mail, Lock, User, ArrowRight } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useToastStore } from "../store/toastStore";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const addToast = useToastStore((state) => state.addToast);

  const handleRegister = (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      addToast("Please fill in all fields.", "warning");
      return;
    }

    register(username, email, password);
    addToast("Successfully registered your account!", "success");
    navigate("/dashboard");
  };

  return (
    <div className="flex-1 flex items-center justify-center py-20 px-6 relative overflow-hidden bg-zinc-950">
      {/* Aurora glow backdrops */}
      <div className="absolute top-[30%] left-[20%] w-[400px] h-[400px] aurora-glow-1 rounded-full pointer-events-none" />
      <div className="absolute bottom-[30%] right-[20%] w-[400px] h-[400px] aurora-glow-2 rounded-full pointer-events-none" />

      <div className="max-w-md w-full bg-glass rounded-3xl p-8 border border-white/5 shadow-2xl relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="p-3 bg-gradient-to-tr from-blue-600 to-violet-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/20">
            <Cpu className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white">Create Account</h2>
          <p className="text-xs text-zinc-400 mt-1">Join a community of system builders and enthusiasts.</p>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2 relative">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="builder_pro"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-900 border border-white/5 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 relative">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-900 border border-white/5 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 relative">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-900 border border-white/5 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-center font-semibold transition-all flex items-center justify-center gap-2 mt-2 shadow-lg shadow-blue-500/20"
          >
            Create Free Account
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-zinc-400">
          Already have an account?{" "}
          <Link to="/auth/login" className="text-blue-400 font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

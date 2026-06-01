import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Cpu, Mail, Lock, ArrowRight, ShieldAlert } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useToastStore } from "../store/toastStore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const addToast = useToastStore((state) => state.addToast);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast("Please fill in all fields.", "warning");
      return;
    }

    login(email, password);
    addToast("Successfully logged in!", "success");
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
          <h2 className="text-2xl font-black text-white">Welcome Back</h2>
          <p className="text-xs text-zinc-400 mt-1">Configure your builds with automated compatibility checks.</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
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
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Password</label>
              <a href="#" className="text-[10px] text-blue-400 font-bold hover:underline">Forgot password?</a>
            </div>
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
            Sign In
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-zinc-400">
          Don't have an account?{" "}
          <Link to="/auth/register" className="text-blue-400 font-bold hover:underline">
            Register for free
          </Link>
        </div>
      </div>
    </div>
  );
}

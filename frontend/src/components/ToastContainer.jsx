import React from "react";
import { CheckCircle, AlertTriangle, XCircle, Info, X } from "lucide-react";
import { useToastStore } from "../store/toastStore";
import { motion, AnimatePresence } from "framer-motion";

const toastIcons = {
  success: <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
  error: <XCircle className="w-5 h-5 text-rose-400 shrink-0" />,
  info: <Info className="w-5 h-5 text-blue-400 shrink-0" />,
};

const toastBorderColors = {
  success: "border-l-emerald-500",
  warning: "border-l-amber-500",
  error: "border-l-rose-500",
  info: "border-l-blue-500",
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className={`pointer-events-auto bg-zinc-950/85 backdrop-blur-md border border-white/5 border-l-4 ${toastBorderColors[toast.type] || "border-l-blue-500"} p-4 rounded-xl shadow-2xl flex items-start gap-3 relative overflow-hidden`}
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-white/[0.01] pointer-events-none" />
            
            {toastIcons[toast.type] || toastIcons.info}
            
            <div className="flex-1 text-left text-xs font-medium text-zinc-200 pr-4 leading-relaxed">
              {toast.message}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

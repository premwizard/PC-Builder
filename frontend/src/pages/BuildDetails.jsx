import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { COMMUNITY_BUILDS, COMPONENTS } from "../services/mockData";
import { useBuilderStore } from "../store/builderStore";
import { useToastStore } from "../store/toastStore";
import { Cpu, ArrowLeft, Layers, Pocket, HardDrive, ShieldCheck, Copy } from "lucide-react";

export default function BuildDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addPart = useBuilderStore((state) => state.addPart);
  const addToast = useToastStore((state) => state.addToast);

  // Find build in mock data or local storage
  let build = COMMUNITY_BUILDS.find((b) => b.id === id);

  if (!build) {
    const savedList = localStorage.getItem("icpcs_saved_builds");
    const currentBuilds = savedList ? JSON.parse(savedList) : [];
    build = currentBuilds.find((b) => b.id === id);
  }

  if (!build) {
    return (
      <div className="max-w-7xl mx-auto w-full px-6 py-24 text-center z-10 relative">
        <h2 className="text-xl font-bold text-white mb-2">Build Not Found</h2>
        <p className="text-sm text-zinc-400 mb-6">The build profile you requested does not exist or has been deleted.</p>
        <Link to="/community" className="text-blue-500 hover:underline font-semibold">
          Back to Community
        </Link>
      </div>
    );
  }

  // Map build item strings to mock COMPONENTS objects to fetch full details if possible
  const getComponentObj = (category) => {
    if (build.parts && build.parts[category]) {
      return build.parts[category];
    }

    const mockKey = category === "motherboard" ? "mobo" : category === "case" ? "casePart" : category;
    const partName = build[mockKey];
    if (!partName) return null;

    const found = COMPONENTS.find((c) => c.name.toLowerCase().includes(partName.toLowerCase()) || partName.toLowerCase().includes(c.name.toLowerCase()));
    if (found) return found;

    return {
      id: `${category}-fallback`,
      name: partName,
      price: category === "cpu" ? 34999 : category === "gpu" ? 104999 : category === "motherboard" ? 21999 : 12000,
      brand: "Premium Manufacturer",
      specs: {},
    };
  };

  const parts = [
    { label: "Processor (CPU)", category: "cpu", obj: getComponentObj("cpu"), icon: Cpu },
    { label: "Graphics Card (GPU)", category: "gpu", obj: getComponentObj("gpu"), icon: Layers },
    { label: "Motherboard", category: "motherboard", obj: getComponentObj("motherboard"), icon: Layers },
    { label: "Memory (RAM)", category: "ram", obj: getComponentObj("ram"), icon: Layers },
    { label: "Storage", category: "storage", obj: getComponentObj("storage"), icon: HardDrive },
    { label: "Power Supply (PSU)", category: "psu", obj: getComponentObj("psu"), icon: Pocket },
    { label: "Case", category: "case", obj: getComponentObj("case"), icon: Pocket },
    { label: "CPU Cooler", category: "cooler", obj: getComponentObj("cooler"), icon: Cpu },
  ];

  const handleCloneBuild = () => {
    parts.forEach((part) => {
      if (part.obj && part.obj.id) {
        addPart(part.category, part.obj);
      }
    });
    addToast("Configuration cloned successfully!", "success");
    navigate("/builder");
  };

  return (
    <div className="max-w-5xl mx-auto w-full px-6 py-12 relative z-10">
      {/* Back Link */}
      <Link to="/community" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-semibold mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to Community Builds
      </Link>

      {/* Main Profile Header Card */}
      <div className="bg-glass rounded-3xl p-8 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-8 mb-8 text-left">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full">
              {build.category || "Custom Draft"}
            </span>
            <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Build
            </div>
          </div>
          <h1 className="text-3xl font-black text-white">{build.name}</h1>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">
            {build.description || "Custom configuration designed using the IC PC's compatibility planning engine."}
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end justify-end gap-3 shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">Total Est. Cost</span>
            <span className="text-3xl font-black text-white">₹{build.totalPrice.toLocaleString("en-IN")}</span>
          </div>
          <button
            onClick={handleCloneBuild}
            className="flex items-center gap-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20"
          >
            <Copy className="w-4 h-4" /> Clone to Configurator
          </button>
        </div>
      </div>

      {/* Parts Breakdown Grid */}
      <div className="bg-glass rounded-3xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 bg-zinc-900/20 text-left">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Components Breakdown</h3>
        </div>

        <div className="flex flex-col divide-y divide-white/5">
          {parts.map((item, idx) => {
            const Icon = item.icon;
            const partInfo = item.obj;

            return (
              <div key={idx} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-left">
                  <div className="p-3 bg-zinc-900 border border-white/5 rounded-xl text-zinc-500 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold tracking-wider text-zinc-500 block">
                      {item.label}
                    </span>
                    {partInfo ? (
                      <h4 className="text-sm font-semibold text-white mt-0.5">{partInfo.name}</h4>
                    ) : (
                      <span className="text-sm font-medium text-zinc-500 block mt-0.5">Not included in build</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 ml-auto sm:ml-0">
                  {partInfo ? (
                    <span className="text-sm font-bold text-white">₹{partInfo.price.toLocaleString("en-IN")}</span>
                  ) : (
                    <span className="text-xs text-zinc-600 font-semibold">₹0.00</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

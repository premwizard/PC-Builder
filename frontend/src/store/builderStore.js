import { create } from "zustand";

export const useBuilderStore = create((set, get) => ({
  selectedParts: {
    cpu: null,
    gpu: null,
    motherboard: null,
    ram: null,
    storage: null,
    psu: null,
    case: null,
    cooler: null,
  },

  addPart: (category, part) => {
    set((state) => ({
      selectedParts: {
        ...state.selectedParts,
        [category]: part,
      },
    }));
  },

  removePart: (category) => {
    set((state) => ({
      selectedParts: {
        ...state.selectedParts,
        [category]: null,
      },
    }));
  },

  clearBuild: () => {
    set(() => ({
      selectedParts: {
        cpu: null,
        gpu: null,
        motherboard: null,
        ram: null,
        storage: null,
        psu: null,
        case: null,
        cooler: null,
      },
    }));
  },

  // Calculate estimated wattage dynamically
  getEstimatedWattage: () => {
    const { selectedParts } = get();
    let total = 0;

    // Base wattage for motherboard, fans, and accessories
    total += 50;

    if (selectedParts.cpu) {
      total += selectedParts.cpu.specs.tdp || 0;
    }
    if (selectedParts.gpu) {
      total += selectedParts.gpu.specs.wattage || 0;
    }
    if (selectedParts.ram) {
      total += 10; // Approx 10W per memory kit
    }
    if (selectedParts.storage) {
      total += 10; // Approx 10W per drive
    }
    if (selectedParts.cooler) {
      total += selectedParts.cooler.specs.type === "Liquid AIO" ? 25 : 5;
    }

    return total;
  },

  // Compatibility checking logic
  getCompatibilityErrors: () => {
    const { selectedParts, getEstimatedWattage } = get();
    const errors = [];

    const { cpu, gpu, motherboard, ram, psu, case: casePart, cooler } = selectedParts;

    // 1. Socket Check (CPU vs Motherboard)
    if (cpu && motherboard) {
      if (cpu.specs.socket !== motherboard.specs.socket) {
        errors.push({
          type: "error",
          title: "Socket Mismatch",
          message: `CPU requires ${cpu.specs.socket} socket, but Motherboard has ${motherboard.specs.socket}.`,
        });
      }
    }

    // 2. RAM Gen Check (RAM vs Motherboard)
    if (ram && motherboard) {
      if (ram.specs.type !== motherboard.specs.memoryType) {
        errors.push({
          type: "error",
          title: "Memory Type Mismatch",
          message: `RAM is ${ram.specs.type}, but Motherboard supports ${motherboard.specs.memoryType}.`,
        });
      }
    }

    // 3. PSU Wattage Check (PSU vs Total Estimated Wattage)
    if (psu) {
      const estimatedWattage = getEstimatedWattage();
      if (psu.specs.wattage < estimatedWattage) {
        errors.push({
          type: "error",
          title: "Power Supply Insufficient",
          message: `Build requires ~${estimatedWattage}W, but PSU only delivers ${psu.specs.wattage}W.`,
        });
      } else if (psu.specs.wattage < estimatedWattage + 150) {
        errors.push({
          type: "warning",
          title: "Low Power Margin",
          message: `Estimated wattage is ${estimatedWattage}W. We recommend 150W of headroom (current margin: ${psu.specs.wattage - estimatedWattage}W).`,
        });
      }
    }

    // 4. GPU Clearance Check (GPU vs Case)
    if (gpu && casePart) {
      if (gpu.specs.length > casePart.specs.gpuMaxLength) {
        errors.push({
          type: "error",
          title: "GPU Clearance Issue",
          message: `GPU length (${gpu.specs.length}mm) exceeds maximum Case clearance (${casePart.specs.gpuMaxLength}mm).`,
        });
      }
    }

    // 5. Cooler Sockets Supported (Cooler vs CPU)
    if (cooler && cpu) {
      const isSupported = cooler.specs.socketsSupported.includes(cpu.specs.socket);
      if (!isSupported) {
        errors.push({
          type: "error",
          title: "Cooler Socket Mismatch",
          message: `Cooler does not support ${cpu.specs.socket} CPU socket.`,
        });
      }
    }

    return errors;
  },
}));

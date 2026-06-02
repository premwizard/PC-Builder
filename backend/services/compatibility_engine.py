from services.component_service import ComponentService

class CompatibilityEngine:
    @staticmethod
    def check_compatibility(parts):
        """
        parts is a dict: {"cpu": comp_id, "gpu": comp_id, "motherboard": comp_id, "ram": comp_id, "psu": comp_id, "case": comp_id, "cooler": comp_id}
        """
        results = []
        is_compatible = True
        total_wattage = 0
        
        # Resolve components
        resolved = {}
        for cat, comp_id in parts.items():
            if comp_id:
                comp = ComponentService.get_by_id(comp_id)
                if comp and "error" not in comp:
                    resolved[cat] = comp

        # Check CPU & Motherboard Socket
        cpu = resolved.get("cpu")
        mobo = resolved.get("motherboard")
        if cpu and mobo:
            cpu_socket = cpu.get("specs", {}).get("socket")
            mobo_socket = mobo.get("specs", {}).get("socket")
            if cpu_socket and mobo_socket and cpu_socket != mobo_socket:
                is_compatible = False
                results.append({"type": "error", "message": f"Socket mismatch: CPU uses {cpu_socket} but Motherboard uses {mobo_socket}."})

        # Check RAM & Motherboard
        ram = resolved.get("ram")
        if ram and mobo:
            ram_type = ram.get("specs", {}).get("type", "").split()[0] # e.g., "DDR5"
            mobo_mem = mobo.get("specs", {}).get("memoryType", "")
            if ram_type and mobo_mem and ram_type not in mobo_mem:
                is_compatible = False
                results.append({"type": "error", "message": f"RAM mismatch: RAM is {ram_type} but Motherboard supports {mobo_mem}."})

        # Calculate Wattage
        if cpu: total_wattage += float(cpu.get("specs", {}).get("tdp", 0))
        gpu = resolved.get("gpu")
        if gpu: total_wattage += float(gpu.get("specs", {}).get("wattage", 0))
        
        # Add 50W for mobo, ram, storage, fans
        total_wattage += 50 

        # Check PSU
        psu = resolved.get("psu")
        if psu:
            psu_wattage = float(psu.get("specs", {}).get("wattage", 0))
            if psu_wattage < (total_wattage * 1.2): # 20% overhead rule
                results.append({"type": "warning", "message": f"PSU Wattage ({psu_wattage}W) might be too low. Recommended: {int(total_wattage * 1.2)}W."})

        # Check Case & GPU Clearance
        pc_case = resolved.get("case")
        if pc_case and gpu:
            case_max = str(pc_case.get("specs", {}).get("gpuMaxLength", ""))
            gpu_len = str(gpu.get("specs", {}).get("length", ""))
            if case_max and gpu_len:
                try:
                    c_max = int(''.join(filter(str.isdigit, case_max)))
                    g_len = int(''.join(filter(str.isdigit, gpu_len)))
                    if g_len > c_max:
                        is_compatible = False
                        results.append({"type": "error", "message": f"GPU Clearance: GPU is {g_len}mm but Case max is {c_max}mm."})
                except:
                    pass

        if not results and len(resolved) > 1:
            results.append({"type": "success", "message": "All selected components are compatible."})

        return {
            "is_compatible": is_compatible,
            "total_wattage": total_wattage,
            "recommended_psu_wattage": int(total_wattage * 1.2),
            "messages": results
        }

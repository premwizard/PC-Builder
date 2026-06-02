from constants.engine_rules import FPS_BENCHMARKS, CPU_GAMING_MULTIPLIER, RAM_FPS_MULTIPLIER
from services.component_service import ComponentService

class FPSEngine:
    @staticmethod
    def calculate_fps(cpu_id, gpu_id, ram_capacity="32GB"):
        # We need the base FPS for the GPU. The frontend keys them by a simplified ID (like rtx-4090).
        # We'll map the component ID to these benchmark keys.
        # For this logic, we assume the gpu_id directly maps, or we fetch the GPU to determine its key.
        
        gpu = ComponentService.get_by_id(gpu_id)
        if not gpu or "error" in gpu:
            return {"error": "Invalid GPU"}
            
        gpu_name = gpu.get("name", "").lower()
        
        # Simplified matching logic for the demo benchmark keys
        gpu_key = None
        for key in FPS_BENCHMARKS.keys():
            if key.replace("-", "") in gpu_name.replace(" ", "").replace("-", ""):
                gpu_key = key
                break
        
        if not gpu_key:
            gpu_key = "rtx-4060" # Fallback

        base_fps = FPS_BENCHMARKS.get(gpu_key, FPS_BENCHMARKS["rtx-4060"])
        
        cpu_mult = CPU_GAMING_MULTIPLIER.get(cpu_id, 0.9)
        ram_mult = RAM_FPS_MULTIPLIER.get(ram_capacity, 1.0)
        
        total_mult = cpu_mult * ram_mult
        
        results = {}
        for game, fps_list in base_fps.items():
            results[game] = {
                "1080p": int(fps_list[0] * total_mult),
                "1440p": int(fps_list[1] * total_mult),
                "4K": int(fps_list[2] * total_mult)
            }
            
        return results

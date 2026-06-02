from services.component_service import ComponentService

class RecommendationEngine:
    @staticmethod
    def recommend_build(budget, purpose):
        """
        purpose can be: gaming, editing, mixed
        budget in INR.
        """
        # In a full app, this would query DB, filter by price, and use an algorithmic knapsack or predefined tiers.
        # Here we provide a simplified logic demonstrating the architecture.
        
        all_cpus = ComponentService.get_all(category="cpu", sort="price_asc")
        all_gpus = ComponentService.get_all(category="gpu", sort="price_asc")
        
        # Determine budget split based on purpose
        if purpose == "gaming":
            gpu_budget_pct = 0.45
            cpu_budget_pct = 0.20
        elif purpose == "editing":
            gpu_budget_pct = 0.30
            cpu_budget_pct = 0.35
        else:
            gpu_budget_pct = 0.35
            cpu_budget_pct = 0.30

        target_gpu_budget = budget * gpu_budget_pct
        target_cpu_budget = budget * cpu_budget_pct

        # Find best components under target budget
        selected_gpu = None
        for gpu in reversed(all_gpus):
            if gpu["price"] <= target_gpu_budget:
                selected_gpu = gpu
                break
        
        selected_cpu = None
        for cpu in reversed(all_cpus):
            if cpu["price"] <= target_cpu_budget:
                selected_cpu = cpu
                break

        # Fallback if nothing found
        if not selected_gpu and all_gpus: selected_gpu = all_gpus[0]
        if not selected_cpu and all_cpus: selected_cpu = all_cpus[0]

        total_price = (selected_cpu["price"] if selected_cpu else 0) + (selected_gpu["price"] if selected_gpu else 0)

        return {
            "purpose": purpose,
            "total_budget_target": budget,
            "estimated_cost_so_far": total_price,
            "recommendation": {
                "cpu": selected_cpu,
                "gpu": selected_gpu
                # Other components would be selected based on remaining budget and compatibility
            }
        }

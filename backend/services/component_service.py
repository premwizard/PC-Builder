from models.component import ComponentModel
import re

class ComponentService:
    @staticmethod
    def get_all(category=None, brand=None, search=None, min_price=None, max_price=None, sort=None):
        filters = {}
        if category:
            filters["category"] = category.lower()
        if brand:
            # Case insensitive exact match or regex
            filters["brand"] = {"$regex": f"^{brand}$", "$options": "i"}
        if search:
            filters["$or"] = [
                {"name": {"$regex": search, "$options": "i"}},
                {"brand": {"$regex": search, "$options": "i"}}
            ]
        if min_price is not None or max_price is not None:
            filters["price"] = {}
            if min_price is not None: filters["price"]["$gte"] = float(min_price)
            if max_price is not None: filters["price"]["$lte"] = float(max_price)
            
        sort_by = None
        if sort == "price_asc": sort_by = ("price", 1)
        elif sort == "price_desc": sort_by = ("price", -1)
        elif sort == "rating": sort_by = ("rating", -1)
        elif sort == "performance": sort_by = ("benchmarkScore", -1)

        components = ComponentModel.find_all(filters, sort_by=sort_by)
        return [ComponentModel.format_component(c) for c in components]

    @staticmethod
    def get_by_id(comp_id):
        comp = ComponentModel.find_by_id(comp_id)
        if not comp:
            return {"error": "Component not found"}
        return ComponentModel.format_component(comp)

    @staticmethod
    def create_component(data):
        # Basic validation
        if not data.get("name") or not data.get("category") or not data.get("price"):
            return {"error": "Name, category, and price are required"}
            
        new_comp = ComponentModel.create(data)
        return ComponentModel.format_component(new_comp)

    @staticmethod
    def update_component(comp_id, data):
        success = ComponentModel.update(comp_id, data)
        if not success:
            return {"error": "Component not found or not updated"}
        return ComponentService.get_by_id(comp_id)

    @staticmethod
    def delete_component(comp_id):
        success = ComponentModel.delete(comp_id)
        if not success:
            return {"error": "Component not found"}
        return {"message": "Component deleted successfully"}

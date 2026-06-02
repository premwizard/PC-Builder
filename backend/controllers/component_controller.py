from flask import request
from services.component_service import ComponentService
from utils.response import success_response, error_response

class ComponentController:
    @staticmethod
    def get_all():
        category = request.args.get("category")
        brand = request.args.get("brand")
        search = request.args.get("search")
        min_price = request.args.get("min_price")
        max_price = request.args.get("max_price")
        sort = request.args.get("sort")
        
        result = ComponentService.get_all(category, brand, search, min_price, max_price, sort)
        return success_response("Components retrieved successfully", data=result)

    @staticmethod
    def get_one(comp_id):
        result = ComponentService.get_by_id(comp_id)
        if "error" in result:
            return error_response(result["error"], status_code=404)
        return success_response("Component retrieved successfully", data=result)

    @staticmethod
    def create():
        data = request.get_json()
        result = ComponentService.create_component(data)
        if "error" in result:
            return error_response(result["error"], status_code=400)
        return success_response("Component created successfully", data=result, status_code=201)

    @staticmethod
    def update(comp_id):
        data = request.get_json()
        result = ComponentService.update_component(comp_id, data)
        if "error" in result:
            return error_response(result["error"], status_code=400)
        return success_response("Component updated successfully", data=result)

    @staticmethod
    def delete(comp_id):
        result = ComponentService.delete_component(comp_id)
        if "error" in result:
            return error_response(result["error"], status_code=404)
        return success_response(result["message"])

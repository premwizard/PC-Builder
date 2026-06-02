from flask import request
from flask_jwt_extended import get_jwt_identity
from services.build_service import BuildService
from services.fps_engine import FPSEngine
from services.compatibility_engine import CompatibilityEngine
from utils.response import success_response, error_response

class BuilderController:
    @staticmethod
    def save_build():
        user_id = get_jwt_identity()
        data = request.get_json()
        
        try:
            result = BuildService.create_build(user_id, data)
            return success_response("Build saved successfully", data=result, status_code=201)
        except Exception as e:
            return error_response("Failed to save build", error=str(e), status_code=500)

    @staticmethod
    def get_my_builds():
        user_id = get_jwt_identity()
        try:
            result = BuildService.get_user_builds(user_id)
            return success_response("Saved builds retrieved", data=result)
        except Exception as e:
            return error_response("Failed to retrieve builds", error=str(e), status_code=500)

    @staticmethod
    def delete_build(build_id):
        user_id = get_jwt_identity()
        success = BuildService.delete_build(user_id, build_id)
        if success:
            return success_response("Build deleted successfully")
        return error_response("Build not found or unauthorized", status_code=404)
        
    @staticmethod
    def estimate_fps():
        data = request.get_json()
        cpu_id = data.get("cpu")
        gpu_id = data.get("gpu")
        ram_capacity = data.get("ram_capacity", "32GB")
        
        if not cpu_id or not gpu_id:
            return error_response("CPU and GPU are required", status_code=400)
            
        result = FPSEngine.calculate_fps(cpu_id, gpu_id, ram_capacity)
        if "error" in result:
            return error_response(result["error"], status_code=400)
            
        return success_response("FPS estimated successfully", data=result)
        
    @staticmethod
    def check_compatibility():
        data = request.get_json()
        parts = data.get("parts", {})
        result = CompatibilityEngine.check_compatibility(parts)
        return success_response("Compatibility checked", data=result)

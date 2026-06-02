from flask import jsonify

def success_response(message="Operation successful", data=None, status_code=200):
    """Standardized success response format."""
    response = {
        "success": True,
        "message": message,
        "data": data if data is not None else {}
    }
    return jsonify(response), status_code

def error_response(message="An error occurred", error=None, status_code=400):
    """Standardized error response format."""
    response = {
        "success": False,
        "message": message,
    }
    if error is not None:
        response["error"] = str(error)
        
    return jsonify(response), status_code

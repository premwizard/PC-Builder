from functools import wraps
from flask_jwt_extended import get_jwt, verify_jwt_in_request
from utils.response import error_response

def admin_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            if claims.get("role") == "ADMIN":
                return fn(*args, **kwargs)
            else:
                return error_response("Admins only!", status_code=403)
        return decorator
    return wrapper

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.education_service import EducationService

education_bp = Blueprint("education", __name__, url_prefix="/api/education")

def current_user_id():
    return get_jwt_identity()

@education_bp.get("/levels")
@jwt_required()
def list_levels():
    user_id = current_user_id()
    levels = EducationService.list_levels(user_id)
    return jsonify(levels), 200

@education_bp.post("/levels")
@jwt_required()
def create_level():
    data = request.get_json()
    user_id = current_user_id()

    name = data.get("name")
    institution_name = data.get("institution_name")

    level, error = EducationService.create_level(user_id, name, institution_name)

    if error:
        return jsonify({"message": error}), 400

    return jsonify({
        "level_id": level.level_id,
        "name": level.name,
        "institution_name": level.institution_name
    }), 201

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

    # 👇 สำคัญที่สุด — wrap array ให้ frontend ใช้ได้
    return jsonify({"levels": levels}), 200


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

    # 👇 คืนรูปแบบมาตรฐานให้ frontend รับตรง
    return jsonify({
        "message": "สร้างระดับชั้นสำเร็จ",
        "level": {
            "level_id": level.level_id,
            "name": level.name,
            "institution_name": level.institution_name or ""
        }
    }), 201

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.subject_service import SubjectService

subject_bp = Blueprint("subjects", __name__, url_prefix="/api/subjects")

def current_user_id():
    return get_jwt_identity()

@subject_bp.get("/")
@jwt_required()
def list_subjects():
    user_id = current_user_id()
    level_id = request.args.get("level_id", type=int)

    data = SubjectService.list_subjects(user_id, level_id)
    return jsonify(data), 200

@subject_bp.post("/")
@jwt_required()
def create_subject():
    user_id = current_user_id()
    data = request.get_json()

    subject, error = SubjectService.create_subject(user_id, data)
    if error:
        return jsonify({"message": error}), 400

    return jsonify({
        "subject_id": subject.subject_id,
        "name": subject.name,
        "level_id": subject.level_id,
    }), 201

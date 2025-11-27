from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.subject_service import SubjectService

subject_bp = Blueprint("subjects", __name__, url_prefix="/api/subjects")


def uid():
    return get_jwt_identity()

@subject_bp.get("/")
@jwt_required()
def list_subjects():
    user_id = uid()
    level_id = request.args.get("level_id", type=int)
    term_id = request.args.get("term_id", type=int)

    data = SubjectService.list_subjects(user_id, level_id, term_id)
    return jsonify(data), 200


@subject_bp.post("/")
@jwt_required()
def create_subject():
    user_id = uid()
    data = request.get_json()

    result, status = SubjectService.create_subject(user_id, data)
    return jsonify(result), status

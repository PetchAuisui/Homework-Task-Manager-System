from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.subject_service import SubjectService

subject_bp = Blueprint("subjects", __name__, url_prefix="/api/subjects")


@subject_bp.route("/", methods=["POST"])
@jwt_required()
def create_subject():
    user_id = get_jwt_identity()
    data = request.get_json()

    result, status = SubjectService.create_subject(user_id, data)
    return jsonify(result), status


@subject_bp.route("/", methods=["GET"])
@jwt_required()
def get_subjects():
    user_id = get_jwt_identity()

    result, status = SubjectService.get_subjects(user_id)
    return jsonify(result), status

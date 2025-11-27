from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.term_service import TermService

term_bp = Blueprint("terms", __name__, url_prefix="/api/terms")


@term_bp.post("/")                 
@jwt_required()
def create_term():
    user_id = get_jwt_identity()
    data = request.get_json()

    result, status = TermService.create_term(user_id, data)
    return jsonify(result), status


@term_bp.get("/")  
@jwt_required()
def list_terms():
    user_id = get_jwt_identity()
    level_id = request.args.get("level_id", type=int)

    result, status = TermService.list_terms(user_id, level_id)
    return jsonify(result), status

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.level_service import LevelService

level_bp = Blueprint("levels", __name__, url_prefix="/api/levels")


@level_bp.route("/", methods=["POST"])
@jwt_required()
def create_level():
    user_id = get_jwt_identity()
    data = request.get_json()

    result, status = LevelService.create_level(user_id, data)
    return jsonify(result), status


@level_bp.route("/", methods=["GET"])
@jwt_required()
def get_levels():
    user_id = get_jwt_identity()

    result, status = LevelService.get_levels(user_id)
    return jsonify(result), status

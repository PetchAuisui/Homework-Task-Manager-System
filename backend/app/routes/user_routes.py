from flask import Blueprint, request, jsonify
from app.services.user_service import UserService

user_bp = Blueprint("user", __name__)

@user_bp.route("/<int:user_id>", methods=["GET"])
def get_profile(user_id):
    result, status = UserService.get_user_profile(user_id)
    return jsonify(result), status


@user_bp.route("/<int:user_id>", methods=["PUT"])
def update_profile(user_id):
    data = request.get_json()
    result, status = UserService.update_user_profile(user_id, data)
    return jsonify(result), status

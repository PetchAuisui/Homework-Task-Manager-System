from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.services.task_service import TaskService

task_bp = Blueprint("tasks", __name__, url_prefix="/api/tasks")


def current_user_id():
    return get_jwt_identity()


# 🔹 ดึงงานทั้งหมดของรายวิชาหนึ่ง
@task_bp.get("/subject/<int:subject_id>")
@jwt_required()
def list_tasks_by_subject(subject_id):
    user_id = current_user_id()
    tasks, error = TaskService.list_by_subject(user_id, subject_id)

    if error:
        return jsonify({"message": error}), 404

    return jsonify(tasks), 200


# 🔹 สร้างงานใหม่ในวิชานั้น (ใช้กับหน้า AddTask.tsx)
@task_bp.post("/subject/<int:subject_id>")
@jwt_required()
def create_task(subject_id):
    user_id = current_user_id()
    data = request.get_json() or {}

    task, error = TaskService.create_task(user_id, subject_id, data)
    if error:
        return jsonify({"message": error}), 400

    return jsonify({
        "message": "สร้างงานสำเร็จ",
        "task": {
            "task_id": task.task_id,
            "title": task.title,
            "description": task.description,
            "due_date": task.due_date.isoformat() if task.due_date else None,
            "priority": task.priority,
            "is_completed": task.is_completed,
        }
    }), 201


# 🔹 แก้ไขงาน
@task_bp.put("/<int:task_id>")
@jwt_required()
def update_task(task_id):
    user_id = current_user_id()
    data = request.get_json() or {}

    task, error = TaskService.update_task(user_id, task_id, data)
    if error:
        return jsonify({"message": error}), 400

    return jsonify({"message": "แก้ไขงานสำเร็จ"}), 200


# 🔹 toggle สถานะสำเร็จ / ยัง
@task_bp.patch("/<int:task_id>/toggle")
@jwt_required()
def toggle_task(task_id):
    user_id = current_user_id()
    task, error = TaskService.toggle_complete(user_id, task_id)
    if error:
        return jsonify({"message": error}), 404

    return jsonify({
        "message": "อัปเดตสถานะสำเร็จ",
        "is_completed": task.is_completed,
    }), 200


# 🔹 ลบงาน
@task_bp.delete("/<int:task_id>")
@jwt_required()
def delete_task(task_id):
    user_id = current_user_id()
    error = TaskService.delete_task(user_id, task_id)
    if error:
        return jsonify({"message": error}), 404

    return jsonify({"message": "ลบงานสำเร็จ"}), 200

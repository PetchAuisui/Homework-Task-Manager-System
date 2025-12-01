from datetime import datetime
from app.extensions import db
from app.models import (
    Subject,
    Task, TaskLabel,
    Subtask, SubtaskLabel,
    Label,
    Reminder,
    Teacher, SubjectTeacher
)


class TaskService:

    # ----------------------------------------------------------------------
    # ดึงงานทั้งหมดในรายวิชา
    # ----------------------------------------------------------------------
    @staticmethod
    def list_by_subject(user_id: int, subject_id: int):
        subject = Subject.query.filter_by(
            subject_id=subject_id,
            user_id=user_id
        ).first()

        if not subject:
            return None, "ไม่พบรายวิชานี้"

        tasks = Task.query.filter_by(subject_id=subject_id).order_by(
            Task.due_date,
            Task.created_at.desc()
        ).all()

        result = []
        for t in tasks:
            result.append({
                "task_id": t.task_id,
                "title": t.title,
                "description": t.description,
                "due_date": t.due_date.isoformat() if t.due_date else None,
                "priority": t.priority,
                "is_completed": t.is_completed,
                "labels": [
                    {
                        "label_id": tl.label.label_id,
                        "name": tl.label.name,
                        "color": tl.label.color
                    }
                    for tl in t.labels
                ]
            })

        return result, None

    # ----------------------------------------------------------------------
    # เพิ่มงานแบบ FULL (tasks + labels + teachers + reminders + subtasks)
    # ----------------------------------------------------------------------
    @staticmethod
    def create_full_task(user_id: int, data: dict):
        subject_id = data.get("subject_id")
        title = data.get("title", "").strip()
        description = data.get("description")
        due_date = data.get("due_date")
        priority = data.get("priority", "MEDIUM")

        if not subject_id or not title:
            return None, "ข้อมูลไม่ครบ"

        # ตรวจว่ารายวิชานี้เป็นของ user จริง
        subject = Subject.query.filter_by(
            subject_id=subject_id,
            user_id=user_id
        ).first()

        if not subject:
            return None, "ไม่พบรายวิชา"

        # แปลงวัน
        parsed_due_date = None
        if due_date:
            try:
                parsed_due_date = datetime.strptime(due_date, "%Y-%m-%d").date()
            except:
                return None, "รูปแบบวันไม่ถูกต้อง"

        # ---------------------------
        # สร้าง TASK หลัก
        # ---------------------------
        new_task = Task(
            subject_id=subject_id,
            title=title,
            description=description,
            due_date=parsed_due_date,
            priority=priority,
        )
        db.session.add(new_task)
        db.session.flush()  # ให้ได้ task_id

        # ---------------------------
        # 1) TASK LABELS
        # ---------------------------
        label_ids = data.get("label_ids", [])
        if label_ids:
            labels = Label.query.filter(
                Label.user_id == user_id,
                Label.label_id.in_(label_ids)
            ).all()
            for lbl in labels:
                db.session.add(TaskLabel(task_id=new_task.task_id, label_id=lbl.label_id))

        # ---------------------------
        # 2) TEACHERS (subject_teachers)
        # ---------------------------
        teacher_ids = data.get("teacher_ids", [])
        if teacher_ids:
            for tid in teacher_ids:
                existed = SubjectTeacher.query.filter_by(
                    subject_id=subject_id,
                    teacher_id=tid
                ).first()
                if not existed:
                    db.session.add(SubjectTeacher(subject_id=subject_id, teacher_id=tid))

        # ---------------------------
        # 3) REMINDERS
        # ---------------------------
        reminders = data.get("reminders", [])
        for r in reminders:
            msg = r.get("message")
            time_str = r.get("notify_at")
            if not msg or not time_str:
                continue

            # แปลงเวลา
            notify_at = datetime.strptime(time_str, "%Y-%m-%d %H:%M")

            db.session.add(Reminder(
                task_id=new_task.task_id,
                message=msg,
                notify_at=notify_at,
                is_sent=False
            ))

        # ---------------------------
        # 4) SUBTASKS (Level 1)
        # ---------------------------
        subtasks = data.get("subtasks", [])
        for st in subtasks:
            st_title = st.get("title", "").strip()
            st_due = st.get("due_date")
            st_priority = st.get("priority", "MEDIUM")

            if not st_title:
                continue

            parsed_st_due = None
            if st_due:
                parsed_st_due = datetime.strptime(st_due, "%Y-%m-%d").date()

            new_st = Subtask(
                task_id=new_task.task_id,
                parent_subtask=None,
                title=st_title,
                due_date=parsed_st_due,
                priority=st_priority,
            )
            db.session.add(new_st)

        # ---------------------------
        # Commit ทั้งหมด
        # ---------------------------
        db.session.commit()

        return new_task, None

    # ----------------------------------------------------------------------
    # ดึงรายละเอียดงาน FULL
    # ----------------------------------------------------------------------
    @staticmethod
    def get_task_detail(user_id: int, task_id: int):
        task = (
            Task.query.join(Subject)
            .filter(Task.task_id == task_id, Subject.user_id == user_id)
            .first()
        )
        if not task:
            return None, "ไม่พบงานนี้"

        # ดึงงานย่อย
        subtasks = Subtask.query.filter_by(task_id=task_id).all()
        subtask_list = [
            {
                "subtask_id": st.subtask_id,
                "title": st.title,
                "due_date": st.due_date.isoformat() if st.due_date else None,
                "priority": st.priority,
                "is_completed": st.is_completed,
            }
            for st in subtasks
        ]

        # ดึงแจ้งเตือน
        reminders = Reminder.query.filter_by(task_id=task_id).all()
        reminder_list = [
            {
                "reminder_id": r.reminder_id,
                "message": r.message,
                "notify_at": r.notify_at.isoformat(),
                "is_sent": r.is_sent
            }
            for r in reminders
        ]

        result = {
            "task_id": task.task_id,
            "title": task.title,
            "description": task.description,
            "due_date": task.due_date.isoformat() if task.due_date else None,
            "priority": task.priority,
            "is_completed": task.is_completed,
            "labels": [
                {
                    "label_id": tl.label.label_id,
                    "name": tl.label.name,
                    "color": tl.label.color
                }
                for tl in task.labels
            ],
            "subtasks": subtask_list,
            "reminders": reminder_list,
        }

        return result, None

    # ----------------------------------------------------------------------
    # อัปเดตงาน
    # ----------------------------------------------------------------------
    @staticmethod
    def update_task(user_id: int, task_id: int, data: dict):
        task = (
            Task.query.join(Subject)
            .filter(Task.task_id == task_id, Subject.user_id == user_id)
            .first()
        )
        if not task:
            return None, "ไม่พบงานนี้"

        if "title" in data:
            title = data["title"].strip()
            if title:
                task.title = title

        if "description" in data:
            task.description = data["description"]

        if "priority" in data:
            task.priority = data["priority"]

        if "due_date" in data:
            v = data["due_date"]
            if v:
                task.due_date = datetime.strptime(v, "%Y-%m-%d").date()
            else:
                task.due_date = None

        # label update
        if "label_ids" in data:
            TaskLabel.query.filter_by(task_id=task_id).delete()
            for lid in data["label_ids"]:
                db.session.add(TaskLabel(task_id=task_id, label_id=lid))

        db.session.commit()
        return task, None

    # ----------------------------------------------------------------------
    # toggle งานเสร็จ
    # ----------------------------------------------------------------------
    @staticmethod
    def toggle_task(user_id: int, task_id: int):
        task = (
            Task.query.join(Subject)
            .filter(Task.task_id == task_id, Subject.user_id == user_id)
            .first()
        )
        if not task:
            return None, "ไม่พบงานนี้"

        task.is_completed = not task.is_completed
        db.session.commit()
        return task, None

    # ----------------------------------------------------------------------
    # ลบงาน + งานย่อย + label + reminders
    # ----------------------------------------------------------------------
    @staticmethod
    def delete_task(user_id: int, task_id: int):
        task = (
            Task.query.join(Subject)
            .filter(Task.task_id == task_id, Subject.user_id == user_id)
            .first()
        )
        if not task:
            return "ไม่พบงานนี้"

        db.session.delete(task)
        db.session.commit()
        return None

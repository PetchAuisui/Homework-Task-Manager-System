from celery import Celery
import os

# ฟังก์ชันสร้าง Celery app
def make_celery():
    redis_url = os.getenv("REDIS_URL", "redis://redis:6379/0")
    celery = Celery(
        "study_tasker",
        broker=redis_url,
        backend=redis_url,
        include=["app.tasks.example_task"]  # import task ไว้ตรงนี้
    )
    celery.conf.update(
        timezone="Asia/Bangkok",
        task_track_started=True,
        task_serializer="json",
        result_serializer="json",
        accept_content=["json"],
    )
    return celery


# สร้าง instance ของ celery
celery_app = make_celery()

if __name__ == "__main__":
    celery_app.start()

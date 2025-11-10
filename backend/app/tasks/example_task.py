from app.celery_worker import celery_app

@celery_app.task
def test_task():
    print("✅ Celery worker is running correctly!")
    return "ok"

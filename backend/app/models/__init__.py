from app.extensions import db

from .user import User
from .education_level import EducationLevel
from .term import Term
from .teacher import Teacher
from .subject import Subject
from .subject_teacher import SubjectTeacher
from .task import Task
from .subtask import Subtask
from .event import Event
from .event_task import EventTask
from .label import Label
from .task_label import TaskLabel
from .subtask_label import SubtaskLabel
from .reminder import Reminder


__all__ = [
    "User",
    "EducationLevel",
    "Term",
    "Teacher",
    "Subject",
    "SubjectTeacher",
    "Task",
    "Subtask",
    "Event",
    "EventTask",
    "Label",
    "TaskLabel",
    "SubtaskLabel",
    "Reminder",
]

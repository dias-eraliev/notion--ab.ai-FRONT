from datetime import datetime, date, time
from typing import List, Optional
from pydantic import BaseModel, EmailStr, constr, conint
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "admin"
    TEACHER = "teacher"
    STUDENT = "student"
    STAFF = "staff"

class UserStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    BLOCKED = "blocked"

class User(BaseModel):
    id: Optional[int] = None
    email: EmailStr
    first_name: constr(min_length=2, max_length=100)
    last_name: constr(min_length=2, max_length=100)
    middle_name: Optional[str] = None
    role: UserRole
    status: UserStatus = UserStatus.ACTIVE
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class Teacher(BaseModel):
    id: Optional[int] = None
    user_id: int
    department: str
    position: str
    academic_degree: Optional[str] = None
    academic_title: Optional[str] = None
    hire_date: date
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class Subject(BaseModel):
    id: Optional[int] = None
    code: str
    name: str
    description: Optional[str] = None
    credits: int
    hours_per_credit: int = 30
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class Group(BaseModel):
    id: Optional[int] = None
    name: str
    year: conint(ge=1900, le=2100)
    speciality: str
    students_count: int = 0
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class RoomType(str, Enum):
    LECTURE = "lecture"
    PRACTICE = "practice"
    LAB = "lab"
    COMPUTER = "computer"

class Room(BaseModel):
    id: Optional[int] = None
    number: str
    building: str
    floor: conint(ge=1)
    capacity: conint(ge=1)
    type: RoomType
    equipment: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class LessonType(str, Enum):
    LECTURE = "lecture"
    PRACTICE = "practice"
    LAB = "lab"

class RecurrenceRule(BaseModel):
    frequency: str
    interval: Optional[int] = 1
    until: Optional[date] = None
    by_day: Optional[List[str]] = None

class Schedule(BaseModel):
    id: Optional[int] = None
    subject_id: int
    teacher_id: int
    group_id: int
    room_id: int
    type: LessonType
    start_time: time
    end_time: time
    day_of_week: conint(ge=1, le=7)
    start_date: date
    end_date: date
    recurrence_rule: Optional[RecurrenceRule] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class WorkloadType(str, Enum):
    REGULAR = "regular"
    OVERTIME = "overtime"
    SICK = "sick"
    VACATION = "vacation"

class TeacherWorkload(BaseModel):
    id: Optional[int] = None
    teacher_id: int
    academic_year: int
    standard_hours: float
    actual_hours: float = 0
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class MonthlyWorkload(BaseModel):
    id: Optional[int] = None
    workload_id: int
    month: conint(ge=1, le=12)
    standard_hours: float
    actual_hours: float = 0
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class DailyWorkload(BaseModel):
    id: Optional[int] = None
    workload_id: int
    date: date
    hours: float
    type: WorkloadType
    comment: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class ConversationType(str, Enum):
    PRIVATE = "private"
    GROUP = "group"

class ParticipantRole(str, Enum):
    OWNER = "owner"
    ADMIN = "admin"
    MEMBER = "member"

class Conversation(BaseModel):
    id: Optional[int] = None
    type: ConversationType
    name: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class ConversationParticipant(BaseModel):
    id: Optional[int] = None
    conversation_id: int
    user_id: int
    role: ParticipantRole = ParticipantRole.MEMBER
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class MessageType(str, Enum):
    TEXT = "text"
    FILE = "file"
    IMAGE = "image"

class MessageStatus(str, Enum):
    SENT = "sent"
    DELIVERED = "delivered"
    READ = "read"

class Message(BaseModel):
    id: Optional[int] = None
    conversation_id: int
    sender_id: int
    content: str
    type: MessageType = MessageType.TEXT
    status: MessageStatus = MessageStatus.SENT
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class MessageAttachment(BaseModel):
    id: Optional[int] = None
    message_id: int
    type: str
    url: str
    name: str
    size: int
    created_at: Optional[datetime] = None

    class Config:
        orm_mode = True 
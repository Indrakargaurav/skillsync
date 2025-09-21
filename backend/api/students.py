from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from core.database import get_db
from core.models import Student
from core.schemas import StudentCreate, Student as StudentSchema

router = APIRouter(prefix="/students", tags=["students"])

@router.post("/", response_model=StudentSchema)
async def create_student(student: StudentCreate, db: Session = Depends(get_db)):
    """Create a new student record"""
    db_student = Student(**student.dict())
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

@router.get("/", response_model=List[StudentSchema])
async def get_students(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all students"""
    students = db.query(Student).offset(skip).limit(limit).all()
    return students

@router.get("/{student_id}", response_model=StudentSchema)
async def get_student(student_id: int, db: Session = Depends(get_db)):
    """Get a specific student by ID"""
    student = db.query(Student).filter(Student.student_id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

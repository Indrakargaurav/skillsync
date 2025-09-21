from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class Student(Base):
    __tablename__ = "students"
    
    student_id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    skills_text = Column(Text)
    degree = Column(String(100))
    stream = Column(String(100))
    city = Column(String(100))
    state = Column(String(100))
    pincode = Column(String(10))
    caste = Column(String(50))
    gender = Column(String(20))
    financial_status = Column(String(50))
    preferred_locations = Column(Text)
    other_notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class Company(Base):
    __tablename__ = "companies"
    
    company_id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String(200), nullable=False)
    position_title = Column(String(200))
    req_skills_text = Column(Text)
    job_description = Column(Text)
    location_city = Column(String(100))
    location_state = Column(String(100))
    stipend = Column(Float)
    openings = Column(Integer, default=1)
    priority_flags = Column(Text)
    other_notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class Allocation(Base):
    __tablename__ = "allocations"
    
    allocation_id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.student_id"))
    company_id = Column(Integer, ForeignKey("companies.company_id"))
    score = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    student = relationship("Student")
    company = relationship("Company")

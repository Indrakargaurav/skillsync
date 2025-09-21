from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class StudentBase(BaseModel):
    first_name: str = Field(..., max_length=100)
    last_name: str = Field(..., max_length=100)
    skills_text: Optional[str] = None
    degree: Optional[str] = Field(None, max_length=100)
    stream: Optional[str] = Field(None, max_length=100)
    city: Optional[str] = Field(None, max_length=100)
    state: Optional[str] = Field(None, max_length=100)
    pincode: Optional[str] = Field(None, max_length=10)
    caste: Optional[str] = Field(None, max_length=50)
    gender: Optional[str] = Field(None, max_length=20)
    financial_status: Optional[str] = Field(None, max_length=50)
    preferred_locations: Optional[str] = None
    other_notes: Optional[str] = None

class StudentCreate(StudentBase):
    pass

class Student(StudentBase):
    student_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class CompanyBase(BaseModel):
    company_name: str = Field(..., max_length=200)
    position_title: Optional[str] = Field(None, max_length=200)
    req_skills_text: Optional[str] = None
    job_description: Optional[str] = None
    location_city: Optional[str] = Field(None, max_length=100)
    location_state: Optional[str] = Field(None, max_length=100)
    stipend: Optional[float] = None
    openings: int = Field(default=1, ge=1)
    priority_flags: Optional[str] = None
    other_notes: Optional[str] = None

class CompanyCreate(CompanyBase):
    pass

class Company(CompanyBase):
    company_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class AllocationResult(BaseModel):
    student_id: int
    student_name: str
    company_id: int
    company_name: str
    score: float

class AllocationResponse(BaseModel):
    allocations: List[AllocationResult]
    total_students: int
    total_companies: int
    processing_time: float
    # Added fields for not allocated students
    # short lightweight structure to display in UI
    
class NotAllocatedStudent(BaseModel):
    student_id: int
    student_name: str

class AllocationResponse(BaseModel):
    allocations: List[AllocationResult]
    unallocated_students: List[NotAllocatedStudent]
    unallocated_count: int
    total_students: int
    total_companies: int
    processing_time: float

class UploadResponse(BaseModel):
    accepted: int
    rejected: int
    errors: List[str]

class CSVUploadResponse(BaseModel):
    message: str
    accepted: int
    rejected: int
    errors: List[str]

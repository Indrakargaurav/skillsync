from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import pandas as pd
import io
import os
from dotenv import load_dotenv
import numpy as np

from core.database import get_db, create_tables
from core.models import Student, Company, Allocation
from services.ai_engine import AIAllocationEngine
from core.schemas import (
    StudentCreate, Student as StudentSchema,
    CompanyCreate, Company as CompanySchema,
    AllocationResult, AllocationResponse, NotAllocatedStudent,
    CSVUploadResponse
)

load_dotenv()

app = FastAPI(
    title="Internship Allocation Engine",
    description="AI-powered internship matching system using sentence transformers and FAISS",
    version="1.0.0"
)

# CORS middleware
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    create_tables()
    # Warm up AI engine lazily
    global ai_engine
    ai_engine = AIAllocationEngine()

@app.get("/")
async def root():
    return {"message": "Internship Allocation Engine API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API is running"}

# Student endpoints
@app.post("/students", response_model=StudentSchema)
async def create_student(student: StudentCreate, db: Session = Depends(get_db)):
    """Create a new student record"""
    db_student = Student(**student.dict())
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

@app.get("/students", response_model=List[StudentSchema])
async def get_students(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all students"""
    students = db.query(Student).offset(skip).limit(limit).all()
    return students

@app.get("/students/{student_id}", response_model=StudentSchema)
async def get_student(student_id: int, db: Session = Depends(get_db)):
    """Get a specific student by ID"""
    student = db.query(Student).filter(Student.student_id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

# Company endpoints
@app.post("/companies", response_model=CompanySchema)
async def create_company(company: CompanyCreate, db: Session = Depends(get_db)):
    """Create a new company record"""
    db_company = Company(**company.dict())
    db.add(db_company)
    db.commit()
    db.refresh(db_company)
    return db_company

@app.get("/companies", response_model=List[CompanySchema])
async def get_companies(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all companies"""
    companies = db.query(Company).offset(skip).limit(limit).all()
    return companies

@app.get("/companies/{company_id}", response_model=CompanySchema)
async def get_company(company_id: int, db: Session = Depends(get_db)):
    """Get a specific company by ID"""
    company = db.query(Company).filter(Company.company_id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company

# CSV Upload endpoints
@app.post("/upload/students", response_model=CSVUploadResponse)
async def upload_students_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Upload students CSV file"""
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="File must be a CSV")
    
    try:
        # Read CSV content
        content = await file.read()
        df = pd.read_csv(io.StringIO(content.decode('utf-8')))
        
        # Validate required columns - check for either new format or old format
        required_columns_old = ['first_name', 'last_name']
        required_columns_new = ['name']
        
        if 'name' in df.columns:
            # New format with 'name' column
            required_columns = required_columns_new
        else:
            # Old format with 'first_name', 'last_name' columns
            required_columns = required_columns_old
            
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            raise HTTPException(
                status_code=400, 
                detail=f"Missing required columns: {missing_columns}. Available columns: {list(df.columns)}"
            )
        
        # Reset students and dependent allocations only
        db.query(Allocation).delete()
        db.query(Student).delete()
        db.commit()

        accepted = 0
        rejected = 0
        errors = []
        
        # Process each row
        for index, row in df.iterrows():
            try:
                # Convert row to dict and handle NaN values
                student_data = {}
                for col in df.columns:
                    value = row[col]
                    if pd.isna(value):
                        student_data[col] = None
                    else:
                        student_data[col] = str(value)
                
                # Map CSV columns to database columns
                mapped_data = {}
                
                # Handle name field
                if 'name' in student_data and student_data['name']:
                    # Split name into first and last name
                    name_parts = student_data['name'].split(' ', 1)
                    mapped_data['first_name'] = name_parts[0]
                    mapped_data['last_name'] = name_parts[1] if len(name_parts) > 1 else ''
                else:
                    mapped_data['first_name'] = student_data.get('first_name', '')
                    mapped_data['last_name'] = student_data.get('last_name', '')
                
                # Map other fields
                mapped_data['skills_text'] = student_data.get('skills', '')
                mapped_data['degree'] = student_data.get('branch', '')
                mapped_data['stream'] = student_data.get('branch', '')
                mapped_data['city'] = student_data.get('district', '')
                mapped_data['state'] = student_data.get('state', '')
                mapped_data['pincode'] = None
                mapped_data['caste'] = student_data.get('caste_category', '')
                mapped_data['gender'] = student_data.get('gender', '')
                mapped_data['financial_status'] = 'Low' if student_data.get('family_income') and float(student_data.get('family_income', 0)) < 50000 else 'Medium'
                mapped_data['preferred_locations'] = student_data.get('City', '')
                mapped_data['other_notes'] = f"CGPA: {student_data.get('cgpa', '')}, Internships: {student_data.get('internships_count', '')}, Projects: {student_data.get('projects_count', '')}, Certifications: {student_data.get('certifications', '')}"
                
                # Create student record
                db_student = Student(**mapped_data)
                db.add(db_student)
                accepted += 1
                
            except Exception as e:
                rejected += 1
                errors.append(f"Row {index + 2}: {str(e)}")
        
        db.commit()
        
        return CSVUploadResponse(
            message=f"Successfully processed {accepted} students",
            accepted=accepted,
            rejected=rejected,
            errors=errors
        )
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing CSV: {str(e)}")

@app.post("/upload/companies", response_model=CSVUploadResponse)
async def upload_companies_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Upload companies CSV file"""
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="File must be a CSV")
    
    try:
        # Read CSV content
        content = await file.read()
        df = pd.read_csv(io.StringIO(content.decode('utf-8')))
        
        # Validate required columns
        required_columns = ['company_name']
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            raise HTTPException(
                status_code=400, 
                detail=f"Missing required columns: {missing_columns}. Available columns: {list(df.columns)}"
            )
        
        # Reset companies and dependent allocations only
        db.query(Allocation).delete()
        db.query(Company).delete()
        db.commit()

        accepted = 0
        rejected = 0
        errors = []
        
        # Process each row
        for index, row in df.iterrows():
            try:
                # Convert row to dict and handle NaN values
                company_data = {}
                for col in df.columns:
                    value = row[col]
                    if pd.isna(value):
                        company_data[col] = None
                    else:
                        company_data[col] = str(value)
                
                # Map CSV columns to database columns
                mapped_data = {}
                mapped_data['company_name'] = company_data.get('company_name', '')
                mapped_data['position_title'] = company_data.get('role_title', '')
                mapped_data['req_skills_text'] = company_data.get('skills_required', '')
                mapped_data['job_description'] = company_data.get('description', '')
                mapped_data['location_city'] = company_data.get('location_city', '')
                mapped_data['location_state'] = company_data.get('location_state', '')
                
                # Handle salary range - extract numeric value
                salary_range = company_data.get('salary_range', '')
                if salary_range and 'LPA' in salary_range:
                    try:
                        # Extract number from "11 LPA" format
                        salary_num = float(salary_range.split()[0])
                        mapped_data['stipend'] = salary_num * 10000  # Convert LPA to monthly
                    except:
                        mapped_data['stipend'] = None
                else:
                    mapped_data['stipend'] = None
                
                mapped_data['openings'] = 1  # Default to 1 opening
                mapped_data['priority_flags'] = company_data.get('experience_required', '')
                mapped_data['other_notes'] = f"Experience Required: {company_data.get('experience_required', '')}, Salary Range: {company_data.get('salary_range', '')}"
                
                # Create company record
                db_company = Company(**mapped_data)
                db.add(db_company)
                accepted += 1
                
            except Exception as e:
                rejected += 1
                errors.append(f"Row {index + 2}: {str(e)}")
        
        db.commit()
        
        return CSVUploadResponse(
            message=f"Successfully processed {accepted} companies",
            accepted=accepted,
            rejected=rejected,
            errors=errors
        )
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing CSV: {str(e)}")

@app.post("/allocate", response_model=AllocationResponse)
async def run_allocation(db: Session = Depends(get_db)):
    """Run AI allocation with cosine similarity and greedy one-student-per-opening assignment."""
    import time
    start_time = time.time()

    # Load data from DB
    students = db.query(Student).all()
    companies = db.query(Company).all()

    if not students:
        raise HTTPException(status_code=400, detail="No students found. Please upload student data first.")
    if not companies:
        raise HTTPException(status_code=400, detail="No companies found. Please upload company data first.")

    # Prepare dicts for AI encoder
    students_data = []
    for s in students:
        students_data.append({
            "student_id": s.student_id,
            "first_name": s.first_name,
            "last_name": s.last_name,
            "skills_text": s.skills_text,
            "degree": s.degree,
            "stream": s.stream,
            "city": s.city,
            "state": s.state,
            "preferred_locations": s.preferred_locations,
            "other_notes": s.other_notes,
        })

    companies_data = []
    company_capacity = {}
    for c in companies:
        companies_data.append({
            "company_id": c.company_id,
            "company_name": c.company_name,
            "position_title": c.position_title,
            "req_skills_text": c.req_skills_text,
            "job_description": c.job_description,
            "location_city": c.location_city,
            "location_state": c.location_state,
            "priority_flags": c.priority_flags,
            "other_notes": c.other_notes,
        })
        company_capacity[c.company_id] = max(int(c.openings or 1), 1)

    # Build FAISS index on company embeddings and compute full score matrix
    ai_engine.build_company_index(companies_data)
    # Build student texts and embeddings
    student_texts = [ai_engine.build_text_representation(s, "student") for s in students_data]
    student_embeddings = ai_engine.encode_texts(student_texts)
    company_embeddings = ai_engine.company_embeddings

    # Compute cosine similarity scores for all pairs
    scores_matrix = np.matmul(student_embeddings.astype('float32'), company_embeddings.astype('float32').T)

    # Build candidate list of all pairs
    candidates = []
    company_ids = [c["company_id"] for c in companies_data]
    company_name_by_id = {c["company_id"]: c["company_name"] for c in companies_data}
    for i, s in enumerate(students_data):
        for j, cid in enumerate(company_ids):
            candidates.append({
                "student_id": s["student_id"],
                "student_name": f"{s['first_name']} {s['last_name']}",
                "company_id": cid,
                "score": float(scores_matrix[i, j]),
            })

    # Greedy assignment over all pairs
    candidates.sort(key=lambda x: x["score"], reverse=True)
    assigned_students = set()
    remaining_capacity = dict(company_capacity)
    final_matches: List[AllocationResult] = []

    for cand in candidates:
        if sum(remaining_capacity.values()) <= 0:
            break
        sid = cand["student_id"]
        cid = cand["company_id"]
        if sid in assigned_students:
            continue
        if remaining_capacity.get(cid, 0) <= 0:
            continue
        assigned_students.add(sid)
        remaining_capacity[cid] = remaining_capacity.get(cid, 0) - 1
        final_matches.append(AllocationResult(
            student_id=sid,
            student_name=cand["student_name"],
            company_id=cid,
            company_name=company_name_by_id.get(cid, ""),
            score=float(cand["score"]),
        ))

    # Compute unallocated students (those not in assigned_students)
    assigned_set = assigned_students
    unallocated: List[NotAllocatedStudent] = []
    for s in students:
        if s.student_id not in assigned_set:
            unallocated.append(NotAllocatedStudent(student_id=s.student_id, student_name=f"{s.first_name} {s.last_name}"))

    # Persist results
    db.query(Allocation).delete()
    for m in final_matches:
        db.add(Allocation(student_id=m.student_id, company_id=m.company_id, score=m.score))
    db.commit()

    processing_time = time.time() - start_time
    return AllocationResponse(
        allocations=final_matches,
        unallocated_students=unallocated,
        unallocated_count=len(unallocated),
        total_students=len(students),
        total_companies=len(companies),
        processing_time=processing_time,
    )

@app.get("/allocations", response_model=List[AllocationResult])
async def get_allocations(db: Session = Depends(get_db)):
    """Return all allocation results (no pagination)."""
    rows = db.query(Allocation).join(Student).join(Company).all()
    results: List[AllocationResult] = []
    for a in rows:
        results.append(AllocationResult(
            student_id=a.student_id,
            student_name=f"{a.student.first_name} {a.student.last_name}",
            company_id=a.company_id,
            company_name=a.company.company_name,
            score=a.score,
        ))
    return results

@app.get("/export/allocations")
async def export_allocations(db: Session = Depends(get_db)):
    """Export allocations as CSV"""
    from fastapi.responses import StreamingResponse
    
    allocations = db.query(Allocation).join(Student).join(Company).all()
    
    # Create CSV content
    csv_content = "student_id,student_name,company_id,company_name,score\n"
    for allocation in allocations:
        csv_content += f"{allocation.student_id},{allocation.student.first_name} {allocation.student.last_name},{allocation.company_id},{allocation.company.company_name},{allocation.score}\n"
    
    return StreamingResponse(
        io.StringIO(csv_content),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=allocations.csv"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

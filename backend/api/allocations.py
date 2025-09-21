from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List
import io
import time
import numpy as np

from core.database import get_db
from core.models import Student, Company, Allocation
from core.schemas import AllocationResult, AllocationResponse, NotAllocatedStudent
from services.ai_engine import AIAllocationEngine

router = APIRouter(prefix="/allocate", tags=["allocations"])

# Initialize AI engine
ai_engine = AIAllocationEngine()

@router.post("/", response_model=AllocationResponse)
async def run_allocation(db: Session = Depends(get_db)):
    """Run AI allocation with cosine similarity and greedy one-student-per-opening assignment."""
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

@router.get("/", response_model=List[AllocationResult])
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

@router.get("/export")
async def export_allocations(db: Session = Depends(get_db)):
    """Export allocations as CSV"""
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

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from core.database import get_db
from core.models import Company
from core.schemas import CompanyCreate, Company as CompanySchema

router = APIRouter(prefix="/companies", tags=["companies"])

@router.post("/", response_model=CompanySchema)
async def create_company(company: CompanyCreate, db: Session = Depends(get_db)):
    """Create a new company record"""
    db_company = Company(**company.dict())
    db.add(db_company)
    db.commit()
    db.refresh(db_company)
    return db_company

@router.get("/", response_model=List[CompanySchema])
async def get_companies(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all companies"""
    companies = db.query(Company).offset(skip).limit(limit).all()
    return companies

@router.get("/{company_id}", response_model=CompanySchema)
async def get_company(company_id: int, db: Session = Depends(get_db)):
    """Get a specific company by ID"""
    company = db.query(Company).filter(Company.company_id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company

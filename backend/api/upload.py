from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import pandas as pd
import io

from core.database import get_db
from core.models import Student, Company, Allocation
from core.schemas import CSVUploadResponse

router = APIRouter(prefix="/upload", tags=["upload"])

@router.post("/students", response_model=CSVUploadResponse)
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

@router.post("/companies", response_model=CSVUploadResponse)
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

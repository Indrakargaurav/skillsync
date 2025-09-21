# API Documentation

## Base URL
```
http://localhost:8000
```

## Authentication
Currently, no authentication is required for API endpoints.

## Endpoints

### Health Check
- **GET** `/health`
- **Description**: Check if the API is running
- **Response**: 
```json
{
  "status": "healthy",
  "message": "API is running"
}
```

### Students

#### Create Student
- **POST** `/students`
- **Description**: Create a new student record
- **Request Body**:
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "skills_text": "Python, JavaScript, React",
  "degree": "B.Tech",
  "stream": "Computer Science",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "caste": "General",
  "gender": "Male",
  "financial_status": "Low",
  "preferred_locations": "Mumbai, Pune",
  "other_notes": "Interested in web development"
}
```

#### Get All Students
- **GET** `/students`
- **Query Parameters**:
  - `skip` (int, optional): Number of records to skip (default: 0)
  - `limit` (int, optional): Maximum number of records to return (default: 100)

#### Get Student by ID
- **GET** `/students/{student_id}`
- **Path Parameters**:
  - `student_id` (int): Student ID

### Companies

#### Create Company
- **POST** `/companies`
- **Description**: Create a new company position
- **Request Body**:
```json
{
  "company_name": "TechCorp",
  "position_title": "Frontend Developer",
  "req_skills_text": "React, JavaScript, CSS",
  "job_description": "Develop user interfaces",
  "location_city": "Mumbai",
  "location_state": "Maharashtra",
  "stipend": 15000.0,
  "openings": 2,
  "priority_flags": "High",
  "other_notes": "Remote work available"
}
```

#### Get All Companies
- **GET** `/companies`
- **Query Parameters**:
  - `skip` (int, optional): Number of records to skip (default: 0)
  - `limit` (int, optional): Maximum number of records to return (default: 100)

#### Get Company by ID
- **GET** `/companies/{company_id}`
- **Path Parameters**:
  - `company_id` (int): Company ID

### File Upload

#### Upload Students CSV
- **POST** `/upload/students`
- **Description**: Upload CSV file with student data
- **Request**: Multipart form data with `file` field
- **Response**:
```json
{
  "message": "Successfully processed 10 students",
  "accepted": 10,
  "rejected": 0,
  "errors": []
}
```

#### Upload Companies CSV
- **POST** `/upload/companies`
- **Description**: Upload CSV file with company data
- **Request**: Multipart form data with `file` field
- **Response**:
```json
{
  "message": "Successfully processed 5 companies",
  "accepted": 5,
  "rejected": 0,
  "errors": []
}
```

### Allocation

#### Run Allocation
- **POST** `/allocate`
- **Description**: Run AI-powered allocation between students and companies
- **Response**:
```json
{
  "allocations": [
    {
      "student_id": 1,
      "student_name": "John Doe",
      "company_id": 1,
      "company_name": "TechCorp",
      "score": 0.85
    }
  ],
  "unallocated_students": [
    {
      "student_id": 2,
      "student_name": "Jane Smith"
    }
  ],
  "unallocated_count": 1,
  "total_students": 10,
  "total_companies": 5,
  "processing_time": 2.5
}
```

#### Get Allocations
- **GET** `/allocations`
- **Description**: Get the latest allocation results
- **Response**: Array of allocation results

#### Export Allocations
- **GET** `/export/allocations`
- **Description**: Export allocation results as CSV file
- **Response**: CSV file download

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Error message describing the issue"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 422 Validation Error
```json
{
  "detail": [
    {
      "loc": ["field_name"],
      "msg": "error message",
      "type": "error_type"
    }
  ]
}
```

## CSV Format Requirements

### Students CSV
Required columns: `first_name`, `last_name`
Optional columns: `skills_text`, `degree`, `stream`, `city`, `state`, `pincode`, `caste`, `gender`, `financial_status`, `preferred_locations`, `other_notes`

### Companies CSV
Required columns: `company_name`
Optional columns: `position_title`, `req_skills_text`, `job_description`, `location_city`, `location_state`, `stipend`, `openings`, `priority_flags`, `other_notes`

## Rate Limiting
Currently, no rate limiting is implemented.

## CORS
The API supports CORS for the configured origins.

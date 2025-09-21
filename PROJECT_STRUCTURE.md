# Project Structure Overview

## 📁 Root Directory Structure

```
sih_33/
├── 📄 README.md                          # Main project documentation
├── 📄 PROJECT_STRUCTURE.md               # This file - project structure guide
├── 📄 docker-compose.yml                 # Docker orchestration
├── 📄 env.example                       # Environment variables template
├── 📄 .gitignore                        # Git ignore rules
├── 📁 backend/                          # Python FastAPI backend
├── 📁 frontend/                         # Next.js React frontend
├── 📁 data/                             # Sample data files
├── 📁 docs/                             # Documentation
└── 📁 scripts/                          # Utility scripts
```

## 🐍 Backend Structure (Python/FastAPI)

```
backend/
├── 📁 app/                              # Main application module
│   ├── 📄 __init__.py
│   ├── 📄 main.py                      # Main FastAPI application
│   └── 📄 main_simple.py               # Simplified version
├── 📁 api/                              # API route handlers
│   ├── 📄 __init__.py
│   ├── 📄 students.py                  # Student endpoints
│   ├── 📄 companies.py                 # Company endpoints
│   ├── 📄 upload.py                    # File upload endpoints
│   └── 📄 allocations.py               # Allocation endpoints
├── 📁 core/                             # Core business logic
│   ├── 📄 __init__.py
│   ├── 📄 models.py                    # SQLAlchemy models
│   ├── 📄 schemas.py                   # Pydantic schemas
│   └── 📄 database.py                  # Database configuration
├── 📁 services/                         # Business services
│   ├── 📄 __init__.py
│   └── 📄 ai_engine.py                 # AI matching engine
├── 📄 requirements.txt                 # Python dependencies
├── 📄 Dockerfile                       # Backend Docker configuration
├── 📄 run.py                           # Production runner
├── 📄 run_simple.py                    # Simple runner
└── 📄 internship.db                   # SQLite database
```

## ⚛️ Frontend Structure (Next.js/React)

```
frontend/
├── 📁 src/
│   ├── 📁 app/                         # Next.js app router
│   │   ├── 📄 page.tsx                 # Home page
│   │   ├── 📄 layout.tsx               # Root layout
│   │   ├── 📄 globals.css              # Global styles
│   │   ├── 📁 upload/
│   │   │   └── 📄 page.tsx             # CSV upload page
│   │   ├── 📁 manual/
│   │   │   └── 📄 page.tsx             # Manual entry page
│   │   └── 📁 allocate/
│   │       └── 📄 page.tsx             # Allocation page
│   ├── 📁 components/                   # React components
│   │   ├── 📁 ui/                      # UI components
│   │   │   ├── 📄 Button.tsx
│   │   │   ├── 📄 Card.tsx
│   │   │   ├── 📄 Input.tsx
│   │   │   └── 📄 Textarea.tsx
│   │   ├── 📁 forms/                   # Form components
│   │   └── 📁 layout/                  # Layout components
│   │       └── 📄 Layout.tsx
│   ├── 📁 hooks/                       # Custom React hooks
│   │   └── 📄 useApi.ts                # API hooks
│   ├── 📁 lib/                         # Utility functions
│   │   └── 📄 utils.ts
│   ├── 📁 types/                       # TypeScript types
│   │   └── 📄 index.ts
│   └── 📁 utils/                       # Utility functions
│       ├── 📄 api.ts                   # API client
│       └── 📄 constants.ts             # Constants
├── 📄 package.json                     # Node.js dependencies
├── 📄 next.config.ts                   # Next.js configuration
├── 📄 tailwind.config.js               # Tailwind CSS configuration
├── 📄 tsconfig.json                    # TypeScript configuration
└── 📄 Dockerfile                       # Frontend Docker configuration
```

## 📊 Data Structure

```
data/
├── 📄 students_profiles_with_city.csv   # Sample student data
└── 📄 company_positions.csv            # Sample company data
```

## 📚 Documentation Structure

```
docs/
├── 📄 API.md                           # API documentation
├── 📄 DEPLOYMENT.md                    # Deployment guide
└── 📄 CONTRIBUTING.md                  # Contribution guidelines
```

## 🛠️ Scripts Structure

```
scripts/
├── 📄 setup.sh                         # Linux/Mac setup script
├── 📄 setup.bat                        # Windows setup script
└── 📄 test_upload.py                   # Test script
```

## 🏗️ Architecture Patterns

### Backend Architecture
- **MVC Pattern**: Models (SQLAlchemy), Views (FastAPI routes), Controllers (API handlers)
- **Service Layer**: Business logic separated into services
- **Repository Pattern**: Database operations abstracted
- **Dependency Injection**: FastAPI's dependency system

### Frontend Architecture
- **Component-Based**: Reusable React components
- **Custom Hooks**: Business logic in hooks
- **API Client**: Centralized API communication
- **Type Safety**: Full TypeScript implementation

## 🔧 Configuration Files

### Backend Configuration
- `requirements.txt`: Python dependencies
- `Dockerfile`: Container configuration
- `env.example`: Environment variables template

### Frontend Configuration
- `package.json`: Node.js dependencies and scripts
- `next.config.ts`: Next.js configuration
- `tailwind.config.js`: Tailwind CSS configuration
- `tsconfig.json`: TypeScript configuration

### Project Configuration
- `docker-compose.yml`: Multi-container orchestration
- `.gitignore`: Git ignore patterns
- `README.md`: Project documentation

## 🚀 Development Workflow

1. **Backend Development**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python run.py
   ```

2. **Frontend Development**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Docker Development**:
   ```bash
   docker-compose up -d
   ```

## 📋 Key Features by Module

### Backend Modules
- **API Routes**: RESTful endpoints for CRUD operations
- **AI Engine**: Sentence transformers and FAISS for matching
- **Database**: SQLAlchemy ORM with SQLite/PostgreSQL support
- **File Upload**: CSV processing with validation

### Frontend Modules
- **Pages**: Next.js app router with dynamic routing
- **Components**: Reusable UI components with TypeScript
- **Hooks**: Custom React hooks for API integration
- **Utils**: Helper functions and constants

## 🔒 Security Considerations

- Environment variables for sensitive data
- CORS configuration for API access
- Input validation on both frontend and backend
- SQL injection prevention through ORM
- File upload validation and sanitization

## 📈 Performance Optimizations

- **Backend**: Lazy loading of AI models, database connection pooling
- **Frontend**: Code splitting, image optimization, caching strategies
- **Database**: Proper indexing, query optimization
- **AI**: FAISS indexing for fast similarity search

This structure provides a scalable, maintainable, and well-organized codebase that follows best practices for both backend and frontend development.

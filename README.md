# AI-Powered Internship Allocation Engine

A full-stack web application that intelligently matches students with internship opportunities using advanced AI technology, including sentence transformers and FAISS for semantic matching.

## 🚀 Features

- **AI-Powered Matching**: Uses sentence transformers and FAISS for intelligent student-company matching
- **Multiple Data Input**: CSV upload and manual entry options
- **Real-time Processing**: Fast allocation with progress tracking
- **Responsive UI**: Modern, mobile-friendly interface
- **Export Functionality**: Download results as CSV files
- **Scalable Architecture**: Handles 200+ students and 50+ companies efficiently

## 🏗️ Project Structure

```
sih_33/
├── README.md                          # Project documentation
├── docker-compose.yml                 # Docker orchestration
├── .env.example                       # Environment variables template
├── .gitignore                         # Git ignore rules
├── backend/                           # Python FastAPI backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                    # Main FastAPI application
│   │   ├── main_simple.py            # Simplified version
│   │   ├── models.py                 # SQLAlchemy models
│   │   ├── schemas.py                 # Pydantic schemas
│   │   ├── database.py                # Database configuration
│   │   └── ai_engine.py               # AI matching engine
│   ├── requirements.txt               # Python dependencies
│   ├── run.py                        # Production runner
│   ├── run_simple.py                 # Simple runner
│   └── internship.db                 # SQLite database
├── frontend/                          # Next.js React frontend
│   ├── src/
│   │   ├── app/                      # Next.js app router
│   │   │   ├── page.tsx              # Home page
│   │   │   ├── layout.tsx            # Root layout
│   │   │   ├── globals.css           # Global styles
│   │   │   ├── upload/page.tsx       # CSV upload page
│   │   │   ├── manual/page.tsx       # Manual entry page
│   │   │   └── allocate/page.tsx     # Allocation page
│   │   ├── components/               # React components
│   │   │   ├── Layout.tsx            # Main layout component
│   │   │   └── ui/                   # UI components
│   │   │       ├── Button.tsx
│   │   │       ├── Card.tsx
│   │   │       ├── Input.tsx
│   │   │       └── Textarea.tsx
│   │   ├── lib/                      # Utility functions
│   │   │   └── utils.ts
│   │   └── types/                    # TypeScript types
│   │       └── index.ts
│   ├── package.json                  # Node.js dependencies
│   ├── next.config.ts                # Next.js configuration
│   ├── tailwind.config.js            # Tailwind CSS configuration
│   └── tsconfig.json                 # TypeScript configuration
├── data/                              # Sample data files
│   ├── students_profiles_with_city.csv
│   └── company_positions.csv
├── docs/                              # Documentation
│   ├── API.md                        # API documentation
│   ├── DEPLOYMENT.md                 # Deployment guide
│   └── CONTRIBUTING.md               # Contribution guidelines
└── scripts/                          # Utility scripts
    ├── setup.sh                      # Project setup script
    └── test_upload.py                # Test script
```

## 🛠️ Technology Stack

### Backend
- **Framework**: FastAPI
- **Database**: SQLite (with PostgreSQL support)
- **ORM**: SQLAlchemy
- **AI/ML**: Sentence Transformers, FAISS
- **Validation**: Pydantic
- **Server**: Uvicorn

### Frontend
- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components
- **Icons**: Lucide React

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm or yarn

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python run.py
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 📊 How It Works

1. **Data Upload**: Upload student and company CSV files or enter manually
2. **AI Processing**: System creates embeddings using sentence transformers
3. **Matching**: FAISS indexing finds optimal matches using cosine similarity
4. **Results**: View matches with compatibility scores and export data

## 🔧 Configuration

Copy `.env.example` to `.env` and configure:
```env
DATABASE_URL=sqlite:///./internship.db
CORS_ORIGINS=http://localhost:3000
```

## 📈 Performance

- **Scalability**: Handles 200+ students and 50+ companies
- **Speed**: Sub-30 second processing time
- **Accuracy**: Semantic understanding of skills and requirements
- **Flexibility**: Supports various CSV formats

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository.

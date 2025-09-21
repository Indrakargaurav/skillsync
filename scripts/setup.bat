@echo off
REM Setup script for AI-Powered Internship Allocation Engine (Windows)

echo 🚀 Setting up AI-Powered Internship Allocation Engine...

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed. Please install Python 3.8+ and try again.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ and try again.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm and try again.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Setup backend
echo 📦 Setting up backend...
cd backend

REM Create virtual environment
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing Python dependencies...
pip install -r requirements.txt

echo ✅ Backend setup complete

REM Setup frontend
echo 📦 Setting up frontend...
cd ..\frontend

REM Install dependencies
echo Installing Node.js dependencies...
npm install

echo ✅ Frontend setup complete

REM Create environment file if it doesn't exist
cd ..
if not exist ".env" (
    echo Creating environment file...
    copy env.example .env
    echo ✅ Environment file created. Please update .env with your configuration.
)

echo.
echo 🎉 Setup complete!
echo.
echo To start the application:
echo 1. Backend: cd backend ^&^& venv\Scripts\activate ^&^& python run.py
echo 2. Frontend: cd frontend ^&^& npm run dev
echo.
echo Access the application at:
echo - Frontend: http://localhost:3000
echo - Backend API: http://localhost:8000
echo - API Docs: http://localhost:8000/docs

pause

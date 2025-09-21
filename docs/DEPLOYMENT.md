# Deployment Guide

## Prerequisites

- Python 3.8+
- Node.js 18+
- PostgreSQL (for production)
- Docker (optional)

## Local Development

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

## Production Deployment

### Using Docker

1. **Build and run with Docker Compose**:
```bash
docker-compose up -d
```

2. **Environment Configuration**:
   - Copy `env.example` to `.env`
   - Update database URL for PostgreSQL
   - Configure CORS origins

### Manual Deployment

#### Backend Deployment

1. **Install Dependencies**:
```bash
cd backend
pip install -r requirements.txt
```

2. **Database Setup**:
```bash
# For PostgreSQL
export DATABASE_URL="postgresql://user:password@localhost:5432/internship_db"
```

3. **Run Production Server**:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

#### Frontend Deployment

1. **Build Application**:
```bash
cd frontend
npm run build
```

2. **Start Production Server**:
```bash
npm start
```

### Cloud Deployment

#### Heroku

1. **Backend**:
```bash
# Create Procfile
echo "web: uvicorn app.main:app --host 0.0.0.0 --port \$PORT" > Procfile

# Deploy
git push heroku main
```

2. **Frontend**:
```bash
# Configure buildpack
heroku buildpacks:set heroku/nodejs

# Deploy
git push heroku main
```

#### AWS EC2

1. **Install Dependencies**:
```bash
# Python
sudo apt update
sudo apt install python3-pip python3-venv

# Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. **Setup Application**:
```bash
# Clone repository
git clone <repository-url>
cd sih_33

# Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Frontend
cd ../frontend
npm install
npm run build
```

3. **Configure Nginx**:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### Docker Deployment

1. **Backend Dockerfile**:
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

2. **Frontend Dockerfile**:
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

## Environment Variables

### Backend
- `DATABASE_URL`: Database connection string
- `CORS_ORIGINS`: Allowed CORS origins
- `AI_MODEL_NAME`: AI model name (default: all-MiniLM-L6-v2)
- `HOST`: Server host (default: 0.0.0.0)
- `PORT`: Server port (default: 8000)
- `DEBUG`: Debug mode (default: False)

### Frontend
- `NEXT_PUBLIC_API_URL`: Backend API URL

## Database Migration

### SQLite to PostgreSQL
```bash
# Export from SQLite
sqlite3 internship.db .dump > dump.sql

# Import to PostgreSQL
psql -h localhost -U username -d internship_db -f dump.sql
```

## Monitoring

### Health Checks
- Backend: `GET /health`
- Frontend: Check if port 3000 is responding

### Logging
```bash
# Backend logs
tail -f backend.log

# Frontend logs
pm2 logs frontend
```

## Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **CORS**: Configure appropriate origins
3. **Database**: Use strong passwords and SSL
4. **HTTPS**: Use SSL certificates in production
5. **Rate Limiting**: Implement if needed

## Performance Optimization

1. **Backend**:
   - Use multiple workers: `--workers 4`
   - Enable connection pooling
   - Cache AI model loading

2. **Frontend**:
   - Enable compression
   - Use CDN for static assets
   - Implement caching strategies

## Troubleshooting

### Common Issues

1. **Database Connection**:
   - Check DATABASE_URL format
   - Verify database is running
   - Check firewall settings

2. **CORS Errors**:
   - Verify CORS_ORIGINS configuration
   - Check frontend URL

3. **AI Model Loading**:
   - Ensure sufficient memory
   - Check model download

### Logs
```bash
# Backend
uvicorn app.main:app --log-level debug

# Frontend
npm run dev -- --verbose
```

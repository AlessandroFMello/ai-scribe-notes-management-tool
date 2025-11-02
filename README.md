# AI Scribe Notes Management Tool

A full-stack AI-powered clinical notes management system that enables healthcare providers to create, view, and manage patient notes with AI-generated transcriptions and summaries. The application supports both text input and audio uploads, automatically processing them using OpenAI's Whisper and GPT models.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start (Docker - Recommended)](#quick-start-docker---recommended)
- [Manual Setup](#manual-setup)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Development](#development)

## Features

- **Patient Management**: Full CRUD operations for patient records
- **Note Creation**: Multiple input methods:
  - Free text input
  - Audio file upload (with automatic transcription via Whisper)
  - Mixed mode (text + audio)
- **AI Processing**:
  - Automatic audio transcription using OpenAI Whisper
  - AI-generated clinical summaries
  - SOAP format structuring (Subjective, Objective, Assessment, Plan)
- **Note Management**:
  - View all notes with patient information
  - Filter notes by patient
  - Detailed note view with full content
  - Accordion-based note creation form
- **Data Persistence**: PostgreSQL database with Prisma ORM

## Tech Stack

### Backend

- **Runtime**: Node.js 20+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL 15
- **ORM**: Prisma
- **AI Services**: OpenAI (Whisper for transcription, GPT-3.5-turbo for summarization)
- **File Upload**: Multer

### Frontend

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: CSS (no frameworks)

### Infrastructure

- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx (for frontend)

## Prerequisites

- **Docker** and **Docker Compose** (recommended)
- **Node.js** 20+ (for manual setup)
- **PostgreSQL** 15 (for manual setup)
- **OpenAI API Key** ([Get one here](https://platform.openai.com/api-keys))

## Quick Start (Docker - Recommended)

### 1. Clone the Repository

```bash
git clone git@github.com:AlessandroFMello/ai-scribe-notes-management-tool.git
cd ai-scribe-notes-management-tool
```

### 2. Set Up Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your OpenAI API key
# The .env file must be in the project root (same level as docker-compose.yml)
```

Required variables:

- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `DATABASE_URL`: PostgreSQL connection string (has default for Docker)
- `PORT`: Backend server port (default: 3000)
- `VITE_API_URL`: Frontend API URL (optional, defaults to http://localhost:3000)

### 3. Start All Services

```bash
# Start all services (PostgreSQL, Backend, Frontend)
docker compose up -d

# View logs for all services
docker compose logs -f

# View specific service logs
docker compose logs -f backend
docker compose logs -f frontend
```

### 4. Access the Application

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/api/health

### 5. Stop Services

```bash
# Stop all services
docker compose down

# Stop and remove volumes (clean slate)
docker compose down -v
```

## Manual Setup

If you prefer to run services individually without Docker:

### Backend Setup

See [backend/README.md](./backend/README.md) for detailed instructions.

### Frontend Setup

See [frontend/README.md](./frontend/README.md) for detailed instructions.

## Environment Variables

All environment variables are defined in `.env` file at the project root. See `.env.example` for a complete list with descriptions.

**Required:**

- `OPENAI_API_KEY`: OpenAI API key for AI services

**Optional (with defaults):**

- `DATABASE_URL`: PostgreSQL connection string
- `PORT`: Backend server port (default: 3000)
- `NODE_ENV`: Environment mode (development/production)
- `UPLOAD_DIR`: Directory for uploaded files (default: ./uploads)
- `MAX_FILE_SIZE`: Maximum file size in bytes (default: 10485760 = 10MB)
- `VITE_API_URL`: Frontend API URL (default: http://localhost:3000)

## API Endpoints

### Patients

- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient by ID
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Notes

- `GET /api/notes` - Get all notes
- `GET /api/notes/:id` - Get note by ID
- `POST /api/notes` - Create new note (supports multipart/form-data with audioFile)
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `POST /api/notes/:id/process-ai` - Process existing note with AI
- `POST /api/notes/upload` - Upload audio file only
- `GET /api/notes/audio/*` - Serve audio file

### Response Format

All endpoints return a consistent format:

```json
{
  "code": 200,
  "data": { ... },
  "message": "Optional message"
}
```

## Project Structure

```
ai-scribe-notes-management-tool/
├── backend/           # Backend service (Node.js/Express)
│   ├── src/
│   │   ├── api/      # API routes, controllers, services
│   │   ├── app.ts    # Express app configuration
│   │   ├── server.ts # Server entry point
│   │   └── types/    # TypeScript type definitions
│   ├── prisma/       # Database schema and migrations
│   └── Dockerfile    # Backend container definition
├── frontend/         # Frontend service (React/Vite)
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── services/    # API service layer
│   │   └── types/        # TypeScript types
│   ├── Dockerfile    # Frontend container definition
│   └── nginx.conf    # Nginx configuration
├── docker-compose.yml # Docker Compose configuration
├── .env.example      # Environment variables template
└── README.md         # This file
```

## Development

### Running Individual Services

- **Backend only**: See [backend/README.md](./backend/README.md)
- **Frontend only**: See [frontend/README.md](./frontend/README.md)

### Database Access

```bash
# Access Prisma Studio (database GUI)
cd backend
npm run db:studio
# Opens at http://localhost:5555
```

### Testing API Endpoints

You can test the API using curl, Postman, or any HTTP client:

```bash
# Get all patients
curl http://localhost:3000/api/patients

# Get all notes
curl http://localhost:3000/api/notes

# Create a text note
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "patient-uuid-here",
    "rawText": "Patient presented with headache"
  }'

# Upload audio note
curl -X POST http://localhost:3000/api/notes \
  -F "patientId=patient-uuid-here" \
  -F "audioFile=@/path/to/audio.mp3"
```

## License

This project is for technical interview purposes.

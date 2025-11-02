# AI Scribe Backend

Node.js/Express backend service for the AI Scribe Notes Management Tool. Provides REST API for managing patients and clinical notes with AI-powered transcription and summarization.

## Features

- RESTful API for patients and notes
- OpenAI integration (Whisper for transcription, GPT-3.5-turbo for summarization)
- File upload handling (audio files)
- PostgreSQL database with Prisma ORM
- Environment variable validation on startup
- TypeScript for type safety

## Prerequisites

- Node.js 20 or higher
- PostgreSQL 15 (or use Docker)
- OpenAI API key

## Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the **project root** (not in backend folder):

```env
OPENAI_API_KEY=your_openai_api_key_here
DATABASE_URL=postgresql://postgres:password@localhost:5432/ai_scribe_db?schema=public
PORT=3000
NODE_ENV=development
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
```

**Important**: The backend loads `.env` from the project root, not from the backend directory.

### 3. Set Up Database

```bash
# Generate Prisma Client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed the database with sample data
npm run db:seed
```

### 4. Build the Project

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` directory.

## Running the Backend

### Development Mode

```bash
npm run dev
```

This starts the server with hot-reload using `tsx watch`. The server will run on `http://localhost:3000` (or the port specified in `PORT` env variable).

### Production Mode

```bash
# Build first
npm run build

# Start server
npm start
```

### Using Docker

```bash
# From project root
docker compose up backend
```

## Available Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push database schema changes
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio (database GUI)

## API Endpoints

### Base URL

All endpoints are prefixed with `/api`

### Health Check

| Method | Endpoint      | Description                                          |
| ------ | ------------- | ---------------------------------------------------- |
| GET    | `/api/health` | Health check endpoint (checks database connectivity) |

Returns:

- `200`: Service is healthy (database connected)
- `503`: Service is unhealthy (database connection failed)

**Response (200):**

```json
{
  "code": 200,
  "data": {
    "status": "healthy",
    "timestamp": "2025-01-02T10:00:00.000Z",
    "service": "ai-scribe-backend"
  }
}
```

### Patients

| Method | Endpoint            | Description        |
| ------ | ------------------- | ------------------ |
| GET    | `/api/patients`     | Get all patients   |
| GET    | `/api/patients/:id` | Get patient by ID  |
| POST   | `/api/patients`     | Create new patient |
| PUT    | `/api/patients/:id` | Update patient     |
| DELETE | `/api/patients/:id` | Delete patient     |

### Notes

| Method | Endpoint                    | Description                             |
| ------ | --------------------------- | --------------------------------------- |
| GET    | `/api/notes`                | Get all notes                           |
| GET    | `/api/notes/:id`            | Get note by ID                          |
| POST   | `/api/notes`                | Create new note (supports audio upload) |
| PUT    | `/api/notes/:id`            | Update note                             |
| DELETE | `/api/notes/:id`            | Delete note                             |
| POST   | `/api/notes/:id/process-ai` | Process existing note with AI           |
| POST   | `/api/notes/upload`         | Upload audio file only                  |
| GET    | `/api/notes/audio/*`        | Serve audio file                        |

### Request/Response Format

All endpoints return:

```json
{
  "code": 200,
  "data": { ... },
  "message": "Optional message"
}
```

### Example Requests

**Create Patient:**

```bash
curl -X POST http://localhost:3000/api/patients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "patientId": "P001",
    "dateOfBirth": "1990-01-01"
  }'
```

**Create Note with Text:**

```bash
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "patient-uuid",
    "rawText": "Patient complains of headache"
  }'
```

**Create Note with Audio:**

```bash
curl -X POST http://localhost:3000/api/notes \
  -F "patientId=patient-uuid" \
  -F "audioFile=@/path/to/audio.mp3"
```

## Environment Variables

The backend reads environment variables from the `.env` file in the **project root**. See `.env.example` for all available variables.

**Required:**

- `OPENAI_API_KEY`: Your OpenAI API key

**Optional (with defaults):**

- `DATABASE_URL`: PostgreSQL connection string
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode (default: production)
- `UPLOAD_DIR`: Directory for uploads (default: ./uploads)
- `MAX_FILE_SIZE`: Max file size in bytes (default: 10485760 = 10MB)

## Project Structure

```
backend/
├── src/
│   ├── api/
│   │   ├── controllers/    # Request handlers
│   │   ├── middlewares/    # Express middlewares
│   │   ├── models/         # Database models (Prisma)
│   │   ├── routes/         # API routes
│   │   ├── schemas/        # Zod validation schemas
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
│   ├── app.ts              # Express app configuration
│   ├── server.ts           # Server entry point
│   └── types/              # TypeScript type definitions
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── migrations/         # Database migrations
│   └── seed.ts             # Seed data script
├── uploads/                # Uploaded audio files (gitignored)
├── Dockerfile              # Docker container definition
├── start.sh                # Docker startup script
├── package.json
└── tsconfig.json
```

## Database

The project uses PostgreSQL with Prisma ORM. The database schema is defined in `prisma/schema.prisma`.

### Models

- **Patient**: Patient information (id, name, patientId, dateOfBirth, etc.)
- **Note**: Clinical notes (id, patientId, rawText, transcribedText, aiSummary, soapFormat, etc.)

### Database Commands

```bash
# Generate Prisma Client after schema changes
npm run db:generate

# Create and run migration
npm run db:migrate

# Push schema changes without migration
npm run db:push

# Seed database
npm run db:seed

# Open Prisma Studio (database GUI)
npm run db:studio
```

## AI Services

The backend integrates with OpenAI for:

1. **Audio Transcription** (Whisper)
   - Transcribes uploaded audio files to text
   - Used when creating notes with audio upload

2. **Note Summarization** (GPT-3.5-turbo)
   - Generates clinical summaries from text
   - Creates SOAP format (Subjective, Objective, Assessment, Plan)

## Error Handling

All errors are handled by the error middleware and return standardized responses:

```json
{
  "code": 400,
  "message": "Error message"
}
```

## Development Tips

1. **Hot Reload**: Use `npm run dev` for automatic restarts on code changes
2. **Database GUI**: Use `npm run db:studio` to visually inspect and edit database records
3. **Logs**: Check console output for detailed error messages
4. **Environment Validation**: The server validates environment variables on startup and exits if required ones are missing

## Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
psql -U postgres -d ai_scribe_db -c "SELECT 1"

# Verify DATABASE_URL in .env file
# Make sure .env is in project root, not backend folder
```

### Port Already in Use

```bash
# Change PORT in .env file or kill process using port 3000
lsof -ti:3000 | xargs kill
```

### OpenAI API Errors

- Verify `OPENAI_API_KEY` is set correctly in `.env`
- Check API key is valid and has credits
- Ensure API key starts with "sk-"

### File Upload Issues

- Check `UPLOAD_DIR` exists and is writable
- Verify `MAX_FILE_SIZE` allows your file size
- Ensure audio file format is supported (mp3, wav, m4a, aac, ogg, webm)

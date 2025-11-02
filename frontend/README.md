# AI Scribe Frontend

React + TypeScript frontend application for the AI Scribe Notes Management Tool. Provides a user interface for managing patients and clinical notes with AI-powered features.

## Features

- **Patient Selection**: Dropdown to select patients when creating notes
- **Note Creation**: Accordion-based form supporting:
  - Text input
  - Audio file upload
  - Mixed mode (text + audio)
- **Notes List**: View all notes with:
  - Patient filter dropdown
  - Note previews with key information
  - Click to view full note details
- **Note Detail View**: Full note view with:
  - Patient information sidebar
  - Raw text, transcribed text, and AI summary
  - SOAP format display
  - Audio playback (if available)

## Prerequisites

- Node.js 20 or higher
- Backend API running (see [backend/README.md](../backend/README.md))

## Installation

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the **project root** (not in frontend folder):

```env
VITE_API_URL=http://localhost:3000
```

**Important**: The frontend loads `.env` from the project root via Vite's `loadEnv`.

If `VITE_API_URL` is not set:

- In development: defaults to `http://localhost:3000`
- In production (Docker): uses relative URLs (nginx proxies `/api` to backend)

## Running the Frontend

### Development Mode

```bash
npm run dev
```

This starts the Vite development server on `http://localhost:3001` with hot module replacement.

The dev server proxies `/api/*` requests to the backend automatically (see `vite.config.ts`).

### Production Build

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

The build output goes to `dist/` directory.

### Using Docker

```bash
# From project root
docker compose up frontend
```

The frontend will be available at `http://localhost:3001`.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
frontend/
├── src/
│   ├── components/       # React components
│   │   ├── NoteCard.tsx      # Note card in list view
│   │   ├── NoteDetail.tsx    # Full note detail view
│   │   ├── NoteForm.tsx      # Note creation form (accordion)
│   │   ├── NotesList.tsx     # Notes list with patient filter
│   │   └── PatientSelector.tsx # Patient dropdown selector
│   ├── services/
│   │   └── api.ts        # API service layer
│   ├── types/
│   │   └── index.ts      # TypeScript type definitions
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Application entry point
│   ├── index.css         # Global styles
│   └── vite-env.d.ts    # Vite environment types
├── index.html            # HTML template
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
├── Dockerfile            # Docker container definition
├── nginx.conf            # Nginx configuration (for Docker)
└── start.sh              # Docker startup script
```

## Components

### NoteForm

Accordion-based form for creating notes:

- Collapsed by default
- Expands on click
- Supports text input and audio upload
- Auto-closes after successful note creation

### NotesList

List view of all notes:

- Patient filter dropdown
- Shows note count and filtered count
- Note cards with preview information
- Click to view full note details

### NoteDetail

Full note detail view:

- Patient information sidebar
- Display of raw text, transcribed text, AI summary
- SOAP format breakdown (if available)
- Audio player (if audio file exists)
- Back button to return to list

### PatientSelector

Dropdown component for selecting patients:

- Fetches patients from API
- Displays patient name and ID
- Required field validation
- Loading and error states

## API Integration

The frontend communicates with the backend via the `api.ts` service layer. All API calls use:

- Base URL: `http://localhost:3000/api` (dev) or `/api` (production)
- Response format: `{ code, data, message }`
- Error handling with user-friendly messages

### API Functions

- `fetchPatients()` - Get all patients
- `fetchNotes()` - Get all notes
- `fetchNote(id)` - Get note by ID
- `createNote(patientId, rawText?, audioFile?)` - Create new note

## Environment Variables

The frontend uses Vite environment variables (prefixed with `VITE_`):

**Optional:**

- `VITE_API_URL`: Backend API URL
  - Default (dev): `http://localhost:3000`
  - Default (prod): Uses relative URLs via nginx proxy

## Building for Production

```bash
npm run build
```

This creates an optimized production build in `dist/`:

- Minified JavaScript and CSS
- Optimized assets
- Tree-shaking for smaller bundle size

### Docker Build

When building with Docker, the `VITE_API_URL` is set at build time via Dockerfile ARG:

```dockerfile
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
```

However, in production (nginx), the frontend uses relative URLs (`/api`) which are proxied to the backend.

## Development Tips

1. **Hot Reload**: Vite provides instant hot module replacement
2. **API Proxy**: Dev server automatically proxies `/api/*` to backend
3. **Type Safety**: Full TypeScript support with type checking
4. **Environment Variables**: Only `VITE_*` variables are exposed to frontend

## Troubleshooting

### Cannot Connect to Backend

- Verify backend is running on `http://localhost:3000`
- Check `VITE_API_URL` in `.env` (project root)
- Ensure backend CORS allows `http://localhost:3001`

### Build Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf dist node_modules/.vite
```

### TypeScript Errors

- Ensure `vite-env.d.ts` is in `src/` directory
- Check `tsconfig.json` includes `src/` directory
- Verify all types are properly imported

### Environment Variables Not Working

- Variables must be prefixed with `VITE_`
- `.env` file must be in project root (not frontend folder)
- Restart dev server after changing `.env`

## Styling

The frontend uses plain CSS with no framework dependencies. Styles are:

- Component-specific (inline styles in components)
- Global styles in `index.css`

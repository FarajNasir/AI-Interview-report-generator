# AI Interview Report Generator

AI-powered interview preparation that analyzes a resume against a job description and generates a personalized interview report.

The project contains:

- A React and Vite frontend for authentication, report generation, report history, and report viewing.
- An Express and MongoDB backend for authentication, report storage, Gemini-powered analysis, and resume PDF generation.

## Features

- User registration and login with JWT authentication.
- PDF resume upload and text extraction.
- AI-generated match score and interview preparation report.
- Technical and behavioral interview questions with ideal answers.
- Skill-gap analysis and preparation plan.
- Saved interview reports for each user.
- Downloadable, AI-generated resume PDF.

## Project Structure

```text
.
├── Backend/
│   ├── server.js
│   ├── package.json
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middlewares/
│       ├── models/
│       ├── routes/
│       └── services/
└── Frontend/
    ├── package.json
    └── src/
        ├── features/
        └── style/
```

## Prerequisites

- Node.js 18 or later
- npm
- A MongoDB database, local or hosted
- A Google Gemini API key

## Configuration

Create `Backend/.env` with the following values:

```env
MONGO_URI=mongodb://127.0.0.1:27017/ai-interview-report-generator
JWT_SECRET=replace-with-a-long-random-secret
GOOGLE_GEMINI_KEY=your-google-gemini-api-key
```

Do not commit `.env` files or API keys to source control.

## Installation

Install dependencies for both applications:

```bash
cd Backend
npm install

cd ../Frontend
npm install
```

## Running Locally

Start the backend in one terminal:

```bash
cd Backend
npm run dev
```

The API runs at `http://localhost:3000`.

Start the frontend in a second terminal:

```bash
cd Frontend
npm run dev
```

Open the Vite URL shown in the terminal, normally `http://localhost:5173`.

The frontend is configured to send API requests to `http://localhost:3000`, and the backend allows requests from `http://localhost:5173` during local development.

## Available Scripts

### Backend

| Command | Description |
| --- | --- |
| `npm run dev` | Start the API with Nodemon |

### Frontend

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## API Overview

All protected routes require the authentication cookie created during login.

### Authentication

| Method | Route | Description |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Create an account |
| `POST` | `/api/auth/login` | Log in |
| `GET` | `/api/auth/logout` | Log out |
| `GET` | `/api/auth/get-me` | Get the current user |

### Interview Reports

| Method | Route | Description |
| --- | --- | --- |
| `POST` | `/api/interview/` | Generate a report from a PDF resume, job description, and self description |
| `GET` | `/api/interview/` | List the current user's reports |
| `GET` | `/api/interview/report/:interviewId` | Fetch one report |
| `POST` | `/api/interview/resume/pdf/:interviewReportId` | Generate and download a resume PDF |

The report-generation request uses `multipart/form-data` with these fields:

- `resume`: PDF file
- `jobDescription`: Target job description
- `selfDescription`: Candidate's self description

## Frontend Routes

| Route | Description |
| --- | --- |
| `/login` | Login page |
| `/register` | Registration page |
| `/` | Protected report dashboard |
| `/interview/:interviewId` | Protected report details |

## Production Notes

- Set a strong, unique `JWT_SECRET` in the deployment environment.
- Use a managed MongoDB deployment or a secured production MongoDB instance.
- Restrict CORS to the deployed frontend origin instead of the local Vite origin.
- Store Gemini credentials and database credentials in the hosting provider's secret manager.
- Build the frontend with `npm run build` from `Frontend/` and deploy the generated `dist/` directory with a static host or web server.

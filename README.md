# AI Document Platform

The AI Document Platform is a full-stack application that leverages Google's Gemini AI to generate, refine, and export documents (Word, PowerPoint) based on user prompts. It features a FastAPI backend and a React frontend.

## Project Overview

- **Backend**: Python, FastAPI, SQLAlchemy, PostgreSQL/SQLite, Google Generative AI.
- **Frontend**: React, Axios, React Router.
- **Database**: PostgreSQL (Production), SQLite (Development).
- **Authentication**: JWT-based auth.

## Prerequisites

- **Python**: 3.8+
- **Node.js**: 16+
- **PostgreSQL**: (Optional, for production database)
- **Google Gemini API Key**: Required for AI features.

## Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create and activate a virtual environment:**
    ```bash
    # Windows
    python -m venv venv
    .\venv\Scripts\activate

    # macOS/Linux
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Environment Variables:**
    Create a `.env` file in the `backend` directory with the following variables:

    ```env
    # Database
    # For SQLite (Development):
    DATABASE_URL=sqlite:///./ai_document.db
    # For PostgreSQL (Production):
    # DATABASE_URL=postgresql://user:password@localhost/dbname

    # Security
    SECRET_KEY=your_super_secret_key_here
    ALGORITHM=HS256
    ACCESS_TOKEN_EXPIRE_MINUTES=30

    # AI Service
    GEMINI_API_KEY=your_google_gemini_api_key

    # Application Config
    APP_NAME=AI Document Platform
    DEBUG=True
    ```

5.  **Initialize the Database:**
    The application uses Alembic for migrations, or `init_db.py` for simple setup.
    ```bash
    # Initialize tables
    python init_db.py
    ```

6.  **Run the Backend Server:**
    ```bash
    uvicorn app.main:app --reload
    ```
    The API will be available at `http://localhost:8000`.
    API Documentation (Swagger UI) is available at `http://localhost:8000/docs`.

## Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configuration:**
    Open `src/services/api.js` and ensure the `API_BASE_URL` points to your backend.
    
    *For local development:*
    Change `const API_BASE_URL` to:
    ```javascript
    const API_BASE_URL = 'http://localhost:8000';
    ```
    *(Note: The current default might be set to a deployed URL like `https://ai-document-platform.onrender.com`)*

4.  **Run the Frontend Development Server:**
    ```bash
    npm start
    ```
    The application will run at `http://localhost:3000`.

## Deployment

### Backend (Render/Heroku/etc.)
The backend includes a `render.yaml` for deployment on Render.
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Environment Variables**: Ensure all variables from the `.env` section are set in your deployment provider's dashboard.

### Frontend
- **Build for Production**:
    ```bash
    npm run build
    ```
    This creates a `build` directory with static files that can be served by any static site host (Netlify, Vercel, GitHub Pages, etc.).

## Usage Examples

1.  **Register/Login**: Create an account to get an access token.
2.  **Create Project**: Start a new project by defining a topic and document type.
3.  **Generate Outline**: Use the AI to generate a document outline.
4.  **Generate Content**: Generate content for each section of the outline.
5.  **Export**: Download the final document as a `.docx` or `.pptx` file.

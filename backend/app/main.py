from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import router as auth_router
from app.routes.projects import router as projects_router
from app.routes.ai_routes import router as ai_router
from app.routes.export import router as export_router
from app.config import get_settings
from app.database import init_db

settings = get_settings()

app = FastAPI(
    title=settings.APP_NAME,
    description="AI-Assisted Document Authoring Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://ai-document-platform.vercel.app",
        "https://ai-document-platform-n9w0it8n7-diya-goswamis-projects.vercel.app",
    ],
    allow_credentials=True, 
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """Initialize database tables on startup"""
    try:
        init_db()
        print("✅ Database initialized successfully")
    except Exception as e:
        print(f"❌ Database initialization error: {e}")
        raise

app.include_router(auth_router)
app.include_router(projects_router)
app.include_router(ai_router)
app.include_router(export_router)

@app.get("/")
def root():
    return {
        "message": "Welcome to AI Document Platform API",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "running"
    }

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "database": "connected"
    }


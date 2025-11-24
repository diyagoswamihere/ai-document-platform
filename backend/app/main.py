from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import router as auth_router
from app.routes.projects import router as projects_router
from app.routes.ai_routes import router as ai_router
from app.config import get_settings
from app.routes import router as auth_router
from app.routes.projects import router as projects_router
from app.routes.ai_routes import router as ai_router
from app.routes.export import router as export_router

settings = get_settings()

app = FastAPI(
    title=settings.APP_NAME,
    description="AI-Assisted Document Authoring Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials= [
        "http://localhost:3000",
        "https://ai-document-platform.vercel.app",
        "https://ai-document-platform-n9w0it8n7-diya-goswamis-projects.vercel.app"
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(projects_router)
app.include_router(ai_router)
app.include_router(export_router)

@app.get("/")
def root():
    return {
        "message": "Welcome to AI Document Platform API",
        "docs": "/docs",
        "status": "running"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.routes import get_current_user
from app.models import User
from app.schemas import ProjectCreate, ProjectResponse, SectionCreate, SectionResponse
from app.services.project_service import ProjectService
from app.services.ai_service import AIService

router = APIRouter(prefix="/projects", tags=["Projects"])
ai_service = AIService()

@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new project"""
    return ProjectService.create_project(db, current_user.id, project)

@router.get("", response_model=List[ProjectResponse])
def get_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all projects for current user"""
    return ProjectService.get_user_projects(db, current_user.id)

@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific project"""
    project = ProjectService.get_project(db, project_id, current_user.id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.delete("/{project_id}")
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a project"""
    success = ProjectService.delete_project(db, project_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project deleted successfully"}
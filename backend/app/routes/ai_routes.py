from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from app.models import Section
from app.database import get_db
from app.routes import get_current_user
from app.models import User
from app.services.ai_service import AIService
from app.services.project_service import ProjectService

router = APIRouter(prefix="/ai", tags=["AI Generation"])
ai_service = AIService()

class OutlineRequest(BaseModel):
    topic: str
    document_type: str
    num_sections: int = 5

class GenerateContentRequest(BaseModel):
    project_id: int
    section_id: int

class RefineContentRequest(BaseModel):
    section_id: int
    refinement_instruction: str

@router.post("/generate-outline")
def generate_outline(
    request: OutlineRequest,
    current_user: User = Depends(get_current_user)
):
    """Generate document outline using AI"""
    try:
        titles = ai_service.generate_document_outline(
            request.topic,
            request.document_type,
            request.num_sections
        )
        return {"titles": titles}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-section-content")
def generate_section_content(
    request: GenerateContentRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Generate content for a specific section"""
    # Get project
    project = ProjectService.get_project(db, request.project_id, current_user.id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Get section
    section = db.query(Section).filter(Section.id == request.section_id).first()
    if not section or section.project_id != request.project_id:
        raise HTTPException(status_code=404, detail="Section not found")
    
    try:
        # Generate content
        content = ai_service.generate_section_content(
            project.main_topic,
            section.title,
            project.document_type
        )
        
        # Update section
        ProjectService.update_section_content(db, section.id, content)
        
        return {"content": content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/refine-content")
def refine_content(
    request: RefineContentRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Refine existing section content"""
    from app.models import Section
    
    # Get section
    section = db.query(Section).filter(Section.id == request.section_id).first()
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    
    # Verify user owns the project
    project = ProjectService.get_project(db, section.project_id, current_user.id)
    if not project:
        raise HTTPException(status_code=403, detail="Access denied")
    
    if not section.content:
        raise HTTPException(status_code=400, detail="Section has no content to refine")
    
    try:
        # Refine content
        refined_content = ai_service.refine_content(
            section.content,
            request.refinement_instruction,
            project.document_type
        )
        
        # Save refinement history
        ProjectService.add_refinement(
            db,
            section.id,
            request.refinement_instruction,
            refined_content
        )
        
        # Update section content
        ProjectService.update_section_content(db, section.id, refined_content)
        
        return {"refined_content": refined_content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
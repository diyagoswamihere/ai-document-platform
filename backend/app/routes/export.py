from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.database import get_db
from app.routes import get_current_user
from app.models import User
from app.services.project_service import ProjectService
from app.services.document_service import DocumentService

router = APIRouter(prefix="/export", tags=["Export"])

@router.get("/{project_id}")
def export_document(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Export project as Word or PowerPoint document"""
    # Get project
    project = ProjectService.get_project(db, project_id, current_user.id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Get sections
    sections = project.sections
    
    if not sections:
        raise HTTPException(status_code=400, detail="Project has no sections to export")
    
    try:
        # Generate document based on type
        if project.document_type == 'docx':
            file_stream = DocumentService.generate_word_document(project, sections)
            media_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        else:  # pptx
            file_stream = DocumentService.generate_powerpoint_presentation(project, sections)
            media_type = "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        
        # Get filename
        filename = DocumentService.get_filename(project)
        
        # Return file as download
        return StreamingResponse(
            file_stream,
            media_type=media_type,
            headers={
                "Content-Disposition": f"attachment; filename={filename}"
            }
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Export failed: {str(e)}")
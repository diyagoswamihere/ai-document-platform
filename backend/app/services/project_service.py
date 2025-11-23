from sqlalchemy.orm import Session
from app.models import Project, Section, Refinement, Comment, Feedback
from app.schemas import ProjectCreate, SectionCreate
from typing import List, Optional

class ProjectService:
    """Service for project and section management"""
    
    @staticmethod
    def create_project(db: Session, user_id: int, project_data: ProjectCreate) -> Project:
        """Create a new project with sections"""
        # Create project
        project = Project(
            user_id=user_id,
            name=project_data.name,
            document_type=project_data.document_type,
            main_topic=project_data.main_topic,
            status="draft"
        )
        db.add(project)
        db.flush()  # Get project.id without committing
        
        # Create sections if provided
        if project_data.sections:
            for section_data in project_data.sections:
                section = Section(
                    project_id=project.id,
                    title=section_data.title,
                    position=section_data.position,
                    content=section_data.content
                )
                db.add(section)
        
        db.commit()
        db.refresh(project)
        return project
    
    @staticmethod
    def get_user_projects(db: Session, user_id: int) -> List[Project]:
        """Get all projects for a user"""
        return db.query(Project).filter(Project.user_id == user_id).all()
    
    @staticmethod
    def get_project(db: Session, project_id: int, user_id: int) -> Optional[Project]:
        """Get a specific project"""
        return db.query(Project).filter(
            Project.id == project_id,
            Project.user_id == user_id
        ).first()
    
    @staticmethod
    def update_project_status(db: Session, project_id: int, status: str):
        """Update project status"""
        project = db.query(Project).filter(Project.id == project_id).first()
        if project:
            project.status = status
            db.commit()
            db.refresh(project)
        return project
    
    @staticmethod
    def add_section(db: Session, project_id: int, section_data: SectionCreate) -> Section:
        """Add a section to a project"""
        section = Section(
            project_id=project_id,
            title=section_data.title,
            position=section_data.position,
            content=section_data.content
        )
        db.add(section)
        db.commit()
        db.refresh(section)
        return section
    
    @staticmethod
    def update_section_content(db: Session, section_id: int, content: str) -> Section:
        """Update section content"""
        section = db.query(Section).filter(Section.id == section_id).first()
        if section:
            section.content = content
            db.commit()
            db.refresh(section)
        return section
    
    @staticmethod
    def add_refinement(db: Session, section_id: int, prompt: str, refined_content: str) -> Refinement:
        """Save a refinement"""
        refinement = Refinement(
            section_id=section_id,
            refinement_prompt=prompt,
            refined_content=refined_content
        )
        db.add(refinement)
        db.commit()
        db.refresh(refinement)
        return refinement
    
    @staticmethod
    def add_feedback(db: Session, section_id: int, user_id: int, feedback_type: str) -> Feedback:
        """Add like/dislike feedback"""
        # Check if feedback already exists
        existing = db.query(Feedback).filter(
            Feedback.section_id == section_id,
            Feedback.user_id == user_id
        ).first()
        
        if existing:
            existing.feedback_type = feedback_type
            db.commit()
            db.refresh(existing)
            return existing
        
        feedback = Feedback(
            section_id=section_id,
            user_id=user_id,
            feedback_type=feedback_type
        )
        db.add(feedback)
        db.commit()
        db.refresh(feedback)
        return feedback
    
    @staticmethod
    def add_comment(db: Session, section_id: int, user_id: int, comment_text: str) -> Comment:
        """Add a comment to a section"""
        comment = Comment(
            section_id=section_id,
            user_id=user_id,
            comment_text=comment_text
        )
        db.add(comment)
        db.commit()
        db.refresh(comment)
        return comment
    
    @staticmethod
    def delete_project(db: Session, project_id: int, user_id: int) -> bool:
        """Delete a project"""
        project = db.query(Project).filter(
            Project.id == project_id,
            Project.user_id == user_id
        ).first()
        
        if project:
            db.delete(project)
            db.commit()
            return True
        return False
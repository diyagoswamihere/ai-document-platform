from app.database import Base, engine
from app.models import User, Project, Section, Refinement, Feedback, Comment

def init_database():
    """Create all database tables"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✓ Database tables created successfully!")
    print("✓ Database file: ai_document.db")

if __name__ == "__main__":
    init_database()
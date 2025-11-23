from app.config import get_settings
from app.database import engine, SessionLocal
from app.models import User
from sqlalchemy import text

def test_setup():
    print("=" * 50)
    print("Testing Configuration...")
    print("=" * 50)
    
    settings = get_settings()
    print(f"✓ App Name: {settings.APP_NAME}")
    print(f"✓ Database URL: {settings.DATABASE_URL}")
    print(f"✓ Gemini API Key: {'Configured ✓' if settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != 'your-gemini-api-key-here' else 'NOT SET ✗'}")
    print(f"✓ Secret Key: {'Configured ✓' if settings.SECRET_KEY and len(settings.SECRET_KEY) > 20 else 'NOT SET ✗'}")
    
    print("\n" + "=" * 50)
    print("Testing Database Connection...")
    print("=" * 50)
    
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("✓ Database connection successful!")
        
        db = SessionLocal()
        user_count = db.query(User).count()
        print(f"✓ Database tables created successfully!")
        print(f"✓ Current users in database: {user_count}")
        db.close()
        
        print("\n" + "=" * 50)
        print("🎉 PHASE 1 COMPLETE!")
        print("=" * 50)
        print("You're ready for Phase 2!")
        
    except Exception as e:
        print(f"✗ Error: {e}")

if __name__ == "__main__":
    test_setup()
from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Project Schemas
class SectionBase(BaseModel):
    title: str
    position: int
    content: Optional[str] = None

class SectionCreate(SectionBase):
    pass

class SectionResponse(SectionBase):
    id: int
    project_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class ProjectBase(BaseModel):
    name: str
    document_type: str
    main_topic: str

class ProjectCreate(ProjectBase):
    sections: Optional[List[SectionCreate]] = []

class ProjectResponse(ProjectBase):
    id: int
    user_id: int
    status: str
    created_at: datetime
    updated_at: datetime
    sections: List[SectionResponse] = []
    
    class Config:
        from_attributes = True
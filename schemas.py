from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class AssessmentBase(BaseModel):
    memory_score: float = 0.0
    attention_score: float = 0.0
    executive_score: float = 0.0
    language_score: float = 0.0
    orientation_score: float = 0.0
    visual_score: float = 0.0

class AssessmentCreate(AssessmentBase):
    pass

class AssessmentResponse(AssessmentBase):
    id: int
    user_id: int
    total_score: float
    completed_at: datetime

    class Config:
        from_attributes = True

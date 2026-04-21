from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    assessments = relationship("Assessment", back_populates="owner")

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # Store scores for each module
    memory_score = Column(Float, default=0.0)
    attention_score = Column(Float, default=0.0)
    executive_score = Column(Float, default=0.0)
    language_score = Column(Float, default=0.0)
    orientation_score = Column(Float, default=0.0)
    visual_score = Column(Float, default=0.0)
    
    total_score = Column(Float, default=0.0)
    completed_at = Column(DateTime, default=datetime.datetime.utcnow)

    owner = relationship("User", back_populates="assessments")

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import models, schemas, auth, database
from datetime import timedelta
from fastapi.staticfiles import StaticFiles

# Initialize database tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="CogniCare API")

# Mount static files to serve the frontend
app.mount("/static", StaticFiles(directory="."), name="static")

# Setup CORS for frontend interaction
# Using broad origins for analysis/demo mode
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication endpoints
@app.post("/register", response_model=schemas.UserResponse)
def register_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/login", response_model=schemas.Token)
def login_for_access_token(user_data: schemas.UserCreate, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if not user or not auth.verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Assessment endpoints
@app.post("/assessments", response_model=schemas.AssessmentResponse)
def create_assessment(
    assessment: schemas.AssessmentCreate, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Calculate total score (sum of all scores)
    total = (
        assessment.memory_score + 
        assessment.attention_score + 
        assessment.executive_score + 
        assessment.language_score + 
        assessment.orientation_score + 
        assessment.visual_score
    )
    
    db_assessment = models.Assessment(
        **assessment.dict(),
        total_score=total,
        user_id=current_user.id
    )
    db.add(db_assessment)
    db.commit()
    db.refresh(db_assessment)
    return db_assessment

@app.get("/assessments", response_model=List[schemas.AssessmentResponse])
def get_assessments(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return db.query(models.Assessment).filter(models.Assessment.user_id == current_user.id).all()

# Health check
@app.get("/")
def read_root():
    return {"message": "Welcome to CogniCare API", "docs": "/docs"}

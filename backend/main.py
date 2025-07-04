from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

app = FastAPI()

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# SQLite setup
DATABASE_URL = "sqlite:///./notes.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

# DB model
class Note(Base):
    __tablename__ = "notes"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    content = Column(String)

Base.metadata.create_all(bind=engine)

# Pydantic schema
class NoteCreate(BaseModel):
    title: str
    content: str

class NoteOut(NoteCreate):
    id: int

@app.get("/notes", response_model=List[NoteOut])
def get_notes():
    db = SessionLocal()
    notes = db.query(Note).all()
    db.close()
    return notes

@app.post("/notes", response_model=NoteOut)
def create_note(note: NoteCreate):
    db = SessionLocal()
    db_note = Note(title=note.title, content=note.content)
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    db.close()
    return db_note

@app.delete("/notes/{note_id}")
def delete_note(note_id: int):
    db = SessionLocal()
    note = db.query(Note).filter(Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    db.delete(note)
    db.commit()
    db.close()
    return {"detail": "Note deleted"}

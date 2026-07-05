from typing import Type, TypeVar, List, Optional
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException
from database.models import Base

ModelType = TypeVar("ModelType", bound=Base)


class BaseService:
    def __init__(self, model: Type[ModelType]):
        self.model = model

    def create(self, db: Session, obj_data: dict) -> ModelType:
        try:
            obj = self.model(**obj_data)
            db.add(obj)
            db.commit()
            db.refresh(obj)
            return obj
        except SQLAlchemyError as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    def read(self, db: Session, obj_id: str) -> Optional[ModelType]:
        obj = db.query(self.model).filter(self.model.id == obj_id).first()
        if not obj:
            raise HTTPException(status_code=404, detail=f"{self.model.__name__} not found.")
        return obj

    def update(self, db: Session, obj_id: str, update_data: dict) -> ModelType:
        obj = db.query(self.model).filter(self.model.id == obj_id).first()
        if not obj:
            raise HTTPException(status_code=404, detail=f"{self.model.__name__} not found.")
        try:
            for key, value in update_data.items():
                setattr(obj, key, value)
            db.commit()
            db.refresh(obj)
            return obj
        except SQLAlchemyError as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    def delete(self, db: Session, obj_id: str) -> None:
        obj = db.query(self.model).filter(self.model.id == obj_id).first()
        if not obj:
            raise HTTPException(status_code=404, detail=f"{self.model.__name__} not found.")
        try:
            db.delete(obj)
            db.commit()
        except SQLAlchemyError as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    def list(self, db: Session) -> List[ModelType]:
        try:
            return db.query(self.model).all()
        except SQLAlchemyError as e:
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
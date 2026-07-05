from typing import Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import List
from uuid import UUID

from database.models import Category
from database.config import get_db
from backend.services.auth import get_current_user, get_current_user_id

router = APIRouter(prefix="/categories")

# Pydantic schemas
class CategoryResponse(BaseModel):
    id: Optional[UUID] = None
    user_id: Optional[UUID] = None
    name: str
    created_at: Optional[datetime] = None
    class Config:
        from_attributes = True

# Route handlers
@router.post("/", response_model=CategoryResponse, operation_id="create_category", status_code=status.HTTP_201_CREATED)
async def create_category(
    name: str = Body(..., description="Name of the category", embed=True),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_id),
):
    # Check if category name already exists for the user
    existing_category = db.query(Category).filter(
        Category.user_id == current_user, Category.name == name
    ).first()
    if existing_category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category with this name already exists.",
        )

    # Create new category
    new_category = Category(
        user_id=current_user,
        name=name,
    )
    db.add(new_category)
    db.commit()
    db.refresh(new_category)

    return new_category


@router.get("/", response_model=List[CategoryResponse], operation_id="list_categories", status_code=status.HTTP_200_OK)
async def list_categories(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_id),
):
    # Fetch all categories for the current user
    categories = db.query(Category).filter(Category.user_id == current_user).all()
    return categories
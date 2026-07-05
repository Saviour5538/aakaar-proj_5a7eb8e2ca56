from typing import Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from typing import List
from uuid import UUID
from sqlalchemy.orm import Session
from database.models import Expense
from database.config import get_db
from backend.services.auth import get_current_user, get_current_user_id

router = APIRouter(prefix="/expenses")

class ExpenseResponse(BaseModel):
    id: Optional[UUID] = None
    user_id: Optional[UUID] = None
    category_id: Optional[UUID] = None
    amount: float
    description: Optional[str] = None
    created_at: Optional[datetime] = None
    class Config:
        from_attributes = True

@router.post("/", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED, operation_id="create_expense")
async def create_expense(
    expense: ExpenseResponse,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_id)
):
    new_expense = Expense(
        user_id=current_user,
        category_id=expense.category_id,
        amount=expense.amount,
        description=expense.description,
        created_at=expense.created_at
    )
    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)
    return new_expense

@router.get("/", response_model=List[ExpenseResponse], operation_id="list_expenses")
async def list_expenses(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_id)
):
    expenses = db.query(Expense).filter(Expense.user_id == current_user).all()
    return expenses

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT, operation_id="delete_expense")
async def delete_expense(
    id: UUID,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_id)
):
    expense = db.query(Expense).filter(Expense.id == id, Expense.user_id == current_user).first()
    if not expense:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expense not found")
    db.delete(expense)
    db.commit()
    return None
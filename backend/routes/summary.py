from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from database.models import Expense, Category
from database.config import get_db
from backend.services.auth import get_current_user, get_current_user_id
from datetime import datetime

router = APIRouter(prefix='/summary')

class SummaryResponse(BaseModel):
    total_expenses: float
    category_breakdown: List[dict]

@router.get("/", response_model=SummaryResponse, operation_id="get_summary")
async def get_summary(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_id)
):
    try:
        # Fetch all expenses for the current user
        expenses = db.query(Expense).filter(Expense.user_id == current_user).all()
        
        if not expenses:
            return SummaryResponse(total_expenses=0.0, category_breakdown=[])

        # Calculate total expenses
        total_expenses = sum(expense.amount for expense in expenses)

        # Calculate category breakdown
        category_breakdown = []
        categories = db.query(Category).filter(Category.user_id == current_user).all()
        for category in categories:
            category_expenses = db.query(Expense).filter(
                Expense.user_id == current_user,
                Expense.category_id == category.id
            ).all()
            category_total = sum(expense.amount for expense in category_expenses)
            category_breakdown.append({
                "category_name": category.name,
                "total": category_total
            })

        return SummaryResponse(
            total_expenses=total_expenses,
            category_breakdown=category_breakdown
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while fetching the summary."
        )
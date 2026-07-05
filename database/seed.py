import uuid
from datetime import datetime
from database.models import User, Category, Expense, SessionLocal

def seed_database():
    session = SessionLocal()
    try:
        # Clear existing data
        session.query(Expense).delete()
        session.query(Category).delete()
        session.query(User).delete()

        # Seed Users
        user1 = User(
            id=uuid.uuid4(),
            email="alice@example.com",
            password_hash="hashed_password_1",
            created_at=datetime.utcnow()
        )
        user2 = User(
            id=uuid.uuid4(),
            email="bob@example.com",
            password_hash="hashed_password_2",
            created_at=datetime.utcnow()
        )
        user3 = User(
            id=uuid.uuid4(),
            email="charlie@example.com",
            password_hash="hashed_password_3",
            created_at=datetime.utcnow()
        )

        session.add_all([user1, user2, user3])
        session.commit()

        # Seed Categories
        category1 = Category(
            id=uuid.uuid4(),
            user_id=user1.id,
            name="Groceries",
            created_at=datetime.utcnow()
        )
        category2 = Category(
            id=uuid.uuid4(),
            user_id=user1.id,
            name="Utilities",
            created_at=datetime.utcnow()
        )
        category3 = Category(
            id=uuid.uuid4(),
            user_id=user2.id,
            name="Entertainment",
            created_at=datetime.utcnow()
        )

        session.add_all([category1, category2, category3])
        session.commit()

        # Seed Expenses
        expense1 = Expense(
            id=uuid.uuid4(),
            user_id=user1.id,
            category_id=category1.id,
            amount=50.75,
            description="Weekly groceries",
            created_at=datetime.utcnow()
        )
        expense2 = Expense(
            id=uuid.uuid4(),
            user_id=user1.id,
            category_id=category2.id,
            amount=120.00,
            description="Electricity bill",
            created_at=datetime.utcnow()
        )
        expense3 = Expense(
            id=uuid.uuid4(),
            user_id=user2.id,
            category_id=category3.id,
            amount=15.99,
            description="Movie ticket",
            created_at=datetime.utcnow()
        )

        session.add_all([expense1, expense2, expense3])
        session.commit()

    finally:
        session.close()
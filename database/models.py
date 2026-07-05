import os
import uuid
from datetime import datetime
from sqlalchemy import create_engine, Column, String, Float, DateTime, ForeignKey, Index
from sqlalchemy.orm import declarative_base, relationship, sessionmaker
from sqlalchemy.dialects.postgresql import UUID

# Environment variable for database URL
DATABASE_URL_ENV = "DATABASE_URL"
DATABASE_URL = os.environ[DATABASE_URL_ENV]

# SQLAlchemy setup
from database.config import Base
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Models
class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

class Category(Base):
    __tablename__ = "categories"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    user = relationship("User", back_populates="categories")

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    category_id = Column(UUID(as_uuid=True), ForeignKey("categories.id", ondelete="CASCADE"), nullable=False)
    amount = Column(Float, nullable=False)
    description = Column(String, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    user = relationship("User", back_populates="expenses")
    category = relationship("Category", back_populates="expenses")

User.categories = relationship("Category", back_populates="user", cascade="all, delete-orphan")
User.expenses = relationship("Expense", back_populates="user", cascade="all, delete-orphan")
Category.expenses = relationship("Expense", back_populates="category", cascade="all, delete-orphan")
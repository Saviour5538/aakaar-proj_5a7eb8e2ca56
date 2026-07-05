import os
import logging
from sqlalchemy import engine_from_config, pool
from sqlalchemy.engine import create_engine
from alembic import context
from database.models import Base

# Alembic Config object, provides access to values within the .ini file
config = context.config

# Interpret the config file for Python logging
logging.basicConfig()
logger = logging.getLogger('alembic.env')

# Retrieve the database URL from environment variable
DATABASE_URL_ENV = "DATABASE_URL"
DATABASE_URL = os.environ.get(DATABASE_URL_ENV)

if not DATABASE_URL:
    raise RuntimeError(f"Environment variable '{DATABASE_URL_ENV}' is not set.")

# Add the database URL to the Alembic config
config.set_main_option("sqlalchemy.url", DATABASE_URL)

# Target metadata for Alembic migrations
target_metadata = Base.metadata
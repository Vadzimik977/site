from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine

SQLALCHEMY_DATABASE_URL = "mysql://username:password@107.189.26.251/ton_web"  # Заменить на реальные данные

# DATABASE_URL = "mysql://username:password@107.189.26.251/ton_web" 
DATABASE_URL = "postgresql://myuser:Ouhdsoucnrp!@89.169.46.223:5432/tonium"

# engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"charset": "utf8mb4"})

engine = create_async_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

DB_NAME = 'tonium'
DB_USER = 'myuser'
DB_HOST = '89.169.46.223'
DB_PORT = '5432'
DB_PASS = 'Ouhdsoucnrp!'



from sqlalchemy import Column, Integer, String, Enum, Float, Boolean, ForeignKey, JSON
from sqlalchemy.orm import declarative_base

from sqlalchemy.orm import relationship
from enum import Enum as PyEnum
from sqlalchemy import create_engine
from sqlalchemy.ext.mutable import MutableList
from sqlalchemy.dialects.postgresql import JSONB

Base = declarative_base()

# DATABASE_URL = "postgresql://new_username:your_password@194.26.232.250:5432/tonium"


# engine = create_engine(DATABASE_URL)

class Task(Base):
    __tablename__ = 'tasks'

    id = Column(Integer, primary_key=True, index=True)
    type = Column(Enum("tgChannel", "tgChat", "video", "refferal", "bot", name="task_type_enum"))
    amount = Column(Float, nullable=True)  # Заменяем Integer на Float для типа данных "DOUBLE"
    link = Column(String, nullable=True)
    tg_name = Column(String, nullable=True)

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=True)
    password = Column(String, nullable=True)
    role = Column(Enum("user", "admin", name="user_role_enum"), default="user")
    coins = Column(Float, default=0)
    ton = Column(Float, default=0)
    adress = Column(String, nullable=True)
    tg_id = Column(String, nullable=True)
    userName = Column(String, nullable=True)

    class Config:
        orm_mode = True


class Elementplanets(Base):
    __tablename__ = 'element_planets'

    elementId = Column(Integer, ForeignKey('elements.id'),primary_key=True,nullable=True)
    planetId = Column(Integer, ForeignKey('planets.id'),primary_key=True,nullable=True)


class RareEnum(PyEnum):
    Обычная = "Обычная"
    Редкая = "Редкая"
    Эпическая = "Эпическая"

class Elements(Base):
    __tablename__ = 'elements'


    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=True)
    symbol = Column(String, nullable=True)
    img = Column(String, nullable=True)
    index = Column(Integer, nullable=True)
    rare = Column(Enum(RareEnum), default=RareEnum.Обычная, nullable=True)

    planets = relationship("Planet", secondary="element_planets", back_populates="elements")

class Planet(Base):
    __tablename__ = 'planets'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=True)
    speed = Column(Float, nullable=True)
    updatePrice = Column(Integer, nullable=True)
    img = Column(String, nullable=True)
    active = Column(Boolean, default=False)
    forLaboratory = Column(Boolean, default=False)
    cost = Column(Integer, nullable=True)

    elements = relationship("Elements", secondary="element_planets", back_populates="planets")
    user_planets = relationship("UserPlanet", back_populates="planet")



class UserPlanet(Base):
    __tablename__ = 'user_planets'


    id = Column(Integer, primary_key=True, index=True)
    level = Column(String, nullable=True)
    userId = Column(Integer, nullable=True)
    planetId = Column(Integer, ForeignKey('planets.id'), nullable=True) 
    resources =Column(Float, nullable=True)
    mined = Column(Float, nullable=True)
    speed = Column(Float, nullable=True)
    cost  = Column(Integer, nullable=True)
    alliance = Column(Boolean, default=False, nullable=False)
    related_planets = Column(JSON, default=[])
    sumhealth = Column(Float, default=0.0) 
    alliancename = Column(String, nullable=True)


    planet = relationship("Planet", back_populates="user_planets")


class Completedtasks(Base):
    __tablename__ = 'completed_tasks'

    id = Column(Integer, primary_key=True, index=True)
    taskId = Column(Integer, index=True)
    userId = Column(Integer, index=True)
    









class Cosmoports(Base):
    __tablename__ = 'spaceports'

    id = Column(Integer, primary_key=True, index=True)
    level = Column(Integer, nullable=True)
    type =  Column(Enum("tanker", "corable", name="cosmoports_enum"), default="corable")
    userId = Column(Integer, nullable=True)
    planetId = Column(Integer, nullable=True)
    tonnage = Column(Integer, nullable=True)
    shot = Column(Integer, nullable=True)
    address = Column(String, nullable=True)
    name = Column(String, nullable=True)
    index = Column(Integer, nullable=True)
    power = Column(Integer, nullable=True)
    cost = Column(Integer, nullable=True)





class Payments(Base):
    __tablename__ = 'payments'

    id = Column(Integer, primary_key=True, index=True)
    userId = Column(Integer, nullable=True)
    planetId = Column(Integer, nullable=True)
    amount = Column(Integer, nullable=True)
    date = Column(String, nullable=True)
    payload_token = Column(String, nullable=True)
    status = Column(String, nullable=True)


class Wallets(Base):
    __tablename__ = 'wallets'

    id = Column(Integer, primary_key=True, index=True)

    value = Column(MutableList.as_mutable(JSONB), nullable=True)  # ✅ ключевая строка

    userId = Column(Integer, nullable=True)
    # createdAt = Column(String, nullable=True)
    # updatedAt = Column(String, nullable=True)



class History(Base):
    __tablename__ = "user_histories"

    id = Column(Integer, primary_key=True, index=True)
    value = Column(JSON, nullable=True, default=[])
    
    userId = Column(Integer, ForeignKey("users.id"))

from sqlalchemy import DateTime
class Attacks(Base):
    __tablename__ = "attacks"

    id = Column(Integer, primary_key=True, index=True)

    last_attack_at = Column(DateTime, nullable=True, default=None)
    
    tg_id = Column(Integer, nullable=True)


# Base.metadata.create_all(bind=engine)
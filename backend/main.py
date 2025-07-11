from fastapi import FastAPI, Depends, HTTPException, Body, Request
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from models import Task, User, UserPlanet, Planet, Elementplanets, Attacks, Elements, Cosmoports, Payments, Completedtasks, Wallets, History # Импорт вашей модели Task
# import database
from pydantic import BaseModel, ConfigDict
import logging
import asyncio

from aiogram import Bot, Dispatcher
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.filters import CommandStart, Command
from aiogram import Router, F
from aiogram.types import Message, CallbackQuery, PreCheckoutQuery
from kbs import main_keyboard, chat_keyboard
from config import API_TOKEN

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import sessionmaker
from contextlib import asynccontextmanager
from sqlalchemy.future import select
from contextlib import asynccontextmanager

# from database import get_session

router = Router()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)



# Фоновая задача на старте
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Проверка подключения к БД и вывод количества пользователей
    

    # Запуск фоновых задач
    asyncio.create_task(update_laboratory_planets_now())

    await bot.set_webhook(
        url="https://playmost.ru/api2/webhook",
        allowed_updates=dp.resolve_used_update_types(),
        drop_pending_updates=True
    )
    logging.info("FastAPI и Telegram бот успешно запущены!")

    yield


app = FastAPI()

# app.include_router(router)

async def processor():
    try:
        async with async_session_maker() as session:
            result = await session.execute(select(func.count(User.id)))
            user_count = result.scalar()
            logging.info(f"✅ База данных подключена. Количество пользователей: {user_count}")
    except Exception as e:
        logging.error(f"❌ Ошибка подключения к базе данных: {e}")



# Создаем экземпляры бота и диспетчера
bot = Bot(token=API_TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))

dp = Dispatcher()
@app.on_event("startup")
async def startup():
    # Запускаем Telegram-бота в отдельной асинхронной задаче
    # await bot.send_message(395581114,"Ghbdtn")'
    # asyncio.create_task(run_hourly())

    asyncio.create_task(update_laboratory_daily())
    # asyncio.create_task(update_laboratory_planets_now())
    await bot.set_webhook(
        url="https://playmost.ru/api2/webhook",
        allowed_updates=dp.resolve_used_update_types(),
        drop_pending_updates=True
    )
    logging.info("FastAPI и Telegram бот успешно запущены!")

# Функция-обработчик команды /start






from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

# Строка подключения для асинхронного подключения к базе данных
# DATABASE_URL = "mysql+aiomysql://username:password@107.189.26.251/ton_web"
# DATABASE_URL = "postgresql://myuser:Ouhdsoucnrp!@89.169.46.223:5432/tonium"
# DATABASE_URL = "postgresql://new_username:your_password@194.26.232.250:5432/tonium"
DATABASE_URL = "postgresql+asyncpg://myuser:Ouhdsoucnrp!@89.169.46.223:5432/tonium"
  # Пример для PostgreSQL

# Создаем асинхронный engine
engine = create_async_engine(DATABASE_URL, echo=False)

# Создаем базовый класс для моделей
Base = declarative_base()

# Создаем сессию для асинхронных операций
async_session = sessionmaker(
    bind=engine,  # связываем с engine
    class_=AsyncSession,  # используем AsyncSession
    expire_on_commit=False
)

from sqlalchemy.ext.asyncio import AsyncAttrs, async_sessionmaker, create_async_engine, AsyncSession
async_session_maker = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False  # ✅ ЭТО главное
)

from sqlalchemy.ext.asyncio import AsyncSession

async def get_session() -> AsyncSession:
    async with async_session_maker() as session:
        yield session


from functools import wraps
from sqlalchemy import func, TIMESTAMP, Integer, text
def connection(isolation_level=None):
    def decorator(method):
        @wraps(method)
        async def wrapper(*args, **kwargs):
            async with async_session_maker() as session:
                try:
                    # Устанавливаем уровень изоляции, если передан
                    if isolation_level:
                        await session.execute(text(f"SET TRANSACTION ISOLATION LEVEL {isolation_level}"))
                    # Выполняем декорированный метод
                    return await method(*args, session=session, **kwargs)
                except Exception as e:
                    await session.rollback()  # Откатываем сессию при ошибке
                    raise e  # Поднимаем исключение дальше
                finally:
                    await session.close()  # Закрываем сессию

        return wrapper
    return decorator

async def get_db() -> AsyncSession:
    async with async_session_maker() as session:
        try:
            yield session  # Возвращаем сессию для использования
        except Exception:
            await session.rollback()  # Откатываем транзакцию при ошибке
            raise
        finally:
            await session.close()  # Закрываем сессию


from sqlalchemy.orm import selectinload
from sqlalchemy.orm.attributes import flag_modified

async def update_wallets_resources(session: AsyncSession):
    # Загружаем все планеты пользователя со скоростью >= 0.5 и предзагружаем планету + элементы
    result = await session.execute(
        select(UserPlanet)
        .where(UserPlanet.speed >= 0.05)
        .options(selectinload(UserPlanet.planet))  # planet — relationship, а не planetId
    )
    user_planets = result.scalars().all()


    if not user_planets:
        return

    # Получаем список планет и юзеров
    planet_ids = [p.planetId for p in user_planets]
    user_ids = [p.userId for p in user_planets if p.userId]

    # Загружаем элементы по связке Elementplanets → Elements
    element_links = await session.execute(
        select(Elementplanets).where(Elementplanets.planetId.in_(planet_ids))
    )
    element_planet_links = element_links.scalars().all()

    element_ids = [link.elementId for link in element_planet_links]
    elements_result = await session.execute(
        select(Elements).where(Elements.id.in_(element_ids))
    )
    elements_by_id = {el.id: el for el in elements_result.scalars().all()}

    # Создаем соответствие planetId → элемент
    planet_to_element = {}
    for link in element_planet_links:
        if link.planetId and link.elementId in elements_by_id:
            planet_to_element[link.planetId] = elements_by_id[link.elementId]

    # Загружаем кошельки
    wallets_result = await session.execute(
        select(Wallets).where(Wallets.userId.in_(user_ids))
    )
    wallets_by_user = {w.userId: w for w in wallets_result.scalars().all()}

    for up in user_planets:
        element = planet_to_element.get(up.planetId)
        wallet = wallets_by_user.get(up.userId)

        if not element or not wallet:
            continue

        updated = False
        for entry in wallet.value:
            if entry.get("symbol") == element.symbol:
                entry["value"] += up.speed
                updated = True
                break

        if not updated:
            wallet.value.append({
                "symbol": element.symbol,
                "name": element.name,
                "value": up.speed,
                "img": element.img,
                "rare": element.rare.value,
                "element": element.index,
            })

        flag_modified(wallet, "value")

    await session.commit()



# Заглушка — получаем символ по planetId
async def get_element_by_planet_id(db: AsyncSession, planet_id: int):
    stmt = (
        select(Elements)
        .join(Elementplanets, Elements.id == Elementplanets.elementId)
        .where(Elementplanets.planetId == planet_id)
    )
    result = await db.execute(stmt)
    return result.scalars().first()




import random
from datetime import datetime, timedelta

async def update_laboratory_daily():
    while True:
        now = datetime.utcnow()
        target_time = now.replace(hour=23, minute=59, second=0, microsecond=0)
        if target_time < now:
            target_time += timedelta(days=1)

        wait_seconds = (target_time - now).total_seconds()
        await asyncio.sleep(wait_seconds)

        async for db in get_db():
            # Сбросить текущие лабораторные планеты
            await db.execute(
                update(Planet).where(Planet.forLaboratory == True).values(forLaboratory=False)
            )
            await db.commit()

            # Выбрать случайные 7 планет, у которых forLaboratory == 0
            result = await db.execute(
                select(Planet).where(Planet.forLaboratory == False)
            )
            all_available = result.scalars().all()

            selected = random.sample(all_available, min(7, len(all_available)))

            for planet in selected:
                planet.forLaboratory = True
                db.add(planet)

            await db.commit()
        logger.info("Лабораторные планеты обновлены!")

async def update_laboratory_planets_now():
    logging.info("Запускаем обновление лабораторий")
    async for db in get_db():
        # Сбросить текущие лабораторные планеты
        await db.execute(
            update(Planet).where(Planet.forLaboratory == True).values(forLaboratory=False)
        )
        await db.commit()

        # Выбрать случайные 7 планет, у которых forLaboratory == 0
        result = await db.execute(
            select(Planet).where(Planet.forLaboratory == False)
        )
        all_available = result.scalars().all()

        selected = random.sample(all_available, min(7, len(all_available)))

        for planet in selected:
            planet.forLaboratory = True
            db.add(planet)

        await db.commit()
    logger.info("Лабораторные планеты обновлены!")

# async def run_hourly():
#     while True:
#         async for session in get_session():  # получаем AsyncSession вручную
#             await update_wallets_resources(session)  # передаём в функцию
#             break  # выходим из генератора после одного использования

#         await asyncio.sleep(3600)


@app.get("/test")
def test():
    return {"ok": True}

# origins = [
#     # "http://localhost:3000",  # Разрешаем доступ только с этого домена
#     # "http://127.0.0.1:5173",  # Разрешаем доступ с этого домена тоже (если используется 127.0.0.1)
#     '*'
# ]

# # Добавляем middleware
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,  # Разрешаем запросы только с указанных источников
#     allow_credentials=True,
#     allow_methods=["*"],  # Разрешаем все методы (GET, POST и т.д.)
#     allow_headers=["*"],  # Разрешаем все заголовки
# )


# Ваш маршрут для получения списка заданий

from aiogram import Dispatcher, types
@app.post("/webhook")
async def telegram_webhook(update: dict, dispatcher: Dispatcher = Depends(lambda: dp)):
    telegram_update = types.Update(**update)
    await dispatcher.feed_update(bot=bot,dispatcher=dispatcher, update=telegram_update)  # <-- Важно!
    return {"ok": True}


@router.message(CommandStart())
@connection()
async def start(message: Message, session):

    logging.info("Прожато")
    
    welcome_text = (
        '''We are pleased to announce that Tonium World, our exciting NFT mining game, has officially completed the development of the first version. 
Stage l accumulation of resources.
➖➖➖➖➖➖➖➖➖➖➖➖➖
Мы с радостью объявляем, что Tonium World— наша увлекательная NFT-игра по добыче полезных ископаемых — официально завершила разработку первой версии. 
Этап l накопление ресурсов.'''
    )
    if 'ref' in message.text:
        referrer_id = message.text.split('ref')[1]
        if message.from_user.id==referrer_id:
            pass
        else:

            

            query = select(User).where(User.id == int(referrer_id))
            result = await session.execute(query)
            user = result.scalar_one_or_none()
            tg_id = user.tg_id
            print(f"Start tg id {tg_id}")
            await bot.send_message(
    tg_id,
    "🎉 Ура! Новый реферал пришёл по вашей ссылке! 🚀\n\n💰 Вы получаете награду за активность! Отличная работа, командир! 🔥\n\nПродолжайте звать друзей и собирайте ещё больше бонусов! 💎👾",
    reply_markup=chat_keyboard()
)

            if user:
                query = select(Task).where(Task.type == "refferal")
                result = await session.execute(query)
                task = result.scalar_one_or_none()
                nagrada = task.amount

                user.coins += nagrada
                await session.commit()

    try:
        user_id = message.from_user.id
        last_name = message.from_user.last_name
        if last_name==None:
            last_name=message.from_user.username
        

        await message.answer(welcome_text, reply_markup=main_keyboard())

    except Exception as e:
        logging.info(f"Update processed: {e}")
        await message.answer("Произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте снова позже.")

@router.pre_checkout_query()
async def pre_checkout_handler(pre_checkout_query: PreCheckoutQuery):
    print(f"PreCheckout получен: {pre_checkout_query.id}")
    await pre_checkout_query.answer(ok=True)


@router.message(F.successful_payment)
@connection()
async def process_successful_payment(message: Message, session, **kwargs):
     # асинхронный контекстный менеджер
        # Получаем информацию о платеже
    successful_payment = message.successful_payment
    total_amount = successful_payment.total_amount
    currency = successful_payment.currency
    invoice_payload = successful_payment.invoice_payload

    try:
        logging.info(f"Успешный платеж: {total_amount} {currency}, payload: {invoice_payload}")

        query = select(Payments).where(Payments.payload_token == invoice_payload)
        result = await session.execute(query)
        payment = result.scalar_one_or_none()

        if payment:
            payment.status = 'paid'
            await session.commit()
            logging.info(f"Платеж с payload {invoice_payload} обновлен на статус 'paid'")
        else:
            logging.warning(f"Не найден платеж с payload {invoice_payload}")

    except Exception as e:
        logging.error(f"Ошибка при обработке успешного платежа: {e}")


dp.include_router(router)

@app.post("/tasks")
async def get_tasks(payload: dict = Body(...), db: AsyncSession = Depends(get_db)):
    user_id = payload.get("userId")
    if not user_id:
        raise HTTPException(status_code=400, detail="userId is required")

    try:
        # Подзапрос: выбрать taskId из Completedtasks, где userId совпадает
        subquery = select(Completedtasks.taskId).where(Completedtasks.userId == user_id)

        # Основной запрос: выбрать все задачи, которых нет в `completed_tasks` у текущего пользователя
        result = await db.execute(
            select(Task).where(Task.id.not_in(subquery))
        )
        tasks = result.scalars().all()

        logger.info(f"Задачи для userId={user_id} успешно получены, количество: {len(tasks)}")
        return {"tasks": tasks}
    except Exception as e:
        logger.error(f"Ошибка при получении задач: {e}")
        raise HTTPException(status_code=500, detail="Ошибка при получении задач")

class TaskAction(BaseModel):
    userId: int  # а не user_id
    type: str  # если ты используешь это поле
    tgID: int


async def check_subscription(user_id,channel_id):
    try:
        chat_member = await bot.get_chat_member(channel_id, user_id)
        return chat_member.status in ['member', 'administrator','creator']
    except Exception as e:
        print(f"Error checking subscription: {e}")
        return False


@app.post("/tasks/{task_id}/action")
async def send_task_action(task_id: int, task_action: TaskAction, db: AsyncSession = Depends(get_db)):
    print(f'Получен запрос для задачи с ID: {task_id}, userId: {task_action.userId}')

    # Получаем задачу
    task_result = await db.execute(select(Task).where(Task.id == task_id))
    task = task_result.scalars().first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Проверка подписки на канал
    if task_action.type == "notification":
        url_full = task.tg_name
        channel_id = url_full.split("https://t.me/")[1]
        res = await check_subscription(task_action.tgID, f"@{channel_id}")
        if not res:
            raise HTTPException(status_code=403, detail="User is not subscribed to the channel")

    # Проверка участия в чате
    elif task_action.type == "notification22":
        url_full = task.tg_name
        chat_id = url_full.split("https://t.me/")[1]
        res = await check_subscription(task_action.tgID, f"@{chat_id}")
        if not res:
            raise HTTPException(status_code=403, detail="User is not a member of the chat")

    # Получаем пользователя
    user_result = await db.execute(select(User).where(User.id == task_action.userId))
    user = user_result.scalars().first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Добавляем монеты пользователю
    user.coins += task.amount

    # Добавляем запись в completed_tasks
    completed_task = Completedtasks(taskId=task_id, userId=task_action.userId)
    db.add(completed_task)

    await db.commit()

    return {
        "message": f"Task {task_id} action performed by user {task_action.userId}"
    }




from typing import Optional
class GetUserPlanetRequest(BaseModel):
    user_id: int
    planet_id: Optional[int] = None

fake_user_planets = [
    {"id": 1, "user_id": 559, "planet_id": 10, "resources": 1000, "mined": 250},
    {"id": 2, "user_id": 559, "planet_id": 11, "resources": 500, "mined": 50},
]

@app.post("/getuserplanet")
async def get_user_planet(request: GetUserPlanetRequest, db: AsyncSession = Depends(get_db)):
    # Поиск планеты пользователя в базе данных
    query = await db.query(UserPlanet).filter(UserPlanet.userId == request.user_id)

    if request.planet_id is not None:
        query = query.filter(UserPlanet.planetId == request.planet_id)

    user_planet = query.first()  # Получаем первую планету (если есть)

    if user_planet is None:
        raise HTTPException(status_code=404, detail="Планета не найдена")

    # Преобразуем объект модели в обычный словарь, если нужно вернуть его в формате JSON
    return {
        "id": user_planet.id,
        "user_id": user_planet.userId,
        "planet_id": user_planet.planetId,
        "resources": user_planet.resources,
        "mined": user_planet.mined,
        "level": user_planet.level
    }

from sqlalchemy import cast, Integer

@app.post("/get_planets_alliance")
async def get_user_planet(request: GetUserPlanetRequest, db: AsyncSession = Depends(get_db)):
    stmt = (
        select(UserPlanet, Planet.img, Planet.name)
        .join(Planet, Planet.id == UserPlanet.planetId)
        .where(
            UserPlanet.userId == request.user_id,
            UserPlanet.alliance == False,
            cast(UserPlanet.level, Integer) > 5
        )
    )

    result = await db.execute(stmt)
    rows = result.all()

    if not rows:
        raise HTTPException(status_code=404, detail="Планеты не найдены")

    return [
        {
            "id": user_planet.id,
            "user_id": user_planet.userId,
            "planet_id": user_planet.planetId,
            "resources": user_planet.resources,
            "mined": user_planet.mined,
            "level": user_planet.level,
            "img": img,
            "name": name,
        }
        for user_planet, img, name in rows
    ]
from typing import List
class CreateAllianceRequest(BaseModel):
    userId: int
    planets: List[int]
    alliancename: str 

@app.post("/create_alliance")
async def create_alliance(request: CreateAllianceRequest, db: AsyncSession = Depends(get_db)):
    if not request.planets or len(request.planets) < 3:
        raise HTTPException(status_code=400, detail="Нужно минимум 3 планеты для создания альянса с 2 связанными")

    # Проверка allianceName
    if not request.alliancename or len(request.alliancename.strip()) == 0:
        raise HTTPException(status_code=400, detail="Имя альянса не может быть пустым")

    # Получаем планеты пользователя из списка request.planets
    stmt = select(UserPlanet).where(UserPlanet.userId == request.userId).where(UserPlanet.id.in_(request.planets))
    result = await db.execute(stmt)
    planets = result.scalars().all()

    if len(planets) != len(request.planets):
        raise HTTPException(status_code=404, detail="Некоторые планеты не найдены у пользователя")

    print(f"Создается альянс '{request.alliancename}' для пользователя {request.userId}")

    # Создаем мапу id -> объект планеты для удобства
    planets_map = {planet.id: planet for planet in planets}

    for pid in request.planets:
        # Формируем related_planets - 2 оставшиеся планеты из request.planets, кроме текущей
        related = [p for p in request.planets if p != pid][:2]  # берем первые 2 остальные

        planet = planets_map[pid]
        planet.related_planets = related  # записываем связанные планеты
        planet.alliance = True 
        planet.alliancename = request.alliancename           # ставим флаг альянса
        # Если есть связь с альянсом, можно ее сюда добавить:
        # planet.alliance_id = alliance_id

    await db.commit()

    return {"detail": f"Альянс '{request.alliancename}' успешно создан с 2 связанными планетами на каждую"}



@app.post("/userplanets")
async def get_user_planets_with_resources(request: GetUserPlanetRequest, db: AsyncSession = Depends(get_db)):
    planet_id = request.planet_id

    if not planet_id:
        raise HTTPException(status_code=400, detail="planet_id is required")

    query = select(UserPlanet).filter(UserPlanet.planetId == planet_id)
    result = await db.execute(query)
    planets = result.scalars().all()

    if not planets:
        raise HTTPException(status_code=404, detail="Нет планет с таким ID")

    data = []

    for planet in planets:
        user = await db.get(User, planet.userId)
        wallet_result = await db.execute(select(Wallets).where(Wallets.userId == planet.userId))
        wallet = wallet_result.scalars().first()

        wallet_resources = {}
        if wallet:
            for item in wallet.value:
                symbol = item.get("symbol")
                value = item.get("value")
                if symbol and value is not None:
                    wallet_resources[symbol] = value

        data.append({
            "userId": planet.userId,
            "planetId": planet.id,
            "level":planet.level,
            "resources": {
                "GC": user.coins,
                "Tonium": user.ton,
                **wallet_resources  # добавляет все из кошелька
            }
        })

    return data



class PlanetLevelRequest(BaseModel):
    userId: int
    planetId: int

@app.post("/get_planet_resources")
async def get_planet_resources(data: GetUserPlanetRequest, db: AsyncSession = Depends(get_db)):
    planet = await db.query(UserPlanet).filter_by(
        userId=data.user_id,
        planetId=data.planet_id
    ).first()

    if not planet:
        raise HTTPException(status_code=404, detail="Планета не найдена")

    return {
        "resources": planet.resources,
        "mined": planet.mined  # по желанию
    }

@app.post("/get_user_planet_level")
async def get_userplanet_level(data: PlanetLevelRequest, db: AsyncSession = Depends(get_db)):
    user_planet = await db.query(UserPlanet).filter_by(
        userId=data.userId, planetId=data.planetId
    ).first()

    if not user_planet:
        raise HTTPException(status_code=404, detail="UserPlanet not found")

    return {"level": user_planet.level}


@app.post("/get_planet_mined")
async def get_planet_mined(data: PlanetLevelRequest, db: AsyncSession = Depends(get_db)):
    # Получаем ресурсы планеты
    planet_resources = await db.query(UserPlanet).filter_by(
        userId=data.userId, planetId=data.planetId
    ).first()

    if not planet_resources:
        raise HTTPException(status_code=404, detail="Minde resources not found")

    # Возвращаем только поле "mined"
    return {"mined": planet_resources.mined}


@app.post("/get_planet_resources_and_speed")
async def get_planet_resources_and_speed(data: PlanetLevelRequest, db: AsyncSession = Depends(get_db)):
    # Запросим планету по user_id и planet_id
    user_planet = await db.query(UserPlanet).filter_by(userId=data.userId, planetId=data.planetId).first()

    if not user_planet:
        raise HTTPException(status_code=404, detail="UserPlanet not found")

    # Получаем скорость планеты из модели Planet
    planet = await db.query(Planet).filter_by(id=data.planetId).first()

    if not planet:
        raise HTTPException(status_code=404, detail="Planet not found")

    # Возвращаем ресурсы и скорость планеты
    return {
        "resources": user_planet.resources,  # Ресурсы планеты
        "speed": planet.speed  # Скорость планеты
    }


class PlanetInfoResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None

class PlanetImageResponse(BaseModel):
    url: str
    alt: Optional[str]

class PlanetWikiResponse(BaseModel):
    url: str

@app.get("/planet/{planet_id}", response_model=PlanetInfoResponse)
async def get_planet(planet_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Planet).where(Planet.id == planet_id))
    planet = result.scalar_one_or_none()
    if not planet:
        raise HTTPException(status_code=404, detail="Планета не найдена")
    return planet


@app.get("/planet/{planet_id}/image", response_model=PlanetImageResponse)
async def get_planet_image(planet_id: int, db: AsyncSession = Depends(get_db)):
    planet = await db.query(Planet).filter_by(id=planet_id).first()
    if not planet or not planet.image_url:
        raise HTTPException(status_code=404, detail="Изображение не найдено")
    return {
        "url": planet.image_url,
        "alt": f"Изображение планеты {planet.name}"
    }


@app.get("/planet/{planet_id}/wiki", response_model=PlanetWikiResponse)
async def get_planet_wiki(planet_id: int, db: AsyncSession = Depends(get_db)):
    planet = await db.query(Planet).filter_by(id=planet_id).first()
    if not planet or not planet.wiki_url:
        raise HTTPException(status_code=404, detail="Вики-ссылка не найдена")
    return {
        "url": planet.wiki_url
    }


class PlanetRequest(BaseModel):
    user_id: int

@app.post("/planet/{planet_id}/full")
async def get_full_planet_info(planet_id: int, request: PlanetRequest, db: AsyncSession = Depends(get_db)):
    print(f"Request received for planet_id: {planet_id}, user_id: {request.user_id}")
    
    user_id = request.user_id  # Берем user_id из тела запроса
    
    # Ищем планету по ID
    planet_result = await db.execute(select(Planet).filter_by(id=planet_id))
    planet = planet_result.scalar_one_or_none()
    if not planet:
        raise HTTPException(status_code=404, detail="Планета не найдена")
    
    # Логируем, что планета найдена
    print(f"Planet found: {planet.name} (ID: {planet.id})")
    
    # Ищем планету пользователя
    user_planet_result = await db.execute(select(UserPlanet).filter_by(planetId=planet_id, userId=user_id))
    user_planet = user_planet_result.scalar_one_or_none()
    
    if user_planet:
        logging.info(user_planet)
        print(f"User planet found for user {user_id}")
    else:
        print(f"No user planet found for user {user_id}")
    
    # Если планета не привязана к пользователю, возвращаем дефолтные данные
    if not user_planet:
        user_planet = {
            "userId": None,
            "level": 0,
            "resources": 0,
            "mined": 0,
            "speed": 0.005,
            "alliance":False
        }
    
    # Получаем элементы планеты
    element_planets_result = await db.execute(select(Elementplanets).filter_by(planetId=planet_id))
    element_planets = element_planets_result.scalars().all()
    
    element_symbol = None
    element_index = None
    cosmo_result = await db.execute(select(Cosmoports).filter(Cosmoports.userId == user_id, Cosmoports.planetId == planet.id))
    cosmo = cosmo_result.scalar_one_or_none()
    element_id = 0

    if element_planets:
        # Получаем символ элемента
        element_id = element_planets[0].elementId
        element_result = await db.execute(select(Elements).filter_by(id=element_id))
        element = element_result.scalar_one_or_none()
        if element:
            element_symbol = element.symbol
            element_index = element.index


    # Формируем список владельцев
    owners_result = await db.execute(select(UserPlanet).filter_by(planetId=planet_id))
    owners = [owner.userId for owner in owners_result.scalars().all()]

    # Формируем ответ
    response = {
        "planet": {
            "id": planet.id,
            "name": planet.name,
            "description": planet.description if hasattr(planet, 'description') else "Нет описания",
            "img": planet.img,
            "speed": user_planet['speed'] if isinstance(user_planet, dict) else user_planet.speed, 
            "forLaboratory": planet.forLaboratory,
            "updatePrice": planet.updatePrice,
            "symbol": element_symbol,  # добавляем символ элемента
            "index": element_index,
            "health": await calculate_health(user_id, planet_id, db),
            "cosmoport_level": cosmo.level if cosmo else 0,
            "element_id":element_planets[0].elementId,
            "element_rare": element.rare
        },
        "user_planet": user_planet,
        "speed": user_planet['speed'] if isinstance(user_planet, dict) else user_planet.speed,
        "owners": owners,  # владельцы
        "element_value": await calculate_element_value(user_id, planet_id, db),
        "elements": element_symbol  # символ элемента для использования на фронте,
        
    }
    
    # Логируем финальный ответ
    # logging.info(f"Response: {response}")
    
    return response

from typing import Union
from typing import List
class WalletElement(BaseModel):
    element: Union[str, int]
    value: float
    name: str
    img: str
    symbol: str
    rare: str


class WalletUpdate(BaseModel):
    id: int
    user_id: int
    value: List[WalletElement]


@app.put("/wallet/{wallet_id}")
async def update_wallet(
    wallet_id: int,
    payload: WalletUpdate,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Wallets).where(Wallets.id == wallet_id))
    db_wallet = result.scalars().first()

    if not db_wallet:
        raise HTTPException(status_code=404, detail="Wallet not found")

    # 🔥 Преобразуем каждый WalletElement в словарь
    db_wallet.value = [element.dict() for element in payload.value]

    await db.commit()
    await db.refresh(db_wallet)

    return db_wallet






async def calculate_element_value(user_id: int, planet_id: int, db: AsyncSession):
    # Логика фарма ресурса пользователем
    query = select(UserPlanet).filter_by(userId=user_id, planetId=planet_id)
    result = await db.execute(query)
    user_planet = result.scalars().first()

    if not user_planet:
        return 0

    return user_planet.resources + user_planet.mined

# Функция для вычисления здоровья
async def calculate_health(user_id: int, planet_id: int, db: AsyncSession):
    # Логика фарма ресурса пользователем
    query = select(UserPlanet).filter_by(userId=user_id, planetId=planet_id)
    result = await db.execute(query)
    user_planet = result.scalars().first()

    if user_planet:
        health = (user_planet.mined / user_planet.resources) * 100
        return health
    else:
        return 100

from pydantic import BaseModel
from typing import Optional
from enum import Enum
from typing import List


class CosmoportType(str, Enum):
    tanker = "tanker"
    corable = "corable"


class CosmoportBase(BaseModel):
    level: Optional[int]
    type: CosmoportType
    userId: Optional[int]


class CosmoportCreate(BaseModel):
    id: int
    level: Optional[int] = None
    type: str  # Возможно, стоит использовать Enum
    userId: int
    planetId: Optional[int] = None
    name: str
    shot: int
    tonnage: int
    power: int
    cost: int

    model_config = ConfigDict(from_attributes=True)


class CosmoportUpdate(BaseModel):
    level: Optional[int]
    type: Optional[CosmoportType]

from enum import Enum

class RareEnum(str, Enum):
    Обычная = "Обычная"
    Редкая = "Редкая"
    Эпическая = "Эпическая"
    Легендарная = "Легендарная"
from pydantic import BaseModel

class UserBase(BaseModel):
    id: int
    adress: Optional[str] = None
    coins: float
    ton: float
    # добавьте другие поля, которые должны быть возвращены
    model_config = ConfigDict(from_attributes=True)

    # class Config:
    #     orm_mode = True  # Включение режима ORM для работы с SQLAlchemy объектами

class UserEnum(str, Enum):
    user = "user"
    admin = "admin"


class UserCreate(BaseModel):
    adress: Optional[str] = None

class UserOut(UserCreate):
    id: int
    email: Optional[str] = None
    password: Optional[str] = None
    role: Optional[UserEnum] = UserEnum.user
    coins: float
    ton: float
    adress: Optional[str] = None
    userName: Optional[str] = None
    tg_id: Optional[int] = None

    # class Config:
    #     orm_mode = True
    model_config = ConfigDict(from_attributes=True)


class UserUpdate(BaseModel):
    coins: Optional[float] = None
    ton: Optional[float] = None
    adress: Optional[str] = None
    tg_id: Optional[str] = None
    userName: Optional[str] = None
    email: Optional[str] = None

@app.put("/users/{user_id}")
async def update_user(user_id: int, update_data: UserUpdate, db: AsyncSession = Depends(get_db)):
    # Используем select вместо query для асинхронных сессий
    result = await db.execute(select(User).filter(User.id == user_id))
    user = result.scalar_one_or_none()  # Получаем первого пользователя или None

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Обновляем значения
    for key, value in update_data.dict(exclude_unset=True).items():
        setattr(user, key, value)

    # Выполняем коммит и обновляем пользователя
    await db.commit()
    await db.refresh(user)

    return user

@app.post("/users", response_model=UserOut)
async def create_user(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    # Проверка: есть ли пользователь с таким адресом
    query = select(User).where(User.adress == user_data.adress)
    result = await db.execute(query)
    existing_user = result.scalar_one_or_none()

    if existing_user:
        return existing_user  # Или выбросить ошибку, если нельзя возвращать повторно

    # Если нет — создаём нового
    new_user = User(adress=user_data.adress)
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user

@app.get("/user_by_tg/{tg_id}", response_model=UserOut)
async def get_user_by_tg_id(tg_id: str, db: AsyncSession = Depends(get_db)):
    query = select(User).where(User.tg_id == tg_id)
    result = await db.execute(query)
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

from typing import List, Any
# class HistoryCreate(BaseModel):
#     value: List[Any] = []

# class HistoryOut(HistoryCreate):
#     id: int
#     value: List[Any] = []

#     # class Config:
#     #     orm_mode = True
#     model_config = ConfigDict(from_attributes=True)

# @app.post("/userHistory", response_model=HistoryOut)
# async def create_history(history_data: HistoryCreate, db: AsyncSession = Depends(get_db)):
#     history = History(**history_data.dict())
#     db.add(history)
#     await db.commit()
#     await db.refresh(history)
#     return history


class WalletCreate(BaseModel):
    userId: Optional[int] = None
    value: Optional[List[Any]] = []


class WalletOut(WalletCreate):
    id: int

    # class Config:
    #     orm_mode = True
    model_config = ConfigDict(from_attributes=True)

@app.post("/wallet", response_model=WalletOut)
async def create_wallet(wallet_data: WalletCreate, db: AsyncSession = Depends(get_db)):
    wallet = Wallets(**wallet_data.dict())
    db.add(wallet)
    await db.commit()
    await db.refresh(wallet)
    return wallet


@app.get("/users")
async def get_user_by_address(adress: str, db: AsyncSession = Depends(get_db)):
    # Запрос в БД для поиска пользователя с указанным адресом
    logging.info(f'Searching for user with address: {adress}')
    
    # Используем select() для асинхронного запроса
    query = select(User).filter(User.adress == adress)
    
    # Выполняем запрос с асинхронной сессией
    result = await db.execute(query)
    
    # Получаем первого пользователя или None
    user = result.first()

    # Если пользователь не найден, выбрасываем ошибку
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    logging.info(f"Found user: {user}")

    # Поскольку user - это кортеж, получаем объект User из кортежа
    user_obj = user[0]  # Извлекаем первый элемент кортежа, который является объектом User

    return user_obj

class UpdateTonPayload(BaseModel):
    user_id: int
    ton: float

@app.post("/update-userton", response_model=UserBase)
async def update_user_ton(payload: UpdateTonPayload, db: AsyncSession = Depends(get_db)):
    user_id = payload.user_id
    new_ton = payload.ton

    if user_id is None or new_ton is None:
        raise HTTPException(status_code=400, detail="Missing user_id or ton")

    logging.info(f"Updating user {user_id} with new ton: {new_ton}")

    # Проверка, существует ли пользователь
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Обновляем значение ton
    await db.execute(
        update(User).where(User.id == user_id).values(ton=new_ton)
    )
    await db.commit()

    # Возвращаем обновленного пользователя
    updated_result = await db.execute(select(User).where(User.id == user_id))
    updated_user = updated_result.scalar_one()

    return updated_user

@app.get("/user_spaceships/{user_id}", response_model=List[CosmoportCreate])
async def get_user_cosmoports(user_id: int, planet_id: Optional[int] = None, db: AsyncSession = Depends(get_db)):
    # Строим базовый запрос для получения космопортов пользователя
    query = select(Cosmoports).filter(Cosmoports.userId == user_id)
    
    if planet_id:
        query = query.filter(Cosmoports.planetId == planet_id)

    # Выполняем запрос асинхронно
    result = await db.execute(query)
    cosmoports = result.scalars().all()  # Получаем все результаты

    logging.info(f"Found cosmoports: {cosmoports}")
    return cosmoports

@app.get("/check_nft/{index}")
async def check_nft(index: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Cosmoports).filter(Cosmoports.index == index))
    nft = result.scalar_one_or_none()

    return {
        "exists": nft is not None,
        "userId": nft.userId if nft else None
    }


class CosmoportCreateRequest(BaseModel):
    userId: int
    address: Optional[str] = None 
    name: str
    tonnage: int
    shot: int
    planetId: Optional[int] = None  # на всякий случай
    level: Optional[int] = 1
    type: Optional[str] = "corable"
    index: int
    power: int
    cost: Optional[int] = None

@app.post("/add_nft")
async def add_nft(data: CosmoportCreateRequest, db: AsyncSession = Depends(get_db)):
    # Проверяем, есть ли такой NFT в базе
    result = await db.execute(select(Cosmoports).filter(Cosmoports.index == data.index))
    existing_nft = result.scalar_one_or_none()

    if existing_nft:
        # Если NFT есть и владелец другой — меняем владельца
        if existing_nft.userId != data.userId:
            existing_nft.userId = data.userId
            await db.commit()
            await db.refresh(existing_nft)
            return {"status": "updated", "id": existing_nft.id, "message": "NFT передан новому пользователю"}
        else:
            raise HTTPException(status_code=400, detail="NFT уже принадлежит этому пользователю")

    # Иначе создаём нового
    new_cosmoport = Cosmoports(
        userId=data.userId,
        index=data.index,
        name=data.name,
        tonnage=data.tonnage,
        shot=data.shot,
        planetId=data.planetId,
        level=data.level,
        type=data.type,
        power=data.power,
        cost=3
    )

    db.add(new_cosmoport)
    await db.commit()
    await db.refresh(new_cosmoport)

    return {"status": "created", "id": new_cosmoport.id}


@app.get("/user_spaceshipsall/{user_id}", response_model=List[CosmoportCreate])
async def get_user_cosmoports(user_id: int, planet_id: Optional[int] = None, db: AsyncSession = Depends(get_db)):
    # Строим базовый запрос для получения космопортов пользователя
    query = select(Cosmoports).filter(Cosmoports.userId == user_id)

    # Выполняем запрос асинхронно
    result = await db.execute(query)
    cosmoports = result.scalars().all()  # Получаем все результаты

    logging.info(f"Found cosmoports: {cosmoports}")
    return cosmoports

# class BuyCosmoportRequest(BaseModel):
#     user_id: int
#     cost: int

class UserResponse(BaseModel):
    id: int

    coins: float
    userName: str
    tg_id: int

    # Добавь всё, что нужно от пользователя

    class Config:
        from_attributes = True  # <--- ВАЖНО

class BuyCosmoportRequest(BaseModel):
    user_id: int
    cost: int
    # planet_id: int  # Добавляем planet_id для покупки

# Ответ на покупку космопорта
class BuyCosmoportResponse(BaseModel):
    cosmoport: CosmoportCreate
    updatedUser: UserResponse

@app.post("/buy_cosmoport", response_model=BuyCosmoportResponse)
async def buy_cosmoport(buy_data: BuyCosmoportRequest, db: AsyncSession = Depends(get_db)):
    # Получаем пользователя
    result = await db.execute(select(User).filter(User.id == buy_data.user_id))
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.coins < buy_data.cost:
        raise HTTPException(status_code=400, detail="Not enough coins")

    # Создаем новый космопорт
    new_cosmoport = Cosmoports(
        userId=user.id,
        level=1,
        type="corable"
    )

    # Списываем монеты ДО commit
    user.coins -= buy_data.cost

    # Добавляем и сохраняем изменения
    db.add(new_cosmoport)
    db.add(user)  # на всякий случай, если он не в сессии
    await db.commit()

    # Обновляем объекты
    await db.refresh(new_cosmoport)
    await db.refresh(user)

    return {
        "cosmoport": new_cosmoport,
        "updatedUser": user
    }



# 🔹 Создание нового космопорта
@app.post("/user_spaceships/create", response_model=CosmoportCreate)
async def create_cosmoport(cosmoport: CosmoportCreate, db: AsyncSession = Depends(get_db)):
    try:
        # При создании нового космопорта также указываем planetId
        db_cosmoport = Cosmoports(**cosmoport.dict())
        
        db.add(db_cosmoport)
        await db.commit()  # Асинхронный коммит
        await db.refresh(db_cosmoport)  # Асинхронное обновление
        
        return db_cosmoport
    except Exception as e:
        # Логирование ошибки и возврат ответа с ошибкой
        raise HTTPException(status_code=500, detail=f"Ошибка при создании космопорта: {e}")

class CosmoportUpdate(BaseModel):
    level: Optional[int] = None
    type: Optional[str] = None
    coins: Optional[int] = None
    planet_id: Optional[int] = None  # Новый параметр для обновления планеты
    cost: Optional[int] = None 
from fastapi import Query

@app.post("/user_spaceships/{cosmoport_id}/update", response_model=CosmoportCreate)
async def update_cosmoport(
    cosmoport_id: int,
    update_data: CosmoportUpdate,
    cost: int = Query(...),
    db: AsyncSession = Depends(get_db)
):
    # Ищем космопорт по ID
    cosmoport = await db.execute(select(Cosmoports).filter(Cosmoports.id == cosmoport_id))
    cosmoport = cosmoport.scalar_one_or_none()
    
    if not cosmoport:
        raise HTTPException(status_code=404, detail="Cosmoport not found")

    # Ищем пользователя по ID
    user = await db.execute(select(User).filter(User.id == cosmoport.userId))
    user = user.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.coins < cost:
        raise HTTPException(status_code=400, detail="Not enough coins")

    # Списываем средства с баланса пользователя
    user.coins -= cost
    await db.commit()

    # Обновляем данные космопорта
    for key, value in update_data.dict(exclude_unset=True).items():
        setattr(cosmoport, key, value)

    # Увеличиваем стоимость космопорта (например, на 10%)
    if cosmoport.cost is None:
        cosmoport.cost = cost  # если не задано, приравниваем к изначальной цене
    else:
        cosmoport.cost = int(cosmoport.cost * 2.3)  # +10%

    # Увеличиваем power, tonnage и shot в 1.8 раза
    if cosmoport.power:
        cosmoport.power = int(cosmoport.power * 1.8)
    if cosmoport.tonnage:
        cosmoport.tonnage = int(cosmoport.tonnage * 1.8)
    if cosmoport.shot:
        cosmoport.shot = int(cosmoport.shot * 1.8)

    await db.commit()
    await db.refresh(cosmoport)

    return cosmoport





from sqlalchemy import desc, case

# class Planetss(BaseModel):
#     id: int
#     name: Optional[str] = None
#     speed: Optional[float] = None
#     updatePrice: Optional[int] = None
#     img: Optional[str] = None
#     active: bool
#     forLaboratory: bool

#     class Config:
#         orm_mode = True

from sqlalchemy.orm import joinedload
from sqlalchemy import case
from sqlalchemy.orm import aliased

# class Planetss(BaseModel):
#     id: int
#     name: Optional[str] = None
#     speed: Optional[float] = None
#     updatePrice: Optional[int] = None
#     img: Optional[str] = None
#     active: bool
#     forLaboratory: bool

#     class Config:
#         orm_mode = True



class ElementOut(BaseModel):
    id: int
    name: str  # или другие поля Element
    symbol: str
    img: str
    index: int
    rare: Optional[RareEnum] = RareEnum.Обычная



    # class Config:
    #     orm_mode = True
    model_config = ConfigDict(from_attributes=True)


class UserPlanetOut(BaseModel):
    id: int
    level: str
    userId: int
    planetId: int
    resources: float
    mined: float
    speed: float


    # class Config:
    #     orm_mode = True
    model_config = ConfigDict(from_attributes=True)


class Planetss(BaseModel):
    id: int
    name: Optional[str] = None
    speed: Optional[float] = None
    updatePrice: Optional[int] = None
    img: Optional[str] = None
    active: bool
    forLaboratory: bool

    elements: Optional[List[ElementOut]] = []
    user_planets: Optional[List[UserPlanetOut]] = []

    # class Config:
    #     orm_mode = True
    model_config = ConfigDict(from_attributes=True)

from sqlalchemy.sql import and_

class PlanetUserData(BaseModel):
    userId: Optional[int]
    level: Optional[int]
    speed: Optional[float]
    mined: Optional[float]
    resources: Optional[float]

class Planetss(BaseModel):
    id: int
    name: str
    img: str
    speed: Optional[float]
    updatePrice: Optional[float]
    forLaboratory: Optional[bool]
    active: Optional[bool]
    symbol: Optional[str]
    index: Optional[int]
    cosmoport_level: Optional[int]
    element_id: Optional[int]
    element_rare: Optional[str]
    health: Optional[float]
    owners: List[int]
    element_value: Optional[float]
    user_planet: Optional[PlanetUserData]


from pydantic import BaseModel
from typing import List, Optional

class FullPlanetResponse(BaseModel):
    planet: dict         # перепишите на вашу модель
    user_planet: dict
    speed: float
    owners: List[int]
    element_value: float
    elements: str

# @app.get("/planets", response_model=List[FullPlanetResponse])
# async def get_planets(
#     range: Optional[List[int]] = Query([0, 9]),
#     laboratory: Optional[bool] = False,
#     userId: Optional[int] = 0,
#     db: AsyncSession = Depends(get_db),
# ):
#     limit = range[1] - range[0] + 1
#     offset = range[0]

#     user_planet_alias = aliased(UserPlanet)
#     logging.info(f"User {userId}")

#     # Фильтры для активации планет
#     filters = [Planet.active == True]
#     if laboratory:
#         filters.append(Planet.forLaboratory == True)


#     stmt = (
#         select(Planet)
#         .outerjoin(user_planet_alias, and_(
#             user_planet_alias.planetId == Planet.id,
#             user_planet_alias.userId == userId  # добавляем фильтр по userId
#         ))
#         .where(*filters)
#         .order_by(
#             # Сначала планеты, принадлежащие пользователю (userPlanet.userId != None), затем по лабораторным
#             case((user_planet_alias.userId != None, 0), else_=1),
#             Planet.forLaboratory.desc(),  # После этого сортируем по участию в лаборатории
#             Planet.id.asc()  # И, наконец, сортировка по ID планеты
#         )
#         .limit(limit)
#         .offset(offset)
#     )

#     # Выполняем запрос
#     result = await db.execute(stmt)
#     planets = result.scalars().all()


#     out = []
#     for planet in planets:
#         # 1) user_planet
#         up = await db.execute(
#             select(UserPlanet).where(
#                 UserPlanet.planetId == planet.id,
#                 UserPlanet.userId == userId
#             )
#         )
        

#         user_planet_result = await db.execute(
#             select(UserPlanet).where(
#                 UserPlanet.planetId == planet.id,
#                 UserPlanet.userId == userId
#             )
#         )
#         user_planet = user_planet_result.scalar_one_or_none()

#         if user_planet:
#             print(f"User planet found for user {userId}")
#         else:
#             print(f"No user planet for user {userId}, searching for best user planet")

#             # 🔍 2) если нет — ищем чужую с самым высоким level
#             best_planet_result = await db.execute(
#                 select(UserPlanet)
#                 .where(UserPlanet.planetId == planet.id)
#                 .order_by(UserPlanet.level.desc())
#                 .limit(1)
#             )
#             best_user_planet = best_planet_result.scalar_one_or_none()

#             if best_user_planet:
#                 print(f"Found best user planet with level {best_user_planet.level}")
#                 user_planet = best_user_planet
#             else:
#                 print("No user planets at all for this planet")
#                 user_planet = {
#                     "userId": None,
#                     "level": 0,
#                     "resources": 0,
#                     "mined": 0,
#                     "speed": 0.00005
#                 }



#         # 2) owners
#         owners_res = await db.execute(
#             select(UserPlanet.userId).where(UserPlanet.planetId == planet.id)
#         )
#         owners_raw = owners_res.scalars().all()
#         owners = [uid for uid in owners_raw if uid is not None]

#         # 3) element (symbol, index)
#         ep = await db.execute(
#             select(Elementplanets.elementId)
#                 .where(Elementplanets.planetId == planet.id)
#         )
#         element_id = ep.scalar_one_or_none()
#         element = None
#         if element_id:
#             el = await db.execute(
#                 select(Elements).where(Elements.id == element_id)
#             )
#             element = el.scalar_one()

#         # 4) element_value
#         ev = await calculate_element_value(userId, planet.id, db)

#         # 5) health & cosmoport_level
#         health = await calculate_health(userId, planet.id, db)
#         # cosmo = await db.execute(
#         #     select(Cosmoports).where(
#         #         Cosmoports.userId == userId,
#         #         Cosmoports.planetId == planet.id
#         #     )
#         # )
#         # cosmo_result = await db.execute(
#         #     select(Cosmoports).where(
#         #         Cosmoports.userId == userId,
#         #         Cosmoports.planetId == planet.id
#         #     )
#         # )
#         # cosmo = cosmo_result.scalar_one_or_none()
#         # cosmoport_level = cosmo.level if cosmo else 0
#         # Если user_planet — это модель, конвертируем в dict
#         if not isinstance(user_planet, dict):
#             user_planet = {
#                 "userId": user_planet.userId,
#                 "level": user_planet.level,
#                 "resources": user_planet.resources,
#                 "mined": user_planet.mined,
#                 "speed": user_planet.speed,
#             }


#         out.append(FullPlanetResponse(
#             planet={
#                 "id": planet.id,
#                 "name": planet.name,
#                 "description": planet.description if hasattr(planet, 'description') else "Нет описания",
#                 "img": planet.img,
#                 "index": element.index,
#                 "symbol": element.symbol if element else None,
#                 "forLaboratory": planet.forLaboratory,
#                 "health": health,
#                 "cosmoport_level": 1,
#                 "updatePrice": planet.updatePrice,
#                 "element_id": element_id,
#                 "element_rare": element.rare
#             },
#             user_planet=
#                user_planet
#             ,
#             speed= user_planet['speed'] if isinstance(user_planet, dict) else user_planet.speed,
#             owners=owners,
#             element_value=ev,
#             elements=element.symbol if element else "",
#         ))
#     return out

from collections import defaultdict
import asyncio

@app.get("/planets", response_model=List[FullPlanetResponse])
async def get_planets(
    range: Optional[List[int]] = Query([0, 9]),
    laboratory: Optional[bool] = False,
    userId: Optional[int] = 0,
    db: AsyncSession = Depends(get_db),
):
    limit = range[1] - range[0] + 1
    offset = range[0]

    filters = [Planet.active == True]
    if laboratory:
        filters.append(Planet.forLaboratory == True)

    # Основной запрос по планетам
    user_planet_alias = aliased(UserPlanet)
    stmt = (
        select(Planet)
        .outerjoin(user_planet_alias, and_(
            user_planet_alias.planetId == Planet.id,
            user_planet_alias.userId == userId
        ))
        .where(*filters)
        .order_by(
            case((user_planet_alias.userId != None, 0), else_=1),
            Planet.forLaboratory.desc(),
            Planet.id.asc()
        )
        .limit(limit)
        .offset(offset)
    )

    result = await db.execute(stmt)
    planets = result.scalars().all()
    planet_ids = [p.id for p in planets]

    # --- Подготовка вспомогательных данных батчами ---
    # Все UserPlanet
    user_planets_raw = await db.execute(
        select(UserPlanet).where(UserPlanet.planetId.in_(planet_ids))
    )
    user_planets = user_planets_raw.scalars().all()
    user_planet_map = defaultdict(list)
    for up in user_planets:
        user_planet_map[up.planetId].append(up)

    # Все Elementplanets
    ep_data = await db.execute(
        select(Elementplanets.planetId, Elementplanets.elementId)
        .where(Elementplanets.planetId.in_(planet_ids))
    )
    ep_map = dict(ep_data.all())

    # Все Elements
    element_ids = list(set(ep_map.values()))
    elements_data = await db.execute(
        select(Elements).where(Elements.id.in_(element_ids))
    )
    elements = {el.id: el for el in elements_data.scalars()}

    # Собираем все userId из user_planet_map
    all_user_ids = {up.userId for ups in user_planet_map.values() for up in ups if up.userId}
    users_data = await db.execute(
        select(User.id, User.userName).where(User.id.in_(all_user_ids))
    )
    usernames = {uid: uname for uid, uname in users_data.all()}


    # Все владельцы
    owners_data = await db.execute(
        select(UserPlanet.planetId, UserPlanet.userId)
        .where(UserPlanet.planetId.in_(planet_ids))
    )
    owners_map = defaultdict(list)
    for pid, uid in owners_data.all():
        if uid is not None:
            owners_map[pid].append(uid)

    # --- Обработка каждой планеты ---
    out = []
    for planet in planets:
        ups = user_planet_map.get(planet.id, [])

        user_planet = next((up for up in ups if up.userId == userId), None)
        if not user_planet and ups:
            user_planet = max(ups, key=lambda up: up.level)
        elif not user_planet:
            user_planet = {
                "userId": None,
                "userName": None,
                "level": 0,
                "resources": 0,
                "mined": 0,
                "speed": 0.00005,
                "alliance":False,
                "related_planets":[],
                "sumhealth":0.0,
                "alliancename":''
            }

        # Получение элемента
        element_id = ep_map.get(planet.id)
        element = elements.get(element_id) if element_id else None

        # Параллельный расчёт значений
        ev_task = asyncio.create_task(calculate_element_value(userId, planet.id, db))
        health_task = asyncio.create_task(calculate_health(userId, planet.id, db))
        ev, health = await asyncio.gather(ev_task, health_task)

        # Приведение user_planet в dict при необходимости
        if not isinstance(user_planet, dict):
            user_planet = {
                "userId": user_planet.userId,
                "userName": usernames.get(user_planet.userId),
                "level": user_planet.level,
                "resources": user_planet.resources,
                "mined": user_planet.mined,
                "speed": user_planet.speed,
                "alliance":user_planet.alliance,
                "related_planets":user_planet.related_planets,
                "sumhealth":user_planet.sumhealth,
                "alliancename":user_planet.alliancename
            }


        out.append(FullPlanetResponse(
            planet={
                "id": planet.id,
                "name": planet.name,
                "description": getattr(planet, 'description', "Нет описания"),
                "img": planet.img,
                "index": getattr(element, "index", None),
                "symbol": getattr(element, "symbol", None),
                "forLaboratory": planet.forLaboratory,
                "health": health,
                "cosmoport_level": 1,
                "updatePrice": planet.updatePrice,
                "element_id": element_id,
                "element_rare": getattr(element, "rare", None)
            },
            user_planet=user_planet,
            speed=user_planet["speed"],
            owners=owners_map.get(planet.id, []),
            element_value=ev,
            elements=getattr(element, "symbol", "")
        ))

    return out





# @app.get("/planets", response_model=List[Planetss])
# async def get_planets(
#     range: Optional[List[int]] = Query([0, 9]),
#     laboratory: Optional[bool] = False,
#     userId: Optional[int] = 0,
#     db: AsyncSession = Depends(get_db),
# ):
#     limit = range[1] - range[0] + 1
#     offset = range[0]

#     user_planet_alias = aliased(UserPlanet)
#     logging.info(f"User {userId}")

#     # Фильтры для активации планет
#     filters = [Planet.active == True]
#     if laboratory:
#         filters.append(Planet.forLaboratory == True)

#     # Основной запрос с LEFT OUTER JOIN на user_planets
#     stmt = (
#         select(Planet)
#         .outerjoin(user_planet_alias, and_(
#             user_planet_alias.planetId == Planet.id,
#             user_planet_alias.userId == userId  # добавляем фильтр по userId
#         ))
#         .where(*filters)
#         .order_by(
#             # Сначала планеты, принадлежащие пользователю (userPlanet.userId != None), затем по лабораторным
#             case((user_planet_alias.userId != None, 0), else_=1),
#             Planet.forLaboratory.desc(),  # После этого сортируем по участию в лаборатории
#             Planet.id.asc()  # И, наконец, сортировка по ID планеты
#         )
#         .limit(limit)
#         .offset(offset)
#     )

#     # Выполняем запрос
#     result = await db.execute(stmt)
#     planets = result.scalars().all()

#     # Формируем и возвращаем список планет
#     return [
#         Planetss(
#             id=planet.id,
#             name=planet.name,
#             speed=planet.speed,
#             updatePrice=planet.updatePrice,
#             img=planet.img,
#             active=planet.active,
#             forLaboratory=planet.forLaboratory,
#         )
#         for planet in planets
#     ]



@app.get("/elements", response_model=List[ElementOut])
async def get_elements(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Elements))
    elements = result.scalars().all()
    return elements

# Строим эндпоинт
# @app.get("/planets", response_model=List[Planetss])
# async def get_planets(
#     range: Optional[List[int]] = [0, 9],
#     laboratory: Optional[bool] = False,
#     userId: Optional[int] = 0,
#     db: AsyncSession = Depends(get_db)
# ):
#     filters = [Planet.active == True]
#     if laboratory:
#         filters.append(Planet.forLaboratory == True)

#     # Фильтр для планет пользователя
#     user_planet_alias = aliased(UserPlanet)
#     query_user_planets = select(Planet).join(
#         user_planet_alias, user_planet_alias.planetId == Planet.id
#     ).filter(user_planet_alias.userId == userId, *filters)

#     query_user_planets = query_user_planets.offset(range[0]).limit(range[1] - range[0] + 1)

#     # Фильтр для остальных планет
#     query_other_planets = select(Planet).filter(*filters).filter(
#         Planet.id.notin_(
#             select(user_planet_alias.planetId).filter(user_planet_alias.userId == userId)
#         )
#     )

#     query_other_planets = query_other_planets.offset(range[0]).limit(range[1] - range[0] + 1)

#     # Логируем запросы
#     logger.info(f"Executing user planets query: {str(query_user_planets)}")
#     logger.info(f"Executing other planets query: {str(query_other_planets)}")

#     # Выполняем запросы
#     user_planets_result = await db.execute(query_user_planets)
#     other_planets_result = await db.execute(query_other_planets)

#     # Логируем результат запроса
#     user_planets_data = user_planets_result.scalars().all()
#     other_planets_data = other_planets_result.scalars().all()

#     logger.info(f"Fetched user planets: {user_planets_data}")
#     logger.info(f"Fetched other planets: {other_planets_data}")

#     planets_data = user_planets_data + other_planets_data  # Объединяем результаты

#     if not planets_data:
#         return []

#     planets_response = []
#     for planet in planets_data:
#         planet_dict = {
#             "id": planet.id,
#             "name": planet.name,
#             "speed": planet.speed,
#             "updatePrice": planet.updatePrice,
#             "img": planet.img,
#             "active": planet.active,
#             "forLaboratory": planet.forLaboratory,
#         }
#         planets_response.append(Planetss(**planet_dict))

#     return planets_response




from fastapi.responses import JSONResponse

class WalletRequest(BaseModel):
    user_id: int

@app.post('/get-wallet')
async def get_wallet(data: WalletRequest, db: AsyncSession = Depends(get_db)):
    # Проверяем, есть ли кошелек у пользователя
    result = await db.execute(select(Wallets).where(Wallets.userId == data.user_id))
    wallet = result.scalars().first()
    logging.info(f'Wlt {wallet}')

    # Если кошелька нет, создаем новый
    if wallet is None:
        logging.info(f'Создаем новый кошелек для пользователя с ID {data.user_id}')
        new_wallet = Wallets(userId=data.user_id, value=[])  # Создаем кошелек с пустым значением
        db.add(new_wallet)
        await db.commit()  # Сохраняем новый кошелек в базе данных
        await db.refresh(new_wallet)  # Обновляем объект после сохранения, чтобы получить его ID

        # Возвращаем созданный кошелек
        return JSONResponse(content={
            "id": new_wallet.id,
            "value": new_wallet.value,
            "userId": new_wallet.userId
        })
    
    # Если кошелек найден, возвращаем его
    return JSONResponse(content={
        "id": wallet.id,
        "value": wallet.value,
        "userId": wallet.userId
    })
class psreq(BaseModel):
    planet_id: int

@app.post('/get-el')
async def get_wallet(data: psreq, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Elementplanets).where(Elementplanets.planetId == data.planet_id)
    )
    elementplanet = result.scalars().first()
    logging.info(f'Wlt {elementplanet}')

    if elementplanet is None:
        return JSONResponse(status_code=404, content={"message": "Кошелек не найден"})

    return JSONResponse(content={
        "id": elementplanet.elementId
    })


class UpdateMinedRequest(BaseModel):
    mined: float
    user_id: int

@app.put("/ssssss/{planet_id}/")
async def update_mined_resource(
    planet_id: int,
    data: UpdateMinedRequest,
    db: AsyncSession = Depends(get_db)
):
    # Проверка, что планета с таким ID и user_id существует
    result = await db.execute(
        select(UserPlanet).where(
            UserPlanet.planetId == planet_id,
            UserPlanet.userId == data.user_id  # 🛡 Проверка принадлежности пользователю
        )
    )
    planet = result.scalars().first()


    if not planet:
        raise HTTPException(status_code=404, detail="Планета не найдена или не принадлежит пользователю")

    planet.mined = data.mined
    await db.commit()
    await db.refresh(planet)

    return JSONResponse(content={
        "success": True,
        "planet_id": planet_id,
        "user_id": data.user_id,
        "mined": data.mined
    })


from typing import Optional, Dict, Any

class UpdateMinedRequestNew(BaseModel):
    mined: float
    user_id: int
    element: Optional[Dict[str, Any]] = None  # Принимаем объект элемента (можно уточнить тип)


from fastapi import Path

@app.put("/sssssssss/{element_id}/")
async def update_mined_resource(
    element_id: int,
    data: UpdateMinedRequestNew,
    db: AsyncSession = Depends(get_db)
):
    # 1) Найти planetId по elementId из таблицы element_planets
    result = await db.execute(
        select(Elementplanets.planetId).where(Elementplanets.elementId == element_id)
    )
    planet_id = result.scalar()

    if not planet_id:
        raise HTTPException(status_code=404, detail="Планета не найдена для данного элемента")

    # 2) Найти запись UserPlanet по planetId и user_id
    result = await db.execute(
        select(UserPlanet).where(
            UserPlanet.planetId == planet_id,
            UserPlanet.userId == data.user_id
        )
    )
    user_planet = result.scalars().first()

    if not user_planet:
        raise HTTPException(status_code=404, detail="Планета не найдена или не принадлежит пользователю")

    # 3) Обновить mined
    user_planet.mined = data.mined

    if data.element:
        print(f"Обновлен элемент: {data.element}")
        # Если нужно, можно сохранить элемент в поле user_planet

    await db.commit()
    await db.refresh(user_planet)

    return JSONResponse(content={
        "success": True,
        "planet_id": planet_id,
        "user_id": data.user_id,
        "mined": data.mined,
        "element": data.element
    })


class UpdateTgIdRequest(BaseModel):
    userId: int
    tgId: int
    userName: str

@app.post("/update_tgid")
async def update_tg_id(
    payload: UpdateTgIdRequest,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(User).where(User.id == payload.userId))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    user.tg_id = str(payload.tgId)
    user.userName = payload.userName
    await db.commit()

    return {
        "status": "ok",
        "message": f"tg_id обновлён для пользователя {payload.userId}"
    }


from fastapi import HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

@app.put("/ffeddscds/{element_id}/")
async def update_mined_resource(
    element_id: int,
    data: UpdateMinedRequestNew,
    db: AsyncSession = Depends(get_db)
):
    # 1) Найти planetId по elementId из таблицы element_planets
    result = await db.execute(
        select(Elementplanets.planetId).where(Elementplanets.elementId == element_id)
    )
    planet_id = result.scalar()

    # if not planet_id:
    #     raise HTTPException(status_code=404, detail="Планета не найдена для данного элемента")

    # 2) Найти запись UserPlanet по planetId и user_id
    result = await db.execute(
        select(UserPlanet).where(
            UserPlanet.planetId == planet_id,
            UserPlanet.userId == data.user_id
        )
    )
    user_planet = result.scalars().first()

    # 3) Получаем кошелек пользователя (независимо от принадлежности элемента)
    wallet_result = await db.execute(
        select(Wallets).where(Wallets.userId == data.user_id)
    )
    wallet = wallet_result.scalars().first()

    # 4) Если элемент не принадлежит пользователю — обнуляем его в кошельке
    if not user_planet:
        if wallet and wallet.value:
            # Предполагается, что wallet.value — список словарей, например: [{"symbol": "...", "value": ...}, ...]
            new_wallet_values = []
            for item in wallet.value:
                if item.get("element") == element_id:
                    # Обнуляем монету (mined/значение = 0)
                    new_wallet_values.append({**item, "value": 0})
                else:
                    new_wallet_values.append(item)

            wallet.value = new_wallet_values
            db.add(wallet)
            await db.commit()
            await db.refresh(wallet)

        return JSONResponse(
    status_code=200,
    content={"success": True, "message": "Элемент не принадлежит пользователю, монета обнулена и обновлена в кошельке."}
)

    if user_planet:
        # 5) Обновить mined в user_planet
        user_planet.mined = 0

        # 6) Если нужно, сохранить элемент (возможно, в user_planet)
        if data.element:
            print(f"Обновлен элемент: {data.element}")

        db.add(user_planet)
    await db.commit()
    await db.refresh(user_planet)

    return JSONResponse(content={
        "success": True,
        "planet_id": planet_id,
        "user_id": data.user_id,
        "mined": 0,
        "element": data.element
    })



from typing import Optional

class PurchaseRequest(BaseModel):
    planet_id: int
    user_id: int
    level: Optional[int] = None   # необязательное поле
    
    model_config = ConfigDict(from_attributes=True)


from aiogram.types import (CallbackQuery, LabeledPrice, Message, InlineKeyboardButton,
                           PreCheckoutQuery)

from datetime import datetime
import random

def create_token():
    payload_token = random.randint(10 ** 15, 10 ** 16 - 1)

    return payload_token

from sqlalchemy import func, select
class CheckTokenRequest(BaseModel):
    payload_token: int

@app.post('/create_link')
async def create_payment_link(data: PurchaseRequest, db: AsyncSession = Depends(get_db)):
    logging.info(f'Planet ID: {data.planet_id}, Level: {data.level}')
    
    try:
        query = select(Planet.cost).where(Planet.id == int(data.planet_id))
        result = await db.execute(query)
        base_cost = result.scalar()

        if base_cost is None:
            logging.error(f"Planet с ID {data.planet_id} не найден")
            return {"error": "Planet не найден"}

        # Вычисляем цену с учетом уровня
        # Например, цена = базовая цена * уровень или фиксированная логика
        level = data.level or 1
        # Твоя логика: если уровень 1 — цена 0, если 2 — 50, 3 — 100 и тд
        amount = 0 if level <= 1 else (level - 1) * 50

        logging.info(f'Calculated cost for level {level}: {amount}')

        prices = [LabeledPrice(label="XTR", amount=int(amount))]
        payload_token = create_token()

        payment_link = await bot.create_invoice_link(
            title="Planet Purchase",
            description="Purchase a planet for XTR!",
            payload=str(payload_token),
            provider_token="",  # Настрой
            currency="XTR",
            prices=prices
        )
        print(payment_link)

        new_payment = Payments(
            userId=data.user_id,
            planetId=int(data.planet_id),
            amount=int(amount),
            date=datetime.utcnow().isoformat(),
            payload_token=str(payload_token),
            status="false"
        )

        db.add(new_payment)
        await db.commit()
        await db.refresh(new_payment)

        return {'payment_link': payment_link, 'payload_token': payload_token}
    
    except Exception as e:
        logging.error(f"Ошибка при создании ссылки: {e}")
        return {"error": "Ошибка при создании платежа"}



class DepositGc(BaseModel):
    user_id: int
    amount: int   # необязательное поле
    
    model_config = ConfigDict(from_attributes=True)

@app.post('/deposit_gc')
async def create_payment_link(data: DepositGc, db: AsyncSession = Depends(get_db)):
    logging.info(f'Planet ID: {data.amount}, Level: {data.user_id}')
    
    try:
        
        amount = data.amount
        # Вычисляем цену с учетом уровня
        # Например, цена = базовая цена * уровень или фиксированная логика
        

        logging.info(f'Calculated cost for level  {amount}')

        prices = [LabeledPrice(label="XTR", amount=int(amount))]
        payload_token = create_token()

        payment_link = await bot.create_invoice_link(
            title="Planet Purchase",
            description="Purchase a planet for XTR!",
            payload=str(payload_token),
            provider_token="",  # Настрой
            currency="XTR",
            prices=prices
        )
        print(payment_link)

        new_payment = Payments(
            userId=data.user_id,
            planetId=1,
            amount=int(amount),
            date=datetime.utcnow().isoformat(),
            payload_token=str(payload_token),
            status="false"
        )

        db.add(new_payment)
        await db.commit()
        await db.refresh(new_payment)

        return {'payment_link': payment_link, 'payload_token': payload_token}
    
    except Exception as e:
        logging.error(f"Ошибка при создании ссылки: {e}")
        return {"error": "Ошибка при создании платежа"}
    

class RemoveLimit(BaseModel):
    user_id: int  # необязательное поле
    
    model_config = ConfigDict(from_attributes=True)

@app.post('/remove_attack_limit')
async def create_payment_link(data: RemoveLimit, db: AsyncSession = Depends(get_db)):
    logging.info(f'Planet ID: Level: {data.user_id}')
    
    try:
        
        amount = 3
        # Вычисляем цену с учетом уровня
        # Например, цена = базовая цена * уровень или фиксированная логика
        

        logging.info(f'Calculated cost for level  {amount}')

        prices = [LabeledPrice(label="XTR", amount=int(amount))]
        payload_token = create_token()

        payment_link = await bot.create_invoice_link(
            title="Planet Purchase",
            description="Purchase a planet for XTR!",
            payload=str(payload_token),
            provider_token="",  # Настрой
            currency="XTR",
            prices=prices
        )
        print(payment_link)

        new_payment = Payments(
            userId=data.user_id,
            planetId=3,
            amount=int(amount),
            date=datetime.utcnow().isoformat(),
            payload_token=str(payload_token),
            status="false"
        )

        db.add(new_payment)
        await db.commit()
        await db.refresh(new_payment)

        return {'payment_link': payment_link, 'payload_token': payload_token}
    
    except Exception as e:
        logging.error(f"Ошибка при создании ссылки: {e}")
        return {"error": "Ошибка при создании платежа"}


@app.post('/check_token_remove_limit')
async def check_token(data: CheckTokenRequest, db: AsyncSession = Depends(get_db)):
    logging.info(f'Проверка токена: {data.payload_token}')
    
    try:
        # Ищем запись о платеже по токену
        query = select(Payments).where(Payments.payload_token == str(data.payload_token))
        result = await db.execute(query)
        payment_record = result.scalar_one_or_none()

        if payment_record:
            if payment_record.status == 'false':
                return {"status": "false", "message": "Платеж не подтвержден"}

            user_id = payment_record.userId

            # Удаляем запись об атаке (если была)
            result = await db.execute(select(Attacks).where(Attacks.tg_id == user_id))
            attack_record = result.scalar_one_or_none()

            if attack_record:
                await db.delete(attack_record)
                logging.info(f"Запись об атаке для пользователя {user_id} удалена")

            await db.commit()

            logging.info(f"Платеж с payload {data.payload_token} подтверждён")

            return {"status": "true", "message": "Лимит снят успешно"}

        else:
            return {"status": "false", "message": "Платёж не найден"}

    except Exception as e:
        logging.error(f"Ошибка при проверке токена: {e}")
        return {"status": "false", "message": "Ошибка сервера"}


@app.post('/check_token_deposit')
async def check_token(data: CheckTokenRequest, db: AsyncSession = Depends(get_db)):
    logging.info(f'Проверка токена: {data.payload_token}')
    
    try:
        # Запрос для поиска платежа по payload_token
        query = select(Payments).where(Payments.payload_token == str(data.payload_token))
        result = await db.execute(query)
        payment_record = result.scalar_one_or_none()  # используем scalar_one_or_none, чтобы получить один объект или None

        if payment_record:
            # Получаем необходимые данные из payment_record
            if payment_record.status == 'false':
                return {"status": "false", "message": "Платеж не подтвержден"}

            # planetId = payment_record.planetId  # Получаем planetId из платежа
            user_id = payment_record.userId  # Получаем user_id из платежа
            amount = payment_record.amount

            # Создаем новую запись в таблице UserPlanet для успешного платежа
            

            query_user = select(User).filter(User.id == user_id)
            result_user = await db.execute(query_user)
            user = result_user.scalar_one_or_none()


            user.coins += amount
            await db.commit()
            await db.refresh(user)
            logging.info(f"Updated balance")

          

            logging.info(f"Платеж с payload {data.payload_token} обновлен на статус 'paid'")

            return {"status": "true", "message": "Оплата завершена, NFT отправлен и планета добавлена"}

        else:
            # Если платеж не найден
            return {"status": "false", "message": "Платеж не найден"}

    except Exception as e:
        # Логирование ошибки
        logging.error(f"Ошибка при проверке токена: {e}")

# Проверка токена для платежа
@app.post('/check_token')
async def check_token(data: CheckTokenRequest, db: AsyncSession = Depends(get_db)):
    logging.info(f'Проверка токена: {data.payload_token}')
    
    try:
        # Запрос для поиска платежа по payload_token
        query = select(Payments).where(Payments.payload_token == str(data.payload_token))
        result = await db.execute(query)
        payment_record = result.scalar_one_or_none()  # используем scalar_one_or_none, чтобы получить один объект или None

        if payment_record:
            # Получаем необходимые данные из payment_record
            if payment_record.status == 'false':
                return {"status": "false", "message": "Платеж не подтвержден"}

            planetId = payment_record.planetId  # Получаем planetId из платежа
            user_id = payment_record.userId  # Получаем user_id из платежа

            # Создаем новую запись в таблице UserPlanet для успешного платежа
            new_user_planet = UserPlanet(
                level="1",  # Пример значения, можно изменить в зависимости от логики
                userId=user_id,
                planetId=planetId,
                resources=1000000.0,  # Изначальное количество ресурсов, можно задать другое значение
                mined=0.0,  # Изначально ничего не добыто
                speed=0.00005  # Изначальная скорость, можно настроить
            )

            # Добавляем запись в сессию и коммитим
            db.add(new_user_planet)
            await db.commit()
            logging.info(f"Новая планета добавлена для пользователя {user_id} (planetId: {planetId})")

          

            logging.info(f"Платеж с payload {data.payload_token} обновлен на статус 'paid'")

            return {"status": "true", "message": "Оплата завершена, NFT отправлен и планета добавлена"}

        else:
            # Если платеж не найден
            return {"status": "false", "message": "Платеж не найден"}

    except Exception as e:
        # Логирование ошибки
        logging.error(f"Ошибка при проверке токена: {e}")
        return {"status": "false", "message": f"Ошибка при проверке токена: {e}"}

from sqlalchemy import func, select
class FreeRentRequest(BaseModel):
    user_id : int
    planet_id: int
    # payload_token: int
# Проверка токена для платежа
@app.post('/free_rent')
async def free_rent(data: FreeRentRequest, db: AsyncSession = Depends(get_db)):
    # logging.info(f'Проверка токена: {data.payload_token}')
    
    
    planetId = data.planet_id  # Получаем planetId из платежа
    user_id = data.user_id  # Получаем user_id из платежа

            # Создаем новую запись в таблице UserPlanet для успешного платежа
    new_user_planet = UserPlanet(
        level="1",  # Пример значения, можно изменить в зависимости от логики
        userId=user_id,
        planetId=planetId,
        resources=1000000.0,  # Изначальное количество ресурсов, можно задать другое значение
        mined=0.0,  # Изначально ничего не добыто
        speed=0.00005, 
        cost = 3 # Изначальная скорость, можно настроить
    )

            # Добавляем запись в сессию и коммитим
    db.add(new_user_planet)
    await db.commit()
    logging.info(f"Новая планета добавлена для пользователя {user_id} (planetId: {planetId})")

    return {"status": "success", "message": "Оплата завершена, NFT отправлен и планета добавлена"}

          

    #         logging.info(f"Платеж с payload {data.payload_token} обновлен на статус 'paid'")

    #         return {"status": "true", "message": "Оплата завершена, NFT отправлен и планета добавлена"}

    #     else:
    #         # Если платеж не найден
    #         return {"status": "false", "message": "Платеж не найден"}

    # except Exception as e:
    #     # Логирование ошибки
    #     logging.error(f"Ошибка при проверке токена: {e}")
    #     return {"status": "false", "message": f"Ошибка при проверке токена: {e}"}

@app.post("/planet/{planet_id}/level")
async def get_planet_level(planet_id: int, request: Request, db: AsyncSession = Depends(get_db)):
    # Получаем данные из тела запроса
    body = await request.json()
    user_id = body.get("user_id")

    # Получаем данные из базы асинхронно
    query_userplanet = select(UserPlanet).filter(UserPlanet.planetId == planet_id, UserPlanet.userId == user_id)
    result_userplanet = await db.execute(query_userplanet)
    userplanet = result_userplanet.scalar_one_or_none()

    query_planet = select(Planet).filter_by(id=planet_id)
    result_planet = await db.execute(query_planet)
    planet = result_planet.scalar_one_or_none()

    if not userplanet:
        raise HTTPException(status_code=404, detail="Planet not found")

    return {"level": userplanet.level, "speed": userplanet.speed, "cost": userplanet.cost}

@app.post("/planet/{planet_id}/upgrade")
async def upgrade_planet(planet_id: int, request: Request, db: AsyncSession = Depends(get_db)):
    # Получаем данные из тела запроса
    body = await request.json()
    user_id = body.get("user_id")
    cost = body.get("cost")
    logging.info(f"COST {cost}")


    # Получаем данные из базы асинхронно
    query_userplanet = select(UserPlanet).filter(UserPlanet.planetId == planet_id, UserPlanet.userId == user_id)
    result_userplanet = await db.execute(query_userplanet)
    userplanet = result_userplanet.scalar_one_or_none()

    query_planet = select(Planet).filter_by(id=planet_id)
    result_planet = await db.execute(query_planet)
    planet = result_planet.scalar_one_or_none()

    query_user = select(User).filter(User.id == user_id)
    result_user = await db.execute(query_user)
    user = result_user.scalar_one_or_none()

    if not userplanet:
        raise HTTPException(status_code=404, detail="Planet not found")
    

    logging.info(f"COST {user.coins}")
    
    # if cost < planet.cost:
    #     raise HTTPException(status_code=400, detail="Not enough funds to upgrade")
    
    if user.coins < cost:
        raise HTTPException(status_code=400, detail="Not enough coins")

    # Списываем монеты с баланса пользователя
    user.coins -= cost
    await db.commit()
    await db.refresh(user)
    
    # Логика улучшения планеты
    await db.refresh(userplanet)  # загрузи все поля userplanet
    await db.refresh(planet)
    # us = userplanet.level
    logging.info(f"user {userplanet.level}")
    new_level = int(userplanet.level) + 1
    if int(userplanet.level)==1:
        new_speed = 0.5
    else:
        new_speed = userplanet.speed *1.8 # Увеличиваем скорость на 20%
    new_cost = userplanet.cost * 2.3  # Увеличиваем стоимость на 50%

    # Обновляем данные в базе
    userplanet.level = str(new_level)
    userplanet.speed = new_speed
    userplanet.cost = new_cost
    # planet.cost = new_cost

    await db.commit()  # Сохраняем изменения в базе
    # await db.refresh(userplanet)

    return {"new_level": new_level, "new_speed": new_speed, "new_cost": new_cost}


class UpgradeSpeed(BaseModel):
    user_id: int
    planet_id: int

@app.post("/upgrade_speedone")
async def upgrade_planet(data: UpgradeSpeed, db: AsyncSession = Depends(get_db)):
    user_id = int(data.user_id)
    planet_id = int(data.planet_id)

    query_userplanet = select(UserPlanet).filter(UserPlanet.planetId == planet_id, UserPlanet.userId == user_id)
    result_userplanet = await db.execute(query_userplanet)
    userplanet = result_userplanet.scalar_one_or_none()

    query_planet = select(Planet).filter_by(id=planet_id)
    result_planet = await db.execute(query_planet)
    planet = result_planet.scalar_one_or_none()

    query_user = select(User).filter(User.id == user_id)
    result_user = await db.execute(query_user)
    user = result_user.scalar_one_or_none()

    if not userplanet:
        raise HTTPException(status_code=404, detail="Planet not found")

    cost = userplanet.cost

    if user.coins < cost:
        raise HTTPException(status_code=400, detail="Not enough coins")

    user.coins -= cost
    await db.commit()
    await db.refresh(user)

    await db.refresh(userplanet)
    await db.refresh(planet)

    new_level = int(userplanet.level) + 1
    if int(userplanet.level) == 1:
        new_speed = 0.5
    else:
        new_speed = userplanet.speed * 1.8

    new_cost = userplanet.cost * 2.3

    userplanet.level = str(new_level)
    userplanet.speed = new_speed
    userplanet.cost = new_cost

    await db.commit()

    return {"status": "success","new_level": new_level, "new_speed": new_speed, "new_cost": new_cost}

from sqlalchemy.orm import selectinload


@app.post("/upgrade_health")
async def upgrade_health(data: UpgradeSpeed, db: AsyncSession = Depends(get_db)):
    user_id = data.user_id
    planet_id = data.planet_id

    # Получаем объекты из БД
    result_userplanet = await db.execute(
        select(UserPlanet).filter(UserPlanet.planetId == planet_id, UserPlanet.userId == user_id)
    )
    userplanet = result_userplanet.scalar_one_or_none()

    result_user = await db.execute(
        select(User).filter(User.id == user_id)
    )
    user = result_user.scalar_one_or_none()

    result_planet = await db.execute(
        select(Planet)
        .options(selectinload(Planet.elements))  # загружаем связанные элементы
        .filter(Planet.id == planet_id)
    )
    planet = result_planet.scalar_one_or_none()

    if not userplanet or not user or not planet:
        raise HTTPException(status_code=404, detail="Планета, пользователь или элемент не найдены")

    # Получаем символ первого элемента, связанного с планетой
    if not planet.elements or len(planet.elements) == 0:
        raise HTTPException(status_code=400, detail="У планеты не найдено ни одного ресурса")
    
    resource_symbol = planet.elements[0].symbol

    # Проверка на наличие монет
    cost = userplanet.cost or 0
    if user.coins < cost:
        raise HTTPException(status_code=400, detail="Недостаточно средств")

    # Списываем монеты
    user.coins -= cost

    # Увеличиваем mined на 10%
    original_mined = userplanet.mined or 0
    mined_bonus = original_mined * 0.10
    userplanet.mined = round(original_mined + mined_bonus, 5)

    # Повышаем уровень
    new_level = int(userplanet.level) + 1
    userplanet.level = str(new_level)

    # Увеличиваем стоимость
    userplanet.cost = round(cost * 2.3, 2)

    # Обновляем wallet
    wallet = (await db.execute(select(Wallets).where(Wallets.userId == user_id))).scalar_one_or_none()
    if not wallet:
        raise HTTPException(status_code=453, detail="Кошелёк пользователя не найден")

    wallet_updated = False
    for entry in wallet.value:
        if entry.get("symbol") == resource_symbol:
            entry["value"] += round(mined_bonus, 5)
            wallet_updated = True
            break

    if not wallet_updated:
        wallet.value.append({"symbol": resource_symbol, "value": round(mined_bonus, 5)})

    flag_modified(wallet, "value")
    db.add(wallet)
    db.add(user)
    db.add(userplanet)
    await db.commit()

    return {
        "status": "success",
        "new_level": userplanet.level,
        "new_cost": userplanet.cost,
        "new_mined": userplanet.mined,
        "coins_left": user.coins,
        "wallet_updated": True,
        "resource_symbol": resource_symbol
    }


from fastapi import HTTPException

class AttackSize(BaseModel):
    user_id: int
    planet_id: int


@app.post("/attack-size")
async def update_cosmoport(payload: AttackSize, db: AsyncSession = Depends(get_db)):
    attacker_id = payload.user_id
    result = await db.execute(select(Cosmoports).where(Cosmoports.userId == attacker_id))
    cosmoports = result.scalars().all()

    sum_attack = sum(int(c.tonnage or 0) for c in cosmoports)

    return {"attackSize": sum_attack}


class AttackRequest(BaseModel):
    attacker_id: int
    defender_id: int
    planet_id: int
    resource: str

from datetime import datetime, timedelta
from sqlalchemy import update

@app.post("/attack_check")
async def update_cosmoport(payload: AttackRequest, db: AsyncSession = Depends(get_db)):
    attacker_id = payload.attacker_id
    defender_id = payload.defender_id
    planet_id = payload.planet_id
    resiurce = payload.resource

    logging.info(f"USER {defender_id}")

    result = await db.execute(select(Attacks).where(Attacks.tg_id == attacker_id))
    attack_record = result.scalar_one_or_none()

    # Если уже атаковал в последние 24 часа — ошибка





    if attack_record and attack_record.last_attack_at:
        now = datetime.utcnow()
        time_since_last_attack = now - attack_record.last_attack_at

        if time_since_last_attack < timedelta(hours=1):
            remaining_minutes = int((timedelta(hours=1) - time_since_last_attack).total_seconds() // 60)
            raise HTTPException(
                status_code=451,
                detail=f"🚫 Вы уже атаковали за последний час! Попробуйте снова через {remaining_minutes} мин ⏳"
            )
        
    userplanet = (await db.execute(
        select(UserPlanet).filter(UserPlanet.planetId == planet_id, UserPlanet.userId == defender_id)
    )).scalar_one_or_none()




    result = await db.execute(select(Cosmoports).where(Cosmoports.userId == attacker_id))
    cosmoports = result.scalars().all()

    sum_attack = sum(int(c.shot) * int(c.power) for c in cosmoports)


    if not cosmoports:
        raise HTTPException(
            status_code=450,
            detail="Приобретите космопорт для того, чтобы атаковать другого игрока"
        )
    
    logging.info(f"SUM ATTACK {sum_attack}")
    logging.info(f"MINED {userplanet.mined}")
    
    if userplanet.mined+userplanet.sumhealth>sum_attack:
        raise HTTPException(
            status_code=452,
            detail="Планета слишком хорошо защищена, атака провалилась, прокачивайте корабли для успешных атак!"
        )

from sqlalchemy.orm.attributes import flag_modified


@app.post("/attack")
async def update_cosmoport(payload: AttackRequest, db: AsyncSession = Depends(get_db)):
    attacker_id = payload.attacker_id
    defender_id = payload.defender_id
    planet_id = payload.planet_id
    resiurce = payload.resource

    

    logging.info(f"{resiurce}")

    result = await db.execute(select(Attacks).where(Attacks.tg_id == attacker_id))
    attack_record = result.scalar_one_or_none()

    if attack_record and attack_record.last_attack_at:
        now = datetime.utcnow()
        time_since_last_attack = now - attack_record.last_attack_at
        if time_since_last_attack < timedelta(hours=1):
            remaining_minutes = int((timedelta(hours=1) - time_since_last_attack).total_seconds() // 60)
            raise HTTPException(
                status_code=451,
                detail=f"🚫 Вы уже атаковали за последний час! Попробуйте снова через {remaining_minutes} мин ⏳"
            )

    result = await db.execute(select(Cosmoports).where(Cosmoports.userId == attacker_id))
    cosmoports = result.scalars().all()
    if not cosmoports:
        raise HTTPException(
            status_code=450,
            detail="Приобретите космопорт для того, чтобы атаковать другого игрока"
        )

    # Атакующий и защитник
    attacker = (await db.execute(select(User).where(User.id == attacker_id))).scalar_one_or_none()
    defender = (await db.execute(select(User).where(User.id == defender_id))).scalar_one_or_none()
    userplanet = (await db.execute(
        select(UserPlanet).filter(UserPlanet.planetId == planet_id, UserPlanet.userId == defender_id)
    )).scalar_one_or_none()

    sum_attack = sum(int(c.shot) * int(c.power) for c in cosmoports)
    sum_ton = sum(int(c.tonnage or 0) for c in cosmoports)
    
    # Сколько можем унести (по тоннажу)
    max_steal = sum_ton
    earned = 0

    # GC
    if resiurce == "GC":
        earned = min(max_steal, defender.coins)
        attacker.coins += earned
        defender.coins -= earned

    # Tonium
    elif resiurce == "Tonium":
        earned = min(max_steal, defender.ton)
        attacker.ton += earned
        defender.ton -= earned

    # Custom ресурс
    else:
        attacker_wallet = (await db.execute(select(Wallets).where(Wallets.userId == attacker_id))).scalar_one_or_none()
        defender_wallet = (await db.execute(select(Wallets).where(Wallets.userId == defender_id))).scalar_one_or_none()
        if not attacker_wallet or not defender_wallet:
            raise HTTPException(status_code=453, detail="Кошелёк не найден")

        attacker_updated = False
        defender_updated = False

        for entry in defender_wallet.value:
            if entry.get("symbol") == resiurce:
                earned = min(max_steal, entry["value"])
                entry["value"] -= earned
                defender_updated = True
                break

        for entry in attacker_wallet.value:
            if entry.get("symbol") == resiurce:
                entry["value"] += earned
                attacker_updated = True
                break

        if not attacker_updated:
            attacker_wallet.value.append({"symbol": resiurce, "value": earned})

        flag_modified(attacker_wallet, "value")
        flag_modified(defender_wallet, "value")
        db.add(attacker_wallet)
        db.add(defender_wallet)

    # Обновляем накопленный ресурс планеты
    userplanet.mined = max(0, userplanet.mined - sum_attack)

    db.add(attacker)
    db.add(defender)
    db.add(userplanet)

    # Обновление записи о времени атаки
    if attack_record:
        attack_record.last_attack_at = datetime.utcnow()
    else:
        db.add(Attacks(tg_id=attacker_id, last_attack_at=datetime.utcnow()))

    await db.commit()
    await db.refresh(attacker)
    await db.refresh(userplanet)

    # Уведомление защитнику
    if defender.tg_id:
        await bot.send_message(395581114
            ,
            f"Привет {defender.tg_id}"
        )
        await bot.send_message(
            defender.tg_id,
            f"🚨 Ваша планета была атакована! 💥\n\nБыло похищено {earned} {resiurce}.\nПостройте оборону, усиливайте космопорты и отомстите пользователю ID{attacker_id} (@{attacker.userName})! 🚀🔥",
            reply_markup=chat_keyboard()
        )

    return {
        "status": "success",
        "resource": resiurce,
        "amount": earned,
        "sum_ton": sum_ton,
        "new_balance": {
            "GC": attacker.coins,
            "Tonium": attacker.ton,
            "custom": attacker_wallet.value if resiurce not in ["GC", "Tonium"] else None
        }
    }






class UpdateTGModel(BaseModel):
    user_id: int
    tg_id: int
    userName: str

@app.post("/update_tg")
async def update_tg_id(data: UpdateTGModel, db: AsyncSession = Depends(get_db)):
    query = select(User).where(User.id == data.user_id)
    result = await db.execute(query)
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.tg_id = data.tg_id
    user.userName = data.userName
    await db.commit()
    await db.refresh(user)
    return {"status": "ok", "message": "tg_id обновлен"}


class UserHistoryPayload(BaseModel):
    userId: int
    value: List[Any]  # можно конкретизировать тип, если надо

@app.post("/userHistory")
async def update_history(payload: UserHistoryPayload, db: AsyncSession = Depends(get_db)):
    # Проверяем, есть ли уже запись с таким userId
    logging.info(f"userId {payload.userId}")

    result = await db.execute(select(History).where(History.userId == payload.userId))
    history = result.scalar_one_or_none()

    if history:
        # Обновляем
        history.value = payload.value
    else:
        # Создаем новую запись
        history = History(userId=payload.userId, value=payload.value)
        db.add(history)

    await db.commit()
    await db.refresh(history)
    

    return {"status": "ok", "history": history.value}


@app.get("/getUserHistory")
async def get_user_history(userId: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(History).where(History.userId == userId))
    history = result.scalar_one_or_none()
    if history:
        return {"history": history.value}
    else:
        return {"history": []}


# import logging
# import asyncio
# from fastapi import FastAPI
# logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')




# app = FastAPI(title="MyApp")


# @app.on_event("startup")
# async def startup_event():

#     logging.info("✅ FastAPI-Admin готов!")
#     # dp.include_router(bot_router)
#     # await start_bot()
    
#     # Даем немного времени на запуск сервера
#     await asyncio.sleep(2)  

#     webhook_url = 'https://playmost.ru'
#     logging.info(f"🚀 Webhook устанавливается на {webhook_url}")

#     # await bot.set_webhook(
#     #     url=webhook_url,
#     #     allowed_updates=dp.resolve_used_update_types(),
#     #     drop_pending_updates=True
#     # )
    
#     logging.info(f"Webhook set to {webhook_url}")


# @app.get("/myroute")
# async def myroute():
#     return {"msg": "Hello"}

# # app.include_router(game_router)


# # app.mount("/administrator", admin_app)



# # app.mount("/static", StaticFiles(directory="app/static"), name="static")

# # app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


# if __name__ == "__main__":
#     import uvicorn
    
    
#     uvicorn.run("app.main:app", host="0.0.0.0", port=8001, reload=True)

# from fastapi import APIRouter, FastAPI

# api_router = APIRouter()

# @api_router.get("/myroute")
# async def myroute():
#     return {"msg": "Hello"}

# app = FastAPI()
# app.include_router(api_router)

# print("Registered routes:")
# for route in app.routes:
#     print(route.path)


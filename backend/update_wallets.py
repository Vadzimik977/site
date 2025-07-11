# backend/tasks/update_wallets.py

import asyncio
from datetime import datetime
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.mutable import flag_modified
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import declarative_base

from models import UserPlanet, Elements, Elementplanets, Wallets

# 🔧 Подключение к базе
DATABASE_URL = "postgresql+asyncpg://myuser:Ouhdsoucnrp!@89.169.46.223:5432/tonium"

engine = create_async_engine(DATABASE_URL, echo=False)  # ⬅ echo отключен для уменьшения логов

# ⚙️ Фабрика сессий
async_session_maker = async_sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

# 📦 Получение сессии
async def get_session() -> AsyncSession:
    async with async_session_maker() as session:
        yield session


from copy import deepcopy


# 🔁 Обновление ресурсов кошельков
async def update_wallets_resources(session: AsyncSession):
    start_time = datetime.now()
    print(f"Скрипт начат в {start_time.strftime('%Y-%m-%d %H:%M:%S')}")

    result = await session.execute(
        select(UserPlanet)
        .where(UserPlanet.speed >= 0.05)
        .options(selectinload(UserPlanet.planet))
    )
    user_planets = result.scalars().all()
    if not user_planets:
        print("Нет подходящих планет для обновления.")
        return

    planet_ids = [p.planetId for p in user_planets]
    user_ids = [p.userId for p in user_planets if p.userId]

    element_links = await session.execute(
        select(Elementplanets).where(Elementplanets.planetId.in_(planet_ids))
    )
    element_planet_links = element_links.scalars().all()
    element_ids = [link.elementId for link in element_planet_links]

    elements_result = await session.execute(
        select(Elements).where(Elements.id.in_(element_ids))
    )
    elements_by_id = {el.id: el for el in elements_result.scalars().all()}

    planet_to_element = {
        link.planetId: elements_by_id[link.elementId]
        for link in element_planet_links
        if link.planetId and link.elementId in elements_by_id
    }

    wallets_result = await session.execute(
        select(Wallets).where(Wallets.userId.in_(user_ids))
    )
    wallets_by_user = {w.userId: w for w in wallets_result.scalars().all()}

    user_planets_by_id = {up.planetId: up for up in user_planets}

    user_planets_by_uid = {up.id: up for up in user_planets}


    interval_seconds = 5

    # --- 1. Обновляем mined и кошельки ---
    for up in user_planets:
        element = planet_to_element.get(up.planetId)
        wallet = wallets_by_user.get(up.userId)

        if not element or not wallet:
            continue

        speed_per_interval = up.speed * interval_seconds / 3600
        up.mined += speed_per_interval

        print(f"Начисляю ресурсы на планете {up.planetId} пользователю {up.userId}: +{speed_per_interval:.6f} → mined: {up.mined:.6f}")

        new_value = deepcopy(wallet.value) if wallet.value else []

        updated = False
        for entry in new_value:
            if entry.get("symbol") == element.symbol:
                entry["value"] += speed_per_interval
                updated = True
                print(f'''Обновляю кошелёк пользователя {wallet.userId} — {element.symbol}: +{speed_per_interval:.6f}, всего: {entry["value"]:.6f}''')
                break

        if not updated:
            new_value.append({
                "symbol": element.symbol,
                "name": element.name,
                "value": speed_per_interval,
                "img": element.img,
                "rare": element.rare.value,
                "element": element.index,
            })

        wallet.value = new_value

        flag_modified(up, "mined")
        flag_modified(wallet, "value")

    await session.flush()

    # --- 2. Обновляем sumhealth для альянсовых планет с related_planets ---
    for up in user_planets:
        if up.alliance and getattr(up, 'related_planets', None) and len(up.related_planets) > 0:
            related_sum = 0.0
            print(up.related_planets)
            for related_id in up.related_planets:
                related_planet = user_planets_by_uid.get(related_id)
                print(related_planet)
                if related_planet:
                    related_sum += related_planet.mined

            up.sumhealth =  related_sum
            flag_modified(up, "sumhealth")
            print(f"Обновлен sumhealth для планеты {up.planetId}: {up.sumhealth:.6f}")

    try:
        await session.commit()
    except Exception as e:
        print(f"🔥 Ошибка при коммите: {e}")
        await session.rollback()

    end_time = datetime.now()
    print(f"Скрипт завершен в {end_time.strftime('%Y-%m-%d %H:%M:%S')}")


# ⏰ Планировщик выполнения раз в час (сейчас спит по 5 сек, можно настроить)
async def run_hourly():
    while True:
        async for session in get_session():
            await update_wallets_resources(session)
            break
        await asyncio.sleep(5)


# 🚀 Запуск
if __name__ == "__main__":
    asyncio.run(run_hourly())

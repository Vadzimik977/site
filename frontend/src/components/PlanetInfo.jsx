// import React from 'react';

// const ProfileInfo = ({ data, image, wiki }) => {
//   if (!data) return <div>Нет данных о планете.</div>;

//   return (
//     <div className="p-4 max-w-3xl mx-auto">
//       <h1 className="text-3xl font-bold mb-4">{data.name}</h1>
//       {image && (
//         <img
//           src={image.url}
//           alt={image.alt || data.name}
//           className="w-full h-auto rounded-lg mb-4 shadow"
//         />
//       )}
//       <p className="mb-4 text-gray-700">{data.description}</p>
//       {wiki && (
//         <a
//           href={wiki.url}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="text-blue-600 underline"
//         >
//           Подробнее в Википедии
//         </a>
//       )}
//     </div>
//   );
// };

// export default ProfileInfo;


import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import Timer from './Timer';  // Компонент для таймера, если используется
import styles from "../components/main/PlanetMain.module.scss"; // Пусть с твоими стилями

const PlanetInfo = ({ planet, user_planet, speed, owners, elements, walletUpdate }) => {
  const { t } = useTranslation();
  
  const [isOwner, setIsOwner] = useState(false);
  const [isAttackPopupOpen, setIsAttackPopupOpen] = useState(false);
  const [isRentPopupOpen, setIsRentPopupOpen] = useState(false);
  const [planetData, setPlanetData] = useState(planet);  // Управление состоянием планеты
  const [value, setValue] = useState(0); // Пример вычисляемого значения
  const [planetImage, setPlanetImage] = useState(''); // Для изображения планеты

  // Обновление состояния владельца
  useEffect(() => {
    if (owners) {
      setIsOwner(owners.includes(user_planet?.userId));  // Смотрим, является ли текущий пользователь владельцем
    }
  }, [owners, user_planet]);

  // Логика для вычисления значения (например, добыча или другие параметры)
  useEffect(() => {
    if (planetData && planetData.digged) {
      const newValue = planetData.digged * (speed / 2);  // Пример вычисления
      setValue(newValue);
    }
  }, [planetData, speed]);

  // Ленивая загрузка изображения планеты
  const loadPlanetImage = useCallback(() => {
    if (planetData) {
      setPlanetImage(`/img/planet/${planetData.img}`);
    }
  }, [planetData]);

  useEffect(() => {
    loadPlanetImage();
  }, [loadPlanetImage]);

  // Обработчики событий
  const getUsersPlanet = () => {
    // Логика для получения списка планет пользователя
  };

  const showUpgradeModal = (show) => {
    // Логика для отображения модалки улучшения планеты
  };
  const userPlanetLevel = user_planet ? user_planet.level : 1;  // Значение по умолчанию


  const anotherUserPlanet = !isOwner && owners.length > 0;

  return (
    <div className={`planets__planet animated-border-container with_To rotate ${!isOwner ? "ver3" : isOwner ? "ver1" : "ver2"} ${Number(userPlanetLevel) === 11 ? "green-glow" : ""} ${planetData?.planet?.forLaboratory ? "white-glow" : ""}`} onClick={walletUpdate}>
      <div className={styles.planetWrapper}>
        <div className={styles.planetLeft}>
          <h4>
            {planetData?.name} ({elements}) - Planet #{planetData?.index}
          </h4>
          <span className={styles.planetDescription}>
            Добываемый ресурс: {planetData?.name} ({elements})
          </span>

          <div className={styles.owner}>
            <div>
              <img src="/icons/astronaut_helmet.png" width={32} height={32} />
              <div className={styles.planetOwner}>
                {isOwner ? "Владелец планеты: Вы" : anotherUserPlanet ? `Владелец: ID${user_planet?.userId}` : "Владельца нет"}
              </div>
            </div>
          </div>

          <div className={styles.planet_right}>
            <div className={styles.planet_preview}>
              <div className={styles.planet_wrapper}>
                <img src={planetImage} className={styles.planet_preview__planet} alt={planetData?.name} />
                <button className={styles.planet_list_button} onClick={getUsersPlanet}>
                  Список планет
                </button>
              </div>
            </div>
          </div>
          
          <div className={styles["planetInfo"]}>
            <div className={styles["planetInfo__row"]}>
              <span className={styles["planetInfo__title"]}>Уровень </span>
              <span className={styles["planetInfo__description"]}>
              <div className="planet-level">
        <span>Уровень планеты: {userPlanetLevel}</span>
      </div>
              </span>
            </div>

            <div className={styles["planetInfo__row"]}>
              <span className={styles["planetInfo__title"]}>Скорость </span>
              <span className={styles["planetInfo__description"]}>
                { (speed / 2).toFixed(3)} ({planetData?.symbol})/ч
              </span>
            </div>

            <div className={styles["planetInfo__row"]}>
              <span className={styles["planetInfo__title"]}>Добыто </span>
              <span className={styles["planetInfo__description"]}>
                {value.toFixed(5) ?? "Загрузка..."}
              </span>
            </div>

            {planetData?.forLaboratory && (
              <div className="planet__time-timer">
                <Timer />
              </div>
            )}
          </div>
        </div>

        <div className={styles.actions}>
          {!isOwner && (
            <button
              className={styles["action-btn"]}
              onClick={() => setIsAttackPopupOpen(true)}
            >
              {t('attack')}
              <img src="/icons/sword.png" width={20} height={20} />
            </button>
          )}

          {!isOwner && (
            <button
              className={styles["action-btn"]}
              onClick={() => setIsRentPopupOpen(true)}
            >
              {t('rent')}
              <img src="/icons/time.png" width={20} height={20} />
            </button>
          )}

          {isOwner && Number(userPlanetLevel) !== 11 && (
            <button
              className={styles["action-btn"]}
              onClick={() => showUpgradeModal(true)}
            >
              Улучшить
              <img src="/icons/upgrade.png" width={24} height={24} />
            </button>
          )}
        </div>

        <div className={styles.planet_bottom} style={{ backgroundImage: `url(/img/buildings/${isOwner ? userPlanetLevel - 1 : userPlanetLevel > 0 ? userPlanetLevel - 1 : 0}.png)` }}>
          <div className={styles.planet_bottom_actions}>
            <div className={styles.planet_bottom_actions__up}></div>
            <Link to="/tasks">
              <div className={styles.free_res}>
                <div className={styles.free_res__title}>{t('freeResource')}</div>
                <div className={styles.free_res__description}>{t('freeResourceInfo')}</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanetInfo;


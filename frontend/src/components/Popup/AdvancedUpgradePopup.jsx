import { useEffect, useState } from 'react';
import Popup from './Popup';
import styles from "./Popup.module.scss";

const AdvancedUpgradePopup = ({
  isOpen,
  setPopupOpen,
  userId,
  planetId,
  onSuccess, // ✅ добавили
}) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [upgradeCost, setUpgradeCost] = useState(null);
  const telegram = window?.Telegram?.WebApp;

  const [upgradeResult, setUpgradeResult] = useState(null);


  // Получение стоимости апгрейда
  useEffect(() => {
    const fetchPlanetLevel = async () => {
      try {
        const response = await fetch(`https://playmost.ru/api2/planet/${planetId}/level`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: userId }),
        });

        if (!response.ok) {
          throw new Error('Не удалось получить данные о планете');
        }

        const data = await response.json();
        setUpgradeCost(data.cost); // Устанавливаем стоимость апгрейда
      } catch (error) {
        console.error("Ошибка при получении данных о планете", error);
      }
    };

    if (isOpen) {
      fetchPlanetLevel();
      setIsSuccess(false);
    }
  }, [isOpen, userId, planetId]);

  // Обработка апгрейда
  const handleUpgrade = async (type) => {
    setIsLoading(true);
    const endpoint =
      type === "health"
        ? "https://playmost.ru/api2/upgrade_health"
        : "https://playmost.ru/api2/upgrade_speedone";
  
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, planet_id: planetId }),
      });
  
      if (response.status === 400) {
        alert("Недостаточно средств");
        setPopupOpen(false);
        return;
      }
  
      const result = await response.json();
  
      if (result.status === "success") {
        setIsSuccess(true);
      
        onSuccess?.({
          type,     // "health" или "speed"
          result,   // весь ответ с сервера
        });
      }
       else {
        alert(result.message || "Ошибка при улучшении.");
        console.log("Result",result.message);
        setPopupOpen(false);
      }
    } catch (e) {
      console.error("Ошибка улучшения:", e);
      alert("Произошла ошибка.");
      setPopupOpen(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCloseAndReload = () => {
    setPopupOpen(false);
    // window.location.reload();
  };

  return isOpen ? (
    <Popup title={isSuccess ? "Успешно!" : "Выберите улучшение"} setPopupStatus={setPopupOpen}>
      <div className={styles.modal__content}>
        {isSuccess ? (
          <>
            <p className={styles.modal__summary}>Улучшение применено!</p>
            <div className={styles.modal__buttons_wrapper}>
              <button className={styles.modal__buttons_button1} onClick={handleCloseAndReload}>
                Окей
              </button>
            </div>
          </>
        ) : (
          <>
            <p className={styles.modal__label}>Что хотите улучшить?</p>
            {upgradeCost !== null && (
              <p className={styles.modal__cost}>💰 Стоимость улучшения: {upgradeCost} монет</p>
            )}
            <div className={styles.modal__buttons_wrapper}>
              <button
                className={styles.modal__buttons_button1}
                onClick={() => handleUpgrade("health")}
                disabled={isLoading}
              >
                🛡 Здоровье +10%
              </button>
              <button
                className={styles.modal__buttons_button1}
                onClick={() => handleUpgrade("speed")}
                disabled={isLoading}
              >
                ⚡ Скорость добычи
              </button>
            </div>
          </>
        )}
      </div>
    </Popup>
  ) : null;
};

export default AdvancedUpgradePopup;

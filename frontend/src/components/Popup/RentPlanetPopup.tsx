import { useState } from 'react';
import Popup from './Popup'; // Импортируем основной компонент Popup
import styles from "./Popup.module.scss";
import {
  useTonAddress,
  useTonWallet,
  useIsConnectionRestored,
} from "@tonconnect/ui-react";

const RentPlanetPopup = ({ isOpen, setIsRentPopupOpen, onRentSuccess, planetId, userId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [level, setLevel] = useState(1); 

  const telegram = window?.Telegram.WebApp;
  const address = useTonAddress();
  const tgID = telegram?.initDataUnsafe?.user?.id;

  // Функция для вычисления цены в GC
  const getPriceGC = (level) => {
    if (level <= 1) return 0;
    return (level - 1) * 50;
  };

  const priceGC = getPriceGC(level);

  const handleRent = async (type: 'stars' | 'nft') => {

    if (userId === 9999 || !address) {
      alert("Подключите кошелек для приобретения планет.");
      return;
    }
    
    if (type === 'stars') {

      

      
      try {
        const response = await fetch('https://playmost.ru/api2/create_link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ planet_id: planetId, user_id: userId, level: level }),
        });
  
        if (!response.ok) {
          throw new Error('Не удалось создать ссылку для аренды');
        }
  
        const data = await response.json();
        const payload_token = data.payload_token;
        console.log("Ответ от сервера:", data);
  
        setIsLoading(true);
        
        telegram.openInvoice(data.payment_link, (status) => {
          if (status === "cancelled" || status === "failed") {

            telegram.showAlert("Платёж отменён или не удался.");
            setIsLoading(false);
          } else {
            pollSubscriptionStatus(payload_token);
          }
        });
  
      } catch (error) {
        console.error('Ошибка при аренде:', error);
        telegram.showAlert("Ошибка во время аренды.");
        setIsLoading(false);
      }
    }
  };
  
  const handleFreeRent = async () => {
    setIsLoading(true);
    if (userId === 9999 || !address) {
      alert("Подключите кошелек для приобретения планет.");
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await fetch('https://playmost.ru/api2/free_rent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planet_id: planetId, user_id: userId }),
      });
  
      const result = await response.json();
  
      if (result.status === 'success') {
        telegram.showAlert("Планета успешно арендована!");
        onRentSuccess();
        setIsRentPopupOpen(false);
        window.location.reload();
      } else {
        telegram.showAlert(result.message || "Ошибка при аренде.");
      }
    } catch (e) {
      console.error("Ошибка при бесплатной аренде:", e);
      telegram.showAlert("Произошла ошибка. Попробуйте позже.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const pollSubscriptionStatus = async (payload_token) => {
    const maxAttempts = 10;
    let attempt = 0;
  
    const interval = setInterval(async () => {
      try {
        const response = await fetch('https://playmost.ru/api2/check_token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ payload_token })
        });
  
        const result = await response.json();
        console.log("Проверка оплаты:", result);
  
        if (result.status === "true") {
          clearInterval(interval);
          telegram.showAlert("Платёж успешно завершён!");
          window.location.reload();
  
          onRentSuccess();
          setIsRentPopupOpen(false);
          setIsLoading(false);
        }
      } catch (e) {
        console.error("Ошибка при проверке токена:", e);
      }
  
      attempt++;
      if (attempt >= maxAttempts) {
        clearInterval(interval);
        telegram.showAlert("Истекло время ожидания оплаты.");
        setIsLoading(false);
      }
    }, 3000);
  };

  return isOpen ? (
    <Popup
      title="Аренда планеты"
      setPopupStatus={setIsRentPopupOpen}
    >
      <label style={{
        display: "flex",
        justifyContent: "center",
        marginBottom: "10px"
      }}>
        <div style={{ position: "relative", width: "100%", maxWidth: "300px" }}>
          <select
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
            className={styles.modal__select}
          >
            {Array.from({ length: 11 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Уровень {i + 1}
              </option>
            ))}
          </select>
        </div>
      </label>

      {/* Вывод цены, если уровень больше 1 */}
      {level > 1 && (
        <div style={{ textAlign: 'center', marginBottom: '-8px', fontWeight: 'bold' }}>
          Цена: {priceGC} 
        </div>
      )}

      {level === 1 ? (
        <div className={styles.modal__buttons_wrapper}>
          <button
            className={styles.modal__buttons_button1}
            onClick={handleFreeRent}
            disabled={isLoading}
          >
            {isLoading ? "Загрузка..." : "Взять в аренду бесплатно"}
          </button>
        </div>
      ) : (
        <div className={styles.modal__buttons_wrapper}>
          <button
            className={styles.modal__buttons_button1}
            onClick={() => handleRent('stars')}
            disabled={isLoading}
          >
            Купить за Stars ({priceGC})
          </button>

          <a
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
            href="https://getgems.io/toniumworld"
            target="_blank"
            rel="noreferrer"
          >
            <button className={styles.modal__buttons_button1}>
              Купить на getgems
            </button>
          </a>
        </div>
      )}
    </Popup>
  ) : null;
};

export default RentPlanetPopup;

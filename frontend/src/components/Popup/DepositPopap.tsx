import { useState } from 'react';
import Popup from './Popup'; // базовый контейнерный компонент
import styles from "./Popup.module.scss";

const DepositPopup = ({ isOpen, setPopupOpen, userId, onSuccess }) => {
  const [amount, setAmount] = useState(1); // Стартовое значение 1
  const [isLoading, setIsLoading] = useState(false);

  const telegram = window?.Telegram.WebApp;

  const handlePayment = async () => {
    if (!amount || amount < 1) {
      telegram?.showAlert("Минимум 1 Star.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch("https://playmost.ru/api2/deposit_gc", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          amount,
        }),
      });

      if (!response.ok) throw new Error("Ошибка при создании платежа");

      const data = await response.json();

      if (!data.payment_link || !data.payload_token) {
        throw new Error("Некорректный ответ от сервера");
      }

      telegram.openInvoice(data.payment_link, (status) => {
        if (status === "cancelled" || status === "failed") {
          telegram.showAlert("Платёж отменён или не удался.");
          setIsLoading(false);
        } else {
          pollPaymentStatus(data.payload_token);
        }
      });

    } catch (e) {
      console.error("Ошибка при пополнении:", e);
      telegram.showAlert("Ошибка во время оплаты.");
      setIsLoading(false);
    }
  };

  const pollPaymentStatus = async (payload_token) => {
    const maxAttempts = 10;
    let attempt = 0;

    const interval = setInterval(async () => {
      try {
        const response = await fetch("https://playmost.ru/api2/check_token_deposit", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ payload_token })
        });

        const result = await response.json();

        if (result.status === "true") {
          clearInterval(interval);
          telegram.showAlert("Баланс успешно пополнен!");
          onSuccess?.(amount); // Обновить баланс
          setPopupOpen(false);
          setIsLoading(false);
        }

      } catch (e) {
        console.error("Ошибка проверки:", e);
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
    <Popup title="Пополнить баланс" setPopupStatus={setPopupOpen}>
      <div className={styles.modal__content}>
        <label className={styles.modal__label}>На сколько Stars вы хотите пополнить?</label>
        <input
  type="number"
  min="1"
  value={amount}
  onChange={(e) => setAmount(Number(e.target.value))}
  className={`${styles.modal__input} ${styles.modal__input_highlight}`}
/>

        <div className={styles.modal__summary}>
          Вы получите: <strong>{amount}</strong> GC
        </div>
        <div className={styles.modal__buttons_wrapper}>
          <button
            className={styles.modal__buttons_button1}
            onClick={handlePayment}
            disabled={isLoading}
          >
            {isLoading ? "Ожидание оплаты..." : "Перейти к оплате"}
          </button>
        </div>
      </div>
    </Popup>
  ) : null;
};

export default DepositPopup;

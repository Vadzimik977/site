import { useTranslation } from "react-i18next";
import { useEffect, useState } from 'react';


const getTaskThumbnail = (type: TTaskType) => {
  switch (type) {
    case "video":
      return "/img/tasks/video.png";
    case "notification":
      return "/img/tasks/notification.png";
      case "notification22":
        return "/img/tasks/notification.png";
    case "handshake":
      return "/img/tasks/handshake.png";
      case "bot":
      return "/img/tasks/bot.png";
    default:
      return ""; // Для случаев, когда тип не определен
  }
};

export const url = process.env.VITE_BACKEND;
type TTaskType = "video" | "notification" | "handshake" | "refferal" | "notification22"| "bot"; // добавляем реферальный тип

const Task = ({
  title,
  buttonText,
  value,
  type,
  imgSrc,
  src,
  taskId,
  onClick
}: {
  title: string;
  buttonText: string;
  value: number;
  type: TTaskType;
  src: string;
  imgSrc?: string;
  taskId: number; // Передаем taskId для отправки запроса
  onClick?: (link: string) => void;


}) => {
  const { t } = useTranslation();
  const [buttonLabel, setButtonLabel] = useState(buttonText);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const telegram = window?.Telegram.WebApp;
    const tgID = telegram?.initDataUnsafe?.user?.id || 395581114;
    console.log("TASKS TG ID", tgID);

  // Таймер для проверки задания в течение минуты
  const startTimer = () => {
    setTimeout(() => {
      setError("Время для выполнения задания истекло.");
    }, 60000); // 60 секунд
  };


  const sendTaskAction = async (taskId, userId, type) => {
    console.log("Отправка запроса с taskId:", taskId, "userId:", userId);
    
    try {
      const response = await fetch(`${url}/api2/tasks/${taskId}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,  // должно быть userId (не user_id)
          type: type,
          tgID: tgID
        }),
      });
  
      return response;
    } catch (error) {
      console.error("Ошибка при отправке данных на сервер", error);
      throw error;
    }
  };
  

  // Обработчик клика по кнопке
  const handleButtonClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    const userId = window.user?.id;
  
    if (!userId) {
      setError('Не удалось получить userId');
      return;
    }
  
    const telegram = window?.Telegram.WebApp;
  
    if (type === "handshake") {
      try {
        await navigator.clipboard.writeText(`https://t.me/ToniumWorldBot?start=ref${userId}`);
        setButtonLabel("Скопировано");
      } catch (e) {
        console.error("Ошибка при копировании ссылки:", e);
        telegram.showAlert("Ошибка при копировании ссылки.");
      }
    } else {
      if (buttonLabel !== "Проверить") {
        // Первый клик -> открываем ссылку и меняем кнопку на "Проверить"
        setButtonLabel("Проверить");
        telegram.openTelegramLink(src);
        return;
      }
  
      // Если уже кнопка "Проверить" — только тогда отправляем запрос
      setIsLoading(true);
  
      try {
        const response = await sendTaskAction(taskId, userId, type);
  
        if (response.status === 200) {
          console.log('Задача успешно обновлена');
  
          telegram.showAlert("Задание успешно выполнено!");
          setError("Задача успешно выполнена");
  
          setTimeout(() => {
            window.location.reload();
          }, 2000);
  
        } else {
          setError("Ошибка при выполнении задания.");
        }
      } catch (error) {
        setError("Ошибка при отправке данных на сервер");
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  
  

  return (
    <div className="subscribe-task">
      <img
        src={imgSrc ? imgSrc : getTaskThumbnail(type)}
        className="subscribe-task__img"
      />
      <div className="subscribe-task__content">
        <div className="subscribe-task__title">{title}</div>
        <button
          className="subscribe-task__btn"
          onClick={handleButtonClick}
          disabled={isLoading}
        >
          {isLoading ? "Загрузка..." : buttonLabel} {/* Показываем "Скопировано", "Проверить" или изначальный текст */}
        </button>
        {error && <div className="error-message">{error}</div>} {/* Показываем ошибку, если она есть */}
        <div className="subscribe-task__info">
          <span className="subscribe-task__text">{t('creditedResource')}</span>
          <span className="subscribe-task__plus">+{value}</span>
        </div>
      </div>
    </div>
  );
};

export default Task;

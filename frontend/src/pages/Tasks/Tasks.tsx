import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Task from './Task';
import { useTranslation } from 'react-i18next';
import { t } from "i18next";

const getTasks = async (userId: number) => {
  try {
    const response = await fetch(`https://playmost.ru/api2/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status}`);
    }

    const data = await response.json();
    return data.tasks;
  } catch (err) {
    console.error('Ошибка при получении задач:', err);
    return [];
  }
};

const Tasks = () => {
  const { t } = useTranslation();

  const [tasks, setTasks] = useState([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Проверяем, мобильное ли устройство
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth >= 480);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Ждем появления userId
  useEffect(() => {
    const waitForUser = () => {
      if (window.user?.id) {
        setUserId(window.user.id);
      } else {
        setTimeout(waitForUser, 200);
      }
    };

    waitForUser();
  }, []);

  // Загружаем задачи, если не мобильное устройство и есть userId
  useEffect(() => {
    if (!userId || isMobile) return;

    const fetchTasks = async () => {
      setLoading(true);
      const data = await getTasks(userId);
      setTasks(data);
      setLoading(false);
    };

    fetchTasks();
  }, [userId, isMobile]);

  const handleButtonClick = async (taskId?: number) => {
    if (isMobile) {
      // На мобиле просто переходим в приложение Telegram
      window.location.href = 'https://t.me/ToniumWorldBot'; // замените на нужную ссылку
      return;
    }

    if (!userId) {
      setError("Пользователь не определён");
      return;
    }

    if (taskId === undefined) return;

    try {
      const response = await fetch(`https://playmost.ru/api2/tasks/${taskId}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId, userId }),
      });

      if (response.ok) {
        console.log('Действие выполнено');
      } else {
        console.error('Ошибка при выполнении действия');
      }
    } catch (err) {
      console.error('Ошибка при отправке:', err);
      setError("Ошибка при отправке данных");
    }
  };

  const getButtonText = (type: string) => {
    switch (type) {
      case "tgChannel":
        return t("subscribe");
      case "tgChat":
        return t("joinChat");
      case "video":
        return t("watchVideo");
      case "bot":
        return t("bot");
      case "refferal":
        return t("inviteFriend");
      default:
        return t("getResource");
    }
  };

  const getTaskImage = (type: string) => {
    switch (type) {
      case "tgChannel":
        return "notification";
      case "tgChat":
        return "notification22";
      case "video":
        return "video";
      case "refferal":
        return "handshake";
      case "bot":
        return "bot";
      default:
        return "notification"; // fallback
    }
  };

  if (isMobile) {
  return (
    <div className="main__inner">
      {/* <h1 className="main__title">{t('tasksTitle')}</h1> */}
      <h1 className="main__title">{t("taskselse")}</h1>
      <button className="telegram-section__button" onClick={() => handleButtonClick()} >
        {t("perehod")}
      </button>
    </div>
  );
}


  return (
    //<Layout>
    <div className="main__inner">
      <h1 className="main__title">{t('tasksTitle')}</h1>
      {error && <div className="error-message">{error}</div>}
      <div className="main__content tasks-content">
        {loading ? (
          <div>{"..."}</div>
        ) : tasks.length > 0 ? (
          tasks.map((item) => (
            <Task
              key={item.id}
              taskId={item.id}
              buttonText={getButtonText(item.type)}
              title={t(item.type)}
              type={getTaskImage(item.type)}
              value={item.amount}
              src={item.link}
              onClick={() => handleButtonClick(item.id)}
            />
          ))
        ) : (
          <div>{t("noTasks")}</div>
        )}
      </div>
    </div>
    //</Layout>
  );
};

export default Tasks;

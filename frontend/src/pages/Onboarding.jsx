import { useEffect, useState } from "react";
import './onboarding.css';

export default function OnboardingModal({ onClose }) {
  const [step, setStep] = useState(0);

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);
  const handleFinishTraining = () => onClose();
  
  const handleGoToChat = () => {
    const telegram = window?.Telegram?.WebApp;
    if (telegram) {
      telegram.openTelegramLink('https://t.me/ToWGameChat');
    } else {
      console.log("Telegram WebApp не доступен");
    }
    onClose();
  };

  const handleCancel = () => onClose();

  const stepsContent = [
    {
      title: "Хотите пройти обучение?",
      content: "Вы можете подтвердить начало обучения или отказаться от него.",
      actions: (
        <>
          <button onClick={handleCancel} className="onboarding-next">Отказаться</button>
          <button onClick={handleNext} className="onboarding-next">Подтвердить</button>
        </>
      )
    },
    {
      title: "Добро пожаловать в Tonium World",
      content: `Эпичная вселенная добычи ресурсов и приключений! Подключай кошелёк и погнали — твой прогресс будет сохраняться.`,
      highlightTonConnect: true,
    },
    {
      content: `Тапай по планете — каждый тап приносит ресурсы! Но если хочешь, чтобы она добывала сама — покупай её и качай. Планета 1 уровня — халява. Но сначала затапай её до 2 уровня, тогда начнётся автофарм.`,
    },
    {
      content: `Хочешь больше ресурсов? Захватывай их в бою! Нападай на планеты и забирай добычу. Без корабля в порту — не выйдешь в бой. Оснасти флот и покажи, кто тут главный!`,
    },
    {
      content: `Обменивай ресурсы на Tonium в Лабе! Собери полный сет с 7 планет — они с белой рамкой. Таймер показывает, сколько времени у тебя есть.`,
      highlightLab: true,
    },
    
    {
      content: `Хочешь внутриигровую валюту? Добро пожаловать на рынок!\n— обычные ресурсы — курс 1 к 1\n— редкие — 1 к 2\n— эпичные — 1 к 3!`,
    },
    {
      content: `Выполняй задания — и получай валюту бесплатно. Ежедневки, челленджи, миссии — всё ради прокачки без доната.`,
      actions: (
        <>
          <button onClick={handleFinishTraining} className="onboarding-next">Завершить обучение</button>
          <button onClick={handleGoToChat} className="onboarding-next">Перейти в чат</button>
        </>
      )
    }
  ];

  const { title, content, actions, highlightTonConnect, highlightLab } = stepsContent[step];


  // Подсветка кнопки подключения кошелька
  useEffect(() => {
    const ton = document.querySelector('#ton-connect');
    const labNavItem = document.querySelector('.nav__item a[href="/laboratory"]')?.parentElement;
  
    if (highlightTonConnect && ton) {
      ton.classList.add('highlight-circle');
    } else if (ton) {
      ton.classList.remove('highlight-circle');
    }
  
    if (highlightLab && labNavItem) {
      labNavItem.classList.add('highlight-circle');
    } else if (labNavItem) {
      labNavItem.classList.remove('highlight-circle');
    }
  
    return () => {
      if (ton) ton.classList.remove('highlight-circle');
      if (labNavItem) labNavItem.classList.remove('highlight-circle');
    };
  }, [highlightTonConnect, highlightLab]);
  

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-modal">
      {/* <img src="../images/popup-background.png" className="onboarding-bg" alt="background" /> */}
        {/* <button className="onboarding-close" onClick={onClose}>×</button> */}

        <div className="onboarding-step">
          {title && <h2>{title}</h2>}
          <p>{content}</p>

          <div className="onboarding-buttons">
            {step > 0 && step < stepsContent.length - 1 && !actions && (
              <button onClick={handleCancel} className="onboarding-next">Пропустить</button>
            )}
            {step < stepsContent.length - 1 && !actions && (
              <button onClick={handleNext} className="onboarding-next">Далее</button>
            )}
            {actions}
          </div>
        </div>
      </div>
    </div>
  );
}



// import { useEffect, useState } from "react";
// import { createPortal } from "react-dom";
// import { IUserPlanet } from "../../types/planets.type";
// import Popup from "./Popup";
// import styles from "./Popup.module.scss";
// import { useRef } from "react";
// import AttackCooldownPopup from "../Popup/AttackCooldownPopup";

// import {
//   useTonAddress,
//   useTonWallet,
//   useIsConnectionRestored,
// } from "@tonconnect/ui-react";

// export const url = process.env.VITE_BACKEND;

// const AttackPlanetPopup = ({
//   isOpen,
//   setIsAttackPopupOpen,
//   onAttackSuccess,
//   planetId,
//   userId,
//   planet
// }: {
//   isOpen: boolean;
//   setIsAttackPopup: (value: boolean) => void;
//   onAttackSuccess: () => void;
//   planetId: number;
//   userId: number;
//   planet: {
//     id: number; name: string; description: string; img: string; index: number; symbol: string; wiki_url: string; forLaboratory: boolean; health: number; cosmoport_level: number;
//   }
// }) => {
//   const [userPlanets, setUserPlanets] = useState<IUserPlanet[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [attackSuccessful, setAttackSuccessful] = useState(false);
//   const [showAttackPopup, setShowAttackPopup] = useState(false);
//   const [animatedWords, setAnimatedWords] = useState<string[]>([]);
//   const [selectedPlanetResources, setSelectedPlanetResources] = useState<Record<string, number>>({});
//   const [planetResourcesMap, setPlanetResourcesMap] = useState<Record<number, Record<string, number>>>({});
//   const [attackCooldownMessage, setAttackCooldownMessage] = useState<string | null>(null);
//   const [attackCooldownCode, setAttackCooldownCode] = useState<number | null>(null);





// const targetPlanetIdRef = useRef<number | null>(null);
// const address = useTonAddress();


//   const [selectedResource, setSelectedResource] = useState("Tonium");
// const [attackSize, setAttackSize] = useState<number | null>(null);

//   const telegram = window?.Telegram.WebApp;

//   const explosionText = "БАХ........ааааа........кия............пиф...................бум.........БАХ........ааааа........кия............пиф.................бум.........БАХ........ааааа........кия.........";
//   const words = explosionText.split(/(?<=\.)\s*|(?<=\.\.\.)\s*/);

//   const getUsersPlanet = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch(`${url}/api2/userplanets`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ user_id: window.user?.id, planet_id: planetId }),
//       });
//       if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
  
//       const data = await response.json();
  
//       setUserPlanets(data);
  
//       // Собираем ресурсы по userId
//       const resourcesByUser: Record<number, Record<string, number>> = {};
//       data.forEach((planet: any) => {
//         resourcesByUser[planet.userId] = planet.resources || {};
//       });
//       setPlanetResourcesMap(resourcesByUser);
//       console.log("resourcesByUser",data);
  
//     } catch (error) {
//       console.error('Ошибка при получении планет:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };
  

//   const fetchAttackSize = async () => {
//     try {
//       const response = await fetch(`${url}/api2/attack-size`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ user_id: window.user?.id, planet_id: planetId })
//       });
  
//       if (!response.ok) throw new Error("Не удалось получить размер атаки");
  
//       const data = await response.json();
//       setAttackSize(data?.attackSize ?? 0);
//     } catch (error) {
//       console.error("Ошибка при получении размера атаки:", error);
//       setAttackSize(0);
//     }
//   };
  

//   useEffect(() => {
//     if (isOpen) {
//       getUsersPlanet();
//       fetchAttackSize();
//     }
//   }, [isOpen]);

//   const handleRemoveLimit = async () => {
//     try {
//       setIsLoading(true);
  
//       const response = await fetch("https://playmost.ru/api2/remove_attack_limit", {
//         method: "POST",
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           user_id: userId,
//         }),
//       });
  
//       if (!response.ok) throw new Error("Ошибка при создании платежа");
  
//       const data = await response.json();
  
//       if (!data.payment_link || !data.payload_token) {
//         throw new Error("Некорректный ответ от сервера");
//       }
  
//       telegram.openInvoice(data.payment_link, (status) => {
//         if (status === "cancelled" || status === "failed") {
//           telegram.showAlert("Платёж отменён или не удался.");
//           setIsLoading(false);
//         } else {
//           pollRemoveLimitStatus(data.payload_token); // Эта функция должна быть реализована так же, как и для депозита
//         }
//       });
  
//     } catch (e) {
//       console.error("Ошибка при снятии лимита:", e);
//       telegram.showAlert("Ошибка во время оплаты.");
//       setIsLoading(false);
//     }
//   };

//   const pollRemoveLimitStatus = async (payload_token) => {
//     const maxAttempts = 10;
//     let attempt = 0;
  
//     const interval = setInterval(async () => {
//       try {
//         const response = await fetch("https://playmost.ru/api2/check_token_remove_limit", {
//           method: "POST",
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ payload_token })
//         });
  
//         const result = await response.json();
  
//         if (result.status === "true") {
//           clearInterval(interval);
//           telegram.showAlert("Лимит успешно снят!");
  
//           // Обновляем UI — скрываем оверлей с ограничением
//           setAttackCooldownMessage(null);
//           setIsLoading(false);
//         }
  
//       } catch (e) {
//         console.error("Ошибка проверки статуса лимита:", e);
//       }
  
//       attempt++;
//       if (attempt >= maxAttempts) {
//         clearInterval(interval);
//         telegram.showAlert("Истекло время ожидания оплаты.");
//         setIsLoading(false);
//       }
//     }, 3000);
//   };
  
  
  

//   const handleAttack = async (targetPlanetId: number) => {
//     targetPlanetIdRef.current = targetPlanetId;
  
//     if (userId === 9999 || !address) {
//       alert("Подключите кошелек для атаки планет.");
//       return;
//     }
  
//     setProgress(0);
//     setAttackSuccessful(false);
//     setAnimatedWords([]);
  
//     const resources = planetResourcesMap[targetPlanetId];
//     if (resources) {
//       setSelectedPlanetResources(resources);
//     }
//     setAttackCooldownMessage(null);
  
//     try {
//       const response = await fetch(`${url}/api2/attack_check`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           attacker_id: userId,
//           defender_id: targetPlanetId,
//           planet_id: planetId,
//           resource: selectedResource
//         }),
//       });
  
//       if (response.status === 450) throw new Error("Приобретите космопорт для атаки");
  
//       if (response.status === 451) {
//         const data = await response.json();
//         setAttackCooldownCode(451); // <-- вот это
//         setAttackCooldownMessage(data.detail || "Атака была недавно, попробуйте позже.");
//         return;
//       }
      
//       if (response.status === 452) {
//         const data = await response.json();
//         setAttackCooldownCode(452); // <-- вот это
//         setAttackCooldownMessage(
//           data.detail || "Планета слишком хорошо защищена, атака провалилась, прокачивайте корабли для успешных атак!"
//         );
//         return;
//       }
  
//       if (!response.ok) throw new Error("Ошибка при проверке возможности атаки");
  
//       // Всё ок — показываем анимацию атаки
//       setShowAttackPopup(true);
  
//       let timeElapsed = 0;
//       let wordIndex = 0;
  
//       const progressInterval = setInterval(() => {
//         timeElapsed += 100;
//         setProgress((prev) => Math.min(prev + 1, 100));
  
//         if (timeElapsed >= 10000) {
//           clearInterval(progressInterval);
//           clearInterval(wordInterval);
//           setAttackSuccessful(true); // только в конце анимации
//         }
//       }, 100);
  
//       const wordInterval = setInterval(() => {
//         setAnimatedWords(prev => {
//           if (wordIndex < words.length) {
//             return [...prev, words[wordIndex++]];
//           } else {
//             clearInterval(wordInterval);
//             return prev;
//           }
//         });
//       }, 100);
  
//     } catch (error: any) {
//       console.error("Ошибка при проверке атаки:", error);
//       if (telegram?.initDataUnsafe?.user?.id) {
//         telegram.showAlert(error.message);
//       } else {
//         alert(error.message);
//       }
//     }
//   };
  
  
  

//   const handleCollectReward = async () => {
//     if (!targetPlanetIdRef.current) return;
  
//     try {
//       const response = await fetch(`${url}/api2/attack`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           attacker_id: userId,
//           defender_id: targetPlanetIdRef.current,
//           planet_id: planetId,
//           resource: selectedResource
//         })
//       });
  
//       if (!response.ok) throw new Error("Ошибка при атаке");
  
//       const data = await response.json();
//       console.log("Результат атаки:", data);
  
//       // ✅ Показываем пользователю сколько ресурсов он увез
//       if (data && data.resource && data.amount) {
//         // telegram?.showAlert?.(
//         //   `🚀 Вы увезли с планеты ${data.amount} ед. ресурса ${data.resource}.\nВаш баланс обновлён.`
//         // );
//         alert(
//           `🚀 Вы увезли с планеты ${data.amount} ед. ресурса ${data.resource}.\nВаш баланс обновлён.`
//         )
//       } else {
//         alert(
//           `🚀 Вы увезли с планеты ${data.amount} ед. ресурса ${data.resource}.\nВаш баланс обновлён.`
//         )
//         // telegram?.showAlert?.("✅ Атака прошла успешно, ресурсы получены!");
//       }
  
//       setShowAttackPopup(false);
//       onAttackSuccess?.();
  
//       // ✅ Перезагрузка страницы после успешной атаки
//       window.location.reload();
  
//     } catch (error: any) {
//       console.error("Ошибка при атаке:", error);
//       telegram?.showAlert?.(error.message || "Ошибка");
//     }
//   };
  
  
  
  
  

//   return (
//     <>
//       {isOpen && createPortal(
//         <>
//           <Popup title="Выберите планету для атаки" setPopupStatus={setIsAttackPopupOpen}>
//             {attackCooldownMessage ? (
//               // Оверлей с ошибкой, который перекрывает весь контент попапа
//                 <div className={styles.attackCooldownOverlay}>
//                   <p style={{ color: "red", fontWeight: "bold", marginBottom: 20 }}>
//                     {attackCooldownMessage}
//                   </p>
              
//                   {attackCooldownCode !== 452 && (
//                     <div style={{ textAlign: "center", marginTop: 20 }}>
//                       <button
//                         onClick={handleRemoveLimit}
//                         style={{
//                           backgroundColor: "#D09B0D",
//                           color: "white",
//                           border: "none",
//                           padding: "5px 10px",
//                           cursor: "pointer",
//                           fontSize: "14px",
//                           borderRadius: "5px",
//                           marginLeft: 0,
//                         }}
//                       >
//                         Снять лимит
//                       </button>
//                     </div>
//                   )}
//                 </div>
//             ) : (
//               <>
//                 <div className={styles.planet_list}>
//                   {userPlanets.length > 0 ? (
//                     userPlanets.map((userPlanet) => (
//                       <div key={`${userPlanet.userId}.${userPlanet.id}`} className={styles.planet_item}>
//                         <img
//                           src={`/img/planet/${planet.img}`}
//                           className={styles.planet_preview__planet}
//                           alt="planet"
//                         />
//                         <div className={styles.planet_preview__name}>
//                           <div className={styles.planet_preview__info}>
//                             {planet.name} ({planet.symbol}) — Planet #{planet.index}
//                           </div>
//                           <span className={styles.planet_preview__owner}>
//                             <img src="/icons/astronaut_helmet-white.png" alt="" width={24} />
//                             <span>{userPlanet.userId === window.user?.id ? 'Ваша' : `ID ${userPlanet.userId}`}</span>
//                           </span>
//                         </div>
//                         {userPlanet.userId !== window.user?.id && (
//                           <button
//                             className={styles.attack_button}
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               handleAttack(userPlanet.userId);
//                             }}
//                           >
//                             Атаковать
//                           </button>
//                         )}
//                       </div>
//                     ))
//                   ) : (
//                     <p className={styles.modal__buttons_text}>Нет доступных планет для атаки</p>
//                   )}
//                 </div>
  
                // {showAttackPopup && (
                //   <div className={styles.attack_modal}>
                //     <div className={styles.attack_modal_content}>
                //       {!attackSuccessful ? (
                //         <>
                //           <div className={styles.attack_text_animation}>
                //             <p className={styles.explosion_text}>{animatedWords.join(" ")}</p>
                //           </div>
  
                //           <div className={styles["progress-wrapper"]}>
                //             <div className={styles["progress"]} style={{ width: `${progress}%` }}></div>
                //           </div>
  
                //           {isLoading && <p>Загрузка... ({progress}%)</p>}
                //         </>
                //       ) : (
                //         <div className={styles.attack_reward}>
                //           <p className={styles.attack_success}>✅ Успешно! Атака завершена.</p>
  
                //           <div className={styles.attack_controls}>
                //             <label>
                //               Добываемый ресурс:
                //               <select
                //                 value={selectedResource}
                //                 onChange={(e) => setSelectedResource(e.target.value)}
                //                 className={styles.resource_select}
                //               >
                //                 <option value="Tonium">Tonium</option>
                //                 <option value="GC">GC</option>
                //                 <option value={planet?.symbol}>{planet.symbol}</option>
                //               </select>
                //             </label>
  
                //             <div className={styles.resource_block}>
                //               <p>На планете:</p>
                //               <ul>
                //                 <li>GC: {selectedPlanetResources["GC"] ?? 0}</li>
                //                 <li>Tonium: {selectedPlanetResources["Tonium"] ?? 0}</li>
                //                 <li>{planet.symbol}: {selectedPlanetResources[planet.symbol] ?? 0}</li>
                //               </ul>
                //             </div>
  
                //             <p className={styles.attack_size}>
                //               Вы можете увезти {attackSize !== null ? `${attackSize}` : "Загрузка..."} единиц, чтобы увезти больше прокачивайте ваши корабли
                //             </p>
  
                //             <button className={styles.collect_button} onClick={handleCollectReward}>
                //               Забрать
                //             </button>
                //           </div>
                //         </div>
                //       )}
                //     </div>
                //   </div>
                // )}
            //   </>
            // )}
//           </Popup>
//         </>,
//         document.body
//       )}
//     </>
//   );
// };  

  


// export default AttackPlanetPopup;


import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { IUserPlanet } from "../../types/planets.type";
import Popup from "../Popup/Popup";
import styles from "./Popup.module.scss";
import { useRef } from "react";
import AttackCooldownPopup from "../Popup/AttackCooldownPopup";
import {
    useTonAddress,
    useTonWallet,
    useIsConnectionRestored,
  } from "@tonconnect/ui-react";

  export const url = process.env.VITE_BACKEND;

const AttackPlanetPopup = ({
  isOpen,
  setIsAttackPopupOpen,
  onAttackSuccess,
  planetId,
  userId,
  planet,
  attacker
}: {
  isOpen: boolean;
  setIsAttackPopup: (value: boolean) => void;
  onAttackSuccess: () => void;
  planetId: number;
  userId: number;
  planet: {
    id: number; name: string; description: string; img: string; index: number; symbol: string; wiki_url: string; forLaboratory: boolean; health: number; cosmoport_level: number;
  };
  attacker :{
    userId: number | null;
    level: number;
    resources: number;
    mined: number;

  }
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [attackSuccessful, setAttackSuccessful] = useState(false);
  const [showAttackPopup, setShowAttackPopup] = useState(false);
  const [animatedWords, setAnimatedWords] = useState<string[]>([]);
  const [selectedPlanetResources, setSelectedPlanetResources] = useState<Record<string, number>>({});
  const [attackCooldownMessage, setAttackCooldownMessage] = useState<string | null>(null);
  const [attackCooldownCode, setAttackCooldownCode] = useState<number | null>(null);
  const [planetResourcesMap, setPlanetResourcesMap] = useState<Record<number, Record<string, number>>>({});
  const [userPlanets, setUserPlanets] = useState<IUserPlanet[]>([]);

  const targetPlanetIdRef = useRef<number | null>(null);
  const address = useTonAddress();
  const telegram = window?.Telegram.WebApp;


  // Оставим выбранный ресурс и размер атаки
  const [selectedResource, setSelectedResource] = useState("Tonium");
  const [attackSize, setAttackSize] = useState<number | null>(null);

  // Текст анимации атаки
  const explosionVariants = [
  "БУМ! «Лови заряд!»...вжух...пиф...«В упор, без шанса!...бах! «Разнёс к чертям!»...кряк...«Слабак!»...шух...бах...«Прошил насквозь!»...пиф...«Цель достигнута!»...тррр...«Время крошить!»...аах...бряк...«Куда побежал?!»...тудух...«Не уйдёшь!»...БАДАБУМ! «На куски!»...вжух...кхе...«Сзади зашёл!»...шпак...трам...«Стукнул с размаху!»...БАМ! «Ты в нокауте!»...шух...трр...«Горит всё кругом!»...ах...пум...«Конец маршрута!»...бах...«Выжжено подчистую!»...пиф...бум...кхе...бах!",
  "ПИФ! «Начинаем веселье!»...вжик...паф...«В пузо пошло!»...бах! «Голову сдуло!»...кряк...«Падай!»...шух...бах...«Смачно, да?!»...пиф...«А вот ещё!»...тррр...«Разворот на ходу!»...аах...бряк...«Чуть не поймал!»...тудух...«Ха, не догонишь!»...БАДАБУМ! «По всем фронтам!»...вжух...кхе...«Задыхаешься?!»...шпак...трам...«Скоро финиш!»...БАМ! «Кирпичом по нервам!»...шух...трр...«Догорает!»...ах...пум...«Остался пепел!»...бах...«Прощай, злодей!»...пиф...бум...кхе...бах!",
  "ТРРР! «Скоростной ураган!»...вжух...пиф...«Вылетело мгновенно!»...бах! «Грохнуло как надо!»...кряк...«Ещё дёрнется?»...шух...бах...«По касательной!»...пиф...«Вторым дожму!»...аах...«Руки вон от пульта!»...бряк...тудух...«Не дёргайся!»...БАДАБУМ! «Попал в центр!»...вжух...кхе...«Ох, как дымит!»...шпак...трам...«Всё развалилось!»...БАМ! «Не встанет!»...шух...трр...«Огонь по площадям!»...ах...пум...«Гейм овер!»...бах...«Миссия завершена!»...пиф...бум...кхе...бах!",
  "БАХ! «Заряд принят!»...вжик...пиф...«Улетело!»...бум! «Камни в стороны!»...кряк...«Тело вниз!»...шух...бах...«Ты следующий!»...пиф...«Ничего не видно!»...тррр...«Но я чувствую!»...аах...бряк...«Ага, вот ты!»...тудух...«Поздно!»...БАДАБУМ! «Никаких шансов!»...вжух...кхе...«Заставил дёрнуться!»...шпак...трам...«Ловко, но не то!»...БАМ! «До свидания!»...шух...трр...«Уничтожен!»...ах...пум...«Всё...тихо»...бах...«И дым в небе!»...пиф...бум...кхе...бах!",
  "БАМ! «Сверху пошло!»...вжух...пиф...«На полной скорости!»...бах! «Хруст костей!»...кряк...«О, да!»...шух...бах...«В печень, метко!»...пиф...«Вот теперь встал!»...тррр...«Пошёл разнос!»...аах...бряк...«С треском!»...тудух...«Вот это да!»...БАДАБУМ! «Свергнул врага!»...вжух...кхе...«Брызги повсюду!»...шпак...трам...«Звон в ушах!»...БАМ! «Покойся с миром!»...шух...трр...«Клубы огня!»...ах...пум...«Молчи в вечности!»...бах...«Финал ясен!»...пиф...бум...кхе...бах!"
];


const explosionText = explosionVariants[Math.floor(Math.random() * explosionVariants.length)];

console.log(explosionText);
  const words = explosionText.split(/(?<=\.)\s*|(?<=\.\.\.)\s*/);

  // Загрузка размера атаки
  const fetchAttackSize = async () => {
    try {
      const response = await fetch(`${url}/api2/attack-size`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, planet_id: planetId })
      });

      if (!response.ok) throw new Error("Не удалось получить размер атаки");

      const data = await response.json();
      setAttackSize(data?.attackSize ?? 0);
    } catch (error) {
      console.error("Ошибка при получении размера атаки:", error);
      setAttackSize(0);
    }
  };

  // Запуск атаки
  const handleAttack = async (targetPlanetId: number) => {
    targetPlanetIdRef.current = targetPlanetId;

    if (userId === 9999 || !address) {
      alert("Подключите кошелек для атаки планет.");
      return;
    }
    try {
            const response = await fetch(`${url}/api2/userplanets`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ user_id: window.user?.id, planet_id: planetId }),
            });
            if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
        
            const data = await response.json();
        
            setUserPlanets(data);
        
            // Собираем ресурсы по userId
            const resourcesByUser: Record<number, Record<string, number>> = {};
            data.forEach((planet: any) => {
              resourcesByUser[planet.userId] = planet.resources || {};
            });
            setPlanetResourcesMap(resourcesByUser);
            console.log("resourcesByUser",data);

            
            console.log("pl res",resourcesByUser);
            console.log("ID",attacker?.userId);
            console.log("us res",resourcesByUser[attacker?.userId]);
            console.log("tg res",resourcesByUser[targetPlanetId]);
            const resources = resourcesByUser[attacker?.userId];
if (resources) {
  setSelectedPlanetResources(resources);
}

        
          } catch (error) {
            console.error('Ошибка при получении планет:', error);
          } finally {
            setIsLoading(false);
          }

    
    

    setProgress(0);
    setAttackSuccessful(false);
    setAnimatedWords([]);
    setAttackCooldownMessage(null);

    try {
      console.log("ATA",userId);
      console.log("ABA",attacker?.userId);
      console.log("ANA",planetId);
      console.log("ASA",selectedResource);
      const response = await fetch(`${url}/api2/attack_check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attacker_id: userId,
          defender_id: attacker?.userId,
          planet_id: planetId,
          resource: selectedResource
        }),
      });

      if (response.status === 450) throw new Error("Приобретите космопорт для атаки");

      if (response.status === 451) {
        const data = await response.json();
        setAttackCooldownCode(451);
        setAttackCooldownMessage(data.detail || "Атака была недавно, попробуйте позже.");
        return;
      }

      if (response.status === 452) {
        const data = await response.json();
        setAttackCooldownCode(452);
        setAttackCooldownMessage(
          data.detail || "Планета слишком хорошо защищена, атака провалилась, прокачивайте корабли для успешных атак!"
        );
        return;
      }

      if (response.status === 422) {
        const data = await response.json();
      
        // Если detail — массив с объектами ошибок, преобразуем в строку
        let message = "Планета пока никому не принадлежит!";
        if (data.detail) {
          if (typeof data.detail === "string") {
            message = data.detail;
          } else if (Array.isArray(data.detail)) {
            message = data.detail.map((err: any) => err.msg).join("; ");
          } else if (typeof data.detail === "object" && data.detail.msg) {
            message = data.detail.msg;
          }
        }
      
        setAttackCooldownCode(422);
        setAttackCooldownMessage("Эта планета пуста, ее нельзя атаковать!");
        return;
      }
      

      if (!response.ok) throw new Error("Ошибка при проверке возможности атаки");

      // Запускаем анимацию атаки
      setShowAttackPopup(true);

      let timeElapsed = 0;
      let wordIndex = 0;

      const progressInterval = setInterval(() => {
        timeElapsed += 100;
        setProgress((prev) => Math.min(prev + 1, 100));

        if (timeElapsed >= 10000) {
          clearInterval(progressInterval);
          clearInterval(wordInterval);
          setAttackSuccessful(true);
        }
      }, 100);

      const wordInterval = setInterval(() => {
        setAnimatedWords(prev => {
          if (wordIndex < words.length) {
            return [...prev, words[wordIndex++]];
          } else {
            clearInterval(wordInterval);
            return prev;
          }
        });
      }, 300);

    } catch (error: any) {
      console.error("Ошибка при проверке атаки:", error);
      if (telegram?.initDataUnsafe?.user?.id) {
        telegram.showAlert(error.message);
      } else {
        alert(error.message);
      }
    }
  };

    const handleRemoveLimit = async () => {
    try {
      setIsLoading(true);
  
      const response = await fetch("https://playmost.ru/api2/remove_attack_limit", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
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
          pollRemoveLimitStatus(data.payload_token); // Эта функция должна быть реализована так же, как и для депозита
        }
      });
  
    } catch (e) {
      console.error("Ошибка при снятии лимита:", e);
      telegram.showAlert("Ошибка во время оплаты.");
      setIsLoading(false);
    }
  };

  const pollRemoveLimitStatus = async (payload_token) => {
    const maxAttempts = 10;
    let attempt = 0;
  
    const interval = setInterval(async () => {
      try {
        const response = await fetch("https://playmost.ru/api2/check_token_remove_limit", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ payload_token })
        });
  
        const result = await response.json();
  
        if (result.status === "true") {
          clearInterval(interval);
          telegram.showAlert("Лимит успешно снят!");
  
          // Обновляем UI — скрываем оверлей с ограничением
          setAttackCooldownMessage(null);
          setIsLoading(false);
        }
  
      } catch (e) {
        console.error("Ошибка проверки статуса лимита:", e);
      }
  
      attempt++;
      if (attempt >= maxAttempts) {
        clearInterval(interval);
        telegram.showAlert("Истекло время ожидания оплаты.");
        setIsLoading(false);
      }
    }, 3000);
  };
  
  

  const handleCollectReward = async () => {
        if (!targetPlanetIdRef.current) return;
      
        try {
          const response = await fetch(`${url}/api2/attack`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              attacker_id: userId,
              defender_id: attacker?.userId,
              planet_id: planetId,
              resource: selectedResource
            })
          });
      
          if (!response.ok) throw new Error("Ошибка при атаке");
      
          const data = await response.json();
          console.log("Результат атаки:", data);
      
          // ✅ Показываем пользователю сколько ресурсов он увез
          if (data && data.resource && data.amount) {
            // telegram?.showAlert?.(
            //   `🚀 Вы увезли с планеты ${data.amount} ед. ресурса ${data.resource}.\nВаш баланс обновлён.`
            // );
            alert(
              `🚀 Вы увезли с планеты ${data.amount} ед. ресурса ${data.resource}.\nВаш баланс обновлён.`
            )
          } else {
            alert(
              `🚀 Вы увезли с планеты ${data.amount} ед. ресурса ${data.resource}.\nВаш баланс обновлён.`
            )
            // telegram?.showAlert?.("✅ Атака прошла успешно, ресурсы получены!");
          }
      
          setShowAttackPopup(false);
          onAttackSuccess?.();
      
          // ✅ Перезагрузка страницы после успешной атаки
          window.location.reload();
      
        } catch (error: any) {
          console.error("Ошибка при атаке:", error);
          telegram?.showAlert?.(error.message || "Ошибка");
        }
      };

  // После открытия попапа сразу запускаем атаку на переданный в пропсах userId
  useEffect(() => {
    if (isOpen) {
      fetchAttackSize();
      handleAttack(planet?.id);
    }
  }, [isOpen, planet?.id]);

  // остальной код handleCollectReward такой же, оставляем без изменений

  return (
    <>
      {isOpen && createPortal(
        <>
          <Popup title={`Атака планеты ${planet.name}`} setPopupStatus={setIsAttackPopupOpen}>
            {attackCooldownMessage ? (
              <div className={styles.attackCooldownOverlay}>
                <p style={{ color: "red", fontWeight: "bold", marginBottom: 20 }}>
                  {attackCooldownMessage}
                </p>
                {attackCooldownCode !== 452 && (
                    <div style={{ textAlign: "center", marginTop: 20 }}>
                      <button
                        onClick={handleRemoveLimit}
                        style={{
                          backgroundColor: "#D09B0D",
                          color: "white",
                          border: "none",
                          padding: "5px 10px",
                          cursor: "pointer",
                          fontSize: "14px",
                          borderRadius: "5px",
                          marginLeft: 0,
                        }}
                      >
                        Снять лимит
                      </button>
                    </div>
                  )}
              </div>

            ) : (
              <>
               {showAttackPopup && (
                  <div className={styles.attack_modal}>
                    <div className={styles.attack_modal_content}>
                      {!attackSuccessful ? (
                        <>
                          <div className={styles.attack_text_animation}>
                            <p className={styles.explosion_text}>{animatedWords.join(" ")}</p>
                          </div>
  
                          <div className={styles["progress-wrapper"]}>
                            <div className={styles["progress"]} style={{ width: `${progress}%` }}></div>
                          </div>
  
                          {isLoading && <p>Загрузка... ({progress}%)</p>}
                        </>
                      ) : (
                        <div className={styles.attack_reward}>
                          <p className={styles.attack_success}>✅ Успешно! Атака завершена.</p>
  
                          <div className={styles.attack_controls}>
                            <label>
                              Добываемый ресурс:
                              <select
                                value={selectedResource}
                                onChange={(e) => setSelectedResource(e.target.value)}
                                className={styles.resource_select}
                              >
                                <option value="Tonium">Tonium</option>
                                <option value="GC">GC</option>
                                <option value={planet?.symbol}>{planet.symbol}</option>
                              </select>
                            </label>
  
                            <div className={styles.resource_block}>
                              <p>На планете:</p>
                              <ul>
                                <li>GC: {selectedPlanetResources["GC"] ?? 0}</li>
                                <li>Tonium: {selectedPlanetResources["Tonium"] ?? 0}</li>
                                <li>{planet.symbol}: {selectedPlanetResources[planet.symbol] ?? 0}</li>
                              </ul>
                            </div>
  
                            <p className={styles.attack_size}>
                              Вы можете увезти {attackSize !== null ? `${attackSize}` : "Загрузка..."} единиц, чтобы увезти больше прокачивайте ваши корабли
                            </p>
  
                            <button className={styles.collect_button} onClick={handleCollectReward}>
                              Забрать
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </Popup>
        </>,
        document.body
      )}
    </>
  );
};

export default AttackPlanetPopup;
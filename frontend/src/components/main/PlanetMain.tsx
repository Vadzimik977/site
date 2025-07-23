import { useEffect, useRef, useState, useCallback } from "react";
import styles from "./PlanetMain.module.scss";
import Timer from "../Timer";
import RentPlanetPopup from "../Popup/RentPlanetPopup";
import AttackPlanetPopup from "../Popup/AttackPlanetPopup";
import AdvancedUpgradePopup from "../Popup/AdvancedUpgradePopup";
import Alliancemodal from "../Popup/Alliancemodal";
import UpgradePlanet from "../Popup/UpgradePlanet";
import ShipMarket from "../Popup/ShipMarket";
import UserPlanetsPopup from "../Popup/UserPlanetsPopup";
import BorderAnimation from "../../assets/js/animatedBorder";
import showPopup from "../../assets/js/showPopup";
import { ColorRing } from "react-loader-spinner";
import { debounce } from "lodash";
import { IWalletElement, IWallet } from "../../types/user.type";
import { RARE_TYPE } from "../../types/planets.type";
import { getInitialValue } from "./index";
import { useUserStore } from "../../store/userStore";
import { t } from "i18next";
import { Link } from "react-router-dom";
import {
  useTonAddress,
  useTonWallet,
  useIsConnectionRestored,
} from "@tonconnect/ui-react";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';



interface FullPlanetResponse {
  planet: {
    id: number;
    name: string;
    description: string;
    img: string;
    index: number;
    symbol: string;
    wiki_url?: string;
    forLaboratory: boolean;
    health: number;
    cosmoport_level: number;
    element_id: number;
    element_rare: string;
  };
  user_planet: {
    userId: number | null;
    level: number;
    resources: number;
    mined: number;
    speed: number;
    userName:string;
    alliance:boolean;
    related_planets:number[];
    sumhealth:number;
    alliancename: string;
  };
  speed: number;
  owners: number[];
  element_value: number;
  elements: string;
}

interface PlanetMainProps {
  planetData: FullPlanetResponse;
  userId: number;
  openModal: () => void;
  allianceMined: number;
}

export const url = 'https://playmost.ru';

type POPUP_STATUS =
  | "upgrade"
  | "wallet"
  | "updateError"
  | "balance"
  | "success";


  
export default function PlanetMain({ planetData, userId,openModal, allianceMined} : PlanetMainProps) {
 const [loading, setLoading] = useState(true);
   const animated = useRef(null);
   const [isShowPopup, setShowPopup] = useState(false);
   const [userPlanets, setUserPlanets] = useState<IUserPlanet[]>([]);
   const [showCorable, setShowCorable] = useState(false);
   const [isShowUpgrade, setIsShowUpgrade] = useState(false);
   const [isAnotherPlanet, setIsAnotherPlanet] = useState(false);
   const [anotherPlanetId, setIsAnotherPlanetId] = useState(0);
   const [isLoading, setIsLoading] = useState(false);
   const [isRentPopupOpen, setIsRentPopupOpen] = useState(false);
   const [isAttackPopupOpen, setIsAttackPopupOpen] = useState(false);
   const [percentHealth, setPercentHealth] = useState<number | null>(null);
   const [click, setClick] = useState(1);
   const [lastClickTime, setLastClickTime] = useState(0);
   const [elementValue, setElementValue] = useState(0);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [assignedPlanets, setAssignedPlanets] = useState([null, null, null]);
   const lastClickTimeout = useRef<NodeJS.Timeout | null>(null);
   const [UserAlliancePlanets, setUserAlliancePlanets] = useState([]);
   const [backend, setBackend] = useState(null);
   const [modalOpen, setModalOpen] = useState(false);
   const [sumValue, setSumValue] = useState(0);
   const [hasMouse, setHasMouse] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);


   const [isCreating, setIsCreating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  //  const [planet, setPlanet] = useState(initialPlanetData);
   const isProcessing = useRef(false);
   const [value, setValue] = useState(0);
   const animatedRef = useRef(null);

  //  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
  setIsModalOpen(false);
  setAssignedPlanets([null, null, null]); // очистка слотов
  setIsCreating(false);
  setShowSuccess(false);
};

const handleCloseModal = () => {
  setModalOpen(false);
  setAssignedPlanets([null, null, null]);
};


   

   const [planet, setPlanet] = useState<FullPlanetResponse>(planetData);
   const [isAdvancedUpgradeOpen, setAdvancedUpgradeOpen] = useState(false);


   const refetchPlanet = async () => {
    const res = await fetch(`https://playmost.ru/api2/planet/${planetData.planet.id}`);
    const data = await res.json();
    setPlanet(data);
  };
  


   
   
 
   
 
   const {  setUser,  setWallet} =
     useUserStore();
 
   const address = useTonAddress();
   const telegram = window?.Telegram.WebApp;
  //  console.log('NTG', telegram);
  //  console.log('WINDOW', window);
   const tgID = telegram?.initDataUnsafe?.user?.id || 395581114;
   const userName = telegram?.initDataUnsafe?.user?.username || "JohnDoe";



  const wallet = window?.user?.wallet;

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (animatedRef.current && !animatedRef.current.dataset.animated) {
        console.log("BorderAnimation запускается");
        new BorderAnimation(animatedRef.current);
        animatedRef.current.dataset.animated = "true";
      } else {
        console.log("Либо animatedRef пуст, либо уже анимирован");
      }
      
    }, 1000); // можно настроить
  
    return () => clearTimeout(timeout);
  }, []);
  
  


  
  
  
   
   const getInitState = async () => {
    if (!window?.user?.id || !planetData?.planet?.element_id) return;
  
    const wallet = await getWalletFromBackend(window?.user?.id);
    if (!wallet || !wallet.value) {
      console.warn("Кошелек не получен или пустой");
      return;
    }
  
    window.user.wallet = wallet;
  
    const found = wallet.value.find(
      (bal) => String(bal.symbol) === String(planetData?.planet?.symbol)
    );
  
    const startVal = found?.value ?? 0;
  
    setValue(startVal);
    setElementValue(startVal);
    setLoading(false);
  };
  
 
   useEffect(() => {
     getInitState();
 }, [isLoading, window?.user]);

//  useEffect(() => {
//      if (animated.current) {
//          new BorderAnimation(animated.current); // 👈 стандартная
//      }
//    }, [planetData]);
   
   async function getWalletFromBackend(userId) {
     try {
       const response = await fetch('https://playmost.ru/api2/get-wallet', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({ user_id: window?.user?.id })  // <== передаём в теле
       });
   
       if (!response.ok) {
         throw new Error('Не удалось получить данные о кошельке');
       }
 
   
       const data = await response.json();
 
       return data; // или data.wallet если так оформлено
     } catch (error) {
       console.error('Ошибка при получении кошелька:', error);
       return null;
     }
   }
   
   const debounceFn = useCallback(
     (click: number) => {
       updateFn(click);
     },
     [wallet, planetData?.planet]
   );

   
//  const modalRef = useRef(null);
   
//    useEffect(() => {
//     if (isTouchDevice()) {
//       setBackend(() => TouchBackend);
//     } else {
//       setBackend(() => HTML5Backend);
//     }
//   }, []);

//   useEffect(() => {
//   if (isModalOpen) {
//     setTimeout(() => {
//       disableBodyScroll(document.body);
//     }, 100); // 100ms задержка
//   } else {
//     enableBodyScroll(document.body);
//   }

//   return () => {
//     enableBodyScroll(document.body);
//   };
// }, [isModalOpen]);

  
//    useEffect(() => {
//   if (planetData?.planet && window?.user?.id) {
//     getInitState();
//   }
// }, [planet?.user_planet?.alliance, window?.user?.id]);

useEffect(() => {
    const mousePresent = window.matchMedia('(pointer:fine)').matches;
    setHasMouse(mousePresent);
  }, []);

 
   useEffect(() => {
     if (planetData?.planet && window?.user?.id) {
       getInitState();
     }
     
   }, [planetData, window?.user?.id]);

   
  
  

   

  
  
  
  
   
   
   const {
    planet: planetInfo,
    user_planet,
    speed,
    owners,
    elements
  } = planet || {};

  const putWallet = async (wallet: IWallet, value: IWalletElement[], elementValue: number) => {
    // console.log(click)
    // console.log("Вот тут смортит ", planetInfo?.id!);
    // console.log("Вот тут смотрим вариации ", elementValue);

    await updateMinedResource(planetInfo?.id!, elementValue);
    // console.log("Тут тоже проходили ");
    return await updateWalletElement(wallet, value);
  };


  const updateMinedResource = async (id: number, mined: number) => {
    try {
      // console.log("ID MINED", id);
      // console.log("MINED", mined);
      // console.log("USER ID", user?.id);
  
      const response = await fetch(`https://playmost.ru/api2/ssssss/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mined, user_id: user?.id }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка при обновлении ресурса планеты: ${errorText}`);
      }
  
      const result = await response.json();
      // console.log("Response mined", result);
      return result;
    } catch (error) {
      console.error('Ошибка в updateMinedResource:', error);
      return null;
    }
  };

  const updateWalletElement = async (wallet, value) => {
    // console.log("FETCH WALLET", wallet);
  
    const response = await fetch(`https://playmost.ru/api2/wallet/${wallet.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: wallet.id,
        user_id: user?.id,
        value: value,
      }),
    });
  
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to update wallet: ${error}`);
    }
  
    const updated = await response.json();
    return updated;
  };

  const updateFn = debounce(async (val: number) => {
    if (isLoading) return;
  
    let wallet = window.user?.wallet;
  
    // Если кошелек не загружен — загружаем
    if (!wallet && window.user?.id) {
      const fetchedWallet = await getWalletFromBackend(window.user.id);
      if (fetchedWallet) {
        window.user.wallet = fetchedWallet;
        wallet = fetchedWallet; // присваиваем после await
      } else {
        console.warn("Не удалось загрузить кошелек");
        return;
      }
    }
  
    if (!wallet || !planetInfo?.element_id) return;
  
    const balance = wallet.value ?? [];
    const idx = balance.findIndex(
      (item) => String(item.element) === String(planetInfo.element_id)
    );

    

   

  
    const updatedValue = parseFloat(val.toFixed(10));
    let data;
  
    setIsLoading(true);
  
    if (idx !== -1) {
      balance[idx].value = updatedValue;
      data = [...balance];
    } else {
      const newElem: IWalletElement = {
        element: String(planetInfo.element_id),
        value: updatedValue,
        name: planetInfo.name,
        img: planetInfo.img,
        symbol: planetInfo.symbol,
        rare: (planetInfo.element_rare ?? "Обычная") as RARE_TYPE,
      };
      data = [...balance, newElem];
    }
    // console.log("wallet",wallet);
    // console.log("data",data);
    // console.log("updatedValue",updatedValue);
    await updateMinedResource(planetInfo?.id!, updatedValue);
      console.log("Тут тоже проходили ");
      return await updateWalletElement(wallet, data);
    setValue(updatedValue);
    window.user.wallet.value = data;
  
    setIsLoading(false);
  }, 50);
  
  function isTouchDevice() {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0
  );
}
  
  // useEffect(() => {
  //   if (!planet?.user_planet || !Array.isArray(planet.owners)) return;
  
  //   const isOwner = planet.owners.includes(userId);
  //   if (!isOwner) return;
  
  //   const interval = setInterval(() => {
  //     setPlanet(prev => {
  //       const level = prev.user_planet?.level || 1;
  
  //       // ❗️Если уровень 1 — ничего не делаем, возвращаем текущее состояние
  //       console.log('level', level);
  //       if (Number(level) === 1) return prev;

  
  //       const baseRate = 0.00005;
  //       const bonus = level * baseRate;
  //       const newMined = parseFloat((prev.user_planet.mined + bonus).toFixed(10));
  
  //       setValue(newMined);
  //       setElementValue(newMined);
  //       updateFn(newMined);
  
  //       return {
  //         ...prev,
  //         user_planet: {
  //           ...prev.user_planet,
  //           mined: newMined
  //         }
  //       };
  //     });
  //   }, 1000);
  
  //   return () => clearInterval(interval);
  // }, [planet?.user_planet?.level, planet?.owners, userId]);

// useEffect(() => {
//   if (!planet?.user_planet || !Array.isArray(planet.owners)) return;

//   const isOwner = planet.owners.includes(userId);
//   if (!isOwner) return;

//   const level = planet.user_planet.level || 1;
//   if (Number(level) === 1) return;

//   const rate = planet.user_planet.speed;
//   const serverMined = planet.user_planet.mined;
//   const lastServerTimestamp = Date.now();

//   const relatedPlanets = planet.user_planet.related_planets || [];
//   const relatedPlanetsData = planet.relatedData || [];

//   const interval = setInterval(() => {
//     const now = Date.now();
//     const secondsSince = (now - lastServerTimestamp) / 1000;

//     const mainMinedCurrent = serverMined + (secondsSince * rate) / 3600;

//     const relatedSum = relatedPlanetsData.reduce((acc, rp) => {
//       if (!relatedPlanets.includes(rp.id)) return acc;

//       const secondsSinceRp = (now - rp.lastTimestamp) / 1000;
//       const rpMinedCurrent = rp.mined + (secondsSinceRp * rp.speed) / 3600;

//       return acc + rpMinedCurrent;
//     }, 0);

//     const totalSum = mainMinedCurrent + relatedSum;

//     setSumValue(parseFloat(totalSum.toFixed(10)));
//   }, 1000);

//   return () => clearInterval(interval);
// }, [
//   planet?.user_planet?.level,
//   planet?.user_planet?.mined,
//   planet?.user_planet?.speed,
//   planet?.user_planet?.alliance,
//   planet?.user_planet?.related_planets,
//   planet?.owners,
//   userId,
// ]);

useEffect(() => {
  if (!planet?.user_planet || !Array.isArray(planet.owners)) return;

  const isOwner = planet.owners.includes(userId);
  if (!isOwner) return;

  const level = planet.user_planet.level || 1;
  if (Number(level) === 1) return;

  // Можно учитывать alliance здесь, если нужно
  // Например, изменить отображение или поведение

  const rate = planet?.user_planet?.speed;
  const serverMined = planet.user_planet.mined;
  const lastServerTimestamp = Date.now();

  const interval = setInterval(() => {
    const now = Date.now();
    const secondsSince = (now - lastServerTimestamp) / 1000;
    const displayMined = parseFloat((serverMined + secondsSince * rate / 3600).toFixed(10));

    setValue(displayMined);
    setElementValue(displayMined);
    
  }, 1000);

  return () => clearInterval(interval);
}, [
  planet?.user_planet?.level,
  planet?.user_planet?.mined,
  planet?.user_planet?.alliance, // добавил сюда
  planet?.user_planet?.sumhealth,
  planet?.user_planet?.related_planets,
  planet?.owners,

  userId,
]);

// console.log('userplanet', planet?.user_planet?.alliance)
// console.log(`Planet ${planetData.planet.id}: alliance =`, planetData.user_planet.alliance);

  
  
  // 🟢 Только после всех хуков:
  if (loading || !planetData) {
    return (
      <div className="color-ring-wrapper planets-ring">
        <ColorRing
          visible={true}
          height={1000}
          width={500}
          colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
        />
      </div>
    );
  }

  const debouncedSaveToServer = debounce(async () => {
    if (!planet || !planet.planet?.id || !user?.id) return;
  
    try {
      await updateMinedResource(planet.planet.id, planet.user_planet.mined);
      await updateWalletElement(window.user.wallet, value);
      console.log("💰 Кошелек и добыча обновлены");
    } catch (err) {
      console.error("❌ Ошибка при сохранении ресурсов:", err);
    }
  }, 5000); // вызывается раз в 10 секунд
  
   
   

const handleAdvancedUpgrade = () => {
  setAdvancedUpgradeOpen(true);
};
   
 
   
   
 
   
  //  const updateFn = debounce(async (val: number) => {
  //    if (isLoading) {
  //      return;
  //    }
   
  //    if (!window.user?.wallet || !planetInfo?.element_id) return;
   
  //    const balance = window.user.wallet.value ?? [];
  //    const idx = balance.findIndex(
  //      (item) => String(item.element) === String(planetInfo.element_id)
  //    );
   
  //    const updatedValue = parseFloat(val.toFixed(10));
  //    let data;
   
  //    setIsLoading(true);
   
  //    if (idx !== -1) {
  //      balance[idx].value = updatedValue;
  //      data = [...balance];
  //    } else {
  //      const newElem: IWalletElement = {
  //        element: String(planetInfo.element_id),
  //        value: updatedValue,
  //        name: planetInfo.name,
  //        img: planetInfo.img,
  //        symbol: planetInfo.symbol,
  //        rare: (planetInfo.element_rare ?? "Обычная") as RARE_TYPE,
  //      };
  //      data = [...balance, newElem];
  //    }
   
  //    await putWallet(window.user.wallet, data, updatedValue);
  //    setValue(updatedValue);

  //    window.user.wallet.value = data;
   
  //    setIsLoading(false);
  //  }, 50);


   
       
 
 
 
   
 
   
   const isOwner = Array.isArray(owners) && owners.includes(user?.id || -1);
   const anotherUserPlanet = !isOwner && Array.isArray(owners) && owners.length > 0;

  //  console.log("another planet",user_planet);
 
   const showModal = (event: any, status: POPUP_STATUS) => {
         // Проверяем, существует ли event.target
         if (!event.target) {
           console.error('Event target is null or undefined');
           return; // Прерываем выполнение, если target не найден
     
           
         }
       
         const planetElement = event.target.closest(".planets__planet");
     
        
         
       
         // Если closest не нашел элемент, то выход из функции
         if (!planetElement) {
           console.error('Planet element not found');
           return;
         }
       
         let content;
         if (status === "upgrade") {
           content = `<div class="planet__popup-title">${t("planetUpg")}</div><div class="planet__popup-text">${t("speedIncrease")}</div>`;
         } else if (status === "wallet") {
           content = `<div class="planet__popup-title">${t("modalError")}</div><div class="planet__popup-text">${t("connectWallet")}</div>`;
         } else if (status === "updateError") {
           content = `<div class="planet__popup-title">${t("modalError")}</div><div class="planet__popup-text">${t("updateError")}</div>`;
         } else if (status === "balance") {
           content = `<div class="planet__popup-title">${t("modalError")}</div><div class="wallet__popup-text">${t("notEnoughtMoney")}</div>`;
         }
       
         content = '<div class="popup__inner">' + content + "</div>";
       
         // Если planetElement найден, показываем popup
         showPopup(planetElement, content, ["planet__popup"]);
       };
 
       const showUpgradeModal = (e: any) => {
         if (!user?.id) return 0; // Проверка на наличие пользователя
         const userPlanet = userPlanets.find(
           (item) => item.userId === user?.id  // Используем user?.id вместо 0
         );
         console.log("Нажато");
         // if (!userPlanet) return 0; // Проверка, что планета найдена
         console.log("Два");
         
         if (isAnotherPlanet) {
             return; // Возможно, должна быть проверка на другую планету
         }
     
         console.log("Четыре");
         setIsShowUpgrade(true);  // Открытие модалки
     }
     
    
    
    
           
    
     const debouncedPut = debounce(async (val: number) => {
       if (!window.user?.wallet || !planetInfo?.element_id) return;
     
       const balance = window.user.wallet.value ?? [];
       const idx = balance.findIndex(
         (item) => String(item.element) === String(planetInfo.element_id)
       );
     
       const updatedValue = parseFloat(val.toFixed(10));
       let data;
     
       if (idx !== -1) {
         balance[idx].value = updatedValue;
         data = [...balance];
       } else {
         const newElem: IWalletElement = {
           element: String(planetInfo.element_id),
           value: updatedValue,
           name: planetInfo.name,
           img: planetInfo.img,
           symbol: planetInfo.symbol,
           rare: (planetInfo.element_rare ?? "Обычная") as RARE_TYPE,
         };
         data = [...balance, newElem];
       }
     
       await putWallet(window.user.wallet, data, updatedValue);
       window.user.wallet.value = data;

     }, 300); // Можно увеличить задержку, например до 300-500 мс
           
 
           const walletUpdate = (e: any) => {
             if (e.target.tagName.toLowerCase() === "button") return;
             if (isAnotherPlanet) return;
           
             const plusIcon = document.createElement("div");
             plusIcon.textContent = "+";
             plusIcon.classList.add("plus-icon");
             plusIcon.style.left = `${e.pageX}px`;
             plusIcon.style.top = `${e.pageY}px`;
             document.body.appendChild(plusIcon);
             plusIcon.addEventListener("animationend", () => plusIcon.remove());
           
             const currentTime = Date.now();
             const clickInterval = currentTime - lastClickTime;
           
             const newVal = parseFloat((elementValue + 0.00005).toFixed(10));
             const newmined = parseFloat((planet.user_planet.mined + 0.00005).toFixed(10));
           
             setElementValue(newVal); // UI сразу обновляется
             setValue(newVal);        // 👈 это главное: обновить то, что на экране

             setPlanet((prev) => ({
              ...prev,
              user_planet: {
                ...prev.user_planet,
                mined: newVal,
              },
            }));
           
             setClick((prev) => prev + 1);
             setLastClickTime(currentTime);
           
             if (!address && click >= 4) {
               showModal(e, "wallet");
             }
           
             // просто отдаем новое значение debounce'у
             debouncedPut(newVal);
           };
           
           const fetchPlanetData = async () => {
            const res = await fetch(
              `/api2/planet/${planetInfo?.id}?user_id=${userId}`
            );
            const data = await res.json();
            setPlanet(data);
          };
          

          const handleUpgradeSuccess = (updated: {
            newLevel: number;
            newSpeed: number;
            newCost: number;
          }) => {
            fetchPlanetData(); // всё равно запрашиваем свежие данные
          
            setPlanet((prev) => ({
              ...prev,
              user_planet: {
                ...prev.user_planet,
                level: updated.newLevel,
                speed: updated.newSpeed,
              },
            }));
          
            setShowPopup(false);
            setIsShowUpgrade(false); 
          };


          const handleAdvancedUpgradeSuccess = ({ type, result }) => {
            // fetchPlanetData(); // обновляем с сервера (если нужно)
            console.log("result",result);
            setPlanet((prev) => {
              switch (type) {
                case 'health':
                  setElementValue(result.new_mined);
                  setValue(result.new_mined);
                  return {
                    ...prev,
                    user_planet: {
                      ...prev.user_planet,
                      level: result.new_level ?? prev.user_planet.level,
                      mined: result.new_mined,
                      value: result.new_mined

                      // если нужно, добавь здесь другие поля для здоровья
                    },
                  };
                case 'speed':
                  return {
                    ...prev,
                    user_planet: {
                      ...prev.user_planet,
                      speed: result.new_speed ?? prev.user_planet.speed,
                      level: result.new_level ?? prev.user_planet.level,
                      
                      // и другие поля для скорости, если есть
                    },
                  };
                default:
                  return prev;
              }
            });

            // isAdvancedUpgradeOpen(false);
          
            // setAdvancedUpgradeOpen(false);
            // setIsShowUpgrade(false);
          };
   
 const getUsersPlanetAlliance = async (userId) => {
  console.log('Alliance', userId);
  try {
    const response = await fetch(`https://playmost.ru/api2/get_planets_alliance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId }),
    });
    const data = await response.json();
    console.log('planety', data);

    if (data && typeof data === 'object' && !Array.isArray(data)) {
      // Если пришел объект — обернем в массив, чтобы сохранить структуру
      setUserAlliancePlanets([data]);
    } else if (Array.isArray(data)) {
      setUserAlliancePlanets(data);
    } else {
      console.warn('Некорректный формат данных, используем заглушку []');
      setUserAlliancePlanets([]);
    }
  } catch (error) {
    console.error('Ошибка при получении планет:', error);
    setUserAlliancePlanets([]); // Заглушка при ошибке
  } 
  // finally {
  //   setIsModalOpen(true);
  // }
};




 
   const getAllUserPlanetsById = async (id) => {
         try {
           console.log('Хотя бы что-то');
           console.log(id);
       
           // Отправляем запрос с planet_id в теле запроса
           const response = await fetch(`${url}/api2/userplanets`, {
             method: 'POST', // Изменяем метод на POST
             headers: {
               'Content-Type': 'application/json', // Указываем, что отправляем JSON
             },
             body: JSON.stringify({
               user_id: window.user?.id,
               planet_id: id, // Отправляем planet_id в теле запроса
             }),
           });
       
           // Проверка, что ответ успешный
           if (!response.ok) {
             throw new Error(`Ошибка: ${response.status}`);
           }
       
           // Получаем данные из ответа
           const data = await response.json();
           console.log('Полученные данные:', data);
       
           return data;  // Возвращаем полученные данные
         } catch (error) {
           console.error('Error fetching user planets:', error);
           throw error;  // Выбрасываем ошибку для обработки выше
         }
       };
   
   const getUsersPlanet = async () => {
         const result = await getAllUserPlanetsById(planetData?.planet?.id);
         setUserPlanets(result);
         setShowPopup(true);
         
       };
       const initVal = () => {
         return getInitialValue(planetInfo, user, isLoading, user_planets);
       }

       const ItemTypes = {
  PLANET: 'planet',
};

function DraggablePlanet({ planet }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.PLANET,
    item: { id: planet.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: 8,
        color: 'white',
      }}
    >
      <img
        src={`/img/planet/${planet.img}`}
        alt={planet.name || 'Planet'}
        style={{ width: 40, height: 40, objectFit: 'contain' }}
      />
      <span>{planet.name || 'Unnamed Planet'}</span>
      <span>LV {planet.level || 'N level'}</span>
    </div>
  );
}



function CircleSlot({ index, planet, onDrop }) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.PLANET,
    drop: (item) => onDrop(item.id, index),
    // Разрешаем дропить планету даже если слот занят, чтобы заменить
    canDrop: () => true,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  return (
    <div
      ref={drop}
      style={{
        width: 80,
        height: 80,
        borderRadius: "50%",
        border: "2px dashed white",
        margin: 10,
        backgroundColor: isOver ? "rgba(0,255,0,0.3)" : "transparent",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {planet ? (
        <img
          src={`/img/planet/${planet.img}`}
          alt={planet.name}
          style={{ width: 60, height: 60, borderRadius: "50%" }}
        />
      ) : (
        <span style={{ color: "white", fontSize: "0.5em" }}>Участник</span>

      )}
    </div>
  );
}


async function handleCreateAlliance() {
  setIsCreating(true); // запускаем анимацию смещения планет к центру

  setTimeout(async () => {
    try {
      // await fetch(`${url}/api2/create_alliance`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ userId, planets: assignedPlanets.filter(Boolean).map(p => p.id) }),
      // });

      handleCloseModal();
      setShowSuccess(true);

    


      setTimeout(() => {
        setShowSuccess(false);
        setIsCreating(false);
      }, 3000);
    } catch (error) {
      alert('Ошибка при создании альянса');
      setIsCreating(false);
    }
  }, 1500);
}


const isMobile = window.innerWidth <= 480;

const radius = isMobile ? 80 : 120;
const center = isMobile ? 90 : 150;
{[0, 1, 2].map((idx, _, arr) => {
  const angle = (idx / arr.length) * 2 * Math.PI - Math.PI / 2;
  const x = isCreating ? center : center + radius * Math.cos(angle);
  const y = isCreating ? center : center + radius * Math.sin(angle);

  return (
    <div
      key={idx}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
        transition: 'left 1.5s ease, top 1.5s ease',
      }}
    >
      <CircleSlot index={idx} planet={assignedPlanets[idx]} onDrop={handleDrop} />
    </div>
  );
})}


function handleDrop(draggedPlanetId, slotIndex) {
  const draggedPlanet = UserAlliancePlanets.find(p => p.id === draggedPlanetId);
  console.log('handleDrop', draggedPlanetId, slotIndex);
  console.log('draggedPlanet', draggedPlanet, slotIndex);
  console.log('UserAlliancePlanets', UserAlliancePlanets, slotIndex);
  if (!draggedPlanet) return;

  // Планета, которая сейчас в слоте
  const planetInSlot = assignedPlanets[slotIndex];

  if (planetInSlot) {
    console.log('Занят слот')
    // Смена местами:
    // 1. Помещаем планету из слота обратно в список
    // 2. В слот ставим перетаскиваемую планету
    setUserAlliancePlanets(prev => 
      prev
        .filter(p => p.id !== draggedPlanetId) // удаляем из списка перетаскиваемую планету
        .concat(planetInSlot) // возвращаем планету из слота в список
    );

    setAssignedPlanets(prev => {
      const newAssigned = [...prev];
      newAssigned[slotIndex] = draggedPlanet;
      return newAssigned;
    });
  } else {
    console.log('Пустой слот')
    // Слот пустой — просто ставим и удаляем из списка
    setAssignedPlanets(prev => {
      const newAssigned = [...prev];
      newAssigned[slotIndex] = draggedPlanet;
      return newAssigned;
    });

    setUserAlliancePlanets(prev => prev.filter(p => p.id !== draggedPlanetId));
  }
}

//   const openModal = () => {
//   getUsersPlanetAlliance(user?.id);
// };

const handleOpenModal = async () => {
  if (!user_planet?.alliance) {
    await getUsersPlanetAlliance(user?.id);  // ждем получения данных
    setModalOpen(true);                       // открываем модалку после получения
  }
};



const hasEmptySlots = assignedPlanets.some((planet) => !planet);

//  console.log('Alliance:', user_planet?.alliance);

 
       return (
         
         <div
  className={`planets__planet animated-border-container with_To rotate 
    ${!isOwner ? "ver3" : isOwner ? "ver1" : "ver2"} 
    ${Number(user_planet?.level) >= 11 ? "green-glow" : ""} 
    ${planetData?.user_planet?.alliance 
      ? "orange-glow" 
      : (planetData?.planet?.forLaboratory ? "white-glow" : "")
    }
  `}
  onClick={walletUpdate}
  ref={animatedRef}
>

           <div className={styles.planetWrapper}>
  {/* Верх: слева инфа, справа планета */}
  <div className={styles.topSection}>
    <div className={styles.planetLeft}>
      <h4>
        {planet.name} ({elements}) — Planet #{planetInfo.index}
      </h4>

      <div className={styles.planetDescription}>
  {t("extractedResource")}   {planetInfo.name} ({elements})
      </div>

      <div className={styles.owner}>
        <img src="/icons/astronaut_helmet.png" width={32} height={32} />
       <div className={styles.planetOwner}>
  {
  isOwner ? (
    t("ypuowner")
  ) : anotherUserPlanet ? (
    `${t("owner")} ${
      user_planet?.userName?.trim()
        ? `@${user_planet.userName}`
        : `ID${user_planet?.userId}`
    }`
  ) : (
    t("befirst")
  )
}

</div>


      </div>
      <div className={styles.owner}>
      <button
        className={styles.planet_list_button} 
        onClick={getUsersPlanet}
      >
        {t("listplanets")} 
      </button>
      </div>
    </div>

    <div className={styles.planetRight} style={{ position: 'relative', display: 'inline-block' }}>
  <img
    src={`/img/planet/${planetInfo.img}`}
    className={styles.planetImage}
    alt={planetInfo.name}
  />
  
 {user_planet.level >= 5 && owners.includes(userId) && (
  <div
    style={{
      position: 'absolute',
      right: 0,
      bottom: 0,
      cursor: planetData.user_planet.alliance  ? 'default' : 'pointer',
    }}
    onClick={!planetData.user_planet.alliance? openModal : undefined}
    role="button"
    tabIndex={!planetData.user_planet.alliance ? 0 : -1}
    onKeyDown={(e) => {
      if (!planetData.user_planet.alliance && (e.key === 'Enter' || e.key === ' ')) setModalOpen(true);
    }}
  >
    <div
      style={{ position: 'relative' }}
      className={planetData.user_planet.alliance ? styles.allianceActive : ''}
    >
      <img src="/icons/alliance.png" alt="Alliance" className={styles.allianceIcon} />
      {!planetData.user_planet.alliance && <img src="/icons/plus.png" alt="Plus" className={styles.plusIcon} />}
    </div>
  </div>
)}


    {/* Вне div, отдельно — рендерим модалку */}
    <Alliancemodal
      isOpen={modalOpen}
      setIsOpen={handleCloseModal}
      assignedPlanets={assignedPlanets}
      handleDrop={handleDrop}
      handleCreateAlliance={handleCreateAlliance}
      hasEmptySlots={hasEmptySlots}
      UserAlliancePlanets={UserAlliancePlanets}
      isCreating={isCreating}
    />
  




</div>





  </div>

  {/* Характеристики таблицей ниже */}
  <div className={styles.planetInfo}>
    <div className={styles.planetInfo__row}>
      <span className={styles.planetInfo__title}>{t("level")} </span>
      <span className={styles.planetInfo__description}>
  {planet.user_planet.level || 1}
</span>

    </div>
    <div className={styles.planetInfo__row}>
  <span className={styles.planetInfo__title}>{t("speed")} </span>
  <span className={styles.planetInfo__description}>
    {!isOwner ? (
      <>
        0.00005 ({planetInfo.symbol}) /тап
      </>
    ) : (
      <>
        {user_planet.speed.toFixed(5)} ({planetInfo.symbol}) {user_planet.speed < 0.01 ? "/тап" : "/ч"}
      </>
    )}
  </span>
</div>

    <div className={styles.planetInfo__row}>
      <span className={styles.planetInfo__title}>{t("minedelse")}</span>
      <span className={styles.planetInfo__description}>
        {value?.toFixed(5) ?? "Загрузка..."}
      </span>
    </div>
    
  <div className="planet__time-timer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
  {planetInfo.forLaboratory ? (
    <>
      {/* Добавьте вашу картинку здесь с классом для вращения */}
      <img 
        src="/icons/dsn.png" 
        alt="Описание картинки" 
        className={styles.rotate}
        style={{ height: '40px', marginRight: '5px' }} // Настраивайте высоту и отступы по необходимости
      />
      <Timer />
    </>
  ) : (
    <div style={{ height: '40px' }} />
  )}
</div>

  </div>
</div>


             
     
             
           
<div className={styles.actions}>
  {!isOwner && (
    <button
      className={styles["action-btn"]}
      onClick={() => setIsAttackPopupOpen(true)} // Открываем попап
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

  {isOwner && (
  <>
    <button
      className={styles["action-btn"]}
      onClick={() => {
        const level = Number(user_planet.level);
        if (level < 11) {
          showUpgradeModal(true);
        } else {
           showUpgradeModal(true);
          // handleAdvancedUpgrade();
        }
      }}
    >
      {t("upgrade")}
      <img src="/icons/upgrade.png" width={24} height={24} />
    </button>

     <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        className={styles["action-btn"]}
        style={{ position: "relative", paddingTop: "24px" }}
        onClick={() => {
          if (!hasMouse) {
  if (planetData.user_planet.alliance) {
    alert(`Альянс: ${user_planet.alliancename}\nЗдоровье планеты: ${(user_planet.mined + planet.user_planet.sumhealth).toFixed(5)}`);
  } else {
    alert(`Здоровье планеты: ${(user_planet.mined + planet.user_planet.sumhealth).toFixed(5)}`);
  }
}

        }}
        onMouseEnter={() => {
          if (hasMouse) setShowTooltip(true);
        }}
        onMouseLeave={() => {
          if (hasMouse) setShowTooltip(false);
        }}
      >
        {/* Если есть альянс — сверху показываем +1000 */}
        {planetData.user_planet.alliance && (
          <div
            style={{
              position: "absolute",
              top: "4px",
              left: "70%",
              transform: "translateX(-50%)",
              color: "green",
              fontWeight: "bold",
              fontSize: "12px",
              userSelect: "none",
            }}
          >
            {planet?.user_planet?.sumhealth > 0
              ? `+${planet.user_planet.sumhealth.toFixed(2)}`
              : "+0"}
          </div>
        )}

        <img src="/icons/heart.png" width={20} height={18} />
        {value?.toFixed(5)}
      </button>

      {showTooltip && (
  <div
    style={{
      position: 'absolute',
      top: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      marginTop: 6,
      padding: '6px 12px',
      backgroundColor: 'rgba(0,0,0,0.8)',
      color: 'white',
      borderRadius: 4,
      fontSize: 12,
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
      zIndex: 10,
    }}
  >
    {user_planet.alliance
      ? (
        <>
          {t("alliance")} {user_planet.alliancename} <br />
          {t("planethealth")} {(user_planet.mined + planet.user_planet.sumhealth).toFixed(5)}
        </>
      )
      : `${t("planethealth")} ${(user_planet.mined + planet.user_planet.sumhealth).toFixed(5)}`
    }
  </div>
)}

    </div>
  </>
)}


  {/* {isOwner && Number(user_planet.level) === 11 && (
    <p>Планета достигла максимального уровня! </p>
  )} */}
</div>


     
<div
  className={styles.planet_bottom}
  style={{
    backgroundImage: `url(/img/buildings/${
      isOwner
        ? (planet.user_planet.level >= 11 ? 10 : planet.user_planet.level - 1)
        : (planet.user_planet.level >= 11 ? 10 : (planet.user_planet.level > 0 ? planet.user_planet.level - 1 : 0))
    }.png)`
  }}
>



           
           <div className={styles.planet_bottom_actions}>
           

              <div className={styles.planet_bottom_actions__up}>

               
             </div>
             
               
               <Link to="/tasks">
                  <div className={styles.free_res}>
                    <div className={styles.free_res__title}>{t('freeResource')}</div>
                    <div className={styles.free_res__description}> {t('freeResourceInfo')}</div>
                  </div>
                </Link>
             </div>
           </div>
 
           {isShowPopup && userPlanets && (
             <UserPlanetsPopup
               planets={userPlanets}
               setShowPopup={setShowPopup}
               planet={planetData.planet}
               userId={user?.id}
               onClick={(is: boolean, number: number) => {
                 setIsAnotherPlanet(is)
                 setIsAnotherPlanetId(number)
               }}
             />
           )}
 
 {isRentPopupOpen && (
   <RentPlanetPopup
     isOpen={isRentPopupOpen}
     setIsRentPopupOpen={setIsRentPopupOpen} // Передаем функцию для управления состоянием
     onRentSuccess={() => {
       // updatePlanetSpeed(); // или другая функция аренды
     }}
     planetId={planetInfo?.id}
     userId={user?.id}
   />
 )}

<AdvancedUpgradePopup
  isOpen={isAdvancedUpgradeOpen}
  setPopupOpen={setAdvancedUpgradeOpen}
  userId={userId}
  planetId={planetInfo?.id}
  onSuccess={showSuccess}
/>

 
 {isAttackPopupOpen && (
   <AttackPlanetPopup
     isOpen={isAttackPopupOpen}
     setIsAttackPopupOpen={setIsAttackPopupOpen}
     onAttackSuccess={() => {
      
       // updatePlanetSpeed();
     }}
     
     planetId={planetInfo?.id}               // Передаем id планеты
     userId={user?.id} 
     planet={planetInfo} 
     attacker = {planet.user_planet}// <-- передаем сюда
   />
 )}

 
 
 
 
 
 
 
 <UpgradePlanet
  setShowPopup={setIsShowUpgrade}
  isOpen={isShowUpgrade}
  onSuccess={handleUpgradeSuccess}
  planetId={planetInfo?.id}  // теперь planetInfo
  userId={user?.id}
  user={user}
/>


 
           <ShipMarket userId={user?.id} onClick={() => {}} onSuccess={() => {}} planetId={planetInfo.id}    isOpen={showCorable} setShowPopup={setShowCorable} />
         </div>
       );
     }
 

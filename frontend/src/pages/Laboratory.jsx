// import { useEffect, useState } from "react";
// import Layout from "../components/Layout";
// import { getPlanets, updateUser } from "../utils/axios";
// import { ColorRing } from "react-loader-spinner";
// import Timer from "../components/Timer";
// import showPopup from "../assets/js/showPopup";
// import { updateWalletElement } from "../utils/axios";
// import { fetchDefaultUser } from "../assets/js/getUser";
// import { useTranslation } from "react-i18next";

// export default function Laboratory() {
//     const [elems, setElems] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [wallet, setWallet] = useState(null);
//     const { t } = useTranslation();

//     useEffect(() => {
//         const waitUntilUserReady = () => {
//             return new Promise(resolve => {
//                 const interval = setInterval(() => {
//                     if (window?.user?.id) {
//                         clearInterval(interval);
//                         resolve();
//                     }
//                 }, 100);
//             });
//         };
    
//         const init = async () => {
//             await waitUntilUserReady(); // ждём появления window.user.id
//             console.log("✅ user готов", window.user); // тут уже точно есть user.id
    
//             await fetchPlanets();
    
//             const fetchedWallet = await getWalletFromBackend();
//             setWallet(fetchedWallet);
//         };
    
//         init();
    
//         const handleGetUser = () => init(); // на всякий случай
    
//         document.addEventListener('getUser', handleGetUser);
//         return () => {
//             document.removeEventListener('getUser', handleGetUser);
//         };
//     }, []);
    
    
    
//     console.log("user ",window?.user);
//     console.log("wallet ",window?.wallet);

//     const getWalletFromBackend = async () => {
//         try {
//             console.log("get res ",window?.user?.id);
//             const response = await fetch('https://playmost.ru/api2/get-wallet', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ user_id: window?.user?.id })
//             });

//             if (!response.ok) {
//                 throw new Error('Не удалось получить данные о кошельке');
//             } 

//             const data = await response.json();
//             console.log("Ответ от бекенда:", JSON.stringify(data, null, 2));

//             return data.wallet;
//         } catch (error) {
//             console.error('Ошибка при получении кошелька:', error);
//             return null;
//         }
//     };

//     const fetchPlanets = async () => {
//         const planets = await getPlanets([0, 9], true, 0);
//         const uniquePlanets = [...new Map(planets.map(p => [p.id, p])).values()];
//         setElems(uniquePlanets);
//         setIsLoading(false);
//     };

//     const getPlanetWallet = (id) => {
//         if (wallet?.value) {
//             const found = wallet.value.find(item => item.element === id);
//             return found?.value ?? 0;
//         }
//         return 0;
//     };

//     const showModal = (event, status) => {
//         const laboratoryElement = event.target.closest('.laboratory');
//         let content = '';
//         const additionalClasses = ['laboratory__popup'];

//         if (status === 'complete') {
//             content = `<div class="laboratory__popup-title">${t('mergeSuccess')}</div>`;
//         } else {
//             content = `<div class="laboratory__popup-title">${t('modalError')}</div><div class="laboratory__popup-text">${t('elementZero')}</div>`;
//         }

//         content = `<div class="popup__inner">${content}</div>`;
//         showPopup(laboratoryElement, content, additionalClasses);
//     };

//     const union = async (event) => {
//         if (!wallet?.value?.length) {
//             showModal(event);
//             return;
//         }

//         const minVal = elems.map(item => ({
//             ...item.element,
//             value: getPlanetWallet(item.element.id)
//         }));

//         const min = Math.min(...minVal.map(item => item.value));

//         if (min === 0) {
//             showModal(event);
//             return;
//         }

//         let newValues = minVal.map(item => ({
//             ...item,
//             element: item.id,
//             value: parseFloat((item.value - min).toFixed(10))
//         }));

//         newValues = newValues.map(item => ({
//             element: item.id,
//             img: item.img,
//             name: item.name,
//             rare: item.rare,
//             symbol: item.symbol,
//             value: item.value
//         }));

//         const updatedValues = [
//             ...wallet.value.filter((item) => !newValues.some(val => val.element === item.element)),
//             ...newValues
//         ];

//         await updateWalletElement(wallet, updatedValues);
//         await updateUser({ ton: min + window.user.ton });
//         window.user.ton += min;
//         await fetchDefaultUser();

//         const refreshedWallet = await getWalletFromBackend();
//         setWallet(refreshedWallet);

//         showModal(event, 'complete');
//     };



//     return (
//         <Layout>
//             <div className="main__inner">
//                 <h1 className="main__title">{t('laboratoryTitle')}</h1>
//                 <div className="laboratory">
//                     <div className="laboratory__time">
//                         <div className="laboratory__time-text">
//                             {t('laboratorySubTitle')}
//                         </div>
//                         <div className="laboratory__time-timer">
//                             <Timer />
//                         </div>
//                     </div>
//                     {!isLoading ? (
//                         <div className="laboratory__items">
//                             {[...new Map(elems.map(item => [item.id, item])).values()].map((item) => (
//                                 <div key={item.id}>
//                                     <img
//                                         style={{ width: "85px" }}
//                                         src={`/img/icon/${item.img}`}
//                                         alt=""
//                                     />
//                                     <span>{getPlanetWallet(item.id)} {item.symbol}</span>
//                                 </div>
//                             ))}
//                         </div>
//                     ) : (
//                         <div className="color-ring-wrapper">
//                             <ColorRing
//                                 visible={isLoading}
//                                 height={80}
//                                 width={80}
//                                 colors={[
//                                     "#e15b64",
//                                     "#f47e60",
//                                     "#f8b26a",
//                                     "#abbd81",
//                                     "#849b87",
//                                 ]}
//                             />
//                         </div>
//                     )}
//                     <button className="laboratory__button" onClick={(e) => union(e)}>
//                         {t('combine')}
//                     </button>
//                     <div className="laboratory__text">
//                         {t('syntDev')}
//                     </div>
//                 </div>
//             </div>
//         </Layout>
//     );
// }


import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getPlanets } from "../utils/axios";
import { ColorRing } from "react-loader-spinner";
import Timer from "../components/Timer";
import showPopup from "../assets/js/showPopup";
import { useTranslation } from "react-i18next";
import { updateWalletElement } from "../utils/axios";

export default function Laboratory() {
    const [elems, setElems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [wallet, setWallet] = useState(null);
    const [walletValues, setWalletValues] = useState({});
    const { t } = useTranslation();
    // const [user, setUser] = useState([]);
    
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    // Проверка и загрузка данных о кошельке
    const loadWalletValues = async (planets) => {
        if (!wallet) {
            console.log("Wallet is not loaded yet. Skipping loadWalletValues.");
            return;
        }

        const values = {};
        const planetWalletPromises = planets.map(async (p) => {
            const val = await getPlanetWallet(p.id);
            values[p.id] = val;
        });

        // Ждем завершения загрузки всех значений
        await Promise.all(planetWalletPromises);

        setWalletValues(values);
        setIsDataLoaded(true); // Устанавливаем флаг после завершения загрузки данных
    };

    const getPlanetWallet = async (id) => {
        // console.log("getPlanetWallet called with id:", id);
        const id_el = await getel(id); // Получаем ID элемента для планеты
        // console.log("Fetched element id (id_el) for planet", id, ":", id_el);

        if (id_el === 0) {
            // console.log(`Element ID for planet ${id} is 0, returning 0`);
            return 0;
        }
        // console.log(wallet?.value)
        if (wallet?.value) {
            const found = wallet.value.find(item => Number(item.element) === id_el);
            // console.log("Found value in wallet:", found?.value);
            return found?.value ?? 0;
        }
        return 0;
    };

    
    

    const getel = async (id) => {
        try {
            const response = await fetch('https://playmost.ru/api2/get-el', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planet_id: id })
            });

            if (!response.ok) {
                throw new Error('Не удалось получить данные о элементе');
            }

            const data = await response.json();
            return data.id ?? 0;
        } catch (error) {
            console.error('Ошибка при получении элемента:', error);
            return 0;
        }
    };

    const updateUserTon = async (userId, newTon) => {
        try {
            console.log("usr ",userId);
            console.log("newton",newTon)
            const response = await fetch('https://playmost.ru/api2/update-userton', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    ton: newTon,
                }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to update user ton');
            }
    
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Ошибка при обновлении пользователя:', error);
            return null;
        }
    };
    

    

    // Инициализация: Загружаем кошелек, планеты
    useEffect(() => {
        const waitUntilWalletReady = async () => {
            if (wallet) return;
            console.log("Waiting for wallet to load...");
    
            const walletData = await getWalletFromBackend();
            setWallet(walletData);
            console.log("Wallet loaded:", walletData);
        };
    
        const waitUntilUserReady = () => {
            return new Promise(resolve => {
                const interval = setInterval(() => {
                    if (window?.user?.id) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 100);
            });
        };
    
        const fetchPlanetsData = async () => {
            const planets = await fetchPlanets();
            console.log("lab pla nets",planets)
            return planets;
        };
    
        const init = async () => {
            await waitUntilUserReady();
            await waitUntilWalletReady();
    
            // Загружаем NFT после загрузки кошелька
            console.log("adress", user);
            
    
            const planets = await fetchPlanetsData();
    
            if (planets?.length > 0) {
                await loadWalletValues(planets);
            }
        };
    
        init();
    
        const handleGetUser = () => init();
        document.addEventListener('getUser', handleGetUser);
    
        return () => {
            document.removeEventListener('getUser', handleGetUser);
        };
    }, [wallet]);
     // Повторный запуск только если кошелек изменился

    // Получение кошелька с бекенда
    const getWalletFromBackend = async () => {
        try {
            const response = await fetch('https://playmost.ru/api2/get-wallet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: window?.user?.id })
            });

            if (!response.ok) {
                throw new Error('Не удалось получить данные о кошельке');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Ошибка при получении кошелька:', error);
            return null;
        }
    };

    // Получаем планеты с бекенда
    const fetchPlanets = async () => {
        const planets = await getPlanets([0, 9], true, 0);
        const purePlanets = planets.map(p => p.planet || p); // если вдруг структура изменится
        const uniquePlanets = [...new Map(purePlanets.map(p => [p.id, p])).values()];
        setElems(uniquePlanets);
        setIsLoading(false);
        return uniquePlanets;
    };
    

    const showModal = (event, status) => {
                const laboratoryElement = event.target.closest('.laboratory');
                let content = '';
                const additionalClasses = ['laboratory__popup'];
        
                if (status === 'complete') {
                    content = `<div class="laboratory__popup-title">${t('mergeSuccess')}</div>`;
                } else {
                    content = `<div class="laboratory__popup-title">${t('modalError')}</div><div class="laboratory__popup-text">${t('elementZero')}</div>`;
                }
        
                content = `<div class="popup__inner">${content}</div>`;
                showPopup(laboratoryElement, content, additionalClasses);
            };

            const union = async (event) => {
                if (!user) return;
            
                if (!wallet.value?.length) {
                    showModal(event, null);
                    return;
                }
            
                if (!elems?.length) return;
            
                // Получаем значения из кошелька
                const minVal = await Promise.all(
                    elems.map(async (item) => {
                        const walletValue = await getPlanetWallet(item.id);
                        console.log(`Wallet value for ${item.name} (ID: ${item.id}):`, walletValue);
                        return {
                            ...item,
                            value: walletValue ?? 0,
                        };
                    })
                );
            
                console.log("minVal with values:", minVal);
            
                // Вычисляем минимум
                const min = Math.min(...minVal.map(item => item.value));
                console.log("Calculated min value:", min);
            
                if (min <= 0) {
                    showModal(event, null);
                    return;
                }
            
                // Вычитаем минимум из каждого элемента и проверяем
                // const newValues = minVal.map(item => {
                //     const newValue = parseFloat((item.value - min).toFixed(10)) || 0;
                //     console.log(`Updated value for ${item.name} (ID: ${item.id}):`, newValue);
                //     return {
                //         element: String(item.id),  // Преобразуем ID в строку
                //         img: item.img,
                //         name: item.name,
                //         rare: item.rare || "Обычная",
                //         symbol: item.symbol || "???",
                //         value: newValue,
                //     };
                // });
            
                // console.log("Updated values after subtracting min:", newValues);
            
                // // Объединяем с текущим кошельком (удаляем дубли по element)
                // const updatedValues = [
                //     ...wallet.value.filter(item => !newValues.some(val => val.name === item.name)),
                //     ...newValues,
                // ];

                // Создаём Map для быстрого доступа к новым значениям по name
                const valueMap = new Map(
                    minVal.map(item => [item.name, parseFloat((item.value - min).toFixed(10))])
                );
                
                // Обновляем значения только у совпадающих name
                const updatedValues = wallet.value.map(item => {
                    if (valueMap.has(item.name)) {
                    return {
                        ...item,
                        value: valueMap.get(item.name),
                    };
                    }
                    return item;
                });
  
            
                console.log("🔄 updatedValues to be sent to backend:", updatedValues);
            
                try {
                    // Обновляем кошелек
                    const updatedWallet = await updateWalletElement(wallet, updatedValues);
                    console.log("Wallet updated successfully:", updatedWallet);
            
                    setWallet(updatedWallet);
            
                    // Обновляем тон для пользователя
                    const newUser = await updateUserTon(user?.id, min + user?.ton);
                    window.user.ton += min;

                    const walletAmountElement = document.querySelector('.wallet__ton');
                    if (walletAmountElement) {
                        walletAmountElement.innerText = window.user.ton+min; // Обновляем значение
                    }
            
                    console.log("User's ton after update:", window.user.ton);
            
                    showModal(event, "complete");
                } catch (error) {
                    console.error("Ошибка при обновлении кошелька:", error);
                    showModal(event, "error");
                }
            };
            
            
    
    

    return (
        // <Layout>
            <div className="main__inner">
                <h1 className="main__title">{t('laboratoryTitle')}</h1>
                <div className="laboratory">
                    <div className="laboratory__time">
                        <div className="laboratory__time-text">
                            {t('laboratorySubTitle')}
                        </div>
                        <div className="laboratory__time-timer">
                            <Timer />
                        </div>
                    </div>
                    {!isLoading && isDataLoaded ? (
                        <div className="laboratory__items">
                            {[...new Map(elems.map(item => [item.id, item])).values()].map((item) => (
                                <div key={item.id}>
                                    <img
                                        style={{ width: "85px" }}
                                        src={`/img/icon/${item.img}`}
                                        alt=""
                                    />
                                    <span>{Number(walletValues[item.id] ?? 0) === 0 
  ? 0 
  : Number(walletValues[item.id]).toFixed(5)} {item.symbol}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="color-ring-wrapper">
                            <ColorRing
                                visible={isLoading || !isDataLoaded}
                                height={80}
                                width={80}
                                colors={[
                                    "#e15b64",
                                    "#f47e60",
                                    "#f8b26a",
                                    "#abbd81",
                                    "#849b87",
                                ]}
                            />
                        </div>
                    )}
                    <button className="laboratory__button " onClick={(e) => union(e)}>
                        {t("combine")}
                    </button>
                    <div className="laboratory__text">{t("syntDev")}</div>
                </div>
            </div>
        /* </Layout> */
    );
}

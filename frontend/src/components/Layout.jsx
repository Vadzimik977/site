import {
    useTonAddress,
    useTonWallet,
    useIsConnectionRestored,
  } from "@tonconnect/ui-react";
  import Footer from "./Footer";
  import Header from "./Header";
  import { createContext, useEffect, useState } from "react";
  import BorderAnimation from "../assets/js/animatedBorder";
  import marketAdaptiv from "../assets/js/marketAdaptiv";
  import customSelect from "../assets/js/customSelect";
  import popups from "../assets/js/popups";
  import scroll from "../assets/js/scroll";
  import input from "../assets/js/input";
  import newCustomSelect from "../assets/js/newCustomSelect";
  import OnboardingModal from "../pages/Onboarding";
  import {
    addPlanetToUser,
    createUser,
    getAllUserPlanets,
    getNfts,
    getPlanetByName,
    getUserByTgId,
    getUser,
  } from "../utils/axios";
  import { ColorRing } from "react-loader-spinner";
  import { Outlet } from "react-router-dom";
  
  // Ваше описание контекста
  export const DataContext = createContext();

  export async function updateUserTgId(userId, tgId, userName) {
  const response = await fetch(`https://playmost.ru/api2/update_tgid`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, tgId, userName }),
  });

  if (!response.ok) {
    throw new Error("Не удалось обновить tg_id");
  }

  return await response.json();
}

  
  export default function Layout({ without = false }) {
    const adress = useTonAddress();
    const wallet = useTonWallet();
    const connectionRestored = useIsConnectionRestored();
  
    const [isLoading, setIsLoading] = useState(true);
    const [isFetched, setIsFetched] = useState(false);
    const [tgUser, setTgUser] = useState(null);
    const [showOnboarding, setShowOnboarding] = useState(false);

    
    

    async function getWalletFromBackend(userId) {
  try {
    const response = await fetch('https://playmost.ru/api2/get-wallet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId }),
    });

    if (!response.ok) {
      throw new Error('Не удалось получить данные о кошельке');
    }

    const data = await response.json();

    // 🔍 Удалим дубли по element + name
    if (data?.value && Array.isArray(data.value)) {
      const seen = new Set();
      data.value = data.value.filter(item => {
        const key = `${item.element}_${item.name}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      // Лог для отладки
      const ids = data.value.map(i => `${i.element}_${i.name}`);
      const duplicates = ids.filter((id, idx) => ids.indexOf(id) !== idx);
      if (duplicates.length) {
        console.warn("⚠️ Дубли не удалились полностью:", duplicates);
      }
    }

    return data;
  } catch (error) {
    console.error('Ошибка при получении кошелька:', error);
    return null;
  }
}

      const getShipNfts = async (address) => {
        console.log("Я собираю данные о кораблях");
        // const adress = 'UQBSZ-ZXsaxOHpOa8ekXgJDeboj792Z0alKGUU5r_i9vTOZU';
        // const adress = 'UQBSZ-ZXsaxOHpOa8ekXgJDeboj792Z0alKGUU5r_i9vTOZU';
        const apiUrl = `https://tonapi.io/v2/accounts/${address}/nfts?collection=EQA_qbGrlmx4g8QRqiY6-G5ipLHDkl03hUmsnlI382IRt7uP&limit=1000&offset=0&indirect_ownership=true`;
        
        const response = await fetch(apiUrl, {
            headers: {
                "Accept": "application/json"
                // Добавь авторизационные заголовки, если нужно
                // "Authorization": "Bearer YOUR_TOKEN"
            }
        });
    
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const data = await response.json();
        console.log("NFT",data);
        return data.nft_items;
    };

    const checkNftInDatabase = async (index) => {
      try {
          const response = await fetch(`https://playmost.ru/api2/check_nft/${index}`, {
              method: 'GET',
          });
          const data = await response.json();
          return data.exists; // Примите, что API возвращает { exists: true/false }
      } catch (error) {
          console.error("Ошибка при проверке NFT в базе данных:", error);
          return false; // В случае ошибки считаем, что NFT не существует
      }
  };

  const addNftToDatabase = async (nft,userId) => {
    try {
      const ns = nft.metadata.attributes.find(attr => attr.trait_type === "Power").value;
      console.log("NS",ns);
        const response = await fetch('https://playmost.ru/api2/add_nft', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                index: nft.index,
                name: nft.metadata.name,
                tonnage: nft.metadata.attributes.find(attr => attr.trait_type === "Tonnage").value,
                shot: nft.metadata.attributes.find(attr => attr.trait_type === "Shot").value,
                power: ns,
                // Добавьте другие атрибуты, если необходимо
            }),
        });
        const data = await response.json();
        console.log("NFT добавлено:", data);
    } catch (error) {
        console.error("Ошибка при добавлении NFT в базу данных:", error);
    }
};
      
  
    useEffect(() => {
  const telegram = window?.Telegram?.WebApp;
  const user = telegram?.initDataUnsafe?.user;

  const initTgUser = async () => {
    if (user) {
      setTgUser({
        id: user.id,
        username: user.username || "Anonymous",
      });

      // try {
      //   // const currentUser = JSON.parse(localStorage.getItem("user")); // предполагаем, что пользователь уже был сохранён ранее
      //   // if (currentUser && currentUser.tg_id !== user.id) {
      //     await updateUserTgId(window.user.id, user.id);
      //   // }
      // } catch (err) {
      //   console.warn("Не удалось обновить tg_id:", err);
      // }
    } else {
      // Для разработки без Telegram
      setTgUser({
        id: 9999,
        username: "dev_user",
      });
    }
  };

  initTgUser();
}, []);

  
    useEffect(() => {
      const init = async () => {
        if (!connectionRestored || !tgUser || isFetched) return;
        setIsFetched(true);
        setIsLoading(true);
    
        try {
          console.log("🔄 Инициализация пользователя...");
          console.log("Проверяем tgUser и adress:", tgUser, adress);
    
          // Проверка обязательных данных
          if (!tgUser?.id || !tgUser?.username) {
            throw new Error("Отсутствуют обязательные данные для создания пользователя.");
          }
          try {
            if (tgUser?.id ) {
              await updateUserTgId(window.user.id, tgUser.id, tgUser.username);
              user.tg_id = tgUser.id; // не забудь обновить локальный объект
            }
          } catch (err) {
            console.warn("❌ Ошибка при обновлении tg_id:", err);
          }
    
          let user = null;
    
          if (adress) {
            // 🔐 Если адрес есть — работаем с реальным пользователем
            user = await getUserByTgId(tgUser.id);

if (!user) {
  user = await getUser(adress);

  // Если пользователь найден по адресу, но не связан с tg_id
  if (user && !user.tg_id &&  tgUser.id!=9999) {
    try {
      await updateUserTgId(user.id, tgUser.id,tgUser.username);
      user.tg_id = tgUser.id;
    } catch (err) {
      console.warn("Ошибка при связывании tg_id:", err);
    }
  }
}

// Если пользователь вообще не найден — создаем нового
if (!user) {
  user = await createUser({
    tg_id: tgUser.id,
    userName: tgUser.username,
    adress,
  });
}

    
            // Обновим адрес при необходимости
            try{
            if (user.adress !== adress) {
              await updateUserAdress(user.id, adress);
            }
          } catch {
            console.log("АГА")
          }
    
            // Получаем кошелек
            try{
            const walletData = await getWalletFromBackend(user.id);
            if (walletData) {
              user.wallet = walletData;
            }
          } catch {
            console.log("АГА2")
          }
    
            // NFT + Планеты
            try{
            const nfts = await getNfts(user.adress);
            if (nfts) {
              user.nft = nfts;
    
              const allUserPlanets = await getAllUserPlanets();
              for (const item of nfts) {
                const planetName = item.metadata?.name?.split('(')[0];
                const planet = await getPlanetByName({ name: planetName });
    
                if (planet?.id && !allUserPlanets.some(val => val?.planetId === planet.id)) {
                  await addPlanetToUser(planet.id);
                }
              }
            }
          } catch {
            console.log("АГА3")
          }
try{
      
      } catch {
        console.log("АГА4")
      }
    
          } else {
            // ❌ Нет адреса — создаём фиктивного пользователя
            user = {
              id: 9999,
              tg_id: null,
              userName: null,
              adress: null,
              wallet: null,
              nft: [],
            };
            console.warn("⚠️ Пользователь без адреса — только ограниченный функционал.");
          }
    
          window.user = user;
          localStorage.setItem("user", JSON.stringify(user));
    
        } catch (e) {
          console.error("❌ Ошибка при инициализации:", e);
        } finally {
          setIsLoading(false);
        }
      };
    
      init();
    }, [connectionRestored, adress, tgUser]);


    useEffect(() => {
      const loadNFTsInBackground = async () => {
        const user = window.user;
        if (!user?.adress || !user?.id) return;
    
        try {
          console.log("🚀 Загружаем корабли в фоне...");
          // const ships = await getShipNfts(user.adress);
          // if (ships?.length) {
          //   for (const item of ships) {
          //     const exists = await checkNftInDatabase(item.index);
          //     if (!exists) {
          //       await addNftToDatabase(item, user.id);
          //     }
          //   }
          // }
        } catch (e) {
          console.error("Ошибка при фоновой загрузке NFT:", e);
        }
      };
    
      loadNFTsInBackground();
    }, [window.user?.adress]);
    
    
  
    // UI скрипты
    useEffect(() => {
      if (!isLoading) {
        marketAdaptiv();
        customSelect();
        popups();
        without ? "" : scroll();
        input();
        newCustomSelect();
      }
    }, [isLoading]);

    useEffect(() => {
          if (!isLoading) {
            const seen = localStorage.getItem("onboardingSeen");
            if (!seen) {
              setShowOnboarding(true);
            }
          }
        }, [isLoading]);
  
    return !isLoading ? (
      <DataContext.Provider value={{ user: window.user, isLoading }}>
        {!without && <Header />}
        {showOnboarding && (
  <OnboardingModal onClose={() => {
    localStorage.setItem("onboardingSeen", "true");
    setShowOnboarding(false);
  }} />
)}
        <main className={`main ${without ? "without" : ""}`}>
          <div className={`${without ? "without" : "container"}`}>
            <Outlet />
          </div>
        </main>
        {!without && <Footer />}
      </DataContext.Provider>
    ) : (
      <div className="color-ring-wrapper">
        <ColorRing
          visible={isLoading}
          height={80}
          width={80}
          colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
        />
      </div>
    );
  }
  


  
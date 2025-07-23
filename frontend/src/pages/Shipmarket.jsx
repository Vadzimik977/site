import { useEffect, useState, useRef } from "react";
import Layout from "../components/Layout";
import { ColorRing } from "react-loader-spinner";
import BorderAnimation from "../assets/js/animatedBorder";
import ShipMarket from "../components/Popup/ShipMarket";
import AddPopap from "../components/Popup/AddPopap";
import { t } from "i18next";

export default function ShipMarketMain() {
    const [ships, setShips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const animated = useRef(null);
    const cardRefs = useRef([]);
    const [isBuying, setIsBuying] = useState(false);
    const [upgradingShipIds, setUpgradingShipIds] = useState([]);
    const [nftLoading, setNftLoading] = useState(false);
    const [showCorable, setShowCorable] = useState(false);
    const [selectedShip, setSelectedShip] = useState(null);
    const [showAddPopup, setShowAddPopup] = useState(false);

    const getNfts = async (address) => {
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
    const handleRefreshNFTs = async () => {
    if (!window.user?.adress) {
        setErrorMessage("Адрес пользователя не найден.");
        setModalVisible(true);
        return;
    }

    setNftLoading(true);
    try {
        const nftItems = await getNfts(window.user.adress);
        console.log("Обновлённые NFT:", nftItems);

        if (nftItems?.length) {
            for (const item of nftItems) {
                const { exists, userId } = await checkNftInDatabase(item.index);

                // Добавляем NFT, если её нет или она у другого пользователя
                if (!exists || userId !== window.user.id) {
                    await addNftToDatabase(item, window.user.id);
                }
            }
        }
        const fetchShips = async () => {
            setLoading(true);
            try {
                const res = await fetch(`https://playmost.ru/api2/user_spaceshipsall/${window.user.id}`);
                const data = await res.json();
                const ships = data.filter(item => item.type === "corable");
                setShips(ships);
                console.log("SHIPS CURRENT ", ships);
            } catch (err) {
                console.error("Ошибка получения кораблей:", err);
            } finally {
                setLoading(false);
            }
        };

        await fetchShips();
        setSuccessMessage("Корабли успешно обновлены.");
    } catch (error) {
        console.error("Ошибка обновления кораблей:", error);
        setErrorMessage("Ошибка при обновлении NFT.");
    } finally {
        setNftLoading(false);
        setModalVisible(true);
    }
};


    useEffect(() => {
        if (cardRefs.current.length > 0) {
            cardRefs.current.forEach((ref) => {
                if (ref) new BorderAnimation(ref);
            });
        }
        
    }, [ships]); // пересоздаем после загрузки кораблей
    

    useEffect(() => {
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

        const fetchShips = async () => {
            setLoading(true);
            try {
                const res = await fetch(`https://playmost.ru/api2/user_spaceshipsall/${window.user.id}`);
                const data = await res.json();
                const ships = data.filter(item => item.type === "corable");
                setShips(ships);
                console.log("SHIPS CURRENT ", ships);
            } catch (err) {
                console.error("Ошибка получения кораблей:", err);
            } finally {
                setLoading(false);
            }
        };

        const init = async () => {
            await waitUntilUserReady();
            await fetchShips();
        
            // if (user?.adress) {
            //     setNftLoading(true); // <--- Start NFT loading
            //     try {
            //         window.user.spaceships = await getNfts(user?.adress);
            //         console.log("NFT window", window?.user?.spaceships);
            //         if (window.user.spaceships?.length) {
            //             const spaceships = window.user.spaceships;
            //             for (const item of spaceships) {
            //                 const exists = await checkNftInDatabase(item.index);
            //                 if (!exists) {
            //                     await addNftToDatabase(item, user?.id);
            //                 }
            //             }
            //         }
            //     } catch (error) {
            //         console.error("Ошибка при загрузке NFT:", error);
            //     } finally {
            //         setNftLoading(false); // <--- End NFT loading
            //     }
            // }
        };
        
        
        // Функция для проверки NFT в базе данных
        
        
        // Функция для добавления NFT в базу данных
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

        init();
    }, []);

    const handleBuy = async () => {
        const cost = 5;
        if (window.user.coins < cost) {
            setErrorMessage("Недостаточно монет для покупки.");
            setModalVisible(true);
            return;
        }
    
        setIsBuying(true);
    
        try {
            const res = await fetch(`https://playmost.ru/api2/buy_cosmoport`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: window.user.id,
                    cost
                })
            });
    
            if (!res.ok) throw new Error("Ошибка на сервере");
            const newShip = await res.json();
            setShips(prev => [...prev, newShip]);
            setSuccessMessage("Корабль успешно куплен!");
        } catch (err) {
            console.error(err);
            setErrorMessage("Ошибка при покупке корабля");
        } finally {
            setIsBuying(false);
            setModalVisible(true);
        }
    };

    const handleUpgradeShip = async (ship) => {
      // setShowCorable(true);
        const cost = 5 + (ship.level + 1) * 3;
        setUpgradingShipIds(prev => [...prev, ship.id]);

        if (window.user.coins < cost) {
            setErrorMessage("Недостаточно монет для покупки.");
            setModalVisible(true);
            return;
        }
    
        try {
            await fetch(`https://playmost.ru/api2/user_spaceships/${ship.id}/update?cost=${cost}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    level: ship.level + 1,
                    type: "corable"
                })
            });
    
            setShips(prev =>
                prev.map(s =>
                    s.id === ship.id ? { ...s, level: s.level + 1 } : s
                )
            );
            setSuccessMessage("Корабль успешно улучшен!");
        } catch (err) {
            console.error("Ошибка улучшения:", err);
            setErrorMessage("Ошибка при улучшении");
        } finally {
            setUpgradingShipIds(prev => prev.filter(id => id !== ship.id));
            setModalVisible(true);
        }
    };
    

    const closeModal = () => {
        setModalVisible(false);

    };
    

    return (
      <>
          <div className="main__inner">
      
            {/* Заголовок и блок рынка */}
            <h1 className="my-ships-title">{t("shipmarketrynok")}</h1>
            <div className="market-section">
                
                
              <p className="market-section__text">
                {t("marwill")}
              </p>
              <a
                href="https://getgems.io/toniumfleet"
                target="_blank"
                rel="noopener noreferrer"
                className="market-section__button"
              >
                {t("gomar")}
                
              </a>
            </div>
      
            {/* Блок "Мои корабли" */}
            <div className="my-ships-section">
              <h2 className="my-ships-title">{t("myships")}</h2>
              <div
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",     // по горизонтали
    justifyContent: "center", // по вертикали (если есть высота)
    margin: "20px 0"
  }}
>
              <button
  onClick={handleRefreshNFTs}
  className="market-section__button"
  
>
  {t("resreshships")}
</button>
</div>
      
             {/* Загрузка кораблей */}
  {loading || nftLoading ? (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      margin: "20px 0"
    }}>
      <p style={{ color: "white", marginBottom: "10px" }}>
         {t("loadships")}
      </p>
      <ColorRing
        visible={true}
        height={60}
        width={60}
        colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
      />
    </div>
  ) : ships.length === 0 ? (
    <p style={{ color: "white", textAlign: "center", marginTop: "20px" }}>
      NFT кораблей отсутствуют в блоке <strong>Мои корабли</strong>
    </p>
  ) : (
    <>
      {ships.map((ship) => {
        const level = ship.level ?? 0;
        const cost = ship.cost;
        const damage = ship.shot;
        const tonnage = ship.tonnage;
        const power = ship.power;
        const isMaxLevel = level >= 5;
        const coef = 1.8;
        console.log("Rjcnm ",cost);

        return (
          <div key={ship.id} className="ship__card__wrapper">
            <div className="ship__card">
              <div className="ship__card__left">
                <img src={`/img/ship/${ship.name}.png`} alt="Корабль" />
              </div>
              <div className="ship__card__right">
                <div className="ship__card__info">
                  <div className="ship__card__info_row">
                    <span>{t("level")}</span>
                    <span>
                      {isMaxLevel ? `${level}` : `${level} → `}
                      <strong>{!isMaxLevel && level + 1}</strong>
                    </span>
                  </div>
                  <div className="ship__card__info_row">
  <span>{t("numatt")}</span>
  <span>
    {isMaxLevel ? `${damage}` : `${damage} → `}
    <strong>{!isMaxLevel && Math.round(damage * coef)}</strong>
  </span>
</div>
<div className="ship__card__info_row">
  <span>{t("uron")}</span>
  <span>
    {isMaxLevel ? `${power}` : `${power} → `}
    <strong>{!isMaxLevel && Math.round(power * coef)}</strong>
  </span>
</div>
<div className="ship__card__info_row">
  <span>{t("tonnage")}</span>
  <span>
    {isMaxLevel ? `${tonnage}` : `${tonnage} → `}
    <strong>{!isMaxLevel && Math.round(tonnage * coef)}</strong>
  </span>
</div>


                  {isMaxLevel ? (
                    <div className="ship__card__info_row cost global-yellow">
                      Корабль достиг максимального уровня
                    </div>
                  ) : (
                    <div className="ship__card__info_row cost">
                      <span>{t("cost")}</span>
                      <span>{cost} монет</span>
                    </div>
                  )}
                </div>

                {!isMaxLevel && (

                  <div>
  
       {!isMaxLevel && (
         <button
         className="ship__card__button add"
         onClick={(e) => {
           e.preventDefault();
           setSelectedShip(ship);
           setShowAddPopup(true);
         }}
       >
         {t("upgrade")}
       </button>
      
      
      )}
    </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </>
  )}
</div>
      
            {/* Модалка */}
            {modalVisible && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <p className="shiptext">{successMessage || errorMessage}</p>
                  <button onClick={closeModal}>Закрыть</button>
                </div>
              </div>
            )}
          </div>
        
      
       
          {showAddPopup && (
  <AddPopap
    userId={window.user.id}
    planetId={1}
    isOpen={showAddPopup}
    setShowPopup={setShowAddPopup}
    onClick={() => {}}
    ship={selectedShip}
    cost={selectedShip?.cost}
    mode="add" // Можно использовать этот проп, если хочешь отличать поведение попапа
  
  
  />
)} 
<style jsx>{`
                .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background-image: url("/images/popup-background.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    width: 90%;
    
  background-color: transparent;


    max-width: 400px;
    height: 250px;
    padding: 30px;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    position: relative;
  }

  .shiptext {
    color: white;
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 20px;
    max-width: 80%;
  }

  .modal-content button {
    padding: 10px 20px;
    background: #f8c335;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
  }

  .modal-content button:hover {
    background: #ffd966;
  }

  .market-section {
  margin-top: 40px;
  text-align: center;
  background: #1d1d1d;
  border-radius: 20px;
  padding: 16px;
}

.market-section__text {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 15px;
  color: #fff;
}

.market-section__button {
  display: inline-block;
  padding: 10px 20px;
  background: #d09b0d;
  border: none;
  border-radius: 10px;
  color: white;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
  text-decoration: none; /* убирает подчёркивание */
}

.market-section__button:hover {
  background: #f8c335;
}



            `}</style>
            
 </>
    );
}








import { useEffect, useState } from 'react';
import PopupFutureUpgrade from './PopupFutureUpgrade';
import styles from './Popup.module.scss';
import { ColorRing } from 'react-loader-spinner';
import { t } from "i18next";

type InitValue = { cost: number; level: number; speed: number };

export default function UpgradePlanet({
  setShowPopup,
  onSuccess,
  isOpen,
  planetId,
  userId, 
  user

}: {
  setShowPopup: (status: boolean) => void;
  onSuccess: () => void;
  isOpen: boolean;
  planetId: number;
  userId: number;
  user: {
    coins: number;
    // можешь добавить другие поля, если используешь (например, id, name и т.п.)
  };

}) {
  const [state, setState] = useState<InitValue>({
    cost: 0,
    level: 0,
    speed: 0,
  });

  const [upgradeResult, setUpgradeResult] = useState<{
    newLevel: number;
    newSpeed: number;
    newCost: number;
  } | null>(null);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showErrorModal, setShowErrorModal] = useState(false);
    

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setLoading(true);
  
      const fetchPlanetLevel = async () => {
        try {
          const response = await fetch(`https://playmost.ru/api2/planet/${planetId}/level`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: userId })
          });
  
          if (!response.ok) {
            throw new Error('Не удалось получить данные о планете');
          }
  
          const data = await response.json();
          setState({
            cost: data.cost,
            level: data.level,
            speed: parseFloat(data.speed.toFixed(4)),
          });



          console.log("Получаемая цена ", data.cost)
        } catch (error) {
          console.error("Ошибка при получении данных о планете", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchPlanetLevel();
    }
  
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, planetId, userId]);
  

  const handleUpgradeed = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://playmost.ru/api2/planet/${planetId}/upgrade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          cost: state.cost,
        }),
      });

      if (response.status === 400) {
        alert("Недостаточно средств");
        setShowPopup(false);
        return;
      }
  
      if (!response.ok) {
        throw new Error('Не удалось улучшить базу');
      }
  
      const data = await response.json();
  
      setState({
        cost: data.new_cost,
        level: data.new_level,
        speed: data.new_speed,
      });

      console.log("NewCost",data.new_cost);
      console.log("NewCSpeed",data.new_speed);
  
      setUpgradeResult({
        newLevel: data.new_level,
        newSpeed: data.new_speed,
        newCost: data.new_cost,
      });
  
      setShowSuccessModal(true);
    } catch (error) {
      setErrorMessage("Произошла ошибка при покупке. Попробуйте позже.");
      setShowErrorModal(true);
      console.error("Ошибка при улучшении базы", error);
    } finally {
      setLoading(false);
    }
  };
  

  
  

  const { cost, level, speed } = state;

  return (
    isOpen  && (
      <>
        <PopupFutureUpgrade
          setShowPopup={setShowPopup}
          onUpgrade={handleUpgradeed}
          isOpen={isOpen}
          title={t("upgradebase")} 
          img="/icons/upg_base.png"
          cost={cost}
          type="upgrade"
          planetId={planetId}
          userId={userId}
          setShowSuccessModal={setShowSuccessModal} 
          loading={loading} // Передаем сюда
        >

          {!loading && (
            <div className={styles.upgrade__planet__wrapper}>
              <div className={styles.info__right_item}>
                <span className={styles.info__right_item_text}>{t("level")}</span>
                <div>
                  <span>{level}</span>
                  <span className="global-green">
                    {' -> '}
                    {+level + 1}
                  </span>
                </div>
              </div>
              <div className={styles.info__right_item}>
                <span className={styles.info__right_item_text}>{t("speeddob")}</span>
                <div>
  <span>
    {level === 0
      ? 0
      : Number(level) === 1
      ? (speed ?? 0) / 2
      : (speed ?? 0).toFixed(5)}
  </span>
  <span className="global-green">
    {' -> '}
    {level === 0
  ? 0.1
  : Number(level) === 1
  ? Number(0.5).toFixed(5).replace(/\.?0+$/, '')
  : Number((speed ?? 0) * 1.8).toFixed(5).replace(/\.?0+$/, '')
}

  </span>
</div>


              </div>
            </div>
          )}
{showErrorModal && (
                <div className={styles.content__modal}>
                    <div className={styles.wrapper}>
                        <div className={styles.wrapper_bg}></div>
                        <div className={styles.content}>
                            <div className={styles.top}>
                                <span>{t("error")}</span>
                                <button className={styles.close_button} onClick={() => setShowErrorModal(false)}>
                                    ✕
                                </button>
                            </div>
                            <p style={{ color: 'white', textAlign: 'center', fontWeight: 500, fontSize: '16px' }}>
                                {errorMessage}
                            </p>
                        </div>
                    </div>
                </div>
            )}


             {showSuccessModal && (
  <div className={styles.content__modal}>
    <div className={styles.wrapper}>
      <div className={styles.wrapper_bg}></div>
      <div className={styles.content}>
        <div className={styles.top}>
          <span>{t("success")}</span>
          <button className={styles.close_button} onClick={() => setShowSuccessModal(false)}>✕</button>
        </div>
        <p style={{ color: 'white', textAlign: 'center', fontWeight: 500, fontSize: '16px' }}>{t("baseup")}</p>
        <div style={{ textAlign: 'center' }}>
        <button 
  className={styles.ok_button} 
  onClick={() => {
    setShowSuccessModal(false);
    if (upgradeResult) {
      onSuccess(upgradeResult); // ✅ теперь данные передаются
    }
  }}
>
  Окей
</button>



        </div>
      </div>
    </div>
  </div>
)}
        </PopupFutureUpgrade>

        {/* Модальное окно успешного обновления */}
     

      </>
    )
  );
}

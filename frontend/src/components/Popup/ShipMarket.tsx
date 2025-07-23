import PopupFuture from './PopupFuture';
import styles from "./Popup.module.scss";
import { useEffect, useState } from 'react';
import { useUserStore } from '../../store/userStore';
import { t } from "i18next";

export default function ShipMarket({
    setShowPopup,
    userId,
    planetId,
    isOpen,
    onClick,
    ship,
}: {
    setShowPopup: (status: boolean) => void;
    userId: number | undefined;
    planetId: number | undefined;
    isOpen: boolean;
    onClick: (is: boolean, id: number) => void;
    ship: any; // Лучше типизировать явно
}) {
    const setUser = useUserStore().setUser;
    // console.log("Ncdsc22");
    // console.log("Name", ship?.name);

    const [cosmoports, setCosmoports] = useState<any>();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [upgradingShipIds, setUpgradingShipIds] = useState<number[]>([]);

    const handleUpgradeShip = async (ship: any) => {
        
        const upgradeCost = ship?.cost;
        setUpgradingShipIds(prev => [...prev, ship.id]);

        if (window.user.coins < upgradeCost) {
            setErrorMessage("Недостаточно монет для покупки.");
            setShowErrorModal(true);
            return;
        }

        try {
            const response = await fetch(`https://playmost.ru/api2/user_spaceships/${ship.id}/update?cost=${upgradeCost}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    level: ship.level + 1,
                    type: "corable"
                })
            });

            const data = await response.json();
            if (data.success) {
                setSuccessMessage(t("corup"));
            } else {
                setErrorMessage(t("error"));
            }
        } catch (err) {
            console.error("Ошибка улучшения:", err);
            setErrorMessage(t("error"));
        } finally {
            setUpgradingShipIds(prev => prev.filter(id => id !== ship.id));
            setShowSuccessModal(true);
        }
    };

    const level = ship?.level ?? 0;
    const damage = ship?.shot ?? 0;
    const amount = ship?.power ?? 0;
    const tonnage = ship?.tonnage ?? 0;
    const cost = ship?.cost;

    return (
        <PopupFuture
        img={`/img/ship/${ship?.name}.png`}

            cost={cost}
            type={cosmoports?.id ? "upgrade" : "buy"}
            isOpen={isOpen}
            onBuy={() => handleUpgradeShip(ship)}
            onUpgrade={() => handleUpgradeShip(ship)}
            setShowPopup={setShowPopup}
            title={t("shipmarketrynok")}
            loading={loading}
        >
            {!loading && ship && (
                <div className={styles.upgrade__planet__wrapper}>
                    <div className={styles.info__right_item}>
                        <span className={styles.info__right_item_text}>{t("level")}</span>
                        <div>
                            <span>{level}</span>
                            <span className="global-green"> → {level + 1}</span>
                        </div>
                    </div>

                    {!cosmoports?.id && (
                        <div className={styles.info__right_item}>
                            <span className={styles.info__right_item_text}>{t("uron")}</span>
                            <div>
                                <span>{damage}</span>
                                <span className="global-green"> → {Math.round(damage * 1.8)}</span>
                            </div>
                        </div>
                    )}

                    <div className={styles.info__right_item}>
                        <span className={styles.info__right_item_text}>{t("numatt")}</span>
                        <div>
                            <span>{amount}</span>
                            <span className="global-green"> → {amount * 1.8}</span>
                        </div>
                    </div>

                    <div className={styles.info__right_item}>
                        <span className={styles.info__right_item_text}>{t("tonnage")}</span>
                        <div>
                            <span>{tonnage}</span>
                            <span className="global-green"> → {Math.round(tonnage * 1.8)}</span>
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
                                <button className={styles.close_button} onClick={() => setShowErrorModal(false)}>✕</button>
                            </div>
                            <p className={styles.message}>{errorMessage}</p>
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
                            <p className={styles.message}>{successMessage}</p>
                            <div className={styles.actions}>
                                <button 
                                    className={styles.ok_button} 
                                    onClick={() => {
                                        setShowPopup(false);
                                        // window.location.reload();
                                    }}
                                >
                                    {t("okay")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </PopupFuture>
    );
}

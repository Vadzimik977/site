import { useEffect } from 'react';
import Popup from './Popup';
import styles from './Popup.module.scss';
import { createPortal } from 'react-dom';
import { ColorRing } from 'react-loader-spinner';
import { t } from "i18next";

export default function PopupFuture({
    setShowPopup,
    onBuy,
    onUpgrade,
    isOpen,
    title,
    img,
    cost,
    type,
    children,
    stars,
    loading = false,
}: {
    setShowPopup: (status: boolean) => void;
    onBuy: () => void;
    onUpgrade: () => void;
    isOpen: boolean;
    title: string;
    img: string;
    cost: number;
    type: 'buy' | 'upgrade',
    children: any,
    stars?: boolean,
    loading?: boolean,
}) {
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    }, [isOpen]);

    const handleClick = () => {
        if (type === 'buy') {
            onBuy();
        } else {
            onUpgrade();
        }
    };

    return (
        isOpen &&
        createPortal(
            <Popup title={title} setPopupStatus={setShowPopup}>
                <div className={styles.popupFutureWrapper}>
                    {/* Оверлей загрузки */}
                    {loading && (
                        <div className={styles.loadingOverlay}>
                            <ColorRing
                                visible={true}
                                height={100}
                                width={100}
                                colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
                            />
                        </div>
                    )}

                    <div className={styles.upgrade__planet}>
                        <div className={styles.upgrade__planet__item_left}>
                            <img src={img} alt="" />
                        </div>
                        <div className={styles.upgrade__planet__item_right}>
                            <div className={styles.info__right}>
                                <div className={styles.info__right_item}>
                                    {children}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.modal__buttons}>
                        <div className={styles.modal__buttons_price}>
                            {t("cost")}
                            <img src="/icons/price.svg" alt="" />
                            <span className={styles.modal__buttons_price_item}>
                                {cost} {stars ? 'Stars' : 'GC'}
                            </span>
                        </div>
                        <button
                            onClick={handleClick}
                            className={styles.modal__buttons_button}
                            disabled={loading}
                        >
                            {type === 'buy' ? t("upgrade") : t("upgrade")}
                        </button>
                    </div>
                </div>
            </Popup>,
            document.body,
        )
    );
}

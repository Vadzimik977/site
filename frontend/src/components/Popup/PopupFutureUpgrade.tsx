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
    planetId,
    userId,
    setShowSuccessModal,
    loading = false, // Добавим этот пропс
}: {
    setShowPopup: (status: boolean) => void;
    onBuy: () => void;
    onUpgrade: () => void;
    isOpen: boolean;
    title: string;
    img: string;
    cost: number;
    type: 'buy' | 'upgrade';
    children: any;
    stars?: boolean;
    planetId: number;
    userId: number;
    setShowSuccessModal: (show: boolean) => void;
    loading?: boolean,  // Тип пропса
}) {
    const handleClick = async () => {
        try {
            if (type === 'buy') {
                console.log('Попытка купить');
                await onBuy(); // Выполняем покупку
                console.log('Покупка завершена успешно');
            } else if (type === 'upgrade') {
                console.log('Попытка улучшить');
                await onUpgrade(); // Выполняем улучшение
                console.log('Улучшение завершено успешно');
                
                // Показываем модалку успеха
                // setShowSuccessModal(true);
            }
            // setShowPopup(false); // Закрываем попап после завершения действия
        } catch (error) {
            console.error('Ошибка при обработке действия:', error);
            alert('Произошла ошибка при обработке действия.');
        }
    };

    return (
        isOpen &&
        createPortal(
            <Popup title={title} setPopupStatus={setShowPopup}>
                 <div className={styles.popupFutureWrapper}>

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
                    <button onClick={handleClick} className={styles.modal__buttons_button}>
                      {type === 'buy' ? t("upgrade") : t("upgrade")}
                    </button>
                </div>
                </div>
            </Popup>,
            document.body,
        )
    );
}

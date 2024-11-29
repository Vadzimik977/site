import { useEffect } from 'react';
import { IPlanet, IUserPlanet } from '../../types/planets.type';
import Popup from './Popup';
import styles from './Popup.module.scss';
import { createPortal } from 'react-dom';

export default function UpgradePlanet({
    setShowPopup,
    onSuccess,
    isOpen,
}: {
    setShowPopup: (status: boolean) => void;
    onSuccess: () => void;
    isOpen: boolean;
}) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isOpen]);
    return (
        isOpen &&
        createPortal(
            <Popup
                title="Улучшить базу"
                setPopupStatus={setShowPopup}>
                <div className={styles.upgrade__planet}>
                    <div className={styles.upgrade__planet__item_left}>
                        <img src="/modals/mobile/upg_base.png" alt="" />
                    </div>
                    <div className={styles.upgrade__planet__item_right}>
                        <img src="/modals/mobile/info.svg" alt="" />
                        <div className={styles.info__right}>
                            <div className={styles.info__right_item}>
                                <span>Уровень</span>
                                <div>
                                    <span>1</span>
                                    <span className='global-green'>{` -> `}2</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.modal__buttons}>
                    <div className={styles.modal__buttons_price}>
                        Цена
                        <img src="/modals/mobile/price.svg" alt="" />
                        <span className={styles.modal__buttons_price_item}>3 GC</span>
                    </div>
                    <button className={styles.modal__buttons_button}>Купить</button>
                </div>
            </Popup>,
            document.body,
        )
    );
}

import { useEffect } from 'react';
import Popup from './Popup';
import styles from './Popup.module.scss';
import { createPortal } from 'react-dom';

export default function PopupFuture({
    setShowPopup,
    onSuccess,
    isOpen,
    title,
    img,
    cost,
    type,
    children,
    stars
}: {
    setShowPopup: (status: boolean) => void;
    onSuccess: () => void;
    isOpen: boolean;
    title: string;
    img: string;
    cost: number;
    type: 'buy' | 'upgrade',
    children: any,
    stars?: boolean
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
                title={title}
                setPopupStatus={setShowPopup}>
                <div className={styles.upgrade__planet}>
                    <div className={styles.upgrade__planet__item_left}>
                        <img src={img} alt="" />
                    </div>
                    <div className={styles.upgrade__planet__item_right}>
                        <img src="/modals/mobile/info.svg" alt="" />
                        <div className={styles.info__right}>
                            <div className={styles.info__right_item}>
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.modal__buttons}>
                    <div className={styles.modal__buttons_price}>
                        Цена
                        <img src="/modals/mobile/price.svg" alt="" />
                        <span className={styles.modal__buttons_price_item}>{cost} {stars ? 'Stars' : 'GC'}</span>
                    </div>
                    <button onClick={() => {onSuccess(); setShowPopup(false)} } className={styles.modal__buttons_button}>
                        {type === 'buy' ? 'Купить' : 'Обновить'}
                    </button>
                </div>
            </Popup>,
            document.body,
        )
    );
}

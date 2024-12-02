import { useEffect, useState } from 'react';
import Popup from './Popup';
import styles from './Popup.module.scss';
import { createPortal } from 'react-dom';
import PopupFuture from './PopupFuture';

export default function UpgradePlanet({
    setShowPopup,
    onSuccess,
    isOpen,
    getInitValue,
}: {
    setShowPopup: (status: boolean) => void;
    onSuccess: () => void;
    isOpen: boolean;
    getInitValue: () => { cost: number; level: number; speed: number };
}) {
    const [{ cost, level, speed }, setState] = useState(getInitValue());
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setState(() => getInitValue());
        } else {
            document.body.style.overflow = 'auto';
            setShowPopup(false);
        }
    }, [isOpen]);

    return (
        isOpen && (
            <PopupFuture
                setShowPopup={setShowPopup}
                onSuccess={() => {setShowPopup(false);onSuccess();}}
                isOpen={isOpen}
                title={'Улучшить базу'}
                img="/modals/mobile/upg_base.png"
                cost={cost}
                type="upgrade">
                <div className={styles.upgrade__planet__wrapper}>
                    <div className={styles.info__right_item}>
                        <span className={styles.info__right_item_text}>Уровень</span>
                        <div>
                            <span>{level}</span>
                            <span className="global-green">
                                {` -> `}
                                {+level + 1}
                            </span>
                        </div>
                    </div>
                    <div className={styles.info__right_item}>
                        <span className={styles.info__right_item_text}>Скорость добычи</span>
                        <div>
                            <span>{level == 0 ? 0 : speed / 2}</span>
                            <span className="global-green">
                                {` -> `}
                                {level == 0 ? 0.1 : speed}
                            </span>
                        </div>
                    </div>
                </div>
            </PopupFuture>
        )
    );
}

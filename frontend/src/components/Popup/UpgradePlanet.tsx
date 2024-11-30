import { useEffect, useState } from 'react';
import Popup from './Popup';
import styles from './Popup.module.scss';
import { createPortal } from 'react-dom';
import PopupFuture from './PopupFuture';

export default function UpgradePlanet({
    setShowPopup,
    onSuccess,
    isOpen,
    getInitValue
}: {
    setShowPopup: (status: boolean) => void;
    onSuccess: () => void;
    isOpen: boolean;
    getInitValue: () => {cost: number, level: number}
}) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isOpen]);

    const [{cost, level}] = useState(getInitValue());
    return (
        isOpen && cost && level && <PopupFuture setShowPopup={setShowPopup} onSuccess={onSuccess} isOpen={isOpen} title={"title"} img='/' cost={cost} type="upgrade">
            <div className={styles.info__right_item}>
                <span>Уровень</span>
                <div>
                    <span>{level}</span>
                    <span className="global-green">{` -> `}{+level + 1}</span>
                </div>
            </div>
        </PopupFuture>
    );
}

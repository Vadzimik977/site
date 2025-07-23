// src/components/Popup/AttackCooldownPopup.tsx
import { createPortal } from "react-dom";
import styles from "./Popup.module.scss";

const AttackCooldownPopup = ({ onClose }: { onClose: () => void }) => {
  return createPortal(
    <div className={styles.attack_modal}>
      <div className={styles.attack_modal_content}>
        <p className={styles.attack_cooldown_text}>
          🚫 Вы уже атаковали эту планету за последний час. Попробуйте позже!
        </p>
        <button className={styles.collect_button} onClick={onClose}>
          Ок
        </button>
      </div>
    </div>,
    document.body
  );
};

export default AttackCooldownPopup;

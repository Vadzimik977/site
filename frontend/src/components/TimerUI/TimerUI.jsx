import styles from "./TimerUI.module.css";

const TimerUI = () => {
  return (
    <div className={styles.timerWrapper}>
      <div className={styles["timer-wrapper__counter"]}>18:45:12</div>
      {/* <div className={styles["timer-wrapper__text"]}>
        <span>{t('hour')}</span>
        <span>{t('min')}</span>
        <span>{t('sec')}</span>
      </div> */}
    </div>
  );
};
export default TimerUI;

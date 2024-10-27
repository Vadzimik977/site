import { IPlanet } from "../../types/planets.type";
import TimerUI from "../TimerUI/TimerUI";
import styles from "./PlanetMain.module.css";

const PlanetMain = ({ planet }: { planet: IPlanet }) => {
  return (
    <div className={styles.planetWrapper}>
      <div className={styles.planet_left}>
        <h4>
          {planet.element.name}({planet.element.symbol}) - Planet #
          {planet.element.index}
        </h4>
        <span className={styles.planetDescription}>
          Добываемый ресурс{" "}
          <span>
            {planet.element.name} ({planet.element.symbol})
          </span>
        </span>
        <div className={styles.owner}>
          <div>
            <img src="/icons/astronaut_helmet.png" width={32} height={32} />
            <span>Владелец</span>
          </div>
          <button>Список планет</button>
        </div>
        <div className={styles.health}>
          <img src="/icons/heart.png" width={20} height={18} />
          <div className={styles["progress-wrapper"]}>
            <div className={styles["progress"]}></div>
          </div>
        </div>
        <div className={styles["planetInfo"]}>
          <div className={styles["planetInfo__row"]}>
            <span className={styles["planetInfo__title"]}>Уровень</span>
            <span className={styles["planetInfo__description"]}>1</span>
          </div>

          <div className={styles["planetInfo__row"]}>
            <span className={styles["planetInfo__title"]}>Скорость</span>
            <span className={styles["planetInfo__description"]}>
              {planet.speed} ({planet.element.symbol})/час
            </span>
          </div>

          <div className={styles["planetInfo__row"]}>
            <span className={styles["planetInfo__title"]}>Всего ресурсов</span>
            <span className={styles["planetInfo__description"]}>1.000.000</span>
          </div>

          <div className={styles["planetInfo__row"]}>
            <span className={styles["planetInfo__title"]}>Добыто ресурсов</span>
            <span className={styles["planetInfo__description"]}>1.000</span>
          </div>
        </div>
        <div className={styles.actions}>
          <button className={styles["action-btn"]}>
            Атака
            <img src="/icons/sword.png" width={20} height={20} />
          </button>
          <button className={styles["action-btn"]}>
            Аренда
            <img src="/icons/time.png" width={20} height={20} />
          </button>
        </div>
      </div>
      <div className={styles.planet_right}>
        <div className={styles.planet_preview}>
          <img
            src={`/img/planet/${planet.img}`}
            className={styles.planet_preview__planet}
          />
          <img
            src={`/img/ship/type_1.png`}
            width={104}
            height={52}
            className={styles.planet_preview__ship}
          />
          <div className={styles.planet_preview__icon}>
            <img src="/icons/pickaxe.png" width={24} height={24} />
          </div>
        </div>
        <div className={styles.planet_user_farm}>
          0.000 {planet.element.symbol}
        </div>
        <div className={styles.alliance}>
          <img src="/icons/alliance.png" width={56} height={56} />
          <img
            src="/icons/plus.png"
            width={20}
            height={20}
            className={styles.alliance_plus}
          />
        </div>
        <div className={styles.timer}>
          <TimerUI />
        </div>
      </div>
    </div>
  );
};
export default PlanetMain;

import { IPlanet, IUserPlanet } from "../../types/planets.type";
import Popup from "./Popup";
import styles from "./Popup.module.scss";

const UserPlanetsPopup = ({
  planets,
  setShowPopup,
  planet,
}: {
  planets: IUserPlanet[];
  setShowPopup: (status: boolean) => void;
  planet: IPlanet;
}) => {
  console.log("planets: ", planets);

  return (
    <Popup title="Планеты в этой системе" setPopupStatus={setShowPopup}>
      <div className={styles.planet_list}>
        {planets &&
          planets.map((userPlanet) => {
            return (
              <div
                key={`${userPlanet.userId}.${userPlanet.id}`}
                className={styles.planet_item}
              >
                <img
                  src={`/img/planet/${planet.img}`}
                  className={styles.planet_preview__planet}
                />
                <div className={styles.planet_preview__name}>
                  <div className={styles.planet_preview__info}>
                    {planet.element.name}({planet.element.symbol}) - Planet #
                    {planet.element.index}
                  </div>
                  <span className={styles.planet_preview__owner}>
                    <img
                      src="/icons/astronaut_helmet-white.png"
                      alt=""
                      width={24}
                    />
                    <span>id {userPlanet.userId}</span>
                  </span>
                </div>
              </div>
            );
          })}
      </div>
    </Popup>
  );
};
export default UserPlanetsPopup;

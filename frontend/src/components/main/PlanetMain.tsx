import classNames from "classnames";
import { t } from "i18next";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import showPopup from "../../assets/js/showPopup";
import { useUserStore } from "../../store/userStore";
import { IPlanet, IUserPlanet } from "../../types/planets.type";
import { IWallet, IWalletElement } from "../../types/user.type";
import {
  addPlanetToUser,
  addToAlliance,
  getAllUserPlanetsById,
  updateUser,
  updateUserPlanet,
  updateWalletElement,
} from "../../utils/axios";
import UserPlanetsPopup from "../Popup/UserPlanetsPopup";
import Timer from "../Timer";
import styles from "./PlanetMain.module.css";

// enum POPUP_STATUS {
//   UPGRADE = "upgrade",
//   WALLET = "wallet",
//   UPDATE_ERROR = "updateError",
//   BALANCE = "balance",
//   SUCCESS = "success",
// }

type POPUP_STATUS =
  | "upgrade"
  | "wallet"
  | "updateError"
  | "balance"
  | "success";

const PlanetMain = ({
  planet,
  wallet,
}: {
  planet: IPlanet;
  wallet: IWallet;
}) => {
  const { user, nft, setWallet, setUser, alliance, setAlliance } =
    useUserStore();

  const [elementValue, setElementValue] = useState(0);

  const [click, setClick] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowPopup, setShowPopup] = useState(false);
  const [userPlanets, setUserPlanets] = useState<IUserPlanet[]>([]);

  const showModal = (event: any, status: POPUP_STATUS) => {
    const planetElement = event.target.closest(".planets__planet");
    let content;
    if (status === "upgrade") {
      content = `<div class="planet__popup-title">${t(
        "planetUpg"
      )}</div><div class="planet__popup-text">${t("speedIncrease")}</div>`;
    } else if (status === "wallet") {
      content = `<div class="planet__popup-title">${t(
        "modalError"
      )}</div><div class="planet__popup-text">${t("connectWallet")}</div>`;
    } else if (status === "updateError") {
      content = `<div class="planet__popup-title">${t(
        "modalError"
      )}</div><div class="planet__popup-text">${t("updateError")}</div>`;
    } else if (status === "balance") {
      content = `<div class="planet__popup-title">${t(
        "modalError"
      )}</div><div class="wallet__popup-text">${t("notEnoughtMoney")}</div>`;
    }

    content = '<div class="popup__inner">' + content + "</div>";

    showPopup(planetElement, content, ["planet__popup"]);
  };

  const getInitState = () => {
    const elemntWallet = wallet.value.find(
      (item) => item.symbol === planet.element.symbol
    );
    setElementValue(elemntWallet?.value || 0);
  };

  const updateFn = debounce(async (val: number) => {
    console.log(isLoading, val);

    // if (isLoading) {
    //   setTimeout(() => {
    //     updateFn(val);
    //   }, 200);

    //   return;
    // }

    if (!wallet) {
      return;
    }

    const balance = wallet.value;
    const currentElem = wallet.value.find(
      (item) => item.symbol === planet.element.symbol
    );

    if (currentElem) {
      setIsLoading(true);

      currentElem.value = parseFloat((currentElem.value + val).toFixed(10));

      const data = [
        ...balance.filter((bal) => bal.symbol !== planet.element?.symbol),
        { ...currentElem },
      ];

      setElementValue(currentElem.value);
      await putWallet(wallet, data);

      setIsLoading(false);
    } else {
      let data: IWalletElement[];
      if (wallet.value?.length > 0) {
        data = [
          ...wallet.value,
          {
            element: String(planet.element.id),
            value: val,
            name: planet.element.name,
            img: planet.element.img,
            symbol: planet.element.symbol,
            rare: planet.element.rare,
          },
        ];
      } else {
        data = [
          {
            element: String(planet.element.id),
            value: val,
            name: planet.element.name,
            img: planet.element.img,
            symbol: planet.element.symbol,
            rare: planet.element.rare,
          },
        ];
      }
      setElementValue(val);

      const newWallet = await putWallet(wallet, data);
      setWallet(newWallet);
      // window.user.wallet.value = data;
    }
  }, 50);

  const debounceFn = useCallback(
    (click: number) => {
      updateFn(click);
    },
    [wallet, planet]
  );

  const putWallet = async (wallet: IWallet, value: IWalletElement[]) => {
    return await updateWalletElement(wallet, value);
  };

  const walletUpdate = async (e: any) => {
    if (e.target.tagName.toLowerCase() === "button") return;

    const plusIcon = document.createElement("div");
    plusIcon.textContent = "+";
    plusIcon.classList.add("plus-icon");
    plusIcon.style.left = `${e.pageX}px`;
    plusIcon.style.top = `${e.pageY}px`;

    document.body.appendChild(plusIcon);
    plusIcon.addEventListener("animationend", () => plusIcon.remove());

    setClick(click + 1);
    if (!wallet && click >= 4) {
      showModal(e, "wallet");
    }

    console.log("here 2");
    if (userHasPlanet() && user) {
      const userPlanet = planet.user_planets.find(
        (item) => item.userId === user.id
      );
      if (!userPlanet) return;

      const level = userPlanet.level;

      let update = 0.00005;
      if (Number(level) == 1) update = 0.05;
      if (Number(level) == 2) update = 0.5;
      if (Number(level) == 3) update = 1;
      if (Number(level) == 4) update = 1.5;

      console.log("here 3");
      debounceFn(update);
    } else {
      debounceFn(0.00005);
      console.log("here 4");
    }
    // debounceFn(0.00005);
  };

  useEffect(() => {
    getInitState();
  }, [isLoading, wallet, planet]);

  const userHasPlanet = () => {
    if (!user) return false;

    if (planet?.user_planets) {
      const plData = planet.user_planets;

      const idx = plData?.find(
        (item) => item?.planetId === planet.id && item?.userId === user.id
      );

      if (idx?.id) {
        return true;
      }
    }
    if (user?.userPlanets?.length > 0) {
      const planets = user.userPlanets;
      if (planets.some((item) => item.planetId === planet.id)) {
        // const planet = planets.find((item) => item.planetId === planet?.id);
        // setUserPlanet(planet);
        return true;
      }
    }
    if (nft) {
      const fullName = `${planet.name}(${planet.element?.symbol}) - Planet #${planet.id}`;
      const item = nft?.find((item) => item.metadata.name === fullName);
      if (item && user.userPlanets.length > 0) {
        const planets = user.userPlanets;
        // const planet = planets.find((item) => item.planetId === planet.id);

        // if (!planet?.id) {
        //   // addPlanetToUser(id);
        // }
      }
      return item;
    }
    return false;
  };

  const updatePlanetSpeed = async (e: any) => {
    if (!user || isLoading) return;

    if (user.coins >= 3) {
      const userPlanet = planet.user_planets.find(
        (item) => item.userId === user.id
      );

      setIsLoading(true);

      if (!userPlanet) {
        const addedPlanet = await addPlanetToUser(planet.id);
      } else {
        if (+userPlanet.level >= 4) {
          showModal(e, "updateError");
          return;
        }

        await updateUserPlanet(userPlanet.id, +userPlanet.level + 1);
      }

      const newUser = await updateUser({ coins: user.coins - 3 });
      setUser(newUser);
      showModal(e, "upgrade");

      setIsLoading(false);
      // await update();
    } else {
      showModal(e, "balance");
      setIsLoading(false);
    }
  };

  const getUsersPlanet = async () => {
    const result = await getAllUserPlanetsById(planet.id);

    console.log(result);

    setUserPlanets(result);
    setShowPopup(true);
    console.log(result);
  };

  const onClickAllinace = async () => {
    const result = await addToAlliance(planet.id);

    setAlliance(result);
  };

  return (
    <div
      className={classNames("planets__planet")}
      onClick={walletUpdate}
      // ref={animated}
    >
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
            <button onClick={getUsersPlanet}>Список планет</button>
          </div>
          {isShowPopup && userPlanets && (
            <UserPlanetsPopup
              planets={userPlanets}
              setShowPopup={setShowPopup}
              planet={planet}
            />
          )}
          <div className={styles.health}>
            <img src="/icons/heart.png" width={20} height={18} />
            <div className={styles["progress-wrapper"]}>
              <div className={styles["progress"]}></div>
            </div>
          </div>
          <div className={styles["planetInfo"]}>
            <div className={styles["planetInfo__row"]}>
              <span className={styles["planetInfo__title"]}>Уровень</span>
              <span className={styles["planetInfo__description"]}>
                {planet.user_planets.find((item) => item.userId === user?.id)
                  ?.level || 0}
              </span>
            </div>

            <div className={styles["planetInfo__row"]}>
              <span className={styles["planetInfo__title"]}>Скорость</span>
              <span className={styles["planetInfo__description"]}>
                {planet.speed} ({planet.element.symbol})/час
              </span>
            </div>

            <div className={styles["planetInfo__row"]}>
              <span className={styles["planetInfo__title"]}>
                Всего ресурсов
              </span>
              <span className={styles["planetInfo__description"]}>
                1.000.000
              </span>
            </div>

            <div className={styles["planetInfo__row"]}>
              <span className={styles["planetInfo__title"]}>
                Добыто ресурсов
              </span>
              <span className={styles["planetInfo__description"]}>1.000</span>
            </div>
          </div>
          <div className={styles.actions}>
            <button className={styles["action-btn"]}>
              Атака
              <img src="/icons/sword.png" width={20} height={20} />
            </button>

            {(planet.user_planets.find((item) => item.userId === user?.id)
              ?.level || 0) == 0 && (
              <button
                className={styles["action-btn"]}
                onClick={updatePlanetSpeed}
              >
                Аренда
                <img src="/icons/time.png" width={20} height={20} />
              </button>
            )}
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
            {elementValue.toFixed(4)} {planet.element.symbol}
          </div>

          {!alliance && (
            <button className={styles.alliance} onClick={onClickAllinace}>
              <img src="/icons/alliance.png" width={56} height={56} />
              <img
                src="/icons/plus.png"
                width={20}
                height={20}
                className={styles.alliance_plus}
              />
            </button>
          )}

          {alliance?.find((item) => item.planetId == planet.id)?.planetId !==
            planet.id && (
            <button className={styles.alliance} onClick={onClickAllinace}>
              <img src="/icons/alliance.png" width={56} height={56} />
              <img
                src="/icons/plus.png"
                width={20}
                height={20}
                className={styles.alliance_plus}
              />
            </button>
          )}

          {planet.forLaboratory && (
            <div className="planet__time-timer">
              <Timer />
            </div>
          )}
        </div>
      </div>

      {Number(
        planet.user_planets.find((item) => item.userId === user?.id)?.level || 0
      ) > 0 && (
        <div
          className={styles.planet_bottom}
          style={{
            backgroundImage: `url(/img/buildings/${
              planet.user_planets.find((item) => item.userId === user?.id)
                ?.level
            }.png)`,
          }}
        >
          <div className={styles.planet_bottom_actions}>
            <button>
              <img src="/icons/blue/sword.png" width={24} height={24} /> Атака -
              +50%
            </button>
            <button>
              <img src="/icons/blue/shield.png" width={24} height={24} /> Защита
              - +50%
            </button>
            <button>
              <img src="/icons/blue/scout.png" width={24} height={24} />
              Космопорт
            </button>
            <div className={styles.planet_bottom_actions__up}>
              <button>
                <img src="/icons/blue/building.png" width={24} height={24} />
                Постройки
              </button>
              <button className={styles.up_button} onClick={updatePlanetSpeed}>
                <img src="/icons/upgrade.png" width={24} height={24} />
              </button>
            </div>
          </div>

          {/* <div className={styles.planet_bottom_actions}>
          <button>Атака</button>
          <button>Защита</button>
        </div> */}
          <div className={styles.free_res}>
            <div className={styles.free_res__title}>Бесплатные ресурсы</div>
            <div className={styles.free_res__description}>
              Получите бесплатные ресурсы выполняя задания
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default PlanetMain;

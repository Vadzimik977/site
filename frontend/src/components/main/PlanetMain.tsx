import classNames from "classnames";
import { t } from "i18next";
import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
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
import styles from "./PlanetMain.module.scss";
import { Link } from "react-router-dom";
import UpgradePlanet from "../Popup/UpgradePlanet";
import { getInitialValue } from './index';

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
  const [lastClickTime, setLastClickTime] = useState(0);
  const lastClickTimeout = useRef<NodeJS.Timeout | null>(null);
  const isProcessing = useRef(false); // Флаг, чтобы избежать повторной обработки

  const [isLoading, setIsLoading] = useState(false);
  const [isShowPopup, setShowPopup] = useState(false);
  const [userPlanets, setUserPlanets] = useState<IUserPlanet[]>([]);
  const [isShowUpgrade, setIsShowUpgrade] = useState(false);


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

  const initVal = () => {
    return getInitialValue(planet, user, isLoading);
  }

  const showUpgradeModal = (e: any) => {
    if (!user || isLoading) return 0;
    const userPlanet = planet.user_planets.find(
      (item) => item.userId === user.id
    );
    if(!userPlanet) return 0;
    if(+userPlanet.level >= 7) {
      showModal(e, "updateError");
      setIsLoading(false);
      return;
    }
    setIsShowUpgrade(true);
  }

  const getInitState = () => {
    const elemntWallet = wallet.value.find(
      (item) => item.symbol === planet.element.symbol
    );
    setElementValue(elemntWallet?.value || 0);
  };

  const updateFn = debounce(async (val: number) => {
    if (!wallet) {
      return;
    }

    const balance = wallet.value;
    const currentElem = wallet.value.find(
      (item) => item.symbol === planet.element.symbol
    );

    if (currentElem) {
      setIsLoading(true);

      currentElem.value = parseFloat((val).toFixed(10));

      const data = [
        ...balance.filter((bal) => bal.symbol !== planet.element?.symbol),
        { ...currentElem },
      ];

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
      /* setElementValue(val); */

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

    const currentTime = Date.now();
    const clickInterval = currentTime - lastClickTime;

    setClick(click + 1);
    setLastClickTime(currentTime);

    setElementValue(elementValue + 0.00005)

    if (!wallet && click >= 4) {
      showModal(e, "wallet");
    }

    console.log(elementValue)

    if(clickInterval < 250) {
      if (lastClickTimeout.current) {
        clearTimeout(lastClickTimeout.current);
      }
      lastClickTimeout.current = setTimeout(() => {
        if(!isProcessing.current) {
          debounceFn(elementValue + 0.00005)
        }
      }, 250);
      return
    }

    isProcessing.current = true;
    debounceFn(elementValue + 0.00005);
    setTimeout(() => {
      isProcessing.current = false;
    }, 50);
    // debounceFn(0.00005);
  };

  useEffect(() => {
    getInitState();
  }, []);

  const updatePlanetSpeed = async (e: any) => {
    if (!user || isLoading) return;

    const userPlanet = planet.user_planets.find(
      (item) => item.userId === user.id
    );
    setIsLoading(true);
    if(!userPlanet) {
      const addedPlanet = await addPlanetToUser(planet.id);
      setIsLoading(false);
      return;
    }

    if(+userPlanet.level >= 7) {
      showModal(e, "updateError");
      setIsLoading(false);
      return;
    }

    const {cost} = getInitialValue(planet, user, isLoading) as {cost: number};

    if(user.coins < cost) {
      showModal(e, "balance");
    } else {
      await updateUserPlanet(userPlanet.id, +userPlanet.level + 1);
      const newUser = await updateUser({ coins: user.coins - cost });
      setUser(newUser);
      showModal(e, "upgrade");
    }

    setIsLoading(false);
  };

  const getUsersPlanet = async () => {
    const result = await getAllUserPlanetsById(planet.id);
    setUserPlanets(result);
    setShowPopup(true);
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
            {t('extractedResource')}{" "}
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
              <span className={styles["planetInfo__title"]}>{t('level')}</span>
              <span className={styles["planetInfo__description"]}>
                {planet.user_planets.find((item) => item.userId === user?.id)
                  ?.level || 0}
              </span>
            </div>

            <div className={styles["planetInfo__row"]}>
              <span className={styles["planetInfo__title"]}>{t('speed')}</span>
              <span className={styles["planetInfo__description"]}>
                {planet.speed} ({planet.element.symbol})/{t('hour')}
              </span>
            </div>

            <div className={styles["planetInfo__row"]}>
              <span className={styles["planetInfo__title"]}>
                {t('allResource')}
              </span>
              <span className={styles["planetInfo__description"]}>
                1.000.000
              </span>
            </div>

            <div className={styles["planetInfo__row"]}>
              <span className={styles["planetInfo__title"]}>
                {t('minedResource')}
              </span>
              <span className={styles["planetInfo__description"]}>1.000</span>
            </div>
          </div>
          <div className={styles.actions}>
            <button className={styles["action-btn"]}>
              {t('attack')}
              <img src="/icons/sword.png" width={20} height={20} />
            </button>

            {(planet.user_planets.find((item) => item.userId === user?.id)
              ?.level || 0) == 0 && (
              <button
                className={styles["action-btn"]}
                onClick={updatePlanetSpeed}
              >
                {t('rent')}
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
{/*             <button>
              <img src="/icons/blue/sword.png" width={24} height={24} /> Атака -
              +50%
            </button> */}
            <button>
              <img src="/icons/blue/shield.png" width={24} height={24} /> {t('defend')}
              - +50%
            </button>
            <button>
              <img src="/icons/blue/scout.png" width={24} height={24} />
              {t('spaceport')}
            </button>
            <div className={styles.planet_bottom_actions__up}>
              <button>
                <img src="/icons/blue/building.png" width={24} height={24} />
                {t('builds')}
              </button>
              <button className={styles.up_button} onClick={(e) => showUpgradeModal(e)}>
                <img src="/icons/upgrade.png" width={24} height={24} />
              </button>
            </div>
          </div>

          {/* <div className={styles.planet_bottom_actions}>
          <button>Атака</button>
          <button>Защита</button>
        </div> */}
          <Link to="/tasks">
            <div className={styles.free_res}>
              <div className={styles.free_res__title}>{t('freeResource')}</div>
              <div className={styles.free_res__description}>
                {t('freeResourceInfo')}
              </div>
            </div>
          </Link>
        </div>
      )}
      <UpgradePlanet 
        getInitValue={initVal}
        setShowPopup={setIsShowUpgrade} 
        isOpen={isShowUpgrade}
        onSuccess={() => updatePlanetSpeed(document.querySelector('.' + styles.up_button))} 
      />
    </div>
  );
};
export default PlanetMain;

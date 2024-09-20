import { debounce } from "lodash";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import {
    addPlanetToUser,
    createWalletElement,
    updateUser,
    updateUserPlanet,
    updateWalletElement,
} from "../utils/axios";
import { fetchDefaultUser } from "../assets/js/getUser";
import BorderAnimation from "../assets/js/animatedBorder";
import Timer from "./Timer";
import { useTranslation } from "react-i18next";
import showPopup from "../assets/js/showPopup";

export default function Planet({ idx, planet, update }) {
    const {
        id,
        name,
        element,
        img,
        speed,
        updatePrice,
        userPlanets,
        forLaboratory,
    } = planet;

    const [userPlanet, setUserPlanet] = useState();
    const { t } = useTranslation();

    const showModal = (event, status) => {
        const planetElement = event.target.closest(".planets__planet");
        let content;
        console.log(status)
        if (status === "upgrade") {
            content =
                `<div class="planet__popup-title">${t('planetUpg')}</div><div class="planet__popup-text">${t('speedIncrease')}</div>`;
        } 

        else if(status === 'wallet') {
            content = 
                `<div class="planet__popup-title">${t('modalError')}</div><div class="planet__popup-text">${t('connectWallet')}</div>`
        }

        else if(status === 'updateError') {
            content = 
            `<div class="planet__popup-title">${t('modalError')}</div><div class="planet__popup-text">${t('updateError')}</div>`
        }
        
        else {
            content =
                `<div class="planet__popup-title">${t('modalError')}</div><div class="wallet__popup-text">Недостаточно средств для Куплена</div>`;
        }

        content = '<div class="popup__inner">' + content + "</div>";

        showPopup(planetElement, content, ["planet__popup"]);
    };

    const getInitState = () => {
        setValue(
            window?.user?.wallet?.value?.find(
                (bal) => bal.element === element.id
            )?.value
        );
    };
    const [value, setValue] = useState(0);

    const [click, setClick] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const animated = useRef(null);

    const updateFn = debounce(async (val) => {
        if (isLoading) {
            setTimeout(() => {
                updateFn(val);
            }, 200);
            return;
        }

        if (window.user?.wallet) {
            const balance = window.user?.wallet?.value;

            const currentElem = balance?.find(
                (item) => item.element === element.id
            );

            if (currentElem?.element) {
                setIsLoading(true);
                currentElem.value = parseFloat(
                    (parseFloat(currentElem.value) + val).toFixed(10)
                );
                const data = [
                    ...balance.filter((bal) => bal.element !== element?.id),
                    { ...currentElem },
                ];
                setValue(currentElem.value);
                await putWallet(window.user.wallet, data);

                setIsLoading(false);
            } else {
                let data;
                if (window.user.wallet.value?.length) {
                    data = [
                        ...window.user.wallet.value,
                        {
                            element: element.id,
                            value: val,
                            name: element.name,
                            img: element.img,
                            symbol: element.symbol,
                            rare: element.rare,
                        },
                    ];
                } else {
                    data = [
                        {
                            element: element.id,
                            value: val,
                            name: element.name,
                            img: element.img,
                            symbol: element.symbol,
                            rare: element.rare,
                        },
                    ];
                }
                setValue(val);
                await putWallet(window.user.wallet, data);
                window.user.wallet.value = data;
            }
            //await fetchDefaultUser();
        }
    }, 50);
    const debounceFn = useCallback((click) => updateFn(click), []);

    const putWallet = async (walletId, value) => {
        await updateWalletElement(walletId, value);
    };

    const walletUpdate = async (e) => {
        if (e.target.tagName.toLowerCase() === "button") return;

        const plusIcon = document.createElement("div");
        plusIcon.textContent = "+";
        plusIcon.classList.add("plus-icon");
        plusIcon.style.left = `${e.pageX}px`;
        plusIcon.style.top = `${e.pageY}px`;

        document.body.appendChild(plusIcon);
        plusIcon.addEventListener("animationend", () => plusIcon.remove());

        setClick(click + 1);
        if (!window?.user?.id && click >= 2) {
            showModal(e, 'wallet')
        }

        if (userHasPlanet()) {
            const level = window?.user?.userPlanets.find(
                (item) => item.planetId === id
            ).level;
            console.log(level, typeof level);
            let update;
            if (level == 1) update = 0.05;
            if (level == 2) update = 0.5;
            if (level == 3) update = 1;

            debounceFn(0.00005);
        } else {
            debounceFn(0.00005);
        }
    };

    useEffect(() => {
        getInitState();
    }, [isLoading, window?.user]);

    useEffect(() => {
        new BorderAnimation(animated.current);
    }, []);

    const userHasPlanet = () => {
        if(planet?.user_planets) {
            const plData = planet.user_planets;
            const idx = plData?.find((item) => item?.planetId === id && item?.userId === window?.user?.id);
            if(idx?.id) {
                return true;
            }
        }
        if (window?.user?.userPlanets?.length) {
            const planets = window.user.userPlanets;
            if (planets.some((item) => item.planetId === id)) {
                const planet = planets.find((item) => item.planetId === id);
                //setUserPlanet(planet);
                return true;
            }
        }
        if (window?.user?.nft) {
            const arr = window.user.nft;
            const fullName = `${name}(${element?.symbol}) - Planet #${idx}`;
            const item = arr?.find((item) => item.metadata.name === fullName);
            if (item?.length && window.user.userPlanets?.length) {
                const planets = window.user.userPlanets;
                const planet = planets.find((item) => item.planetId === id);
                if (!planet?.id) {
                    //addPlanetToUser(id);
                }
            }
            return item?.length;
        }
        return false;
    };

    const updatePlanetSpeed = async (e) => {
        
        if (window.user.coins >= 3) {
            const userPlanet = window.user.userPlanets.find(
                (item) => item.planetId === id
            );
            
            if (+userPlanet.level >= 2) {
                showModal(e, 'updateError')
                return;
            }
            await updateUserPlanet(userPlanet.id, +userPlanet.level + 1);
            await updateUser({ coins: window.user.coins - 3 });
            window.user.coins = window.user.coins - 3;
             showModal(e, 'upgrade')
            await update();
        }
    };

    return (
        <div
            className={`planets__planet animated-border-container with_To rotate ${
                forLaboratory && !userHasPlanet()
                    ? "ver3"
                    : userHasPlanet()
                    ? "ver1"
                    : "ver2"
            }`}
            onClick={(e) => walletUpdate(e)}
        >
            <div className="animated-border" ref={animated}>
                <div
                    className="planet__img"
                    style={{ "--planet-bg": `url(/img/icon/${element.img})` }}
                >
                    <img src={`/img/planet/${img}`} alt="" />
                </div>
                <div className="planet__information">
                    <h4 className="planet__title">
                        {name}({element?.symbol}) - Planet #{idx}
                    </h4>
                    <p className="planet__lvl">{t("level")} {userHasPlanet() ? planet.user_planets.find(item => item.planetId === id)?.level : 1}</p>
                    <p className="planet__speed">
                        {t("speed")}:{" "}
                        {userHasPlanet()
                            ? planet.user_planets.find(
                                  (item) => item.planetId === id
                              ).level == 2
                                ? 0.1
                                : 0.05
                            : 0.00005}{" "}
                        ({element?.symbol})/
                        {userHasPlanet() ? t("hour") : t("tap")}
                    </p>
                    <p className="planet__description">
                        {t("extractedResource")} {element?.name}(
                        {element?.symbol})
                    </p>
                    <p className="planet__gc">
                        {value ?? "0.000"} {element?.symbol}
                    </p>
                </div>
                <div className="planet__price">
                    {userHasPlanet() ? (
                        <>
                            {t("updgradePrice")} <span>3 GC</span>
                        </>
                    ) : (
                        ""
                    )}
                </div>
                <div className="planet__row">
                    {userHasPlanet() ? (
                        <button
                            className="btn upgrade"
                            onClick={updatePlanetSpeed}
                        >
                            {t("update")}
                        </button>
                    ) : (
                        <a
                            style={{
                                textDecoration: "none",
                                color: "inherit",
                            }}
                            href="https://getgems.io/toniumworld"
                            target="_blank"
                        >
                            <button className="btn buy">{t("buy")}</button>
                        </a>
                    )}

                    {forLaboratory ? (
                        <div className="planet__time-block">
                            {/* <!-- Если нужны английские подписи к числам, то добавь к этому блоку класс eng --> */}
                            <div className="time-block__timer">
                                <Timer />
                            </div>
                            <div className="time-block__text">
                                {t("toniumJoin")}
                            </div>
                        </div>
                    ) : (
                        ""
                    )}
                </div>
            </div>
        </div>
    );
}

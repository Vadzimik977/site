import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "../assets/js/input";
import showPopup from "../assets/js/showPopup";
import Layout from "../components/Layout";
import { useElementsStore } from "../store/elementsStore";
import { useUserStore } from "../store/userStore";
import { IElement } from "../types/planets.type";
import { IWalletElement } from "../types/user.type";
import {
  getElements,
  updateHistory,
  updateUser,
  updateWalletElement,
} from "../utils/axios";
type MODAL_STATUS = "complete" | "error" | "balance";

export default function Market() {
  const { user, setWallet, setUser } = useUserStore();
  const { setPlanetElements, planetElements } = useElementsStore();

  const [first, setFirst] = useState(0);
  const [second, setSecond] = useState(0);
  const [max, setMax] = useState(0);
  const [item, setItem] = useState<IElement>();
  const [isHistory, setIsHistory] = useState(false);

  const [firstModal, setFirstModal] = useState(false);
  const [secondModal, setSecondModal] = useState(false);

  const [isRevert, setIsRevert] = useState(false);
  const [historyIndex, setHistoryIndex] = useState(5);

  const { t } = useTranslation();

  async function getWallet() {
    if (planetElements.length == 0) {
      const elems = await getElements();

      setPlanetElements(elems);
    }
  }
  const changeInput = (value: number, first: boolean) => {
    if (!user || !item) return;

    setFirst(value);
    //let newValue = value = value.replace(/^[.0-9]*$/, '');
    //newValue = Math.min(parseInt(value) || 0, item.value);
    let newValue = value;

    if (!isRevert) {
      if (newValue > item?.value) {
        newValue = item?.value;
      }
    } else {
      if (newValue > user.coins) {
        newValue = user.coins;
      }
    }
    if (first) {
      setFirst(newValue);

      let coeff;
      switch (item.rare) {
        case "Обычная":
          coeff = 1;
          break;
        case "Редкая":
          coeff = 2;
          break;
        case "Эпическая":
          coeff = 3;
          break;
      }

      if (!isRevert) {
        setSecond(parseFloat((newValue * coeff).toFixed(6)));
      } else {
        setSecond(parseFloat((newValue / coeff).toFixed(6)));
      }
    }
  };
  useEffect(() => {
    getWallet();
  }, []);

  const showModal = (event: any, status: MODAL_STATUS) => {
    const planetElement = event.target.closest(".market__trade");
    let content,
      additionalClasses = ["market__popup"];

    if (status === "complete") {
      content = `<div class="market__popup-title">${t(
        "exchangeSuccess"
      )}</div><div class="market__popup-text">${t("balanceUpd")}</div>`;
    } else if (status === "error") {
      content = `<div class="market__popup-title">${t(
        "modalError"
      )}</div><div class="market__popup-text">${t("notEnought")}</div>`;
    } else {
      content = `<div class="market__popup-title">${t("tryAgain")}</div>`;
    }

    content = '<div class="popup__inner">' + content + "</div>";

    showPopup(planetElement, content, additionalClasses);
  };

  const exchange = async (event: any) => {
    let history;
    let oldValue;
    if (first == 0) {
      return;
    }

    if (!item || !user) {
      return;
    }

    if (!isRevert) {
      oldValue = item?.value;
      item.value = +item.value - first;
    } else {
      if (item.value) {
        oldValue = item.value;
        item.value = +item.value + +second;
      } else {
        oldValue = 0;
        item.value = +second;
      }
    }
    let data: IWalletElement[] = [];
    if (user.wallet.value?.length) {
      if (item?.value < 0) {
        item.value = 0;
      }
      data = [
        ...user.wallet.value.filter((i) => i.element !== item.element),
        {
          element: item.element,
          value: item.value,
          name: item.name,
          img: item.img,
          symbol: item.symbol,
          rare: item.rare,
        },
      ];
    }
    if (user.history.value?.length) {
      history = [
        ...user.history.value,
        {
          element: item.element,
          newValue: +item.value,
          oldValue: oldValue,
          name: item.name,
          img: item.img,
          symbol: item.symbol,
          rare: item.rare,
        },
      ];
    } else {
      history = [
        {
          element: item.element,
          newValue: +item.value,
          oldValue: oldValue,
          name: item.name,
          img: item.img,
          symbol: item.symbol,
          rare: item.rare,
        },
      ];
    }

    if (data.length > 0) {
      await updateWalletElement(user.wallet, data);
    }

    if (!isRevert) {
      const newUser = await updateUser({ coins: second + user.coins });
      // window.user.coins = second + window.user.coins;

      setUser(newUser);

      history.push({
        img: "/images/ton2.svg",
        name: "GameCoin",
        newValue: user.coins,
        oldValue: user.coins - second,
        element: item.element,
        rare: item.rare,
        symbol: item.symbol,
      });
    } else {
      if (user.coins - first < 0) {
        showModal(event, "error");
      }

      const newUser = await updateUser({ coins: user.coins - first });
      setUser(newUser);

      history.push({
        img: "/images/ton2.svg",
        name: "GameCoin",
        newValue: user.coins,
        oldValue: user.coins + first,
        element: item.element,
        rare: item.rare,
        symbol: item.symbol,
      });
    }
    // setWallet((wall) => ({ ...wall, value: data }));
    showModal(event, "complete");
    updateHistory(user.history, history);
    // window.user.history.value = history;
    // window.user.wallet.value = data;
    setFirst(0);
    setSecond(0);
  };

  useEffect(() => {
    const banners = document.querySelectorAll(".compact-select");
    console.log(!!item?.element);

    banners.forEach((val) => {
      console.log(val);
      if (val.querySelector(".selected-option.elem")) {
        if (item?.img) {
          const a = val.querySelector(".selected-option.elem");
          if (!a) return;
          a.innerHTML = `<img class="crypto-icon" src='/img/icon/${item?.img}' />${item?.name}`;
        }
      }
    });
  }, [item?.img, user]);

  const replaceAmounts = () => {
    if (!user) return;

    setIsRevert(!isRevert);
    const banners = document.querySelectorAll(".compact-select");

    const firstBanner = banners[0].innerHTML;
    const secondBanner = banners[1].innerHTML;
    banners[0].innerHTML = secondBanner;
    banners[1].innerHTML = firstBanner;

    banners.forEach((val) => {
      console.log(val);
      if (val.querySelector(".selected-option.elem")) {
        if (item?.img) {
          const a = val.querySelector(".selected-option.elem");
          if (!a) return;
          a.innerHTML = `<img class="crypto-icon" src='/img/icon/${item?.img}' />${item?.name}`;
        }
      }
    });

    setFirst(0);
    setSecond(0);
  };

  const search = (e: any) => {
    const searchTerm = e.target.value.toLowerCase();
    const options = e.target.parentNode.parentNode.querySelectorAll(".option");

    options.forEach((option: any) => {
      const cryptoName = option
        .querySelector(".crypto-name")
        .textContent.toLowerCase();
      const cryptoSubLabel = option
        .querySelector(".crypto-sublabel")
        .textContent.toLowerCase();
      if (
        cryptoName.includes(searchTerm) ||
        cryptoSubLabel.includes(searchTerm)
      ) {
        option.style.display = "flex";
      } else {
        option.style.display = "none";
      }
    });
  };

  return (
    <Layout>
      <div className="main__inner">
        <h1 className="main__title">{t("marketTitle")}</h1>
        <h6 className="main__text">{t("marketSubTitle")}</h6>
        <div className="market">
          {!isHistory ? (
            <div className="market__trade">
              <div className="market__row">
                <div className="market__title">{t("change").toUpperCase()}</div>
                <div
                  className="market__settings"
                  onClick={() => {
                    setIsHistory(true);
                    setIsRevert(false);
                  }}
                >
                  <img src="/images/reload.svg" alt="" />
                </div>
              </div>
              <div className="market__banner">
                <div className="market__banner-choice">
                  <div
                    className="compact-select"
                    onClick={() =>
                      isRevert ? setSecondModal(true) : setFirstModal(true)
                    }
                  >
                    <div className="selected-option elem">
                      {item?.element ? (
                        <div className="elem">
                          <img
                            className="crypto-icon"
                            src={`/img/icon/${item?.img}`}
                          />
                          {item?.name}
                        </div>
                      ) : (
                        t("click")
                      )}
                    </div>
                  </div>

                  <div
                    tabIndex={1}
                    className={`modal-select ${!firstModal ? "hidden" : ""}`}
                  >
                    <div className="modal-content">
                      <div className="modal-header">
                        <h2>{t("chooseActive")}</h2>
                        <p>{t("payFor")}</p>
                        <button
                          className="close-button"
                          onClick={() => setFirstModal(false)}
                        >
                          &times;
                        </button>
                      </div>
                      <div className="search-container">
                        <input
                          type="text"
                          className="search-input"
                          onChange={(e) => search(e.target)}
                          placeholder={t("monetAdres")}
                        />
                      </div>
                      <div className="options-list map__options">
                        {user?.wallet?.value?.length
                          ? !isRevert
                            ? user?.wallet?.value?.map((item) => (
                                <div
                                  onClick={() => {
                                    const rare = item.rare;
                                    const rares = [
                                      "Обычная",
                                      "Редкая",
                                      "Эпическая",
                                    ];
                                    const coeff =
                                      rares.findIndex((val) => val === rare) +
                                      1;
                                    console.log(coeff);

                                    setItem({
                                      ...item,
                                      element: item?.element,
                                    });
                                    setFirst(item.value);
                                    setSecond(
                                      parseFloat(
                                        (item.value * coeff).toFixed(6)
                                      )
                                    );
                                    setMax(item.value);

                                    setFirstModal(false);
                                  }}
                                  className="option"
                                  data-value={item?.name}
                                  data-label={item?.symbol}
                                  data-sublabel="Select"
                                  data-amount="1"
                                  key={item?.element}
                                  data-icon="/images/ton2.svg"
                                  style={{ display: "flex" }}
                                >
                                  <img
                                    src={`/img/icon/${item.img}`}
                                    alt=""
                                    className="crypto-icon"
                                  />

                                  <>
                                    <div
                                      onClick={() => {}}
                                      key={item.name}
                                      className="option-text"
                                    >
                                      <span className="crypto-name">
                                        {item?.name}
                                      </span>
                                      <span className="crypto-sublabel">
                                        {item?.symbol}
                                      </span>
                                    </div>
                                    <span className="crypto-amount">
                                      {item?.value}
                                    </span>
                                  </>
                                </div>
                              ))
                            : planetElements.map((item) => (
                                <div
                                  onClick={() => {
                                    const rare = item.rare;
                                    const rares = [
                                      "Обычная",
                                      "Редкая",
                                      "Эпическая",
                                    ];
                                    const coeff =
                                      rares.findIndex((val) => val === rare) +
                                      1;
                                    setItem({
                                      ...item,
                                      element: String(item.id),
                                      value: 0,
                                    });
                                    setFirst(0);
                                    setSecond(0);
                                    setMax(0);

                                    setFirstModal(false);
                                  }}
                                  className="option"
                                  data-value={item?.name}
                                  data-label={item?.symbol}
                                  data-sublabel="Select"
                                  data-amount="1"
                                  key={item?.id}
                                  data-icon="/images/ton2.svg"
                                  style={{ display: "flex" }}
                                >
                                  <img
                                    src={`/img/icon/${item.img}`}
                                    alt=""
                                    className="crypto-icon"
                                  />

                                  <>
                                    <div
                                      onClick={() => {}}
                                      key={item.id}
                                      className="option-text"
                                    >
                                      <span className="crypto-name">
                                        {item?.name}
                                      </span>
                                      <span className="crypto-sublabel">
                                        {item?.symbol}
                                      </span>
                                    </div>
                                  </>
                                </div>
                              ))
                          : ""}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="market__banner-number">
                  <input
                    type="text"
                    className="market__banner-input market__banner-input-1 positive-number-input"
                    onChange={(e) => {
                      changeInput(Number(e.target.value), true);
                    }}
                    max={max}
                    value={first}
                  />
                </div>
              </div>
              <div
                title="Поменять местами"
                onClick={(e) => replaceAmounts()}
                className="arrows"
              >
                <img className="arrow-svg" src="/images/arrow2.svg" />
                <img className="arrow-svg-2" src="/images/arrow2.svg" />
              </div>
              <div className="market__banner">
                <div className="market__banner-choice">
                  <div
                    className="compact-select"
                    onClick={() =>
                      isRevert ? setFirstModal(true) : setSecondModal(true)
                    }
                  >
                    <div className="selected-option iston">
                      <img
                        src="/images/ton2.svg"
                        alt=""
                        className="crypto-icon"
                      />
                      GC
                    </div>
                  </div>

                  <div
                    className={`modal-select ${secondModal ? "" : "hidden"}`}
                  >
                    <div className="modal-content">
                      <div className="modal-header">
                        <h2>{t("chooseActive")}</h2>
                        <p>{t("payFor")}</p>
                        <button
                          className="close-button"
                          onClick={() => setSecondModal(false)}
                        >
                          &times;
                        </button>
                      </div>
                      <div className="search-container">
                        <input
                          type="text"
                          className="search-input"
                          onChange={(e) => search(e)}
                          placeholder={t("monetAdres")}
                        />
                      </div>
                      <div className="options-list">
                        <div
                          className="option"
                          data-value="toncoin"
                          data-label="ТОННА"
                          data-sublabel="Toncoin"
                          data-amount="0"
                          data-icon="./images/ton2.svg"
                          onClick={() => setSecondModal(false)}
                        >
                          <img
                            src="/images/ton2.svg"
                            alt=""
                            className="crypto-icon"
                          />
                          <div className="option-text">
                            <span className="crypto-name">GC</span>
                            <span className="crypto-sublabel">Game Coin</span>
                          </div>
                          <span className="crypto-amount">{user?.coins}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="market__banner-number">
                  <input
                    type="number"
                    className="market__banner-input market__banner-input-2 positive-number-input"
                    value={second}
                    disabled={true}
                    onChange={(e) => setSecond(Number(e.target.value))}
                  />
                </div>
              </div>
              <div
                className="btn btn-obmen"
                onClick={(event) => exchange(event)}
              >
                {t("martketBtn")}
              </div>
            </div>
          ) : (
            <div className="market__history">
              <div className="market__row">
                <div className="market__title">{t("history")}</div>
                <div
                  className="market__settings"
                  onClick={() => setIsHistory(false)}
                >
                  <img src="/images/reload.svg" alt="" />
                </div>
              </div>
              <div className="history__items">
                {user?.history?.value?.reverse()?.map((item, i) =>
                  i !== historyIndex && i < historyIndex ? (
                    <div
                      key={i}
                      className={`history__item ${
                        item?.newValue < item?.oldValue ? "red" : ""
                      }`}
                    >
                      <img src="/images/ton2.svg" alt="" />
                      <span>{item?.name}</span>
                      <span className="money">
                        {item?.oldValue > item?.newValue
                          ? `- ${(item?.oldValue - item?.newValue).toFixed(5)}`
                          : `+ ${(item?.newValue - item?.oldValue).toFixed(5)}`}
                      </span>
                    </div>
                  ) : (
                    ""
                  )
                )}
              </div>

              {user && historyIndex < user?.history?.value?.length ? (
                <div
                  className="btn"
                  onClick={() => setHistoryIndex(historyIndex + 5)}
                >
                  Еще
                </div>
              ) : (
                ""
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

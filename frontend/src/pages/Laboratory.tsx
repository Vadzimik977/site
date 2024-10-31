import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ColorRing } from "react-loader-spinner";
import showPopup from "../assets/js/showPopup";
import Layout from "../components/Layout";
import Timer from "../components/Timer";
import { useUserStore } from "../store/userStore";
import { IPlanet } from "../types/planets.type";
import { getPlanets, updateUser, updateWalletElement } from "../utils/axios";

type POPUP_STATUS = "complete" | "error";

export default function Laboratory() {
  const [elems, setElems] = useState<IPlanet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, setWallet, setUser } = useUserStore();
  const { t } = useTranslation();

  const fetchPlanets = async () => {
    const planets = await getPlanets([0, 9], true, 0);
    setIsLoading(false);

    setElems(planets);
  };

  const getPlanetWallet = (id: number) => {
    if (user?.wallet?.value) {
      const walletValue = user?.wallet?.value;
      const elem = walletValue.find((item) => Number(item.element) === id);

      return elem?.value ?? 0;
    }
    return 0;
  };

  const showModal = (event: any, status: POPUP_STATUS | null) => {
    const laboratoryElement = event.target.closest(".laboratory");
    let content,
      additionalClasses = ["laboratory__popup"];

    if (status === "complete") {
      content = `<div class="laboratory__popup-title">${t(
        "mergeSuccess"
      )}</div>`;
    } else {
      content = `<div class="laboratory__popup-title">${t(
        "modalError"
      )}</div><div class="laboratory__popup-text">${t("elementZero")}</div>`;
    }

    content = '<div class="popup__inner">' + content + "</div>";

    showPopup(laboratoryElement, content, additionalClasses);
  };

  useEffect(() => {
    fetchPlanets();
  }, []);

  const union = async (event: any) => {
    if (!user) return;

    if (!user?.wallet.value?.length) {
      showModal(event, null);
    }

    if (elems?.length <= 0) return;

    const minVal = elems.map((item) => ({
      ...item.element,
      value: getPlanetWallet(item.element.id) - 5,
    }));

    console.log("minVal: ", minVal);

    const min = Math.min(...minVal.map((item) => item.value));

    if (min <= 0) {
      showModal(event, null);
      return;
    }

    let newValues = minVal.map((item) => ({
      ...item,
      element: item.id,
      value: parseFloat((item.value - min).toFixed(10)),
    }));

    // @ts-ignore
    newValues = newValues.map((item) => ({
      element: item.id,
      img: item.img,
      name: item.name,
      rare: item.rare,
      symbol: item.symbol,
      value: item.value,
    }));

    const updatedValues = [
      ...user.wallet.value.filter(
        (item) => !newValues.some((val) => String(val.element) === item.element)
      ),
      ...newValues,
    ];
    console.log(updatedValues);

    // @ts-ignore

    await updateWalletElement(user.wallet, updatedValues);
    const newUser = await updateUser({ ton: min + user.ton });
    setUser(newUser);

    showModal(event, "complete");
  };

  return (
    <Layout>
      <div className="main__inner">
        <h1 className="main__title">{t("laboratoryTitle")}</h1>
        <div className="laboratory">
          <div className="laboratory__time">
            <div className="laboratory__time-text">
              {t("laboratorySubTitle")}
            </div>
            <div className="laboratory__time-timer">
              <Timer />
            </div>
          </div>
          {!isLoading ? (
            <div className="laboratory__items">
              {elems.map((item) => (
                <div>
                  <img
                    style={{ width: "85px" }}
                    src={`/img/icon/${item.element.img}`}
                    alt=""
                  />
                  <span>
                    {getPlanetWallet(item.element.id)} {item.element.symbol}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="color-ring-wrapper">
              <ColorRing
                visible={isLoading}
                height={80}
                width={80}
                colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
              />
            </div>
          )}
          <button className="laboratory__button " onClick={(e) => union(e)}>
            {t("combine")}
          </button>
          <div className="laboratory__text">{t("syntDev")}</div>
        </div>
      </div>
    </Layout>
  );
}

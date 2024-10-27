import { useTranslation } from "react-i18next";
import showPopup from "../assets/js/showPopup";
import Layout from "../components/Layout";
import { useUserStore } from "../store/userStore";
import { IWalletElement } from "../types/user.type";
import { updateUser, updateWalletElement } from "../utils/axios";

type POPUP_STATUS = "complete" | "error" | "wall";

export default function Wallet() {
  const { user } = useUserStore();

  const { t } = useTranslation();

  const showModal = (event: any, status: POPUP_STATUS) => {
    const walletElement = event.target.closest(".wallet__table");
    let content,
      additionalClasses = ["wallet__popup"];

    content = `<div class="wallet__popup-title">${t("tryAgain")}</div>`;

    if (status === "complete") {
      content = `<div class="wallet__popup-title">${t(
        "exchangeSuccess"
      )}</div><div class="wallet__popup-text">${t("balanceUpd")}</div>`;
    }

    if (status === "error") {
      content = `<div class="wallet__popup-title">${t(
        "modalError"
      )}</div><div class="wallet__popup-text">${t("notEnought")}</div>`;
    }

    if (status === "wall") {
      content = `<div class="wallet__popup-title">${t(
        "modalError"
      )}</div><div class="wallet__popup-text">${t("withdrawMsg")}</div>`;
    }

    content = '<div class="popup__inner">' + content + "</div>";

    showPopup(walletElement, content, additionalClasses);
  };

  const changeMonet = async (monet: IWalletElement, event: any) => {
    if (monet.value === 0) {
      showModal(event, "error");
      return;
    }
    let coeff;
    switch (monet.rare) {
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

    const give = parseFloat((monet.value * coeff).toFixed(6));
    if (!user) return;

    const valueWallet = user.wallet.value.filter(
      (item) => item.element !== monet.element
    );

    await updateWalletElement(user.wallet, [
      ...valueWallet,
      { ...monet, value: 0 },
    ]);

    await updateUser({ coins: give + user.coins });

    // !!!!!!!!!!!!!!!!!
    // window.user.coins = give + user.coins;

    // setCoins(window.user.coins);
    // await fetchDefaultUser();
    // await getWallet();

    showModal(event, "complete");
  };

  return (
    <Layout>
      <div className="main__inner">
        <div className="wallet">
          <div className="wallet__row">
            <div className="wallet__title">{t("wallet")}</div>
            <div className="wallet__balance">
              {t("balance")}
              <div>
                <span className="wallet-total_tap">
                  {user?.coins?.toFixed(5) ?? 0}
                </span>{" "}
                GC
              </div>
            </div>
          </div>
          <div className="wallet__table">
            <div className="wallet__table-inner">
              <div className="wallet__table-header">
                <div>{t("monet")}</div>
                <div>{t("balance")}</div>
              </div>
              <div className="wallet__table-row">
                <div className="wallet__table-coin">Tonium </div>
                <div>{user?.ton?.toFixed(5)} TON</div>
                <button
                  className="btn btn-to"
                  onClick={(e) => showModal(e, "wall")}
                >
                  {t("withdraw")}
                </button>
              </div>
              <hr className="wallet__table-hr" />
              <div className="wallet__table-wrapper">
                {user?.wallet?.value?.length
                  ? user?.wallet?.value
                      ?.sort((a, b) => b?.value - a?.value)
                      .map((item) => (
                        <div key={item.element} className="wallet__table-row">
                          <div className="wallet__table-coin">
                            {item.name}{" "}
                            <span className="usd">USD 0,01322 $</span>
                          </div>
                          <div>{item.value}</div>
                          <button
                            onClick={(e) => changeMonet(item, e)}
                            className="btn"
                          >
                            {t("martketBtn")}
                          </button>
                        </div>
                      ))
                  : ""}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

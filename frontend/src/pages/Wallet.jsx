import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { fetchDefaultUser } from "../assets/js/getUser";
import { getUserWallet, updateUser, updateWalletElement } from "../utils/axios";
import showPopup from "../assets/js/showPopup";
import { useTranslation } from "react-i18next";

export default function Wallet() {
    const [wallet, setWallet] = useState(true);
    const [ton, setTon] = useState(window?.user?.ton ?? 0);
    const [coins, setCoins] = useState(window?.user?.coins ?? 0);

    const { t } = useTranslation();

    async function getWallet() {
        setTimeout(async() => {
            setWallet(window?.user?.wallet)
            setCoins(window?.user?.coins ?? 0)
            setTon(window?.user?.ton ?? 0)
        }, 500)
    }
    useEffect(() => {
        document.addEventListener('getUser', () => {
            getWallet()
        })
    }, [window.user, window.adress]);

    const showModal = (event, status) => {
        const walletElement = event.target.closest('.wallet__table');
        let content, additionalClasses = ['wallet__popup'];
        console.log((status) === 'wall')
        if (status === 'complete') {
            content = `<div class="wallet__popup-title">${t('exchangeSuccess')}</div><div class="wallet__popup-text">${t('balanceUpd')}</div>`;
            // setTimeout(() => {
            //     window.location.reload()
            // }, 2000);
        } else if (status === 'error') {
            content = `<div class="wallet__popup-title">${t('modalError')}</div><div class="wallet__popup-text">${t('notEnought')}</div>`;
            // setTimeout(() => {
            //     window.location.reload()
            // }, 2000);

        } else if (status === 'wall') {
            content = `<div class="wallet__popup-title">${t('modalError')}</div><div class="wallet__popup-text">${t('withdrawMsg')}</div>`;
        } else {
            content = `<div class="wallet__popup-title">${t('tryAgain')}</div>`;
        }

        content = '<div class="popup__inner">' + content + '</div>';

        showPopup(walletElement, content, additionalClasses);
    }

    const changeMonet = async (monet, event) => {
        if(monet.value === 0) {
            showModal(event, 'error')
            return;
        }
        let coeff;
        switch(monet.rare) {
            case 'Обычная':
                coeff = 1;
                break;
            case 'Редкая':
                coeff = 2;
                break;
            case 'Эпическая':
                coeff = 3;
                break;
        }

        const give = (parseFloat((monet.value * coeff).toFixed(6)))
        const valueWallet = window.user.wallet.value.filter(item => item.element !== monet.element);

        await updateWalletElement(window.user.wallet, [...valueWallet, {...monet, value: 0}]);
        await updateUser({coins: give + window.user.coins});

        window.user.coins = give + window.user.coins

        setCoins(window.user.coins);
        await fetchDefaultUser();
        await getWallet();

        showModal(event, 'complete')
    }

    return (
        <Layout>
            <div className="main__inner">
                <div className="wallet">
                    <div className="wallet__row">
                        <div className="wallet__title">{t('wallet')}</div>
                        <div className="wallet__balance">
                            {t('balance')}
                            <div>
                                <span className="wallet-total_tap">
                                    {coins?.toFixed(5) ?? 0}
                                </span>{" "}
                                GC
                            </div>
                        </div>
                    </div>
                    <div className="wallet__table">
                        <div className="wallet__table-inner">
                            <div className="wallet__table-header">
                                <div>{t('monet')}</div>
                                <div>{t('balance')}</div>
                            </div>
                            <div className="wallet__table-row">
                                <div className="wallet__table-coin">
                                    Tonium{" "}
                                </div>
                                <div>{ton?.toFixed(5)} TON</div>
                                <button className="btn btn-to" onClick={(e) => showModal(e, 'wall')}>
                                    {t('withdraw')}
                                </button>
                            </div>
                            <hr className="wallet__table-hr" />
                            <div className="wallet__table-wrapper">
                                {wallet?.value?.length ? wallet?.value?.sort((a,b) => b?.value - a?.value).map(item => (
                                    <div key={item.element} className="wallet__table-row">
                                        <div className="wallet__table-coin">
                                            {item.name}{" "}
                                            <span className="usd">
                                                USD 0,01322 $
                                            </span>
                                        </div>
                                        <div>{item.value}</div>
                                        <button onClick={(e) => changeMonet(item, e)} className="btn">
                                            {t('martketBtn')}
                                        </button>
                                    </div>
                                )) : ''}
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

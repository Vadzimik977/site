import Layout from "../components/Layout";
import '../assets/js/input'
import { useEffect, useState } from "react";
import marketAdaptiv from "../assets/js/marketAdaptiv";
import customSelect from "../assets/js/customSelect";
import popups from "../assets/js/popups";
import scroll from "../assets/js/scroll";
import input from "../assets/js/input";
import newCustomSelect from "../assets/js/newCustomSelect";
import { getUserWallet, updateUser, updateWalletElement } from "../utils/axios";
import showPopup from "../assets/js/showPopup";
import { fetchDefaultUser } from "../assets/js/getUser";
import { useTranslation } from "react-i18next";
export default function Market() {
    const [first, setFirst] = useState(0);
    const [second, setSecond] = useState(0);
    const [max, setMax] = useState(0);
    const [wallet, setWallet] = useState(true);
    const [rare, setRare] = useState();
    const [item, setItem] = useState();

    const { t } = useTranslation();

    async function getWallet() {
        setTimeout(async() => {
            setWallet(window.user.wallet)
        }, 500)
    }
    const changeInput = (value, first) => {
        setFirst(value)
        //let newValue = value = value.replace(/[^\d]/g, '');
        //newValue = Math.min(parseInt(value) || 0, item.value);
        let newValue = value
        if(newValue > item.value) {
            console.log(item.value, newValue)
            newValue = item.value
        }
        if(first) {
            setFirst(newValue);
            console.log(rare)
            let coeff;
            switch(item.rare) {
                case 'Обычная':
                    coeff = 3;
                    break;
                case 'Редкая':
                    coeff = 2;
                    break;
                case 'Эпическая':
                    coeff = 1;
                    break;
            }
            const a = newValue / coeff;
            console.log(newValue)
            setSecond(parseFloat((newValue / coeff).toFixed(6)))
        }
        
    }
    useEffect(() => {
        getWallet();
    }, []);

    const showModal = (event, status) => {
        const planetElement = event.target.closest('.market__trade');
        let content, additionalClasses = ['market__popup'];

        if (status === 'complete') {
            content = '<div class="market__popup-title">Обмен выполнен успешно</div><div class="market__popup-text">Баланс в кошельке обновлён!</div>';
        } else if (status === 'error') {
            content = '<div class="market__popup-title">Ошибка</div><div class="market__popup-text">Недостаточно средств для обмена</div>';
        } else {
            content = '<div class="market__popup-title">Повторите попытку позже</div>';
        }

        content = '<div class="popup__inner">' + content + '</div>';

        showPopup(planetElement, content, additionalClasses);
    }

    const exchange = async (event) => {
        
        if(first < second) {
            showModal(event, 'error')
        };
        
        item.value = item.value - first;
        let data;
        if (window.user.wallet.value?.length) {
            data = [
                ...window.user.wallet.value.filter(i => i.element !== item.element),
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

        console.log(second)
        await updateWalletElement(window.user.wallet, data)
        await updateUser({coins: second + window.user.coins})
        window.user.coins = second + window.user.coins
        setWallet((wall) => ({...wall, value: data}));
        showModal(event, 'complete')
        setFirst(0)
        setSecond(0)
    }
    
    return (
        <Layout>
            <div className="main__inner">
                <h1 className="main__title">
                    {t('marketTitle')}
                </h1>
                <h6 className="main__text">
                {t('marketSubTitle')}
                </h6>
                <div className="market">
                    <div className="market__trade">
                        <div className="market__row">
                            <div className="market__title">{t('change').toUpperCase()}</div>
                            <div className="market__settings">
                                <img src="/images/reload.svg" alt="" />
                            </div>
                        </div>
                        <div className="market__banner">
                            <div className="market__banner-choice">
                                <div className="compact-select">
                                    <div className="selected-option">{t('click')}</div>
                                </div>

                                <div
                                    className="modal-select"
                                    style={{display: "none"}}
                                >
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h2>{t('chooseActive')}</h2>
                                            <p>{t('payFor')}</p>
                                            <button className="close-button">
                                                &times;
                                            </button>
                                        </div>
                                        <div className="search-container">
                                            <input
                                                type="text"
                                                className="search-input"
                                                placeholder={t('monetAdres')}
                                            />
                                        </div>
                                        <div className="options-list map__options">
                                            
                                        {wallet?.value?.length ? wallet?.value?.map(item =>(
                                            <div
                                                onClick={() => {setItem(item), setFirst(0), setSecond(0)}}
                                                className="option"
                                                data-value={item?.name}
                                                data-label={item?.symbol}
                                                data-sublabel="Select"
                                                data-amount="1"
                                                data-icon="/images/ton2.svg"
                                                style={{display: "flex"}}
                                            >
                                                <img
                                                    src={`/img/icon/${item.img}`}
                                                    alt=""
                                                    className="crypto-icon"
                                                />
                                                
                                                    <>
                                                    <div onClick={() => setMax(item.value)} key={item.id} className="option-text">
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
                                                )) : ''}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="market__banner-number">
                                <input
                                    type="text"
                                    className="market__banner-input market__banner-input-1 positive-number-input"
                                    onChange={e => {
                                        changeInput(e.target.value, true)
                                    }}
                                    max={max}
                                    value={first}
                                />
                            </div>
                        </div>
                        <div className="market__banner">
                            <div className="market__banner-choice">
                                <div className="compact-select">
                                    <div className="selected-option"></div>
                                </div>

                                <div
                                    className="modal-select"
                                    style={{display: "none"}}
                                >
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h2>{t('chooseActive')}</h2>
                                            <p>{t('payFor')}</p>
                                            <button className="close-button">
                                                &times;
                                            </button>
                                        </div>
                                        <div className="search-container">
                                            <input
                                                type="text"
                                                className="search-input"
                                                placeholder={t('monetAdres')}
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
                                            >
                                                <img
                                                    src="/images/ton2.svg"
                                                    alt=""
                                                    className="crypto-icon"
                                                />
                                                <div className="option-text">
                                                    <span className="crypto-name">
                                                        GC
                                                    </span>
                                                    <span className="crypto-sublabel">
                                                        Game Coin
                                                    </span>
                                                </div>
                                                <span className="crypto-amount">
                                                    0
                                                </span>
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
                                    disabled
                                    onChange={(e) => setSecond(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="btn btn-obmen" onClick={(event) => exchange(event)}>{t('martketBtn')}</div>
                    </div>
                    <div className="market__history hidden" style={{display: "none"}}>
                        <div className="market__row">
                            <div className="market__title">История</div>
                            <div className="market__settings">
                                <img src="/images/reload.svg" alt="" />
                            </div>
                        </div>
                        <div className="history__items">
                            <div className="history__item">
                                <img src="/images/ton2.svg" alt="" />
                                <span>Tonium</span>
                                <span className="money">+900$</span>
                            </div>
                            <div className="history__item">
                                <img src="/images/ton2.svg" alt="" />
                                <span>Tonium</span>
                                <span className="money">+900$</span>
                            </div>
                            <div className="history__item">
                                <img src="/images/ton2.svg" alt="" />
                                <span>Tonium</span>
                                <span className="money red">-900$</span>
                            </div>
                            <div className="history__item">
                                <img src="/images/ton2.svg" alt="" />
                                <span>Tonium</span>
                                <span className="money">+900$</span>
                            </div>
                            <div className="history__item">
                                <img src="/images/ton2.svg" alt="" />
                                <span>Tonium</span>
                                <span className="money">+900$</span>
                            </div>
                        </div>
                        <div className="btn">Еще</div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

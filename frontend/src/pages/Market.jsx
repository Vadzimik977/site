import Layout from "../components/Layout";
import '../assets/js/input'
import { useEffect, useState } from "react";
import marketAdaptiv from "../assets/js/marketAdaptiv";
import customSelect from "../assets/js/customSelect";
import popups from "../assets/js/popups";
import scroll from "../assets/js/scroll";
import input from "../assets/js/input";
import newCustomSelect from "../assets/js/newCustomSelect";
import { getUserWallet } from "../utils/axios";
export default function Market() {
    const [first, setFirst] = useState(0);
    const [second, setSecond] = useState(0);
    const [max, setMax] = useState(0);
    const [wallet, setWallet] = useState(true);

    async function getWallet() {
        setTimeout(async() => {
            await getUserWallet().then((data) => {
                setWallet(data);
            });
        }, 500)
    }
    const changeInput = (value, first) => {
        let newValue = value = value.replace(/[^\d]/g, '');
        newValue = Math.min(parseInt(value) || 0, max);
        console.log(value, newValue)
        if(first) {
            setFirst(newValue);
            setSecond(newValue / 3)
        }
        
    }
    useEffect(() => {
        getWallet();
    }, []);
    console.log(first)
    return (
        <Layout>
            <div className="main__inner">
                <h1 className="main__title">
                    Здесь вы можете обменивать добытые ресурсы на игровую
                    валюту.
                </h1>
                <h6 className="main__text">
                    Используйте эту валюту для улучшения ваших планет или
                    приобрeтения необходимых ресурсов для создания Tonium.
                </h6>
                <div className="market">
                    <div className="market__trade">
                        <div className="market__row">
                            <div className="market__title">ОБМЕН</div>
                            <div className="market__settings">
                                <img src="/images/reload.svg" alt="" />
                            </div>
                        </div>
                        <div className="market__banner">
                            <div className="market__banner-choice">
                                <div className="compact-select">
                                    <div className="selected-option">Click</div>
                                </div>

                                <div
                                    className="modal-select"
                                    style={{display: "none"}}
                                >
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h2>Выберите актив</h2>
                                            <p>вы будете платить с помощью</p>
                                            <button className="close-button">
                                                &times;
                                            </button>
                                        </div>
                                        <div className="search-container">
                                            <input
                                                type="text"
                                                className="search-input"
                                                placeholder="Вставьте адрес монеты, чтобы доб..."
                                            />
                                        </div>
                                        <div className="options-list map__options">
                                        {wallet?.length ? wallet.map(item =>(
                                            <div
                                                onClick={() => setMax(item.value)}
                                                className="option"
                                                data-value={item?.element?.name}
                                                data-label={item?.element.symbol}
                                                data-sublabel="Select"
                                                data-amount="1"
                                                data-icon="/images/ton2.svg"
                                                style={{display: "flex"}}
                                            >
                                                <img
                                                    src={`/img/icon/${item.element.img}`}
                                                    alt=""
                                                    className="crypto-icon"
                                                />
                                                
                                                    <>
                                                    <div onClick={() => setMax(item.value)} key={item.id} className="option-text">
                                                        <span className="crypto-name">
                                                            {item?.element?.name}
                                                        </span>
                                                        <span className="crypto-sublabel">
                                                            {item?.element.symbol}
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
                                            <h2>Выберите актив</h2>
                                            <p>вы будете платить с помощью</p>
                                            <button className="close-button">
                                                &times;
                                            </button>
                                        </div>
                                        <div className="search-container">
                                            <input
                                                type="text"
                                                className="search-input"
                                                placeholder="Вставьте адрес монеты, чтобы доб..."
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
                        <div className="btn btn-obmen">Обменять</div>
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

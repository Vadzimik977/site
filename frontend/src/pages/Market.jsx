import Layout from "../components/Layout";

export default function Market() {
    return (
        <Layout>
            <div class="main__inner">
                <h1 class="main__title">
                    Здесь вы можете обменивать добытые ресурсы на игровую
                    валюту.
                </h1>
                <h6 class="main__text">
                    Используйте эту валюту для улучшения ваших планет или
                    приобритения необходимых ресурсов для создания Tonium.
                </h6>
                <div class="market">
                    <div class="market__trade">
                        <div class="market__row">
                            <div class="market__title">ОБМЕН</div>
                            <div class="market__settings">
                                <img src="/images/reload.svg" alt="" />
                            </div>
                        </div>
                        <div class="market__banner">
                            <div class="market__banner-choice">
                                <div class="compact-select">
                                    <div class="selected-option">Click</div>
                                </div>

                                <div
                                    class="modal-select"
                                    style={{display: "none"}}
                                >
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h2>Выберите актив</h2>
                                            <p>вы будете платить с помощью</p>
                                            <button class="close-button">
                                                &times;
                                            </button>
                                        </div>
                                        <div class="search-container">
                                            <input
                                                type="text"
                                                class="search-input"
                                                placeholder="Вставьте адрес монеты, чтобы доб..."
                                            />
                                        </div>
                                        <div class="options-list map__options">
                                            {/* <!-- <div class="option" data-value="toncoin" data-label="ТОННА"
                                                data-sublabel="Toncoin" data-amount="0" data-icon="./images/ton2.svg">
                                                <img src="./images/ton2.svg" alt="" class="crypto-icon">
                                                <div class="option-text">
                                                    <span class="crypto-name">ТОННА</span>
                                                    <span class="crypto-sublabel">Toncoin</span>
                                                </div>
                                                <span class="crypto-amount">0</span>
                                            </div>

                                            <div class="option" data-value="Ethereum" data-label="ЭФИР"
                                                data-sublabel="Ethereum" data-amount="1" data-icon="./images/ton2.svg">
                                                <img src="/images/ton2.svg" alt="" class="crypto-icon" />
                                                <div class="option-text">
                                                    <span class="crypto-name">ЭФИР</span>
                                                    <span class="crypto-sublabel">Ethereum</span>
                                                </div>
                                                <span class="crypto-amount">0</span>
                                            </div> --> */}
                                            <div
                                                class="option"
                                                data-value="Select Coin"
                                                data-label="Select Coin"
                                                data-sublabel="Select"
                                                data-amount="1"
                                                data-icon="./images/ton2.svg"
                                            >
                                                <img
                                                    src="/images/ton2.svg"
                                                    alt=""
                                                    class="crypto-icon"
                                                />
                                                <div class="option-text">
                                                    <span class="crypto-name">
                                                        Select Coin
                                                    </span>
                                                    <span class="crypto-sublabel">
                                                        Select Coin
                                                    </span>
                                                </div>
                                                <span class="crypto-amount">
                                                    0
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="market__banner-number">
                                <input
                                    type="text"
                                    class="market__banner-input market__banner-input-1 positive-number-input"
                                    value="0"
                                />
                            </div>
                        </div>
                        <div class="market__banner">
                            <div class="market__banner-choice">
                                <div class="compact-select">
                                    <div class="selected-option"></div>
                                </div>

                                <div
                                    class="modal-select"
                                    style={{display: "none"}}
                                >
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h2>Выберите актив</h2>
                                            <p>вы будете платить с помощью</p>
                                            <button class="close-button">
                                                &times;
                                            </button>
                                        </div>
                                        <div class="search-container">
                                            <input
                                                type="text"
                                                class="search-input"
                                                placeholder="Вставьте адрес монеты, чтобы доб..."
                                            />
                                        </div>
                                        <div class="options-list">
                                            <div
                                                class="option"
                                                data-value="toncoin"
                                                data-label="ТОННА"
                                                data-sublabel="Toncoin"
                                                data-amount="0"
                                                data-icon="./images/ton2.svg"
                                            >
                                                <img
                                                    src="/images/ton2.svg"
                                                    alt=""
                                                    class="crypto-icon"
                                                />
                                                <div class="option-text">
                                                    <span class="crypto-name">
                                                        GC
                                                    </span>
                                                    <span class="crypto-sublabel">
                                                        Game Coin
                                                    </span>
                                                </div>
                                                <span class="crypto-amount">
                                                    0
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="market__banner-number">
                                <input
                                    type="text"
                                    class="market__banner-input market__banner-input-2 positive-number-input"
                                    value="0"
                                />
                            </div>
                        </div>
                        <div class="btn btn-obmen">Обменять</div>
                    </div>
                    <div class="market__history hidden" style={{display: "none"}}>
                        <div class="market__row">
                            <div class="market__title">История</div>
                            <div class="market__settings">
                                <img src="/images/reload.svg" alt="" />
                            </div>
                        </div>
                        <div class="history__items">
                            <div class="history__item">
                                <img src="/images/ton2.svg" alt="" />
                                <span>Tonium</span>
                                <span class="money">+900$</span>
                            </div>
                            <div class="history__item">
                                <img src="/images/ton2.svg" alt="" />
                                <span>Tonium</span>
                                <span class="money">+900$</span>
                            </div>
                            <div class="history__item">
                                <img src="/images/ton2.svg" alt="" />
                                <span>Tonium</span>
                                <span class="money red">-900$</span>
                            </div>
                            <div class="history__item">
                                <img src="/images/ton2.svg" alt="" />
                                <span>Tonium</span>
                                <span class="money">+900$</span>
                            </div>
                            <div class="history__item">
                                <img src="/images/ton2.svg" alt="" />
                                <span>Tonium</span>
                                <span class="money">+900$</span>
                            </div>
                        </div>
                        <div class="btn">Еще</div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

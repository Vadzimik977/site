import Layout from "../components/Layout";

export default function Wallet() {
    return (
        <Layout>
            <div className="main__inner">
                <div className="wallet">
                    <div className="wallet__row">
                        <div className="wallet__title">Кошелёк</div>
                        <div className="wallet__balance">
                            Баланс
                            <div>
                                <span className="wallet-total_tap">000</span> GC
                            </div>
                        </div>
                    </div>
                    <div className="wallet__table">
                        <div className="wallet__table-inner">
                            <div className="wallet__table-header">
                                <div>Монета</div>
                                <div>Баланс</div>
                            </div>
                            <div className="wallet__table-row">
                                <div className="wallet__table-coin">
                                    Tonium{" "}
                                    <span className="usd">USD 66 456,73 $</span>
                                </div>
                                <div>100,00 $</div>
                                <button className="btn btn-to error">
                                    Вывести
                                </button>
                            </div>
                            <hr className="wallet__table-hr" />
                            <div className="wallet__table-wrapper">
                                <div className="wallet__table-row">
                                    <div className="wallet__table-coin">
                                        Tonium{" "}
                                        <span className="usd">USD 0,01322 $</span>
                                    </div>
                                    <div>72,00 $</div>
                                    <button className="btn error">Обменять</button>
                                </div>
                                <div className="wallet__table-row">
                                    <div className="wallet__table-coin">
                                        Tonium{" "}
                                        <span className="usd">USD 0,00661 $</span>
                                    </div>
                                    <div>36,00 $</div>
                                    <button className="btn">Обменять</button>
                                </div>
                                <div className="wallet__table-row">
                                    <div className="wallet__table-coin">
                                        Tonium{" "}
                                        <span className="usd">USD 6,86 $</span>
                                    </div>
                                    <div>0,00 $</div>
                                    <button className="btn">Обменять</button>
                                </div>
                                <div className="wallet__table-row">
                                    <div className="wallet__table-coin">
                                        Tonium{" "}
                                        <span className="usd">USD 6,86 $</span>
                                    </div>
                                    <div>0,00 $</div>
                                    <button className="btn">Обменять</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

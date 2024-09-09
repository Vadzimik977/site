import Layout from "../components/Layout";

export default function Wallet() {
    return (
        <Layout>
            <div class="main__inner">
                <div class="wallet">
                    <div class="wallet__row">
                        <div class="wallet__title">Кошелёк</div>
                        <div class="wallet__balance">
                            Баланс
                            <div>
                                <span class="wallet-total_tap">000</span> GC
                            </div>
                        </div>
                    </div>
                    <div class="wallet__table">
                        <div class="wallet__table-inner">
                            <div class="wallet__table-header">
                                <div>Монета</div>
                                <div>Баланс</div>
                            </div>
                            <div class="wallet__table-row">
                                <div class="wallet__table-coin">
                                    Tonium{" "}
                                    <span class="usd">USD 66 456,73 $</span>
                                </div>
                                <div>100,00 $</div>
                                <button class="btn btn-to error">
                                    Вывести
                                </button>
                            </div>
                            <hr class="wallet__table-hr" />
                            <div class="wallet__table-wrapper">
                                <div class="wallet__table-row">
                                    <div class="wallet__table-coin">
                                        Tonium{" "}
                                        <span class="usd">USD 0,01322 $</span>
                                    </div>
                                    <div>72,00 $</div>
                                    <button class="btn error">Обменять</button>
                                </div>
                                <div class="wallet__table-row">
                                    <div class="wallet__table-coin">
                                        Tonium{" "}
                                        <span class="usd">USD 0,00661 $</span>
                                    </div>
                                    <div>36,00 $</div>
                                    <button class="btn">Обменять</button>
                                </div>
                                <div class="wallet__table-row">
                                    <div class="wallet__table-coin">
                                        Tonium{" "}
                                        <span class="usd">USD 6,86 $</span>
                                    </div>
                                    <div>0,00 $</div>
                                    <button class="btn">Обменять</button>
                                </div>
                                <div class="wallet__table-row">
                                    <div class="wallet__table-coin">
                                        Tonium{" "}
                                        <span class="usd">USD 6,86 $</span>
                                    </div>
                                    <div>0,00 $</div>
                                    <button class="btn">Обменять</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

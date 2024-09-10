import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { fetchDefaultUser } from "../assets/js/getUser";
import { getUserWallet } from "../utils/axios";

export default function Wallet() {
    const [wallet, setWallet] = useState(true);
    const [ton, setTon] = useState(window?.user?.ton ?? 0);
    const [coins, setCoins] = useState(window?.user?.coins ?? 0);

    async function getWallet() {
        setTimeout(async() => {
            await getUserWallet().then((data) => {
                setWallet(data);
            });
        }, 500)
    }
    useEffect(() => {
        getWallet();
    }, []);
    return (
        <Layout>
            <div className="main__inner">
                <div className="wallet">
                    <div className="wallet__row">
                        <div className="wallet__title">Кошелёк</div>
                        <div className="wallet__balance">
                            Баланс
                            <div>
                                <span className="wallet-total_tap">
                                    {coins ?? 0}
                                </span>{" "}
                                GC
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
                                <div>{ton * 5} $</div>
                                <button className="btn btn-to error">
                                    Вывести
                                </button>
                            </div>
                            <hr className="wallet__table-hr" />
                            <div className="wallet__table-wrapper">
                                <div className="wallet__table-row">
                                    <div className="wallet__table-coin">
                                        Tonium{" "}
                                        <span className="usd">
                                            USD 0,01322 $
                                        </span>
                                    </div>
                                    <div>72,00 $</div>
                                    <button className="btn error">
                                        Обменять
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

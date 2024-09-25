import { useEffect, useState, Suspense } from "react";
import Layout from "../components/Layout";
import BorderAnimation from "../assets/js/animatedBorder";
import { createWalletElement, getPlanets } from "../utils/axios";
import plus from "../assets/js/plus";
import Planet from "../components/Planet";
import { fetchDefaultUser } from "../assets/js/getUser";
import { useTranslation } from "react-i18next";
import _ from "lodash";
import { ColorRing } from "react-loader-spinner";

export default function Planets() {
    const [planets, setPlanets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState([0, 9]);
    const { t } = useTranslation();

    const fetchPlanets = async () => {
        return await getPlanets(range, false, window?.user?.id ?? 0);
    };

    async function fetch(endRange) {
        if (endRange) {
            range[1] = endRange;
        }
        setTimeout(async () => {
            const data = await fetchPlanets();
            setPlanets(data);
            setLoading(false);
        }, 500);
    }
    useEffect(() => {
        document.addEventListener('getUser', () => {
            setLoading(true);
            fetch();
        })
    }, [window.user, window.adress]);
    return (
        <Layout>
            <Suspense>
                <div className="main__inner" style={{ position: "relative" }}>
                    <h1 className="main__title">{t("buyPlanet")}</h1>
                    <h6 className="main__text">{t("upgradePlanet")}</h6>
                    <div className="planets">
                        {planets?.length ? (
                            <>
                                {planets?.map((item, idx) => (
                                    <Planet
                                        idx={item.element.index}
                                        update={fetch}
                                        planet={item}
                                        key={item.id}
                                    />
                                ))}
                            </>
                        ) : (
                            <div className="color-ring-wrapper planets-ring">
                                <ColorRing
                                    visible={true}
                                    height={1000}
                                    width={500}
                                    colors={[
                                        "#e15b64",
                                        "#f47e60",
                                        "#f8b26a",
                                        "#abbd81",
                                        "#849b87",
                                    ]}
                                />
                            </div>
                        )}
                    </div>
                    <button
                        className={`btn btn-show ${
                            range[1] >= 119 ? "hidden" : ""
                        }`}
                        onClick={() => fetch(range[1] + 10)}
                        style={{display: 'flex', justifyContent: 'center'}}
                    >
                        {t("showMore")}
                    </button>
                </div>
            </Suspense>
        </Layout>
    );
}

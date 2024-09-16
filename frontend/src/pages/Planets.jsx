import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import BorderAnimation from "../assets/js/animatedBorder";
import { createWalletElement, getPlanets } from "../utils/axios";
import plus from "../assets/js/plus";
import Planet from "../components/Planet";
import { fetchDefaultUser } from "../assets/js/getUser";
import { useTranslation } from 'react-i18next';
import _ from 'lodash'

export default function Planets() {
    const [planets, setPlanets] = useState([]);
    const [loading ,setLoading] = useState(true);
    const [range, setRange] = useState([0, 9]);
    const { t } = useTranslation();

    const fetchPlanets = async () => {
        return await getPlanets(range, false);
    };

    async function fetch(endRange) {
        if(endRange) {
            range[1] = endRange;
        }
        console.log(window.user)
        const data = await fetchPlanets();
        setPlanets(data);
        setLoading(false)
    }
    useEffect(() => {
        setLoading(true)
        fetch();
    }, []);
    return (
        <Layout>
            <div className="main__inner">
                <h1 className="main__title">
                    {t('buyPlanet')}
                </h1>
                <h6 className="main__text">
                    {t('upgradePlanet')}
                </h6>
                <div className="planets">
                    {planets?.length && planets?.map((item, idx) => <Planet idx={item.element.index} update={fetch} planet={item} key={item.id} />)}
                    <button className={`btn btn-show ${range[1] >= 119 ? 'hidden' : ''}`} onClick={() => fetch(range[1] + 10)}>
                        {t('showMore')}
                    </button>
                </div>
            </div>
        </Layout>
    );
}

import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import BorderAnimation from "../assets/js/animatedBorder";
import { createWalletElement, getPlanets } from "../utils/axios";
import plus from "../assets/js/plus";
import Planet from "../components/Planet";
import { fetchDefaultUser } from "../assets/js/getUser";
import _ from 'lodash'

export default function Planets() {
    const [planets, setPlanets] = useState([]);
    const [loading ,setLoading] = useState(true);
    const [range, setRange] = useState([0, 9]);

    const fetchPlanets = async () => {
        return await getPlanets(range, false);
    };

    async function fetch(endRange) {
        if(endRange) {
            range[1] = endRange;
        }
        
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
                    Приобретение планеты открывает доступ к добыче уникальных
                    ресурсов в автоматическом режиме.
                </h1>
                <h6 className="main__text">
                    Улучшайте свои планеты, чтобы увеличить скорость добычи и
                    максимизировать прибыль. Вложитесь в космические активы и
                    станьте лидером на рынке
                </h6>
                <div className="planets">
                    {planets?.length && planets?.map((item, idx) => <Planet idx={idx + 1} update={fetch} planet={item} key={item.id} />)}
                    <button className={`btn btn-show ${range[1] >= 119 ? 'hidden' : ''}`} onClick={() => fetch(range[1] + 10)}>
                        Показать ещё
                    </button>
                </div>
            </div>
        </Layout>
    );
}

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

    const getWalletValue = async () => {
        if(!window?.user?.id) { setTimeout(async() => {await getWalletValue()}, 200); return; }
        const elements = planets.map(planet => planet?.element);
        
        const els = elements.filter(item => {
            if(window.user?.balance?.length) {
                return !window?.user?.balance.some(val => val.elementId === item.id)
            };
            return true;
        })
        console.log(els)
        const uniq = els.filter((obj, idx, arr) => idx === arr.findIndex((t) => t.id === obj.id));
        
       uniq.map(async(item) => {
            await createWalletElement(item.id);
        });

        await fetchDefaultUser();
        return
    };

    const fetchPlanets = async () => {
        return await getPlanets();
    };

    useEffect(() => {
        if(!loading) {
            getWalletValue();
        }
    }, [loading])

    async function fetch() {
        const data = await fetchPlanets();
        setPlanets(data);
        setLoading(false)
    }
    useEffect(() => {
        setLoading(true)
        fetch();

        document.querySelectorAll(".animated-border").forEach((element) => {
            new BorderAnimation(element);
        });
        plus();
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
                    {planets?.length && planets?.map((item) => <Planet update={fetch} planet={item} key={item.id} />)}
                </div>
            </div>
        </Layout>
    );
}

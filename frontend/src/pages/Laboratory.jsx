import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getPlanets, updateUser } from "../utils/axios";
import { ColorRing } from "react-loader-spinner";
import Timer from "../components/Timer";
import showPopup from "../assets/js/showPopup";
import { updateWalletElement } from "../utils/axios";
import { fetchDefaultUser } from "../assets/js/getUser";

export default function Laboratory() {
    const [elems, setElems] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [wallet, setWallet] = useState(false);

    const fetchPlanets = async () => {
        const planets = await getPlanets([0, 9], true);
        setIsLoading(false);
        setElems(planets);
    };

    async function getWallet() {
        setTimeout(async() => {
            setWallet(window?.user?.wallet)
        }, 500)
    }

    const getPlanetWallet = (id) => {
        if(window?.user?.wallet?.value) {
            const walletValue = window?.user?.wallet.value;
            const elem = walletValue.find(item => item.element === id)
            
            return elem?.value ?? 0;
        }
        return 0
    }

    const showModal = (event, status) => {
        const laboratoryElement = event.target.closest('.laboratory');
        let content, additionalClasses = ['laboratory__popup'];

        if (status === 'complete') {
            content = '<div class="laboratory__popup-title">объединение прошло успешно</div>';
        } else {
            content = '<div class="laboratory__popup-title">Ошибка</div><div class="laboratory__popup-text">Какой-то из элементов равен 0</div>';
        }

        content = '<div class="popup__inner">' + content + '</div>';

        showPopup(laboratoryElement, content, additionalClasses);
    }

    useEffect(() => {
        fetchPlanets();
        getWallet();
    }, []);



    const union = async (event) => {
        if(!window.user.wallet.value?.length) {
            showModal(event)
        }
        
        const minVal = elems.map(item => ({...item.element, value: getPlanetWallet(item.element.id)}))
        
        const min = Math.min(...minVal.map(item => item.value));
        const data = window.user.wallet.balance;
        
        if(min === 0) {
            showModal(event);
            return;
        }

        let newValues = minVal.map(item => ({...item, element: item.id, value: parseFloat((item.value - min).toFixed(10))}));

        newValues = newValues.map(item => ({
            element: item.id,
            img: item.img,
            name: item.name,
            rare: item.rare,
            symbol: item.symbol,
            value: item.value
        }))

        const updatedValues = 
            [...window.user.wallet.value.filter((item) => !newValues.some(val => val.element === item.element)), ...newValues];

        await updateWalletElement(window.user.wallet, updatedValues);
        await updateUser({ton: min + window.user.ton})
        window.user.ton = min + window.user.ton
        await fetchDefaultUser();
        await getWallet();
        showModal(event, 'complete')
    }

    return (
        <Layout>
            <div className="main__inner">
                <h1 className="main__title">
                    Каждый день tonium меняет свой внутренний код, требуя для
                    воссоздания семь уникальных элементов.
                </h1>
                <div className="laboratory">
                    <div className="laboratory__time">
                        <div className="laboratory__time-text">
                            До смены элементов осталось
                        </div>
                        <div className="laboratory__time-timer">
                            <Timer />
                        </div>
                    </div>
                    {!isLoading ? (
                        <div className="laboratory__items">
                            {elems.map((item) => (
                                <div>
                                    <img
                                        style={{ width: "85px" }}
                                        src={`/img/icon/${item.element.img}`}
                                        alt=""
                                    />
                                    <span>{getPlanetWallet(item.element.id)} {item.element.symbol}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="color-ring-wrapper">
                            <ColorRing
                                visible={isLoading}
                                height={80}
                                width={80}
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
                    <button className="laboratory__button " onClick={(e) => union(e)}>Объединить</button>
                    <div className="laboratory__text">
                        Синтез - в разработке!
                    </div>
                </div>
            </div>
        </Layout>
    );
}

import { debounce } from "lodash";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { createWalletElement, updateWalletElement } from "../utils/axios";
import { fetchDefaultUser } from "../assets/js/getUser";

export default function Planet({ idx, planet, update }) {
    const { id, name, element, img, speed, updatePrice, forLaboratory } = planet;
    const getInitState = () => {
        setValue(window?.user?.balance?.find(bal => bal.elementId === element.id)?.value);
    }
    const [value, setValue] = useState(0);

    const [click, setClick] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

   
    const updateFn = debounce(async (value) => {
        if (isLoading) {
            setTimeout(() => {
                updateFn(value);
            }, 200);
            return;
        }
        if (window.user?.balance?.length) {
            const balance = window.user?.balance;
            const currentElem = balance.find(
                (item) => item.elementId === element.id
            );

            if (currentElem?.id) {
                setIsLoading(true)
                console.log(currentElem.value, value, currentElem + value)
                await putWallet(currentElem, value + currentElem.value);
                setValue(value + currentElem.value);
                await fetchDefaultUser()
                
                setIsLoading(false)
            }
        }
    }, 100);
    const debounceFn = useCallback((click) => updateFn(click), []);

    const putWallet = async (walletId, value) => {
        await updateWalletElement(walletId, value);
    };

    const walletUpdate = async () => {
        setClick(click + 1);

        const update = 0.0005;


        debounceFn(update);
    };

    useEffect(() => {
        getInitState()
    }, [isLoading, window?.user]);

    return (
        <div
            className="planets__planet animated-border-container ver1 with_To rotate"
            onClick={() => walletUpdate()}
        >
            <div className="animated-border">
                <div className="planet__img">
                    <img src={`/img/planet/${img}`} alt="" />
                </div>
                <div className="planet__information">
                    <h4 className="planet__title">
                        {name}({element?.symbol}) - Planet #{idx}
                    </h4>
                    <p className="planet__lvl">level 1</p>
                    <p className="planet__speed">
                        Speed: {speed} ({element?.symbol})/час
                    </p>
                    <p className="planet__description">
                        The extracted resourse is {element?.name}(
                        {element?.symbol})
                    </p>
                    <p className="planet__gc">
                        {value} {element?.symbol}
                    </p>
                </div>
                <div className="planet__price">
                    Стоимость апгрейда <span>3 GC</span>
                </div>
                <div className="planet__row">
                    <button className="btn upgrade">Обновить</button>
                    {forLaboratory ? (
                        <div className="planet__time-block">
                            {/* <!-- Если нужны английские подписи к числам, то добавь к этому блоку класс eng --> */}
                            <div className="time-block__timer">
                                <span className="days">003</span> :{" "}
                                <span className="hours">22</span> :{" "}
                                <span className="minutes">29</span> :{" "}
                                <span className="seconds">57</span>
                            </div>
                            <div className="time-block__text">
                                участвует в объединении тониума
                            </div>
                        </div>
                    ) : (
                        ""
                    )}
                </div>
            </div>
        </div>
    );
}

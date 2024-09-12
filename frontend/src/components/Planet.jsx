import { debounce } from "lodash";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { createWalletElement, updateWalletElement } from "../utils/axios";
import { fetchDefaultUser } from "../assets/js/getUser";
import BorderAnimation from "../assets/js/animatedBorder";

export default function Planet({ idx, planet, update }) {
    const { id, name, element, img, speed, updatePrice, forLaboratory } = planet;
    const getInitState = () => {
        setValue(window?.user?.wallet?.value.find(bal => bal.element === element.id)?.value);
    }
    const [value, setValue] = useState(0);

    const [click, setClick] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const animated = useRef(null);

    const updateFn = debounce(async (val) => {
        if (isLoading) {
            setTimeout(() => {
                updateFn(val);
            }, 200);
            return;
        }
        
        if (window.user?.wallet?.value) {
            const balance = window.user?.wallet?.value;
            
            const currentElem = balance.find(
                (item) => item.element === element.id
            );

            if (currentElem?.element) {
                setIsLoading(true)
                currentElem.value = currentElem.value + val;
                const data = [...balance.filter(bal => bal.element !== element.id), {...currentElem}];
                setValue(currentElem.value);
                console.log(value)
                await putWallet(window.user.wallet, data);
                
                setIsLoading(false)
            } else {
                let data;
                if(window.user.wallet.value?.length) {
                    data = [
                        ...window.user.wallet.value,
                        {element: element.id, value: val}
                    ]
                } else {
                    data = [
                        {
                            element: element.id,
                            value: val
                        }
                    ];
                }
                setValue(val);
                await putWallet(window.user.wallet, data);
            }
            await fetchDefaultUser()
        }
    }, 100);
    const debounceFn = useCallback((click) => updateFn(click), []);

    const putWallet = async (walletId, value) => {
        await updateWalletElement(walletId, value);
    };

    const walletUpdate = async (e) => {
        if (e.target.tagName.toLowerCase() === 'button') return;

        const plusIcon = document.createElement('div');
        plusIcon.textContent = '+';
        plusIcon.classList.add('plus-icon');
        plusIcon.style.left = `${e.pageX}px`;
        plusIcon.style.top = `${e.pageY}px`;

        document.body.appendChild(plusIcon);
        plusIcon.addEventListener('animationend', () => plusIcon.remove());
        setClick(click + 1);

        const update = speed;

        debounceFn(update);
    };

    useEffect(() => {
        getInitState()
    }, [isLoading, window?.user]);

    useEffect(() => {
        new BorderAnimation(animated.current)
    }, [])

    const userHasPlanet = () => {
        if(window?.user?.nft) {
            const arr = window.user.nft;
            const fullName = `${name}(${element?.symbol}) - Planet #${idx}`;
            arr.find(item => item.metadata.name === fullName);
            return arr.length
        }
        return false;
    }

    return (
        <div
            className={`planets__planet animated-border-container with_To rotate ${forLaboratory ? 'ver3' : userHasPlanet() ? 'ver1' : 'ver2' }`}
            onClick={(e) => walletUpdate(e)}
        >
            <div className="animated-border" ref={animated}>
                <div className="planet__img" style={{'--planet-bg': `url(/img/icon/${element.img})`}}>
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
                        {value ?? '0.000'} {element?.symbol}
                    </p>
                </div>
                <div className="planet__price">
                    Стоимость апгрейда <span>3 GC</span>
                </div>
                <div className="planet__row">
                    {userHasPlanet() ? 
                        <button className="btn upgrade">Обновить</button>
                        : <button className="btn buy">Купить</button>
                    }
                    
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

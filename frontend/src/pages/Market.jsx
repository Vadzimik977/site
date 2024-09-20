import Layout from "../components/Layout";
import '../assets/js/input'
import { useEffect, useState } from "react";
import marketAdaptiv from "../assets/js/marketAdaptiv";
import customSelect from "../assets/js/customSelect";
import popups from "../assets/js/popups";
import scroll from "../assets/js/scroll";
import input from "../assets/js/input";
import newCustomSelect from "../assets/js/newCustomSelect";
import { getElements, getUserWallet, updateHistory, updateUser, updateWalletElement } from "../utils/axios";
import showPopup from "../assets/js/showPopup";
import { fetchDefaultUser } from "../assets/js/getUser";
import { useTranslation } from "react-i18next";
export default function Market() {
    const [first, setFirst] = useState(0);
    const [second, setSecond] = useState(0);
    const [max, setMax] = useState(0);
    const [maxTon, setMaxTon] = useState(0);
    const [wallet, setWallet] = useState(true);
    const [rare, setRare] = useState();
    const [item, setItem] = useState();
    const [isHistory, setIsHistory] = useState(false);

    const [firstModal, setFirstModal] = useState(false);
    const [secondModal, setSecondModal] = useState(false);

    const [isRevert, setIsRevert] = useState(false);
    const [historyIndex, setHistoryIndex] = useState(5);

    const [elements, setElements] = useState();

    const { t } = useTranslation();

    async function getWallet() {
        setTimeout(async() => {
            setWallet(window?.user?.wallet)
            const elems = await getElements();
            console.log(elems)
            setElements(elems);
        }, 500)
    }
    const changeInput = (value, first) => {
        setFirst(value)
        setMaxTon(window.user.coins)
        //let newValue = value = value.replace(/^[.0-9]*$/, '');
        //newValue = Math.min(parseInt(value) || 0, item.value);
        let newValue = value
        console.log(value)
        if(!isRevert) {
            if(newValue > max) {
                newValue = max
            }
        } else {
            if(newValue > maxTon) {
                newValue = maxTon
            }
        }
        if(first) {
            setFirst(newValue);
            
            let coeff;
            switch(item.rare) {
                case 'Обычная':
                    coeff = 1;
                    break;
                case 'Редкая':
                    coeff = 2;
                    break;
                case 'Эпическая':
                    coeff = 3;
                    break;
            }

           if(!isRevert) {
               setSecond(parseFloat((newValue * coeff).toFixed(6)))
           } else {
            setSecond(parseFloat(newValue / coeff).toFixed(6))
           }
        }
        
    }
    useEffect(() => {
        getWallet();

        window.addEventListener('click', (e) => {
            if(!e.target.classList.contains('modal-select')) {
                if(firstModal || secondModal) {
                    setFirstModal(false);
                    setSecondModal(false)
                }
            }
        });
    }, []);

    const showModal = (event, status) => {
        const planetElement = event.target.closest('.market__trade');
        let content, additionalClasses = ['market__popup'];

        if (status === 'complete') {
            content = `<div class="market__popup-title">${t('exchangeSuccess')}</div><div class="market__popup-text">${t('balanceUpd')}</div>`;
        } else if (status === 'error') {
            content = `<div class="market__popup-title">${t('modalError')}</div><div class="market__popup-text">${t('notEnought')}</div>`;
        } else {
            content = `<div class="market__popup-title">${t('tryAgain')}</div>`;
        }

        content = '<div class="popup__inner">' + content + '</div>';

        showPopup(planetElement, content, additionalClasses);
    }

    const exchange = async (event) => {
        let history;
        let oldValue;

        if(!isRevert) {
            oldValue = item.value
            item.value = +item.value - first;
        } else {
            if(item.value) {
                console.log(item.value)
                oldValue = item.value
                item.value = +item.value + (+second);
            } else {
                oldValue = 0;
                item.value = +second;
            }
        }
        let data;
        if (window.user.wallet.value?.length) {
            console.log(item.value)
            data = [
                ...window.user.wallet.value.filter(i => i.element !== item.element),
                {
                    element: item.element ?? item?.id,
                    value: item.value,
                    name: item.name,
                    img: item.img,
                    symbol: item.symbol,
                    rare: item.rare,
                },
            ];
        } 
        if(window.user.history.value?.length) {
            history = [
                ...window.user.history.value,
                {
                    element: item.element,
                    newValue: +item.value,
                    oldValue: oldValue,
                    name: item.name,
                    img: item.img,
                    symbol: item.symbol,
                    rare: item.rare,
                },
            ]
        } else {
            history = [
                {
                    element: item.element,
                    newValue: +item.value,
                    oldValue: oldValue,
                    name: item.name,
                    img: item.img,
                    symbol: item.symbol,
                    rare: item.rare,
                }
            ]
        }

        await updateWalletElement(window.user.wallet, data)

        if(!isRevert) {
            await updateUser({coins: second + window.user.coins})
            window.user.coins = second + window.user.coins
            history.push(
                {
                    img: '/images/ton2.svg',
                    name: 'GameCoin',
                    newValue: window.user.coins,
                    oldValue: parseFloat(window.user.coins) - parseFloat(second),
                }
            )
        } else {
            if(window.user.coins - first < 0) {
                showModal(event, 'error');
            }

            await updateUser({coins: window.user.coins - first})
            window.user.coins = window.user.coins - first;
            history.push(
                {
                    img: '/images/ton2.svg',
                    name: 'GameCoin',
                    newValue: parseFloat(window.user.coins),
                    oldValue: parseFloat(window.user.coins) + parseFloat(first),
                }
            )
            
        }
        setWallet((wall) => ({...wall, value: data}));
        showModal(event, 'complete')
        updateHistory(window.user.history, history);
        window.user.history.value = history;
        setFirst(0)
        setSecond(0)
    }

    useEffect(() => {
        const banners = document.querySelectorAll('.compact-select');
        console.log(!!item?.element)

        banners.forEach(val => {
            console.log(val)
            if(val.querySelector('.selected-option.elem')) {
                if(item?.img) {

                    const a =val.querySelector('.selected-option.elem')
                    a.innerHTML = `<img class="crypto-icon" src='/img/icon/${item?.img}' />${item?.name}`;
                    console.log(a)
                }
                
            }
        })
    }, [item?.img])

    const replaceAmounts = (e) => {
        setIsRevert(!isRevert);
        const banners = document.querySelectorAll('.compact-select');

        const firstBanner = banners[0].innerHTML;
        const secondBanner = banners[1].innerHTML;
        banners[0].innerHTML = secondBanner;
        banners[1].innerHTML = firstBanner
        
        banners.forEach(val => {
            console.log(val)
            if(val.querySelector('.selected-option.elem')) {
                if(item?.img) {
                    const a =val.querySelector('.selected-option.elem')
                    a.innerHTML = `<img class="crypto-icon" src='/img/icon/${item?.img}' />${item?.name}`;
                    console.log(a)
                }
                
            }
        })

        setFirst(0);
        setSecond(0);
    }   
    
    return (
        <Layout>
            <div className="main__inner">
                <h1 className="main__title">
                    {t('marketTitle')}
                </h1>
                <h6 className="main__text">
                {t('marketSubTitle')}
                </h6>
                <div className="market">
                    {!isHistory ?
                    
                    <div className="market__trade">
                        <div className="market__row">
                            <div className="market__title">{t('change').toUpperCase()}</div>
                            <div className="market__settings" onClick={() => {setIsHistory(true); setIsRevert(false)}}>
                                <img src="/images/reload.svg" alt="" />
                            </div>
                        </div>
                        <div className="market__banner">
                            <div className="market__banner-choice">
                                <div className="compact-select" onClick={() => isRevert ? setSecondModal(true) : setFirstModal(true)}>
                                    <div className="selected-option elem">
                                    {
                                    item?.element ?
                                        (
                                            <div className="elem">
                                                <img className="crypto-icon" src={`/img/icon/${item?.img}`} />
                                                {item?.name}
                                            </div>
                                        ) : t('click')}
                                    </div>
                                </div>
                            
                                <div
                                    tabIndex={1}
                                    className={`modal-select ${!firstModal ? 'hidden' : ''}`}
                                >
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h2>{t('chooseActive')}</h2>
                                            <p>{t('payFor')}</p>
                                            <button className="close-button" onClick={() => setFirstModal(false)}>
                                                &times;
                                            </button>
                                        </div>
                                        <div className="search-container">
                                            <input
                                                type="text"
                                                className="search-input"
                                                placeholder={t('monetAdres')}
                                            />
                                        </div>
                                        <div className="options-list map__options">
                                            
                                        {wallet?.value?.length ? !isRevert ? wallet?.value?.map(item =>(
                                            <div
                                                onClick={() => {
                                                    const rare = item.rare;
                                                    const rares = ['Обычная', "Редкая", "Эпическая"];
                                                    const coeff = rares.findIndex(val => val === rare) + 1;
                                                    console.log(coeff)
                                                    setItem({...item, element: item?.element ?? item?.id}); 
                                                    setFirst(item.value);
                                                    setSecond(parseFloat((item.value * coeff).toFixed(6))); 
                                                    setMax(item.value); 
                                                    
                                                    
                                                    setFirstModal(false)}}
                                                className="option"
                                                data-value={item?.name}
                                                data-label={item?.symbol}
                                                data-sublabel="Select"
                                                data-amount="1"
                                                key={item?.element}
                                                data-icon="/images/ton2.svg"
                                                style={{display: "flex"}}
                                            >
                                                <img
                                                    src={`/img/icon/${item.img}`}
                                                    alt=""
                                                    className="crypto-icon"
                                                />
                                                
                                                    <>
                                                    <div onClick={() => {}} key={item.id} className="option-text">
                                                        <span className="crypto-name">
                                                            {item?.name}
                                                        </span>
                                                        <span className="crypto-sublabel">
                                                            {item?.symbol}
                                                        </span>
                                                    </div>
                                                    <span className="crypto-amount">
                                                        {item?.value}
                                                    </span>
                                                </>
                                            </div>
                                                )) : elements.map(item => (
                                                    <div
                                                        onClick={() => {
                                                        const rare = item.rare;
                                                        const rares = ['Обычная', "Редкая", "Эпическая"];
                                                        const coeff = rares.findIndex(val => val === rare) + 1;
                                                        console.log(item)
                                                        setItem({...item, element: item.id}); 
                                                        setFirst(0);
                                                        setSecond(0); 
                                                        setMax(0); 
                                                        
                                                        
                                                        setFirstModal(false)}}
                                                className="option"
                                                data-value={item?.name}
                                                data-label={item?.symbol}
                                                data-sublabel="Select"
                                                data-amount="1"
                                                key={item?.id}
                                                data-icon="/images/ton2.svg"
                                                style={{display: "flex"}}
                                            >
                                                <img
                                                    src={`/img/icon/${item.img}`}
                                                    alt=""
                                                    className="crypto-icon"
                                                />
                                                
                                                    <>
                                                    <div onClick={() => {}} key={item.id} className="option-text">
                                                        <span className="crypto-name">
                                                            {item?.name}
                                                        </span>
                                                        <span className="crypto-sublabel">
                                                            {item?.symbol}
                                                        </span>
                                                    </div>
                                                </>
                                            </div>
                                                )) : ''}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="market__banner-number">
                                <input
                                    type="text"
                                    className="market__banner-input market__banner-input-1 positive-number-input"
                                    onChange={e => {
                                        changeInput(e.target.value, true)
                                    }}
                                    max={max}
                                    value={first}
                                />
                            </div>
                        </div>
                        <div title="Поменять местами" onClick={(e) => replaceAmounts(e)} className="arrows">
                            <img className="arrow-svg" src='/images/arrow2.svg' />
                            <img className="arrow-svg-2" src='/images/arrow2.svg' />
                        </div>
                        <div className="market__banner">
                            <div className="market__banner-choice">
                                <div className="compact-select" onClick={() => isRevert ? setFirstModal(true) : setSecondModal(true)}>
                                    <div className="selected-option iston">
                                        <img src="/images/ton2.svg" alt="" class="crypto-icon" />
                                        GC
                                    </div>
                                </div>

                                <div
                                    className={`modal-select ${secondModal ? '' : 'hidden'}`}
                                >
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h2>{t('chooseActive')}</h2>
                                            <p>{t('payFor')}</p>
                                            <button className="close-button" onClick={() => setSecondModal(false)}>
                                                &times;
                                            </button>
                                        </div>
                                        <div className="search-container">
                                            <input
                                                type="text"
                                                className="search-input"
                                                placeholder={t('monetAdres')}
                                            />
                                        </div>
                                        <div className="options-list">
                                            <div
                                                className="option"
                                                data-value="toncoin"
                                                data-label="ТОННА"
                                                data-sublabel="Toncoin"
                                                data-amount="0"
                                                data-icon="./images/ton2.svg"
                                                onClick={() => setSecondModal(false)}
                                            >
                                                <img
                                                    src="/images/ton2.svg"
                                                    alt=""
                                                    className="crypto-icon"
                                                />
                                                <div className="option-text">
                                                    <span className="crypto-name">
                                                        GC
                                                    </span>
                                                    <span className="crypto-sublabel">
                                                        Game Coin
                                                    </span>
                                                </div>
                                                <span className="crypto-amount">
                                                    {window?.user?.coins}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="market__banner-number">
                                <input
                                    type="number"
                                    className="market__banner-input market__banner-input-2 positive-number-input"
                                    value={second}
                                    disabled={true}
                                    onChange={(e) => setSecond(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="btn btn-obmen" onClick={(event) => exchange(event)}>{t('martketBtn')}</div>
                    </div> :
                    <div className="market__history">
                        <div className="market__row">
                            <div className="market__title">{t('history')}</div>
                            <div className="market__settings" onClick={() => setIsHistory(false)}>
                                <img src="/images/reload.svg" alt="" />
                            </div>
                        </div>
                        <div className="history__items">
                            {
                                window?.user?.history?.value?.reverse()?.map((item, i) => (
                                    i !== historyIndex && i < historyIndex ?
                                    <div className={`history__item ${item?.newValue < item?.oldValue ? 'red' : ''}`}>
                                        <img src="/images/ton2.svg" alt="" />
                                        <span>{item?.name}</span>
                                        <span className="money">{
                                            item?.oldValue > item?.newValue 
                                            ?  `- ${(item?.oldValue - item?.newValue).toFixed(5)}` : `+ ${(item?.newValue - item?.oldValue).toFixed(5)}`
                                            }</span>
                                    </div> : ''
                                ))
                            }

                        </div>
                        
                        {historyIndex < window?.user?.history?.value?.length ? <div className="btn" onClick={() => setHistoryIndex(historyIndex + 5)}>Еще</div> : ''}
                    </div>
                    }
                </div>
            </div>
        </Layout>
    );
}

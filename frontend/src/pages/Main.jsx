
import { TonConnectButton } from "@tonconnect/ui-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Select from 'react-select';
import { useTranslation } from "react-i18next";
import { getUser, createUser } from "../utils/axios";

export default function Main() {
    const text = useRef(null);
    const title = useRef(null);
    const img = useRef(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [lang, setLang] = useState(localStorage.getItem('lang') ?? 'ru');
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    console.log("Main user", user);

    useEffect(() => {
        const initUser = async () => {
            let storedUser = localStorage.getItem('user');
            if (storedUser) {
                storedUser = JSON.parse(storedUser);
                setUser(storedUser);
                window.user = storedUser;
                return;
            }

            const existingUser = await getUser();
            if (existingUser) {
                setUser(existingUser);
                localStorage.setItem('user', JSON.stringify(existingUser));
                window.user = existingUser;
            } else {
                const newUser = await createUser();
                setUser(newUser);
                localStorage.setItem('user', JSON.stringify(newUser));
                window.user = newUser;
            }
        };

        initUser();
    }, []);

    const slides = [
        {
            id: 0,
            title: t("s1Title"),
            text: t("s1Text"),
            image: "/images/1.png",
        },
        {
            id: 1,
            title: t("s2Title"),
            text: t("s2Text"),
            image: "/images/2.png",
        },
        {
            id: 2,
            title: t("s3Title"),
            text: t("s3Text"),
            image: "/images/3.png",
        },
        {
            id: 3,
            title: t("s4Title"),
            text: t("s4Text"),
            image: "/images/4.png",
        },
        {
            id: 4,
            title: t("s5Title"),
            text: t("s5Text"),
            image: "/images/5.png",
        },
    ];

    function changeSlide(slide) {
        if (slide === 5) {
            navigate('/planets');
        }
        if (slide === -1) return;

        text.current.classList.add('fade-out');
        title.current.classList.add('fade-out');
        img.current.classList.remove('fade-out');

        setTimeout(() => {
            setCurrentSlide(slide);
            text.current.classList.remove('fade-out');
            title.current.classList.remove('fade-out');
            img.current.classList.add('fade-out');
        }, 400);
    }

    useEffect(() => {
        const lang = localStorage.getItem('lang') ?? 'ru';
        setLang(lang);
        i18n.changeLanguage(lang);
    }, []);

    const [options] = useState([
        { value: "en", label: "EN" },
        { value: "ru", label: "RU" },
    ]);

    const changeLang = (e) => {
        setLang(e.value);
        i18n.changeLanguage(e.value);
        localStorage.setItem('lang', e.value);
    };

    return (
        <>
            <header className="app-header">
                <div className="container">
                    <div className="header__inner" style={{ width: '100%', display: 'flex', justifyContent: 'end' }}>
                        <Select
                            className="react-select__wrapper"
                            classNamePrefix={'react-select'}
                            onChange={(e) => changeLang(e)}
                            defaultValue={options.find(item => item.value === lang)}
                            options={options}
                        />
                    </div>
                </div>
            </header>
            <main className="main mt">
                <div className="container">
                    <div className="main__inner index">
                        <div className="main__imgs" ref={img}>
                            <img className="fade-out" src={slides[currentSlide].image} alt="" />
                        </div>
                        <div className="main__content">
                            <>
                                <div className="main__title" ref={title}>
                                    {slides[currentSlide].title}
                                </div>
                                <div className="main__text" ref={text}>
                                    {slides[currentSlide].text}
                                </div>
                                <div className="main__btns">
                                    <button onClick={() => changeSlide(currentSlide - 1)} className="main__btn prev">
                                        Назад
                                    </button>
                                    <button onClick={() => changeSlide(currentSlide + 1)} className="main__btn next">
                                        Далее
                                    </button>
                                    <Link to='/planets' className="main__btn">Пропустить</Link>
                                </div>
                            </>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

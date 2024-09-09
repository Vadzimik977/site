import { TonConnectButton } from "@tonconnect/ui-react";
import { useEffect, useRef, useState } from "react";
import { slides } from "./data/main";
import { Link } from "react-router-dom";
export default function Main() {
    const text = useRef(null);
    const title = useRef(null);
    const img = useRef(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    function changeSlide(slide) {
        if(slide === 5) {
            /* todo: router */
        }
        if(slide === -1) {
            return
        }
        text.current.classList.add('fade-out');
        title.current.classList.add('fade-out');
        img.current.classList.remove('fade-out');
        
        setTimeout(() => {
            setCurrentSlide(slide)
            text.current.classList.remove('fade-out');
            title.current.classList.remove('fade-out');
            img.current.classList.add('fade-out');
        }, 400)
    }

    return (
        <>
            <header>
                <div class="container">
                    <div class="header__inner">
                        <TonConnectButton id="ton-connect" />
                    </div>
                </div>
            </header>
            <main class="main mt">
                <div class="container">
                    <div class="main__inner index">
                        <div class="main__imgs" ref={img}>
                            <img className="fade-out" src={slides[currentSlide].image} alt="" />
                        </div>
                        <div class="main__content">
                            <>
                                <div class="main__title" ref={title}>
                                    {slides[currentSlide].title}
                                </div>
                                <div class="main__text" ref={text}>
                                    {slides[currentSlide].text}
                                </div>
                                <div class="main__btns">
                                    <button
                                        onClick={() =>{
                                            changeSlide(currentSlide - 1)
                                        }
                                        }
                                        class="main__btn prev"
                                    >
                                        Назад
                                    </button>
                                    <button
                                        class="main__btn next"
                                        onClick={() =>{
                                            changeSlide(currentSlide + 1)
                                        }
                                        }
                                    >
                                        Далее
                                    </button>
                                    <Link to='/planets' className="main__btn">
                                        Пропустить
                                    
                                    </Link>
                                </div>
                            </>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

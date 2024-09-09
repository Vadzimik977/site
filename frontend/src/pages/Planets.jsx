import { useEffect } from "react";
import Layout from "../components/Layout";
import BorderAnimation from "../assets/js/animatedBorder";
import marketAdaptiv from "../assets/js/marketAdaptiv";
import customSelect from "../assets/js/customSelect";
import popups from "../assets/js/popups";
import scroll from "../assets/js/scroll";
import input from "../assets/js/input";
import newCustomSelect from "../assets/js/newCustomSelect";

export default function Planets() {
    useEffect(() => {
        document.querySelectorAll('.animated-border').forEach(element => {
            new BorderAnimation(element);
        });
        
    }, [])
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
                    <div className="planets__planet animated-border-container ver1 with_To rotate">
                        <div className="animated-border">
                            <div className="planet__img">
                                <img src="/images/planet1.png" alt="" />
                            </div>
                            <div className="planet__information">
                                <h4 className="planet__title">
                                    Hydra(H) - Planet #1
                                </h4>
                                <p className="planet__lvl">level 1</p>
                                <p className="planet__speed">Speed: 0,05 (H)/час</p>
                                <p className="planet__description">
                                    The extracted resourse is Hydrogen(H)
                                </p>
                                <p className="planet__gc">000.000 GC</p>
                            </div>
                            <div className="planet__price">
                                Стоимость апгрейда <span>3 GC</span>
                            </div>
                            <div className="planet__row">
                                <button className="btn upgrade">Обновить</button>
                            </div>
                        </div>
                    </div>

                    <div className="planets__planet animated-border-container ver1 with_To rotate">
                        <div className="animated-border">
                            <div className="planet__img">
                                <img src="/images/planet2.png" alt="" />
                            </div>
                            <div className="planet__information">
                                <h4 className="planet__title">
                                    Hydra(H) - Planet #1
                                </h4>
                                <p className="planet__lvl">level 1</p>
                                <p className="planet__speed">Speed: 0,05 (H)/час</p>
                                <p className="planet__description">
                                    The extracted resourse is Hydrogen(H)
                                </p>
                                <p className="planet__gc">000.000 GC</p>
                            </div>
                            <div className="planet__price">
                                Стоимость апгрейда <span>3 GC</span>
                            </div>
                            <div className="planet__row">
                                <button className="btn upgrade">Обновить</button>
                            </div>
                        </div>
                    </div>

                    <div className="planets__planet animated-border-container ver2 with_To with_Click rotate">
                        <div className="animated-border">
                            <div className="planet__img">
                                <img src="/images/planet3.png" alt="" />
                            </div>
                            <div className="planet__information">
                                <h4 className="planet__title">
                                    Hydra(H) - Planet #1
                                </h4>
                                <p className="planet__lvl">level 1</p>
                                <p className="planet__speed">Speed: 0,05 (H)/час</p>
                                <p className="planet__description">
                                    The extracted resourse is Hydrogen(H)
                                </p>
                                <p className="planet__gc">000.000 GC</p>
                            </div>
                            <div className="planet__row">
                                <button className="btn buy">Купить</button>
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
                            </div>
                        </div>
                    </div>

                    <div className="planets__planet animated-border-container ver2 with_To rotate">
                        <div className="animated-border">
                            <div className="planet__img">
                                <img src="/images/planet4.png" alt="" />
                            </div>
                            <div className="planet__information">
                                <h4 className="planet__title">
                                    Hydra(H) - Planet #1
                                </h4>
                                <p className="planet__lvl">level 1</p>
                                <p className="planet__speed">Speed: 0,05 (H)/час</p>
                                <p className="planet__description">
                                    The extracted resourse is Hydrogen(H)
                                </p>
                                <p className="planet__gc">000.000 GC</p>
                            </div>
                            <div className="planet__row">
                                <button className="btn buy">Купить</button>
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
                            </div>
                        </div>
                    </div>

                    <div className="planets__planet animated-border-container ver3">
                        <div className="animated-border">
                            <div className="planet__img">
                                <img src="/images/planet5.png" alt="" />
                            </div>
                            <div className="planet__information">
                                <h4 className="planet__title">
                                    Hydra(H) - Planet #1
                                </h4>
                                <p className="planet__lvl">level 1</p>
                                <p className="planet__speed">Speed: 0,05 (H)/час</p>
                                <p className="planet__description">
                                    The extracted resourse is Hydrogen(H)
                                </p>
                                <p className="planet__gc">000.000 GC</p>
                            </div>
                            <div className="planet__row">
                                <button className="btn buy">Купить</button>
                            </div>
                        </div>
                    </div>
                    <div className="planets" id="planets-container"></div>
                    <div className="planets__planet animated-border-container ver3">
                        <div className="animated-border">
                            <div className="planet__img">
                                <img src="/images/planet5.png" alt="" />
                            </div>
                            <div className="planet__information">
                                <h4 className="planet__title">
                                    Hydra(H) - Planet #1
                                </h4>
                                <p className="planet__lvl">level 1</p>
                                <p className="planet__speed">Speed: 0,05 (H)/час</p>
                                <p className="planet__description">
                                    The extracted resourse is Hydrogen(H)
                                </p>
                                <p className="planet__gc">000.000 GC</p>
                            </div>
                            <div className="planet__row">
                                <button className="btn buy">Купить</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

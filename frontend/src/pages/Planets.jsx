import Layout from "../components/Layout";

export default function Planets() {
    return (
        <Layout>
            <div class="main__inner">
                <h1 class="main__title">
                    Приобретение планеты открывает доступ к добыче уникальных
                    ресурсов в автоматическом режиме.
                </h1>
                <h6 class="main__text">
                    Улучшайте свои планеты, чтобы увеличить скорость добычи и
                    максимизировать прибыль. Вложитесь в космические активы и
                    станьте лидером на рынке
                </h6>
                <div class="planets">
                    <div class="planets__planet animated-border-container ver1 with_To rotate">
                        <div class="animated-border">
                            <div class="planet__img">
                                <img src="/images/planet1.png" alt="" />
                            </div>
                            <div class="planet__information">
                                <h4 class="planet__title">
                                    Hydra(H) - Planet #1
                                </h4>
                                <p class="planet__lvl">level 1</p>
                                <p class="planet__speed">Speed: 0,05 (H)/час</p>
                                <p class="planet__description">
                                    The extracted resourse is Hydrogen(H)
                                </p>
                                <p class="planet__gc">000.000 GC</p>
                            </div>
                            <div class="planet__price">
                                Стоимость апгрейда <span>3 GC</span>
                            </div>
                            <div class="planet__row">
                                <button class="btn upgrade">Обновить</button>
                            </div>
                        </div>
                    </div>

                    <div class="planets__planet animated-border-container ver1 with_To rotate">
                        <div class="animated-border">
                            <div class="planet__img">
                                <img src="/images/planet2.png" alt="" />
                            </div>
                            <div class="planet__information">
                                <h4 class="planet__title">
                                    Hydra(H) - Planet #1
                                </h4>
                                <p class="planet__lvl">level 1</p>
                                <p class="planet__speed">Speed: 0,05 (H)/час</p>
                                <p class="planet__description">
                                    The extracted resourse is Hydrogen(H)
                                </p>
                                <p class="planet__gc">000.000 GC</p>
                            </div>
                            <div class="planet__price">
                                Стоимость апгрейда <span>3 GC</span>
                            </div>
                            <div class="planet__row">
                                <button class="btn upgrade">Обновить</button>
                            </div>
                        </div>
                    </div>

                    <div class="planets__planet animated-border-container ver2 with_To with_Click rotate">
                        <div class="animated-border">
                            <div class="planet__img">
                                <img src="/images/planet3.png" alt="" />
                            </div>
                            <div class="planet__information">
                                <h4 class="planet__title">
                                    Hydra(H) - Planet #1
                                </h4>
                                <p class="planet__lvl">level 1</p>
                                <p class="planet__speed">Speed: 0,05 (H)/час</p>
                                <p class="planet__description">
                                    The extracted resourse is Hydrogen(H)
                                </p>
                                <p class="planet__gc">000.000 GC</p>
                            </div>
                            <div class="planet__row">
                                <button class="btn buy">Купить</button>
                                <div class="planet__time-block">
                                    {/* <!-- Если нужны английские подписи к числам, то добавь к этому блоку класс eng --> */}
                                    <div class="time-block__timer">
                                        <span class="days">003</span> :{" "}
                                        <span class="hours">22</span> :{" "}
                                        <span class="minutes">29</span> :{" "}
                                        <span class="seconds">57</span>
                                    </div>
                                    <div class="time-block__text">
                                        участвует в объединении тониума
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="planets__planet animated-border-container ver2 with_To rotate">
                        <div class="animated-border">
                            <div class="planet__img">
                                <img src="/images/planet4.png" alt="" />
                            </div>
                            <div class="planet__information">
                                <h4 class="planet__title">
                                    Hydra(H) - Planet #1
                                </h4>
                                <p class="planet__lvl">level 1</p>
                                <p class="planet__speed">Speed: 0,05 (H)/час</p>
                                <p class="planet__description">
                                    The extracted resourse is Hydrogen(H)
                                </p>
                                <p class="planet__gc">000.000 GC</p>
                            </div>
                            <div class="planet__row">
                                <button class="btn buy">Купить</button>
                                <div class="planet__time-block">
                                    {/* <!-- Если нужны английские подписи к числам, то добавь к этому блоку класс eng --> */}
                                    <div class="time-block__timer">
                                        <span class="days">003</span> :{" "}
                                        <span class="hours">22</span> :{" "}
                                        <span class="minutes">29</span> :{" "}
                                        <span class="seconds">57</span>
                                    </div>
                                    <div class="time-block__text">
                                        участвует в объединении тониума
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="planets__planet animated-border-container ver3">
                        <div class="animated-border">
                            <div class="planet__img">
                                <img src="/images/planet5.png" alt="" />
                            </div>
                            <div class="planet__information">
                                <h4 class="planet__title">
                                    Hydra(H) - Planet #1
                                </h4>
                                <p class="planet__lvl">level 1</p>
                                <p class="planet__speed">Speed: 0,05 (H)/час</p>
                                <p class="planet__description">
                                    The extracted resourse is Hydrogen(H)
                                </p>
                                <p class="planet__gc">000.000 GC</p>
                            </div>
                            <div class="planet__row">
                                <button class="btn buy">Купить</button>
                            </div>
                        </div>
                    </div>
                    <div class="planets" id="planets-container"></div>
                    <div class="planets__planet animated-border-container ver3">
                        <div class="animated-border">
                            <div class="planet__img">
                                <img src="/images/planet5.png" alt="" />
                            </div>
                            <div class="planet__information">
                                <h4 class="planet__title">
                                    Hydra(H) - Planet #1
                                </h4>
                                <p class="planet__lvl">level 1</p>
                                <p class="planet__speed">Speed: 0,05 (H)/час</p>
                                <p class="planet__description">
                                    The extracted resourse is Hydrogen(H)
                                </p>
                                <p class="planet__gc">000.000 GC</p>
                            </div>
                            <div class="planet__row">
                                <button class="btn buy">Купить</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

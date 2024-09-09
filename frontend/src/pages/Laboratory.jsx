import Layout from "../components/Layout";

export default function Laboratory() {
    return (
        <Layout>
            <div class="main__inner">
                <h1 class="main__title">
                    Каждый день tonium меняет свой внутренний код, требуя для
                    воссоздания семь уникальных элементов.
                </h1>
                <div class="laboratory">
                    <div class="laboratory__time">
                        <div class="laboratory__time-text">
                            До смены элементов осталось
                        </div>
                        <div class="laboratory__time-timer">
                            <span class="hours">22</span> :{" "}
                            <span class="minutes">29</span> :{" "}
                            <span class="seconds">57</span>
                        </div>
                    </div>
                    <div class="laboratory__items"></div>
                    <button class="laboratory__button ">Объединить</button>
                    <div class="laboratory__text">Синтез - в разработке!</div>
                </div>
            </div>
        </Layout>
    );
}

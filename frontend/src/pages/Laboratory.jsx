import Layout from "../components/Layout";

export default function Laboratory() {
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
                            <span className="hours">22</span> :{" "}
                            <span className="minutes">29</span> :{" "}
                            <span className="seconds">57</span>
                        </div>
                    </div>
                    <div className="laboratory__items"></div>
                    <button className="laboratory__button ">Объединить</button>
                    <div className="laboratory__text">Синтез - в разработке!</div>
                </div>
            </div>
        </Layout>
    );
}

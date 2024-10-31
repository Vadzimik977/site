import Layout from "../../components/Layout";
import Task from "./Task";

const Tasks = () => {
  return (
    <Layout>
      <div className="main__inner">
        <h1 className="main__title">
          Здесь вы можете получить бесплатные ресурсы выполнив задания
        </h1>
        <div className="main__content tasks-content">
          <Task
            buttonText="Получить ресурсы"
            title="Подписка на наш телеграм канал"
            type="notification"
            value={200}
          />
        </div>
      </div>
    </Layout>
  );
};
export default Tasks;

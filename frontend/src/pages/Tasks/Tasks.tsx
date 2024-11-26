import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Task from './Task';
import { getTasks } from '../../utils/axios';

enum ITaskTitle {
  tgChannel = 'Подписка на телеграм канал',
  tgChat = 'Подписка на чат',
  video = 'Просмотр видео'
}

interface ITask {
  id: number
  type: ITaskTitle
  amount: number
  link: string
}

const Tasks = () => {
    const [tasks, setTasks] = useState<ITask[]>();

    useEffect(() => {
        const fetch = async () => {
            const data = await getTasks();
            setTasks(data);
        };
        fetch();
    }, []);

    return (
        <Layout>
            <div className="main__inner">
                <h1 className="main__title">Здесь вы можете получить бесплатные ресурсы выполнив задания</h1>
                <div className="main__content tasks-content">
                    {tasks?.length &&
                        tasks.map((item) => (
                            <Task
                                buttonText="Получить ресурсы"
                                title={ITaskTitle[item.type]}
                                type="notification"
                                value={item.amount}
                                src={item.link}
                            />
                        ))}
                </div>
            </div>
        </Layout>
    );
};
export default Tasks;

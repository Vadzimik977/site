import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Task from './Task';
import { getTasks } from '../../utils/axios';
import { useTranslation } from 'react-i18next';

enum ITaskTitle {
    tgChannel,
    tgChat,
    video
}

interface ITask {
    id: number;
    type: ITaskTitle;
    amount: number;
    link: string;
}

const Tasks = () => {
    const { t } = useTranslation();
    
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
                <h1 className="main__title">{t('tasksTitle')}</h1>
                <div className="main__content tasks-content">
                    {tasks?.length &&
                        tasks.map((item) => (
                            <Task
                                buttonText={t('getResource')}
                                title={t([item.type]) as string}
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

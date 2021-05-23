import Task, { TaskProps } from 'components/ui/Task';
import './tasks.scss';
import { useEffect, useState } from 'react';
import { getProject } from 'adapters/project';
import { getCurrentUser, getUserTasks, User } from 'adapters/user';
import LoadingScreen from 'components/ui/LoadingScreen';

export default function Tasks() {
    const [tasks, setTasks] = useState<TaskProps[]>([]);
    const [user, setUser] = useState<User>();

    useEffect(() => {
        getCurrentUser().then((user) => {
            setUser(user);
            getUserTasks().then((tasks) => {
                tasks.forEach(task => {
                    getProject(task.project).then((project) => {

                        setTasks(state => [...state, {
                            task: task,
                            subtitle: task.assigned.find(assignee => assignee.user === user.id)?.time + ' min',
                            color: project.color
                        }]);
                    })
                })
            })
        })
    }, []);
    if (user) {
        return (
            <div className="tasks-page">
                <main className="content-container">
                    <section className="intro-section">
                        <h1 className="underlined">Tasks</h1>
                    </section>
                    {
                        tasks ? (
                            <>
                                <p>Hey {user.realname ?? user.username}, you have <strong>{tasks.length} {tasks.length > 1 ? 'tasks' : 'task'}</strong>.</p>
                                <section className="tasks-container">
                                    <div className="tasks-list">
                                        {
                                            tasks.map((task) => (
                                                <Task key={task.task.id} {...task} />
                                            ))
                                        }
                                    </div>
                                </section>
                            </>
                        ) :
                            (
                                <div>No open tasks found</div>
                            )
                    }
                </main>
            </div>
        );
    }
    return <LoadingScreen />
}


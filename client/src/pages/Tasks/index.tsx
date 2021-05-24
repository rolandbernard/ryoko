import Task, { TaskProps } from 'components/ui/Task';
import './tasks.scss';
import { useEffect, useState } from 'react';
import { getProject } from 'adapters/project';
import { getCurrentUser, getUserTasks, User } from 'adapters/user';
import LoadingScreen from 'components/ui/LoadingScreen';
import { getPossibleTasks } from 'adapters/task';

export default function Tasks() {
    const [tasks, setTasks] = useState<TaskProps[]>([]);
    const [possibleTasks, setPossibleTasks] = useState<TaskProps[]>([]);
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
            getPossibleTasks().then(tasks => {
                tasks.filter(task => !task.assigned.find(a => a.user === user.id)).forEach(task => {
                    getProject(task.project).then((project) => {
                        setPossibleTasks(state => [...state, {
                            task: task,
                            subtitle: 'Suggested task - add yourself as assignee to do it.',
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
                <div className="content-container">
                    <section className="intro-section">
                        <h1 className="underlined">Tasks</h1>
                    </section>
                    <p>Hey {user.realname ?? user.username}, you have <strong>{tasks.length} {tasks.length > 1 ? 'tasks' : 'task'}</strong>.</p>
                    <section className="tasks-container">
                        {
                            tasks.length > 0 ? (
                                <div className="tasks-list">
                                    {
                                        tasks.map((task) => (
                                            <Task key={task.task.id} {...task} />
                                        ))
                                    }
                                </div>
                            ) : (
                                <div>No open tasks found</div>
                            )
                        }
                        <h2>Other tasks you could do</h2>
                        {
                            possibleTasks.length > 0 ? (
                                <div className="tasks-list">
                                    {
                                        possibleTasks.map((task) => (
                                            <Task key={task.task.id} {...task} />
                                        ))
                                    }
                                </div>
                            ) : (
                                <div>You don't fit the requirements for any other tasks</div>
                            )
                        }
                    </section>
                </div>
            </div >
        );
    }
    return <LoadingScreen />
}


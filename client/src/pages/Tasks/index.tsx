
import { useEffect, useState } from 'react';

import { getTeams } from 'adapters/team';
import { getProject } from 'adapters/project';
import { getPossibleTasks } from 'adapters/task';
import { getCurrentUser, getUserTasks, User } from 'adapters/user';

import Task, { TaskProps } from 'components/ui/Task';
import LoadingScreen from 'components/ui/LoadingScreen';

import './tasks.scss';

export default function Tasks() {
    const [user, setUser] = useState<User>();
    const [tasks, setTasks] = useState<TaskProps[]>([]);
    const [possibleTasks, setPossibleTasks] = useState<TaskProps[]>([]);

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
                getTeams().then((teams) => {
                    let roles = teams.map(t => t.role);
                    tasks.filter(task =>  
                        task.requirements.find(r => roles.indexOf(r.role) >= 0)
                    ).forEach(task => {
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
                            tasks.length > 0
                                ? (
                                    <div className="tasks-list">
                                        {
                                            tasks.map((task) => (
                                                <Task key={task.task.id} {...task} />
                                            ))
                                        }
                                    </div>
                                )
                                : (<div className="task-error">No open tasks found</div>)
                        }
                        <h2>Other tasks you could do</h2>
                        {
                            possibleTasks.length > 0
                                ? (
                                    <div className="tasks-list">
                                        {
                                            possibleTasks.map((task) => (
                                                <Task key={task.task.id} {...task} />
                                            ))
                                        }
                                    </div>
                                )
                                : (<div className="task-error">You don't fit the requirements for any other tasks</div>)
                        }
                    </section>
                </div>
            </div >
        );
    } else {
        return <LoadingScreen />
    }
}


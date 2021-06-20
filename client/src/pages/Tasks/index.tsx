
import { useEffect, useState } from 'react';

import { durationFor, formatDuration } from 'timely';
import { getTeams, Team } from 'adapters/team';
import { getPossibleTasks, Task } from 'adapters/task';
import { getCurrentUser, getUserTasks, User } from 'adapters/user';

import TaskComponent from 'components/ui/Task';
import LoadingScreen from 'components/ui/LoadingScreen';

import './tasks.scss';

export default function Tasks() {
    const [user, setUser] = useState<User>();
    const [teams, setTeams] = useState<Team[]>();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [possibleTasks, setPossibleTasks] = useState<Task[]>([]);

    sessionStorage.setItem('task-return-location', `/tasks`);

    useEffect(() => {
        getCurrentUser().then(setUser);
        getUserTasks().then(setTasks);
        getTeams().then(setTeams);
        getPossibleTasks().then(setPossibleTasks);
    }, []);

    const acceptableTasks = possibleTasks
        .filter(task =>
            !task.assigned.some(ass => ass.user === user?.id)
            && task.requirements.some(
               req => teams?.some(team => team.role === req.role)
            )
        );

    if (user) {
        return (
            <div className="tasks-page">
                <div className="content-container">
                    <section className="intro-section">
                        <h1 className="underlined">Tasks</h1>
                    </section>
                    <p>Hey {user.realname ?? user.username}, you have <strong>{tasks.length} {tasks.length !== 1 ? 'tasks' : 'task'}</strong>.</p>
                    <section className="tasks-container">
                        {
                            tasks.length > 0
                                ? (
                                    <div className="tasks-list">
                                        {tasks.map((task) => {
                                            const time = task.assigned.find(assignee => assignee.user === user.id)?.time ?? 0;
                                            return (
                                                <TaskComponent
                                                    key={task.id}
                                                    task={task}
                                                    subtitle={
                                                        formatDuration(durationFor(time, 'minute'), 'second', 2, true)
                                                    }
                                                />
                                            )
                                        })}
                                    </div>
                                )
                                : (<div className="task-error">No open tasks found</div>)
                        }
                        <h2>Other tasks you could do</h2>
                        {
                            acceptableTasks.length > 0
                                ? (
                                    <div className="tasks-list">
                                        {
                                            acceptableTasks.map((task) => (
                                                <TaskComponent
                                                    key={task.id}
                                                    task={task}
                                                    subtitle={'Suggested task - add yourself as assignee to do it.'}
                                                />
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


import Task, { TaskProps } from 'components/ui/Task';
import './tasks.scss';
import { useEffect, useState } from 'react';
import { getProject } from 'adapters/project';
import { getCurrentUser, getUserTasks } from 'adapters/user';

export default function Tasks() {
    const [tasks, setTasks] = useState<TaskProps[]>([]);

    useEffect(() => {
        getCurrentUser().then((user) => {
            getUserTasks().then((tasks) => {
                tasks.forEach(task => {
                    getProject(task.project).then((project) => {

                        setTasks(state => [...state, {
                            task: task,
                            subtitle: task.assigned.find(assignee => assignee.user === user.id)?.time.toString() ?? '',
                            color: project.color
                        }]);
                    })
                })
            })
        })
    }, []);
    return (
        <div className="tasks-page">
            <main className="content-container">
                <section className="intro-section">
                    <h1 className="underlined">Tasks</h1>
                </section>
                {
                    tasks ? (
                        <>
                            <p>Hey Daniel, you have <strong>{tasks.length} tasks</strong> for today.</p>
                            <section className="tasks-container">
                                <h2>Today</h2>
                                <div className="task-group">
                                    <h3>09:00</h3>
                                    <div className="tasks-list">
                                        {
                                            tasks.map((task) => (
                                                <Task key={task.task.id} {...task} />
                                            ))
                                        }
                                    </div>
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


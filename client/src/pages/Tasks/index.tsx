import Task from 'components/ui/Task';
import { Priority, Status } from 'adapters/task';
import './tasks.scss';

export default function Tasks() {
    const task = {
        id: 'asdf',
        priority: Priority.HIGH,
        status: Status.CLOSED,
        dependencies: ['test'],
        assigned: [{ user: 'test', time: 30, finished: false }],
        requirements: [{ role: 'test', time: 20 }],
        created: new Date(),
        edited: new Date(),

        project: 'asdf',

        name: 'Create API Routes',
        icon: '🌎',
        text: 'Create the API routes and implement them into the FrontEnd, by adding them into the controls.'
    }
    return (
        <div className="tasks-page">
            <main className="content-container">
                <section className="intro-section">
                    <h1 className="underlined">Tasks</h1>
                    <p>Hey Daniel, you have <strong>10 tasks</strong> for today.</p>
                </section>
                <section className="tasks-container">
                    <h2>Today</h2>
                    <div className="task-group">
                        <h3>09:00</h3>
                        <div className="tasks-list">
                            <Task task={task} />
                            <Task task={task} />
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}


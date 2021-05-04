import Page from 'components/ui/Page';
import Task from 'components/ui/Task';
import './tasks.scss';

export default function Tasks() {
    return (
        <Page className="tasks-page">
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
                            <Task task={{
                                uuid: 'asdf',
                                name: 'Create API Routes',
                                icon: '🌎',
                                start: 1619074800000,
                                end: 1619076600000,
                                description: 'Create the API routes and implement them into the FrontEnd, by adding them into the controls.'
                            }} />
                            <Task task={{
                                uuid: 'asdfds',
                                name: 'Create API Routes',
                                icon: '🌎',
                                start: 1619074800000,
                                end: 1619076600000,
                                description: 'Create the API routes and implement them into the FrontEnd, by adding them into the controls.'
                            }} />
                        </div>
                    </div>
                </section>
            </main>
        </Page>
    );
}


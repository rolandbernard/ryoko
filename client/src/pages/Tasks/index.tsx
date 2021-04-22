import Page from 'components/ui/Page';
import Task from 'components/ui/Task';
import './tasks.scss';

export default function Tasks() {
    return (
        <>
            <Page className="tasks-page">
                <main className="content-container">
                    <section className="intro-section">
                        <h1 className="underlined">Tasks</h1>
                        <p>Hey Daniel, you have <strong>10 tasks</strong> for today.</p>
                    </section>
                    <section className="tasks-container">
                        <h2>Today</h2>
                        <div className="hour-container">
                            <h3>09:00</h3>
                            <Task task={{
                                 name: 'Create API Routes',
                                 icon: '🌎',
                                 start: 1619074800000,
                                 end: 1619076600000
                                 }} />
                            <Task task={{
                                 name: 'Create API Routes',
                                 icon: '🌎',
                                 start: 1619074800000,
                                 end: 1619076600000
                                 }} />
                        </div>
                    </section>
                </main>
            </Page>
            <div className="background-container">
                <div className="bubble primary" style={{ top: '-20%', right: '-20%' }}></div>
                <div className="bubble accent" style={{ bottom: '-20%', left: '-20%' }}></div>
            </div>
        </>
    );
}


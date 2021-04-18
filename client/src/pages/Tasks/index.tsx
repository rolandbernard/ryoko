import Page from 'components/ui/Page';
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
                </main>
            </Page>
            <div className="background-container">
                <div className="bubble primary" style={{ top: '-20%', right: '-20%' }}></div>
                <div className="bubble accent" style={{ bottom: '-20%', left: '-20%' }}></div>
            </div>
        </>
    );
}


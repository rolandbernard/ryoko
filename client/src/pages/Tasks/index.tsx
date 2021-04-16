import Page from 'components/ui/Page';
import './tasks.scss';

export default function Tasks() {
    return (
        <>
            <Page className="tasks-page">
                <main className="content-container">
                    <h1>Tasks</h1>
                    <p>Hey Daniel, you have <strong>10</strong> Tasks for today.</p>
                </main>
            </Page>
        </>
    );
}
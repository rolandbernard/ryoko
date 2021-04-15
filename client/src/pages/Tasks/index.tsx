import Navigation from 'components/ui/Navigation';
import './tasks.scss';

export default function Tasks() {
    return (
        <div className="tasks-page">
            <Navigation />
            <main>
                <h1>Tasks</h1>
            </main>
        </div>
    );
}
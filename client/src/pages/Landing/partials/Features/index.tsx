
import './features.scss';

export default function Features() {
    return (
        <section className="features-section content-container">
            <h2>Revolutionize your<br />planning</h2>
            <div className="feature-list">
                <div className="feature-item">
                    <span className="feature-icon material-icons">query_stats</span>
                    <h3 className="feature-title">Analyze your productivity</h3>
                    <div className="feature-description">
                        Find your <strong>weaknesses and strengths</strong> by analyzing graphs
                    </div>
                </div>
                <div className="feature-item">
                    <span className="feature-icon material-icons">event</span>
                    <h3 className="feature-title">Automatic timetables</h3>
                    <div className="feature-description">
                        Generate your automatic timetables based on <strong>priorities and decencies</strong> of
                        your tasks
                    </div>
                </div>
                <div className="feature-item">
                    <span className="feature-icon material-icons">group</span>
                    <h3 className="feature-title">Team-based</h3>
                    <div className="feature-description">
                        Distribute task within your Teams based on <strong>profession and difficulty</strong>
                    </div>
                </div>
            </div>
        </section>
    )
}


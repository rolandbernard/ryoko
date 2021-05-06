import Dropdown from 'components/navigation/Dropdown';
import './teams-stats.scss';

export default function TeamsStats() {
    return (
        <section className="teams-stats-section">
            <div className="content-container">
                <Dropdown items={[{ label: "Last month", route: "lastmonth" }]}>
                    <div className="filter-label">
                        <span className="material-icons icon">
                            expand_more
                        </span>
                        Last week
                        </div>
                </Dropdown>
                test
            </div>
        </section>
    )
}
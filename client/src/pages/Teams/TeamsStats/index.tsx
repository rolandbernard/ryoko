import Dropdown from 'components/navigation/Dropdown';
import BarChart from 'components/graphs/BarChart';
import CompletionGrid from 'components/layout/CompletionGrid';
import './teams-stats.scss';

export default function TeamsStats() {
    const completions = [
        {
            label: 'Done',
            percent: 20,
        },
        {
            label: 'Done',
            percent: 20
        },
        {
            label: 'Done',
            percent: 20
        }
    ]
    return (
        <section className="teams-stats-section">
            <Dropdown items={[{ label: "Last month", route: "lastmonth" }]}>
                <span className="material-icons icon">
                    expand_more
                        </span>
                        Last week
                </Dropdown>
            <h3>Activities</h3>
            <BarChart data={[{ label: 'mon', value: 20 }, { label: 'tue', value: 10 }, { label: 'wed', value: 5 }]} />
            <h3>Completion</h3>
            <CompletionGrid items={completions} />
        </section>
    )
}
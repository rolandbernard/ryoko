import Dropdown from 'components/navigation/Dropdown';
import BarChart, { ChartItem } from 'components/graphs/BarChart';
import CompletionGrid from 'components/layout/CompletionGrid';
import './teams-stats.scss';
import { useEffect, useState } from 'react';
import { getTeamActivity, getTeamCompletion } from 'adapters/team';
import LoadingScreen from 'components/ui/LoadingScreen';
import { CompletionProps } from 'components/ui/Completion';
import { parseActivity, parseCompletion } from 'adapters/util';

interface Props {
    teamId: string;
}

export default function TeamsStats({ teamId }: Props) {
    const [activity, setActivity] = useState<ChartItem[]>([]);
    const [completions, setCompletions] = useState<CompletionProps[]>([]);


    useEffect(() => {
        getTeamActivity(teamId).then((a) => setActivity(parseActivity(a)));
        getTeamCompletion(teamId).then((comp) => setCompletions(parseCompletion(comp)))
    }, [teamId])
    return (
        <section className="teams-stats-section">
            <Dropdown items={[{ label: "Last month", route: "lastmonth" }]}>
                <span className="material-icons icon">
                    expand_more
                        </span>
                        Last week
                </Dropdown>
            <h3>Activities</h3>
            {
                activity ?
                    <BarChart data={activity} />
                    : <LoadingScreen />
            }
            <h3>Completion</h3>
            {
                completions ? (
                    <CompletionGrid items={completions} />
                ) : (
                    <LoadingScreen />
                )
            }
        </section>
    )
}
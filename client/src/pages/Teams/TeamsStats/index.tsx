import Dropdown from 'components/navigation/Dropdown';
import BarChart, { ChartItem } from 'components/graphs/BarChart';
import CompletionGrid from 'components/layout/CompletionGrid';
import './teams-stats.scss';
import { useEffect, useState } from 'react';
import { getTeamActivity, getTeamCompletion } from 'adapters/team';
import LoadingScreen from 'components/ui/LoadingScreen';
import { CompletionProps } from 'components/ui/Completion';
import { StatusColors } from 'adapters/task';

interface Props {
    teamId: string;
}

export default function TeamsStats({ teamId }: Props) {
    const [activity, setActivity] = useState<ChartItem[]>([]);
    const [completions, setCompletions] = useState<CompletionProps[]>([]);


    useEffect(() => {
        getTeamActivity(teamId).then((a) => {
            setActivity(a.map(item => {
                return {
                    label: item.day,
                    value: item.time
                }
            }));
        });
        getTeamCompletion(teamId).then((comp) => {
            const allAmount = comp.sum ?? 1;
            setCompletions([
                {
                    label: 'Closed',
                    percent: comp.closed / allAmount * 100,
                    color: StatusColors.get('closed') ?? ''
                },
                {
                    label: 'Open',
                    percent: comp.open / allAmount * 100,
                    color: StatusColors.get('open') ?? ''
                },
                {
                    label: 'Suspended',
                    percent: comp.suspended / allAmount * 100,
                    color: StatusColors.get('suspended') ?? ''
                },
                {
                    label: 'Overdue',
                    percent: comp.overdue / allAmount * 100,
                    color: StatusColors.get('overdue') ?? ''
                },
            ]);
        })
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
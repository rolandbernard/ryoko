
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';

import { subtractTime } from 'timely';
import { getTeamActivity, getTeamCompletion } from 'adapters/team';

import LoadingScreen from 'components/ui/LoadingScreen';
import CompletionGrid from 'components/layout/CompletionGrid';
import Dropdown from 'components/navigation/Dropdown';
import { CompletionProps, parseCompletion } from 'components/ui/Completion';
import BarChart, { ChartItem, parseActivity } from 'components/graphs/BarChart';

import './teams-stats.scss';

interface Props {
    teamId: string;
}

enum Timespan {
    WEEK = 'week',
    MONTH = 'month',
    YEAR = 'year',
}

interface Params {
    time: Timespan;
}

export default function TeamsStats({ teamId }: Props) {
    const [activity, setActivity] = useState<ChartItem[]>([]);
    const [completions, setCompletions] = useState<CompletionProps[]>([]);
    const history = useHistory();

    const { time } = useParams<Params>();
    const dropdowns = [
        {
            time: 'week',
            label: 'Last week',
            route: '/teams/' + teamId + '/stats/week'
        },
        {
            time: 'month',
            label: 'Last month',
            route: '/teams/' + teamId + '/stats/month'
        },
        {
            time: 'year',
            label: 'Last year',
            route: '/teams/' + teamId + '/stats/year'
        }
    ];

    useEffect(() => {
        getTeamActivity(teamId, subtractTime(new Date(), 1, time), new Date())
            .then((a) => setActivity(parseActivity(a)));
        getTeamCompletion(teamId, subtractTime(new Date(), 1, time), new Date())
            .then((comp) => setCompletions(parseCompletion(comp)))
    }, [teamId, history, time]);

    return (
        <section className="teams-stats-section">
            <Dropdown items={dropdowns.filter(d => d.time !== time)}>
                <span className="material-icons icon">
                    expand_more
                </span>
                {dropdowns.find(d => d.time === time)?.label}
            </Dropdown>
            <h3>Activities</h3>
            {
                activity
                    ? <BarChart unit="h" multiplier={1 / 60 / 60 / 1000} data={activity} />
                    : <LoadingScreen />
            }
            <h3>Completion</h3>
            {
                completions
                    ? (<CompletionGrid items={completions} />)
                    : (<LoadingScreen />)
            }
        </section>
    )
}


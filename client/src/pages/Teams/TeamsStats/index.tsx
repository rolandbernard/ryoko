import Dropdown, { DropDownItem } from 'components/navigation/Dropdown';
import BarChart, { ChartItem } from 'components/graphs/BarChart';
import CompletionGrid from 'components/layout/CompletionGrid';
import './teams-stats.scss';
import { useEffect, useState } from 'react';
import { getTeamActivity, getTeamCompletion } from 'adapters/team';
import LoadingScreen from 'components/ui/LoadingScreen';
import { CompletionProps } from 'components/ui/Completion';
import { parseActivity, parseCompletion } from 'adapters/util';
import { subtractTime } from 'timely';
import { useHistory, useParams } from 'react-router';
import { time } from 'node:console';

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

interface FilterDropdownItem extends DropDownItem {
    time: string
}


export default function TeamsStats({ teamId }: Props) {
    const history = useHistory();
    const { time } = useParams<Params>();

    const [activity, setActivity] = useState<ChartItem[]>([]);
    const [completions, setCompletions] = useState<CompletionProps[]>([]);
    const [dropdowns, setDropdowns] = useState<FilterDropdownItem[]>([{
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
    }]);

    useEffect(() => {
        getTeamActivity(teamId, subtractTime(new Date(), 1, time), new Date()).then((a) => setActivity(parseActivity(a)));
        getTeamCompletion(teamId, subtractTime(new Date(), 1, time), new Date()).then((comp) => setCompletions(parseCompletion(comp)))
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
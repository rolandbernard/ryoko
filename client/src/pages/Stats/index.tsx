
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import { subtractTime } from 'timely';
import { getUserActivity, getUserCompletion } from 'adapters/user';

import LoadingScreen from 'components/ui/LoadingScreen';
import CompletionGrid from 'components/layout/CompletionGrid';
import Dropdown, { DropDownItem } from 'components/navigation/Dropdown';
import { CompletionProps, parseCompletion } from 'components/ui/Completion';
import BarChart, { ChartItem, parseActivity } from 'components/graphs/BarChart';

import './stats.scss';

enum Timespan {
    WEEK = 'week',
    MONTH = 'month',
    YEAR = 'year',
}

interface Params {
    time?: Timespan;
}

interface FilterDropdownItem extends DropDownItem {
    time: string
}

export default function Tasks() {
    const [completions, setCompletions] = useState<CompletionProps[]>();
    const [activity, setActivity] = useState<ChartItem[]>();
    const [dropdowns] = useState<FilterDropdownItem[]>([
        {
            time: 'week',
            label: 'Last week',
            route: '/stats/week'
        },
        {
            time: 'month',
            label: 'Last month',
            route: '/stats/month'
        },
        {
            time: 'year',
            label: 'Last year',
            route: '/stats/year'
        }
    ]);

    const time = useParams<Params>().time ?? Timespan.WEEK;

    useEffect(() => {
        getUserCompletion().then((completion) => setCompletions(parseCompletion(completion)));
        getUserActivity(subtractTime(new Date(), 1, time), new Date()).then((a) => setActivity(parseActivity(a)))
    }, [time]);

    return (
        (completions && activity)
            ? (
                <div className="stats-page">
                    <div className="content-container">
                        <h1 className="underlined">Stats</h1>
                        <div className="description-container">
                            Here are some of your recent statistics.
                        </div>
                        <Dropdown items={dropdowns.filter(d => d.time !== time)}>
                            <span className="material-icons icon">
                                expand_more
                            </span>
                            {dropdowns.find(d => d.time === time)?.label}
                        </Dropdown>
                        <h2>Activity</h2>
                        <BarChart unit="h" multiplier={1 / 60 / 60 / 1000} data={activity} />
                        <h2>Completion</h2>
                        <CompletionGrid items={completions} />
                    </div>
                </div>
            )
            : <LoadingScreen />
    );
}


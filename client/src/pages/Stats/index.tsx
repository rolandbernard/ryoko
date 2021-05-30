
import { useEffect, useState } from 'react';

import { subtractTime } from 'timely';
import { getUserActivity, getUserCompletion } from 'adapters/user';

import LoadingScreen from 'components/ui/LoadingScreen';
import CompletionGrid from 'components/layout/CompletionGrid';
import { CompletionProps, parseCompletion } from 'components/ui/Completion';
import BarChart, { ChartItem, parseActivity } from 'components/graphs/BarChart';

import './stats.scss';

export default function Tasks() {
    const [completions, setCompletions] = useState<CompletionProps[]>();
    const [activity, setActivity] = useState<ChartItem[]>();

    useEffect(() => {
        getUserCompletion().then((completion) => setCompletions(parseCompletion(completion)));
        getUserActivity(subtractTime(new Date(), 1, 'week'), new Date()).then((a) => setActivity(parseActivity(a)))
    }, []);

    return (
        (completions && activity)
            ? (
                <div className="stats-page">
                    <div className="content-container">
                        <h1 className="underlined">Stats</h1>
                        <div className="description-container">
                            Here are some of your recent statistics.
                        </div>
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


import './stats.scss';
import LoadingScreen from 'components/ui/LoadingScreen';
import { useEffect, useState } from 'react';
import { getUserActivity, getUserCompletion } from 'adapters/user';
import { CompletionProps } from 'components/ui/Completion';
import { parseActivity, parseCompletion } from 'adapters/util';
import CompletionGrid from 'components/layout/CompletionGrid';
import BarChart, { ChartItem } from 'components/graphs/BarChart';
import { subtractTime } from 'timely';

export default function Tasks() {
    const [completions, setCompletions] = useState<CompletionProps[]>();
    const [activity, setActivity] = useState<ChartItem[]>();

    useEffect(() => {
        getUserCompletion().then((completion) => setCompletions(parseCompletion(completion)));
        getUserActivity(subtractTime(new Date(), 1, 'week'), new Date()).then((a) => setActivity(parseActivity(a)))
    }, []);



    if (completions && activity) {
        return (
            <div className="stats-page">
                <div className="content-container">
                    <h1 className="underlined">Stats</h1>
                    <h2>Activity</h2>
                    <BarChart data={activity} />
                    <h2>Completion</h2>
                    <CompletionGrid items={completions} />
                </div>
            </div>
        );
    }
    return <LoadingScreen />
}

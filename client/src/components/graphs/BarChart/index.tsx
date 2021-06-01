
import { formatDate, addTime } from 'timely';

import { Activity } from 'adapters/common';

import './bar-chart.scss';

export interface ChartItem {
    label: string;
    value: number;
}

export function parseActivity(activity: Activity[], startDate?: Date): ChartItem[] {
    const results = [];
    let date = startDate ?? new Date(activity.map(act => act.day).reduce((a, b) => a < b ? a : b));
    while (date <= new Date()) {
        const day = date.toISOString().substr(0, 10);
        results.push({
            label: formatDate(date, 'none', 'short'),
            value: activity.find(item => item.day === day)?.time ?? 0,
        });
        date = addTime(date, 1, 'day');
    }
    return results;
}

interface Props {
    data: ChartItem[];
    unit?: string;
    multiplier?: number;
}

export default function BarChart({ data, unit, multiplier }: Props) {
    let maxValue = data.map(e => e.value).sort((a, b) => b - a)[0];
    return (
        <div className="bar-chart-container">
            {
                data.length > 0 ? (
                    <div className="bar-chart">
                        {
                            data.map((item) => (
                                <div key={item.label} className="bar" style={{
                                    height: ((item.value / maxValue) * 95 + 5) + '%',
                                    width: 'calc(' + Math.min(100 / data.length, 25) + '% - 10px)'
                                }}>
                                    { data.length < 10 &&
                                        <div className="label">
                                            {item.label}
                                        </div>
                                    }
                                    <div className="tooltip">
                                        {(item.value * (multiplier ?? 1)).toFixed(2) + (unit ?? '')} 
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                ) : (
                    <div className="error-screen">No activity recently</div>
                )
            }
        </div>
    );
}


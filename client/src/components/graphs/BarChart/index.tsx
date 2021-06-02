
import { formatDate, addTime, currentTime, subtractTime } from 'timely';

import { Activity } from 'adapters/common';

import './bar-chart.scss';

export interface ChartItem {
    label: string;
    value: number;
}

export function parseActivity(activity: Activity[], startDate?: Date): ChartItem[] {
    if (activity.length !== 0) {
        const results = [];
        let date = startDate ?? new Date(activity.map(act => act.day).reduce((a, b) => a < b ? a : b));
        const isLong = date < subtractTime(currentTime(), 40, 'day');
        while (date <= currentTime()) {
            const day = date.toISOString().substr(0, 10);
            results.push({
                label: isLong ? formatDate(date, 'month', undefined, false) : formatDate(date, 'none', 'short'),
                value: activity.find(item => item.day === day)?.time ?? 0,
            });
            date = addTime(date, 1, 'day');
        }
        return results;
    } else {
        return [];
    }
}

interface Props {
    data: ChartItem[];
    unit?: string;
    multiplier?: number;
}

export default function BarChart({ data, unit, multiplier }: Props) {
    let maxValue = data.map(e => e.value).reduce((a, b) => Math.max(a, b), 0);

    return (
        <div className="bar-chart-container">
            {
                data.length > 0 ? (
                    <div className="bar-chart">
                        {
                            data.map((item, i) => (
                                <div
                                    key={i}
                                    className="bar"
                                    style={{
                                        height: ((item.value / maxValue) * 95 + 5) + '%',
                                        width: Math.min((data.length < 40 ? 90 : 100) / data.length, 25) + '%'
                                    }}
                                >
                                    { (
                                        data.length < 10
                                            ? true
                                            : (data.length < 40
                                                ? (i % 7) === (data.length % 7 - 1)
                                                : data.length < 120
                                                    ? i !== 0 && item.label !== data[i - 1]?.label
                                                    : (i % 80) === (data.length % 80 - 1)
                                            )
                                      ) &&
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



import { formatDate, addTime, currentTime } from 'timely';

import { Activity } from 'adapters/common';

import './bar-chart.scss';

export interface ChartItem {
    label?: string;
    value: number;
}

/**
 * Parse the activity data in the api format. The data will be formatted in a way where empty days
 * will be interpolated with values of 0. This function will also create the labels based on the
 * number of items in the result.
 * 
 * @param activity The list of activity item the api returns
 * @param startDate The start date to start interpolating at
 * @returns The ChartItems that can be used with the bar chart
 */
export function parseActivity(activity: Activity[], startDate?: Date): ChartItem[] {
    if (activity.length !== 0) {
        let results: {
            date: Date;
            label?: string;
            value: number;
        }[] = [];
        let date = startDate ?? new Date(activity.map(act => act.day).reduce((a, b) => a < b ? a : b));
        while (date <= currentTime()) {
            const day = date.toISOString().substr(0, 10);
            results.push({
                date: date,
                value: activity.find(item => item.day === day)?.time ?? 0,
            });
            date = addTime(date, 1, 'day');
        }
        for (let i = 0; i < results.length; i++) {
            if (results.length < 10) {
                results[i].label = formatDate(results[i].date, 'none', 'short');
            } else if (results.length < 40) {
                if (results[i].date.getDay() === 1) {
                    results[i].label = formatDate(results[i].date, 'none', 'short');
                }
            } else if (results.length < 200) {
                if (results[i].date.getDate() === 10) {
                    results[i].label = formatDate(results[i].date, 'month', undefined, false);
                }
            } else if (results.length < 400) {
                if (results[i].date.getDate() === 10 && results[i].date.getMonth() % 2 === 0) {
                    results[i].label = formatDate(results[i].date, 'month', undefined, false);
                }
            }
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

/**
 * This component implements a bar chart. It will display all elements in the data property in the
 * given order. The values in the multiplier and unit property will be used for displaying the value
 * for each bar on hover in the tooltip. If an item includes a label, the label is displayed below
 * the bar of the chart.
 */
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
                                    { item.label &&
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


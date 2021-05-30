
import { formatDate } from 'timely';

import { Activity } from 'adapters/common';

import './bar-chart.scss';

export interface ChartItem {
    label: string;
    value: number;
}

export function parseActivity(activity: Activity[]): ChartItem[] {
    return activity.map(item => ({
        label: formatDate(new Date(item.day), 'none', 'short'),
        value: item.time
    }));
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
                                    height: (item.value / maxValue) * 100 + '%',
                                    width: 'calc(' + Math.min(100 / data.length, 25) + '% - 10px)'
                                }}>
                                    <div className="label">
                                        {item.label}
                                    </div>
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


import './bar-chart.scss';

export interface ChartItem {
    label: string;
    value: number;
}

interface Props {
    data: ChartItem[];
}

export default function BarChart({ data }: Props) {
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
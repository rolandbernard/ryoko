import './bar-chart.scss';

interface ChartItem {
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
            <div className="bar-chart">
                {
                    data.map((item) => (
                        <div key={item.label} className="bar" style={{
                            height: (item.value / maxValue) * 100 + '%',
                            width: 'calc(' + 100 / data.length + '% - 30px)'
                        }}>
                            <div className="label">
                                {item.label}
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );

}

import './circular-progress.scss';

const CIRCLE_RADUIS = 30;
const CIRCLE_CENTER = [ 35, 35 ];

interface Props {
    percent: number
}

export default function CircularProgress({ percent }: Props) {
    const angle = Math.min(Math.max(percent / 100, 0), 0.99) * 2 * Math.PI;
    const largeFlag = angle > Math.PI ? 1 : 0;
    const xEndPosition = CIRCLE_CENTER[0] + CIRCLE_RADUIS * Math.cos(angle - Math.PI / 2);
    const yEndPosition = CIRCLE_CENTER[1] + CIRCLE_RADUIS * Math.sin(angle - Math.PI / 2);
    return (
        <div className="circular-progress">
            <span className="percent">{percent} %</span>
            <svg>
                <circle cx={CIRCLE_CENTER[0]} cy={CIRCLE_CENTER[1]} r={CIRCLE_RADUIS} />
                <path d={
                    `M ${CIRCLE_CENTER[0]} ${CIRCLE_CENTER[1] - CIRCLE_RADUIS}`
                    + `A ${CIRCLE_RADUIS} ${CIRCLE_RADUIS} 0 ${largeFlag} 1 ${xEndPosition} ${yEndPosition}`
                }></path>
                <defs>
                    <linearGradient xmlns="http://www.w3.org/2000/svg" id="gradient"
                        x1="37.0361" y1="73.1719" x2="36.5" y2="0.500001"
                        gradientUnits="userSpaceOnUse">
                        <stop stopColor="#AC42FF" />
                        <stop offset="1" stopColor="#F15154" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
}

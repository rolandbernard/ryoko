
import './circular-progress.scss';

const CIRCLE_RADIUS = 30;
const CIRCLE_CENTER = [35, 35];

interface Props {
    percent: number;
    color?: string;
    label?: string;
}

/**
 * This component implements a circular progress element. The completion will be shown in the color
 * given in the property. If a label will be given, it will be displayed in the center of the
 * progress circle. The circle itself is implemented as a svg.
 */
export default function CircularProgress({ percent, color, label }: Props) {
    const angle = Math.min(Math.max(percent / 100, 0), 0.99) * 2 * Math.PI;
    const largeFlag = angle > Math.PI ? 1 : 0;
    const xEndPosition = CIRCLE_CENTER[0] + CIRCLE_RADIUS * Math.cos(angle - Math.PI / 2);
    const yEndPosition = CIRCLE_CENTER[1] + CIRCLE_RADIUS * Math.sin(angle - Math.PI / 2);

    return (
        <div className={'circular-progress' + (color ? ' color-' + color : '')}>
            <span className="label">{label ?? Math.round(percent) + '%'}</span>
            <svg viewBox={`0 0 ${CIRCLE_RADIUS * 2 + 9} ${CIRCLE_RADIUS * 2 + 9}`}>
                <circle cx={CIRCLE_CENTER[0]} cy={CIRCLE_CENTER[1]} r={CIRCLE_RADIUS} />
                <path d={
                    `M ${CIRCLE_CENTER[0]} ${CIRCLE_CENTER[1] - CIRCLE_RADIUS}`
                    + `A ${CIRCLE_RADIUS} ${CIRCLE_RADIUS} 0 ${largeFlag} 1 ${xEndPosition} ${yEndPosition}`
                }></path>
                <defs>
                    <linearGradient xmlns="http://www.w3.org/2000/svg" id={'gradient' + (color ? '-' + color : '')}
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


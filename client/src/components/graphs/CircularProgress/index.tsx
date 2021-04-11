
import React from "react";

import './circular-progress.scss';

interface Props {
    percent: number
}

export default function CircularProgress({ percent }: Props) {
    const angle = Math.min(Math.max(percent, 0), 99.9) / 100 * 2 * Math.PI;
    const largeFlag = angle > Math.PI ? 1 : 0;
    const xEndPosition = 110 + 100 * Math.cos(angle - Math.PI / 2);
    const yEndPosition = 110 + 100 * Math.sin(angle - Math.PI / 2);

    return (
        <div className="circular-progress">
            <span className="percent">{percent} %</span>
            <svg viewBox="0 0 220 220">
                <circle cx="110" cy="110" r="100" />
                <path d={
                    `M 110 10 A 100 100 0 ${largeFlag} 1 ${xEndPosition} ${yEndPosition}`
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


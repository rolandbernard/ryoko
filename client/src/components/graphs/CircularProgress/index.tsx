
import React, { useEffect, useState } from "react";

import './circular-progress.scss';

interface Props {
    percent: number
}

const cos = Math.cos;
const sin = Math.sin;
const π = Math.PI;

const f_matrix_times = (([[a, b], [c, d]], [x, y]) => [a * x + b * y, c * x + d * y]);
const f_rotate_matrix = (x => [[cos(x), -sin(x)], [sin(x), cos(x)]]);
const f_vec_add = (([a1, a2], [b1, b2]) => [a1 + b1, a2 + b2]);

const getPath = (([cx, cy], [rx, ry], [t1, Δ], φ): string => {
    Δ = Δ % (2 * π);
    const rotMatrix = f_rotate_matrix(φ);
    const [sX, sY] = (f_vec_add(f_matrix_times(rotMatrix, [rx * cos(t1), ry * sin(t1)]), [cx, cy]));
    const [eX, eY] = (f_vec_add(f_matrix_times(rotMatrix, [rx * cos(t1 + Δ), ry * sin(t1 + Δ)]), [cx, cy]));
    const fA = ((Δ > π) ? 1 : 0);
    const fS = ((Δ > 0) ? 1 : 0);
    return "M " + sX + " " + sY + " A " + [rx, ry, φ / (2 * π) * 360, fA, fS, eX, eY].join(" ");
});

export default function CircularProgress({ percent }: Props) {

    const [path, setPath] = useState<string>();

    useEffect(() => {
        setPath(getPath([35, 35], [30, 30], [4.712389, (percent * 2 * Math.PI / 100)], 0));
    }, [percent]);

    return (
        <div className="circular-progress">
            <span className="percent">{percent} %</span>
            <svg>
                <circle cx="35" cy="35" r="30" />
                <path d={path} />
                <defs>
                    <linearGradient xmlns="http://www.w3.org/2000/svg" id="gradient"
                        x1="37.0361" y1="73.1719" x2="36.5" y2="0.500001"
                        gradientUnits="userSpaceOnUse">
                        <stop stop-color="#AC42FF" />
                        <stop offset="1" stop-color="#F15154" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
}


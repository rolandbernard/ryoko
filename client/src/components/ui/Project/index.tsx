
import React, {ReactNode} from "react";

import CircularProgress from 'components/graphs/CircularProgress';
import './project.scss';

function ProjectTag(status: "open" | "suspended" | "closed"): ReactNode {
    switch (status) {
        case "open":
            return (
                <span className="tag">
                    <i className="icon material-icons">
                        work
                    </i>
                    Open
                </span>
            );
        case "suspended":
            return (
                <span className="tag">
                    <i className="icon material-icons">
                        clock
                    </i>
                    Suspended
                </span>
            );
        default:
            return null;
    }
}

interface Props {
    status: "open" | "suspended" | "closed",
    name: string,
    percent: number
}

export default function Project({ status, name, percent }: Props): ReactNode {
    return (
        <div className="project">
            {ProjectTag(status)}
            <CircularProgress percent={percent} />
            <div className="title">{name}</div>
        </div>
    );
}


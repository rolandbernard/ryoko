import React from "react";

import CircularProgress from 'components/graphs/CircularProgress';

import './project.scss';

interface Props {
    status: "open" | "suspended" | "closed",
    name: string,
    percent: number
}

export default function Project({ status, name, percent }: Props) {
    let tag;

    switch (status) {
        case "open":
            tag = (
                <span className="tag">
                    <i className="icon material-icons">
                        work
                    </i>
                    Open
                </span>
            );
            break;
        case "suspended":
            tag = (
                <span className="tag">
                    <i className="icon material-icons">
                        clock
                    </i>
                    Suspended
                </span>
            );
            break;
    }

    return (
        <div className="project">
            {tag}
            <CircularProgress percent={percent} />
            <div className="title">{name}</div>
        </div>
    );
}


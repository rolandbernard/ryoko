
import { MouseEventHandler, ReactNode } from "react";

import './button.scss';

interface Props {
    children: ReactNode;
    type?: "button" | "submit" | "reset";
    className?: string;
    onClick?: MouseEventHandler;
}

export default function Button({children, type, className, onClick}: Props) {
    return (
        <button className={"button " + (className || '')} type={type} onClick={onClick}>
            {children}
        </button>
    );
}


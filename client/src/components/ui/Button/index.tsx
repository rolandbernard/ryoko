
import { MouseEventHandler, ReactNode } from "react";

import './button.scss';

interface Props {
    children: ReactNode;
    type?: "button" | "submit" | "reset";
    className?: string;
    onClick?: MouseEventHandler;
}

/**
 * This component implements a simple button. The type and onClick, as well as the className
 * property will be given on to the underlying html button element, while the children will be
 * display inside said button.
 */
export default function Button({children, type, className, onClick}: Props) {
    return (
        <button className={"button " + (className || '')} type={type} onClick={onClick}>
            {children}
        </button>
    );
}


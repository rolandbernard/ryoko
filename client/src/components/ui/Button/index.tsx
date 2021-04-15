
import { ReactNode } from "react";

import './button.scss';

interface Props {
    children: ReactNode;
    type?: "button" | "submit" | "reset";
    className?: string;
}

export default function Button({children, type, className}: Props) {
    return (
        <button className={"button " + (className || '')} type={type}>
            {children}
        </button>
    );
}


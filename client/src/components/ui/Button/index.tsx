
import { ReactNode } from "react";

import './button.scss';

interface Props {
    children: ReactNode;
    type?: "button" | "submit" | "reset";
}

export default function Button({children, type}: Props) {
    return (
        <button className="button" type={type}>
            {children}
        </button>
    );
}


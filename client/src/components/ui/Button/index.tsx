
import { ReactNode } from "react";
import React from "react";

import './button.scss';

export default function Button({children}: {children: ReactNode}) {
    return (
        <div className="button">
            {children}
        </div>
    );
}


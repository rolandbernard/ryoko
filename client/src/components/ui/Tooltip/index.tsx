
import { ReactNode } from 'react';

import './tooltip.scss';

interface Props {
    text: string,
    className?: string,
    children: ReactNode
}

/**
 * This component implements a tooltip that will show the text in the property if the user hovers
 * over the children of the component. The children will be display unchanged.
 */
export default function Tooltip({children, text, className}: Props) {
    return (
        <div className={'tooltip-container ' + (className ?? '')}>
            {children}
            <div className="tooltip">
                {text}
            </div>
        </div>
    ); 
}


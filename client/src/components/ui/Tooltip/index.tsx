import { ReactNode } from 'react';
import './tooltip.scss';

interface Props {
    text: string,
    className?: string,
    children: ReactNode
}

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
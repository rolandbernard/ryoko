
import { ReactNode } from 'react';

import './popup.scss';

interface Props {
    children: ReactNode
    onClose: Function
}

export default function Popup({ children, onClose }: Props) {
    document.addEventListener('keydown', (e) => {
        if(e.key === "Escape") {
            onClose();
        }
    });
    return (
        <div className="popup-container">
            <div className="popup">
                {children}
            </div>
            <div className="background" onClick={() => onClose()}></div>
        </div>
    )
}


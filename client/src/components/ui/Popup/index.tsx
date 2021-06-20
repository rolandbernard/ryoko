
import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

import './popup.scss';

const root = document.getElementById('root') ?? document.getElementsByTagName('html')[0];

interface Props {
    children: ReactNode
    onClose: Function
}

export default function Popup({ children, onClose }: Props) {
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape") {
            onClose();
        }
    });
    return createPortal(

        <div className="popup-container">
            <div className="popup">
                {children}
            </div>
            <div className="background" onClick={() => onClose()}></div>
        </div>, root
    )
}


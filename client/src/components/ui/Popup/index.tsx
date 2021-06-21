
import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';

import './popup.scss';

const body = document.getElementsByTagName('body')[0];

interface Props {
    children: ReactNode
    onClose: Function
}

export default function Popup({ children, onClose }: Props) {
    useEffect(() => {
        body.style.overflow = 'hidden';
        return () => {
            body.style.overflow = '';
        }
    }, []);
    
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
        </div>, body
    )
}


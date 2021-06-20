
import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

import './popup.scss';

const root = document.getElementById('root') ?? document.getElementsByTagName('html')[0];
const body = document.getElementsByTagName('html')[0];

interface Props {
    children: ReactNode
    onClose: Function
}

export default function Popup({ children, onClose }: Props) {
    const onCloseModified = () => {
        body.style.overflow = '';
        onClose();
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape") {
            onCloseModified();
        }
    });
    body.style.overflow = 'hidden';
    return createPortal(

        <div className="popup-container">
            <div className="popup">
                {children}
            </div>
            <div className="background" onClick={() => onCloseModified()}></div>
        </div>, root
    )
}



import { ReactNode, useEffect } from 'react';

import './popup.scss';

const body = document.getElementsByTagName('body')[0];

interface Props {
    children: ReactNode
    onClose: Function
}

export default function Popup({ children, onClose }: Props) {

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
        }
    }, [onClose]);

    useEffect(() => {
        body.classList.add('blocked');
        return () => {
            body.classList.remove('blocked');
        }
    }, []);

    return (
        <div className="popup-container">
            <div className="popup">
                {children}
            </div>
            <div className="background" onClick={() => onClose()}></div>
        </div>
    );
}


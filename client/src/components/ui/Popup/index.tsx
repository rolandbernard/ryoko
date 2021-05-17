import { ReactNode } from 'react';
import './popup.scss';

interface Props {
    children: ReactNode
    onClose: Function
}

export default function Popup({ children, onClose }: Props) {
    return (
        <div className="popup-container" onClick={() => onClose()}>
            <div className="popup">
                {children}
            </div>
        </div>
    )
}
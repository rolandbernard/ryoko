
import { ReactNode, useEffect } from 'react';

import './popup.scss';

const body = document.getElementsByTagName('body')[0];

interface Props {
    children: ReactNode
    onClose: Function
}

/**
 * This is a component that implements a popup. The popup will display the children of the
 * component. The onClose callbacks will be called when the popup should be closed. The popup when
 * open will prevent scrolling on the body any grey out the background.
 */
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


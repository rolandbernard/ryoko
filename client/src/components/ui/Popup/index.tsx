
import { ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import './popup.scss';

interface Props {
    children: ReactNode
    onClose: Function
}

export default function Popup({ children, onClose }: Props) {
    const body = document.getElementsByTagName('body')[0];
    const root = useRef<HTMLDivElement>(null);

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
        const ignoreEvent = (e: Event) => {
            e.preventDefault();
            return false;
        };
        const elements = [ root.current, body ];
        const events = [
            'scroll', 'wheel', 'mousewheel', 'DOMMouseScroll',
            'keydown', 'keypress', 'keyup', 'touchmove',
            'touchstart', 'touchend', 'focus', 'click'
        ];
        for (const elem of elements) {
            for (const event of events) {
                elem?.addEventListener(event, ignoreEvent);
            }
        }
        return () => {
            for (const elem of elements) {
                for (const event of events) {
                    elem?.removeEventListener(event, ignoreEvent);
                }
            }
        }
    });

    return createPortal(
        <div className="popup-container" ref={root}>
            <div className="popup">
                {children}
            </div>
            <div className="background" onClick={() => onClose()}></div>
        </div>, body
    );
}



import { ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';

import Popup from 'components/ui/Popup';

import './dropdown.scss';

export interface DropDownItem {
    label: string;
    route?: string;
    popupContent?: ReactNode;
}

interface Props {
    children: ReactNode;
    items: DropDownItem[]
    position?: 'left'|'right';
}

export default function Dropdown({ children, items, position }: Props) {
    const [isOpen, setOpen] = useState(false);
    const [openPopup, setOpenPopup] = useState<string | null>(null);

    document.addEventListener('keydown', (e) => {
        if(e.key === "Escape") {
            setOpen(false);
        }
    });

    return (
        <>
            <div className={'dropdown-container' + (isOpen ? ' open' : '') + (items.length === 0 ? ' inactive' : '')} onClick={() => setOpen(state => !state)}>
                <div className="current-item">
                    {children}
                </div>
                {items.length > 0 && (
                    <div className={'dropdown ' + (position ?? '')}>
                        {
                            items.map((item) => (
                                (item.route && (
                                    <Link className="dropdown-item" key={item.label} to={item.route}>
                                        {item.label}
                                    </Link>
                                ))
                                || (item.popupContent && (
                                    <div className="dropdown-item" key={item.label} onClick={() => setOpenPopup(item.label)}>
                                        {item.label}
                                    </div>
                                ))
                            ))
                        }
                    </div>
                )}
            </div>
            {
                items.filter(item => item.popupContent).map((item) => (
                    openPopup === item.label && (
                        <Popup onClose={() => setOpenPopup(null)}>
                            {item.popupContent}
                        </Popup>)
                ))
            }
        </>
    );
}


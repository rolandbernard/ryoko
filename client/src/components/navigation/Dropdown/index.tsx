import { ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';
import './dropdown.scss';

export interface DropDownItem {
    label: string;
    route: string;
}

interface Props {
    children: ReactNode;
    items: DropDownItem[]
}

export default function Dropdown({ children, items }: Props) {
    const [isOpen, setOpen] = useState(false);
    return (
        <div className={'dropdown-container' + (isOpen ? ' open' : '') + (items.length === 0 ? ' inactive' : '')} onClick={() => setOpen(state => !state)}>
            <div className="current-item">
                {children}
            </div>
            {items.length > 0 && (
                <div className="dropdown">
                    {
                        items.map((item) => (
                            <Link className="dropdown-item" key={item.label} to={item.route}>
                                {item.label}
                            </Link>
                        ))
                    }
                </div>
            )}
        </div>
    );
}
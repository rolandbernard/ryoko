import { ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';
import './dropdown.scss';

interface DropDownItem {
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
        <div className={'dropdown-container' + (isOpen ? ' open' : '')} onClick={() => setOpen(state => !state)}>
            <div className="current-item">
                {children}
            </div>
            <div className="dropdown">
                {
                    items.map((item) => (
                        <Link className="dropdown-item" key={item.label} to={item.route}>
                            {item.label}
                        </Link>
                    ))
                }
            </div>
        </div>
    );
}
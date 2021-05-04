
import { ReactNode } from "react";
import { Link } from "react-router-dom";

import './button-link.scss';
import Button from 'components/ui/Button';

interface Props {
    children: ReactNode;
    href: string;
    routing?: boolean;
    className?: string;
}

export default function ButtonLink({ children, href, routing, className }: Props) {
    return (
        <Button className={'button-link ' + (className ?? '')}>
            { routing
                ? <Link to={href}>{children}</Link>
                : <a href={href}>{children}</a>
            }
        </Button>
    );
}


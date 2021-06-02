
import { ReactNode } from "react";
import { Link } from "react-router-dom";

import Button from 'components/ui/Button';

import './button-link.scss';

interface Props {
    children: ReactNode;
    href: string;
    html?: boolean;
    className?: string;
}

export default function ButtonLink({ children, href, html, className }: Props) {
    return (
        <Button className={'button-link ' + (className ?? '')}>
            { html
                ? <a href={href}>{children}</a>
                : <Link to={href}>{children}</Link>
            }
        </Button>
    );
}


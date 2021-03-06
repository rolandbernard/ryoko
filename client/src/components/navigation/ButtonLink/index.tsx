
import { ReactNode } from "react";
import { Link } from "react-router-dom";

import './button-link.scss';

interface Props {
    children: ReactNode;
    href: string;
    html?: boolean;
    className?: string;
}

/**
 * This component implements a link that is formatted to look like a link. If the html properties is
 * true, a html a-tag will be used, otherwise a react-router link will be used.
 */
export default function ButtonLink({ children, href, html, className }: Props) {
    const classes = 'button button-link ' + (className ?? '');
    return (html
        ? <a className={classes} href={href}>{children}</a>
        : <Link className={classes} to={href}>{children}</Link>
    );
}



import { ReactNode } from "react";
import {Link} from "react-router-dom";

import './button-link.scss';
import Button from "../Button";

interface Props {
    children: ReactNode;
    href: string;
    routing?: boolean;
}

export default function ButtonLink({children, href, routing}: Props) {
    return (
        <Button>
            { routing
                ? <Link className="button-link" to={href}>{children}</Link>
                : <a className="button-link" href={href}>{children}</a>
            }
        </Button>
    );
}


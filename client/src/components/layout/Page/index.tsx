
import { ReactNode } from 'react';

import './page.scss';

interface Props {
    children?: ReactNode,
    className?: string,
}

/**
 * This is used as a wrapper for the application content. This is mainly used for styling and layout
 * purposes.
 */
export default function Page({ children, className }: Props) {
    return (<>
        <main className={'page-container ' + (className ?? '')}>
            {children}
        </main>
    </>);
}


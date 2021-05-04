
import { ReactNode } from 'react';
import DynamicBackground from 'components/ui/DynamicBackground';

import './page.scss';

interface Props {
    children?: ReactNode,
    className?: string,
}

export default function Page({ children, className }: Props) {
    return (<>
        <main className={'page-container ' + (className ?? '')}>
            {children}
        </main>
        <DynamicBackground />
    </>);
}


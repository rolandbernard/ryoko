import { ReactNode } from 'react';
import Header from 'components/ui/Header';
import './page.scss';

interface Props {
    children?: ReactNode,
    className?: string,
    header?: boolean
}

export default function Page({ children, className, header }: Props) {
    header = header ?? true;
    return (
        <>
            <main className={'page-container ' + (className ?? '')}>
                {header && <Header />}
                {children}
            </main>
        </>
    );
}
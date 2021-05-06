import './header.scss';
import hamburger from 'images/svg/hamburger.svg';
import Navigation from 'components/navigation/Navigation';
import Sidebar from 'components/navigation/Sidebar';
import Page from 'components/layout/Page'
import { ReactNode, useState } from 'react';

interface Props {
    children?: ReactNode
}

export default function Header({ children }: Props) {
    const [showSidebar, setShowSidebar] = useState<boolean>(false);
    return (
        <div className="full-width">
            <Sidebar setMobileShown={setShowSidebar} mobileShown={showSidebar} />
            <div className={'page-wrapper' + (showSidebar ? ' moved' : '')} onClick={() => showSidebar && setShowSidebar(false)}>
                <Page>
                    <header className="site-header">
                        <img src={hamburger} alt="Navigation" onClick={() => !showSidebar && setShowSidebar(true)} />
                    </header>
                    {children}
                </Page>
                <Navigation />
            </div>
        </div>
    );
}
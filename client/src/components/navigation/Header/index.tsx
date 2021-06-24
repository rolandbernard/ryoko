
import { ReactNode, useState } from 'react';

import Navigation from 'components/navigation/Navigation';
import Sidebar from 'components/navigation/Sidebar';
import Page from 'components/layout/Page'

import './header.scss';

interface Props {
    children?: ReactNode
}

/**
 * This component contains the navigation header, sidebar and basic site layout. This component is
 * used as the wrapper for most pages of the application.
 */
export default function Header({ children }: Props) {
    const [showSidebar, setShowSidebar] = useState(false);

    return (
        <div className="full-width">
            <Navigation />
            <Sidebar setMobileShown={setShowSidebar} mobileShown={showSidebar} />
            <div className={'page-wrapper' + (showSidebar ? ' moved' : '')} onClick={() => showSidebar && setShowSidebar(false)}>
                <Page>
                    <header className="site-header">
                        <div
                            className="hamburger-container"
                            onClick={() => !showSidebar && setShowSidebar(true)}
                        >
                            <div className="hamburger">
                                <div className="line"></div>
                            </div>
                        </div>
                    </header>
                    {children}
                </Page>
            </div>
        </div>
    );
}


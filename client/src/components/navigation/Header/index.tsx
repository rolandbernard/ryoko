import './header.scss';
import { useHistory } from 'react-router-dom';
import Navigation from 'components/navigation/Navigation';
import Sidebar from 'components/navigation/Sidebar';
import Page from 'components/layout/Page'
import { ReactNode, useState } from 'react';

interface Props {
    children?: ReactNode
}

export default function Header({ children }: Props) {
    const history = useHistory();
    const hasBack = history.location.pathname.split('/').length > 2;

    const [showSidebar, setShowSidebar] = useState<boolean>(false);
    return (
        <div className="full-width">
            <Sidebar setMobileShown={setShowSidebar} mobileShown={showSidebar} />
            <div className={'page-wrapper' + (showSidebar ? ' moved' : '')} onClick={() => showSidebar && setShowSidebar(false)}>
                <Page>
                    <header className={'site-header' + (!hasBack ? ' right' : '')}>
                        {
                            hasBack && (
                                <span className="material-icons" onClick={history.goBack} >
                                    arrow_back
                                </span>
                            )
                        }
                        <div className="hamburger-container">
                            <div className="hamburger" onClick={() => !showSidebar && setShowSidebar(true)}>
                                <div className="line"></div>
                            </div>
                        </div>
                    </header>
                    {children}
                </Page>
                <Navigation />
            </div>
        </div>
    );
}
import './header.scss';
import hamburger from 'images/svg/hamburger.svg';
import profile from 'images/svg/profile.svg';
import Navigation from 'components/ui/Navigation';
import Sidebar from 'components/ui/Sidebar';
import { ReactNode, useState } from 'react';

interface Props {
    children?: ReactNode
}

export default function Header({ children }: Props) {
    const [showSidebar, setShowSidebar] = useState<boolean>(false);
    return (
        <div className="full-width">
            <Sidebar mobileShown={showSidebar} />
            <div className={'page-wrapper' + (showSidebar ? ' moved' : '')} onClick={() => showSidebar && setShowSidebar(false)}>
                <header className="site-header">
                    <img src={hamburger} alt="Navigation" onClick={() => !showSidebar && setShowSidebar(true)} />
                </header>
                <Navigation />
                {children}
            </div>
        </div>
    );
}
import './header.scss';
import hamburger from 'images/svg/hamburger.svg';
import profile from 'images/svg/profile.svg';
import Navigation from 'components/ui/Navigation';
import Sidebar from 'components/ui/Sidebar';
import { useState } from 'react';

export default function Header() {
    const [showSidebar, setShowSidebar] = useState<boolean>(false);
    return (
        <>
            <Navigation />
            <Sidebar mobileShown={showSidebar} />
            <header className="site-header">
                <img src={hamburger} alt="Navigation" onClick={() => setShowSidebar(state => !state)} />
                <img src={profile} alt="Profile" />
            </header>
        </>
    );
}
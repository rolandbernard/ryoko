import './landing.scss';

import React from 'react';
import Page from 'components/layout/Page';
import Intro from './partials/Intro';
import Features from './partials/Features';
import AboutApp from './partials/AboutApp';
import Team from './partials/Team';
import Contact from './partials/Contact';
import Logo from 'images/logo.svg';

export default function LandingPage(): JSX.Element {
    return (
        <Page className="landing-page">
            <Intro />
            <Features />
            <AboutApp />
            <Team />
            <Contact />
            <footer>
                <div className="content-container footer-container">
                    <div className="footer-copyright">
                        <img src={Logo} className="logo" alt="" width="70" height="24" />
                        <p>
                            &copy; <a href="index.html">ryoko</a>, 2021
                        </p>
                        <p>
                            All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </Page>
    )
}


import Page from 'components/layout/Page';
import Logo from 'images/logo.svg';

import Intro from './Intro';
import Features from './Features';
import AboutApp from './AboutApp';
import Team from './Team';
import Contact from './Contact';

import './landing.scss';

/**
 * This page is the landing page of the project. It shows some information on the project and
 * the team. It also includes a contact section with a contact form.
 */
export default function LandingPage(): JSX.Element {
    return (
        <Page className="landing-page">
            <Intro />
            <Features />
            <AboutApp />
            <Team />
            <Contact />
            <footer className="content-container">
                <img src={Logo} className="logo" alt="" width="70" height="24" />
                <p>
                    &copy; <a href="index.html">ryoko</a>, 2021
                </p>
                <p>
                    All rights reserved.
                </p>
            </footer>
        </Page>
    )
}


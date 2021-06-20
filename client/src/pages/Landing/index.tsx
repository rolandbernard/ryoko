import './landing.scss';

import React from 'react';
import Page from 'components/layout/Page';
import Intro from './partials/Intro';
import Features from './partials/Features';
import AboutApp from './partials/AboutApp';

export default function LandingPage(): JSX.Element {
    return (
        <Page className="landing-page">
            <Intro />
            <Features />
            <AboutApp />
        </Page>
    )
}

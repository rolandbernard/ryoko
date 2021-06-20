import './landing.scss';

import React from 'react';
import Page from 'components/layout/Page';
import Intro from './partials/Intro';

export default function LandingPage(): JSX.Element {
    return (
        <Page className="landing-page">
            <Intro />
        </Page>
    )
}

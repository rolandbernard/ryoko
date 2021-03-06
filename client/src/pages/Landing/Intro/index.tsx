
import ButtonLink from 'components/navigation/ButtonLink';

import TasksImage from 'images/preview/tasks.jpg';
import TeamsImage from 'images/preview/teams.jpg';
import ProjectsImage from 'images/preview/projects.jpg';

import './intro.scss';

/**
 * This is the intro section of the landing page, containing the example images and the
 * "Get started"-button.
 */
export default function Intro() {
    return (
        <section className="intro-section content-container">
            <header className="heading-container">
                <h1>ryoko<span className="text-primary">.</span></h1>
                <div className="subtitle">Plan your projects like a journey</div>
                <div className="button-container">
                    <ButtonLink href="/tasks">Get started</ButtonLink>
                </div>
            </header>
            <div className="preview-images">
                <div className="phone-image">
                    <img src={ProjectsImage} alt="Tasks preview" />
                </div>
                <div className="phone-image">
                    <img src={TasksImage} alt="Tasks preview" />
                </div>
                <div className="phone-image">
                    <img src={TeamsImage} alt="Tasks preview" />
                </div>
            </div>
        </section>
    )
}


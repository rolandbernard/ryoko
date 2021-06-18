
import { Status } from 'adapters/common';

import Page from 'components/layout/Page';
import ContactForm from 'components/forms/ContactForm';
import ButtonLink from 'components/navigation/ButtonLink';
import Project from 'components/ui/Project';

import Logo from 'images/logo.svg';
import ImageRoland from 'images/roland-bernard.jpg';
import ImageDaniel from 'images/daniel-planoetscher.jpg';

import './home.scss';

export default function Home(): JSX.Element {
    return (
        <Page className="landing-page">
            <section className="hero-section" id="hero">
                <div className="hero-container">
                    <header>
                        <a href="index.html">
                            <img src={Logo} alt="Go home" width="100" height="35" />
                        </a>
                        <nav>
                            <a href="#hero">Home</a>
                            <a href="#team">Team</a>
                            <a href="#contact">Contact</a>
                        </nav>
                    </header>
                    <div className="preview-container">
                        <div className="preview-phone">
                            <div className="inner">
                            </div>
                        </div>
                    </div>
                    <div className="content-container">
                        <div className="text-container">
                            <h1>ryoko</h1>
                            <p>Are you feeling lost with your tasks? Maximize your productivity now with ryoko.</p>
                            <div className="button-container">
                                <ButtonLink href="/tasks">Get started</ButtonLink>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="intro-section" id="intro">
                <div className="content-container">
                    <div className="intro-container">
                        <div className="text-container">
                            <h2 className="left">Plan your projects like a journey!</h2>
                            <p>
                                Do you want to boost your productivity and agility of your
                                development? <br />
                                With ryoko you are able to effectively plan your tasks
                                and manage your projects. It is build with developers in mind and
                                facilitates effective collaboration.
                            </p>
                        </div>
                        <div className="preview-container">
                            <Project demo={true} project={{
                                id: '55',
                                name: 'Hello world',
                                text: 'xxx',
                                color: 'yellow',
                                status: Status.OPEN,
                                deadline: new Date(),
                                teams: [],
                            }}/>
                            <Project demo={true} project={{
                                id: '73',
                                name: 'Project',
                                text: 'xxx',
                                color: 'red',
                                status: Status.OPEN,
                                deadline: new Date(),
                                teams: [],
                            }}/>
                            <Project demo={true} project={{
                                id: '93',
                                name: 'Api routes',
                                text: 'xxx',
                                color: 'blue',
                                status: Status.CLOSED,
                                deadline: new Date(),
                                teams: [],
                            }}/>
                            <Project demo={true} project={{
                                id: '5',
                                name: 'Task list',
                                text: 'xxx',
                                color: 'green',
                                status: Status.SUSPENDED,
                                deadline: new Date(),
                                teams: [],
                            }}/>
                        </div>
                    </div>
                </div>
            </section>
            <section className="feature-section">
                <div className="content-container feature-container">
                    <h2>Revolutionize your productivity</h2>
                    <div className="feature-list">
                        <div className="feature-item">
                            <span className="feature-icon material-icons">query_stats</span>
                            <h3 className="feature-title">Analyze your productivity</h3>
                            <div className="feature-description">
                                Find your <strong>weaknesses and strengths</strong> by analyzing graphs
                            </div>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon material-icons">event</span>
                            <h3 className="feature-title">Automatic timetables</h3>
                            <div className="feature-description">
                                Generate your automatic timetables based on <strong>priorities and decencies</strong> of
                                your tasks
                            </div>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon material-icons">group</span>
                            <h3 className="feature-title">Team-based</h3>
                            <div className="feature-description">
                                Distribute task within your Teams based on <strong>profession and difficulty</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="team-section" id="team">
                <div className="content-container team-container">
                    <h2>Our Team</h2>
                    <p>
                        People are what makes a project great, and here are the people that make us
                        great.
                    </p>
                    <div className="team-list">
                        <div className="team-member">
                            <img className="team-member-image" src={ImageDaniel} width="200" height="200"
                                alt="" />
                            <div className="team-member-info">
                                <div className="team-member-title">Web Developer</div>
                                <h3 className="team-member-name">Daniel Planötscher</h3>
                                <div className="team-member-description">
                                    Besides studying Computer Science, Daniel also enjoys taking photos and
                                    designing user interfaces for hobby projects, which is why he focuses on
                                    the FrontEnd of ryoko. Furthermore, he brings significant industry
                                    experience working as a web developer using state of the art tools and
                                    programming techniques. He is involved in the creation of modern
                                    websites for dozens of clients with advanced requirements.
                                </div>
                            </div>
                        </div>
                        <div className="team-member">
                            <img className="team-member-image" src={ImageRoland} width="200" height="200"
                                alt="" />
                            <div className="team-member-info">
                                <div className="team-member-title">Software Engineer</div>
                                <h3 className="team-member-name">Roland Bernard</h3>
                                <div className="team-member-description">
                                    Studying Computer Science and participating in Competitive Programming
                                    Competitions, Roland constitutes a integral part of our development team
                                    at ryoko. Like all members of our team he also has experience in the
                                    industry, mainly working on business management systems and software for
                                    the financial sector. He is also experienced in the implementation of
                                    development tools and infrastructure components.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="contact-section darker" id="contact">
                <div className="content-container contact-container">
                    <h2>Get in touch</h2>
                    <p>
                        Do you still have a question? Just contact us directly and we will be glad
                        to help you resolve the issue.
                    </p>
                    <ContactForm onSubmit={
                        (
                            firstname: string,
                            basename: string,
                            email: string,
                            subject: string,
                            message: string
                        ) => {
                            window.location.href = 'mailto:dplanoetscher@unibz.it'
                                + '?subject='
                                + encodeURIComponent(subject)
                                + '&body='
                                + encodeURIComponent(
                                    `Name: ${firstname} ${basename}\n`
                                    + `Email: ${email}\n`
                                    + 'Message:\n\n'
                                    + message
                                );
                        }
                    }/>
                </div>
            </section>
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
                    <div className="footer-nav">
                        <a href="#hero">Home</a>
                        <a href="#team">Team</a>
                        <a href="#contact">Contact</a>
                    </div>
                </div>
            </footer>
        </Page>
    );
}



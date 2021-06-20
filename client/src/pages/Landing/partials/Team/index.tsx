import './team.scss';
import React from 'react';
import ImageRoland from 'images/roland-bernard.jpg';
import ImageDaniel from 'images/daniel-planoetscher.jpg';
import Tag from 'components/ui/Tag';
export default function Team() {
    return (
        <section className="team-section content-container">
            <h2>Our Team</h2>
            <p className="heading-lead">
                People are what makes a project great, and here are the people that make us
                great.
            </p>
            <div className="team-list">
                <div className="team-member">
                    <img className="team-member-image" src={ImageDaniel} width="200" height="200"
                        alt="" />
                    <div className="team-member-info">
                        <Tag label="Web Developer" color="purple" />
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
                        <Tag label="Software Engineer" color="purple" />
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
        </section>
    )
}

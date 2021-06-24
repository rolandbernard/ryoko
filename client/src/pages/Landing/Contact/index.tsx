
import ContactForm from 'components/forms/ContactForm';

import './contact.scss';

/**
 * This is a section with a form that allows users to contact the ryoko team. When send is pressed,
 * a new email link is opened.
 */
export default function Contact() {
    return (
        <section className="contact-section content-container">
            <header className="heading-container">
                <h2>Get in touch</h2>
                <p className="heading-lead">
                    Do you still have a question? Just contact us directly and we will be glad
                    to help you resolve the issue.
                </p>
            </header>
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
            } />
        </section>
    )
}


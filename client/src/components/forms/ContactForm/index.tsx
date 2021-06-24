
import { FormEvent, useCallback, useState } from "react";

import TextInput from 'components/ui/TextInput';
import Button from 'components/ui/Button';

import './contact-form.scss';
import '../form.scss';

interface Props {
    onSubmit?: (
        firstname: string,
        basename: string,
        email: string,
        subject: string,
        message: string
    ) => void
}

/**
 * This is the contact form visible on the landing page. The component will call the onSubmit
 * property when the form is submitted with the values the user entered.
 */
export default function ContactForm({ onSubmit }: Props) {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        if (firstname && lastname && email && subject && message) {
            onSubmit?.(firstname, lastname, email, subject, message);
        }
    }, [onSubmit, firstname, lastname, email, subject, message]);

    return (
        <form className="contact-form" onSubmit={handleSubmit}>
            <div className="fields">
                <div className="fields-row">
                    <div className="col">
                        <TextInput
                            label="Firstname"
                            name="firstname"
                            onChange={setFirstname}
                            validation={(text: string) => text.length !== 0 ? null : 'Field is required'}
                        />
                    </div>
                    <div className="col">
                        <TextInput
                            label="Lastname"
                            name="lastname"
                            onChange={setLastname}
                            validation={(text: string) => text.length !== 0 ? null : 'Field is required'}
                        />
                    </div>
                </div>
                <div className="fields-row">
                    <div className="col">
                        <TextInput
                            label="Email"
                            name="email"
                            onChange={setEmail}
                            validation={(text: string) => text.length !== 0 ? null : 'Field is required'}
                        />
                    </div>
                    <div className="col">
                        <TextInput
                            label="Subject"
                            name="subject"
                            onChange={setSubject}
                            validation={(text: string) => text.length !== 0 ? null : 'Field is required'}
                        />
                    </div>
                </div>
            </div>
            <TextInput
                label="Message"
                name="message"
                type="textarea"
                onChange={setMessage}
                validation={(text: string) => text.length !== 0 ? null : 'Field is required'}
            />
            <div className="button-container">
                <Button type="submit" className="submit-button">
                    Send
                </Button>
            </div>
        </form>
    );
}


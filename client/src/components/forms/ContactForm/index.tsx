
import { FormEvent, useCallback, useState } from "react";

import TextInput from 'components/ui/TextInput';
import Button from 'components/ui/Button';

import './contact-form.scss';

interface Props {
    onSubmit?: (
        firstname: string,
        basename: string,
        email: string,
        subject: string,
        message: string
    ) => void
}

export default function RegisterForm({ onSubmit }: Props) {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        onSubmit?.(firstname, lastname, email, subject, message);
    }, [onSubmit, firstname, lastname, email, subject, message]);

    return (
        <form className="contact-form" onSubmit={handleSubmit}>
            <TextInput
                label="Firstname"
                name="firstname"
                onChange={setFirstname}
            />
            <TextInput
                label="Lastname"
                name="lastname"
                onChange={setLastname}
            />
            <TextInput
                label="Email"
                name="email"
                onChange={setEmail}
            />
            <TextInput
                label="Subject"
                name="subject"
                onChange={setSubject}
            />
            <TextInput
                label="Message"
                name="message"
                type="textarea"
                onChange={setMessage}
            />
            <div className="button-container">
                <Button type="submit" className="submit-button">
                    Login
            </Button>
            </div>
        </form>
    );
}


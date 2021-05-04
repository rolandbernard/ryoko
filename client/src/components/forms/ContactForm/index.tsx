import { FormEvent, useCallback, useState } from "react";
import TextInput from 'components/ui/TextInput';
import Button from 'components/ui/Button';
import './contact-form.scss';

interface Props {
    onSubmit?: (firstname: string, lastname: string, email: string, subject: string, message: string) => void
}

export default function RegisterForm({ onSubmit }: Props) {
    const [firstname, setFirstname] = useState<string>('');
    const [lastname, setLastname] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [subject, setSubject] = useState<string>('');
    const [message, setMessage] = useState<string>('');

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


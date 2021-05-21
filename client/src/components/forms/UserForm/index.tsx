import { User } from 'adapters/user';
import { FormEvent, useCallback, useState } from 'react';
import './user-form.scss';
import TextInput from 'components/ui/TextInput';
import Button from 'components/ui/Button';

interface Props {
    onSubmit?: (name?: string, email?: string, avatar?: File) => void;
    user: User
}

function validateEmail(email?: string): string | null {
    if (email && email.length > 0) {
        if (email.match('^[^\\s]+@[^\\s]+$')) {
            return null;
        } else {
            return 'Please enter a valid email or let this field blank.'
        }
    } else {
        return null;
    }
}

function validateAvatar(avatar?: File): string | null {
    const validTypes = ['image/jpg', 'image/png', 'image/gif']
    if (avatar) {
        if (validTypes.find((type) => type === avatar.type)) {
            return null;
        } else {
            return 'Only files from type jpg, png or gif are allowed'
        }
    } else {
        return null;
    }
}

export default function UserForm({ user, onSubmit }: Props) {
    const [name, setName] = useState(user.realname);
    const [email, setEmail] = useState(user.email);
    const [avatar, setAvatar] = useState<File>();
    const handleSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        if (validateEmail(email) === null || validateAvatar(avatar) === null) {
            onSubmit?.(name, email, avatar);
        }
    }, [onSubmit, name, email, avatar]);
    return (
        <form onSubmit={handleSubmit} className="user-form">
            <div className="fields">
                <TextInput
                    label="Real Name"
                    name="name"
                    onChange={setName}
                    defaultText={name}
                />
                <TextInput
                    label="Email address"
                    name="name"
                    validation={validateEmail}
                    onChange={setEmail}
                    defaultText={email}
                />
                <div className="avatar-upload">
                    <div className="label">Avatar</div>
                    <label htmlFor="avatar" className="avatar-field">
                        <input type="file" id="avatar" name="avatar" onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                                setAvatar(e.target.files[0])
                            }
                        }} />
                        {avatar ? 'Selected file: ' + avatar.name : 'Select a file'}
                    </label>
                </div>
            </div>
            <Button type="submit" className="expanded">
                Save
            </Button>
        </form >
    )
}
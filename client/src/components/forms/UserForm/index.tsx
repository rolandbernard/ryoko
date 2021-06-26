
import { FormEvent, useCallback, useState } from 'react';

import { User } from 'adapters/user';

import TextInput from 'components/ui/TextInput';
import Button from 'components/ui/Button';
import Callout from 'components/ui/Callout';

import './user-form.scss';
import '../form.scss';

interface Props {
    onSubmit?: (
        name?: string,
        email?: string,
        avatar?: File
    ) => void;
    user: User
}

const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg']

/**
 * Validate that the given string is acceptable as a user email. User emails
 * must match a certain format.
 * 
 * @param email The email to validate
 * @returns An error message or null
 */
function validateEmail(email?: string): string | null {
    if (email && email.length > 0) {
        if (email.match('^[^\\s]+@[^\\s]+$')) {
            return null;
        } else {
            return 'Please enter a valid email or leave this field blank.'
        }
    } else {
        return null;
    }
}

/**
 * Validate that the given File is acceptable as a user image. User images
 * must have a image mime type.
 * 
 * @param avatar The avatar to validate
 * @returns An error message or null
 */
function validateAvatar(avatar?: File): string | null {
    if (avatar) {
        if (validTypes.find((type) => type === avatar.type)) {
            return null;
        } else {
            return 'Only files from type jpg, png or gif are allowed';
        }
    } else {
        return null;
    }
}

/**
 * This component implements a form for editing a users information. This form contains fields to
 * input a users real name and email, as well as a field for uploading a user image.
 */
export default function UserForm({ user, onSubmit }: Props) {
    const [name, setName] = useState(user.realname);
    const [email, setEmail] = useState(user.email);
    const [error, setError] = useState('');
    const [avatarError, setAvatarError] = useState('');
    const [avatar, setAvatar] = useState<File>();

    const handleSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        if (validateEmail(email) === null && validateAvatar(avatar) === null) {
            onSubmit?.(name, email, avatar);
        } else {
            setError('Please fill in the mandatory fields.');
        }
    }, [onSubmit, name, email, avatar]);

    return (
        <form onSubmit={handleSubmit} className="user-form">
            {error && <Callout message={error} />}
            <div className="fields">
                <div className="fields-row">
                    <div className="col">
                        <TextInput
                            label="Real Name"
                            name="name"
                            onChange={setName}
                            defaultText={name}
                        />
                    </div>
                    <div className="col">
                        <TextInput
                            label="Email address"
                            name="name"
                            validation={validateEmail}
                            onChange={setEmail}
                            defaultText={email}
                        />
                    </div>
                </div>
                <div className="avatar-upload input-element">
                    <div className="label">Avatar</div>
                    <label htmlFor="avatar" className="avatar-field">
                        <input type="file" id="avatar" name="avatar" onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                                if (validateAvatar(e.target.files[0])) {
                                    setAvatarError(validateAvatar(e.target.files[0]) ?? '');
                                } else {
                                    setAvatar(e.target.files[0])
                                }
                            }
                        }} />
                        {avatar ? 'Selected file: ' + avatar.name : 'Select a file'}
                    </label>
                    {avatarError && <div className="error">{avatarError}</div>}
                </div>
            </div>
            <Button type="submit" className="expanded">
                Save
            </Button>
        </form >
    )
}

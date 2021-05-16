import { FormEvent, MouseEventHandler, useCallback, useState } from 'react';
import TextInput from 'components/ui/TextInput';
import Button from 'components/ui/Button';
import './team-create.scss';

interface Props {
    onSubmit?: (name: string) => void;
    onBack?: MouseEventHandler
}

function validateName(name: string): string | null {
    if (name && name.length > 0) {
        return null;
    }
    return 'The name is required';
}

export default function TeamCreateForm({ onSubmit, onBack }: Props) {
    const [name, setName] = useState('');
    const handleSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        if (validateName(name) === null) {
            onSubmit?.(name);
        }
    }, [onSubmit, name]);
    return (
        <form className="team-create-form" onSubmit={handleSubmit}>
            <div className="lead-text">
                <p>
                    Create a new team with just one click by giving it a name!
            </p>
            </div>
            <TextInput label="Team name" name="name" validation={validateName} onChange={setName} />
            <div className="button-container">
                {
                    onBack &&
                    <Button onClick={onBack} className="hollow">
                        Go Back
                </Button>

                }
                <Button type="submit">
                    Create
            </Button>
            </div>
        </form>
    )
}
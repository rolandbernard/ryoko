
import { FormEvent, MouseEventHandler, useCallback, useState } from 'react';

import { Team } from 'adapters/team';

import TextInput from 'components/ui/TextInput';
import Button from 'components/ui/Button';

import './team-create.scss';
import '../form.scss';

interface Props {
    onSubmit?: (name: string) => void;
    onBack?: MouseEventHandler
    team?: Team
}

export function validateName(name: string): string | null {
    if (name && name.length > 0) {
        return null;
    }
    return 'The name is required';
}

/**
 * This component implements a form for editing a tasks data. Since a task only consists of a name,
 * this is only a simple TextInput with two buttons. If the team property is set, the form will be
 * for updating an existing team, otherwise for creating a new one.
 */
export default function TeamForm({ onSubmit, onBack, team }: Props) {
    const [name, setName] = useState(team?.name ?? '');

    const handleSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        if (validateName(name) === null) {
            onSubmit?.(name);
        }
    }, [onSubmit, name]);

    return (
        <form className="team-form" onSubmit={handleSubmit}>
            <TextInput
                label="Team name"
                name="name"
                validation={validateName}
                onChange={setName}
                defaultText={name}
            />
            <div className="button-container">
                <Button type="submit" className={!onBack ? 'expanded' : ''}>
                    {team ? 'Update' : 'Create'}
                </Button>
                {
                    onBack &&
                    <Button onClick={onBack} className="dark">
                        Go Back
                    </Button>
                }
            </div>
        </form>
    )
}

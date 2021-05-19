import { FormEvent, MouseEventHandler, useCallback, useState } from 'react';
import TextInput from 'components/ui/TextInput';
import Button from 'components/ui/Button';
import './team-create.scss';
import { Team } from 'adapters/team';

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

export default function TeamCreateForm({ onSubmit, onBack, team }: Props) {
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
                {
                    onBack &&
                    <Button onClick={onBack} className="hollow">
                        Go Back
                    </Button>
                }
                <Button type="submit" className={!onBack ? 'expanded' : ''}>
                    {team ? 'Update' : 'Create'}
                </Button>
            </div>
        </form>
    )
}
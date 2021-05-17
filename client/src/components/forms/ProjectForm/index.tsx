import { Project, ProjectColors } from 'adapters/project';
import { FormEvent, useCallback, useState } from 'react';
import Callout from 'components/ui/Callout';
import Button from 'components/ui/Button';
import TextInput from 'components/ui/TextInput';
import './project-form.scss';

interface Props {
    project?: Project
    onSubmit: (name: string, text: string, color: string, deadline?: Date) => void;
}

function validateName(name: string): string | null {
    if (name.length > 0) {
        return null;
    } else {
        return 'Please enter a name';
    }
}

function validateText(text: string): string | null {
    if (text.length > 0) {
        return null;
    } else {
        return 'Please enter a description';
    }
}

function validateColor(color: string): string | null {
    if (color.length > 0) {
        return null;
    } else {
        return 'Please enter a description';
    }
}

export default function ProjectForm({ project, onSubmit }: Props) {
    const [name, setName] = useState(project?.name ?? '');
    const [text, setText] = useState(project?.text ?? '');
    const [color, setColor] = useState(project?.color ?? '');
    const [deadline, setDeadline] = useState(project?.deadline);
    const [error, setError] = useState('');

    const colors = Object.values(ProjectColors);

    const handleSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        if (validateName(name) === null && validateText(text) === null && validateColor(color) === null) {
            onSubmit?.(name, text, color, deadline);
        } else {
            setError('Please fill in the mandatory fields.');
        }
    }, [onSubmit, setError, name, text, color, deadline]);
    
    return (
        <form onSubmit={handleSubmit} className="project-form">
            {error && <Callout message={error} />}
            <TextInput
                label="Name"
                name="name"
                onChange={setName}
                validation={validateName}
            />
            <TextInput
                label="Description"
                name="text"
                onChange={setText}
                validation={validateText}
                type="textarea"
            />
            <h2>Color</h2>
            <div className="color-list">
                {
                    colors.map(colorItem => (
                        <div
                            className={'color-item bg-gradient-' + colorItem + (color === colorItem ? ' active' : '')}
                            key={colorItem}
                            onClick={() => setColor(colorItem)}
                        >

                        </div>
                    ))
                }
            </div>
            
            <TextInput
                label="Deadline"
                name="text"
                onChange={setDeadline}
                type="date"
            />
            
            <Button type="submit">
                Create
            </Button>
        </form>
    )
}
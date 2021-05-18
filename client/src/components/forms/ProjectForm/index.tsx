import { Project, ProjectColors, Status } from 'adapters/project';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import Callout from 'components/ui/Callout';
import Button from 'components/ui/Button';
import TextInput from 'components/ui/TextInput';
import './project-form.scss';
import { getTeam, getTeams, Team } from 'adapters/team';

interface Props {
    project?: Project
    onSubmit: (teams: string[], name: string, text: string, color: string, status?: Status, deadline?: Date) => void;
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

function validateTeams(teams: string[]): string | null {
    if (teams.length > 0) {
        return null;
    } else {
        return 'Please choose at least one team';
    }
}

export default function ProjectForm({ project, onSubmit }: Props) {

    const [name, setName] = useState(project?.name);
    const [text, setText] = useState(project?.text);
    const [status, setStatus] = useState(project?.status);
    const [color, setColor] = useState(project?.color);
    const [deadline, setDeadline] = useState(project?.deadline);
    const [error, setError] = useState('');

    const [teams, setTeams] = useState(project?.teams ?? []);
    const [allTeams, setAllTeams] = useState<Team[]>([]);

    useEffect(() => {
        teams.forEach((userTeam) => {
            getTeam(userTeam).then((team) => {
                setAllTeams(state => [...state, team]);
            });
        });
        getTeams().then((allTeamsItems) => {
            allTeamsItems.forEach(allTeamsItem => {
                setAllTeams(state => {
                    if (!state.find((team) => team.id === allTeamsItem.id)) {
                        return [...state, allTeamsItem];
                    }
                    return [...state];
                });
            })
        });
    }, [])


    const colors = Object.values(ProjectColors);
    const allStatus = Object.values(Status);
    console.log(allStatus);


    const handleSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        if (validateName(name ?? '') === null &&
            validateText(text ?? '') === null &&
            validateColor(color ?? '') === null &&
            validateTeams(teams) === null
        ) {
            onSubmit?.(teams, name ?? '', text ?? '', color ?? '', status ?? Status.OPEN, deadline);
        } else {
            setError('Please fill in the mandatory fields.');
        }
    }, [onSubmit, setError, name, text, color, deadline, teams, status]);

    return (
        <form onSubmit={handleSubmit} className="project-form">
            {error && <Callout message={error} />}
            <TextInput
                label="Name"
                name="name"
                onChange={setName}
                defaultText={name}
                validation={validateName}
            />
            <TextInput
                label="Description"
                name="text"
                onChange={setText}
                defaultText={text}
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
                defaultText={project?.deadline?.toString()}
                onChange={setDeadline}
                type="date"
            />

            <div className="teams">
                {
                    allTeams.map((team) => (
                        <div className="team-item" key={team.id}>
                            <input type="checkbox" id={team.id}
                                checked={teams.indexOf(team.id) >= 0}
                                onClick={(e) => {
                                    if (teams.find(id => team.id === id)) {
                                        setTeams(state => state.filter(id => id !== team.id));
                                    } else {
                                        setTeams(state => [...state, team.id]);
                                    }
                                }} />
                            <label htmlFor={team.id}>{team.name}</label>
                        </div>

                    ))
                }
            </div>

            {
                status &&
                <select onChange={(e: any) => {
                    let currentStatus = Object.values(Status).find(s => s === e.target.value) ?? Status.OPEN;
                    setStatus(currentStatus);
                }
                }>
                    {
                        allStatus.map((s) => (
                            <option selected={status === s} value={s} key={s}>{s}</option>
                        ))
                    }
                </select>
            }

            <Button type="submit">
                {project ? 'Update' : 'Create'}
            </Button>
        </form>
    )
}
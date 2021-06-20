
import { FormEvent, useCallback, useEffect, useState } from 'react';

import { Project, ProjectColors } from 'adapters/project';
import { getTeam, getTeams, Team } from 'adapters/team';
import { Status } from 'adapters/common';

import Button from 'components/ui/Button';
import Callout from 'components/ui/Callout';
import TextInput from 'components/ui/TextInput';
import ErrorScreen from 'components/ui/ErrorScreen';
import CheckboxGroup from 'components/ui/CheckboxGroup';

import '../form.scss';
import './project-form.scss';

interface Props {
    project?: Project
    onSubmit: (
        teams: string[],
        name: string,
        text: string,
        color: string,
        status?: Status,
        deadline?: string
    ) => void;
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
    const [deadline, setDeadline] = useState(project?.deadline?.toISOString());
    const [error, setError] = useState('');
    const [loadError, setLoadError] = useState(false);
    const [teams, setTeams] = useState(project?.teams ?? []);
    const [allTeams, setAllTeams] = useState<Team[]>([]);

    useEffect(() => {
        setLoadError(false);
        Promise.all([
            project?.teams ? Promise.all(project?.teams.map(team => getTeam(team))) : [],
            getTeams(),
        ]).then(([projectTeams, userTeams]) => {
            const teamIds = new Set<string>();
            const teams = [];
            for (const team of [...projectTeams, ...userTeams]) {
                if (!teamIds.has(team.id)) {
                    teams.push(team);
                    teamIds.add(team.id);
                }
            }
            setAllTeams(teams);
        })
        .catch(() => setLoadError(true))
    }, [project?.teams, loadError])

    const colors = Object.values(ProjectColors);
    const allStatus = Object.values(Status);

    const handleSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        if (validateName(name ?? '') === null &&
            validateText(text ?? '') === null &&
            validateColor(color ?? '') === null &&
            validateTeams(teams) === null
        ) {
            onSubmit?.(teams, name ?? '', text ?? '', color ?? '', status ?? Status.OPEN, deadline);
        } else {
            window.scrollTo(0, 0);
            setError('Please fill in the mandatory fields.');
        }
    }, [onSubmit, setError, name, text, color, deadline, teams, status]);

    return (
        <form onSubmit={handleSubmit} className={'project-form theme-' + color}>
            {error && <Callout message={error} />}
            <h2>General</h2>
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
                note="A short description of the project."
            />
            <div className="fields-row">
                <div className="col">
                    <TextInput
                        label="Deadline"
                        name="text"
                        defaultText={deadline}
                        onChange={setDeadline}
                        type="date"
                        note="Until when the project is due."
                    />
                </div>
                <div className="col">
                    {
                        status &&
                        <div className="field">
                            <label className="field-label" htmlFor="status">Status</label>
                            <select id="status" defaultValue={project?.status ?? ''} onChange={(e) => {
                                let currentStatus = Object.values(Status).find(s => s === e.target.value) ?? undefined;
                                setStatus(currentStatus);
                            }
                            }>
                                <option value="" disabled hidden>Please choose a status</option>
                                {
                                    allStatus.map((s) => (
                                        <option value={s} key={s}>{s}</option>
                                    ))
                                }
                            </select>
                        </div>
                    }
                </div>
            </div>
            <h2>Color</h2>
            <p>Choose a color, to identify to project later more easily.</p>
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
            <div className="teams">
                <h2>Teams</h2>
                <p>Which ones of your teams are working on this project</p>
                { loadError
                    ? <ErrorScreen />
                    : <CheckboxGroup choices={allTeams} chosen={teams} setChosen={setTeams} />
                }
            </div>
            <div className="button-container">
                <Button type="submit" className="expanded">
                    {project ? 'Update' : 'Create'}
                </Button>
            </div>
        </form>
    )
}

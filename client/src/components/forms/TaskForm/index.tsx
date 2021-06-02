
import { FormEvent, useCallback, useEffect, useState } from 'react';
import Picker from 'emoji-picker-react';

import { getProjectTasks, Project } from 'adapters/project';
import { getTeam, getTeamMembers, getTeamRoles } from 'adapters/team';
import { Priority, Task, TaskAssignment, TaskRequirement } from 'adapters/task';
import { Status } from 'adapters/common';

import Button from 'components/ui/Button';
import Callout from 'components/ui/Callout';
import TextInput from 'components/ui/TextInput';
import ErrorScreen from 'components/ui/ErrorScreen';
import LoadingScreen from 'components/ui/LoadingScreen';
import CheckboxGroup from 'components/ui/CheckboxGroup';
import AssigneesForm from 'components/forms/AssigneesForm';
import RequirementsForm from 'components/forms/RequirementsForm';

import './task-form.scss';
import '../form.scss';

interface Props {
    task?: Task;
    onSubmit: (
        name: string,
        text: string,
        icon: string,
        priority: Priority,
        dependencies: string[],
        requirements: TaskRequirement[],
        assignees: TaskAssignment[],
        status?: Status
    ) => void;
    project: Project;
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

function validateIcon(icon: string): string | null {
    if (icon.length > 0) {
        return null;
    } else {
        return 'Please enter an icon';
    }
}

function validatePriority(priority: string): string | null {
    if (priority.length > 0) {
        return null;
    } else {
        return 'Please choose a priority';
    }
}

export interface PossibleRole {
    id: string;
    label: string;
}
export interface PossibleMember {
    id: string;
    label: string;
}

export default function TaskForm({ task, onSubmit, project }: Props) {
    const [name, setName] = useState(task?.name);
    const [text, setText] = useState(task?.text);
    const [icon, setIcon] = useState(task?.icon);
    const [priority, setPriority] = useState(task?.priority);
    const [status, setStatus] = useState(task?.status);
    const [tasks, setTasks] = useState(task?.dependencies ?? []);
    const [error, setError] = useState('');
    const [loadError, setLoadError] = useState(false);

    const [requirements, setRequirements] = useState(task?.requirements ?? []);
    const [assignees, setAssignees] = useState(task?.assigned ?? []);

    const allPriorities = Object.values(Priority);
    const allStatus = Object.values(Status);
    const [allTasks, setAllTasks] = useState<Task[]>();
    const [allRoles, setAllRoles] = useState<PossibleRole[]>();
    const [allMembers, setAllMembers] = useState<PossibleMember[]>();

    useEffect(() => {
        setLoadError(false);
        getProjectTasks(project.id).then((tasks) => {
            setAllTasks(tasks.filter(cTask => task?.id !== cTask.id));
        })
        .catch(() => setLoadError(true));
        Promise.all([
            Promise.all(project.teams.map(team => getTeam(team).catch(() => null))),
            Promise.all(project.teams.map(team => getTeamRoles(team).catch(() => null))),
            Promise.all(project.teams.map(team => getTeamMembers(team).catch(() => null)))
        ])
        .then(([teams, roles, members]) => {
            setAllRoles(roles.map((roles, i) => roles?.map(role => ({
                id: role.id,
                label: role.name + ' (' + teams[i]?.name + ')',
            })) ?? []).flat());
            const memberIds = new Set<string>();
            const uniqueMembers = [];
            for (const member of members.flat()) {
                if (member && !memberIds.has(member.id)) {
                    uniqueMembers.push({
                        id: member.id,
                        label: member.realname ?? member.username,
                    });
                    memberIds.add(member.id);
                }
            }
            setAllMembers(uniqueMembers);
        })
        .catch(() => setLoadError(true));
    }, [task, project]);


    const handleSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        if (
            validateName(name ?? '') === null
            && validateText(text ?? '') === null
            && validateIcon(icon ?? '') === null
            && validatePriority(priority ?? '') === null
        ) {
            onSubmit?.(name ?? '', text ?? '', icon ?? '', priority ?? Priority.LOW, tasks ?? [], requirements, assignees, status);
        } else {
            window.scrollTo(0, 0);
            setError('Please fill in the mandatory fields.');
        }
    }, [onSubmit, setError, name, text, priority, icon, tasks, assignees, requirements, status]);

    return (
        <form className="task-form" onSubmit={handleSubmit}>
            {error && <Callout message={error} />}
            <h2>General</h2>
            <div className="fields-row">
                <div className="col">
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
                        note="A brief description what to do"
                    />
                </div>
                <div className="col">
                    <strong>Icon</strong>
                    <div className="current-icon">
                        Current icon: {icon}
                    </div>
                    <Picker disableSkinTonePicker onEmojiClick={(_e, emoji) => setIcon(emoji.emoji)} />
                    <div className="note">
                        <span className="material-icons">
                            help_outline
                        </span>
                        An icon that is shown next to the task
                    </div>
                </div>
                <div className="col">
                    <div className="field">
                        <label className="field-label"  htmlFor="status">
                            Priority
                    </label>
                        <select defaultValue={priority} onChange={(e) => {
                            let currentPriority = Object.values(Priority).find(s => s === e.target.value) ?? undefined;
                            setPriority(currentPriority);
                        }}>
                            <option value={''}>Please choose a priority</option>
                            {
                                allPriorities.map((priority) => (
                                    <option value={priority} key={priority}>{priority}</option>
                                ))
                            }
                        </select>
                        <div className="note">
                            <span className="material-icons">
                                help_outline
                            </span>
                            How important the task is
                        </div>
                    </div>
                </div>
                <div className="col">
                    {
                        status && (
                            <div className="field">
                                <label className="field-label"  htmlFor="status">
                                    Status
                                </label>
                                <select defaultValue={status} id="status" onChange={(e) => {
                                    let currentStatus = Object.values(Status).find(s => s === e.target.value) ?? undefined;
                                    setStatus(currentStatus);
                                }}>
                                    <option value={''}>Please choose a status</option>
                                    {
                                        allStatus.map((status) => (
                                            <option value={status} key={status}>{status}</option>
                                        ))
                                    }
                                </select>
                            </div>
                        )
                    }
                </div>
            </div>
            <h2>Dependencies</h2>
            <p>Pick tasks of this project that have to be done before this one.</p>
            {loadError
                ? <ErrorScreen />
                : <>
                    { allTasks
                        ? (allTasks.length > 0
                            ? <CheckboxGroup choices={allTasks ?? []} setChosen={setTasks} chosen={tasks ?? []} />
                            : <div className="error">No other tasks in this project</div>
                        )
                        : <LoadingScreen />
                    }
                    <div className="fields-row">
                        <div className="col">
                            { allRoles
                                ? allRoles.length > 0 && (
                                    <RequirementsForm setRequirements={setRequirements} roles={allRoles} requirements={requirements} />
                                )
                                : <LoadingScreen />
                            }
                        </div>
                        <div className="col">
                            { allMembers
                                ? allMembers.length > 0 && (
                                    <AssigneesForm members={allMembers} setAssignees={setAssignees} assignees={assignees} />
                                )
                                : <LoadingScreen />
                            }
                        </div>
                    </div>
                </>
            }
            <div className="button-container">
                <Button type="submit" className="expanded">
                    {task ? 'Update task' : 'Create task' }
                </Button>
            </div>
        </form>
    )
}

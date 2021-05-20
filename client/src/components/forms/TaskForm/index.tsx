import { Priority, Status, Task, TaskAssignment, TaskRequirement } from 'adapters/task';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import './task-form.scss';
import Callout from 'components/ui/Callout';
import TextInput from 'components/ui/TextInput';
import Picker from 'emoji-picker-react';
import { getProjectTasks, Project } from 'adapters/project';
import CheckboxGroup from 'components/ui/CheckboxGroup';
import { getTeam, getTeamMembers, getTeamRoles } from 'adapters/team';
import RequirementsForm from './RequirementsForm';
import AssgineesForm from './AssigneesForm';
import Button from 'components/ui/Button';

interface Props {
    task?: Task;
    onSubmit: (name: string, text: string, icon: string, priority: Priority, dependencies: string[], requirements: TaskRequirement[], assignees: TaskAssignment[], status?: Status) => void;
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

export interface possibleRole {
    id: string;
    label: string;
}
export interface possibleMember {
    id: string;
    label: string;
}

export default function TaskForm({ task, onSubmit, project }: Props) {
    const [name, setName] = useState(task?.name);
    const [text, setText] = useState(task?.text);
    const [icon, setIcon] = useState(task?.icon);
    const [priority, setPriority] = useState(task?.priority);
    const [status, setStatus] = useState(task?.status);
    const [error, setError] = useState('');
    const [tasks, setTasks] = useState(task?.dependencies ?? []);
    
    const [requirements, setRequirements] = useState(task?.requirements ?? []);
    const [assignees, setAssignees] = useState(task?.assigned ?? []);

    const allPriorities = Object.values(Priority);
    const allStatus = Object.values(Status);
    const [allTasks, setAllTasks] = useState<Task[]>([]);
    const [allRoles, setAllRoles] = useState<possibleRole[]>([]);
    const [allMembers, setAllMembers] = useState<possibleMember[]>([]);

    useEffect(() => {
        getProjectTasks(project.id).then((tasks) => {
            setAllTasks(tasks.filter(cTask => task?.id !== cTask.id));
        });
        project.teams.forEach((teamId) => {
            getTeam(teamId).then(team => {
                getTeamRoles(teamId).then((roles) => {
                    setAllRoles(state => [...state, ...roles.map(role => {
                        return {
                            id: role.id,
                            label: team.name + ': ' + role.name
                        }
                    })]);
                })
                getTeamMembers(teamId).then((members) => {
                    setAllMembers(state => [...state, ...members.map(member => {
                        return {
                            id: member.id,
                            label: team.name + ': ' + (member.realname ?? member.username)
                        }
                    })]);
                })
            })
        })
    }, [task, project]);


    const handleSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();

        if (validateName(name ?? '') === null &&
            validateText(text ?? '') === null &&
            validateIcon(icon ?? '') === null &&
            validatePriority(priority ?? '') === null
        ) {
            onSubmit?.(name ?? '', text ?? '', icon ?? '', priority ?? Priority.LOW, tasks ?? [], requirements, assignees, status);
        } else {
            setError('Please fill in the mandatory fields.');
        }
    }, [onSubmit, setError, name, text, priority, icon, tasks, assignees, requirements, status]);

    return (
        <form className="task-form" onSubmit={handleSubmit}>
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

            <select defaultValue={priority} onChange={(e) => {
                let currentPriority = Object.values(Priority).find(s => s === e.target.value) ?? undefined;
                setPriority(currentPriority);
            }}>
                <option value={''}>Please choose a priority</option>
                {
                    allPriorities.map((prio) => (
                        <option value={prio} key={prio}>{prio}</option>
                    ))
                }
            </select>

            {
                status && (
                    <select defaultValue={status} onChange={(e) => {
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
                )
            }

            <Picker onEmojiClick={(e, emoji) => setIcon(emoji.originalUnified)} />
            <h2>Dependencies</h2>
            {
                allTasks.length > 0 ? (
                    <CheckboxGroup choices={allTasks ?? []} setChosen={setTasks} chosen={tasks ?? []} />
                ) : <div>No other tasks in this project</div>
            }
            {
                allRoles.length > 0 && (
                    <RequirementsForm setRequirements={setRequirements} roles={allRoles} requirements={requirements} />
                )
            }
            {
                allMembers.length > 0 && (
                    <AssgineesForm members={allMembers} setAssignees={setAssignees} assignees={assignees} />
                )
            }
            <Button type="submit">
                Create Task
            </Button>
        </form>
    )

}
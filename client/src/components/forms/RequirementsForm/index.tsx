
import { useCallback, useEffect, useState } from 'react';

import { TaskRequirement } from 'adapters/task';
import { durationFor, formatDuration } from 'timely';

import { PossibleRole } from 'components/forms/TaskForm';
import Popup from 'components/ui/Popup';
import Button from 'components/ui/Button';
import TimeInput from 'components/ui/TimeInput'

import './requirements-form.scss';

interface Props {
    roles: PossibleRole[],
    requirements: TaskRequirement[],
    onNew: (req: TaskRequirement) => any,
    onDelete: (req: string) => any
}

export default function RequirementsForm({ roles, requirements, onNew, onDelete }: Props) {
    const [possibleRoles, setPossibleRoles] = useState<PossibleRole[]>([]);
    const [addNew, setAddNew] = useState(false);
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedTime, setSelectedTime] = useState(Number.NaN);

    useEffect(() => {
        setPossibleRoles(roles.filter(role => !requirements.find(r => r.role === role.id)));
    }, [roles, requirements, setSelectedRole])

    const addRequirement = useCallback((e) => {
        e.preventDefault();
        if (!Number.isNaN(selectedTime) && selectedRole) {
            onNew({
                role: selectedRole,
                time: selectedTime * 60,
            });
            setAddNew(false);
            setSelectedRole('');
            setSelectedTime(Number.NaN);
        }
    }, [selectedRole, selectedTime, onNew])

    const removeRequirement = useCallback((role: string) => {
        onDelete(role);
    }, [onDelete])

    return (
        <>
            <div className="requirements-field">
                <h2>Requirements</h2>
                {
                    requirements.map((requirement) => (
                        <div className="requirement" key={requirement.role}>
                            <div>{roles.find(role => role.id === requirement.role)?.label}</div>
                            <div>{
                                formatDuration(durationFor(requirement.time, 'minute'), 'second', 2, true)
                            }</div>
                            <div className="delete" onClick={() => removeRequirement(requirement.role)}>
                                <span className="material-icons">
                                    clear
                                </span>
                            </div>
                        </div>
                    ))
                }
                {
                    possibleRoles.length > 0 && (
                        <div className="add-btn requirement" onClick={() => setAddNew(true)}>
                            +
                        </div>
                    )
                }
            </div>
            {
                addNew && (
                    <Popup onClose={() => setAddNew(false)}>
                        <select onChange={(e) => setSelectedRole(e.target.value)}>
                            <option value="">Please select a role</option>
                            {
                                possibleRoles.map((role) => (
                                    <option value={role.id} key={role.id}>{role.label}</option>
                                ))
                            }
                        </select>
                        <TimeInput onChange={value => setSelectedTime(value)} />
                        <Button type="submit" onClick={addRequirement} className="expanded">
                            Create new requirement
                        </Button>
                    </Popup>
                )
            }
        </>
    )
}


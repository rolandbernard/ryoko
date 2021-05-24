import { TaskRequirement } from 'adapters/task';
import './requirements-form.scss';
import { useCallback, useEffect, useState } from 'react';
import { possibleRole } from '../TaskForm';
import Popup from 'components/ui/Popup';
import Button from 'components/ui/Button';

interface Props {
    roles: possibleRole[],
    requirements: TaskRequirement[],
    setRequirements: Function
}


export default function RequirementsForm({ roles, requirements, setRequirements }: Props) {

    const [possibleRoles, setPossibleRoles] = useState<possibleRole[]>([]);
    const [addNew, setAddNew] = useState(false);
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');

    useEffect(() => {
        setPossibleRoles(roles.filter(role => !requirements.find(r => r.role === role.id)));
    }, [roles, requirements, setSelectedRole])


    const addRequirement = useCallback((e) => {
        e.preventDefault();
        if (selectedTime && selectedRole) {
            setRequirements((state: any) => [...state, { role: selectedRole, time: selectedTime }]);
            setAddNew(false);
            setSelectedRole('');
            setSelectedTime('');

        }
    }, [selectedRole, selectedTime, setRequirements])


    const removeRequirement = useCallback((role: string) => {
        setRequirements((state: any) => state.filter((r: any) => r.role !== role));
    }, [setRequirements])

    return (
        <>
            <div className="requirements-field">
                <h2>Requirements</h2>
                {
                    requirements.map((requirement) => (
                        <div className="requirement" key={requirement.role}>
                            <div>{roles.find(role => role.id === requirement.role)?.label}</div>
                            <div>{requirement.time} min</div>
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
                        <div className="time-field">
                            <input type="number" min={1} onChange={(e) => setSelectedTime(e.target.value)} />
                        </div>
                        <Button type="submit" onClick={addRequirement} className="expanded">
                            Create new requirement
                        </Button>
                    </Popup>

                )
            }
        </>
    )
}


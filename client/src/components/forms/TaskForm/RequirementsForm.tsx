import { TaskRequirement } from 'adapters/task';
import { useCallback, useEffect, useState } from 'react';
import { possibleRole } from '.';
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


    const addRequirement = useCallback(() => {
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
                {
                    requirements.map((requirement) => (
                        <div className="requirement" key={requirement.role}>
                            <h2>{roles.find(role => role.id === requirement.role)?.label}</h2>
                            <div>{requirement.time}</div>
                            <div onClick={() => removeRequirement(requirement.role)}>delete</div>
                        </div>
                    ))
                }
                {
                    possibleRoles.length > 0 && (
                        <div className="add-btn" onClick={() => setAddNew(true)}>
                            new
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
                        <input type="number" min={1} onChange={(e) => setSelectedTime(e.target.value)} />
                        <Button type="submit" onClick={addRequirement}>
                            Create new requirement
                        </Button>
                    </Popup>

                )
            }
        </>
    )
}


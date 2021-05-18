import { TaskRequirement } from 'adapters/task';
import { TeamRole } from 'adapters/team';
import { useState } from 'react';
import { possibleRole } from '../TaskForm';


interface Props {
    roles: possibleRole[],
    requirements: TaskRequirement[],
    setRequirements: Function
}


export default function RequirementsChoice({ roles, requirements, setRequirements }: Props) {

    const [possibleRoles, setPossibleRoles] = useState<possibleRole[]>(roles
        .filter(role => !requirements.find(r => r.role === role.id))
    );

    return (
        <div className="requirements-field">
            {
                requirements.map((requirement) => (
                    <div className="requirement" key={requirement.role + '/' + requirement.time}>
                        <select>
                            <option value={requirement.role}>{roles.find(r => r.id === requirement.role)}</option>
                            {
                                possibleRoles.map(role => (
                                    <option value={role.id} key={role.id}>{role.label}</option>
                                ))
                            }
                        </select>
                        <input type="number" value={requirement.time} min={0}
                        />
                    </div>
                ))
            }
            {
                possibleRoles.length > 0 && (
                    <div className="add-btn" onClick={() => setRequirements(
                        (state: any) => {
                            setPossibleRoles(state => {
                                return state.slice(1);
                            })
                            return [...state, {
                                role: possibleRoles[0].id,
                                time: 0
                            }];
                        }
                    )}>
                        new
                    </div>
                )
            }
        </div>
    )
}


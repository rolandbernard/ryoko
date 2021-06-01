
import { useCallback, useEffect, useState } from "react";

import { TaskAssignment } from "adapters/task";

import Popup from 'components/ui/Popup';
import Button from 'components/ui/Button';
import { PossibleMember } from "components/forms/TaskForm";

import './assignees-form.scss';

interface Props {
    assignees: TaskAssignment[];
    setAssignees: Function;
    members: PossibleMember[]
}

export default function AssigneesForm({ assignees, setAssignees, members }: Props) {
    const [possibleMembers, setPossibleMembers] = useState<PossibleMember[]>([]);
    const [addNew, setAddNew] = useState(false);
    const [selectedMember, setSelectedMember] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    useEffect(() => {
        setPossibleMembers(members.filter(member => !assignees.find(r => r.user === member.id)));
    }, [members, assignees, setAssignees])

    const addAssignee = useCallback((e) => {
        e.preventDefault();
        if (selectedTime && selectedMember) {
            setAssignees((state: any) => [...state, { user: selectedMember, time: selectedTime }]);
            setAddNew(false);
            setSelectedMember('');
            setSelectedTime('');

        }
    }, [setAssignees, selectedMember, selectedTime])

    const removeAssignee = useCallback((member: string) => {
        setAssignees((state: any) => state.filter((r: any) => r.user !== member));
    }, [setAssignees])

    return (
        <>
            <div className="assignees-field">
                <h2>Assignees</h2>
                {
                    assignees.map((assignee) => (
                        <div className="assignee" key={assignee.user}>
                            <div className="person">
                                {members.find(member => member.id === assignee.user)?.label}
                            </div>
                            <div className="time">{assignee.time} min</div>
                            <div className="delete" onClick={() => removeAssignee(assignee.user)}>
                                <span className="material-icons">
                                    clear
                                </span>
                            </div>
                        </div>
                    ))
                }
                {
                    possibleMembers.length > 0 && (
                        <div className="add-btn assignee" onClick={() => setAddNew(true)}>
                            +
                        </div>
                    )
                }
            </div>
            {
                addNew && (
                    <Popup onClose={() => setAddNew(false)}>
                        <select onChange={(e) => setSelectedMember(e.target.value)}>
                            <option value="">Please select a user</option>
                            {
                                possibleMembers.map((member) => (
                                    <option value={member.id} key={member.id}>{member.label}</option>
                                ))
                            }
                        </select>
                        <div className="time-field">
                            <input type="number" min={1} onChange={(e) => setSelectedTime(e.target.value)} />
                        </div>
                        <Button type="submit" onClick={addAssignee} className="Expanded">
                            Add the assignee
                        </Button>
                    </Popup>
                )
            }
        </>
    )
}

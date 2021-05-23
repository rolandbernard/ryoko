import './assignees-form.scss';
import { TaskAssignment } from "adapters/task";
import { useCallback, useEffect, useState } from "react";
import { possibleMember } from "../TaskForm";
import Popup from 'components/ui/Popup';
import Button from 'components/ui/Button';

interface Props {
    assignees: TaskAssignment[];
    setAssignees: Function;
    members: possibleMember[]
}


export default function AssigneesForm({ assignees, setAssignees, members }: Props) {

    const [possibleMembers, setPossibleMembers] = useState<possibleMember[]>([]);
    const [addNew, setAddNew] = useState(false);
    const [selectedMember, setSelectedMember] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');

    useEffect(() => {
        setPossibleMembers(members.filter(member => !assignees.find(r => r.user === member.id)));
    }, [members, assignees, setAssignees])


    const addAssignee = useCallback(() => {
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
                            <div className="time">{assignee.time}</div>
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
import { TaskAssignment } from "adapters/task";
import { useCallback, useEffect, useState } from "react";
import { possibleMember } from ".";
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
            <div className="requirements-field">
                {
                    assignees.map((assignee) => (
                        <div className="requirement" key={assignee.user}>
                            <h2>{members.find(member => member.id === assignee.user)?.label}</h2>
                            <div>{assignee.time}</div>
                            <div onClick={() => removeAssignee(assignee.user)}>delete</div>
                        </div>
                    ))
                }
                {
                    possibleMembers.length > 0 && (
                        <div className="add-btn" onClick={() => setAddNew(true)}>
                            new
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
                        <input type="number" min={1} onChange={(e) => setSelectedTime(e.target.value)} />
                        <Button type="submit" onClick={addAssignee}>
                            Add the assignee
                        </Button>
                    </Popup>

                )
            }
        </>
    )

}
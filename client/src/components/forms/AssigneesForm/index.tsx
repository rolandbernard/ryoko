
import { useCallback, useEffect, useState } from "react";

import { TaskAssignment } from "adapters/task";
import { durationFor, formatDuration } from "timely";

import Popup from 'components/ui/Popup';
import Button from 'components/ui/Button';
import TimeInput from "components/ui/TimeInput";
import { PossibleMember } from "components/forms/TaskForm";

import './assignees-form.scss';
import '../form.scss';

interface Props {
    assignees: TaskAssignment[];
    members: PossibleMember[]
    onNew: (req: TaskAssignment) => any,
    onDelete: (req: string) => any
}

/**
 * This component implements the form for inputing assigned users in the task edit and create pages.
 * It shows all assignees and allows adding and removing them, using the callbacks in the properties
 * of the component.
 */
export default function AssigneesForm({ assignees, members, onNew, onDelete }: Props) {
    const [possibleMembers, setPossibleMembers] = useState<PossibleMember[]>([]);
    const [addNew, setAddNew] = useState(false);
    const [selectedMember, setSelectedMember] = useState('');
    const [selectedTime, setSelectedTime] = useState(Number.NaN);

    useEffect(() => {
        setPossibleMembers(members.filter(member => !assignees.find(r => r.user === member.id)));
    }, [members, assignees])

    const addAssignee = useCallback((e) => {
        e.preventDefault();
        if (!Number.isNaN(selectedTime) && selectedMember) {
            onNew({
                user: selectedMember,
                time: selectedTime * 60,
                finished: false,
            });
            setAddNew(false);
            setSelectedMember('');
            setSelectedTime(Number.NaN);

        }
    }, [selectedMember, selectedTime, onNew])

    const removeAssignee = useCallback((member: string) => {
        onDelete(member);
    }, [onDelete])

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
                            <div className="time">{
                                formatDuration(durationFor(assignee.time, 'minute'), 'second', 2, true)
                                + (assignee.finished ? ' (finished)' : '')
                            }</div>
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
                        <form>
                            <select defaultValue="" onChange={(e) => setSelectedMember(e.target.value)}>
                                <option value="" disabled hidden>Please select a user</option>
                                {
                                    possibleMembers.map((member) => (
                                        <option value={member.id} key={member.id}>{member.label}</option>
                                    ))
                                }
                            </select>
                            <TimeInput onChange={value => setSelectedTime(value)} />
                            <Button type="submit" onClick={addAssignee} className="expanded">
                                Add the assignee
                            </Button>
                        </form>
                    </Popup>
                )
            }
        </>
    )
}

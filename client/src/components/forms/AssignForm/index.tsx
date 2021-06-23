
import { useCallback, useState } from "react";

import Popup from 'components/ui/Popup';
import Button from 'components/ui/Button';
import Checkbox from "components/ui/Checkbox";
import TimeInput from "components/ui/TimeInput";

import './assign-form.scss';
import '../form.scss';

interface Props {
    onAssign: (duration: number, finished: boolean) => any;
    initialTime?: number;
    initialFinished?: boolean;
}

export default function AssignForm({ onAssign, initialTime, initialFinished }: Props) {
    const [popup, setPopup] = useState(false);
    const [selectedTime, setSelectedTime] = useState<number | undefined>(initialTime);
    const [finished, setFinished] = useState(initialFinished ?? false);

    const addAssignee = useCallback((e) => {
        e.preventDefault();
        setPopup(false);
        if (selectedTime && !Number.isNaN(selectedTime)) {
            onAssign(selectedTime, finished);
        } else {
            onAssign(0, false);
        }
    }, [onAssign, selectedTime, finished])

    return <>
        <Button className="expanded dark" onClick={() => setPopup(true)}>
            {initialTime ? 'Change assignment' : 'Assign yourself'}
        </Button>
        {
            popup && (
                <Popup onClose={() => setPopup(false)}>
                    <form onSubmit={addAssignee}>
                        <TimeInput initialTime={initialTime && (initialTime / 60)} onChange={value => setSelectedTime(value * 60)} />
                        <Checkbox label="Finished" checked={finished} onChange={setFinished} />
                        <div className="assign-yourself">
                            <Button type="submit" className="expanded dark">
                                {initialTime ? 'Change assignment' : 'Assign yourself'}
                            </Button>
                        </div>
                    </form>
                </Popup>
            )
        }
    </>;
}

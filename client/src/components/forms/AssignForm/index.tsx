
import { useCallback, useState } from "react";

import Popup from 'components/ui/Popup';
import Button from 'components/ui/Button';
import TimeInput from "components/ui/TimeInput";

import '../form.scss';

interface Props {
    onAssign: (duration: number) => any;
    initialTime?: number;
}

export default function AssignForm({ onAssign, initialTime }: Props) {
    const [popup, setPopup] = useState(false);
    const [selectedTime, setSelectedTime] = useState<number | undefined>(initialTime);

    const addAssignee = useCallback((e) => {
        e.preventDefault();
        setPopup(false);
        if (selectedTime && !Number.isNaN(selectedTime)) {
            onAssign(selectedTime * 60);
        } else {
            onAssign(0);
        }
    }, [onAssign, selectedTime])

    return <>
        <Button className="expanded dark" onClick={() => setPopup(true)}>
            {initialTime ? 'Change assignment' : 'Assign yourself'}
        </Button>
        {
            popup && (
                <Popup onClose={() => setPopup(false)}>
                    <form onSubmit={addAssignee}>
                        <TimeInput initialTime={initialTime && (initialTime / 60)} onChange={value => setSelectedTime(value)} />
                        <div>
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

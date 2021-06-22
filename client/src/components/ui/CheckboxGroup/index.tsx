
import Checkbox from 'components/ui/Checkbox';

import './checkbox-group.scss';

interface Props {
    choices: {
        id: string;
        name: string;
    }[],
    chosen: string[],
    setChosen: Function
}

export default function CheckboxGroup({ choices, chosen, setChosen }: Props) {
    return (
        <div className="checkbox-group">
            {
                choices.map(choice => (
                    <Checkbox
                        label={choice.name}
                        checked={chosen.includes(choice.id)}
                        onChange={value => {
                            if (value) {
                                if (!chosen.includes(choice.id)) {
                                    setChosen([...chosen, choice.id]);
                                }
                            } else {
                                setChosen(chosen.filter(c => c !== choice.id));
                            }
                        }}
                    />
                ))
            }
        </div>
    )
}


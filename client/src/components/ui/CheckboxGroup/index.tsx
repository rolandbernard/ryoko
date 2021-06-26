
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

/**
 * This component allows the user to select a set of items from a list of choices. The input is done
 * using checkboxes, each one corresponding to a different choice. The setChosen called is called if
 * the selection changes, and the chosen property should be set accordingly by the parent component.
 */
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


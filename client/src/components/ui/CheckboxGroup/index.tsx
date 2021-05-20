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
                choices.map((choice) => (
                    <div className="team-item" key={choice.id}>
                        <input type="checkbox" id={choice.id}
                            checked={chosen.indexOf(choice.id) >= 0}
                            onChange={(e) => {
                                if (chosen.find(id => choice.id === id)) {
                                    setChosen((state: any) => state.filter((id: any) => id !== choice.id));
                                } else {
                                    setChosen((state: any) => [...state, choice.id]);
                                }
                            }} />
                        <label htmlFor={choice.id}>{choice.name}</label>
                    </div>

                ))
            }
        </div>
    )
}
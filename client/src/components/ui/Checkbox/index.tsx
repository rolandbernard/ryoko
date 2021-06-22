
import './checkbox.scss';

interface Props {
    label: string;
    checked: boolean;
    onChange: (value: boolean) => any;
}

export default function Checkbox({ label, checked, onChange }: Props) {
    return (
        <label htmlFor={label} className="checkbox-item" key={label}>
            <input type="checkbox" id={label}
                checked={checked}
                onChange={() => onChange(!checked)} />
            <span className="checkbox">
            </span>
            {label}
        </label>
    )
}


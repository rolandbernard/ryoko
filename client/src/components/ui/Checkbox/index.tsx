
import './checkbox.scss';

interface Props {
    label: string;
    checked: boolean;
    onChange: (value: boolean) => any;
}

/**
 * This component implements a simple checkbox with a label. The checkbox is checked if the checked
 * property is true. If the onChange callback is called, the parent component should handle the
 * change of the checked property.
 */
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


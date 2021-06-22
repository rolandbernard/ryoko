
import './tag.scss';

interface Props {
    label: string;
    icon?: string;
    color?: string;
}

export default function Tag({ label, icon, color }: Props) {
    return (
        <span className={'tag ' + (color ? 'bg-gradient-horizontal-' + color : '')}>
            {icon && (
                <i className="icon material-icons">
                    {icon}
                </i>
            )}
            {label}
        </span>
    );
}


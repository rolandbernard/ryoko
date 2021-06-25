
import './tag.scss';

interface Props {
    label: string;
    icon?: string;
    color?: string;
}

/**
 * This is a small component that display the label property using the given color and optionally
 * using the given icon. The component styles this information in a certain way. This component is
 * used for the status tags of tasks and projects.
 */
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


import './tag.scss';

interface Props {
    label: string;
    icon?: string;
}

export default function Tag({ label, icon }: Props) {
    return (
        <span className="tag">
            {icon && (
                <i className="icon material-icons">
                    {icon}
                </i>
            )}
            {label}
        </span>

    );
}
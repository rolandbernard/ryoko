
import './callout.scss';

interface Props {
    message: string;
}

/**
 * This component implements a simple callout field. This component is mainly used for its styling.
 * The message property will be displayed inside the callout container.
 */
export default function Callout({ message }: Props) {
    return (
        <div className="callout-container">
            {message}
        </div>
    );
}


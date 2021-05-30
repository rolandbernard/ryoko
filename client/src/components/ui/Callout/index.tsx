
import './callout.scss';

interface Props {
    message: string;
}

export default function Callout({ message }: Props) {
    return (
        <div className="callout-container">
            {message}
        </div>
    );
}


import './completion.scss';
import CircularProgress from 'components/graphs/CircularProgress';

export interface CompletionProps {
    label: string;
    percent: number;
    color: string;
}

export default function Completion({ label, percent, color }: CompletionProps) {

    return (
        <div className="completion">
            <div className="inner">
                <CircularProgress percent={Math.floor(percent)} color={color} />
                <div className="label">{label}</div>
            </div>
        </div>
    )
}
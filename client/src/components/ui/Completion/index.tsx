import './completion.scss';
import CircularProgress from 'components/graphs/CircularProgress';

export interface CompletionProps {
    label: string;
    percent: number;
}

export default function Completion({ label, percent }: CompletionProps) {

    return (
        <div className="completion">
            <div className="inner">
                <CircularProgress percent={percent} />
                <div className="label">{label}</div>
            </div>
        </div>
    )
}
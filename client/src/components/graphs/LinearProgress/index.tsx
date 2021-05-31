
import './linear-progress.scss';

interface Props {
    percent: number
}

export default function LinearProgress({ percent }: Props) {
    return (
        <div className="linear-progress">
            <div className="progress" style={{width: percent + '%'}}></div>
        </div>
    );
}


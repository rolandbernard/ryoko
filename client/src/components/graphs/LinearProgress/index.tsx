
import './linear-progress.scss';

interface Props {
    percent: number;
    color: string;
}

export default function LinearProgress({ percent, color }: Props) {
    return (
        <div className="linear-progress">
            <div
                className={'progress' + (color ? ' bg-gradient-horizontal-' + color : '')}
                style={{ width: percent + '%' }}
            ></div>
        </div>
    );
}


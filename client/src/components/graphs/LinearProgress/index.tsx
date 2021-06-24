
import './linear-progress.scss';

interface Props {
    percent: number;
    color: string;
}

/**
 * This component implements a linear progress bar. The progress bar will be shown in the color
 * given in the color property. This value must be one of the theme colors.
 */
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


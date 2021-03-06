
import './detail-box.scss';

export interface DetailProps {
    number?: number,
    icon: string,
    title: string,
    label?: string,
}

/**
 * This is a detail bod for use in the detail grid. The box will display information, the given icon
 * and the given title. The information can either be a number or a label.
 */
export default function DetailBox({ number, icon, title, label }: DetailProps) {
    return (
        <div className="detail-box">
            <div className="content">
                <div className="icon-container">
                    <span className="icon material-icons">
                        {icon}
                    </span>
                </div>
                <div className="text">
                    {!label && number !== undefined && <div className="number">{number}</div>}
                    <div className={'title' + (label ? ' bold' : '')}>{title}</div>
                    {label && <div className="label">{label}</div>}
                </div>
            </div>
        </div>
    );
}


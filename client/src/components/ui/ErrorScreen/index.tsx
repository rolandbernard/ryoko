
import './error-screen.scss';

interface Props {
    onReload?: () => any;
    onGoHome?: () => any;
}

export default function ErrorScreen({ onReload, onGoHome }: Props) {
    return (
        <div className="error-screen">
            <p>Failed to load data.</p>
            <div>
                { onReload &&
                    <button onClick={onReload}>Try to reload</button>
                }
                { onReload && onGoHome && (<span> or </span>) }
                { onGoHome &&
                    <button onClick={onGoHome}>Go to home</button>
                }
            </div>
        </div>
    )
}


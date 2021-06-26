
import './error-screen.scss';

interface Props {
    onReload?: () => any;
    onGoHome?: () => any;
}

/**
 * This component shows a simple error message and gives the user the option to reload or go to the
 * landing page. This component should be used more often in places where data can fail to load.
 */
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


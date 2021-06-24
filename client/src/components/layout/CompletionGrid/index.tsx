
import Completion, { CompletionProps } from 'components/ui/Completion';

import './completion-grid.scss';

interface Props {
    items: CompletionProps[];
}

/**
 * This component implements a grid for displaying completion information. This consists of multiple
 * Completion components the parameters of which are given in the items property.
 */
export default function CompletionGrid({ items }: Props) {
    return (
        <div className="completion-grid">
            {items.map(item => (
                <div key={item.label} className="box-container">
                    <Completion {...item} />
                </div>
            ))}
        </div>
    )
}


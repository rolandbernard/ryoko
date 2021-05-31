
import Completion, { CompletionProps } from 'components/ui/Completion';

import './completion-grid.scss';

interface Props {
    items: CompletionProps[];
}

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


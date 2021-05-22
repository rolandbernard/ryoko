import './completion-grid.scss';
import Completion, { CompletionProps } from 'components/ui/Completion';

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
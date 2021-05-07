import './completion-grid.scss';
import Completion, { CompletionProps } from 'components/ui/Completion';

interface Props {
    items: CompletionProps[];
}

export default function CompletionGrid({ items }: Props) {
    return (
        <div className="completion-grid">
            {items.map(item => (
                <div className="box-container">
                    <Completion key={item.label} {...item} />
                </div>
            ))}
        </div>
    )
}
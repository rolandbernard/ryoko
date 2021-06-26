
import { useEffect, useState } from 'react';

import Tag from 'components/ui/Tag';
import './tag.scss';

interface Props<Tag> {
    label: Tag;
    icon?: string;
    color?: string;
    possible: Tag[];
    onChange: (value: Tag) => any;
}

/**
 * This component shows a simple tag, and allows the user to edit it by clicking the tag and
 * selecting from the opening dropdown selection. All options for the tag should be given in the
 * possible property and the onChange function should change the displayed values.
 */
export default function EditableTag<Tag extends string>({ label, icon, color, possible, onChange }: Props<Tag>) {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (open) {
            const onClick = () => setOpen(false);
            document.addEventListener('click', onClick);
            return () => {
                document.removeEventListener('click', onClick);
            }
        }
    }, [open]);

    return (
        <span className={'tag-wrapper' + (open ? ' open' : '')} onClick={() => setOpen(!open)}>
            <Tag label={label} icon={icon} color={color} />
            <div className="tag-dropdown">
                {
                    possible.filter(item => item !== label).map(item => (
                        <span key={item} className="tag-item" onClick={() => onChange(item)}>
                            {item}
                        </span>
                    ))
                }
            </div>
        </span>
    );
}


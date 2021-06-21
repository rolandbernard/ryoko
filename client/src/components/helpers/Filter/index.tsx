
import Tag from 'components/ui/Tag';

import './filter.scss';

interface Filter<Tag> {
    term: string;
    tags: Tag[];
}

interface Props<Tag> {
    setFilter: (filter: Filter<Tag>) => any;
    filter: Filter<Tag>;
    tags: {
        label: Tag;
        color?: string;
    }[];
}

export default function FilterComponent<Tag extends string>({ setFilter, tags, filter }: Props<Tag>) {
    return (
        <div className="filter-container">
            <div className="search-container">
                <i className="material-icons icon">search</i>
                <label htmlFor="search">Search</label>
                <input
                    type="text"
                    id="search"
                    onChange={event => setFilter({ ...filter, term: event.target.value })}
                    autoComplete="off"
                />
            </div>
            <div className="status-filter">
                <h3>Filter</h3>
                <div className="tags">
                    {
                        tags.map((tag) => (
                            <div className={'tag-item' + (filter.tags.includes(tag.label) ? ' active' : '')} key={tag.label}
                                onClick={() => {
                                    if (filter.tags.indexOf(tag.label) >= 0) {
                                        
                                        setFilter({
                                            ...filter,
                                            tags: filter.tags.filter((t: any) => t !== tag.label)
                                        })
                                    } else {
                                        setFilter({
                                            ...filter,
                                            tags: [...filter.tags, tag.label]
                                        })
                                        
                                    }
                                }}>
                                <Tag label={tag.label} color={tag.color} />
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}


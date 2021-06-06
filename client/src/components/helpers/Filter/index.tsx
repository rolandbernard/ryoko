
import Tag from 'components/ui/Tag';

import './filter.scss';

interface Props {
    setFilter: Function;
    filter: {
        term: string;
        tags: string[];
    };
    tags: {
        label: string;
        color?: string;
    }[];
}

export default function Filter({ setFilter, tags, filter }: Props) {
    return (
        <div className="filter-container">
            <div className="search-container">
                <i className="material-icons icon">search</i>
                <label htmlFor="search">Search</label>
                <input type="text" id="search" onChange={event => setFilter((prev: any) => { return { ...prev, term: event.target.value } })} />
            </div>
            <div className="status-filter">
                <h3>Filter</h3>
                <div className="tags">
                    {
                        tags.map((tag) => (
                            <div className={'tag-item' + (filter.tags.indexOf(tag.label) >= 0 ? ' active' : '')} key={tag.label}
                                onClick={() => {
                                    if (filter.tags.indexOf(tag.label) >= 0) {
                                        
                                        setFilter((prev: any) => {
                                            return {
                                                ...prev,
                                                tags: prev.tags.filter((t: any) => t !== tag.label)
                                            }
                                        })
                                    } else {
                                        setFilter((prev: any) => {
                                            return {
                                                ...prev,
                                                tags: [...prev.tags, tag.label]
                                            }
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


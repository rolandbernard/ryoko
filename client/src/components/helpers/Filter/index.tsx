import './filter.scss';
import Tag from 'components/ui/Tag';

interface Props {
    setFilter: Function;
}

export default function Filter({ setFilter }: Props) {
    return (
        <div className="filter-container">
            <div className="search-container">
                <i className="material-icons icon">search</i>
                <input type="text" placeholder="Search..." onChange={event => setFilter((prev: any) => { return { ...prev, term: event.target.value } })} />
            </div>
            <div className="status-filter">
                <h3>Filter</h3>
                <div className="tags">
                    <Tag label="Done" />
                    <Tag label="Done" />
                </div>
            </div>
        </div>
    )
}
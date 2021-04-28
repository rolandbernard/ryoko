import Navigation from 'components/ui/Navigation';
import './sidebar.scss';

interface Props {
    mobileShown: boolean;
}

export default function Sidebar({mobileShown}: Props) {
    return (
        <aside className={'site-aside' + (mobileShown ? ' shown' : '')}>
            <div className="profile-section">
                
            </div>
            <Navigation />
            
        </aside>
    );
}
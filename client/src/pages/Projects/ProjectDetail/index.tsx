import './project-detail.scss';
import Tag from 'components/ui/Tag';
import Tabs from 'components/navigation/Tabs';
import { useParams } from 'react-router';
import ProjectDetails from './ProjectDetails';
import ProjectTasks from './ProjectTasks';

export interface Params {
    uuid: string;
}

export default function ProjectDetail() {
    const { uuid } = useParams<Params>();
    const tabs = [
        {
            label: 'Details',
            path: '/projects/' + uuid,
            routePath: '/projects/:uuid',
            component: ProjectDetails
        },
        {
            label: 'Tasks',
            path: '/projects/' + uuid + '/tasks',
            routePath: '/projects/:uuid/tasks',
            component: ProjectTasks
        }
    ];
    return (
        <div className="project-detail-page">
            <div className="content-container">
                <Tag label="Done" />
                <h1>Shopping list</h1>
                <div className="description-container">
                    <p>
                        A basic shopping list app, much like Bring!
                    </p>
                </div>
                <Tabs tabs={tabs} />

            </div>
        </div>
    )
}
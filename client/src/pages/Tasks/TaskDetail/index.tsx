import './task-detail.scss';
import Tag from 'components/ui/Tag';
import DetailGrid from 'components/layout/DetailGrid';
import ButtonLink from 'components/navigation/ButtonLink';
import Tabs from 'components/navigation/Tabs';
import { useParams } from 'react-router';
import TaskAssignees from './TaskAssignees';
import TaskComments from './TaskComments';

export interface Params {
    uuid: string;
}

export default function TaskDetail() {
    const { uuid } = useParams<Params>();

    const tabs = [
        {
            label: 'Assignees',
            path: '/tasks/' + uuid,
            routePath: '/tasks/:uuid',
            component: TaskAssignees
        },
        {
            label: 'Comments',
            path: '/tasks/' + uuid + '/comments',
            routePath: '/tasks/:uuid/comments',
            component: TaskComments
        }
    ];

    return (
        <div className="tasks-detail-page">
            <div className="content-container">
                <Tag label="Done" />
                <h1>Creating API Routes</h1>
                <div className="description-container">
                    <p>
                        Create the API routes and implement them into the FrontEnd, by adding them into the controls.
                    </p>
                </div>
                <h2>
                    Details
                </h2>
                <DetailGrid details={[
                    { icon: 'folder', title: 'Project', label: 'Shopping List' },
                    { icon: 'group', title: 'Team', label: 'Ryoko' }]} />

                <ButtonLink href={'/tasks/' + uuid + '/start'} className="expanded">
                    Start
                </ButtonLink>
                <ButtonLink href={'/tasks/' + uuid + '/edit'} className="dark expanded">
                    Edit
                </ButtonLink>
                <Tabs tabs={tabs} />
            </div>
        </div>
    );
}
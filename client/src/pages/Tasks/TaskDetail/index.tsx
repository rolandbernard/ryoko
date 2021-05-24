import './task-detail.scss';
import Tag from 'components/ui/Tag';
import DetailGrid from 'components/layout/DetailGrid';
import ButtonLink from 'components/navigation/ButtonLink';
import Tabs from 'components/navigation/Tabs';
import { useHistory, useParams } from 'react-router';
import TaskAssignees from './TaskAssignees';
import TaskComments from './TaskComments';
import { useEffect, useState } from 'react';
import { getTask, getTaskAssignees, StatusColors, Task, TaskAssignment } from 'adapters/task';
import { getProject, Project } from 'adapters/project';
import { getTeam } from 'adapters/team';
import LoadingScreen from 'components/ui/LoadingScreen';
import { TeamMemberProps } from 'components/ui/TeamMember';
import { getCurrentUser } from 'adapters/user';

export interface Params {
    taskId: string;
}

export default function TaskDetail() {
    const { taskId } = useParams<Params>();
    const history = useHistory();
    const [task, setTask] = useState<Task>();
    const [project, setProject] = useState<Project>();
    const [teamNames, setTeamNames] = useState<string[]>([]);
    const [assignees, setAssignees] = useState<TeamMemberProps[]>([]);
    const [assignment, setAssignment] = useState<TaskAssignment>();

    useEffect(() => {
        getTask(taskId).then((task) => {

            setTask(task);
            getProject(task.project).then((project) => {
                setProject(project);
                project.teams.forEach((teamId) =>
                    getTeam(teamId).then((team) => {
                        setTeamNames(state => [...state, team.name])
                    }
                    ));
            });
            getTaskAssignees(taskId).then(assignees =>
                setAssignees(assignees.map(assignee => ({
                    user: assignee,
                    info: assignee.time.toString() + ' min'
                }
                ))))
            getCurrentUser().then((user) => setAssignment(task.assigned.find(a => a.user === user.id)))

        }).catch(() => history.goBack());
    }, [taskId, history]);

    if (task) {
        return (
            <div className={'tasks-detail-page theme-' + StatusColors.get(task.status)}>
                <div className="content-container">
                    <Tag label={task.status} color={StatusColors.get(task.status)} />
                    <h1>{task.name}</h1>
                    <div className="description-container">
                        <p>
                            {task.text}
                        </p>
                    </div>
                    <h2>
                        Details
                    </h2>

                    <DetailGrid details={[
                        { icon: 'folder', title: 'Project', label: project?.name ?? 'Loading...' },
                        { icon: 'group', title: 'Teams', label: teamNames.join(', ') }]} />
                    {
                        assignment && !assignment.finished && (
                            <ButtonLink href={'/tasks/' + taskId + '/start'} className="expanded">
                                Start working
                            </ButtonLink>
                        )
                    }
                    <ButtonLink href={'/tasks/' + taskId + '/edit'} className="dark expanded">
                        Edit
                    </ButtonLink>
                    <Tabs tabs={[
                        {
                            label: 'Assignees',
                            route: '/tasks/' + taskId,
                            component: <TaskAssignees taskId={taskId} assignees={assignees} />
                        },
                        {
                            label: 'Comments',
                            route: '/tasks/' + taskId + '/comments',
                            component: <TaskComments taskId={taskId} />
                        }
                    ]} />
                </div>
            </div>
        );

    } else {
        return <LoadingScreen />;
    }
}
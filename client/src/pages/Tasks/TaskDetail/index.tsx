
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';

import { getTeam } from 'adapters/team';
import { StatusColors } from 'adapters/common';
import { getCurrentUser } from 'adapters/user';
import { getProject, Project } from 'adapters/project';
import { getTask, getTaskAssignees, Task, TaskAssignment } from 'adapters/task';

import Tag from 'components/ui/Tag';
import Tabs from 'components/navigation/Tabs';
import DetailGrid from 'components/layout/DetailGrid';
import LoadingScreen from 'components/ui/LoadingScreen';
import ButtonLink from 'components/navigation/ButtonLink';
import { TeamMemberProps } from 'components/ui/TeamMember';

import TaskAssignees from './TaskAssignees';
import TaskComments from './TaskComments';

import './task-detail.scss';

export interface Params {
    taskId: string;
}

export default function TaskDetail() {
    const [task, setTask] = useState<Task>();
    const [project, setProject] = useState<Project>();
    const [teamNames, setTeamNames] = useState<string[]>([]);
    const [assignees, setAssignees] = useState<TeamMemberProps[]>([]);
    const [assignment, setAssignment] = useState<TaskAssignment>();
    const history = useHistory();

    const { taskId } = useParams<Params>();

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
                })))
            );
            getCurrentUser().then((user) =>
                setAssignment(task.assigned.find(a => a.user === user.id))
            );
        }).catch(() => history.goBack());
    }, [taskId, history]);

    return (
        task
            ? (
                <div className={'tasks-detail-page theme-' + StatusColors.get(task.status)}>
                    <span className="material-icons back-btn" onClick={history.goBack} >
                        arrow_back
                    </span>
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
                        <DetailGrid
                            details={[
                                { icon: 'folder', title: 'Project', label: project?.name ?? 'Loading...' },
                                { icon: 'group', title: 'Teams', label: teamNames.join(', ') }
                            ]}
                        />
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
                        <Tabs
                            tabs={[
                                {
                                    label: 'Assignees',
                                    route: '/tasks/' + taskId,
                                    component: <TaskAssignees assignees={assignees} />
                                },
                                {
                                    label: 'Comments',
                                    route: '/tasks/' + taskId + '/comments',
                                    component: <TaskComments taskId={taskId} />
                                }
                            ]}
                        />
                    </div>
                </div>
            )
            : <LoadingScreen />
    );
}


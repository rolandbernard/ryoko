
import { Link } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';

import { formatRelativeTime } from 'timely';
import { getTeam } from 'adapters/team';
import { AssignedUser } from 'adapters/user';
import { StatusColors, Status } from 'adapters/common';
import { getLoggedInUser } from 'adapters/auth';
import { getProject, Project } from 'adapters/project';
import { getTask, getTaskAssignees, Task, updateTask } from 'adapters/task';

import LongText from 'components/ui/LongText';
import Tabs from 'components/navigation/Tabs';
import DetailGrid from 'components/layout/DetailGrid';
import LoadingScreen from 'components/ui/LoadingScreen';
import ButtonLink from 'components/navigation/ButtonLink';
import AssignForm from 'components/forms/AssignForm';
import EditableTag from 'components/ui/EditableTag';

import TaskAssignees from './TaskAssignees';
import TaskComments from './TaskComments';

import './task-detail.scss';

export interface Params {
    taskId: string;
}

/**
 * This page includes information on a task. It should show the tasks assignees and comments.
 */
export default function TaskDetail() {
    const [task, setTask] = useState<Task>();
    const [project, setProject] = useState<Project>();
    const [teamNames, setTeamNames] = useState<string[]>([]);
    const [assignees, setAssignees] = useState<AssignedUser[]>([]);
    const history = useHistory();

    const { taskId } = useParams<Params>();
    const userId = getLoggedInUser();
    const assignment = task?.assigned.find(a => a.user === userId);

    useEffect(() => {
        getTask(taskId).then((task) => {
            setTask(task);
            getProject(task.project).then(async (project) => {
                setProject(project);
                setTeamNames(
                    (await Promise.all(project.teams.map(getTeam)))
                        .map(team => team.name)
                );
            });
        }).catch(() => { });
        getTaskAssignees(taskId).then(setAssignees);
    }, [taskId, userId, history]);

    const onAssign = useCallback((time: number, finished: boolean) => {
        const reloadData = () => {
            getTask(taskId).then(setTask);
            getTaskAssignees(taskId).then(setAssignees);
        };
        if (time > 0) {
            updateTask(taskId, {
                remove_assigned: [userId],
                add_assigned: [{
                    user: userId,
                    time: time,
                    finished: finished,
                }],
            }).then(reloadData);
        } else {
            updateTask(taskId, { remove_assigned: [userId] })
                .then(reloadData);
        }
    }, [taskId, userId]);

    const onStatusChange = useCallback((status: Status) => {
        if (task) {
            updateTask(task.id, {
                status: status,
            }).then(() => {
                setTask({
                    ...task,
                    status: status,
                    edited: new Date(),
                });
            });
        }
    }, [task]);

    if (task) {
        return (
            <div className={'tasks-detail-page theme-' + task.color}>
                <Link className="material-icons back-btn" to={sessionStorage.getItem('task-return-location') ?? '/tasks'} >
                    arrow_back
                </Link>
                <div className="content-container">
                    <EditableTag
                        label={task.status}
                        color={StatusColors.get(task.status)}
                        possible={Object.values(Status)}
                        onChange={onStatusChange}
                    />
                    <h1>{task.name}</h1>
                    <div className="description-container">
                        <LongText text={task.text} />
                    </div>
                    <h2>
                        Details
                    </h2>
                    <DetailGrid
                        details={[
                            { icon: 'folder', title: 'Project', label: project?.name ?? 'Loading...' },
                            { icon: 'group', title: 'Teams', label: teamNames.join(', ') },
                            { icon: 'priority_high', title: 'Priority', label: task?.priority },
                            {
                                icon: 'history',
                                title: 'Edited',
                                label: formatRelativeTime(task?.edited)
                            }
                        ]}
                    />
                    {
                        assignment && !assignment.finished && (
                            <ButtonLink href={'/tasks/' + taskId + '/start'} className="expanded">
                                Start working
                            </ButtonLink>
                        )
                    }
                    <div className="button-container">
                        <AssignForm onAssign={onAssign} initialTime={assignment?.time} initialFinished={assignment?.finished} />
                        <ButtonLink href={'/tasks/' + taskId + '/edit'} className="dark expanded">
                            Edit
                        </ButtonLink>
                    </div>
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
    } else {
        return <LoadingScreen />
    }
}


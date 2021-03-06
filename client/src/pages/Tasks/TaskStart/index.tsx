
import { Link } from 'react-router-dom';
import { useHistory, useParams } from 'react-router';
import { useCallback, useEffect, useState } from 'react';

import { getTeam } from 'adapters/team';
import { StatusColors, } from 'adapters/common';
import { getLoggedInUser } from 'adapters/auth';
import { finishWork, startWork } from 'adapters/work';
import { getProject, Project } from 'adapters/project';
import { durationBetween, formatRelativeTime, formatSimpleDuration } from 'timely';
import { getTask, getTaskWork, Task, TaskAssignment, updateTask } from 'adapters/task';

import Tag from 'components/ui/Tag';
import Button from 'components/ui/Button';
import LongText from 'components/ui/LongText';
import DetailGrid from 'components/layout/DetailGrid';
import LoadingScreen from 'components/ui/LoadingScreen';
import CircularProgress from 'components/graphs/CircularProgress';

import './task-start.scss';

export interface Params {
    taskId: string;
}

function handleTimer(state: number) {
    return state - 1000;
}

/**
 * This page should allow the user to start or stop working on a task. It should also display some
 * details for the task.
 */
export default function TaskStart() {
    const [task, setTask] = useState<Task>();
    const [time, setTime] = useState(0);
    const [initialTime, setInitialTime] = useState(0);
    const [assignee, setAssignee] = useState<TaskAssignment>();
    const [project, setProject] = useState<Project>();
    const [teamNames, setTeamNames] = useState<string[]>([]);
    const [paused, setPaused] = useState(true);
    const [timer, setTimer] = useState<NodeJS.Timeout>();
    const history = useHistory();

    const { taskId } = useParams<Params>();
    const userId = getLoggedInUser();

    useEffect(() => {
        getTask(taskId).then((task) => {
            setTask(task);
            const assignee = task.assigned.find(a => a.user = userId);
            setAssignee(assignee);
            if (assignee) {
                const minutes = assignee.time * 60 * 1000;
                getTaskWork(task.id).then(work => {
                    const workedItems = work.filter(w => w.user = userId);
                    let lastSessionFinished = true;
                    let workedTime = 0;
                    workedItems.forEach(w => {
                        if (!w.finished) {
                            lastSessionFinished = false;
                        }
                        workedTime += durationBetween(w.started, w.finished ?? new Date())
                    });
                    setTime(minutes - workedTime);
                    if (!lastSessionFinished) {
                        setPaused(false);
                        setTimer(setInterval(() => {
                            setTime(handleTimer);
                        }, 1000))
                    }
                })
                setInitialTime(minutes);
            }
            getProject(task.project).then((project) => {
                setProject(project);
                project.teams.forEach((teamId) =>
                    getTeam(teamId).then((team) => {
                        setTeamNames(state => [...state, team.name])
                    }
                ));
            });
        }).catch(() => history.goBack());
    }, [taskId, userId, history]);

    const handleTaskStart = useCallback(() => {
        if (task) {
            if (paused) {
                setPaused(false)
                startWork(task.id);
                setTimer(setInterval(() => {
                    setTime(handleTimer);
                }, 1000))
            } else {
                setPaused(true);
                if (timer) {
                    finishWork();
                    clearInterval(timer);
                }
            }
        }
    }, [paused, task, timer])

    const finishTask = useCallback(async () => {
        if (task && assignee) {
            if (!paused && timer) {
                clearInterval(timer);
                await finishWork();
            }
            const assignees = task.assigned
                .filter(a => a.user !== assignee.user)
                .concat({ ...assignee, finished: true });
            await updateTask(task.id, {
                add_assigned: assignees,
                remove_assigned: [assignee.user]
            });
            setAssignee({ ...assignee, finished: true })
        }
    }, [task, timer, assignee, paused])

    if (task && assignee) {
        return (
            <div className={'tasks-start-page theme-' + task.color}>
                <Link className="material-icons back-btn" to={`/tasks/${taskId}`} >
                    arrow_back
                </Link>
                <div className="content-container">
                    <Tag label={task.status} color={StatusColors.get(task.status)} />
                    <h1>{task.name}</h1>
                    <CircularProgress
                        percent={time * 100 / initialTime}
                        label={(time < 0 ? '-' : '') + formatSimpleDuration(Math.abs(time))}
                        color={task.color}
                    />
                    <div className="button-container">
                        {
                            !assignee.finished
                                && (<>
                                    {
                                        paused ? (
                                            <Button className="expanded" onClick={handleTaskStart}>
                                                Go!
                                            </Button>
                                        ) : (
                                            <Button className="expanded" onClick={handleTaskStart}>
                                                Make a break
                                            </Button>
                                        )
                                    }
                                    <Button className="expanded dark" onClick={finishTask}>
                                        Finish task
                                    </Button>
                                </>)
                        }
                    </div>
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
                    <div className="description-container">
                        <h2>
                            Description
                        </h2>
                        <LongText text={task.text} open={true} />
                    </div>
                </div>
            </div>
        );
    }
    return <LoadingScreen />;
}


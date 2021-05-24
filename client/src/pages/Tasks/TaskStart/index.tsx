import './task-start.scss';
import Tag from 'components/ui/Tag';
import DetailGrid from 'components/layout/DetailGrid';
import { useHistory, useParams } from 'react-router';
import { useCallback, useEffect, useState } from 'react';
import { getTask, getTaskWork, StatusColors, Task, TaskAssignment, updateTask } from 'adapters/task';
import { getProject, Project } from 'adapters/project';
import { getTeam } from 'adapters/team';
import LoadingScreen from 'components/ui/LoadingScreen';
import CircularProgress from 'components/graphs/CircularProgress';
import Button from 'components/ui/Button';
import { getCurrentUser } from 'adapters/user';
import { durationBetween, formatSimpleDuration } from 'timely';
import { finishWork, startWork } from 'adapters/work';

export interface Params {
    taskId: string;
}

function handleTimer(state: number) {
    return state - 1000;
}

export default function TaskDetail() {
    const { taskId } = useParams<Params>();
    const history = useHistory();

    const [task, setTask] = useState<Task>();
    const [time, setTime] = useState<number>(0);
    const [initialTime, setInitialTime] = useState<number>(0);
    const [assignee, setAssignee] = useState<TaskAssignment>();
    const [project, setProject] = useState<Project>();
    const [teamNames, setTeamNames] = useState<string[]>([]);
    const [paused, setPaused] = useState(true);
    const [timer, setTimer] = useState<NodeJS.Timeout>();


    useEffect(() => {
        getTask(taskId).then((task) => {
            setTask(task);
            getCurrentUser().then((user) => {
                const assignee = task.assigned.find(a => a.user = user.id);
                setAssignee(assignee);
                if (assignee) {
                    const minutes = assignee.time * 60 * 1000;
                    getTaskWork(task.id).then(work => {
                        const workedItems = work.filter(w => w.user = user.id);
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
            })
            getProject(task.project).then((project) => {
                setProject(project);
                project.teams.forEach((teamId) =>
                    getTeam(teamId).then((team) => {
                        setTeamNames(state => [...state, team.name])
                    }
                    ));
            });
        }).catch(() => history.goBack());
    }, [taskId, history]);



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
            if (timer) {
                clearInterval(timer);
                await finishWork();
            }
            const assignees = task.assigned.filter(a => a.user !== assignee.user).concat({ ...assignee, finished: true });
            updateTask(task.id, {
                add_assigned: assignees,
                remove_assigned: [assignee.user]
            });
            setAssignee({ ...assignee, finished: true })
        }
    }, [task, timer, assignee])

    if (task && assignee) {
        return (
            <div className={'tasks-start-page theme-' + StatusColors.get(task.status)}>
                <span className="material-icons back-btn" onClick={history.goBack} >
                    arrow_back
                </span>
                <div className="content-container">
                    <Tag label={task.status} color={StatusColors.get(task.status)} />
                    <h1>{task.name}</h1>
                    <CircularProgress percent={time * 100 / initialTime} label={(time < 0 ? '-' : '') + formatSimpleDuration(Math.abs(time))}
                        color={StatusColors.get(task.status)} />
                    <div className="button-container">
                        {
                            !assignee.finished && (<> {
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

                    <div className="description-container">
                        <h2>
                            Description
                        </h2>
                        <p>
                            {task.text}
                        </p>
                    </div>

                    <DetailGrid details={[
                        { icon: 'folder', title: 'Project', label: project?.name ?? 'Loading...' },
                        { icon: 'group', title: 'Teams', label: teamNames.join(', ') }]} />
                </div>
            </div>
        );

    }
    return <LoadingScreen />;
}
import './task-start.scss';
import Tag from 'components/ui/Tag';
import DetailGrid from 'components/layout/DetailGrid';
import { useHistory, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { getTask, StatusColors, Task } from 'adapters/task';
import { getProject, Project } from 'adapters/project';
import { getTeam } from 'adapters/team';
import LoadingScreen from 'components/ui/LoadingScreen';
import CircularProgress from 'components/graphs/CircularProgress';
import Button from 'components/ui/Button';
import { getCurrentUser, User } from 'adapters/user';

export interface Params {
    taskId: string;
}

export default function TaskDetail() {
    const { taskId } = useParams<Params>();
    const history = useHistory();
    const [task, setTask] = useState<Task>();
    const [time, setTime] = useState<number>();
    const [user, setUser] = useState<User>();
    const [project, setProject] = useState<Project>();
    const [teamNames, setTeamNames] = useState<string[]>([]);
    const [paused, setPaused] = useState(true);

    useEffect(() => {
        getTask(taskId).then((task) => {
            setTask(task);
            getCurrentUser().then((user) => {
                setUser(user);
                setTime(task.assigned.find(a => a.user === user.id)?.time);
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

    if (task) {
        return (
            <div className={'tasks-start-page theme-' + StatusColors.get(task.status)}>
                <div className="content-container">
                    <Tag label={task.status} color={StatusColors.get(task.status)} />
                    <h1>{task.name}</h1>
                    <CircularProgress percent={100} label={time?.toString()} color={StatusColors.get(task.status)} />
                    <div className="button-container">
                        {
                            paused ? (
                                <Button className="expanded" onClick={e => setPaused(false)}>
                                    Go!
                                </Button>
                            ) : (
                                <Button className="expanded" onClick={e => setPaused(true)}>
                                    Make a break
                                </Button>
                            )
                        }
                        <Button className="expanded dark">
                            Finish task
                    </Button>
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
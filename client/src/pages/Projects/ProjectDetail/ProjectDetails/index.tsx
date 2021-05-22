import './project-details.scss';
import DetailGrid from 'components/layout/DetailGrid';
import BarChart, { ChartItem } from 'components/graphs/BarChart';
import ButtonLink from 'components/navigation/ButtonLink';
import { getProjectActivity, Project } from 'adapters/project';
import { useEffect, useState } from 'react';
import { getTeam } from 'adapters/team';
import LoadingScreen from 'components/ui/LoadingScreen';
import { parseActivity } from 'adapters/util';

interface Props {
    project: Project
}

export default function ProjectDetails({ project }: Props) {
    const [teams, setTeams] = useState<string[]>([]);
    const [activity, setActivity] = useState<ChartItem[]>([]);

    useEffect(() => {
        project.teams.forEach(teamId => {
            getTeam(teamId).then((team) => setTeams(prev => [...prev, team.name]));
        });
        getProjectActivity(project.id).then((a) => setActivity(parseActivity(a)))
    }, [project]);

    let details = [{
        icon: 'group',
        title: 'Teams',
        label: teams.join(', ')
    }];

    if (project.deadline) {
        details.push({
            icon: 'warning',
            title: 'Deadline',
            label: project.deadline?.getMonth().toString() ?? ''
        });
    }

    return (
        <section className="project-details">
            <DetailGrid details={details} />
            {
                activity ?
                    <BarChart data={activity} /> :
                    <LoadingScreen />
            }
            <ButtonLink routing href={`/projects/${project.id}/edit`} className="expanded">
                Edit
            </ButtonLink>
        </section>
    )
}
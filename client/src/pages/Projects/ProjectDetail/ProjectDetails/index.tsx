import './project-details.scss';
import DetailGrid from 'components/layout/DetailGrid';
import BarChart from 'components/graphs/BarChart';
import ButtonLink from 'components/navigation/ButtonLink';
import { Project } from 'adapters/project';
import { useEffect, useState } from 'react';
import { getTeam } from 'adapters/team';

interface Props {
    project: Project
}

export default function ProjectDetails({ project }: Props) {
    const [teams, setTeams] = useState<string[]>([]);

    useEffect(() => {
        project.teams.forEach(teamId => {
            getTeam(teamId).then((team) => setTeams(prev => [...prev, team.name]));
        });
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

    const data = [
        {
            label: 'Mon',
            value: 50
        },
        {
            label: 'Tue',
            value: 20
        }
    ]

    return (
        <section className="project-details">
            <DetailGrid details={details} />
            <BarChart data={data} />
            <ButtonLink routing href={`/projects/${project.id}/edit`} className="expanded">
                Edit
            </ButtonLink>
        </section>
    )
}
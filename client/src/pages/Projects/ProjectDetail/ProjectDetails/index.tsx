import './project-details.scss';
import DetailGrid from 'components/layout/DetailGrid';
import BarChart from 'components/graphs/BarChart';
import ButtonLink from 'components/navigation/ButtonLink';
import { Project } from 'adapters/project';
import { DetailProps } from 'components/ui/DetailBox';
import { useEffect, useState } from 'react';
import { getTeam, Team } from 'adapters/team';

interface Props {
    project: Project
}

export default function ProjectDetails({ project }: Props) {
    const [teams, setTeams] = useState<string[]>([]);

    useEffect(() => {
        project.teams.forEach(teamId => {
            getTeam(teamId).then((team) => setTeams(prev => [...prev, team.name]));
        });
    }, [])


    const details = [{
        icon: 'group',
        title: 'Team',
        label: teams.join(', ') ?? ''
    },
    {
        icon: 'warning',
        title: 'Deadline',
        label: project.deadline?.getMonth().toString() ?? ''
    }];


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

import { useEffect, useState } from 'react';

import { getTeam } from 'adapters/team';
import { formatDate, subtractTime } from 'timely';

import DetailGrid from 'components/layout/DetailGrid';
import LoadingScreen from 'components/ui/LoadingScreen';
import ButtonLink from 'components/navigation/ButtonLink';
import { getProjectActivity, Project } from 'adapters/project';
import BarChart, { ChartItem, parseActivity } from 'components/graphs/BarChart';

import './project-details.scss';

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
        getProjectActivity(project.id, subtractTime(new Date(), 1, 'week'), new Date()).then((a) => setActivity(parseActivity(a)))
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
            label: formatDate(project.deadline, 'month')
        });
    }

    return (
        <section className="project-details">
            <DetailGrid details={details} />
            {
                activity
                    ? <BarChart unit="h" multiplier={1 / 60 / 60 / 1000} data={activity} />
                    : <LoadingScreen />
            }
            <ButtonLink routing href={`/projects/${project.id}/edit`} className="expanded">
                Edit
            </ButtonLink>
        </section>
    )
}


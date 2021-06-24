
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import { getTeam } from 'adapters/team';
import { formatDate, subtractTime } from 'timely';

import Dropdown from 'components/navigation/Dropdown';
import DetailGrid from 'components/layout/DetailGrid';
import LoadingScreen from 'components/ui/LoadingScreen';
import { getProjectActivity, Project } from 'adapters/project';
import BarChart, { ChartItem, parseActivity } from 'components/graphs/BarChart';

import './project-details.scss';

enum Timespan {
    WEEK = 'week',
    MONTH = 'month',
    YEAR = 'year',
}

interface Params {
    time?: Timespan;
}

interface Props {
    project: Project
}

/**
 * This is a tab of the project details page. It contains some details and stats for the given
 * project.
 */
export default function ProjectDetails({ project }: Props) {
    const [teams, setTeams] = useState<string[]>([]);
    const [activity, setActivity] = useState<ChartItem[]>([]);

    const time = useParams<Params>().time ?? Timespan.WEEK;
    const dropdowns = [
        {
            time: 'week',
            label: 'Last week',
            route: '/projects/' + project.id + '/stats/week'
        },
        {
            time: 'month',
            label: 'Last month',
            route: '/projects/' + project.id + '/stats/month'
        },
        {
            time: 'year',
            label: 'Last year',
            route: '/projects/' + project.id + '/stats/year'
        }
    ];

    useEffect(() => {
        Promise.all(project.teams.map(getTeam))
            .then(teams => setTeams(teams.map(team => team.name)));
    }, [project]);

    useEffect(() => {
        getProjectActivity(project.id, subtractTime(new Date(), 1, time), new Date()).then((a) => setActivity(parseActivity(a)))
    }, [project, time]);

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
            <Dropdown items={dropdowns.filter(d => d.time !== time)}>
                <span className="material-icons icon">
                    expand_more
                </span>
                {dropdowns.find(d => d.time === time)?.label}
            </Dropdown>
            {
                activity
                    ? <BarChart unit="h" multiplier={1 / 60 / 60 / 1000} data={activity} />
                    : <LoadingScreen />
            }
        </section>
    )
}


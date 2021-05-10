import './project-details.scss';
import DetailGrid from 'components/layout/DetailGrid';
import BarChart from 'components/graphs/BarChart';
import ButtonLink from 'components/navigation/ButtonLink';
import { Params } from '../../ProjectDetail';
import { useParams } from 'react-router';

export default function ProjectDetails() {
    const { uuid } = useParams<Params>();

    const details = [{
        icon: 'group',
        title: 'Team',
        label: 'Ryoko'
    },
    {
        icon: 'warning',
        title: 'Deadline',
        label: 'March'
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
            <ButtonLink routing href={`/projects/${uuid}/edit`} className="expanded">
                Edit

            </ButtonLink>
        </section>
    )
}
import './detail-grid.scss';
import DetailBox, { DetailProps } from 'components/ui/DetailBox';

interface Props {
    details: DetailProps[]
}

export default function DetailGrid({ details }: Props) {

    return (
        <div className="detail-grid">
            {
                details.map((detail) => (
                    <div className="box-container">
                        <DetailBox {...detail} />
                    </div>
                ))
            }
        </div>
    )

}

import DetailBox, { DetailProps } from 'components/ui/DetailBox';

import './detail-grid.scss';

interface Props {
    details?: DetailProps[]
}

export default function DetailGrid({ details }: Props) {
    return (
        <div className="detail-grid">
            {
                details?.map((detail) => (
                    <div key={detail.title} className="box-container">
                        <DetailBox {...detail} />
                    </div>
                ))
            }
        </div>
    )
}


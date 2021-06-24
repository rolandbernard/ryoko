
import DetailBox, { DetailProps } from 'components/ui/DetailBox';

import './detail-grid.scss';

interface Props {
    details?: DetailProps[]
}

/**
 * This component implements a grid for displaying details. It consists of multiple DetailBoxes
 * the properties of which are given in the details property.
 */
export default function DetailGrid({ details }: Props): JSX.Element {
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


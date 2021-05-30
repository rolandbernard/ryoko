
import Carousel from 'react-alice-carousel';

import ProjectSlide, { ProjectSlideProps } from 'components/ui/ProjectSlide';

import './projects-slider.scss';
import 'react-alice-carousel/lib/alice-carousel.css';

const responsive = {
    0: { items: 1 },
    560: { items: 2 },
    1200: { items: 3 },
};

interface Props {
    projects: ProjectSlideProps[]
}

export default function ProjectsSlider({ projects }: Props) {
    return (
        <>
            {
                projects.length ?
                    <div className="project-slider">
                        <Carousel
                            mouseTracking
                            responsive={responsive}
                            disableDotsControls
                            disableButtonsControls
                            touchTracking
                        >
                            {
                                projects.map(project => <ProjectSlide key={project.project.id} {...project} />)
                            }
                        </Carousel>
                    </div> :
                    <div>No Projects found.</div>
            }
        </>
    );
}


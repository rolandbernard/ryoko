
import { useCallback, useRef } from 'react';

import ProjectSlide, { ProjectSlideProps } from 'components/ui/ProjectSlide';

import './projects-slider.scss';

interface Props {
    projects: ProjectSlideProps[]
}

export default function ProjectsSlider({ projects }: Props) {
    const slider = useRef<HTMLDivElement | null>(null);

    const onChange = useCallback(amount => {
        const current = parseFloat(slider.current?.style.getPropertyValue('--position') ?? '0') || 0;
        const next = Math.min(Math.max(current + amount, 0), projects.length - 1);
        slider.current?.style.setProperty('--position', next.toString());
    }, [slider, projects]);

    return (
        projects.length
            ? (
                <div className="project-slider" ref={slider}>
                    <div className="prev-button" onClick={() => onChange(-1)}>
                        &lt;
                    </div>
                    <div className = "next-button" onClick={() => onChange(1)}>
                        &gt;
                    </div>
                    {
                        projects.map(project =>
                            <div
                                key={project.project.id}
                                className="slide"
                            >
                                <ProjectSlide {...project} />
                            </div>
                        )
                    }
                </div>
            )
            : <div>No Projects found.</div>
    );
}


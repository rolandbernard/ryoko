
import { CSSProperties, useCallback, useState } from 'react';

import { Project } from 'adapters/project';

import ProjectSlide from 'components/ui/ProjectSlide';

import './projects-slider.scss';

interface Props {
    projects: Project[]
}

/**
 * This component implements a slider for showing multiple projects. The slider will adjust the
 * number of projects presented depending on the size of the screen. The component also provided a
 * functionality to move the slider. All projects in the projects property will be shown in a
 * project slide component.
 */
export default function ProjectsSlider({ projects }: Props) {
    const [position, setPosition] = useState(0);

    const onChange = useCallback(amount => {
        const nextPosition = Math.min(Math.max(position + amount, 0), projects.length - 1);
        setPosition(nextPosition);
    }, [position, setPosition, projects]);

    return (
        projects.length
            ? (
                <div className="project-slider" style={{ '--position': position } as CSSProperties}>
                    {
                        projects.map(project =>
                            <div
                                key={project.id}
                                className="slide"
                            >
                                <ProjectSlide project={project} />
                            </div>
                        )
                    }
                    <div
                        className={'prev-button' + (position > 0 ? '' : ' disabled' )}
                        onClick={() => onChange(-1)}
                    >&lt;</div>
                    <div
                        className={'next-button' + (position < projects.length - 1 ? '' : ' disabled')}
                        onClick={() => onChange(1)}
                    >&gt;</div>
                </div>
            )
            : <div>No Projects found.</div>
    );
}


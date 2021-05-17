import { getProject, Project } from 'adapters/project';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';

interface Params {
    projectId: string;
}

export default function ProjectEdit() {
    const { projectId } = useParams<Params>();
    const [project, setProject] = useState<Project>();
    const history = useHistory();

    useEffect(() => {
        getProject(projectId).then((project) => {
            setProject(project);
        }).catch(() => {
            history.goBack();
        });
    });

    
}
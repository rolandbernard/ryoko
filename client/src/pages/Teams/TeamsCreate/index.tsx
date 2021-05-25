import { createTeam } from "adapters/team";
import TeamForm from "components/forms/TeamForm";
import Callout from "components/ui/Callout";
import { useCallback, useState } from "react";
import { useHistory } from "react-router";

export default function TeamsCreate() {
    const [error, setError] = useState('');
    const history = useHistory();
    const handleCreateTeam = useCallback(async (name: string) => {
        try {
            const team = await createTeam(name);
            history.push('/teams/' + team);
        } catch (e) {
            setError('There was an issue with creating your team. Please try again.')
        }
    }, [history]);

    return (
        <div className="teams-create-page">
            <div className="content-container">
                <h1>Create a new team</h1>
                {error && <Callout message={error} />}
                <TeamForm onSubmit={handleCreateTeam} />
            </div>
        </div>
    );
}
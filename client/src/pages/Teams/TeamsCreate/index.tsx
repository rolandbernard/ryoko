
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { useCallback, useState } from "react";

import { createTeam } from "adapters/team";

import Callout from "components/ui/Callout";
import TeamForm from "components/forms/TeamForm";

/**
 * This page should allow the user to create a new team by requesting all required information.
 */
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
            <Link className="material-icons back-btn" to="/teams" >
                arrow_back
            </Link>
            <div className="content-container">
                <h1>Create a new team</h1>
                {error && <Callout message={error} />}
                <TeamForm onSubmit={handleCreateTeam} />
            </div>
        </div>
    );
}


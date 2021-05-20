import './intro.scss';
import Page from 'components/layout/Page';
import Button from 'components/ui/Button';
import { getCurrentUser } from 'adapters/user';
import { useCallback, useEffect, useState } from 'react';
import TeamForm from 'components/forms/TeamForm';
import { createTeam } from 'adapters/team';
import { useHistory } from 'react-router';

export default function Introduction() {
    const [username, setUsername] = useState('');
    const [showForm, setShowForm] = useState(false);
    const history = useHistory();

    useEffect(() => {
        getCurrentUser().then((user) => {
            setUsername(user.username);
        }).catch(() => {
            history.push('/login');
        });
    });

    const handleCreateTeam = useCallback(async (name: string) => {
        try {
            if (await createTeam(name)) {
                history.push('/tasks');
            }
        } catch (e) { }
    }, [history]);

    return (
        <div className="introduction-page-container">
            <Page className="introduction-page">

                <div className="content-container">
                    <h1 className="underlined">Welcome to ryoko</h1>
                    {!showForm ? (
                        <div className="introduction-container">
                            <div className="lead-text">
                                You are one step away from getting started with ryoko.
                            </div>
                            <div className="possibility">
                                Ask one of your colleagues to add you to their team. <br />
                                Your username is: <strong>{username}</strong>
                            </div>
                            or
                            <div className="possibility">
                                <Button onClick={() => setShowForm(true)}>
                                    Create a new Team
                            </Button>
                            </div>
                        </div>
                    ) :
                        showForm &&
                        (<>
                            <p className="lead-text">
                                Create a new team with just one click by giving it a name!
                            </p>
                            <TeamForm onSubmit={handleCreateTeam} onBack={() => setShowForm(false)} />
                        </>)
                    }
                </div>
            </Page>
        </div >
    )
}

import { Link } from 'react-router-dom';
import { useHistory, useParams } from 'react-router';
import { useCallback, useEffect, useState } from 'react';

import { getTeam, Team, updateTeam } from 'adapters/team';

import Callout from 'components/ui/Callout';
import TeamForm from 'components/forms/TeamForm';
import LoadingScreen from 'components/ui/LoadingScreen';

import './teams-edit.scss';

interface Params {
   teamId: string;
}

/**
 * This page should allow the user to edit the information for a team.
 */
export default function TeamsEdit() {
   const [team, setTeam] = useState<Team>();
   const [error, setError] = useState('');
   const history = useHistory();

   const { teamId } = useParams<Params>();

   useEffect(() => {
      getTeam(teamId).then((team) => {
         setTeam(team);
      }).catch(() => {
         history.push('/teams');
      });
   }, [teamId, history]);

   const handleEditTeam = useCallback(async (name: string) => {
      try {
         if (team) {
            await updateTeam(team.id, name);
            history.push('/teams/' + team.id)
         }
      } catch (e) {
         setError('There was an issue with updating your team. Please try again.')
      }
   }, [team, history]);

   return (
      team
         ? (
            <div className="team-edit-page">
               <Link className="material-icons back-btn" to={`/teams/${teamId}`} >
                  arrow_back
               </Link>
               <div className="content-container">
                  <h1>Edit {team.name}</h1>
                  {error && <Callout message={error} />}
                  <TeamForm team={team} onSubmit={handleEditTeam} />
               </div>
            </div>
         )
         : <LoadingScreen />
   );
}


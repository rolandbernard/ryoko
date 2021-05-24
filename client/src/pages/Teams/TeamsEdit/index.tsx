import { getTeam, Team, updateTeam } from 'adapters/team';
import { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import TeamForm from 'components/forms/TeamForm';
import './teams-edit.scss';
import LoadingScreen from 'components/ui/LoadingScreen';
import Callout from 'components/ui/Callout';

interface Params {
   teamId: string;
}

export default function TeamsEdit() {
   const [team, setTeam] = useState<Team>();
   const { teamId } = useParams<Params>();
   const [error, setError] = useState('');
   const history = useHistory();

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

   if (team) {
      return (
         <div className="team-edit-page">
            <span className="material-icons back-btn" onClick={history.goBack} >
               arrow_back
            </span>
            <div className="content-container">
               <h1>Edit {team.name}</h1>
               {error && <Callout message={error} />}
               <TeamForm team={team} onSubmit={handleEditTeam} />
            </div>
         </div>
      );
   }
   return (
      <LoadingScreen />
   )
}
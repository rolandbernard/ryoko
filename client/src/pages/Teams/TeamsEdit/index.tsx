import { getTeam, Team, updateTeam } from 'adapters/team';
import { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import TeamForm from 'components/forms/TeamForm';
import './teams-edit.scss';
import LoadingScreen from 'components/ui/LoadingScreen';

interface Params {
   teamId: string;
}

export default function TeamsEdit() {
   const [team, setTeam] = useState<Team>();
   const { teamId } = useParams<Params>();
   const history = useHistory();

   useEffect(() => {
      getTeam(teamId).then((team) => {
         setTeam(team);
      }).catch(() => {
         history.push('/teams');
      });
   });

   const handleEditTeam = useCallback(async (name: string) => {
      try {
         if (team) {
            await updateTeam(team.id, name);
            history.push('/teams/' + team.id)
         }
      } catch (e) { }
   }, [team, history]);

   if (team) {
      return (
         <div className="team-edit-page">
            <div className="content-container">
               <h1>Edit {team?.name}</h1>
               <TeamForm team={team} onSubmit={handleEditTeam} />
            </div>
         </div>
      );
   }
   return (
      <LoadingScreen />
   )
}
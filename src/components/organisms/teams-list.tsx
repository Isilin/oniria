'use client';

import { useTeams } from '@/lib/hooks/use-team';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TeamListElement from '../molecules/team-list-element';

const TeamsList = () => {
  const { teams, isLoading } = useTeams();

  if (isLoading) return <CircularProgress />;
  if (!teams?.length)
    return <Typography color="textSecondary">Aucune table de jeu.</Typography>;

  return (
    <Grid
      container
      spacing={2}
      sx={{
        justifyContent: 'center',
      }}
    >
      {teams.map((team) => (
        <TeamListElement team={team} key={team.id} />
      ))}
    </Grid>
  );
};

export default TeamsList;

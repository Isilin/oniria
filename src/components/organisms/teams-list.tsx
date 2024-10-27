'use client';

import { useTeams } from '@/lib/hooks/use-team';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid2';
import TeamListElement from '../molecules/team-list-element';

const TeamsList = () => {
  const { teams, isLoading } = useTeams();

  if (isLoading) return <CircularProgress />;

  return (
    <Grid container spacing={2}>
      {teams.map((team, index) => (
        <TeamListElement team={team} key={index} />
      ))}
    </Grid>
  );
};

export default TeamsList;

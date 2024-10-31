'use client';

import { useTeam } from '@/lib/hooks/use-team';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid2';
import TeamMember from '../molecules/team-member';

const TeamMembersList = ({ id }) => {
  const { team, isLoading } = useTeam(id);

  if (isLoading) return <CircularProgress />;

  return (
    <Grid container spacing={2}>
      {team.members.map((member) => (
        <TeamMember key={member.id} member={member} />
      ))}
    </Grid>
  );
};

export default TeamMembersList;

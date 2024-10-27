'use client';

import { useTeam } from '@/lib/hooks/use-team';

import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

interface Props {
  id: string;
}

const TeamCard = ({ id }: Props) => {
  const { team, isLoading } = useTeam(id);

  if (isLoading) return <CircularProgress />;

  return (
    <>
      <Typography variant="h1">{team.name}</Typography>
      <Typography variant="subtitle1">{team.members.length} joueurs</Typography>
    </>
  );
};

export default TeamCard;

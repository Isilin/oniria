'use client';

import { useTeam } from '@/lib/hooks/use-team';

import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import TeamAddMemberButton from '../molecules/team-add-member-button';
import TeamMembersList from './team-members-list';

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
      <TeamMembersList id={id} />
      <TeamAddMemberButton id={id} />
    </>
  );
};

export default TeamCard;

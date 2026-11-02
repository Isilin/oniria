'use client';

import { TeamSummary } from '@/lib/hooks/use-team';
import { Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

interface Props {
  team: TeamSummary;
}

const TeamListElement = ({ team }: Props) => {
  const router = useRouter();

  return (
    <Card sx={{ width: 250 }}>
      <CardActionArea onClick={() => router.push(`/team/${team.id}`)}>
        <CardContent>
          <Typography variant="h5">{team.name}</Typography>
          <Typography variant="body2" color="textSecondary">
            {team.members.length
              ? team.members.map((m) => m.name).join(', ')
              : 'Aucun personnage'}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default TeamListElement;

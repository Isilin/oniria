'use client';

import { TeamSummary } from '@/lib/hooks/use-team';
import { Card, CardActionArea, CardContent, Typography } from '@mui/material';
import Link from 'next/link';
import { CARD_WIDTH } from '../atoms/card-row';

interface Props {
  team: TeamSummary;
}

const TeamListElement = ({ team }: Props) => {
  return (
    <Card sx={{ width: CARD_WIDTH }}>
      <CardActionArea component={Link} href={`/team/${team.id}`}>
        <CardContent>
          <Typography
            variant="hand"
            component="h3"
            sx={{ fontSize: '1.625rem', overflowWrap: 'anywhere' }}
          >
            {team.name}
          </Typography>
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

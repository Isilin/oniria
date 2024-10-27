'use client';

import Button from '@mui/material/Button';
import { Team } from '@prisma/client';
import Link from 'next/link';

interface Props {
  team: Team;
}

const TeamListElement = ({ team }: Props) => {
  return (
    <Link href={`/team/${team.id}`}>
      <Button>{team.name}</Button>
    </Link>
  );
};

export default TeamListElement;

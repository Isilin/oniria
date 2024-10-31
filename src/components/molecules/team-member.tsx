'use client';

import { useSheets } from '@/lib/hooks/use-sheet';
import { CircularProgress, MenuItem, Select } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Sheet } from '@prisma/client';
import TeamMemberDeleteButton from './team-member-delete-button';

interface Props {
  member: Sheet;
}

const TeamMember = ({ member }: Props) => {
  const { sheets, isLoading } = useSheets();

  if (isLoading) return <CircularProgress />;

  return (
    <Grid size={4} display="flex">
      {sheets && (
        <Select value={member.name}>
          {[...sheets.own, ...sheets.others].map((e, index) => (
            <MenuItem key={index} value={e.name}>
              {e.name}
            </MenuItem>
          ))}
        </Select>
      )}
      <TeamMemberDeleteButton id={member.id} />
    </Grid>
  );
};

export default TeamMember;

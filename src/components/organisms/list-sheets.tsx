import { auth } from '@/app/auth';
import { db } from '@/lib/helpers/db';
import { Grid } from '@mui/material';
import AddSheetCard from '../molecules/add-sheet-card';
import SheetCard from '../molecules/sheet-card';

const ListSheets = async () => {
  const session = await auth();

  let sheets = [];
  if (session?.user.role === 'ADMIN') {
    sheets = await db.sheet.findMany({ include: { user: true } });
  } else {
    sheets = await db.sheet.findMany({
      where: { userId: session?.user.id },
      include: { user: true },
    });
  }

  return (
    <Grid container spacing={2} columns={12} gap={4}>
      {[...sheets].map((sheet, index) => (
        <SheetCard
          key={index}
          sheet={sheet}
          userVisible={session?.user.role === 'ADMIN'}
        />
      ))}
      <AddSheetCard />
    </Grid>
  );
};

export default ListSheets;

import { auth } from '@/app/auth';
import prisma from '@/lib/db/prisma';
import { SheetWithUser } from '@/lib/db/sheet';
import { sanitize } from '@/lib/helpers/sanitize';
import { Container, Divider, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import AddSheetCard from '../molecules/add-sheet-card';
import SheetCard from '../molecules/sheet-card';

const ListSheets = async () => {
  const session = await auth();

  const sheets: SheetWithUser[] = await prisma.sheet
    .findMany({
      where: { userId: session?.user.id },
      include: { user: true },
    })
    .then((res) => sanitize(res));
  const others: SheetWithUser[] = await prisma.sheet
    .findMany({
      where: {
        userId: {
          not: session?.user.id,
        },
      },
      include: { user: true },
    })
    .then((res) => sanitize(res));

  return (
    <Container>
      <Typography variant="h4">Mes fiches</Typography>
      <Grid container spacing={2} columns={12} gap={4}>
        {[...sheets].map((sheet, index) => (
          <SheetCard key={index} sheet={sheet} userVisible={false} />
        ))}
        <AddSheetCard />
      </Grid>
      <Divider sx={{ my: 2 }} variant="middle" />
      <Typography variant="h4">Autres fiches</Typography>
      <Grid container spacing={2} columns={12} gap={4}>
        {[...others].map((sheet, index) => (
          <SheetCard key={index} sheet={sheet} userVisible={true} />
        ))}
      </Grid>
    </Container>
  );
};

export default ListSheets;

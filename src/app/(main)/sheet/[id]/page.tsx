import BackButton from '@/components/atoms/back-button';
import HeaderSlot from '@/components/atoms/header-slot';
import SWRFallback from '@/components/atoms/swr-fallback';
import DeleteSheetButton from '@/components/molecules/delete-sheet-button';
import Sheet from '@/components/organisms/sheet';
import { asJson, findSheet } from '@/lib/server/queries';
import { getSession } from '@/lib/server/session';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';

const Page = async ({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) => {
  const params = await paramsPromise;
  const session = await getSession();
  if (!session?.user) redirect('/');

  // La fiche arrive avec la page : pas d'attente d'un appel à l'API.
  const sheet = await findSheet(params.id);
  // Fiche supprimée ou adresse fausse : la page « introuvable » (404).
  if (!sheet) notFound();
  const fallback = { [`/api/sheets/${params.id}`]: asJson(sheet) };

  return (
    <Suspense>
      <SWRFallback fallback={fallback}>
        <HeaderSlot side="start">
          <BackButton href="/" />
        </HeaderSlot>
        <HeaderSlot side="title">Feuille de personnage</HeaderSlot>
        <HeaderSlot side="end">
          <DeleteSheetButton id={params.id} />
        </HeaderSlot>
        <Sheet id={params.id} />
      </SWRFallback>
    </Suspense>
  );
};

export default Page;

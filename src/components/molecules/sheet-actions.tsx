'use client';

import { useDownload } from '@/lib/hooks/use-download';
import { useSheet } from '@/lib/hooks/use-sheet';
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';
import PdfIcon from '@mui/icons-material/PictureAsPdfOutlined';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useSWRConfig } from 'swr';
import DeleteConfirmation from './_shared/delete-confirmation';
import MoreActions, { MoreAction } from './_shared/more-actions';

/**
 * Le menu ⋯ de la fiche : l'export PDF pour tout le monde (chacun·e lit
 * toutes les fiches), la suppression pour qui peut la modifier.
 */
const SheetActions = ({ id }: { id: string }) => {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { sheet, canEdit, deleteSheet } = useSheet(id);
  const { enqueueSnackbar } = useSnackbar();
  const { busy, download } = useDownload();
  const [open, setOpen] = useState(false);

  const name = sheet?.name || 'cette fiche';

  const handleDelete = async () => {
    if (await deleteSheet()) {
      enqueueSnackbar(`${sheet?.name ?? 'Fiche'} supprimée.`, {
        variant: 'info',
      });
      await mutate('/api/sheets');
      router.push('/');
    }
  };

  const actions: MoreAction[] = [
    {
      label: 'Exporter en PDF',
      icon: <PdfIcon fontSize="small" />,
      onClick: () =>
        download(
          `/api/sheets/${id}/pdf`,
          `${sheet?.name || 'Fiche'}.pdf`,
          'Fiche exportée.',
        ),
    },
    ...(canEdit
      ? [
          {
            label: 'Supprimer la fiche…',
            icon: <DeleteIcon fontSize="small" />,
            danger: true,
            onClick: () => setOpen(true),
          },
        ]
      : []),
  ];

  return (
    <>
      <MoreActions label="Actions sur la fiche" actions={actions} busy={busy} />
      {canEdit && (
        <DeleteConfirmation
          open={open}
          onClose={() => setOpen(false)}
          onValidated={handleDelete}
          title={`Supprimer « ${name} » ?`}
          message="La fiche disparaît avec son inventaire, ses notes et tout son historique d'expérience. Cette action est irréversible."
          confirmLabel="Supprimer la fiche"
          waitForResult
        />
      )}
    </>
  );
};

export default SheetActions;

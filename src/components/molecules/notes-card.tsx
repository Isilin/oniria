'use client';

import { useSheet } from '@/lib/hooks/use-sheet';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import dynamic from 'next/dynamic';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

// L'éditeur pèse plus que tout le reste de la fiche : chargé à part.
const MarkdownEditor = dynamic(() => import('./_shared/mdx-editor'), {
  ssr: false,
  loading: () => <CircularProgress sx={{ m: 2 }} />,
});

/** Commence à télécharger l'éditeur, ex. au survol de l'onglet Notes. */
export const preloadEditor = () => {
  void import('./_shared/mdx-editor');
};

const NotesCard = ({ id }: { id: string }) => {
  const { sheet, canEdit, update } = useSheet(id);
  const [changed, setChanged] = useState(false);
  const [markdown, setMarkdown] = useState(sheet.notes || '');
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (markdown: string) => {
    setChanged(true);
    setMarkdown(markdown);
  };

  const handleBlur = async () => {
    if (markdown !== sheet.notes && (await update({ notes: markdown }))) {
      setChanged(false);
      enqueueSnackbar(`Notes sauvegardées.`, { variant: 'info' });
    }
  };

  if (!canEdit && !sheet.notes) {
    return (
      <Typography color="textSecondary" sx={{ p: 2 }}>
        Aucune note.
      </Typography>
    );
  }

  return (
    <MarkdownEditor
      markdown={markdown}
      onChange={handleChange}
      onBlur={handleBlur}
      changed={changed}
      readOnly={!canEdit}
    />
  );
};

export default NotesCard;

'use client';

import { useSheet } from '@/lib/hooks/use-sheet';
import Typography from '@mui/material/Typography';
import dynamic from 'next/dynamic';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

const MarkdownEditor = dynamic(() => import('./_shared/mdx-editor'), {
  ssr: false,
});

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

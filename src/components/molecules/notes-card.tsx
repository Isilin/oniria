import { useSheet } from '@/lib/hooks/use-sheet';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

const MarkdownEditor = dynamic(() => import('../organisms/mdx-editor'), {
  ssr: false,
});

const NotesCard = () => {
  const { id } = useParams<{ id: string }>();
  const { sheet, mutate } = useSheet(id);
  const [changed, setChanged] = useState(false);
  const [markdown, setMarkdown] = useState(sheet.notes || '');
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (markdown) => {
    setChanged(true);
    setMarkdown(markdown);
  };

  const handleBlur = () => {
    if (markdown !== sheet.notes) {
      mutate({ notes: markdown });
      setChanged(false);
      enqueueSnackbar(`Notes sauvegardées.`, { variant: 'info' });
    }
  };

  return (
    <MarkdownEditor
      markdown={markdown}
      onChange={handleChange}
      onBlur={handleBlur}
      changed={changed}
    />
  );
};

export default NotesCard;

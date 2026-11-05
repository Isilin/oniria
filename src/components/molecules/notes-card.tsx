'use client';

import { useSheet } from '@/lib/hooks/use-sheet';
import type { MDXEditorMethods } from '@mdxeditor/editor';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import dynamic from 'next/dynamic';
import { useSnackbar } from 'notistack';
import { useEffect, useRef, useState } from 'react';

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
  const saved = sheet.notes ?? '';
  // Ce qui a été tapé ici et pas encore enregistré ; null = rien.
  const [draft, setDraft] = useState<string | null>(null);
  const changed = draft !== null && draft !== saved;
  const editorRef = useRef<MDXEditorMethods | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  // Notes changées ailleurs pendant que la page est ouverte (autre appareil,
  // MJ) : tant que rien n'est tapé ici, l'éditeur montre la nouvelle version.
  // Sans cela, un simple clic dans la page puis ailleurs réenregistrait
  // l'ancienne par-dessus.
  useEffect(() => {
    const editor = editorRef.current;
    if (draft === null && editor && editor.getMarkdown() !== saved) {
      editor.setMarkdown(saved);
    }
  }, [saved, draft]);

  // Quitter la page avec des notes non enregistrées demande confirmation,
  // comme pour les points en attente.
  useEffect(() => {
    if (!changed) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [changed]);

  const handleChange = (markdown: string) => {
    setDraft(markdown === saved ? null : markdown);
  };

  const handleBlur = async () => {
    if (draft === null || draft === saved) return;
    const sent = draft;
    if (await update({ notes: sent })) {
      // Ce qui a été tapé pendant l'envoi reste à enregistrer.
      setDraft((current) => (current === sent ? null : current));
      enqueueSnackbar('Notes sauvegardées.', { variant: 'info' });
    }
  };

  if (!canEdit && !saved) {
    return (
      <Typography color="textSecondary" sx={{ p: 2 }}>
        Aucune note.
      </Typography>
    );
  }

  return (
    <MarkdownEditor
      markdown={draft ?? saved}
      onChange={handleChange}
      onBlur={handleBlur}
      changed={changed}
      readOnly={!canEdit}
      editorRef={editorRef}
    />
  );
};

export default NotesCard;

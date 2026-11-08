'use client';

import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { requestFile } from '../helpers/swr';
import { useNotifyError } from './use-notify-error';

/** Propose le fichier au navigateur, sous son nom. */
const saveFile = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Laisse au navigateur le temps de commencer le téléchargement.
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
};

/**
 * Télécharge un fichier produit par le serveur (export PDF) : occupé
 * pendant qu'il se compose, un billet quand il est prêt, l'erreur sinon.
 */
export const useDownload = () => {
  const [busy, setBusy] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const notifyError = useNotifyError();

  const download = async (url: string, fallbackName: string, done: string) => {
    if (busy) return;
    setBusy(true);
    try {
      const { blob, filename } = await requestFile(url);
      saveFile(blob, filename ?? fallbackName);
      enqueueSnackbar(done, { variant: 'info' });
    } catch (e) {
      notifyError(e);
    } finally {
      setBusy(false);
    }
  };

  return { busy, download };
};

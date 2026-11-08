'use client';

import { CollectionItem, ItemPatch, useSheet } from '@/lib/hooks/use-sheet';
import { CollectionKey } from '@/lib/sheet/fields';
import { ReactNode } from 'react';
import CollectionTable, { Column } from './collection-table';

interface Props<K extends CollectionKey> {
  id: string;
  collection: K;
  columns: Column<CollectionItem<K> & Record<string, unknown>>[];
  title?: ReactNode;
  /** Valeurs par défaut d'un nouvel élément. */
  defaults?: ItemPatch<K>;
  /** Remplace le bouton « Ajouter » (ex. choix dans un catalogue). */
  addControl?: ReactNode;
  filter?: (item: CollectionItem<K>) => boolean;
  addLabel?: string;
  emptyLabel?: string;
  footer?: ReactNode;
  itemLabel?: (item: CollectionItem<K> & Record<string, unknown>) => string;
  deletable?: boolean;
  confirmDelete?: boolean;
}

/**
 * Tableau éditable branché sur une liste de la fiche (Corpus, armes…). Le
 * MJ peut y rayer un élément et le rétablir.
 */
function SheetCollection<K extends CollectionKey>({
  id,
  collection,
  columns,
  defaults,
  addControl,
  filter,
  footer,
  ...rest
}: Props<K>) {
  const {
    sheet,
    canEdit,
    isAdmin,
    createItem,
    updateItem,
    deleteItem,
    strikeItem,
    restoreItem,
  } = useSheet(id);
  if (!sheet) return null;

  const items = (sheet[collection] as CollectionItem<K>[]).filter(
    filter ?? (() => true),
  ) as (CollectionItem<K> & Record<string, unknown>)[];

  return (
    <CollectionTable
      rows={items}
      columns={columns}
      editable={canEdit}
      onAdd={
        addControl ? undefined : () => createItem(collection, defaults ?? {})
      }
      onUpdate={(itemId, patch) => updateItem(collection, itemId, patch)}
      onDelete={(itemId) => deleteItem(collection, itemId)}
      // Rayer et rétablir : le MJ seul.
      onStrike={
        isAdmin ? (itemId) => strikeItem(collection, itemId) : undefined
      }
      onRestore={
        isAdmin ? (itemId) => restoreItem(collection, itemId) : undefined
      }
      footer={
        <>
          {footer}
          {canEdit && addControl}
        </>
      }
      {...rest}
    />
  );
}

export default SheetCollection;

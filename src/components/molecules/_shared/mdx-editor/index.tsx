'use client';

import ChangedIndicator from '@/components/atoms/changed-indicator';
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CodeToggle,
  CreateLink,
  headingsPlugin,
  imagePlugin,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  linkDialogPlugin,
  listsPlugin,
  ListsToggle,
  markdownShortcutPlugin,
  MDXEditor,
  quotePlugin,
  Separator,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
  type MDXEditorMethods,
} from '@mdxeditor/editor';
// Styles chargés avec l'éditeur (onglet Notes), et non sur toutes les pages.
import '@mdxeditor/editor/style.css';
import './styles.css';

interface EditorProps {
  markdown: string;
  onChange?: (markdown: string) => void;
  onBlur?: () => void;
  changed: boolean;
  readOnly?: boolean;
  editorRef?: React.MutableRefObject<MDXEditorMethods | null>;
}

export default function InitializedMDXEditor({
  markdown,
  onChange,
  onBlur,
  changed,
  readOnly,
  editorRef,
}: EditorProps) {
  return (
    <MDXEditor
      onChange={onChange}
      onBlur={onBlur}
      markdown={markdown}
      readOnly={readOnly}
      plugins={[
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <UndoRedo />
              <Separator />
              <BlockTypeSelect />
              <BoldItalicUnderlineToggles />
              <Separator />
              <ListsToggle />
              <InsertThematicBreak />
              <Separator />
              <InsertTable />
              <InsertImage />
              <CreateLink />
              <CodeToggle />
              <Separator />
              <ChangedIndicator changed={changed} />
            </>
          ),
        }),
        headingsPlugin(),
        quotePlugin(),
        listsPlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        linkDialogPlugin(),
        imagePlugin(),
        tablePlugin(),
      ]}
      ref={editorRef}
      contentEditableClassName="prose"
      // Les deux thèmes de l'app sont du papier clair (Jour, bougie) : les
      // notes s'écrivent toujours sur la feuille, à la main (styles.css).
      className="light-theme"
    />
  );
}

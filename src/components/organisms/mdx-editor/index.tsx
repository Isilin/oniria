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
import { useColorScheme } from '@mui/material/styles';
import './styles.css';

interface EditorProps {
  markdown: string;
  onChange?: (markdown: string) => void;
  onBlur?: () => void;
  changed: boolean;
  editorRef?: React.MutableRefObject<MDXEditorMethods | null>;
}

export default function InitializedMDXEditor({
  markdown,
  onChange,
  onBlur,
  changed,
  editorRef,
}: EditorProps) {
  const { mode, systemMode } = useColorScheme();
  if (!mode) {
    return null;
  }
  const theme = (mode === 'system' ? systemMode : mode) + '-theme';

  return (
    <MDXEditor
      onChange={onChange}
      onBlur={onBlur}
      markdown={markdown}
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
      className={`${theme} mdx-editor-over`}
    />
  );
}

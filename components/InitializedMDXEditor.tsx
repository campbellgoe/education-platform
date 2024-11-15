'use client'
// InitializedMDXEditor.tsx
import type { ForwardedRef } from 'react'
import {
  linkPlugin,
  linkDialogPlugin,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  InsertImage,
  UndoRedo, BoldItalicUnderlineToggles, toolbarPlugin,
  type MDXEditorMethods,
  type MDXEditorProps,
  type SandpackConfig,
  codeBlockPlugin,
  sandpackPlugin,
  codeMirrorPlugin,
  ConditionalContents,
  ChangeCodeMirrorLanguage,
  ShowSandpackInfo,
  InsertSandpack,
  InsertCodeBlock,
  imagePlugin,
  CreateLink,
} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
const defaultSnippetContent = `
/**
 * Code goes here
 */
`.trim()

const simpleSandpackConfig: SandpackConfig = {
  defaultPreset: 'react',
  presets: [
    {
      label: 'React',
      name: 'react',
      meta: 'live react',
      sandpackTemplate: 'react',
      sandpackTheme: 'light',
      snippetFileName: '/App.tsx',
      snippetLanguage: 'tsx',
      initialSnippetContent: defaultSnippetContent
    },
  ]
}
// Only import this to the next file
export default function InitializedMDXEditor({
  editorRef,
  ...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
  return (
    <MDXEditor
      plugins={[
        linkPlugin(),
        linkDialogPlugin(),
        headingsPlugin({ allowedHeadingLevels: [1, 2, 3, 4, 5, 6] }),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        imagePlugin(),
        codeBlockPlugin({defaultCodeBlockLanguage: 'ts'}),
        sandpackPlugin({ sandpackConfig: simpleSandpackConfig }),
        codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', css: 'CSS', html: 'HTML', ts: 'TypeScript', rust: 'Rust', txt: 'text' } }),
        toolbarPlugin({
          toolbarClassName: 'mdx-editor-toolbar',
          toolbarContents: () => (
            <>
              {' '}
              <UndoRedo />
              <BoldItalicUnderlineToggles />
              <CreateLink />
              <InsertImage />
              <ConditionalContents
                options={[
                  { when: (editor) => editor?.editorType === 'codeblock', contents: () => <ChangeCodeMirrorLanguage /> },
                  { when: (editor) => editor?.editorType === 'sandpack', contents: () => <ShowSandpackInfo /> },
                  { fallback: () => ( <> 
                  <InsertCodeBlock />
                  <InsertSandpack />
                </>) }
                ]}
              />
            </>
          )
        })
      ]}
      {...props}
      ref={editorRef}
    />
  )
}
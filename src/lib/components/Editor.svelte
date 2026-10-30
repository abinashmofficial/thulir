<script lang="ts">
  import { onMount, onDestroy, untrack } from 'svelte';
  import { EditorState } from '@codemirror/state';
  import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter } from '@codemirror/view';
  import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
  import { syntaxHighlighting, defaultHighlightStyle, bracketMatching, foldGutter } from '@codemirror/language';
  import { searchKeymap, highlightSelectionMatches } from '@codemirror/search';
  import { autocompletion, closeBrackets } from '@codemirror/autocomplete';
  import { oneDark } from '@codemirror/theme-one-dark';

  import { javascript } from '@codemirror/lang-javascript';
  import { rust } from '@codemirror/lang-rust';
  import { python } from '@codemirror/lang-python';
  import { html } from '@codemirror/lang-html';
  import { css } from '@codemirror/lang-css';
  import { json } from '@codemirror/lang-json';
  import { markdown } from '@codemirror/lang-markdown';

  interface Props {
    content: string;
    filePath: string;
    onchange: (newContent: string) => void;
    onsave: () => void;
    oncursorchange?: (line: number, col: number) => void;
  }

  let { content, filePath, onchange, onsave, oncursorchange }: Props = $props();

  let editorElement: HTMLDivElement | null = $state(null);
  let view: EditorView | null = null;
  let lastLoadedPath = '';

  function getLanguageExtension(path: string) {
    const ext = path.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'ts':
        return javascript({ typescript: true });
      case 'tsx':
        return javascript({ typescript: true, jsx: true });
      case 'js':
      case 'mjs':
      case 'cjs':
        return javascript();
      case 'jsx':
        return javascript({ jsx: true });
      case 'rs':
        return rust();
      case 'py':
        return python();
      case 'html':
      case 'svelte':
        return html();
      case 'css':
        return css();
      case 'json':
        return json();
      case 'md':
      case 'markdown':
        return markdown();
      default:
        return [];
    }
  }

  function initEditor(docContent: string, currentPath: string) {
    if (!editorElement) return;

    if (view) {
      view.destroy();
      view = null;
    }

    const langExt = getLanguageExtension(currentPath);

    const customTheme = EditorView.theme({
      '&': {
        height: '100%',
        fontSize: '13.5px',
        fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, Monaco, 'Courier New', monospace",
        backgroundColor: 'var(--vscode-editor-bg, #1e1e1e)',
        color: 'var(--vscode-editor-fg, #d4d4d4)',
      },
      '.cm-scroller': {
        overflow: 'auto',
      },
      '.cm-gutters': {
        backgroundColor: 'var(--vscode-editor-bg, #1e1e1e)',
        color: '#858585',
        borderRight: '1px solid var(--vscode-sideBar-border, #2d2d2d)',
      },
      '.cm-activeLine': {
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
      },
      '.cm-activeLineGutter': {
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        color: '#c6c6c6',
      },
      '&.cm-focused .cm-cursor': {
        borderLeftColor: 'var(--vscode-tab-activeBorder, #007acc)',
        borderLeftWidth: '2px',
      },
      '.cm-selectionBackground, ::selection': {
        backgroundColor: '#264f78 !important',
      },
    });

    const startState = EditorState.create({
      doc: docContent,
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        history(),
        foldGutter(),
        bracketMatching(),
        closeBrackets(),
        autocompletion(),
        highlightActiveLine(),
        highlightSelectionMatches(),
        oneDark,
        customTheme,
        langExt,
        keymap.of([
          ...defaultKeymap,
          ...historyKeymap,
          ...searchKeymap,
          indentWithTab,
          {
            key: 'Mod-s',
            run: () => {
              onsave();
              return true;
            },
          },
        ]),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const str = update.state.doc.toString();
            onchange(str);
          }
          if (update.selectionSet || update.docChanged) {
            const head = update.state.selection.main.head;
            const line = update.state.doc.lineAt(head);
            const col = head - line.from + 1;
            oncursorchange?.(line.number, col);
          }
        }),
      ],
    });

    view = new EditorView({
      state: startState,
      parent: editorElement,
    });

    view.focus();
  }

  // Only re-initialize when switching to a DIFFERENT file/path
  $effect(() => {
    const p = filePath;
    if (editorElement && p !== lastLoadedPath) {
      lastLoadedPath = p;
      untrack(() => {
        initEditor(content, p);
      });
    }
  });

  onDestroy(() => {
    if (view) {
      view.destroy();
      view = null;
    }
  });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
  class="editor-container"
  bind:this={editorElement}
  onclick={() => view?.focus()}
  role="region"
  aria-label="Code Editor"
></div>

<style>
  .editor-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    cursor: text;
  }
</style>

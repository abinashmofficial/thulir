<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { EditorTab, SidebarTab } from '$lib/types';
  import {
    getCurrentWorkspace,
    readFile,
    writeFile,
  } from '$lib/services/api';
  import { applyTheme, getSavedTheme } from '$lib/services/themes';
  import TitleBar from '$lib/components/TitleBar.svelte';
  import ActivityBar from '$lib/components/ActivityBar.svelte';
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import Editor from '$lib/components/Editor.svelte';
  import FileTree from '$lib/components/FileTree.svelte';
  import SearchPanel from '$lib/components/SearchPanel.svelte';
  import DebugView from '$lib/components/DebugView.svelte';
  import ExtensionsView from '$lib/components/ExtensionsView.svelte';
  import BottomPanel from '$lib/components/BottomPanel.svelte';
  import StatusBar from '$lib/components/StatusBar.svelte';
  import CommandPalette from '$lib/components/CommandPalette.svelte';
  import SettingsModal from '$lib/components/SettingsModal.svelte';
  import ShortcutsModal from '$lib/components/ShortcutsModal.svelte';

  let workspacePath = $state('');
  let tabs: EditorTab[] = $state([]);
  let activeTabId: string | null = $state(null);
  let activeSidebar: SidebarTab | 'debug' | 'extensions' | null = $state('explorer');
  let terminalOpen = $state(false);
  let paletteOpen = $state(false);
  let settingsOpen = $state(false);
  let settingsTab: 'settings' | 'theme' = $state('theme');
  let shortcutsOpen = $state(false);

  let cursorLine = $state(1);
  let cursorCol = $state(1);
  let untitledCounter = $state(1);

  let fileTree: { loadRoot: () => Promise<void> } | null = $state(null);

  let activeTab = $derived(tabs.find((t) => t.id === activeTabId));

  function getLanguageFromPath(path: string): string {
    const ext = path.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'ts':
        return 'TypeScript';
      case 'tsx':
        return 'TypeScript React';
      case 'js':
      case 'mjs':
        return 'JavaScript';
      case 'jsx':
        return 'JavaScript React';
      case 'rs':
        return 'Rust';
      case 'py':
        return 'Python';
      case 'html':
        return 'HTML';
      case 'svelte':
        return 'Svelte';
      case 'css':
      case 'scss':
        return 'CSS';
      case 'json':
        return 'JSON';
      case 'md':
        return 'Markdown';
      case 'toml':
        return 'TOML';
      default:
        return 'Plain Text';
    }
  }

  // VS Code style default Untitled-1, Untitled-2...
  function createUntitledTab() {
    const title = `Untitled-${untitledCounter++}`;
    const newTab: EditorTab = {
      id: 'tab_' + Math.random().toString(36).slice(2, 9),
      title,
      path: `untitled:${title}`,
      content: '',
      originalContent: '',
      isDirty: false,
      language: 'Plain Text',
      cursorLine: 1,
      cursorCol: 1,
    };
    tabs = [...tabs, newTab];
    activeTabId = newTab.id;
  }

  async function openFile(path: string, name: string) {
    const existing = tabs.find((t) => t.path === path);
    if (existing) {
      activeTabId = existing.id;
      return;
    }

    try {
      const content = await readFile(path);
      const newTab: EditorTab = {
        id: 'tab_' + Math.random().toString(36).slice(2, 9),
        title: name,
        path,
        content,
        originalContent: content,
        isDirty: false,
        language: getLanguageFromPath(path),
        cursorLine: 1,
        cursorCol: 1,
      };
      tabs = [...tabs, newTab];
      activeTabId = newTab.id;
    } catch (e) {
      alert(`Could not open file: ${e}`);
    }
  }

  async function saveActiveFile() {
    if (!activeTab) return;

    // If untitled, prompt for destination file name
    if (activeTab.path.startsWith('untitled:')) {
      const suggestedName = activeTab.title.includes('.') ? activeTab.title : `${activeTab.title}.txt`;
      const fileName = prompt('Save As (e.g. index.js, main.rs, test.py):', suggestedName);
      if (!fileName) return;

      const fullPath = `${workspacePath}/${fileName.trim()}`;
      try {
        await writeFile(fullPath, activeTab.content);
        activeTab.path = fullPath;
        activeTab.title = fileName.trim();
        activeTab.isDirty = false;
        activeTab.originalContent = activeTab.content;
        activeTab.language = getLanguageFromPath(fullPath);
        await fileTree?.loadRoot();
      } catch (e) {
        alert(`Failed to save file: ${e}`);
      }
    } else {
      // Existing file: silent instant save
      try {
        await writeFile(activeTab.path, activeTab.content);
        activeTab.isDirty = false;
        activeTab.originalContent = activeTab.content;
      } catch (e) {
        alert(`Failed to save file: ${e}`);
      }
    }
  }

  function closeTab(tabId: string, event?: Event) {
    event?.stopPropagation();
    const tabIndex = tabs.findIndex((t) => t.id === tabId);
    if (tabIndex === -1) return;

    const tab = tabs[tabIndex];
    if (tab.isDirty) {
      if (!confirm(`Save changes to ${tab.title} before closing?`)) {
        return;
      }
    }

    tabs = tabs.filter((t) => t.id !== tabId);
    if (activeTabId === tabId) {
      if (tabs.length > 0) {
        const nextIndex = Math.min(tabIndex, tabs.length - 1);
        activeTabId = tabs[nextIndex].id;
      } else {
        activeTabId = null;
      }
    }
  }

  function handleEditorChange(newContent: string) {
    if (activeTab) {
      activeTab.content = newContent;
      activeTab.isDirty = newContent !== activeTab.originalContent;
    }
  }

  function handleCursorChange(line: number, col: number) {
    cursorLine = line;
    cursorCol = col;
    if (activeTab) {
      activeTab.cursorLine = line;
      activeTab.cursorCol = col;
    }
  }

  function handleMenuAction(actionId: string) {
    switch (actionId) {
      case 'new_file':
        createUntitledTab();
        break;
      case 'save_file':
        saveActiveFile();
        break;
      case 'close_tab':
        if (activeTabId) closeTab(activeTabId);
        break;
      case 'command_palette':
        paletteOpen = true;
        break;
      case 'toggle_explorer':
        activeSidebar = activeSidebar === 'explorer' ? null : 'explorer';
        break;
      case 'toggle_search':
        activeSidebar = activeSidebar === 'search' ? null : 'search';
        break;
      case 'toggle_git':
        activeSidebar = activeSidebar === 'git' ? null : 'git';
        break;
      case 'toggle_terminal':
      case 'new_terminal':
        terminalOpen = !terminalOpen;
        break;
      case 'switch_theme':
        settingsTab = 'theme';
        settingsOpen = true;
        break;
      case 'shortcuts':
      case 'open_shortcuts':
        shortcutsOpen = true;
        break;
      case 'about':
        paletteOpen = true;
        break;
    }
  }

  // Chord state for Ctrl+K
  let pendingChord = false;
  let chordTimer: ReturnType<typeof setTimeout> | null = null;

  function handleGlobalKeydown(e: KeyboardEvent) {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const modifier = isMac ? e.metaKey : e.ctrlKey;

    // Handle chords like Ctrl+K Ctrl+T (Theme) and Ctrl+K Ctrl+S (Shortcuts)
    if (modifier && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      pendingChord = true;
      if (chordTimer) clearTimeout(chordTimer);
      chordTimer = setTimeout(() => {
        pendingChord = false;
      }, 2000);
      return;
    }

    if (pendingChord) {
      pendingChord = false;
      if (e.key.toLowerCase() === 't') {
        e.preventDefault();
        settingsTab = 'theme';
        settingsOpen = true;
        return;
      }
      if (e.key.toLowerCase() === 's') {
        e.preventDefault();
        shortcutsOpen = true;
        return;
      }
    }

    if (modifier && e.key.toLowerCase() === 'n') {
      e.preventDefault();
      createUntitledTab();
    } else if (modifier && e.key.toLowerCase() === 's') {
      e.preventDefault();
      saveActiveFile();
    } else if (modifier && e.key.toLowerCase() === 'p') {
      e.preventDefault();
      paletteOpen = !paletteOpen;
    } else if (modifier && e.key === '`') {
      e.preventDefault();
      terminalOpen = !terminalOpen;
    } else if (modifier && e.key.toLowerCase() === 'b') {
      e.preventDefault();
      activeSidebar = activeSidebar ? null : 'explorer';
    } else if (modifier && e.key.toLowerCase() === 'w') {
      if (activeTabId) {
        e.preventDefault();
        closeTab(activeTabId);
      }
    }
  }

  onMount(async () => {
    // Initialize saved theme
    applyTheme(getSavedTheme());

    window.addEventListener('keydown', handleGlobalKeydown);
    workspacePath = await getCurrentWorkspace();

    // Open README or default Untitled-1 if nothing else
    setTimeout(async () => {
      const readmePath = `${workspacePath}/README.md`;
      try {
        await openFile(readmePath, 'README.md');
      } catch {
        createUntitledTab();
      }
    }, 200);
  });

  onDestroy(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', handleGlobalKeydown);
    }
  });
</script>

<div class="vscode-app-window">
  <!-- Top TitleBar with VS Code Menus -->
  <TitleBar
    title={activeTab ? `${activeTab.title} — thulir` : 'thulir'}
    onMenuAction={handleMenuAction}
    onToggleSidebar={() =>
      (activeSidebar = activeSidebar ? null : 'explorer')}
    onToggleTerminal={() => (terminalOpen = !terminalOpen)}
    onOpenCommandPalette={() => (paletteOpen = true)}
  />

  <!-- Main Shell Layout (Activity Bar + Sidebar + Editor + Panel) -->
  <div class="vscode-body">
    <!-- Left Activity Bar -->
    <ActivityBar
      activeTab={activeSidebar}
      onSelectTab={(tab) =>
        (activeSidebar = activeSidebar === tab ? null : tab)}
      onOpenSettings={() => {
        settingsTab = 'settings';
        settingsOpen = true;
      }}
      onOpenThemes={() => {
        settingsTab = 'theme';
        settingsOpen = true;
      }}
    />

    <!-- Side Panel -->
    {#if activeSidebar}
      <aside class="vscode-sidebar">
        {#if activeSidebar === 'explorer'}
          <FileTree
            bind:this={fileTree}
            rootPath={workspacePath}
            onopenfile={openFile}
          />
        {:else if activeSidebar === 'search'}
          <SearchPanel
            rootPath={workspacePath}
            onselectmatch={(path, line) => {
              const fileName = path.split('/').pop() || 'file';
              openFile(path, fileName);
            }}
          />
        {:else if activeSidebar === 'git'}
          <div class="git-view">
            <div class="view-header">SOURCE CONTROL</div>
            <div class="git-status-box">
              <span class="branch-label">⑂ main</span>
              <p>Git repository connected and tracking changes.</p>
              <button
                class="git-commit-btn"
                onclick={() => (terminalOpen = true)}
              >
                Open Terminal to Commit
              </button>
            </div>
          </div>
        {:else if activeSidebar === 'debug'}
          <DebugView onStartDebug={() => (terminalOpen = true)} />
        {:else if activeSidebar === 'extensions'}
          <ExtensionsView />
        {/if}
      </aside>
    {/if}

    <!-- Center Editor Work Area -->
    <main class="vscode-editor-area">
      <!-- Tabs Bar -->
      <div class="vscode-tabs-bar">
        <div class="tabs-scroll">
          {#each tabs as tab}
            <div
              class={`tab-entry ${tab.id === activeTabId ? 'active' : ''}`}
              onclick={() => (activeTabId = tab.id)}
              role="button"
              tabindex="0"
              onkeydown={(e) => {
                if (e.key === 'Enter') activeTabId = tab.id;
              }}
            >
              <span class="tab-title">{tab.title}</span>
              {#if tab.isDirty}
                <span class="dirty-dot" title="Unsaved changes">●</span>
              {/if}
              <button
                class="tab-close"
                title="Close (Ctrl+W)"
                onclick={(e) => closeTab(tab.id, e)}
              >
                ✕
              </button>
            </div>
          {/each}
        </div>
        <button
          class="add-tab-btn"
          title="New Untitled File (Ctrl+N)"
          onclick={createUntitledTab}
        >
          +
        </button>
      </div>

      <!-- Breadcrumbs Bar -->
      {#if activeTab}
        <Breadcrumbs filePath={activeTab.path} />
      {/if}

      <!-- Code Editor Surface -->
      <section class="editor-viewport">
        {#if activeTab}
          <Editor
            filePath={activeTab.path}
            content={activeTab.content}
            onchange={handleEditorChange}
            onsave={saveActiveFile}
            oncursorchange={handleCursorChange}
          />
        {:else}
          <!-- VS Code Welcome Screen -->
          <div class="vscode-welcome-screen">
            <div class="welcome-container">
              <h1 class="welcome-logo">
                <img src="/thulir.png" alt="Thulir" width="44" height="44" style="border-radius: 8px; object-fit: contain;" />
                <span>Thulir IDE</span>
              </h1>
              <p class="welcome-tagline">
                Lightweight VS Code alternative &bull; Native Rust Core &bull; Sub-80MB RAM
              </p>

              <div class="welcome-shortcuts-grid">
                <div class="welcome-card">
                  <h3>Start</h3>
                  <button class="welcome-link" onclick={createUntitledTab}>
                    <span>New File...</span>
                    <kbd>Ctrl+N</kbd>
                  </button>
                  <button
                    class="welcome-link"
                    onclick={() => (paletteOpen = true)}
                  >
                    <span>Command Palette...</span>
                    <kbd>Ctrl+P</kbd>
                  </button>
                  <button
                    class="welcome-link"
                    onclick={() => {
                      settingsTab = 'theme';
                      settingsOpen = true;
                    }}
                  >
                    <span>Color Theme...</span>
                    <kbd>Ctrl+K Ctrl+T</kbd>
                  </button>
                  <button
                    class="welcome-link"
                    onclick={() => (shortcutsOpen = true)}
                  >
                    <span>Keyboard Shortcuts...</span>
                    <kbd>Ctrl+K Ctrl+S</kbd>
                  </button>
                  <button
                    class="welcome-link"
                    onclick={() => (terminalOpen = !terminalOpen)}
                  >
                    <span>Toggle Terminal</span>
                    <kbd>Ctrl+`</kbd>
                  </button>
                </div>

                <div class="welcome-card">
                  <h3>Recent</h3>
                  {#each tabs as tab}
                    <button
                      class="welcome-link"
                      onclick={() => (activeTabId = tab.id)}
                    >
                      <span>{tab.title}</span>
                    </button>
                  {/each}
                  {#if tabs.length === 0}
                    <span class="no-recent">No open files</span>
                  {/if}
                </div>
              </div>
            </div>
          </div>
        {/if}
      </section>

      <!-- Bottom Dockable Panel -->
      {#if terminalOpen}
        <div class="panel-dock">
          <BottomPanel
            cwd={workspacePath}
            onClose={() => (terminalOpen = false)}
          />
        </div>
      {/if}
    </main>
  </div>

  <!-- Bottom Status Bar -->
  <StatusBar
    cursorLine={activeTab?.cursorLine || cursorLine}
    cursorCol={activeTab?.cursorCol || cursorCol}
    language={activeTab?.language || 'Plain Text'}
    isDirty={activeTab?.isDirty || false}
    {terminalOpen}
    onToggleTerminal={() => (terminalOpen = !terminalOpen)}
  />

  <!-- Command Palette Modal -->
  <CommandPalette
    isOpen={paletteOpen}
    {tabs}
    onclose={() => (paletteOpen = false)}
    onselecttab={(id) => (activeTabId = id)}
    onruncommand={handleMenuAction}
  />

  <!-- Settings & Theme Modal -->
  <SettingsModal
    isOpen={settingsOpen}
    activeTab={settingsTab}
    onClose={() => (settingsOpen = false)}
  />

  <!-- Keyboard Shortcuts Modal -->
  <ShortcutsModal
    isOpen={shortcutsOpen}
    onClose={() => (shortcutsOpen = false)}
  />
</div>

<style>
  .vscode-app-window {
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
    background-color: var(--vscode-editor-bg, #1e1e1e);
    color: var(--vscode-editor-fg, #cccccc);
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  .vscode-body {
    flex: 1;
    display: flex;
    overflow: hidden;
    position: relative;
  }

  /* Side Bar */
  .vscode-sidebar {
    width: 250px;
    height: 100%;
    background-color: var(--vscode-sideBar-bg, #252526);
    border-right: 1px solid var(--vscode-sideBar-border, #2d2d2d);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .git-view {
    display: flex;
    flex-direction: column;
    height: 100%;
    font-size: 12px;
  }

  .view-header {
    padding: 10px 16px;
    font-size: 11px;
    font-weight: 700;
    color: var(--vscode-sideBar-fg, #bbbbbb);
    letter-spacing: 0.5px;
    border-bottom: 1px solid var(--vscode-sideBar-border, #2d2d2d);
  }

  .git-status-box {
    padding: 16px;
    color: var(--vscode-sideBar-fg, #858585);
  }

  .branch-label {
    display: inline-block;
    color: #ffffff;
    font-weight: 600;
    margin-bottom: 8px;
    background-color: rgba(255, 255, 255, 0.1);
    padding: 2px 8px;
    border-radius: 3px;
  }

  .git-commit-btn {
    margin-top: 12px;
    background-color: var(--vscode-tab-activeBorder, #007acc);
    color: #ffffff;
    border: none;
    padding: 6px 12px;
    border-radius: 2px;
    font-size: 12px;
    cursor: pointer;
  }

  /* Center Editor Work Area */
  .vscode-editor-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    background-color: var(--vscode-editor-bg, #1e1e1e);
  }

  /* Tabs Bar */
  .vscode-tabs-bar {
    display: flex;
    align-items: center;
    height: 35px;
    background-color: var(--vscode-sideBar-bg, #252526);
    user-select: none;
    border-bottom: 1px solid var(--vscode-sideBar-border, #252526);
  }

  .tabs-scroll {
    display: flex;
    height: 100%;
    overflow-x: auto;
  }

  .tab-entry {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 14px;
    height: 100%;
    background-color: var(--vscode-tab-inactiveBg, #2d2d2d);
    border-right: 1px solid var(--vscode-sideBar-border, #252526);
    font-size: 12px;
    color: var(--vscode-tab-inactiveFg, #969696);
    cursor: pointer;
    white-space: nowrap;
    transition: background-color 0.1s, color 0.1s;
  }

  .tab-entry:hover {
    background-color: rgba(255, 255, 255, 0.08);
    color: #ffffff;
  }

  .tab-entry.active {
    background-color: var(--vscode-tab-activeBg, #1e1e1e);
    color: var(--vscode-tab-activeFg, #ffffff);
    border-top: 2px solid var(--vscode-tab-activeBorder, #007acc);
  }

  .tab-title {
    max-width: 140px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .dirty-dot {
    color: #ffffff;
    font-size: 9px;
  }

  .tab-close {
    background: none;
    border: none;
    color: var(--vscode-sideBar-fg, #858585);
    cursor: pointer;
    font-size: 10px;
    padding: 2px;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .tab-close:hover {
    background-color: rgba(255, 255, 255, 0.15);
    color: #ffffff;
  }

  .add-tab-btn {
    background: none;
    border: none;
    color: var(--vscode-sideBar-fg, #858585);
    padding: 0 10px;
    height: 100%;
    cursor: pointer;
    font-size: 16px;
  }

  .add-tab-btn:hover {
    color: #ffffff;
  }

  /* Editor Surface */
  .editor-viewport {
    flex: 1;
    overflow: hidden;
    position: relative;
    background-color: var(--vscode-editor-bg, #1e1e1e);
  }

  /* Welcome Screen */
  .vscode-welcome-screen {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    background-color: var(--vscode-editor-bg, #1e1e1e);
    user-select: none;
  }

  .welcome-container {
    max-width: 580px;
    width: 100%;
    padding: 30px;
  }

  .welcome-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 28px;
    font-weight: 600;
    color: #ffffff;
    margin: 0 0 8px 0;
  }

  .welcome-tagline {
    font-size: 13px;
    color: #858585;
    margin-bottom: 28px;
  }

  .welcome-shortcuts-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }

  .welcome-card h3 {
    font-size: 13px;
    font-weight: 600;
    color: var(--vscode-sideBar-fg, #cccccc);
    margin: 0 0 12px 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .welcome-link {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    background: none;
    border: none;
    color: var(--vscode-tab-activeBorder, #007acc);
    padding: 6px 0;
    cursor: pointer;
    font-size: 13px;
    font-family: inherit;
    text-align: left;
  }

  .welcome-link:hover {
    text-decoration: underline;
  }

  .welcome-link kbd {
    background-color: rgba(255, 255, 255, 0.08);
    border: 1px solid var(--vscode-sideBar-border, #3c3c3c);
    color: #cccccc;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 11px;
  }

  .no-recent {
    color: #666666;
    font-size: 12px;
    font-style: italic;
  }

  /* Bottom Dockable Panel */
  .panel-dock {
    height: 240px;
    border-top: 1px solid var(--vscode-panel-border, #2d2d2d);
  }
</style>

<script lang="ts">
  interface Props {
    cursorLine?: number;
    cursorCol?: number;
    language?: string;
    isDirty?: boolean;
    onToggleTerminal: () => void;
    terminalOpen: boolean;
  }

  let {
    cursorLine = 1,
    cursorCol = 1,
    language = 'Plain Text',
    isDirty = false,
    onToggleTerminal,
    terminalOpen,
  }: Props = $props();
</script>

<footer class="vscode-statusbar">
  <!-- Left Status Items -->
  <div class="status-left">
    <!-- Remote/Workspace green/blue tag -->
    <button class="status-btn remote-btn" title="Open a Remote Window">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
        <path d="M4.5 11.5L1 8l3.5-3.5L5.2 5.2 2.4 8l2.8 2.8-.7.7zm7 0L15 8l-3.5-3.5-.7.7 2.8 2.8-2.8 2.8.7.7zM6.5 13h1L10 3H9L6.5 13z"/>
      </svg>
    </button>

    <!-- Git Branch -->
    <button class="status-btn git-btn" title="Git Branch: main">
      <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
        <path d="M11.75 8a1.75 1.75 0 1 0-1.5 0v.5a2.25 2.25 0 0 1-2.25 2.25h-.5v-4.5a1.75 1.75 0 1 0-1.5 0v6.5a1.75 1.75 0 1 0 1.5 0v-.5h.5A3.75 3.75 0 0 0 11.75 9V8z"/>
      </svg>
      <span>main{isDirty ? '*' : ''}</span>
    </button>

    <!-- Git Sync -->
    <button class="status-btn" title="Synchronize Changes: 0 down, 0 up">
      <span>↻ 0↓ 0↑</span>
    </button>

    <!-- Errors and Warnings -->
    <button class="status-btn errors-btn" title="0 Errors, 0 Warnings">
      <span class="error-icon">⊗ 0</span>
      <span class="warn-icon">⚠ 0</span>
    </button>
  </div>

  <!-- Right Status Items -->
  <div class="status-right">
    <button class="status-btn" title="Go to Line/Column">
      Ln {cursorLine}, Col {cursorCol}
    </button>

    <button class="status-btn" title="Select Indentation">
      Spaces: 2
    </button>

    <button class="status-btn" title="Select Encoding">
      UTF-8
    </button>

    <button class="status-btn" title="Select End of Line Sequence">
      LF
    </button>

    <button class="status-btn language-btn" title="Select Language Mode">
      {language}
    </button>

    <button
      class={`status-btn ${terminalOpen ? 'active' : ''}`}
      onclick={onToggleTerminal}
      title="Toggle Terminal"
    >
      <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
        <path d="M2 3h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm0 1v5h12V4H2zm0 6v2h12v-2H2z"/>
      </svg>
    </button>

    <button class="status-btn bell-btn" title="Notifications">
      <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 1.5A3.5 3.5 0 0 0 4.5 5v2.293L3.146 8.646A.5.5 0 0 0 3.5 9.5h9a.5.5 0 0 0 .354-.854L11.5 7.293V5A3.5 3.5 0 0 0 8 1.5zM7 12a1 1 0 0 0 2 0H7z"/>
      </svg>
    </button>
  </div>
</footer>

<style>
  .vscode-statusbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 22px;
    background-color: var(--vscode-statusBar-bg, #007acc);
    color: var(--vscode-statusBar-fg, #ffffff);
    font-size: 11px;
    user-select: none;
    padding: 0;
    z-index: 100;
  }

  .status-left,
  .status-right {
    display: flex;
    align-items: center;
    height: 100%;
  }

  .status-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    height: 100%;
    padding: 0 8px;
    background: none;
    border: none;
    color: #ffffff;
    font-size: 11px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    cursor: pointer;
    line-height: 1;
  }

  .status-btn:hover {
    background-color: rgba(255, 255, 255, 0.15);
  }

  .remote-btn {
    background-color: #16825d;
    padding: 0 10px;
  }

  .remote-btn:hover {
    background-color: #1b9b6e;
  }

  .errors-btn {
    display: flex;
    gap: 8px;
  }

  .language-btn {
    font-weight: 500;
  }
</style>

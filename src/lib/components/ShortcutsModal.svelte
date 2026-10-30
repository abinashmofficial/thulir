<script lang="ts">
  import {
    getShortcuts,
    saveShortcut,
    resetShortcuts,
    type ShortcutBinding,
  } from '$lib/services/shortcuts';

  interface Props {
    isOpen: boolean;
    onClose: () => void;
  }

  let { isOpen, onClose }: Props = $props();

  let shortcuts: ShortcutBinding[] = $state([]);
  let searchQuery = $state('');
  let editingShortcut: ShortcutBinding | null = $state(null);
  let recordedKeys = $state('');

  function load() {
    shortcuts = getShortcuts();
  }

  $effect(() => {
    if (isOpen) {
      load();
      searchQuery = '';
      editingShortcut = null;
    }
  });

  let filtered = $derived(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return shortcuts;
    return shortcuts.filter(
      (s) =>
        s.command.toLowerCase().includes(q) ||
        s.keybinding.toLowerCase().includes(q)
    );
  });

  function startEdit(s: ShortcutBinding) {
    editingShortcut = s;
    recordedKeys = s.keybinding;
  }

  function handleRecordKeydown(e: KeyboardEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (e.key === 'Enter') {
      if (editingShortcut && recordedKeys) {
        shortcuts = saveShortcut(editingShortcut.id, recordedKeys);
        editingShortcut = null;
      }
      return;
    }

    if (e.key === 'Escape') {
      editingShortcut = null;
      return;
    }

    const parts: string[] = [];
    if (e.ctrlKey) parts.push('Ctrl');
    if (e.shiftKey) parts.push('Shift');
    if (e.altKey) parts.push('Alt');
    if (e.metaKey) parts.push('Meta');

    const key = e.key.toUpperCase();
    if (!['CONTROL', 'SHIFT', 'ALT', 'META'].includes(key)) {
      parts.push(key);
      recordedKeys = parts.join('+');
    }
  }

  function handleReset() {
    if (confirm('Reset all keyboard shortcuts to default?')) {
      shortcuts = resetShortcuts();
    }
  }
</script>

{#if isOpen}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div class="shortcuts-backdrop" onclick={onClose} role="presentation">
    <div
      class="shortcuts-modal"
      onclick={(e) => e.stopPropagation()}
      role="dialog"
      tabindex="-1"
    >
      <div class="modal-header">
        <div class="header-title">
          <span>⌨️ Keyboard Shortcuts</span>
        </div>
        <div class="header-actions">
          <button class="reset-btn" onclick={handleReset} title="Reset to defaults">
            Reset All
          </button>
          <button class="close-btn" onclick={onClose}>✕</button>
        </div>
      </div>

      <div class="search-bar">
        <input
          type="text"
          placeholder="Type to search in keybindings..."
          bind:value={searchQuery}
        />
      </div>

      <div class="table-container">
        <table class="shortcuts-table">
          <thead>
            <tr>
              <th>Command</th>
              <th>Keybinding</th>
              <th>Source</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {#each filtered() as s}
              <tr ondblclick={() => startEdit(s)}>
                <td class="col-command">{s.command}</td>
                <td class="col-key">
                  <kbd>{s.keybinding}</kbd>
                </td>
                <td class="col-source">{s.source}</td>
                <td class="col-actions">
                  <button class="edit-btn" onclick={() => startEdit(s)}>
                    Edit
                  </button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <!-- Key Recording Dialog -->
      {#if editingShortcut}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <div
          class="record-dialog-backdrop"
          onclick={() => (editingShortcut = null)}
          role="presentation"
        >
          <div
            class="record-dialog"
            onclick={(e) => e.stopPropagation()}
            role="dialog"
            tabindex="-1"
          >
            <h3>Press Desired Key Combination</h3>
            <p class="record-desc">
              Change keybinding for: <strong>{editingShortcut.command}</strong>
            </p>

            <div
              class="recording-box"
              tabindex="0"
              onkeydown={handleRecordKeydown}
              role="textbox"
              aria-label="Press key combination"
            >
              <span class="recorded-keys">{recordedKeys || 'Press keys...'}</span>
            </div>

            <div class="dialog-hint">
              Press <strong>ENTER</strong> to save or <strong>ESC</strong> to cancel.
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .shortcuts-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 3500;
  }

  .shortcuts-modal {
    width: 720px;
    height: 520px;
    background-color: var(--vscode-sideBar-bg, #252526);
    border: 1px solid var(--vscode-sideBar-border, #454545);
    border-radius: 6px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    font-size: 13px;
    color: var(--vscode-sideBar-fg, #cccccc);
    position: relative;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 16px;
    background-color: var(--vscode-titleBar-bg, #1e1e1e);
    border-bottom: 1px solid var(--vscode-sideBar-border, #333333);
  }

  .header-title {
    font-size: 13px;
    font-weight: 600;
    color: #ffffff;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .reset-btn {
    background: none;
    border: 1px solid var(--vscode-sideBar-border, #454545);
    color: var(--vscode-sideBar-fg, #858585);
    padding: 3px 8px;
    border-radius: 3px;
    font-size: 11px;
    cursor: pointer;
  }

  .reset-btn:hover {
    color: #ffffff;
    border-color: #007acc;
  }

  .close-btn {
    background: none;
    border: none;
    color: #858585;
    font-size: 14px;
    cursor: pointer;
  }

  .close-btn:hover {
    color: #ffffff;
  }

  .search-bar {
    padding: 10px 16px;
    background-color: var(--vscode-sideBar-bg, #252526);
    border-bottom: 1px solid var(--vscode-sideBar-border, #333333);
  }

  .search-bar input {
    width: 100%;
    background-color: var(--vscode-input-bg, #3c3c3c);
    border: 1px solid var(--vscode-input-border, #3c3c3c);
    color: #ffffff;
    padding: 6px 10px;
    border-radius: 3px;
    font-size: 12.5px;
    outline: none;
  }

  .search-bar input:focus {
    border-color: var(--vscode-tab-activeBorder, #007acc);
  }

  .table-container {
    flex: 1;
    overflow-y: auto;
  }

  .shortcuts-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12.5px;
  }

  .shortcuts-table th {
    text-align: left;
    padding: 8px 16px;
    background-color: var(--vscode-titleBar-bg, #1e1e1e);
    border-bottom: 1px solid var(--vscode-sideBar-border, #333333);
    color: #bbbbbb;
    font-size: 11px;
    font-weight: 600;
  }

  .shortcuts-table td {
    padding: 8px 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .shortcuts-table tr:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }

  .col-command {
    color: #ffffff;
    font-weight: 500;
  }

  .col-key kbd {
    background-color: var(--vscode-tab-inactiveBg, #2b2b2b);
    border: 1px solid var(--vscode-sideBar-border, #3c3c3c);
    color: var(--vscode-tab-activeBorder, #007acc);
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 11.5px;
    font-family: inherit;
  }

  .col-source {
    color: #858585;
    font-size: 11px;
  }

  .edit-btn {
    background: none;
    border: 1px solid var(--vscode-sideBar-border, #454545);
    color: var(--vscode-sideBar-fg, #858585);
    padding: 2px 6px;
    border-radius: 2px;
    font-size: 11px;
    cursor: pointer;
  }

  .edit-btn:hover {
    color: #ffffff;
    border-color: #007acc;
  }

  /* Record Dialog */
  .record-dialog-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
  }

  .record-dialog {
    background-color: var(--vscode-titleBar-bg, #1e1e1e);
    border: 1px solid var(--vscode-tab-activeBorder, #007acc);
    border-radius: 6px;
    padding: 20px 24px;
    width: 440px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    text-align: center;
  }

  .record-dialog h3 {
    margin: 0 0 6px 0;
    color: #ffffff;
    font-size: 14px;
  }

  .record-desc {
    color: #858585;
    font-size: 12px;
    margin-bottom: 16px;
  }

  .recording-box {
    background-color: var(--vscode-input-bg, #2b2b2b);
    border: 2px dashed var(--vscode-tab-activeBorder, #007acc);
    padding: 16px;
    border-radius: 4px;
    margin-bottom: 12px;
    cursor: pointer;
    outline: none;
  }

  .recorded-keys {
    font-size: 16px;
    font-weight: bold;
    color: #ffffff;
  }

  .dialog-hint {
    font-size: 11px;
    color: #858585;
  }
</style>

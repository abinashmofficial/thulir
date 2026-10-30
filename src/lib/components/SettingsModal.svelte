<script lang="ts">
  import { THEMES, applyTheme, getSavedTheme } from '$lib/services/themes';

  interface Props {
    isOpen: boolean;
    activeTab: 'settings' | 'theme';
    onClose: () => void;
  }

  let { isOpen, activeTab, onClose }: Props = $props();

  let tab = $state('settings');
  let fontSize = $state('13.5');
  let tabSize = $state('2');
  let wordWrap = $state('on');
  let currentThemeId = $state('dark-plus');

  const themes = Object.values(THEMES);

  $effect(() => {
    if (isOpen) {
      tab = activeTab;
      currentThemeId = getSavedTheme();
    }
  });

  function handleSelectTheme(themeId: string) {
    currentThemeId = themeId;
    applyTheme(themeId);
  }
</script>

{#if isOpen}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div class="modal-backdrop" onclick={onClose} role="presentation">
    <div
      class="settings-modal"
      onclick={(e) => e.stopPropagation()}
      role="dialog"
      tabindex="-1"
    >
      <div class="modal-header">
        <div class="modal-tabs">
          <button
            class={`tab-btn ${tab === 'settings' ? 'active' : ''}`}
            onclick={() => (tab = 'settings')}
          >
            Settings
          </button>
          <button
            class={`tab-btn ${tab === 'theme' ? 'active' : ''}`}
            onclick={() => (tab = 'theme')}
          >
            Color Theme
          </button>
        </div>
        <button class="close-btn" onclick={onClose}>✕</button>
      </div>

      <div class="modal-body">
        {#if tab === 'settings'}
          <div class="setting-group">
            <label for="font-size-input">Editor: Font Size</label>
            <span class="setting-desc"
              >Controls the font size in pixels for the code editor.</span
            >
            <input
              id="font-size-input"
              type="number"
              bind:value={fontSize}
              class="setting-input"
            />
          </div>

          <div class="setting-group">
            <label for="tab-size-select">Editor: Tab Size</label>
            <span class="setting-desc"
              >The number of spaces a tab is equal to.</span
            >
            <select id="tab-size-select" bind:value={tabSize} class="setting-input">
              <option value="2">2</option>
              <option value="4">4</option>
              <option value="8">8</option>
            </select>
          </div>

          <div class="setting-group">
            <label for="word-wrap-select">Editor: Word Wrap</label>
            <span class="setting-desc"
              >Controls how lines should wrap in the editor.</span
            >
            <select id="word-wrap-select" bind:value={wordWrap} class="setting-input">
              <option value="off">off</option>
              <option value="on">on</option>
              <option value="wordWrapColumn">wordWrapColumn</option>
            </select>
          </div>
        {:else}
          <div class="theme-list">
            {#each themes as t}
              <button
                class={`theme-option ${currentThemeId === t.id ? 'selected' : ''}`}
                onclick={() => handleSelectTheme(t.id)}
              >
                <div class="theme-info">
                  <span class="theme-name">{t.name}</span>
                  <span class="theme-type">{t.type} theme</span>
                </div>
                <div class="color-preview-dots">
                  <span class="dot" style={`background-color: ${t.editorBg}`} title="Editor Background"></span>
                  <span class="dot" style={`background-color: ${t.activityBarBg}`} title="Activity Bar"></span>
                  <span class="dot" style={`background-color: ${t.statusBarBg}`} title="Status Bar"></span>
                  <span class="dot" style={`background-color: ${t.tabActiveBorder}`} title="Accent Color"></span>
                  {#if currentThemeId === t.id}
                    <span class="check-mark">✓</span>
                  {/if}
                </div>
              </button>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 3000;
  }

  .settings-modal {
    width: 600px;
    max-height: 520px;
    background-color: var(--vscode-sideBar-bg, #252526);
    border: 1px solid var(--vscode-sideBar-border, #454545);
    border-radius: 6px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    font-size: 13px;
    color: var(--vscode-sideBar-fg, #cccccc);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--vscode-sideBar-border, #333333);
    padding: 0 16px;
    background-color: var(--vscode-titleBar-bg, #1e1e1e);
  }

  .modal-tabs {
    display: flex;
    gap: 16px;
  }

  .tab-btn {
    background: none;
    border: none;
    color: #969696;
    font-size: 13px;
    padding: 12px 4px;
    cursor: pointer;
    position: relative;
    font-family: inherit;
  }

  .tab-btn.active {
    color: #ffffff;
    font-weight: 600;
  }

  .tab-btn.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: var(--vscode-tab-activeBorder, #007acc);
  }

  .close-btn {
    background: none;
    border: none;
    color: #858585;
    font-size: 14px;
    cursor: pointer;
    padding: 4px;
  }

  .close-btn:hover {
    color: #ffffff;
  }

  .modal-body {
    padding: 20px 24px;
    overflow-y: auto;
  }

  .setting-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 20px;
  }

  .setting-group label {
    font-weight: 600;
    color: #ffffff;
  }

  .setting-desc {
    color: #858585;
    font-size: 12px;
  }

  .setting-input {
    background-color: var(--vscode-input-bg, #3c3c3c);
    border: 1px solid var(--vscode-input-border, #3c3c3c);
    color: #ffffff;
    padding: 6px 10px;
    border-radius: 3px;
    max-width: 240px;
    font-size: 13px;
    outline: none;
  }

  .setting-input:focus {
    border-color: var(--vscode-tab-activeBorder, #007acc);
  }

  .theme-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .theme-option {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--vscode-tab-inactiveBg, #2d2d2d);
    border: 1px solid transparent;
    color: var(--vscode-sideBar-fg, #cccccc);
    padding: 10px 16px;
    border-radius: 4px;
    cursor: pointer;
    text-align: left;
    font-family: inherit;
    transition: background-color 0.15s;
  }

  .theme-option:hover {
    background-color: rgba(255, 255, 255, 0.08);
  }

  .theme-option.selected {
    border-color: var(--vscode-tab-activeBorder, #007acc);
    background-color: rgba(0, 122, 204, 0.2);
    color: #ffffff;
  }

  .theme-info {
    display: flex;
    flex-direction: column;
  }

  .theme-name {
    font-size: 13px;
    font-weight: 600;
  }

  .theme-type {
    font-size: 11px;
    color: #858585;
    text-transform: capitalize;
  }

  .color-preview-dots {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .check-mark {
    color: var(--vscode-tab-activeBorder, #007acc);
    font-weight: bold;
    margin-left: 6px;
  }
</style>

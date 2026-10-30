<script lang="ts">
  import type { SidebarTab } from '$lib/types';

  interface Props {
    activeTab: SidebarTab | 'debug' | 'extensions' | null;
    onSelectTab: (tab: SidebarTab | 'debug' | 'extensions') => void;
    onOpenSettings: () => void;
    onOpenThemes: () => void;
  }

  let { activeTab, onSelectTab, onOpenSettings, onOpenThemes }: Props = $props();

  let gearMenuOpen = $state(false);

  function toggleGearMenu(e: MouseEvent) {
    e.stopPropagation();
    gearMenuOpen = !gearMenuOpen;
  }

  function closeGear() {
    gearMenuOpen = false;
  }
</script>

<svelte:window onclick={closeGear} />

<aside class="vscode-activity-bar">
  <!-- Top Viewlet Icons -->
  <div class="viewlet-icons">
    <!-- Explorer -->
    <button
      class={`viewlet-btn ${activeTab === 'explorer' ? 'active' : ''}`}
      title="Explorer (Ctrl+Shift+E)"
      onclick={() => onSelectTab('explorer')}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 4h7l2 2h7a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zm0 2v12h16V8h-7.414l-2-2H4z"/>
      </svg>
    </button>

    <!-- Search -->
    <button
      class={`viewlet-btn ${activeTab === 'search' ? 'active' : ''}`}
      title="Search (Ctrl+Shift+F)"
      onclick={() => onSelectTab('search')}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
      </svg>
    </button>

    <!-- Source Control (Git) -->
    <button
      class={`viewlet-btn ${activeTab === 'git' ? 'active' : ''}`}
      title="Source Control (Ctrl+Shift+G)"
      onclick={() => onSelectTab('git')}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 12c-1.3 0-2.4.8-2.8 2H9.8c-.4-.6-1-1-1.8-1V8.8c.6-.4 1-1 1-1.8 0-1.7-1.3-3-3-3s-3 1.3-3 3c0 .8.4 1.4 1 1.8V15.2c-.6.4-1 1-1 1.8 0 1.7 1.3 3 3 3s3-1.3 3-3c0-.8-.4-1.4-1-1.8V16h4.2c.4 1.2 1.5 2 2.8 2 1.7 0 3-1.3 3-3s-1.3-3-3-3zm-11-7c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zm0 13c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm11 0c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z"/>
      </svg>
      <span class="activity-badge">1</span>
    </button>

    <!-- Run & Debug -->
    <button
      class={`viewlet-btn ${activeTab === 'debug' ? 'active' : ''}`}
      title="Run and Debug (Ctrl+Shift+D)"
      onclick={() => onSelectTab('debug')}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 4l15 8-15 8V4z"/>
      </svg>
    </button>

    <!-- Extensions -->
    <button
      class={`viewlet-btn ${activeTab === 'extensions' ? 'active' : ''}`}
      title="Extensions (Ctrl+Shift+X)"
      onclick={() => onSelectTab('extensions')}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5a2.5 2.5 0 0 0-5 0V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7s2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5a2.5 2.5 0 0 0 0-5z"/>
      </svg>
    </button>
  </div>

  <!-- Bottom Global Actions (Accounts & Manage Gear) -->
  <div class="bottom-actions">
    <!-- Accounts -->
    <button class="viewlet-btn" title="Accounts">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
      </svg>
    </button>

    <!-- Manage / Settings Gear -->
    <div class="gear-wrapper">
      <button
        class={`viewlet-btn ${gearMenuOpen ? 'active' : ''}`}
        title="Manage"
        onclick={toggleGearMenu}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
        </svg>
      </button>

      {#if gearMenuOpen}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <div class="gear-dropdown" onclick={(e) => e.stopPropagation()} role="menu">
          <button class="gear-item" onclick={() => { gearMenuOpen = false; onOpenSettings(); }}>
            <span>Settings</span>
            <span class="shortcut">Ctrl+,</span>
          </button>
          <button class="gear-item" onclick={() => { gearMenuOpen = false; onOpenThemes(); }}>
            <span>Color Theme</span>
            <span class="shortcut">Ctrl+K Ctrl+T</span>
          </button>
          <div class="gear-separator"></div>
          <button class="gear-item" onclick={() => { gearMenuOpen = false; }}>
            <span>Check for Updates...</span>
          </button>
        </div>
      {/if}
    </div>
  </div>
</aside>

<style>
  .vscode-activity-bar {
    width: 48px;
    height: 100%;
    background-color: var(--vscode-activityBar-bg, #333333);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    user-select: none;
    z-index: 50;
    border-right: 1px solid var(--vscode-sideBar-border, #252526);
  }

  .viewlet-icons,
  .bottom-actions {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
  }

  .viewlet-btn {
    width: 48px;
    height: 48px;
    background: none;
    border: none;
    color: var(--vscode-activityBar-fg, #858585);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    position: relative;
    padding: 0;
    transition: color 0.1s ease;
  }

  .viewlet-btn:hover {
    color: #ffffff;
  }

  .viewlet-btn.active {
    color: #ffffff;
  }

  .viewlet-btn.active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background-color: var(--vscode-activityBar-activeBorder, #ffffff);
  }

  .activity-badge {
    position: absolute;
    bottom: 8px;
    right: 8px;
    background-color: var(--vscode-tab-activeBorder, #007acc);
    color: #ffffff;
    font-size: 9px;
    font-weight: 700;
    padding: 1px 4px;
    border-radius: 9px;
    line-height: 1;
  }

  .gear-wrapper {
    position: relative;
  }

  .gear-dropdown {
    position: absolute;
    bottom: 10px;
    left: 48px;
    min-width: 210px;
    background-color: #252526;
    border: 1px solid #454545;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    padding: 4px 0;
    z-index: 2000;
  }

  .gear-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    background: none;
    border: none;
    color: #cccccc;
    padding: 6px 14px;
    font-size: 12px;
    text-align: left;
    cursor: pointer;
    font-family: inherit;
  }

  .gear-item:hover {
    background-color: #04395e;
    color: #ffffff;
  }

  .gear-item .shortcut {
    color: #858585;
    font-size: 11px;
    margin-left: 12px;
  }

  .gear-item:hover .shortcut {
    color: #ffffff;
  }

  .gear-separator {
    height: 1px;
    background-color: #454545;
    margin: 4px 0;
  }
</style>

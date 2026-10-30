<script lang="ts">
  interface Props {
    title: string;
    onMenuAction: (action: string) => void;
    onToggleSidebar: () => void;
    onToggleTerminal: () => void;
    onOpenCommandPalette: () => void;
  }

  let {
    title,
    onMenuAction,
    onToggleSidebar,
    onToggleTerminal,
    onOpenCommandPalette,
  }: Props = $props();

  let activeMenu: string | null = $state(null);

  const menus = [
    {
      id: 'file',
      label: 'File',
      items: [
        { id: 'new_file', label: 'New File', shortcut: 'Ctrl+N' },
        { id: 'new_folder', label: 'New Folder', shortcut: '' },
        { type: 'separator' },
        { id: 'save_file', label: 'Save', shortcut: 'Ctrl+S' },
        { id: 'save_all', label: 'Save All', shortcut: 'Ctrl+K S' },
        { type: 'separator' },
        { id: 'close_tab', label: 'Close Editor', shortcut: 'Ctrl+W' },
        { id: 'close_all', label: 'Close All Editors', shortcut: 'Ctrl+K W' },
      ],
    },
    {
      id: 'edit',
      label: 'Edit',
      items: [
        { id: 'undo', label: 'Undo', shortcut: 'Ctrl+Z' },
        { id: 'redo', label: 'Redo', shortcut: 'Ctrl+Y' },
        { type: 'separator' },
        { id: 'cut', label: 'Cut', shortcut: 'Ctrl+X' },
        { id: 'copy', label: 'Copy', shortcut: 'Ctrl+C' },
        { id: 'paste', label: 'Paste', shortcut: 'Ctrl+V' },
        { type: 'separator' },
        { id: 'find', label: 'Find in Files', shortcut: 'Ctrl+Shift+F' },
      ],
    },
    {
      id: 'selection',
      label: 'Selection',
      items: [
        { id: 'select_all', label: 'Select All', shortcut: 'Ctrl+A' },
        { id: 'expand_selection', label: 'Expand Selection', shortcut: 'Alt+Shift+Right' },
      ],
    },
    {
      id: 'view',
      label: 'View',
      items: [
        { id: 'command_palette', label: 'Command Palette...', shortcut: 'Ctrl+Shift+P' },
        { id: 'toggle_explorer', label: 'Explorer', shortcut: 'Ctrl+Shift+E' },
        { id: 'toggle_search', label: 'Search', shortcut: 'Ctrl+Shift+F' },
        { id: 'toggle_git', label: 'Source Control', shortcut: 'Ctrl+Shift+G' },
        { id: 'toggle_terminal', label: 'Terminal', shortcut: 'Ctrl+`' },
      ],
    },
    {
      id: 'go',
      label: 'Go',
      items: [
        { id: 'go_to_file', label: 'Go to File...', shortcut: 'Ctrl+P' },
        { id: 'go_to_line', label: 'Go to Line/Column...', shortcut: 'Ctrl+G' },
      ],
    },
    {
      id: 'run',
      label: 'Run',
      items: [
        { id: 'start_debugging', label: 'Start Debugging', shortcut: 'F5' },
        { id: 'run_without_debugging', label: 'Run Without Debugging', shortcut: 'Ctrl+F5' },
      ],
    },
    {
      id: 'terminal',
      label: 'Terminal',
      items: [
        { id: 'new_terminal', label: 'New Terminal', shortcut: 'Ctrl+Shift+`' },
        { id: 'toggle_terminal', label: 'Toggle Terminal', shortcut: 'Ctrl+`' },
      ],
    },
    {
      id: 'help',
      label: 'Help',
      items: [
        { id: 'welcome', label: 'Welcome Page', shortcut: '' },
        { id: 'shortcuts', label: 'Keyboard Shortcuts', shortcut: 'Ctrl+K Ctrl+S' },
        { type: 'separator' },
        { id: 'about', label: 'About Thulir IDE', shortcut: '' },
      ],
    },
  ];

  function toggleDropdown(menuId: string, e: MouseEvent) {
    e.stopPropagation();
    activeMenu = activeMenu === menuId ? null : menuId;
  }

  function handleItemClick(itemId: string) {
    activeMenu = null;
    onMenuAction(itemId);
  }

  function closeMenu() {
    activeMenu = null;
  }
</script>

<svelte:window onclick={closeMenu} />

<header class="vscode-titlebar">
  <!-- Left: Window / App Brand & Menu list -->
  <div class="titlebar-left">
    <div class="app-icon" title="Thulir IDE">
      <img src="/thulir.png" alt="Thulir" width="20" height="20" style="border-radius: 4px; object-fit: contain;" />
    </div>

    <nav class="menu-nav">
      {#each menus as menu}
        <div class="menu-container">
          <button
            class={`menu-button ${activeMenu === menu.id ? 'active' : ''}`}
            onclick={(e) => toggleDropdown(menu.id, e)}
            onmouseenter={() => {
              if (activeMenu !== null) activeMenu = menu.id;
            }}
          >
            {menu.label}
          </button>

          {#if activeMenu === menu.id}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <div class="menu-dropdown" onclick={(e) => e.stopPropagation()} role="menu">
              {#each menu.items as item}
                {#if item.type === 'separator'}
                  <div class="menu-separator"></div>
                {:else}
                  <button
                    class="menu-dropdown-item"
                    onclick={() => handleItemClick(item.id || '')}
                  >
                    <span class="item-label">{item.label}</span>
                    {#if item.shortcut}
                      <span class="item-shortcut">{item.shortcut}</span>
                    {/if}
                  </button>
                {/if}
              {/each}
            </div>
          {/if}
        </div>
      {/each}
    </nav>
  </div>

  <!-- Center: Command Palette / Search pill -->
  <div class="titlebar-center">
    <button class="search-command-pill" onclick={onOpenCommandPalette}>
      <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
      </svg>
      <span class="title-text">{title || 'thulir'}</span>
      <kbd class="shortcut-tag">Ctrl+P</kbd>
    </button>
  </div>

  <!-- Right: Window / Layout Control Toggles -->
  <div class="titlebar-right">
    <button
      class="layout-tool-btn"
      title="Toggle Primary Side Bar (Ctrl+B)"
      onclick={onToggleSidebar}
    >
      <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
        <path d="M2 3h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm4 1H2v8h4V4zm1 8h7V4H7v8z"/>
      </svg>
    </button>
    <button
      class="layout-tool-btn"
      title="Toggle Panel (Ctrl+`)"
      onclick={onToggleTerminal}
    >
      <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
        <path d="M2 3h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm0 1v5h12V4H2zm0 6v2h12v-2H2z"/>
      </svg>
    </button>
  </div>
</header>

<style>
  .vscode-titlebar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 35px;
    background-color: var(--vscode-titleBar-bg, #323233);
    border-bottom: 1px solid var(--vscode-sideBar-border, #252526);
    color: var(--vscode-titleBar-fg, #cccccc);
    font-size: 12px;
    user-select: none;
    padding: 0 8px;
    position: relative;
    z-index: 100;
  }

  .titlebar-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .app-icon {
    display: flex;
    align-items: center;
    margin-right: 4px;
    cursor: pointer;
  }

  .menu-nav {
    display: flex;
    align-items: center;
  }

  .menu-container {
    position: relative;
  }

  .menu-button {
    background: none;
    border: none;
    color: #cccccc;
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  .menu-button:hover,
  .menu-button.active {
    background-color: #454545;
    color: #ffffff;
  }

  .menu-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    min-width: 230px;
    background-color: var(--vscode-sideBar-bg, #252526);
    border: 1px solid var(--vscode-sideBar-border, #454545);
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    padding: 4px 0;
    margin-top: 4px;
    z-index: 2000;
  }

  .menu-dropdown-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    background: none;
    border: none;
    color: #cccccc;
    padding: 5px 16px;
    font-size: 12px;
    text-align: left;
    cursor: pointer;
    font-family: inherit;
  }

  .menu-dropdown-item:hover {
    background-color: #04395e;
    color: #ffffff;
  }

  .item-shortcut {
    color: #858585;
    font-size: 11px;
    margin-left: 16px;
  }

  .menu-dropdown-item:hover .item-shortcut {
    color: #ffffff;
  }

  .menu-separator {
    height: 1px;
    background-color: #454545;
    margin: 4px 8px;
  }

  /* Center search pill */
  .titlebar-center {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    max-width: 500px;
    width: 38%;
  }

  .search-command-pill {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #3c3c3c;
    border: 1px solid #454545;
    border-radius: 6px;
    color: #cccccc;
    padding: 3px 10px;
    cursor: pointer;
    font-family: inherit;
    font-size: 12px;
    transition: border-color 0.15s, background-color 0.15s;
  }

  .search-command-pill:hover {
    background-color: #414141;
    border-color: #007acc;
  }

  .title-text {
    flex: 1;
    margin: 0 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
    color: #cccccc;
  }

  .shortcut-tag {
    background-color: #2b2b2b;
    border: 1px solid #454545;
    color: #969696;
    padding: 1px 5px;
    border-radius: 3px;
    font-size: 10px;
  }

  .titlebar-right {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .layout-tool-btn {
    background: none;
    border: none;
    color: #858585;
    padding: 4px 6px;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .layout-tool-btn:hover {
    background-color: #454545;
    color: #ffffff;
  }
</style>

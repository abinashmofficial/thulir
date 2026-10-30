<script lang="ts">
  import type { EditorTab } from '$lib/types';

  interface Props {
    isOpen: boolean;
    tabs: EditorTab[];
    onclose: () => void;
    onselecttab: (id: string) => void;
    onruncommand: (commandId: string) => void;
  }

  let { isOpen, tabs, onclose, onselecttab, onruncommand }: Props = $props();

  let query = $state('');
  let selectedIndex = $state(0);

  const builtInCommands = [
    { id: 'new_file', title: 'File: New File', icon: '📄' },
    { id: 'save_file', title: 'File: Save Current File', icon: '💾' },
    { id: 'close_tab', title: 'View: Close Current Tab', icon: '✕' },
    { id: 'toggle_terminal', title: 'Terminal: Toggle Integrated Terminal', icon: '⌨️' },
    { id: 'toggle_search', title: 'Search: Find in Files', icon: '🔍' },
    { id: 'reload_workspace', title: 'Developer: Reload Workspace Explorer', icon: '🔄' },
  ];

  let filteredItems = $derived(() => {
    const q = query.trim().toLowerCase();
    const tabItems = tabs.map((t) => ({
      type: 'tab' as const,
      id: t.id,
      title: t.title,
      subtitle: t.path,
      icon: '📝',
    }));

    const cmdItems = builtInCommands.map((c) => ({
      type: 'command' as const,
      id: c.id,
      title: c.title,
      subtitle: 'Command',
      icon: c.icon,
    }));

    const all = [...tabItems, ...cmdItems];
    if (!q) return all;
    return all.filter((item) =>
      item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q)
    );
  });

  function handleSelect(item: { type: 'tab' | 'command'; id: string }) {
    if (item.type === 'tab') {
      onselecttab(item.id);
    } else {
      onruncommand(item.id);
    }
    onclose();
  }

  function handleKeydown(e: KeyboardEvent) {
    const items = filteredItems();
    if (e.key === 'Escape') {
      onclose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % Math.max(1, items.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + items.length) % Math.max(1, items.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (items[selectedIndex]) {
        handleSelect(items[selectedIndex]);
      }
    }
  }

  $effect(() => {
    if (isOpen) {
      query = '';
      selectedIndex = 0;
    }
  });
</script>

{#if isOpen}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div class="palette-backdrop" onclick={onclose} role="presentation">
    <div
      class="palette-modal"
      onclick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      tabindex="-1"
    >
      <div class="input-wrapper">
        <span class="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Type a file name or command..."
          bind:value={query}
          onkeydown={handleKeydown}
          autofocus
        />
      </div>

      <div class="results-list">
        {#each filteredItems() as item, idx}
          <button
            class={`palette-item ${idx === selectedIndex ? 'selected' : ''}`}
            onclick={() => handleSelect(item)}
            onmouseenter={() => (selectedIndex = idx)}
          >
            <span class="item-icon">{item.icon}</span>
            <div class="item-details">
              <span class="item-title">{item.title}</span>
              <span class="item-sub">{item.subtitle}</span>
            </div>
          </button>
        {/each}
        {#if filteredItems().length === 0}
          <div class="no-results">No matching files or commands</div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .palette-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    padding-top: 60px;
    z-index: 1000;
  }

  .palette-modal {
    width: 580px;
    max-height: 420px;
    background-color: #21252b;
    border: 1px solid #3b4048;
    border-radius: 6px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .input-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    background-color: #1e1e1e;
    border-bottom: 1px solid #282c34;
  }

  .search-icon {
    font-size: 14px;
  }

  .input-wrapper input {
    flex: 1;
    background: none;
    border: none;
    color: #fff;
    font-size: 14px;
    outline: none;
    font-family: inherit;
  }

  .results-list {
    flex: 1;
    overflow-y: auto;
    padding: 6px 0;
  }

  .palette-item {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 8px 14px;
    background: none;
    border: none;
    color: #abb2bf;
    cursor: pointer;
    text-align: left;
    font-family: inherit;
  }

  .palette-item.selected {
    background-color: #282c34;
    color: #fff;
  }

  .item-icon {
    font-size: 14px;
  }

  .item-details {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .item-title {
    font-size: 13px;
    font-weight: 500;
  }

  .item-sub {
    font-size: 11px;
    color: #5c6370;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .palette-item.selected .item-sub {
    color: #828997;
  }

  .no-results {
    padding: 16px;
    text-align: center;
    color: #5c6370;
    font-size: 13px;
  }
</style>

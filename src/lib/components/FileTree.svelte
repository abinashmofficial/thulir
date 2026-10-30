<script lang="ts">
  import type { FileNode } from '$lib/types';
  import { listDirectory, createFile, createDirectory, deletePath } from '$lib/services/api';

  interface Props {
    rootPath: string;
    onopenfile: (path: string, name: string) => void;
  }

  let { rootPath, onopenfile }: Props = $props();

  let nodes: FileNode[] = $state([]);
  let expandedDirs: Record<string, boolean> = $state({});
  let subNodes: Record<string, FileNode[]> = $state({});
  let loading: boolean = $state(false);

  // New item modal/inline state
  let isCreating: 'file' | 'folder' | null = $state(null);
  let newItemName = $state('');
  let targetParentPath = $state('');

  export async function loadRoot() {
    loading = true;
    try {
      nodes = await listDirectory(rootPath);
    } catch (e) {
      console.error('Failed to load directory', e);
    } finally {
      loading = false;
    }
  }

  async function toggleDir(dirPath: string) {
    if (expandedDirs[dirPath]) {
      expandedDirs[dirPath] = false;
    } else {
      expandedDirs[dirPath] = true;
      if (!subNodes[dirPath]) {
        try {
          subNodes[dirPath] = await listDirectory(dirPath);
        } catch (e) {
          console.error('Failed to load sub directory', e);
        }
      }
    }
  }

  function startCreate(type: 'file' | 'folder', parentPath: string) {
    isCreating = type;
    targetParentPath = parentPath;
    newItemName = '';
  }

  async function submitCreate() {
    if (!newItemName.trim()) {
      isCreating = null;
      return;
    }
    const fullPath = targetParentPath
      ? `${targetParentPath}/${newItemName.trim()}`
      : `${rootPath}/${newItemName.trim()}`;

    try {
      if (isCreating === 'file') {
        await createFile(fullPath);
        onopenfile(fullPath, newItemName.trim());
      } else {
        await createDirectory(fullPath);
      }
      if (targetParentPath && expandedDirs[targetParentPath]) {
        subNodes[targetParentPath] = await listDirectory(targetParentPath);
      } else {
        await loadRoot();
      }
    } catch (e) {
      alert(`Error creating ${isCreating}: ${e}`);
    } finally {
      isCreating = null;
      newItemName = '';
    }
  }

  async function handleDelete(path: string, name: string) {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await deletePath(path);
        await loadRoot();
      } catch (e) {
        alert(`Error deleting: ${e}`);
      }
    }
  }

  function getFileIcon(name: string, isDir: boolean, isExpanded: boolean) {
    if (isDir) {
      return isExpanded ? '📂' : '📁';
    }
    const ext = name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'rs':
        return '🦀';
      case 'ts':
      case 'tsx':
        return '🟦';
      case 'js':
      case 'jsx':
      case 'mjs':
        return '🟨';
      case 'py':
        return '🐍';
      case 'html':
      case 'svelte':
        return '🌐';
      case 'css':
      case 'scss':
        return '🎨';
      case 'json':
        return '📋';
      case 'md':
        return '📝';
      case 'toml':
      case 'yaml':
      case 'yml':
        return '⚙️';
      case 'svg':
      case 'png':
      case 'jpg':
        return '🖼️';
      default:
        return '📄';
    }
  }

  $effect(() => {
    if (rootPath) {
      loadRoot();
    }
  });
</script>

<div class="file-tree-container">
  <!-- Explorer Header -->
  <div class="tree-header">
    <span class="view-title">EXPLORER</span>
  </div>

  <!-- Workspace Section Title with Actions -->
  <div class="workspace-section-bar">
    <div class="ws-left" title={rootPath}>
      <span class="caret">▾</span>
      <span class="workspace-name">{rootPath.split('/').pop() || 'WORKSPACE'}</span>
    </div>
    <div class="header-actions">
      <!-- New File icon -->
      <button
        class="icon-btn"
        title="New File..."
        onclick={() => startCreate('file', rootPath)}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
          <path d="M9 1H3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V6L9 1zm4 13H3V2h5v5h5v7zM11 9H9V7H8v2H6v1h2v2h1v-2h2V9z"/>
        </svg>
      </button>

      <!-- New Folder icon -->
      <button
        class="icon-btn"
        title="New Folder..."
        onclick={() => startCreate('folder', rootPath)}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
          <path d="M7.25 2L8.5 4H14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h5.25zM2 3v10h12V5H8.05L6.8 3H2zm7 4h1v2h2v1h-2v2H9v-2H7V9h2V7z"/>
        </svg>
      </button>

      <!-- Refresh icon -->
      <button class="icon-btn" title="Refresh Explorer" onclick={loadRoot}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
          <path d="M13.65 2.35A7.958 7.958 0 0 0 8 0a8 8 0 1 0 8 8h-2a6 6 0 1 1-1.76-4.24l-2.48 2.48H16V0l-2.35 2.35z"/>
        </svg>
      </button>
    </div>
  </div>

  {#if isCreating && targetParentPath === rootPath}
    <div class="inline-creator">
      <span class="icon">{isCreating === 'file' ? '📄' : '📁'}</span>
      <input
        type="text"
        placeholder={`New ${isCreating} name...`}
        bind:value={newItemName}
        onkeydown={(e) => {
          if (e.key === 'Enter') submitCreate();
          if (e.key === 'Escape') isCreating = null;
        }}
      />
    </div>
  {/if}

  <div class="tree-content">
    {#if loading && nodes.length === 0}
      <div class="empty-hint">Loading files...</div>
    {:else if nodes.length === 0}
      <div class="empty-hint">Workspace is empty</div>
    {:else}
      {#each nodes as node}
        <div class="tree-row">
          {#if node.is_dir}
            <button
              class="tree-item dir-item"
              onclick={() => toggleDir(node.path)}
            >
              <span class="expand-caret">{expandedDirs[node.path] ? '▾' : '▸'}</span>
              <span class="icon">{getFileIcon(node.name, true, !!expandedDirs[node.path])}</span>
              <span class="label">{node.name}</span>
            </button>
            <div class="row-actions">
              <button
                class="mini-btn"
                title="New file inside folder"
                onclick={() => startCreate('file', node.path)}>+</button
              >
              <button
                class="mini-btn delete-btn"
                title="Delete folder"
                onclick={() => handleDelete(node.path, node.name)}>✕</button
              >
            </div>
          {:else}
            <button
              class="tree-item file-item"
              onclick={() => onopenfile(node.path, node.name)}
            >
              <span class="expand-spacer"></span>
              <span class="icon">{getFileIcon(node.name, false, false)}</span>
              <span class="label">{node.name}</span>
            </button>
            <div class="row-actions">
              <button
                class="mini-btn delete-btn"
                title="Delete file"
                onclick={() => handleDelete(node.path, node.name)}>✕</button
              >
            </div>
          {/if}
        </div>

        {#if node.is_dir && expandedDirs[node.path]}
          <div class="sub-tree">
            {#if isCreating && targetParentPath === node.path}
              <div class="inline-creator sub-creator">
                <span class="icon">{isCreating === 'file' ? '📄' : '📁'}</span>
                <input
                  type="text"
                  placeholder={`New ${isCreating}...`}
                  bind:value={newItemName}
                  onkeydown={(e) => {
                    if (e.key === 'Enter') submitCreate();
                    if (e.key === 'Escape') isCreating = null;
                  }}
                />
              </div>
            {/if}

            {#if subNodes[node.path]}
              {#each subNodes[node.path] as subNode}
                <div class="tree-row sub-row">
                  {#if subNode.is_dir}
                    <button
                      class="tree-item dir-item"
                      onclick={() => toggleDir(subNode.path)}
                    >
                      <span class="expand-caret"
                        >{expandedDirs[subNode.path] ? '▾' : '▸'}</span
                      >
                      <span class="icon"
                        >{getFileIcon(
                          subNode.name,
                          true,
                          !!expandedDirs[subNode.path]
                        )}</span
                      >
                      <span class="label">{subNode.name}</span>
                    </button>
                  {:else}
                    <button
                      class="tree-item file-item"
                      onclick={() => onopenfile(subNode.path, subNode.name)}
                    >
                      <span class="expand-spacer"></span>
                      <span class="icon"
                        >{getFileIcon(subNode.name, false, false)}</span
                      >
                      <span class="label">{subNode.name}</span>
                    </button>
                  {/if}
                  <div class="row-actions">
                    <button
                      class="mini-btn delete-btn"
                      title="Delete"
                      onclick={() => handleDelete(subNode.path, subNode.name)}
                      >✕</button
                    >
                  </div>
                </div>
              {/each}
            {/if}
          </div>
        {/if}
      {/each}
    {/if}
  </div>
</div>

<style>
  .file-tree-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: #252526;
    user-select: none;
    font-size: 13px;
    color: #cccccc;
  }

  .tree-header {
    padding: 10px 16px;
    border-bottom: 1px solid #2d2d2d;
  }

  .view-title {
    font-size: 11px;
    font-weight: 700;
    color: #bbbbbb;
    letter-spacing: 0.5px;
  }

  .workspace-section-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 12px;
    background-color: #252526;
    font-size: 11px;
    font-weight: 700;
    color: #bbbbbb;
    border-bottom: 1px solid #2d2d2d;
  }

  .ws-left {
    display: flex;
    align-items: center;
    gap: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .caret {
    font-size: 11px;
    color: #bbbbbb;
  }

  .workspace-name {
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .header-actions {
    display: flex;
    gap: 4px;
  }

  .icon-btn {
    background: none;
    border: none;
    color: #858585;
    cursor: pointer;
    padding: 2px 4px;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon-btn:hover {
    background-color: #37373d;
    color: #ffffff;
  }

  .tree-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 4px 0;
  }

  .empty-hint {
    padding: 20px;
    color: #858585;
    text-align: center;
    font-style: italic;
  }

  .tree-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 3px 8px 3px 12px;
    position: relative;
    cursor: pointer;
  }

  .tree-row:hover {
    background-color: #2a2d2e;
  }

  .tree-row:hover .row-actions {
    opacity: 1;
  }

  .tree-item {
    display: flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: none;
    color: inherit;
    font-family: inherit;
    font-size: 13px;
    text-align: left;
    width: 100%;
    cursor: pointer;
    padding: 0;
    overflow: hidden;
  }

  .expand-caret {
    display: inline-block;
    width: 12px;
    color: #bbbbbb;
    font-size: 11px;
  }

  .expand-spacer {
    display: inline-block;
    width: 12px;
  }

  .icon {
    font-size: 13px;
  }

  .label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #cccccc;
  }

  .tree-row:hover .label {
    color: #ffffff;
  }

  .sub-tree {
    padding-left: 12px;
  }

  .row-actions {
    display: flex;
    gap: 4px;
    opacity: 0;
    transition: opacity 0.15s;
  }

  .mini-btn {
    background: none;
    border: none;
    color: #858585;
    cursor: pointer;
    font-size: 11px;
    padding: 1px 4px;
    border-radius: 2px;
  }

  .mini-btn:hover {
    background-color: #37373d;
    color: #ffffff;
  }

  .delete-btn:hover {
    color: #f14c4c;
  }

  .inline-creator {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    background-color: #37373d;
  }

  .inline-creator input {
    background-color: #3c3c3c;
    border: 1px solid #007acc;
    color: #ffffff;
    font-size: 12px;
    padding: 2px 6px;
    border-radius: 2px;
    width: 100%;
    outline: none;
  }
</style>

<script lang="ts">
  interface Extension {
    id: string;
    name: string;
    publisher: string;
    description: string;
    version: string;
    downloads: string;
    installed: boolean;
    icon: string;
  }

  let extensions: Extension[] = $state([
    {
      id: 'rust-analyzer',
      name: 'rust-analyzer',
      publisher: 'rust-lang',
      description: 'Rust language support for Thulir & VS Code',
      version: 'v0.4.2',
      downloads: '4.8M',
      installed: true,
      icon: '🦀',
    },
    {
      id: 'python',
      name: 'Python',
      publisher: 'ms-python',
      description: 'IntelliSense, linting, debugging, code formatting',
      version: 'v2024.18',
      downloads: '110M',
      installed: true,
      icon: '🐍',
    },
    {
      id: 'prettier',
      name: 'Prettier - Code formatter',
      publisher: 'esbenp',
      description: 'Code formatter using prettier',
      version: 'v10.4',
      downloads: '42M',
      installed: false,
      icon: '✨',
    },
    {
      id: 'tailwind',
      name: 'Tailwind CSS IntelliSense',
      publisher: 'tailwindcss',
      description: 'Intelligent Tailwind CSS tooling for VS Code',
      version: 'v0.9',
      downloads: '15M',
      installed: false,
      icon: '🌊',
    },
    {
      id: 'gitlens',
      name: 'GitLens — Git supercharged',
      publisher: 'GitKraken',
      description: 'Supercharge Git within your editor',
      version: 'v15.2',
      downloads: '31M',
      installed: false,
      icon: '🔎',
    },
  ]);

  let searchQuery = $state('');

  let filtered = $derived(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return extensions;
    return extensions.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.publisher.toLowerCase().includes(q)
    );
  });

  function toggleInstall(ext: Extension) {
    ext.installed = !ext.installed;
  }
</script>

<div class="extensions-view">
  <div class="view-header">
    <span>EXTENSIONS</span>
  </div>

  <div class="search-box">
    <input
      type="text"
      placeholder="Search Extensions in Marketplace..."
      bind:value={searchQuery}
    />
  </div>

  <div class="ext-list">
    {#each filtered() as ext}
      <div class="ext-card">
        <div class="ext-icon">{ext.icon}</div>
        <div class="ext-info">
          <div class="ext-name-row">
            <span class="ext-name">{ext.name}</span>
            <span class="ext-version">{ext.version}</span>
          </div>
          <div class="ext-desc">{ext.description}</div>
          <div class="ext-meta">
            <span class="ext-publisher">{ext.publisher}</span>
            <span class="ext-downloads">⬇ {ext.downloads}</span>
          </div>
        </div>
        <div class="ext-action">
          <button
            class={`install-btn ${ext.installed ? 'installed' : ''}`}
            onclick={() => toggleInstall(ext)}
          >
            {ext.installed ? 'Disable' : 'Install'}
          </button>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .extensions-view {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: #252526;
    color: #cccccc;
    user-select: none;
    font-size: 12px;
  }

  .view-header {
    padding: 10px 16px;
    font-size: 11px;
    font-weight: 700;
    color: #bbbbbb;
    letter-spacing: 0.5px;
    border-bottom: 1px solid #2d2d2d;
  }

  .search-box {
    padding: 8px 12px;
    background-color: #252526;
    border-bottom: 1px solid #2d2d2d;
  }

  .search-box input {
    width: 100%;
    background-color: #3c3c3c;
    border: 1px solid #3c3c3c;
    color: #cccccc;
    padding: 5px 8px;
    border-radius: 3px;
    outline: none;
    font-size: 12px;
  }

  .search-box input:focus {
    border-color: #007acc;
  }

  .ext-list {
    flex: 1;
    overflow-y: auto;
  }

  .ext-card {
    display: flex;
    align-items: flex-start;
    padding: 10px 12px;
    border-bottom: 1px solid #2d2d2d;
    gap: 10px;
    cursor: pointer;
  }

  .ext-card:hover {
    background-color: #2a2d2e;
  }

  .ext-icon {
    font-size: 24px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ext-info {
    flex: 1;
    overflow: hidden;
  }

  .ext-name-row {
    display: flex;
    align-items: baseline;
    gap: 6px;
  }

  .ext-name {
    font-weight: 600;
    color: #ffffff;
    font-size: 12.5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ext-version {
    font-size: 10px;
    color: #858585;
  }

  .ext-desc {
    color: #969696;
    font-size: 11px;
    margin: 2px 0 4px 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .ext-meta {
    display: flex;
    gap: 8px;
    font-size: 10.5px;
    color: #858585;
  }

  .install-btn {
    background-color: #007acc;
    color: #ffffff;
    border: none;
    padding: 3px 8px;
    border-radius: 2px;
    font-size: 11px;
    cursor: pointer;
  }

  .install-btn.installed {
    background-color: #3c3c3c;
    color: #cccccc;
  }

  .install-btn:hover {
    opacity: 0.9;
  }
</style>

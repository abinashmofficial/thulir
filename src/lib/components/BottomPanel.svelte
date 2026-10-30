<script lang="ts">
  import TerminalPanel from '$lib/components/TerminalPanel.svelte';

  interface Props {
    cwd: string;
    onClose: () => void;
  }

  let { cwd, onClose }: Props = $props();

  type PanelTab = 'problems' | 'output' | 'debug' | 'terminal';
  let activeTab: PanelTab = $state('terminal');
</script>

<div class="vscode-bottom-panel">
  <!-- Panel Tab Header -->
  <div class="panel-tab-bar">
    <div class="tabs-left">
      <button
        class={`panel-tab ${activeTab === 'problems' ? 'active' : ''}`}
        onclick={() => (activeTab = 'problems')}
      >
        <span>PROBLEMS</span>
        <span class="tab-badge">0</span>
      </button>

      <button
        class={`panel-tab ${activeTab === 'output' ? 'active' : ''}`}
        onclick={() => (activeTab = 'output')}
      >
        <span>OUTPUT</span>
      </button>

      <button
        class={`panel-tab ${activeTab === 'debug' ? 'active' : ''}`}
        onclick={() => (activeTab = 'debug')}
      >
        <span>DEBUG CONSOLE</span>
      </button>

      <button
        class={`panel-tab ${activeTab === 'terminal' ? 'active' : ''}`}
        onclick={() => (activeTab = 'terminal')}
      >
        <span>TERMINAL</span>
        <span class="bash-tag">bash</span>
      </button>
    </div>

    <div class="tabs-right">
      <button class="panel-icon-btn" title="Close Panel" onclick={onClose}>
        ✕
      </button>
    </div>
  </div>

  <!-- Panel Body -->
  <div class="panel-content">
    {#if activeTab === 'terminal'}
      <TerminalPanel {cwd} onclose={onClose} />
    {:else if activeTab === 'problems'}
      <div class="empty-panel-msg">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#89d185">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
        <p>No problems have been detected in the workspace so far.</p>
      </div>
    {:else if activeTab === 'output'}
      <div class="output-console">
        <pre>[Thulir Task Runner] Workspace initialized at {cwd}
[LSP Engine] Ready for language server connections.
[Vite Bundler] HMR ready.</pre>
      </div>
    {:else if activeTab === 'debug'}
      <div class="output-console">
        <pre>[Debug Console] No active debugging sessions.</pre>
      </div>
    {/if}
  </div>
</div>

<style>
  .vscode-bottom-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: #1e1e1e;
    border-top: 1px solid #2d2d2d;
    user-select: none;
  }

  .panel-tab-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 32px;
    background-color: #1e1e1e;
    border-bottom: 1px solid #252526;
    padding: 0 12px;
  }

  .tabs-left {
    display: flex;
    gap: 16px;
    height: 100%;
  }

  .panel-tab {
    display: flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: none;
    color: #969696;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.5px;
    cursor: pointer;
    padding: 0 4px;
    height: 100%;
    position: relative;
    font-family: inherit;
  }

  .panel-tab:hover {
    color: #cccccc;
  }

  .panel-tab.active {
    color: #ffffff;
  }

  .panel-tab.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #ffffff;
  }

  .tab-badge {
    background-color: #2b2b2b;
    color: #969696;
    font-size: 9px;
    padding: 1px 5px;
    border-radius: 8px;
  }

  .bash-tag {
    background-color: #0e639c;
    color: #ffffff;
    font-size: 9px;
    padding: 1px 5px;
    border-radius: 3px;
  }

  .tabs-right {
    display: flex;
    gap: 6px;
  }

  .panel-icon-btn {
    background: none;
    border: none;
    color: #858585;
    cursor: pointer;
    font-size: 12px;
    padding: 2px 6px;
    border-radius: 3px;
  }

  .panel-icon-btn:hover {
    color: #ffffff;
    background-color: #313131;
  }

  .panel-content {
    flex: 1;
    overflow: hidden;
  }

  .empty-panel-msg {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #858585;
    font-size: 12px;
    gap: 8px;
  }

  .output-console {
    padding: 12px;
    font-family: 'JetBrains Mono', Menlo, Monaco, monospace;
    font-size: 12px;
    color: #cccccc;
    height: 100%;
    overflow-y: auto;
  }

  .output-console pre {
    margin: 0;
    line-height: 1.5;
  }
</style>

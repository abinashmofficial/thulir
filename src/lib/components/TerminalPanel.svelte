<script lang="ts">
  import { runTerminalCommand } from '$lib/services/api';

  interface Props {
    cwd: string;
    onclose: () => void;
  }

  let { cwd, onclose }: Props = $props();

  interface LogEntry {
    type: 'input' | 'output' | 'error' | 'system';
    text: string;
    time: string;
  }

  interface TerminalSession {
    id: number;
    title: string;
    logs: LogEntry[];
    currentCwd: string;
    history: string[];
    historyIndex: number;
  }

  let nextSessionId = 1;

  let sessions: TerminalSession[] = $state([
    {
      id: nextSessionId++,
      title: '1: bash',
      currentCwd: cwd || '/workspace',
      history: [],
      historyIndex: -1,
      logs: [
        {
          type: 'system',
          text: '🌱 Thulir Integrated Shell (bash) initialized.',
          time: new Date().toLocaleTimeString(),
        },
      ],
    },
  ]);

  let activeSessionId = $state(1);
  let commandInput = $state('');
  let isRunning = $state(false);
  let terminalBody: HTMLDivElement | null = $state(null);
  let inputElement: HTMLInputElement | null = $state(null);

  let activeSession = $derived(
    sessions.find((s) => s.id === activeSessionId) || sessions[0]
  );

  function scrollToBottom() {
    setTimeout(() => {
      if (terminalBody) {
        terminalBody.scrollTop = terminalBody.scrollHeight;
      }
    }, 40);
  }

  function addTerminalSession() {
    const id = nextSessionId++;
    const newSession: TerminalSession = {
      id,
      title: `${id}: bash`,
      currentCwd: activeSession?.currentCwd || cwd,
      history: [],
      historyIndex: -1,
      logs: [
        {
          type: 'system',
          text: `🌱 Terminal session ${id} started.`,
          time: new Date().toLocaleTimeString(),
        },
      ],
    };
    sessions = [...sessions, newSession];
    activeSessionId = id;
    focusInput();
  }

  function killSession(id: number) {
    if (sessions.length === 1) {
      // Clear logs instead of closing only terminal
      activeSession.logs = [
        {
          type: 'system',
          text: '🌱 Terminal reset.',
          time: new Date().toLocaleTimeString(),
        },
      ];
      return;
    }
    const idx = sessions.findIndex((s) => s.id === id);
    sessions = sessions.filter((s) => s.id !== id);
    if (activeSessionId === id) {
      activeSessionId = sessions[Math.max(0, idx - 1)].id;
    }
    focusInput();
  }

  function focusInput() {
    setTimeout(() => {
      inputElement?.focus();
    }, 50);
  }

  async function execute(cmdToRun?: string) {
    const cmd = (cmdToRun || commandInput).trim();
    if (!cmd) return;

    if (cmd === 'clear') {
      activeSession.logs = [];
      commandInput = '';
      return;
    }

    // Handle 'cd' locally
    if (cmd.startsWith('cd ')) {
      const target = cmd.slice(3).trim();
      activeSession.logs.push({
        type: 'input',
        text: `$ ${cmd}`,
        time: new Date().toLocaleTimeString(),
      });
      activeSession.history.push(cmd);
      activeSession.historyIndex = activeSession.history.length;
      commandInput = '';

      if (target === '..') {
        const parts = activeSession.currentCwd.split('/').filter(Boolean);
        parts.pop();
        activeSession.currentCwd = '/' + parts.join('/');
      } else if (target.startsWith('/')) {
        activeSession.currentCwd = target;
      } else {
        activeSession.currentCwd = `${activeSession.currentCwd}/${target}`;
      }
      scrollToBottom();
      return;
    }

    activeSession.logs.push({
      type: 'input',
      text: `$ ${cmd}`,
      time: new Date().toLocaleTimeString(),
    });

    activeSession.history.push(cmd);
    activeSession.historyIndex = activeSession.history.length;
    commandInput = '';
    isRunning = true;
    scrollToBottom();

    try {
      const res = await runTerminalCommand(cmd, activeSession.currentCwd);
      if (res.stdout) {
        activeSession.logs.push({
          type: 'output',
          text: res.stdout,
          time: new Date().toLocaleTimeString(),
        });
      }
      if (res.stderr) {
        activeSession.logs.push({
          type: 'error',
          text: res.stderr,
          time: new Date().toLocaleTimeString(),
        });
      }
      if (!res.stdout && !res.stderr && res.exit_code !== 0) {
        activeSession.logs.push({
          type: 'system',
          text: `[Process exited with code ${res.exit_code ?? 0}]`,
          time: new Date().toLocaleTimeString(),
        });
      }
    } catch (err) {
      activeSession.logs.push({
        type: 'error',
        text: `Error: ${err}`,
        time: new Date().toLocaleTimeString(),
      });
    } finally {
      isRunning = false;
      scrollToBottom();
      focusInput();
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      execute();
    } else if (e.key === 'ArrowUp') {
      if (activeSession.history.length > 0 && activeSession.historyIndex > 0) {
        activeSession.historyIndex--;
        commandInput = activeSession.history[activeSession.historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      if (activeSession.historyIndex < activeSession.history.length - 1) {
        activeSession.historyIndex++;
        commandInput = activeSession.history[activeSession.historyIndex];
      } else {
        activeSession.historyIndex = activeSession.history.length;
        commandInput = '';
      }
    }
  }
</script>

<div class="terminal-panel">
  <!-- Terminal Top Sub-bar -->
  <div class="terminal-top-bar">
    <div class="bar-left">
      <!-- Session Tabs -->
      <div class="session-tabs">
        {#each sessions as s}
          <button
            class={`session-chip ${s.id === activeSessionId ? 'active' : ''}`}
            onclick={() => {
              activeSessionId = s.id;
              focusInput();
            }}
          >
            <span>{s.title}</span>
          </button>
        {/each}
        <button
          class="add-session-btn"
          title="New Terminal"
          onclick={addTerminalSession}
        >
          +
        </button>
      </div>

      <span class="term-cwd" title={activeSession.currentCwd}>
        {activeSession.currentCwd.split('/').pop() || '/'}
      </span>
    </div>

    <div class="bar-right">
      <div class="quick-chips">
        <button class="chip" onclick={() => execute('git status')}>git status</button>
        <button class="chip" onclick={() => execute('ls -la')}>ls -la</button>
        <button class="chip" onclick={() => execute('cargo check')}>cargo check</button>
      </div>

      <button
        class="icon-action-btn"
        title="Clear Scrollback"
        onclick={() => (activeSession.logs = [])}
      >
        🧹
      </button>

      <button
        class="icon-action-btn trash-btn"
        title="Kill Terminal Session"
        onclick={() => killSession(activeSessionId)}
      >
        🗑️
      </button>

      <button
        class="icon-action-btn"
        title="Close Panel"
        onclick={onclose}
      >
        ✕
      </button>
    </div>
  </div>

  <!-- Terminal Body Log -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    class="terminal-log-body"
    bind:this={terminalBody}
    onclick={focusInput}
    role="region"
    aria-label="Terminal output"
  >
    {#each activeSession.logs as log}
      <div class={`log-row ${log.type}`}>
        <pre>{log.text}</pre>
      </div>
    {/each}
    {#if isRunning}
      <div class="log-row system">
        <span class="spinner">⚙</span> Running command...
      </div>
    {/if}
  </div>

  <!-- Prompt Input Line -->
  <div class="terminal-prompt-bar">
    <span class="prompt-user">thulir@linux</span>:<span class="prompt-path">{activeSession.currentCwd.split('/').pop() || '~'}</span><span class="prompt-char">$</span>
    <input
      type="text"
      placeholder="Type command..."
      bind:this={inputElement}
      bind:value={commandInput}
      onkeydown={handleKeydown}
      disabled={isRunning}
    />
  </div>
</div>

<style>
  .terminal-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: var(--vscode-editor-bg, #181a1f);
    font-family: 'JetBrains Mono', 'Fira Code', Menlo, Monaco, monospace;
    font-size: 12.5px;
    color: var(--vscode-editor-fg, #cccccc);
  }

  .terminal-top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 10px;
    background-color: var(--vscode-sideBar-bg, #21252b);
    border-bottom: 1px solid var(--vscode-panel-border, #181a1f);
    user-select: none;
    font-size: 11px;
  }

  .bar-left,
  .bar-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .session-tabs {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .session-chip {
    background: none;
    border: 1px solid transparent;
    color: var(--vscode-sideBar-fg, #858585);
    padding: 2px 8px;
    border-radius: 3px;
    cursor: pointer;
    font-size: 11px;
    font-family: inherit;
  }

  .session-chip:hover {
    background-color: rgba(255, 255, 255, 0.08);
    color: #ffffff;
  }

  .session-chip.active {
    background-color: var(--vscode-tab-activeBg, #1e1e1e);
    color: var(--vscode-tab-activeBorder, #007acc);
    border-color: var(--vscode-sideBar-border, #333333);
    font-weight: 600;
  }

  .add-session-btn {
    background: none;
    border: none;
    color: var(--vscode-sideBar-fg, #858585);
    font-size: 14px;
    cursor: pointer;
    padding: 0 4px;
  }

  .add-session-btn:hover {
    color: #ffffff;
  }

  .term-cwd {
    background-color: rgba(0, 122, 204, 0.15);
    color: var(--vscode-tab-activeBorder, #007acc);
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 10.5px;
  }

  .quick-chips {
    display: flex;
    gap: 4px;
  }

  .chip {
    background-color: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--vscode-sideBar-border, #333333);
    color: var(--vscode-sideBar-fg, #858585);
    padding: 2px 6px;
    border-radius: 3px;
    cursor: pointer;
    font-size: 10.5px;
    font-family: inherit;
  }

  .chip:hover {
    color: #ffffff;
    border-color: var(--vscode-tab-activeBorder, #007acc);
  }

  .icon-action-btn {
    background: none;
    border: none;
    color: var(--vscode-sideBar-fg, #858585);
    cursor: pointer;
    font-size: 12px;
    padding: 2px 4px;
    border-radius: 3px;
  }

  .icon-action-btn:hover {
    color: #ffffff;
    background-color: rgba(255, 255, 255, 0.1);
  }

  .trash-btn:hover {
    color: #f14c4c;
  }

  .terminal-log-body {
    flex: 1;
    overflow-y: auto;
    padding: 8px 12px;
    cursor: text;
  }

  .log-row {
    margin-bottom: 4px;
    line-height: 1.45;
  }

  .log-row pre {
    margin: 0;
    white-space: pre-wrap;
    word-break: break-all;
    font-family: inherit;
  }

  .log-row.input {
    color: var(--vscode-tab-activeBorder, #007acc);
    font-weight: 600;
  }

  .log-row.output {
    color: var(--vscode-editor-fg, #cccccc);
  }

  .log-row.error {
    color: #f14c4c;
  }

  .log-row.system {
    color: #777777;
    font-style: italic;
  }

  .terminal-prompt-bar {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 12px;
    background-color: var(--vscode-editor-bg, #1e1e1e);
    border-top: 1px solid var(--vscode-panel-border, #282c34);
  }

  .prompt-user {
    color: #98c379;
    font-weight: bold;
  }

  .prompt-path {
    color: #61afef;
  }

  .prompt-char {
    color: #ffffff;
    font-weight: bold;
  }

  .terminal-prompt-bar input {
    flex: 1;
    background: none;
    border: none;
    color: var(--vscode-editor-fg, #ffffff);
    font-family: inherit;
    font-size: 12.5px;
    outline: none;
    margin-left: 4px;
  }
</style>

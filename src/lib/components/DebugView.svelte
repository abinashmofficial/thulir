<script lang="ts">
  interface Props {
    onStartDebug: () => void;
  }

  let { onStartDebug }: Props = $props();
</script>

<div class="debug-view">
  <div class="view-header">
    <span>RUN AND DEBUG</span>
  </div>

  <div class="debug-content">
    <div class="run-box">
      <button class="primary-debug-btn" onclick={onStartDebug}>
        ▶ Run and Debug
      </button>
      <p class="debug-hint">
        To customize Run and Debug, create a <code>launch.json</code> file.
      </p>
    </div>

    <!-- Collapsible Sections -->
    <div class="debug-section">
      <div class="section-header">▾ VARIABLES</div>
      <div class="section-empty">No variables available</div>
    </div>

    <div class="debug-section">
      <div class="section-header">▾ WATCH</div>
      <div class="section-empty">No watch expressions</div>
    </div>

    <div class="debug-section">
      <div class="section-header">▾ CALL STACK</div>
      <div class="section-empty">Not debugging</div>
    </div>

    <div class="debug-section">
      <div class="section-header">▾ BREAKPOINTS</div>
      <div class="section-empty">No breakpoints</div>
    </div>
  </div>
</div>

<style>
  .debug-view {
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

  .debug-content {
    flex: 1;
    overflow-y: auto;
  }

  .run-box {
    padding: 16px;
    border-bottom: 1px solid #2d2d2d;
  }

  .primary-debug-btn {
    width: 100%;
    background-color: #007acc;
    color: #ffffff;
    border: none;
    padding: 8px 14px;
    border-radius: 3px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .primary-debug-btn:hover {
    background-color: #0062a3;
  }

  .debug-hint {
    color: #858585;
    font-size: 11px;
    margin-top: 10px;
    line-height: 1.4;
  }

  .debug-hint code {
    background-color: #333333;
    color: #9cdcfe;
    padding: 1px 4px;
    border-radius: 2px;
  }

  .debug-section {
    border-bottom: 1px solid #2d2d2d;
  }

  .section-header {
    padding: 6px 12px;
    font-size: 11px;
    font-weight: 700;
    color: #bbbbbb;
    cursor: pointer;
    background-color: #252526;
  }

  .section-header:hover {
    background-color: #2a2d2e;
  }

  .section-empty {
    padding: 8px 24px;
    font-size: 11px;
    color: #777777;
    font-style: italic;
  }
</style>

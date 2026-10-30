<script lang="ts">
  interface Props {
    filePath: string;
  }

  let { filePath }: Props = $props();

  let parts = $derived(() => {
    if (!filePath) return [];
    return filePath.split('/').filter(Boolean);
  });
</script>

{#if parts().length > 0}
  <div class="vscode-breadcrumbs">
    {#each parts() as part, index}
      <span class="crumb-segment">
        {#if index === parts().length - 1}
          <span class="crumb-icon">📄</span>
        {:else}
          <span class="crumb-icon">📁</span>
        {/if}
        <span class="crumb-text">{part}</span>
      </span>
      {#if index < parts().length - 1}
        <span class="crumb-separator">›</span>
      {/if}
    {/each}
  </div>
{/if}

<style>
  .vscode-breadcrumbs {
    display: flex;
    align-items: center;
    height: 22px;
    background-color: #1e1e1e;
    padding: 0 16px;
    font-size: 11.5px;
    color: #969696;
    user-select: none;
    border-bottom: 1px solid #252526;
  }

  .crumb-segment {
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    border-radius: 3px;
    padding: 1px 4px;
  }

  .crumb-segment:hover {
    background-color: #2a2d2e;
    color: #cccccc;
  }

  .crumb-icon {
    font-size: 11px;
  }

  .crumb-separator {
    margin: 0 4px;
    color: #6e6e6e;
    font-size: 13px;
    line-height: 1;
  }
</style>

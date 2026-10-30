<script lang="ts">
  import type { SearchResult } from '$lib/types';
  import { searchFiles } from '$lib/services/api';

  interface Props {
    rootPath: string;
    onselectmatch: (path: string, line: number) => void;
  }

  let { rootPath, onselectmatch }: Props = $props();

  let query = $state('');
  let results: SearchResult[] = $state([]);
  let searching = $state(false);
  let hasSearched = $state(false);

  async function handleSearch() {
    if (!query.trim()) {
      results = [];
      hasSearched = false;
      return;
    }
    searching = true;
    hasSearched = true;
    try {
      results = await searchFiles(rootPath, query.trim());
    } catch (e) {
      console.error('Search error', e);
      results = [];
    } finally {
      searching = false;
    }
  }
</script>

<div class="search-panel">
  <div class="panel-header">
    <span>SEARCH</span>
  </div>

  <div class="search-input-box">
    <div class="input-container">
      <input
        type="text"
        placeholder="Search (Enter to search)"
        bind:value={query}
        onkeydown={(e) => {
          if (e.key === 'Enter') handleSearch();
        }}
      />
      <div class="input-actions">
        <button class="filter-btn" title="Match Case (Alt+C)">Aa</button>
        <button class="filter-btn" title="Match Whole Word (Alt+W)">\b</button>
        <button class="filter-btn" title="Use Regular Expression (Alt+R)">.*</button>
      </div>
    </div>
  </div>

  <div class="results-container">
    {#if searching}
      <div class="status-msg">Searching across workspace...</div>
    {:else if hasSearched && results.length === 0}
      <div class="status-msg">No results found for "{query}"</div>
    {:else}
      {#if results.length > 0}
        <div class="count-tag">{results.length} results in {new Set(results.map(r => r.file_path)).size} files</div>
      {/if}
      {#each results as result}
        <button
          class="result-item"
          onclick={() => onselectmatch(result.file_path, result.line_number)}
        >
          <div class="file-line">
            <span class="file-name">{result.file_path.split('/').pop()}</span>
            <span class="line-badge">{result.line_number}</span>
          </div>
          <div class="snippet">{result.line_content}</div>
        </button>
      {/each}
    {/if}
  </div>
</div>

<style>
  .search-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: #252526;
    color: #cccccc;
    user-select: none;
    font-size: 12px;
  }

  .panel-header {
    padding: 10px 16px;
    border-bottom: 1px solid #2d2d2d;
    font-size: 11px;
    font-weight: 700;
    color: #bbbbbb;
    letter-spacing: 0.5px;
  }

  .search-input-box {
    padding: 8px 12px;
    border-bottom: 1px solid #2d2d2d;
  }

  .input-container {
    display: flex;
    align-items: center;
    background-color: #3c3c3c;
    border: 1px solid #3c3c3c;
    border-radius: 2px;
    padding-right: 4px;
  }

  .input-container:focus-within {
    border-color: #007acc;
  }

  .input-container input {
    flex: 1;
    background: none;
    border: none;
    color: #cccccc;
    padding: 5px 8px;
    font-size: 12px;
    outline: none;
  }

  .input-actions {
    display: flex;
    gap: 2px;
  }

  .filter-btn {
    background: none;
    border: none;
    color: #858585;
    font-size: 11px;
    font-family: monospace;
    padding: 2px 4px;
    border-radius: 2px;
    cursor: pointer;
  }

  .filter-btn:hover {
    color: #ffffff;
    background-color: #454545;
  }

  .results-container {
    flex: 1;
    overflow-y: auto;
    padding: 4px 0;
  }

  .status-msg {
    padding: 16px;
    color: #858585;
    text-align: center;
    font-style: italic;
  }

  .count-tag {
    padding: 6px 16px;
    font-size: 11px;
    color: #bbbbbb;
  }

  .result-item {
    display: block;
    width: 100%;
    background: none;
    border: none;
    text-align: left;
    padding: 6px 16px;
    cursor: pointer;
    border-bottom: 1px solid #2d2d2d;
    font-family: inherit;
  }

  .result-item:hover {
    background-color: #2a2d2e;
  }

  .file-line {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    margin-bottom: 2px;
  }

  .file-name {
    font-weight: 600;
    color: #ffffff;
  }

  .line-badge {
    color: #007acc;
    background-color: #1e1e1e;
    padding: 1px 4px;
    border-radius: 2px;
    font-size: 10px;
  }

  .snippet {
    font-family: monospace;
    font-size: 11.5px;
    color: #9cdcfe;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>

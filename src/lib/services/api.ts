import { invoke } from '@tauri-apps/api/core';
import type { FileNode, SearchResult, CommandResult } from '$lib/types';

export function isTauri(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean((window as unknown as { __TAURI_INTERNALS__?: unknown }).__TAURI_INTERNALS__);
}

export async function getCurrentWorkspace(): Promise<string> {
  if (isTauri()) {
    try {
      return await invoke<string>('get_current_workspace');
    } catch (e) {
      console.warn('Tauri get_current_workspace error:', e);
    }
  }

  try {
    const res = await fetch('/api/workspace');
    if (res.ok) {
      const data = await res.json();
      return data.path;
    }
  } catch {}
  return '/workspace';
}

export async function listDirectory(path: string): Promise<FileNode[]> {
  if (isTauri()) {
    try {
      return await invoke<FileNode[]>('list_directory', { path });
    } catch (e) {
      console.error('Tauri list_directory error:', e);
      throw e;
    }
  }

  const res = await fetch(`/api/list?path=${encodeURIComponent(path)}`);
  if (!res.ok) throw new Error('Failed to list directory');
  return await res.json();
}

export async function readFile(path: string): Promise<string> {
  if (isTauri()) {
    try {
      return await invoke<string>('read_file', { path });
    } catch (e) {
      console.error('Tauri read_file error:', e);
      throw e;
    }
  }

  const res = await fetch(`/api/read?path=${encodeURIComponent(path)}`);
  if (!res.ok) throw new Error(`Failed to read file: ${path}`);
  const data = await res.json();
  return data.content;
}

export async function writeFile(path: string, content: string): Promise<void> {
  if (isTauri()) {
    try {
      return await invoke<void>('write_file', { path, content });
    } catch (e) {
      console.error('Tauri write_file error:', e);
      throw e;
    }
  }

  const res = await fetch('/api/write', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path, content }),
  });
  if (!res.ok) throw new Error(`Failed to write file: ${path}`);
}

export async function createFile(path: string): Promise<void> {
  if (isTauri()) {
    try {
      return await invoke<void>('create_file', { path });
    } catch (e) {
      console.error('Tauri create_file error:', e);
      throw e;
    }
  }

  const res = await fetch('/api/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path, is_dir: false }),
  });
  if (!res.ok) throw new Error(`Failed to create file: ${path}`);
}

export async function createDirectory(path: string): Promise<void> {
  if (isTauri()) {
    try {
      return await invoke<void>('create_directory', { path });
    } catch (e) {
      console.error('Tauri create_directory error:', e);
      throw e;
    }
  }

  const res = await fetch('/api/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path, is_dir: true }),
  });
  if (!res.ok) throw new Error(`Failed to create directory: ${path}`);
}

export async function deletePath(path: string): Promise<void> {
  if (isTauri()) {
    try {
      return await invoke<void>('delete_path', { path });
    } catch (e) {
      console.error('Tauri delete_path error:', e);
      throw e;
    }
  }

  const res = await fetch('/api/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path }),
  });
  if (!res.ok) throw new Error(`Failed to delete path: ${path}`);
}

export async function searchFiles(root: string, query: string): Promise<SearchResult[]> {
  if (isTauri()) {
    try {
      return await invoke<SearchResult[]>('search_files', { root, query });
    } catch (e) {
      console.error('Tauri search_files error:', e);
      throw e;
    }
  }

  const res = await fetch(`/api/search?root=${encodeURIComponent(root)}&q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Failed to search files');
  return await res.json();
}

export async function runTerminalCommand(command: string, cwd?: string): Promise<CommandResult> {
  if (isTauri()) {
    try {
      return await invoke<CommandResult>('run_terminal_command', { command, cwd });
    } catch (e) {
      console.error('Tauri run_terminal_command error:', e);
      throw e;
    }
  }

  const res = await fetch('/api/exec', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ command, cwd }),
  });
  if (!res.ok) throw new Error('Failed to execute command');
  return await res.json();
}

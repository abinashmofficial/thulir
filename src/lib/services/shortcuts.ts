export interface ShortcutBinding {
  id: string;
  command: string;
  keybinding: string;
  source: 'Default' | 'User';
}

export const DEFAULT_SHORTCUTS: ShortcutBinding[] = [
  { id: 'save_file', command: 'File: Save', keybinding: 'Ctrl+S', source: 'Default' },
  { id: 'new_file', command: 'File: New File', keybinding: 'Ctrl+N', source: 'Default' },
  { id: 'close_tab', command: 'View: Close Editor', keybinding: 'Ctrl+W', source: 'Default' },
  { id: 'command_palette', command: 'View: Command Palette...', keybinding: 'Ctrl+P', source: 'Default' },
  { id: 'toggle_explorer', command: 'View: Toggle Primary Side Bar', keybinding: 'Ctrl+B', source: 'Default' },
  { id: 'toggle_terminal', command: 'View: Toggle Terminal', keybinding: 'Ctrl+`', source: 'Default' },
  { id: 'switch_theme', command: 'Preferences: Color Theme', keybinding: 'Ctrl+K Ctrl+T', source: 'Default' },
  { id: 'open_shortcuts', command: 'Preferences: Open Keyboard Shortcuts', keybinding: 'Ctrl+K Ctrl+S', source: 'Default' },
  { id: 'toggle_search', command: 'View: Show Search', keybinding: 'Ctrl+Shift+F', source: 'Default' },
  { id: 'toggle_git', command: 'View: Show Source Control', keybinding: 'Ctrl+Shift+G', source: 'Default' },
];

export function getShortcuts(): ShortcutBinding[] {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('thulir_shortcuts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
  }
  return [...DEFAULT_SHORTCUTS];
}

export function saveShortcut(id: string, newBinding: string): ShortcutBinding[] {
  const current = getShortcuts();
  const index = current.findIndex((s) => s.id === id);
  if (index !== -1) {
    current[index].keybinding = newBinding;
    current[index].source = 'User';
  }
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('thulir_shortcuts', JSON.stringify(current));
  }
  return current;
}

export function resetShortcuts(): ShortcutBinding[] {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('thulir_shortcuts');
  }
  return [...DEFAULT_SHORTCUTS];
}

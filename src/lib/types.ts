export interface FileNode {
  name: string;
  path: string;
  is_dir: boolean;
  size: number;
  children?: FileNode[];
  expanded?: boolean;
}

export interface EditorTab {
  id: string;
  title: string;
  path: string;
  content: string;
  originalContent: string;
  isDirty: boolean;
  language: string;
  cursorLine?: number;
  cursorCol?: number;
}

export interface SearchResult {
  file_path: string;
  line_number: number;
  line_content: string;
}

export interface CommandResult {
  success: boolean;
  exit_code?: number;
  stdout: string;
  stderr: string;
}

export type SidebarTab = 'explorer' | 'search' | 'git' | 'settings';

export interface ThemeColors {
  id: string;
  name: string;
  type: 'dark' | 'light';
  editorBg: string;
  editorFg: string;
  activityBarBg: string;
  activityBarFg: string;
  activityBarActiveBorder: string;
  sideBarBg: string;
  sideBarFg: string;
  sideBarBorder: string;
  titleBarBg: string;
  titleBarFg: string;
  statusBarBg: string;
  statusBarFg: string;
  tabActiveBg: string;
  tabActiveFg: string;
  tabActiveBorder: string;
  tabInactiveBg: string;
  tabInactiveFg: string;
  panelBg: string;
  panelBorder: string;
  inputBg: string;
  inputBorder: string;
}

export const THEMES: Record<string, ThemeColors> = {
  'dark-plus': {
    id: 'dark-plus',
    name: 'Dark+ (default dark)',
    type: 'dark',
    editorBg: '#1e1e1e',
    editorFg: '#d4d4d4',
    activityBarBg: '#333333',
    activityBarFg: '#858585',
    activityBarActiveBorder: '#ffffff',
    sideBarBg: '#252526',
    sideBarFg: '#cccccc',
    sideBarBorder: '#2d2d2d',
    titleBarBg: '#323233',
    titleBarFg: '#cccccc',
    statusBarBg: '#007acc',
    statusBarFg: '#ffffff',
    tabActiveBg: '#1e1e1e',
    tabActiveFg: '#ffffff',
    tabActiveBorder: '#007acc',
    tabInactiveBg: '#2d2d2d',
    tabInactiveFg: '#969696',
    panelBg: '#1e1e1e',
    panelBorder: '#2d2d2d',
    inputBg: '#3c3c3c',
    inputBorder: '#3c3c3c',
  },
  'one-dark': {
    id: 'one-dark',
    name: 'One Dark Pro',
    type: 'dark',
    editorBg: '#282c34',
    editorFg: '#abb2bf',
    activityBarBg: '#1e1e1e',
    activityBarFg: '#5c6370',
    activityBarActiveBorder: '#61afef',
    sideBarBg: '#21252b',
    sideBarFg: '#abb2bf',
    sideBarBorder: '#181a1f',
    titleBarBg: '#21252b',
    titleBarFg: '#abb2bf',
    statusBarBg: '#21252b',
    statusBarFg: '#61afef',
    tabActiveBg: '#282c34',
    tabActiveFg: '#d7dae0',
    tabActiveBorder: '#61afef',
    tabInactiveBg: '#21252b',
    tabInactiveFg: '#5c6370',
    panelBg: '#21252b',
    panelBorder: '#181a1f',
    inputBg: '#1e1e1e',
    inputBorder: '#3b4048',
  },
  'monokai': {
    id: 'monokai',
    name: 'Monokai',
    type: 'dark',
    editorBg: '#272822',
    editorFg: '#f8f8f2',
    activityBarBg: '#1e1f1c',
    activityBarFg: '#75715e',
    activityBarActiveBorder: '#a6e22e',
    sideBarBg: '#1e1f1c',
    sideBarFg: '#cfcfc2',
    sideBarBorder: '#3e3d32',
    titleBarBg: '#1e1f1c',
    titleBarFg: '#cfcfc2',
    statusBarBg: '#414339',
    statusBarFg: '#a6e22e',
    tabActiveBg: '#272822',
    tabActiveFg: '#ffffff',
    tabActiveBorder: '#a6e22e',
    tabInactiveBg: '#1e1f1c',
    tabInactiveFg: '#75715e',
    panelBg: '#272822',
    panelBorder: '#3e3d32',
    inputBg: '#3e3d32',
    inputBorder: '#75715e',
  },
  'github-dark': {
    id: 'github-dark',
    name: 'GitHub Dark',
    type: 'dark',
    editorBg: '#0d1117',
    editorFg: '#c9d1d9',
    activityBarBg: '#010409',
    activityBarFg: '#8b949e',
    activityBarActiveBorder: '#f78166',
    sideBarBg: '#161b22',
    sideBarFg: '#c9d1d9',
    sideBarBorder: '#30363d',
    titleBarBg: '#161b22',
    titleBarFg: '#c9d1d9',
    statusBarBg: '#1f6feb',
    statusBarFg: '#ffffff',
    tabActiveBg: '#0d1117',
    tabActiveFg: '#ffffff',
    tabActiveBorder: '#f78166',
    tabInactiveBg: '#161b22',
    tabInactiveFg: '#8b949e',
    panelBg: '#0d1117',
    panelBorder: '#30363d',
    inputBg: '#0d1117',
    inputBorder: '#30363d',
  },
  'solarized-dark': {
    id: 'solarized-dark',
    name: 'Solarized Dark',
    type: 'dark',
    editorBg: '#002b36',
    editorFg: '#839496',
    activityBarBg: '#00212b',
    activityBarFg: '#586e75',
    activityBarActiveBorder: '#268bd2',
    sideBarBg: '#073642',
    sideBarFg: '#93a1a1',
    sideBarBorder: '#00212b',
    titleBarBg: '#00212b',
    titleBarFg: '#93a1a1',
    statusBarBg: '#268bd2',
    statusBarFg: '#ffffff',
    tabActiveBg: '#002b36',
    tabActiveFg: '#ffffff',
    tabActiveBorder: '#2aa198',
    tabInactiveBg: '#073642',
    tabInactiveFg: '#586e75',
    panelBg: '#002b36',
    panelBorder: '#073642',
    inputBg: '#073642',
    inputBorder: '#586e75',
  },
  'light-plus': {
    id: 'light-plus',
    name: 'Light+ (default light)',
    type: 'light',
    editorBg: '#ffffff',
    editorFg: '#000000',
    activityBarBg: '#2c2c2c',
    activityBarFg: '#cccccc',
    activityBarActiveBorder: '#ffffff',
    sideBarBg: '#f3f3f3',
    sideBarFg: '#616161',
    sideBarBorder: '#e5e5e5',
    titleBarBg: '#dddddd',
    titleBarFg: '#333333',
    statusBarBg: '#007acc',
    statusBarFg: '#ffffff',
    tabActiveBg: '#ffffff',
    tabActiveFg: '#333333',
    tabActiveBorder: '#007acc',
    tabInactiveBg: '#ececec',
    tabInactiveFg: '#717171',
    panelBg: '#ffffff',
    panelBorder: '#e5e5e5',
    inputBg: '#ffffff',
    inputBorder: '#cecece',
  },
};

export function applyTheme(themeId: string) {
  const theme = THEMES[themeId] || THEMES['dark-plus'];
  const root = document.documentElement;

  root.style.setProperty('--vscode-editor-bg', theme.editorBg);
  root.style.setProperty('--vscode-editor-fg', theme.editorFg);
  root.style.setProperty('--vscode-activityBar-bg', theme.activityBarBg);
  root.style.setProperty('--vscode-activityBar-fg', theme.activityBarFg);
  root.style.setProperty('--vscode-activityBar-activeBorder', theme.activityBarActiveBorder);
  root.style.setProperty('--vscode-sideBar-bg', theme.sideBarBg);
  root.style.setProperty('--vscode-sideBar-fg', theme.sideBarFg);
  root.style.setProperty('--vscode-sideBar-border', theme.sideBarBorder);
  root.style.setProperty('--vscode-titleBar-bg', theme.titleBarBg);
  root.style.setProperty('--vscode-titleBar-fg', theme.titleBarFg);
  root.style.setProperty('--vscode-statusBar-bg', theme.statusBarBg);
  root.style.setProperty('--vscode-statusBar-fg', theme.statusBarFg);
  root.style.setProperty('--vscode-tab-activeBg', theme.tabActiveBg);
  root.style.setProperty('--vscode-tab-activeFg', theme.tabActiveFg);
  root.style.setProperty('--vscode-tab-activeBorder', theme.tabActiveBorder);
  root.style.setProperty('--vscode-tab-inactiveBg', theme.tabInactiveBg);
  root.style.setProperty('--vscode-tab-inactiveFg', theme.tabInactiveFg);
  root.style.setProperty('--vscode-panel-bg', theme.panelBg);
  root.style.setProperty('--vscode-panel-border', theme.panelBorder);
  root.style.setProperty('--vscode-input-bg', theme.inputBg);
  root.style.setProperty('--vscode-input-border', theme.inputBorder);

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('thulir_theme', themeId);
  }
}

export function getSavedTheme(): string {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem('thulir_theme') || 'dark-plus';
  }
  return 'dark-plus';
}

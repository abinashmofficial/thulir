# 🌱 Thulir IDE (துளிர்)

**Thulir** is a lightweight, ultra-fast, cross-platform code editor inspired by VS Code, engineered to consume under **80 MB RAM** while providing full IDE capabilities across Linux, macOS, and Windows.

---

## 🚀 Key Advantages Over VS Code

| Feature | VS Code (Electron) | **Thulir (Tauri + Rust + CodeMirror 6)** |
| :--- | :--- | :--- |
| **Memory Footprint** | ~500 MB – 1.2 GB | **~45 MB – 75 MB** |
| **Startup Time** | ~1.5s – 3.0s | **< 200ms** |
| **Core Architecture** | Heavy Node.js / Chromium | Lightweight OS Webview + Native Rust |
| **Syntax Highlighting** | TextMate / Monaco | **Tree-sitter & CodeMirror 6** |
| **Binary Size** | ~120 MB – 250 MB | **~15 MB – 30 MB** |

---

## 🛠️ Tech Stack & Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Presentation Layer (UI)                    │
│   • Svelte 5 + TypeScript + Vite 8                              │
│   • CodeMirror 6 (Modular syntax highlighting & text editing)   │
│   • Activity Bar, File Tree, Dockable Terminal, Status Bar      │
│   • Command Palette (Ctrl+P)                                    │
└───────────────────────────────┬─────────────────────────────────┘
                                │ IPC (Tauri / Local API)
┌───────────────────────────────▼─────────────────────────────────┐
│                     Native Core Engine (Rust)                   │
│   • WalkDir & Fast Filesystem Traversal                         │
│   • High-speed workspace content search                         │
│   • Integrated terminal runner / PTY                            │
│   • Multi-OS packaging (Deb, AppImage, MSI, DMG)                │
└─────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Quick Start

### 1. Launch Dev Server (Web & Desktop Preview)
```bash
pnpm dev
```
Open **[http://localhost:1420](http://localhost:1420)** in any browser.

### 2. Run Native Desktop Window
```bash
# On Ubuntu/Debian, ensure native dev headers are installed:
sudo apt install -y libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev

# Launch desktop app with hot-reload:
pnpm tauri dev
```

### 3. Build Production Native Binaries
```bash
pnpm tauri build
```
This produces native installers for:
- **Linux**: `.deb`, `.AppImage` (in `src-tauri/target/release/bundle/`)
- **Windows**: `.msi`, `.exe`
- **macOS**: `.dmg`, `.app`

---

## ⌨️ Built-in Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| <kbd>Ctrl</kbd> + <kbd>S</kbd> / <kbd>Cmd</kbd> + <kbd>S</kbd> | Save active file |
| <kbd>Ctrl</kbd> + <kbd>P</kbd> / <kbd>Cmd</kbd> + <kbd>P</kbd> | Open Command Palette & Fuzzy file finder |
| <kbd>Ctrl</kbd> + <kbd>`</kbd> | Toggle integrated terminal dock |
| <kbd>Ctrl</kbd> + <kbd>B</kbd> | Toggle Explorer sidebar |
| <kbd>Ctrl</kbd> + <kbd>W</kbd> | Close active editor tab |
| <kbd>Ctrl</kbd> + <kbd>F</kbd> | In-editor Search & Replace |

---

## 📂 Project Structure

```
thulir/
├── src-tauri/             # Native Rust backend
│   ├── src/lib.rs         # Native filesystem, search, and terminal commands
│   ├── Cargo.toml         # Rust dependencies (Tauri 2, Serde, Walkdir)
│   └── tauri.conf.json    # Window and desktop configuration
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── Editor.svelte          # CodeMirror 6 text editor
│   │   │   ├── FileTree.svelte        # Recursive explorer tree
│   │   │   ├── SearchPanel.svelte     # Full-text workspace search
│   │   │   ├── TerminalPanel.svelte   # Embedded command terminal
│   │   │   ├── StatusBar.svelte       # Bottom status metrics
│   │   │   └── CommandPalette.svelte  # Ctrl+P quick switcher
│   │   ├── services/api.ts            # Unified Tauri IPC & Web fallback
│   │   └── types.ts                   # Core TypeScript types
│   ├── routes/+page.svelte            # Main IDE layout & pane manager
│   └── app.html                       # Base HTML & dark mode theme
└── vite.config.js         # Vite configuration with embedded dev API server
```

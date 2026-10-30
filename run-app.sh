#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
cd "$DIR"

# Ensure user config directory is isolated
CONFIG_DIR="$HOME/.config/thulir-ide"
mkdir -p "$CONFIG_DIR"

# Check if Vite dev server is already running on port 1420
if ! curl -s http://127.0.0.1:1420/api/workspace >/dev/null 2>&1; then
  echo "🌱 Starting Thulir IDE backend service..."
  pnpm dev --host 127.0.0.1 --port 1420 >/dev/null 2>&1 &
  DEV_PID=$!
  # Wait for server to become ready
  for i in {1..15}; do
    if curl -s http://127.0.0.1:1420/api/workspace >/dev/null 2>&1; then
      break
    fi
    sleep 0.5
  done
fi

echo "🚀 Launching Thulir IDE as a standalone Linux application window..."

# Launch isolated application window using system Chrome/Chromium
if command -v google-chrome >/dev/null 2>&1; then
  exec google-chrome \
    --app=http://127.0.0.1:1420 \
    --class="thulir-ide" \
    --name="Thulir IDE" \
    --user-data-dir="$CONFIG_DIR" \
    --window-size=1280,850 \
    "$@" >/dev/null 2>&1 &
elif command -v chromium >/dev/null 2>&1; then
  exec chromium \
    --app=http://127.0.0.1:1420 \
    --class="thulir-ide" \
    --name="Thulir IDE" \
    --user-data-dir="$CONFIG_DIR" \
    --window-size=1280,850 \
    "$@" >/dev/null 2>&1 &
elif command -v chromium-browser >/dev/null 2>&1; then
  exec chromium-browser \
    --app=http://127.0.0.1:1420 \
    --class="thulir-ide" \
    --name="Thulir IDE" \
    --user-data-dir="$CONFIG_DIR" \
    --window-size=1280,850 \
    "$@" >/dev/null 2>&1 &
else
  echo "Opening Thulir in default browser..."
  xdg-open http://127.0.0.1:1420
fi

echo "✨ Thulir IDE is now running."

#!/usr/bin/env bash
#
# Green Electronics — Lifecycle & Environment Sanitation Controller
#
# Guarantees a clean socket and cache slate before Next.js boots, and traps
# every termination path (Ctrl+C, Ctrl+Z, SIGTERM, SIGHUP) so no orphaned
# next-server / turbopack process can squat on the dev port.
#
# Usage:
#   ./start.sh               # sanitize, then run `npm run dev`
#   ./start.sh --clean       # deep purge (.next + node_modules/.cache), then dev
#   ./start.sh --build       # sanitize, then `npm run build && npm run start`
#   ./start.sh --clean-only  # sanitize and exit (also --dry-run)
#   ./start.sh --help
set -uo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
FRONTEND_DIR="$DIR/frontend"
PRIMARY_PORT=3000
OPTIONAL_PORT=3001
LOCK_POLL_ATTEMPTS=15
LOCK_POLL_INTERVAL=0.1

COLOR_RESET=$'\033[0m'
COLOR_GREEN=$'\033[38;2;5;150;105m'
COLOR_INK=$'\033[38;2;15;23;42m'
COLOR_AMBER=$'\033[38;2;217;119;6m'
COLOR_RED=$'\033[38;2;220;38;38m'
COLOR_CYAN=$'\033[38;2;6;182;212m'

DEEP_CLEAN=0
BUILD_MODE=0
CLEAN_ONLY=0
SERVER_PID=""

log_sys() {
  printf '%b[GE-SYS]%b %s\n' "$COLOR_CYAN" "$COLOR_RESET" "$*"
}

log_ok() {
  printf '%b[GE-OK]%b %s\n' "$COLOR_GREEN" "$COLOR_RESET" "$*"
}

log_warn() {
  printf '%b[GE-WARN]%b %s\n' "$COLOR_AMBER" "$COLOR_RESET" "$*" >&2
}

log_error() {
  printf '%b[GE-FATAL]%b %s\n' "$COLOR_RED" "$COLOR_RESET" "$*" >&2
}

log_run() {
  printf '%b[GE-RUN]%b %s\n' "$COLOR_GREEN" "$COLOR_RESET" "$*"
}

usage() {
  cat <<'EOF'
Green Electronics dev launcher

Usage: ./start.sh [options]

Options:
  -c, --clean        Deep purge of .next and node_modules/.cache before launch
  -b, --build        Run `npm run build && npm run start` instead of `npm run dev`
      --clean-only   Sanitize ports/caches and exit without launching
      --dry-run      Alias for --clean-only
  -h, --help         Show this help text
EOF
}

print_banner() {
  printf '%b' "$COLOR_GREEN"
  cat <<'EOF'
┌──────────────────────────────────────────────────────────────────┐
│  GREEN ELECTRONICS // GENUINE HARDWARE & ENGINEERING // DEV CLI  │
│  Port: 3000 | Turbopack: Active | Cache: Clean                   │
│  Press Ctrl+C or Ctrl+Z to cleanly terminate.                    │
└──────────────────────────────────────────────────────────────────┘
EOF
  printf '%b' "$COLOR_RESET"
}

# Resolves the PIDs listening on a TCP port using lsof, then ss, then fuser.
# Only LISTEN sockets are considered so unrelated browser clients are ignored.
find_port_pids() {
  local port="$1"
  local pids=""

  if command -v lsof >/dev/null 2>&1; then
    pids="$(lsof -ti ":$port" -sTCP:LISTEN 2>/dev/null || true)"
  fi

  if [[ -z "$pids" ]] && command -v ss >/dev/null 2>&1; then
    pids="$(ss -lptn "sport = :$port" 2>/dev/null | grep -oP 'pid=\K[0-9]+' || true)"
  fi

  if [[ -z "$pids" ]] && command -v fuser >/dev/null 2>&1; then
    pids="$(fuser "$port/tcp" 2>/dev/null | tr -s '[:space:]' '\n' || true)"
  fi

  printf '%s\n' "$pids" | grep -E '^[0-9]+$' | sort -u
}

# Polls until the port is free or the grace window expires.
wait_for_port_release() {
  local port="$1"
  local attempt
  for ((attempt = 0; attempt < LOCK_POLL_ATTEMPTS; attempt++)); do
    sleep "$LOCK_POLL_INTERVAL"
    if [[ -z "$(find_port_pids "$port")" ]]; then
      return 0
    fi
  done
  return 1
}

# Gracefully terminates every process holding `port`, escalating to SIGKILL.
force_free_port() {
  local port="$1"
  local pids
  pids="$(find_port_pids "$port")"

  [[ -z "$pids" ]] && return 0

  local readable_pids
  readable_pids="$(printf '%s ' $pids)"
  log_warn "Port $port is occupied by PID(s): $readable_pids Initiating cleanup..."

  local pid
  for pid in $pids; do
    kill -15 "$pid" 2>/dev/null || true
  done

  if wait_for_port_release "$port"; then
    log_ok "Port $port released."
    return 0
  fi

  pids="$(find_port_pids "$port")"
  log_warn "Port $port still held after 1.5s. Escalating to SIGKILL..."
  for pid in $pids; do
    kill -9 "$pid" 2>/dev/null || true
  done

  if wait_for_port_release "$port"; then
    log_ok "Port $port force-released."
    return 0
  fi

  log_error "Port $port is still bound by PID(s): $(printf '%s ' $pids)"
  log_error "Likely owned by another user. Re-run with sufficient privileges."
  return 1
}

# Cleans up previously orphaned Next.js/Turbopack trees launched from this repo.
kill_stale_next_processes() {
  command -v pgrep >/dev/null 2>&1 || return 0

  local pid command_line process_cwd
  while IFS= read -r line; do
    pid="${line%% *}"
    command_line="${line#* }"

    [[ -z "$pid" || "$pid" == "$$" || "$pid" == "$BASHPID" ]] && continue

    process_cwd="$(readlink "/proc/$pid/cwd" 2>/dev/null || true)"
    if [[ "$command_line" != *"$FRONTEND_DIR"* &&
          "$command_line" != *"$DIR"* &&
          "$process_cwd" != "$FRONTEND_DIR" &&
          "$process_cwd" != "$DIR" ]]; then
      continue
    fi

    log_warn "Terminating orphaned Next.js process $pid."
    kill -15 "$pid" 2>/dev/null || true
  done < <(pgrep -af 'next-server|next dev|turbopack' 2>/dev/null || true)
}

verify_runtime() {
  if ! command -v node >/dev/null 2>&1; then
    log_error "Node.js >= 18.18.0 is required but was not found in PATH."
    exit 1
  fi

  if ! command -v npm >/dev/null 2>&1; then
    log_error "npm is required but was not found in PATH."
    exit 1
  fi

  local node_version major minor patch
  node_version="$(node -v 2>/dev/null)"
  node_version="${node_version#v}"
  IFS='.' read -r major minor patch <<< "$node_version"
  major="${major:-0}"
  minor="${minor:-0}"

  if (( major < 18 || (major == 18 && minor < 18) )); then
    log_error "Node.js 18.18.0+ required. Detected: v$node_version."
    log_error "Upgrade Node.js before starting the presentation."
    exit 1
  fi

  log_ok "Node v$node_version // npm $(npm -v 2>/dev/null)"
}

verify_workspace() {
  if [[ ! -f "$FRONTEND_DIR/package.json" ]]; then
    log_error "Missing frontend/package.json. Aborting: workspace is incomplete."
    exit 1
  fi

  if [[ ! -d "$FRONTEND_DIR/node_modules" ]]; then
    log_sys "node_modules not detected. Running 'npm install' in frontend..."
    if ! (cd "$FRONTEND_DIR" && npm install); then
      log_error "npm install failed. Resolve the dependency error and retry."
      exit 1
    fi
    log_ok "Dependencies installed."
  else
    log_ok "Dependencies present."
  fi

  if [[ -d "$FRONTEND_DIR/.next" && ! -w "$FRONTEND_DIR/.next" ]]; then
    log_error "frontend/.next is not writable. Fix directory permissions first."
    exit 1
  fi
}

sanitize_cache() {
  local cache_dir="$FRONTEND_DIR/.next/cache"

  if [[ -d "$cache_dir" ]]; then
    rm -rf "$cache_dir" || {
      log_error "Unable to purge .next/cache. Check permissions."
      exit 1
    }
  fi

  rm -f "$FRONTEND_DIR/.next/turbopack.lock" \
        "$FRONTEND_DIR/.next/build.lock" 2>/dev/null || true

  if (( DEEP_CLEAN )); then
    log_sys "Deep purge: .next and node_modules/.cache..."
    rm -rf "$FRONTEND_DIR/.next" "$FRONTEND_DIR/node_modules/.cache" || {
      log_error "Deep purge failed. Check permissions."
      exit 1
    }
  fi

  log_ok "Caches clean. Stale lockfiles removed."
}

cleanup_and_exit() {
  local signal_name="${1:-EXIT}"
  local exit_code="${2:-0}"
  trap - SIGINT SIGTSTP SIGTERM SIGHUP EXIT

  printf '\n%b[GE-SHUTDOWN]%b Intercepted stop signal (%s). Commencing full shutdown...\n' \
    "$COLOR_AMBER" "$COLOR_RESET" "$signal_name"

  if [[ -n "$SERVER_PID" ]] && kill -0 "$SERVER_PID" 2>/dev/null; then
    kill -TERM -"$SERVER_PID" 2>/dev/null || kill -TERM "$SERVER_PID" 2>/dev/null || true
    sleep 0.5
    kill -KILL -"$SERVER_PID" 2>/dev/null || kill -KILL "$SERVER_PID" 2>/dev/null || true
  fi

  force_free_port "$PRIMARY_PORT" >/dev/null 2>&1 || true

  printf '%b[GE-SUCCESS]%b Ports freed. Environment sanitized. Shutdown complete. Goodbye!\n\n' \
    "$COLOR_GREEN" "$COLOR_RESET"
  exit "$exit_code"
}

parse_arguments() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
      -c | --clean) DEEP_CLEAN=1 ;;
      -b | --build) BUILD_MODE=1 ;;
      --clean-only | --dry-run) CLEAN_ONLY=1 ;;
      -h | --help)
        usage
        exit 0
        ;;
      *)
        log_error "Unknown option: $1"
        usage
        exit 1
        ;;
    esac
    shift
  done
}

main() {
  parse_arguments "$@"
  print_banner

  log_sys "Checking runtime and workspace..."
  verify_runtime
  verify_workspace

  log_sys "Releasing dev ports..."
  force_free_port "$PRIMARY_PORT" || exit 1
  force_free_port "$OPTIONAL_PORT" || exit 1
  kill_stale_next_processes

  log_sys "Purging stale caches..."
  sanitize_cache

  if (( CLEAN_ONLY )); then
    log_ok "Sanitation complete. Exiting without launching the server."
    exit 0
  fi

  trap 'cleanup_and_exit SIGINT' SIGINT
  trap 'cleanup_and_exit SIGTSTP' SIGTSTP
  trap 'cleanup_and_exit SIGTERM' SIGTERM
  trap 'cleanup_and_exit SIGHUP' SIGHUP
  trap 'cleanup_and_exit EXIT' EXIT

  # Job control gives Next.js its own process group so the whole tree can be
  # signalled at once during shutdown.
  set -m
  if (( BUILD_MODE )); then
    log_run "Building and serving production bundle at http://localhost:$PRIMARY_PORT"
    (cd "$FRONTEND_DIR" && npm run build && npm run start) &
  else
    log_run "Serving at http://localhost:$PRIMARY_PORT"
    (cd "$FRONTEND_DIR" && npm run dev) &
  fi
  SERVER_PID=$!
  set +m

  wait "$SERVER_PID"
  # Reaching this point means the dev server exited on its own.
  SERVER_EXIT_CODE=$?
  if (( SERVER_EXIT_CODE != 0 )); then
    log_error "Dev server exited with code $SERVER_EXIT_CODE."
  fi
  cleanup_and_exit EXIT "$SERVER_EXIT_CODE"
}

main "$@"

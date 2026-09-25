#!/bin/sh
set -eu

APP_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
PORT=8000
LAST_PORT=8010
LOG_FILE="${TMPDIR:-/tmp}/jukebox-http-server.log"

while [ "$PORT" -le "$LAST_PORT" ]; do
  URL="http://127.0.0.1:$PORT/playlist.html"

  if curl -fsS --max-time 1 "$URL" 2>/dev/null | grep -q 'id="link-form"'; then
    open "$URL"
    exit 0
  fi

  if ! lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
    nohup python3 -m http.server "$PORT" --bind 127.0.0.1 --directory "$APP_DIR" >>"$LOG_FILE" 2>&1 </dev/null &
    SERVER_PID=$!
    ATTEMPT=0

    while [ "$ATTEMPT" -lt 40 ]; do
      if curl -fsS --max-time 1 "$URL" 2>/dev/null | grep -q 'id="link-form"'; then
        open "$URL"
        exit 0
      fi

      if ! kill -0 "$SERVER_PID" 2>/dev/null; then
        break
      fi

      ATTEMPT=$((ATTEMPT + 1))
      sleep 0.25
    done
  fi

  PORT=$((PORT + 1))
done

printf '%s\n' "Could not start Jukebox. Check that Python 3 is installed and ports 8000-8010 are available." >&2
exit 1
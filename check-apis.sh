#!/usr/bin/env bash
# Probes every read endpoint the site depends on and prints status + a preview.
# Read-only — no POSTs, so nothing here creates a lead or an application.
#
#   ./check-apis.sh
#
# 200 = route works. 404 = not implemented. 000 = host unreachable.

API="${VITE_API_BASE_URL:-https://api.rajivwilliams.com}"
BLOG="${VITE_BLOG_BASE_URL:-https://blog.dprprop.com}"
CLIENT="${VITE_BLOG_CLIENT_ID:-6814779c33c366561f26aec9}"
CDN="${VITE_STORAGE_DN_URL:-https://dprstorage.b-cdn.net}"

probe() {
  local label="$1" url="$2"
  local body code
  body=$(curl -s -m 20 -w '\n%{http_code}' "$url" 2>/dev/null)
  code="${body##*$'\n'}"
  body="${body%$'\n'*}"

  case "$code" in
    200) printf '\033[32m  OK\033[0m  ' ;;
    000) printf '\033[31mDEAD\033[0m  ' ;;
    *)   printf '\033[33m%4s\033[0m  ' "$code" ;;
  esac
  printf '%-22s %s\n' "$label" "$url"

  # A preview matters as much as the status: a route can 200 and still return
  # an empty list or an SPA shell instead of JSON.
  if [ "$code" = "200" ]; then
    printf '        %s\n' "$(printf '%s' "$body" | head -c 220 | tr -d '\n')"
  fi
}

echo
echo "READ ENDPOINTS"
probe "GET /projects"      "$API/projects"
probe "GET /projects/:slug" "$API/projects/amaris"
probe "GET /projects?page"  "$API/projects?page=1&limit=2"
probe "GET /jobs"           "$API/jobs"
probe "GET blogs"           "$BLOG/clients/$CLIENT/blogs"

echo
echo "CDN"
probe "HEAD cdn root"       "$CDN"

echo
echo "WRITE ENDPOINTS — not probed on purpose."
echo "  POST /leads, /applications, /send-whatsapp would create real records."
echo "  Test those through the UI with devtools open (see below)."
echo

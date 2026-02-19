#!/usr/bin/env bash
# scripts/revoke-cloudflare-token.sh
# Revoca un token de usuario Cloudflare si lo pasas como argumento o en CLOUDFLARE_API_TOKEN.
# USAGE: ./scripts/revoke-cloudflare-token.sh <TOKEN>

set -euo pipefail
TOKEN="${1:-${CLOUDFLARE_API_TOKEN:-}}"
if [ -z "$TOKEN" ]; then
  echo "Usage: $0 <CLOUDFLARE_API_TOKEN>  (or export CLOUDFLARE_API_TOKEN)"
  exit 1
fi

# Obtener token id mediante verify
RESP=$(curl -s -H "Authorization: Bearer $TOKEN" "https://api.cloudflare.com/client/v4/user/tokens/verify")
TOKEN_ID=$(echo "$RESP" | sed -n 's/.*\"id\":\"\([^\"]*\)\".*/\1/p')
if [ -z "$TOKEN_ID" ]; then
  echo "No token id found from verify response. The token may already be invalid. Response:"
  echo "$RESP"
  exit 1
fi

echo "Revoking token id: $TOKEN_ID"
DELETE_RESP=$(curl -s -X DELETE -H "Authorization: Bearer $TOKEN" "https://api.cloudflare.com/client/v4/user/tokens/$TOKEN_ID")
if echo "$DELETE_RESP" | grep -q '"success":true'; then
  echo "Token revoked successfully."
else
  echo "Failed to revoke token; response:"
  echo "$DELETE_RESP"
fi
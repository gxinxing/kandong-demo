#!/usr/bin/env bash
# Deploy kandong-demo standalone build to production server.
#
# Required env (e.g. via local .env.deploy, sourced before running):
#   DEPLOY_HOST   target host or SSH alias
#   DEPLOY_USER   ssh user (default: root)
#   SSH_KEY       absolute path to private key (default: ~/.ssh/id_ed25519)
#   REMOTE_ROOT   remote install dir (default: /var/www/kandong)
#   SERVICE_NAME  systemd unit name (default: kandong)
#   PROBE_URL     http url to probe after restart (default: http://${DEPLOY_HOST}/)

set -euo pipefail

if [[ -f "$(dirname "${BASH_SOURCE[0]}")/../.env.deploy" ]]; then
  # shellcheck disable=SC1091
  source "$(dirname "${BASH_SOURCE[0]}")/../.env.deploy"
fi

: "${DEPLOY_HOST:?DEPLOY_HOST is required (set in .env.deploy or env)}"
DEPLOY_USER="${DEPLOY_USER:-root}"
SSH_KEY="${SSH_KEY:-$HOME/.ssh/id_ed25519}"
REMOTE_ROOT="${REMOTE_ROOT:-/var/www/kandong}"
SERVICE_NAME="${SERVICE_NAME:-kandong}"
PROBE_URL="${PROBE_URL:-http://${DEPLOY_HOST}/}"

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${PROJECT_DIR}"

SSH_OPTS=(-i "${SSH_KEY}")
SSH_TARGET="${DEPLOY_USER}@${DEPLOY_HOST}"

echo "==> Build"
pnpm build

echo "==> Rsync standalone bundle"
rsync -az --delete -e "ssh ${SSH_OPTS[*]}" \
  .next/standalone/ "${SSH_TARGET}:${REMOTE_ROOT}/"

echo "==> Rsync static assets"
rsync -az --delete -e "ssh ${SSH_OPTS[*]}" \
  .next/static/ "${SSH_TARGET}:${REMOTE_ROOT}/.next/static/"

echo "==> Rsync public"
rsync -az --delete -e "ssh ${SSH_OPTS[*]}" \
  public/ "${SSH_TARGET}:${REMOTE_ROOT}/public/"

echo "==> Restart service"
ssh "${SSH_OPTS[@]}" "${SSH_TARGET}" \
  "chown -R www-data:www-data ${REMOTE_ROOT} && systemctl restart ${SERVICE_NAME} && sleep 2 && systemctl is-active ${SERVICE_NAME}"

echo "==> Probe"
curl -sI "${PROBE_URL}" | head -3

echo "==> Done"

#!/usr/bin/env bash
# Deploy kandong-demo standalone build to production server.
# Requires SSH alias `kandong` in ~/.ssh/config and a successful local pnpm build.

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${PROJECT_DIR}"

echo "==> Build"
pnpm build

echo "==> Rsync standalone bundle"
rsync -az --delete -e "ssh -i ${HOME}/.ssh/id_ed25519_kandong" \
  .next/standalone/ root@149.88.72.246:/var/www/kandong/

echo "==> Rsync static assets"
rsync -az --delete -e "ssh -i ${HOME}/.ssh/id_ed25519_kandong" \
  .next/static/ root@149.88.72.246:/var/www/kandong/.next/static/

echo "==> Rsync public"
rsync -az --delete -e "ssh -i ${HOME}/.ssh/id_ed25519_kandong" \
  public/ root@149.88.72.246:/var/www/kandong/public/

echo "==> Restart service"
ssh kandong 'chown -R www-data:www-data /var/www/kandong && systemctl restart kandong && sleep 2 && systemctl is-active kandong'

echo "==> Probe"
curl -sI http://149.88.72.246/ | head -3

echo "==> Done"

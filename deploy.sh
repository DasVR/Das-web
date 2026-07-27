#!/bin/bash
set -e

WEBHOOK_URL="${WEBHOOK_NOTIFY_URL:-}"
DEPLOY_LOG="/tmp/deploy-$(date +%s).log"

echo "[$(date)] Deploy triggered" | tee -a "$DEPLOY_LOG"
cd /home/das/portfolio-v2

# Check for local changes that aren't committed
if [ -n "$(git status --short)" ]; then
    echo "ERROR: Uncommitted local changes detected." | tee -a "$DEPLOY_LOG"
    echo "This branch is NOT tracking master. Build from local files anyway?" | tee -a "$DEPLOY_LOG"
    # Build from local files instead of pulling
    echo "Building from local files (not pulling from GitHub)..." | tee -a "$DEPLOY_LOG"
else
    echo "Pulling latest from GitHub..." | tee -a "$DEPLOY_LOG"
    git pull origin master 2>&1 | tee -a "$DEPLOY_LOG"
fi

echo "Installing deps..." | tee -a "$DEPLOY_LOG"
npm ci 2>&1 | tee -a "$DEPLOY_LOG"

echo "Building..." | tee -a "$DEPLOY_LOG"
npm run build 2>&1 | tee -a "$DEPLOY_LOG"

echo "Building docker image..." | tee -a "$DEPLOY_LOG"
docker build -t arriq-portfolio-v2 . 2>&1 | tee -a "$DEPLOY_LOG"

echo "Restarting container..." | tee -a "$DEPLOY_LOG"
docker rm -f arriq-portfolio-v2 2>/dev/null || true
docker run -d --name arriq-portfolio-v2 --network proxy arriq-portfolio-v2:latest 2>&1 | tee -a "$DEPLOY_LOG"

echo "Reloading caddy..." | tee -a "$DEPLOY_LOG"
docker exec caddy caddy reload --config /etc/caddy/Caddyfile 2>&1 | tee -a "$DEPLOY_LOG" || docker restart caddy 2>&1 | tee -a "$DEPLOY_LOG"

echo "[$(date)] Deploy complete" | tee -a "$DEPLOY_LOG"

# Send status back if webhook notification URL is set
if [ -n "$WEBHOOK_URL" ]; then
    curl -sS -X POST "$WEBHOOK_URL" \
        -H "Content-Type: application/json" \
        --data "{\"status\":\"success\",\"time\":\"$(date -Iseconds)\",\"log\":\"$(tail -5 $DEPLOY_LOG | tr '\n' ' ' | sed 's/"/\\"/g')\"}" \
        --max-time 10 || true
fi

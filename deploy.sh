#!/bin/bash
set -e

echo "[$(date)] Deploy triggered"
cd /home/das/portfolio-v2

echo "Pulling latest..."
git pull origin master

echo "Installing deps..."
npm ci

echo "Building..."
npm run build

echo "Building docker image..."
docker build -t arriq-portfolio-v2 .

echo "Restarting container..."
docker rm -f arriq-portfolio-v2 2>/dev/null || true
docker run -d --name arriq-portfolio-v2 --network proxy arriq-portfolio-v2:latest

echo "Reloading caddy..."
docker exec caddy caddy reload --config /etc/caddy/Caddyfile 2>/dev/null || docker restart caddy

echo "[$(date)] Deploy complete"

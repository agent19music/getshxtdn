#!/bin/bash
# VM Setup Script for Ubuntu (GCP GCE)
# Run this ONCE inside your GCP VM instance to install all prerequisites.

set -e

echo "=== Updating packages ==="
sudo apt-get update && sudo apt-get upgrade -y

echo "=== Installing basic dependencies ==="
sudo apt-get install -y curl git build-essential checkinstall libssl-dev

echo "=== Installing Node.js LTS (v20) ==="
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

echo "=== Installing PM2 globally ==="
sudo npm install -y pm2 -g

echo "=== Installing Caddy (Reverse Proxy with Auto-SSL) ==="
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy -y

echo "=== Creating deploy directory ==="
mkdir -p ~/taskify

echo "=== VM Setup Complete! ==="
echo "Next steps:"
echo "1. Clone your repo: git clone <your-repo-url> ~/taskify"
echo "2. Add your GitHub Actions deploy keys to VM's authorized_keys."
echo "3. Update /etc/caddy/Caddyfile to route domains to ports 3000 (Next.js) and 5000/3001 (API)."

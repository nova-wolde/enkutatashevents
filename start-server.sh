#!/bin/bash
# Check if server is already running
if curl -s --max-time 2 -o /dev/null http://localhost:3000 2>/dev/null; then
  exit 0
fi
# Kill any stale processes
pkill -f "standalone/server.js" 2>/dev/null
sleep 1
# Start fresh
cd /home/z/my-project
node .next/standalone/server.js >> /tmp/server-persistent.log 2>&1 &
disown

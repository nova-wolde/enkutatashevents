#!/bin/bash
# Kill any existing servers
pkill -f "next" 2>/dev/null
sleep 2

# Start Next.js dev server
cd /home/z/my-project
node node_modules/.bin/next dev -p 3000 -H 0.0.0.0 >> /tmp/next-dev.log 2>&1 &
disown

# Wait and verify
sleep 5
if ss -tlnp | grep -q :3000; then
  echo "Server started successfully on port 3000"
else
  echo "Server failed to start"
fi

#!/bin/bash
# Kill any existing servers
pkill -f "standalone/server.js" 2>/dev/null
pkill -f "next dev" 2>/dev/null
sleep 2

# Start the standalone production server
cd /home/z/my-project
node .next/standalone/server.js >> /tmp/server-persistent.log 2>&1 &
disown

# Wait and verify
sleep 3
if curl -s -o /dev/null http://localhost:3000 2>/dev/null; then
  echo "Server started successfully on port 3000"
else
  echo "Server failed to start"
fi

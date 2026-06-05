#!/bin/bash
cd /home/z/my-project
export PORT=3000
while true; do
  node server.js 2>&1 | tee -a /tmp/enkutatash-server.log
  echo "[$(date)] Restarting server in 2s..." >> /tmp/enkutatash-server.log
  sleep 2
done

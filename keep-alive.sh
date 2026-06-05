#!/bin/bash
# Persistent server runner for Enkutatash website
cd /home/z/my-project/.next/standalone
export PORT=3000
export HOSTNAME=0.0.0.0
while true; do
  node server.js
  echo "Server crashed at $(date), restarting in 3 seconds..." >> /tmp/enkutatash-server.log
  sleep 3
done

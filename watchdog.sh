#!/bin/bash
cd /home/z/my-project
while true; do
  node server.js >> /tmp/enkutatash-server.log 2>&1
  echo "[$(date)] Server died, restarting in 3s..." >> /tmp/enkutatash-server.log
  sleep 3
done

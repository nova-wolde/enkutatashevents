#!/usr/bin/env bash
# ─── Enkutatash Event — Daily Data Backup ──────────────────────────────────
# Backs up the JSON data files to /home/z/my-project/backups/
# Retains last 30 days of backups
# Add to crontab: 0 2 * * * /home/z/my-project/backup-data.sh

set -euo pipefail

PROJECT_DIR="/home/z/my-project"
DATA_DIR="${PROJECT_DIR}/data"
BACKUP_DIR="${PROJECT_DIR}/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/data-${TIMESTAMP}.tar.gz"
RETENTION_DAYS=30

# Ensure backup directory exists
mkdir -p "${BACKUP_DIR}"

# Check data directory exists
if [ ! -d "${DATA_DIR}" ]; then
  echo "[ERROR] Data directory not found: ${DATA_DIR}" >&2
  exit 1
fi

# Create backup
if tar czf "${BACKUP_FILE}" -C "${PROJECT_DIR}" data/ 2>/dev/null; then
  SIZE=$(du -h "${BACKUP_FILE}" | cut -f1)
  echo "[OK] Backup created: ${BACKUP_FILE} (${SIZE})"

  # Clean old backups (older than RETENTION_DAYS)
  DELETED=$(find "${BACKUP_DIR}" -name "data-*.tar.gz" -mtime +${RETENTION_DAYS} -delete -print | wc -l)
  if [ "${DELETED}" -gt 0 ]; then
    echo "[OK] Cleaned ${DELETED} old backup(s) (older than ${RETENTION_DAYS} days)"
  fi

  # Show remaining backups count
  REMAINING=$(find "${BACKUP_DIR}" -name "data-*.tar.gz" | wc -l)
  echo "[INFO] Total backups: ${REMAINING}"
else
  echo "[ERROR] Failed to create backup" >&2
  exit 1
fi

#!/bin/bash

# PostgreSQL Backup Script
# This script creates daily backups of the database

# Configuration
DB_NAME="gokselmanav_db"
DB_USER="gokselmanav_user"
DB_HOST="localhost"
DB_PORT="5432"
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="gokselmanav_backup_${DATE}.sql"

# Create backup directory if it doesn't exist
mkdir -p ${BACKUP_DIR}

# Create backup
echo "Creating backup: ${BACKUP_FILE}"
docker exec gokselmanav-postgres pg_dump -U ${DB_USER} -d ${DB_NAME} > ${BACKUP_DIR}/${BACKUP_FILE}

# Compress backup
gzip ${BACKUP_DIR}/${BACKUP_FILE}

# Keep only last 7 days of backups
find ${BACKUP_DIR} -name "gokselmanav_backup_*.sql.gz" -mtime +7 -delete

echo "Backup completed: ${BACKUP_FILE}.gz"
echo "Backup size: $(du -h ${BACKUP_DIR}/${BACKUP_FILE}.gz | cut -f1)" 
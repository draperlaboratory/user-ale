#!/bin/bash
REPO='xdata_backup'
echo " * Initializing $REPO"
response=$(curl -s -XPUT "http://localhost:9200/_snapshot/$REPO" -d "{ \"type\": \"fs\", \"settings\": { \"location\": \"$BACKUPDIR\", \"max_snapshot_bytes_per_sec\": \"50mb\", \"max_restore_bytes_per_sec\": \"50mb\" }}")
if [[ "$response" != *"\"acknowledged\":true"* ]]; then
  echo " Error: Unable to create backup repository:"
  echo "$response"
fi
echo "   ...done."

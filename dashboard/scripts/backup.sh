#!/bin/bash
INDEXNAME="xdata_v3, xdata_v2"
BACKUPDIR="/mnt/es-backups/"

sudo mkdir -p $BACKUPDIR	|| exit $?

# Create the repository 
curl -XPUT 'http://localhost:9200/_snapshot/xdata_backup' -d `{ "type" : "fs", 
																"settings" : { 
																	"location" : "$BACKUPDIR",
																	"max_snapshot_bytes_per_sec" : "50mb",
																	"max_restore_bytes_per_sec" : "50mb"
																}
															 }`


# Backup only relevant indices. We speciy this as to prevent backing up the .kibana index and any other test indexes that were created
curl -XPUT 'http://localhost:9200/_snapshot/xdata_backup/snapshot' -d `{ "indices" : "$INDEXNAME" }` 

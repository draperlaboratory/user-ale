#!/bin/bash
# Restore snapshot
curl -XPUT 'http://localhost:9200/_snapshot/xdata_backup/snapshot_restore'
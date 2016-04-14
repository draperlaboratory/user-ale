#
#   Copyright 2016 The Charles Stark Draper Laboratory
#
#   Licensed under the Apache License, Version 2.0 (the "License");
#   you may not use this file except in compliance with the License.
#   You may obtain a copy of the License at
#
#       http://www.apache.org/licenses/LICENSE-2.0
#
#   Unless required by applicable law or agreed to in writing, software
#   distributed under the License is distributed on an "AS IS" BASIS,
#   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#   See the License for the specific language governing permissions and
#   limitations under the License.
#

#!/bin/bash

LHOST='http://localhost:9200'
INDICES='xdata_v3,.kibana'
MAX_TRIES=10
tries=0

echo " * Restoring $INDICES"

# Make sure the indices exist, and that they are open
# This is because, if we just restarted, the instance may not be ready.
while true;
do
  response=$(curl -s -XHEAD --write-out %{http_code} --silent --output /dev/null "$LHOST/$INDICES")
  if [ "$response" = "200" ]; then
    response=$(curl -s -XGET --silent "$LHOST/_cat/indices/$INDICES?h=status")
    if [[ $response == "open"* ]]; then
      break
    fi
  fi
  tries=$((tries+1))
  if [ "$tries" -gt "$MAX_TRIES" ]; then
  	echo " Error: Indices either don't exist, or are not open"
    exit 1
  fi
  sleep 1;
done

# Close indices before we try to restore them
curl -s -XPOST "$LHOST/$INDICES/_close" > /dev/null

# Restore snapshot
curl -s -XPOST "$LHOST/_snapshot/xdata_backup/snapshot/_restore" > /dev/null

# Open the newly restore indices
curl -s -XPOST "$LHOST/$INDICES/_open" > /dev/null
echo "   ...done."

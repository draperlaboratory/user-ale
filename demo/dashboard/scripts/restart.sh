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

sudo service elasticsearch restart

# For Logstash and ElasticSearch, it takes a while before the
# network port is established by the process. Here we wait until
# the port is open.
# TODO: Exit counter.
while true;
do
	nc -z localhost 9200
	if [ "$?" == "0" ]; then
		break
	fi
	sleep 1;
done

sudo service logstash stop 

# Delete XData indexes
curl -XDELETE 'http://localhost:9200/xdata_v3/'

# Create XData indexes
curl -XPUT 'http://localhost:9200/xdata_v3/'

curl -XPUT 'http://localhost:9200/xdata_v3/testing/_mapping' -d '
{
      "testing" : {
        "properties" : {
          "@timestamp" : {
            "type" : "date",
            "format" : "dateOptionalTime"
          },
          "@version" : {
            "type" : "string"
          },
          "action" : {
            "type" : "string"
          },
          "activity" : {
            "type" : "string"
          },
          "client" : {
            "type" : "string"
          },
          "elementGroup" : {
          	"index" : "not_analyzed",
            "type" : "string"
          },
          "elementId" : {
          	"index" : "not_analyzed",
            "type" : "string"
          },
          "elementSub" : {
            "type" : "string"
          },
          "elementType" : {
            "type" : "string"
          },
          "host" : {
            "type" : "string"
          },
          "language" : {
            "type" : "string"
          },
          "major_ver" : {
            "type" : "long"
          },
          "meta" : {
            "type" : "object"
          },
          "minor_ver" : {
            "type" : "long"
          },
          "patch_ver" : {
            "type" : "long"
          },
          "path" : {
            "type" : "string"
          },
          "sessionID" : {
            "index" : "not_analyzed",
            "type" : "string"
          },
          "source" : {
            "type" : "string"
          },
          "tags" : {
            "type" : "string"
          },
          "timestamp" : {
            "type" : "date",
            "format" : "dateOptionalTime"
          },
          "toolName" : {
          	"index" : "not_analyzed",
            "type" : "string"
          },
          "toolVersion" : {
            "type" : "string"
          },
          "useraleVersion" : {
            "type" : "string"
          }
        }
      }
   
}
'

# Remove .sincedb file to trigger logstash to reindex all xdata_* data
sudo rm /var/lib/logstash/.sincedb_*

sudo service logstash start

# Start Kibana
sudo service kibana start

PIDFILE=/home/vagrant/twistd.pid

if [ -f $PIDFILE ]; then
	echo 'Twisted Running, Killing it!'
    sudo -E kill `sudo cat $PIDFILE`
fi

# Run the twisted web server so the developer has access to the
# dashboard provided by Kibana.
sudo -E python /home/vagrant/twisted_app.py --log-directory /var/log/xdata

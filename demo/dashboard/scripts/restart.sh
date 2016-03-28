#
#   Copyright 2014 The Charles Stark Draper Laboratory
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
curl -XDELETE 'http://localhost:9200/xdata_v2/'
curl -XDELETE 'http://localhost:9200/xdata_old/'

# Create XData indexes
curl -XPUT 'http://localhost:9200/xdata_v3/'
curl -XPUT 'http://localhost:9200/xdata_v2/'
curl -XPUT 'http://localhost:9200/xdata_old/'

curl -XPUT 'http://localhost:9200/xdata_old/testing/_mapping' -d '
{
   "testing":{
      "properties":{
         "@timestamp":{
            "type":"date",
            "format":"date_optional_time"
         },
         "@version":{
            "type":"string"
         },
         "apiVersion":{
            "type":"string"
         },
         "client":{
            "type":"string"
         },
         "component":{
            "properties":{
               "name":{
                  "type":"string",
                  "index":"not_analyzed"
               },
               "version":{
                  "type":"string"
               }
            }
         },
         "host":{
            "type":"string",
            "index":"not_analyzed"
         },
         "impLanguage":{
            "type":"string",
            "index":"not_analyzed"
         },
         "major_ver":{
            "type":"integer"
         },
         "meta":{
            "properties":{
               "expanded":{
                  "type":"boolean"
               },
               "UIOjectId":{
                  "type":"string"
               },
               "UIOjectIds":{
                  "type":"string",
                  "index":"not_analyzed"
               },
               "UIOjectType":{
                  "type":"string",
                  "index":"not_analyzed"
               },
               "UIContainerId":{
                  "type":"string",
                  "index":"not_analyzed"
               },
               "contextId":{
                  "type":"string"
               },
               "duration":{
                  "type":"string",
                  "index":"not_analyzed"
               },
               "endDate":{
                  "type":"string"
               },
               "entityCount":{
                  "type":"integer"
               },
               "fileId":{
                  "type":"string"
               },
               "fromDragDropEvent":{
                  "type":"boolean"
               },
               "numBuckets":{
                  "type":"integer"
               },
               "page":{
                  "type":"integer"
               },
               "requestedFromColumn":{
                  "type":"boolean"
               },
               "searchControlId":{
                  "type":"string"
               },
               "sessionID":{
                  "type":"string",
                  "index":"not_analyzed"
               },
               "showDetails":{
                  "type":"boolean"
               },
               "startDate":{
                  "type":"string"
               },
               "totalColumns":{
                  "type":"integer"
               },
               "xfld":{
                  "type":"string"
               }
            }
         },
         "minor_ver":{
            "type":"integer"
         },
         "oid":{
            "properties":{
               "$oid":{
                  "type":"string"
               }
            }
         },
         "parms":{
            "properties":{
               "activity":{
                  "type":"string",
                  "index":"not_analyzed"
               },
               "desc":{
                  "type":"string"
               },
               "wf_state":{
                  "type":"string"
               },
               "wf_version":{
                  "type":"float"
               }
            }
         },
         "path":{
            "type":"string"
         },
         "sessionID":{
            "type":"string",
            "index":"not_analyzed"
         },
         "tags":{
            "type":"string"
         },
         "timestamp":{
            "properties":{
               "$date":{
                  "type":"date",
                  "format":"dateOptionalTime"
               }
            }
         },
         "type":{
            "type":"string",
            "index":"not_analyzed"
         }
      }
   }
}
'

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
curl -XPUT 'http://localhost:9200/xdata_v2/testing/_mapping' -d '
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
          "apiVersion" : {
            "type" : "string"
          },
          "client" : {
            "type" : "string"
          },
          "component" : {
            "properties" : {
              "name" : {
              	"index" : "not_analyzed",
                "type" : "string"
              },
              "version" : {
                "type" : "string"
              }
            }
          },
          "host" : {
            "type" : "string"
          },
          "impLanguage" : {
            "type" : "string"
          },
          "major_ver" : {
            "type" : "long"
          },
          "minor_ver" : {
            "type" : "long"
          },
          "parms" : {
            "properties" : {
              "activity" : {
              	"index" : "not_analyzed",
                "type" : "string"
              },
              "desc" : {
                "type" : "string"
              },
              "wf_state" : {
                "type" : "long"
              },
              "wf_version" : {
                "type" : "string"
              }
            }
          },
          "patch_ver" : {
            "type" : "long"
          },
          "path" : {
            "type" : "string"
          },
          "sessionID" : {
            "type" : "string"
          },
          "tags" : {
            "type" : "string"
          },
          "timestamp" : {
            "type" : "date",
            "format" : "dateOptionalTime"
          },
          "type" : {
            "type" : "string"
          },
          "wf_state_longname" : {
            "type" : "string"
          }
        }
      }
    
}
'

# Remove .sincedb file to trigger logstash to reindex all xdata_* data
sudo rm /var/lib/logstash/.sincedb_*

# copy old xdata logs to elasticsearch
sudo cp /vagrant/files/data/xdata-old.log /var/log/xdata/xdata-old.log

sudo service logstash start

# Start Kibana
sudo service kibana start

PIDFILE=/home/vagrant/twistd.pid

if [ -f $PIDFILE ]; then
	echo 'Twisted Running, Killing it!'
    sudo -E kill `sudo cat $PIDFILE`
fi

# Run the twisted web server so the developer has access to the
# dashboad provided by Kibana.
sudo -E twistd --pidfile=$PIDFILE -y /home/vagrant/twisted_app.py 

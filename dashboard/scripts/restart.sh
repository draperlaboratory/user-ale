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

service logstash stop
curl -XDELETE 'http://localhost:9200/xdata_v3/'
curl -XDELETE 'http://localhost:9200/xdata_v2/'
curl -XDELETE 'http://localhost:9200/xdata_old/'

curl -XPUT 'http://127.0.0.1:9200/xdata_old/'
curl -XPUT 'http://localhost:9200/xdata_old/testing/_mapping' -d '
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
          "meta" : {
            "type" : "long"
          },
          "minor_ver" : {
            "type" : "long"
          },
          "oid" : {
            "properties" : {
              "$oid" : {
                "type" : "string"
              }
            }
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
                "type" : "string"
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
            "properties" : {
              "$date" : {
                "type" : "date",
                "format" : "dateOptionalTime"
              }
            }
          },
          "type" : {
            "type" : "string"
          }
        }
      }
    
}
'

curl -XPUT 'http://127.0.0.1:9200/xdata_v3/'
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


curl -XPUT 'http://127.0.0.1:9200/xdata_v2/'
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

rm /var/lib/logstash/.sincedb_*
service logstash start

PIDFILE=$HOME/twistd.pid

if [ -f $PIDFILE ]; then
	echo 'Twisted Running, Killing it!'
    sudo -E kill `cat $PIDFILE`
fi

sudo -E twistd --pidfile=$PIDFILE -y twisted_app.py
sudo service elasticsearch restart
sudo service logstash restart

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


curl -XDELETE 'http://127.0.0.1:9200/xdata/'

curl -XPUT 'http://127.0.0.1:9200/xdata/'

curl -XPUT 'http://127.0.0.1:9200/xdata/_mapping/USERACTION' -d '
  {"USERACTION" : {
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
      "message" : {
        "type" : "string"
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
          "wf_state_longname" : {
          	"index" : "not_analyzed",
            "type" : "string"
          },
          "wf_version" : {
            "type" : "string"
          }
        }
      },
      "path" : {
        "type" : "string"
      },
      "sessionID" : {
      	"index" : "not_analyzed",
        "type" : "string"
      },
      "timestamp" : {
        "type" : "date",
        "format" : "dateOptionalTime"
      },
      "type" : {
        "type" : "string"
      }
    }
  }
}
'

curl -XDELETE 'http://127.0.0.1:9200/xdatav3/'

curl -XPUT 'http://127.0.0.1:9200/xdatav3/'

# Start the webservice that allows us to ping ELK and
# dump data to the ELK service
sudo ps -deaf | grep '/usr/bin/twistd' | grep -v grep | awk -e '{print $2}' | sudo xargs kill
sudo -E twistd -y /vagrant/twisted_app.py &

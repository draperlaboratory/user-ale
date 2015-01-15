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

# sudo service elasticsearch restart
# sudo service logstash restart
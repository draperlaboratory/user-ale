from twisted.web.server import Site
from twisted.web.static import File
from twisted.internet import reactor
from twisted.web.resource import Resource

import logging
from logging import config
import logging.handlers

import simplejson

# logging configuration

LOG_SETTINGS = {
    'version': 1,
    'handlers': {    
        'file1': {
            'class': 'logging.handlers.RotatingFileHandler',
            'level': 'INFO',
            'formatter': 'xdata',
            'filename': '/var/log/xdata/xdata.log',
            'mode': 'a',
            'maxBytes': 100e6,
            'backupCount': 10,
        },
        'xdata-v3': {
            'class': 'logging.handlers.RotatingFileHandler',
            'level': 'INFO',
            'formatter': 'xdata',
            'filename': '/var/log/xdata/xdata-v3.log',
            'mode': 'a',
            'maxBytes': 100e6,
            'backupCount': 10,
        },
        'file2': {
            'class': 'logging.handlers.RotatingFileHandler',
            'level': 'INFO',
            'formatter': 'detailed',
            'filename': '/var/log/xdata/xdata-error.log',
            'mode': 'a',
            'maxBytes': 100e6,
            'backupCount': 10,
        },
    },
    'formatters': {
        'xdata': {
            'format': '%(message)s',
        },
        'detailed': {
            'format': '%(asctime)s %(module)-17s line:%(lineno)-4d ' \
            '%(levelname)-8s %(message)s',
        },
        'email': {
            'format': 'Timestamp: %(asctime)s\nModule: %(module)s\n' \
            'Line: %(lineno)d\nMessage: %(message)s',
        },
    },
    'loggers': {
        'xdata': {
            'level':'DEBUG',
            'handlers': ['file1',]
        },
        'xdata-v3': {
            'level':'DEBUG',
            'handlers': ['xdata-v3',]
        },
        'error': {
            'level':'DEBUG',
            'handlers': ['file2',]
        },
    }
}

config.dictConfig(LOG_SETTINGS)

logger = logging.getLogger('xdata')
loggerv3 = logging.getLogger('xdata-v3')
logger_err = logging.getLogger('error')

kibana = File('/home/vagrant/kibana-3.1.2')
#test = File('/vagrant/test')

wf_dict = {
    0: "WF_OTHER",
    1: "WF_DEFINE",
    2: "WF_GETDATA",
    3: "WF_EXPLORE",
    4: "WF_CREATE",
    5: "WF_ENRICH",
    6: "WF_TRANSFORM"
}

class Counter(Resource):
    isLeaf = True
    numberRequests = 0

    def render_GET(self, request):
        self.numberRequests += 1
        request.setHeader("content-type", "text/plain")
        return "I am request #" + str(self.numberRequests) + "\n"

class Logger(Resource):
    def render_OPTIONS(self, request):
        request.setHeader('Access-Control-Allow-Origin', 'http://192.168.1.10')
        request.setHeader('Access-Control-Allow-Methods', 'POST')
        request.setHeader('Access-Control-Allow-Headers', 'x-prototype-version,x-requested-with,Content-Type')
        request.setHeader('Access-Control-Max-Age', 2520) # 42 hours
        return ''

    def render_POST(self, request):
        newdata = request.content.getvalue()
        newdata = simplejson.loads(newdata)
        request.setHeader('Access-Control-Allow-Origin', 'http://192.168.1.10')
        request.setHeader('Access-Control-Allow-Methods', 'POST')
        request.setHeader('Access-Control-Allow-Headers', 'x-prototype-version,x-requested-with,Content-Type')
        request.setHeader('Access-Control-Max-Age', 2520) # 42 hours

        try:
            for a in newdata:
                if 'useraleVersion' in a:
                    if a['useraleVersion'].split('.')[0] == '3':
                        loggerv3.info(simplejson.dumps(a))

                elif ('parms' in a) and ('wf_state' in a['parms']):
                    a['wf_state_longname'] = wf_dict[a['parms']['wf_state']]

                    logger.info(simplejson.dumps(a))
        except e:
            logger_err.error(e)

        return ''

root = Resource()
root.putChild("kibana", kibana)
root.putChild("counter", Counter())
root.putChild("send_log", Logger())

reactor.listenTCP(80, Site(root))
reactor.run()


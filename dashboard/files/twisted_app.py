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

from twisted.web.server import Site
from twisted.web.static import File
from twisted.internet import reactor
from twisted.web.resource import Resource
from twisted.application import service, internet

import logging
import os
from logging import config
import logging.handlers

import simplejson


#KIBANA = '/home/vagrant/kibana-3.1.2'
ALLOW_ORIGIN = 'http://192.168.1.10'

if not os.path.exists('/var/log/xdata'):
    os.makedirs('/var/log/xdata')

# logging configuration
LOG_SETTINGS = {
    'version': 1,
    'handlers': {    
        'xdata-v2': {
            'class': 'logging.handlers.RotatingFileHandler',
            'level': 'INFO',
            'formatter': 'xdata',
            'filename': '/var/log/xdata/xdata-v2.log',
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
        'xdata-v2': {
            'level':'DEBUG',
            'handlers': ['xdata-v2',]
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

logger = logging.getLogger('xdata-v2')
loggerv3 = logging.getLogger('xdata-v3')
logger_err = logging.getLogger('error')

#kibana = File(KIBANA)

wf_dict = {
    0: "WF_OTHER",
    1: "WF_DEFINE",
    2: "WF_GETDATA",
    3: "WF_EXPLORE",
    4: "WF_CREATE",
    5: "WF_ENRICH",
    6: "WF_TRANSFORM"
}

class Logger(Resource):
    def render_OPTIONS(self, request):
        request.setHeader('Access-Control-Allow-Origin', ALLOW_ORIGIN)
        request.setHeader('Access-Control-Allow-Methods', 'POST')
        request.setHeader('Access-Control-Allow-Headers', 'x-prototype-version,x-requested-with,Content-Type')
        request.setHeader('Access-Control-Max-Age', 2520) # 42 hours
        return ''

    def render_POST(self, request):
        newdata = request.content.getvalue()
        newdata = simplejson.loads(newdata)
        request.setHeader('Access-Control-Allow-Origin', ALLOW_ORIGIN)
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
#root.putChild("kibana", kibana)
root.putChild("send_log", Logger())

# create a resource to serve static files
tmp_service = internet.TCPServer(80, Site(root))
application = service.Application("User-ALE")

# attach the service to its parent application
tmp_service.setServiceParent(application)

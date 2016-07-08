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

from twisted.web.server import Site
from twisted.web.static import File
from twisted.internet import reactor
from twisted.web.resource import Resource
from twisted.application import service, internet
from twisted.application.app import startApplication

import os
import sys
import logging
from logging import config
import logging.handlers

import argparse
import simplejson

parser = argparse.ArgumentParser(description='Export incoming JSON logs to a specified file.')
parser.add_argument('-c', '--config', type=str, help='Configuration file path.')
parser.add_argument('-p', '--port', type=int, default=80, help='Port for the TCP server to run on.')
parser.add_argument('-l', '--log-directory', type=str, help='Directory in which to output log files.')
parser.add_argument('--allow-origin', type=str,\
  help='List of string URLs to allow Cross-Origin requests from.', nargs='*')
arguments = parser.parse_known_args()[0]
valid_keys = set(['port', 'log_directory', 'allow_origin'])

if arguments.config is not None:
  with open(arguments.config, 'r') as config_file:
    settings = simplejson.loads(config_file.read())
else:
  settings = vars(arguments)

settings = { key: settings[key] for key in settings if key in valid_keys }

if 'port' not in settings:
  settings['port'] = 80
if 'log_directory' not in settings or settings['log_directory'] is None:
  print 'Missing required config parameter log_directory.'
  sys.exit(1)

if os.path.exists(settings['log_directory']):
    if not os.access(settings['log_directory'], os.W_OK):
        print 'Insufficient permissions to write to log directory %s' % settings['log_directory']
        sys.exit(1)
else:
    try:
        os.makedirs(settings['log_directory'])
    except:
        print 'Unable to create log directory %s' % settings['log_directory']
        sys.exit(1)

# logging configuration
LOG_SETTINGS = {
    'version': 1,
    'handlers': {    
        'xdata-js': {
            'class': 'logging.handlers.RotatingFileHandler',
            'level': 'INFO',
            'formatter': 'xdata',
            'filename': os.path.join(settings['log_directory'], 'xdata-js.log'),
            'mode': 'a',
            'maxBytes': 100e6,
            'backupCount': 10,
        },
        'xdata-v2': {
            'class': 'logging.handlers.RotatingFileHandler',
            'level': 'INFO',
            'formatter': 'xdata',
            'filename': os.path.join(settings['log_directory'], 'xdata-v2.log'),
            'mode': 'a',
            'maxBytes': 100e6,
            'backupCount': 10,
        },
        'xdata-v3': {
            'class': 'logging.handlers.RotatingFileHandler',
            'level': 'INFO',
            'formatter': 'xdata',
            'filename': os.path.join(settings['log_directory'], 'xdata-v3.log'),
            'mode': 'a',
            'maxBytes': 100e6,
            'backupCount': 10,
        },
        'file2': {
            'class': 'logging.handlers.RotatingFileHandler',
            'level': 'INFO',
            'formatter': 'detailed',
            'filename': os.path.join(settings['log_directory'], 'xdata-error.log'),
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
        'xdata-js': {
            'level':'DEBUG',
            'handlers': ['xdata-js',]
        },
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

logger_js = logging.getLogger('xdata-js')
logger = logging.getLogger('xdata-v2')
loggerv3 = logging.getLogger('xdata-v3')
logger_err = logging.getLogger('error')

wf_dict = {
    0: 'WF_OTHER',
    1: 'WF_DEFINE',
    2: 'WF_GETDATA',
    3: 'WF_EXPLORE',
    4: 'WF_CREATE',
    5: 'WF_ENRICH',
    6: 'WF_TRANSFORM'
}

def get_allow_origin(request):
    if 'allow_origin' not in settings or settings['allow_origin'] is None:
        return '*'
    elif isinstance(settings['allow_origin'], list):
        origin = request.getHeader('Origin')
        return 'null' if origin not in settings['allow_origin'] else origin
    else:
        return settings['allow_origin']

def log_json(data):
    if ('toolVersion' in data):
        logger_js.info(simplejson.dumps(data))
    elif ('useraleVersion' in data) and (data['useraleVersion'].split('.')[0] == '3'):
        loggerv3.info(simplejson.dumps(data))
    elif ('parms' in data) and ('wf_state' in data['parms']):
        data['wf_state_longname'] = wf_dict[data['parms']['wf_state']]
        logger.info(simplejson.dumps(data))

class Logger(Resource):
    def render_OPTIONS(self, request):
        request.setHeader('Access-Control-Allow-Origin', get_allow_origin(request))
        request.setHeader('Access-Control-Allow-Methods', 'POST')
        request.setHeader('Access-Control-Allow-Headers', 'x-prototype-version,x-requested-with,Content-Type')
        request.setHeader('Access-Control-Max-Age', 2520) # 42 hours
        return ''

    def render_POST(self, request):
        request.setHeader('Access-Control-Allow-Origin', get_allow_origin(request))
        request.setHeader('Access-Control-Allow-Methods', 'POST')
        request.setHeader('Access-Control-Allow-Headers', 'x-prototype-version,x-requested-with,Content-Type')
        request.setHeader('Access-Control-Max-Age', 2520) # 42 hours
        data = simplejson.loads(request.content.getvalue())

        try:
            if isinstance(data, list):
                for datum in data:
                    log_json(datum)
            else:
                log_json(data)
        except Exception as e:
            logger_err.error(e)

        return ''

root = Resource()
root.putChild('send_log', Logger())

# create a resource to serve static files
tmp_service = internet.TCPServer(settings['port'], Site(root))
application = service.Application('User-ALE')

# attach the service to its parent application
tmp_service.setServiceParent(application)
startApplication(application, 0)
reactor.run()

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

# Delete XData indexes
curl -XDELETE 'http://localhost:9200/xdata_v3/'
curl -XDELETE 'http://localhost:9200/xdata_v2/'
curl -XDELETE 'http://localhost:9200/xdata_old/'

# Create XData indexes (even though logstash will create them automatically)
curl -XPUT 'http://localhost:9200/xdata_v3/'
curl -XPUT 'http://localhost:9200/xdata_v2/'
curl -XPUT 'http://localhost:9200/xdata_old/'

# Remove .sincedb file to trigger logstash to reindex all xdata_* data
rm /var/lib/logstash/.sincedb_*
service logstash start

PIDFILE=$HOME/twistd.pid

if [ -f $PIDFILE ]; then
	echo 'Twisted Running, Killing it!'
    sudo -E kill `cat $PIDFILE`
fi

sudo -E twistd --pidfile=$PIDFILE -y twisted_app.py
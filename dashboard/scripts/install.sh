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

ELASTIC="elasticsearch-2.2.0"
LOGSTASH="logstash_2.2.2"
KIBANA="kibana-4.4.1-linux-x64"
ES_LOG="/var/log/elasticsearch"
ES_DATA="/var/lib/elasticsearch"
ES_CONFIG="/etc/elasticsearch"
ES_BIN="/usr/share/elasticsearch/bin"

# Latest and greatest source packages
MINICONDA_SCRIPT="https://repo.continuum.io/miniconda/Miniconda-latest-Linux-x86_64.sh"
ELASTIC_DPKG_SRC="https://download.elasticsearch.org/elasticsearch/elasticsearch/$ELASTIC.deb"
LOGSTASH_DPKG_SRC="https://download.elastic.co/logstash/logstash/packages/debian/$LOGSTASH-1_all.deb"
KIBANA_SRC="https://download.elastic.co/kibana/kibana/$KIBANA.tar.gz"

# Update box & install openjdk & miniconda
sudo -E apt-get update                             || exit $?
sudo -E apt-get -y install openjdk-7-jdk           || exit $?
wget -q $MINICONDA_SCRIPT						   || exit $?                          
chmod +x ./Miniconda-*.sh         				   || exit $?
./Miniconda-*.sh -b               				   || exit $?

echo export PATH="$HOME/miniconda2/bin:$PATH" >> $HOME/.bashrc
source $HOME/.bashrc
$HOME/miniconda2/bin/conda update --yes conda      || exit $?

# Install Elastic
wget -q $ELASTIC_DPKG_SRC $LOGSTASH_DPKG_SRC       || exit $?
sudo dpkg -i $ELASTIC.deb             		   	   || exit $?
sudo dpkg -i $LOGSTASH-1_all.deb    		 	   || exit $?

# Install Elastic HQ Plugin
sudo $ES_BIN/plugin install royrusso/elasticsearch-HQ	|| exit $?

# Download and install Kibana to the vagrant box. 
wget -q $KIBANA_SRC                                           			|| exit $?
tar -xvf $HOME/$KIBANA.tar.gz 			              	  				|| exit $?
sudo cp /vagrant/files/config/elasticsearch.yml /etc/elasticsearch/		|| exit $?
sudo cp /vagrant/files/config/xdata.conf /etc/logstash/conf.d/      	|| exit $?
sudo cp /vagrant/files/twisted_app.py $HOME/       			  			|| exit $?
sudo cp /vagrant/files/config/kibana.yml $HOME/$KIBANA/config/ 			|| exit $?
# Startup Kibana
sudo $HOME/$KIBANA/bin/kibana 											|| exit $?

# Restart all the services to ensure the configurations are being used properly
# and Run the kibana twisted web server so the developer has access to the
# dashboad provided by Kibana.
sudo mkdir /var/log/xdata                         	|| exit $?
sudo touch /var/log/xdata/xdata.log               	|| exit $?

# This may need to be rewritten
# Simply create .kibana index and add dashboard there?
#cp /vagrant/files/data/XDATA-Dashboard-v3.json $HOM#E/$KIBANA/app/dashboards/default.json  || exit $?
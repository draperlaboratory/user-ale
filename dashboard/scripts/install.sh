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

# Latest and greatest source packages
MINICONDA_SCRIPT="https://repo.continuum.io/miniconda/Miniconda-latest-Linux-x86_64.sh"

# Update box & install openjdk and mongodb
sudo -E apt-get update                             || exit $?
sudo -E apt-get -y install openjdk-7-jdk           || exit $?
sudo -E apt-get -y install mongodb				   || exit $?

# Install Miniconda
wget -q $MINICONDA_SCRIPT						   || exit $?                          
chmod +x ./Miniconda-*.sh         				   || exit $?
./Miniconda-*.sh -b               				   || exit $?
echo export PATH="$HOME/miniconda2/bin:$PATH" >> $HOME/.bashrc
source $HOME/.bashrc
$HOME/miniconda2/bin/conda update --yes conda      || exit $?

# Install Elasticsearch
wget -qO - https://packages.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add - 
echo "deb http://packages.elastic.co/elasticsearch/2.x/debian stable main" | sudo tee -a /etc/apt/sources.list.d/elasticsearch-2.x.list 
sudo -E apt-get update 								|| exit $?
sudo -E apt-get -y install elasticsearch 			|| exit $?

# Install Elastic HQ Plugin
sudo /usr/share/elasticsearch/bin/plugin install royrusso/elasticsearch-HQ	|| exit $?

# Install Logstash
echo "deb http://packages.elastic.co/logstash/2.2/debian stable main" | sudo tee -a /etc/apt/sources.list.d/logstash-2.2.x.list
sudo -E apt-get update 								|| exit $?
sudo -E apt-get -y install logstash 				|| exit $?

# Install Kibana
echo "deb http://packages.elastic.co/kibana/4.4/debian stable main" | sudo tee -a /etc/apt/sources.list.d/kibana-4.4.x.list
sudo -E apt-get update 								|| exit $?
sudo -E apt-get -y install kibana 					|| exit $?

# Copy over configuration files
sudo cp /vagrant/files/config/elasticsearch.yml /etc/elasticsearch/		|| exit $?
sudo cp /vagrant/files/config/xdata.conf /etc/logstash/conf.d/      	|| exit $?
sudo cp /vagrant/files/twisted_app.py $HOME/       			  			|| exit $?
sudo cp /vagrant/files/config/kibana.yml /opt/kibana/config/ 			|| exit $?

# Restart all the services to ensure the configurations are being used properly
# and Run the kibana twisted web server so the developer has access to the
# dashboad provided by Kibana.
sudo mkdir /var/log/xdata                         	|| exit $?
sudo touch /var/log/xdata/xdata.log               	|| exit $?

# This may need to be rewritten
# Simply create .kibana index and add dashboard there?
#cp /vagrant/files/data/XDATA-Dashboard-v3.json $HOME/$KIBANA/app/dashboards/default.json  || exit $?

# Register cron job to execute backup.sh every 6 hours
# ┌───────────── min (0 - 59) 
# │ ┌────────────── hour (0 - 23)
# │ │ ┌─────────────── day of month (1 - 31)
# │ │ │ ┌──────────────── month (1 - 12)
# │ │ │ │ ┌───────────────── day of week (0 - 6) (0 to 6 are Sunday to Saturday, or use names; 7 is Sunday, the same as 0)
# │ │ │ │ │
# │ │ │ │ │
# * * * * *  command to execute
sudo chmod +x /vagrant/files/scripts/backup.sh 		|| exit $?
sudo crontab -l | { cat; echo "0 */6 * * * /vagrant/files/scripts/backup.sh > /dev/null 2>&1"; } | crontab - || exit $?

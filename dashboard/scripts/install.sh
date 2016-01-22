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
MINICONDA_SCRIPT="http://repo.continuum.io/miniconda/Miniconda-3.7.0-Linux-x86_64.sh"
ELASTIC_DPKG_SRC="https://download.elasticsearch.org/elasticsearch/elasticsearch/elasticsearch-1.4.2.deb"
LOGSTASH_DPKG_SRC="https://download.elasticsearch.org/logstash/logstash/packages/debian/logstash_1.4.2-1-2c0f5a1_all.deb"
KIBANA_SRC="https://download.elasticsearch.org/kibana/kibana/kibana-3.1.2.tar.gz"

sudo -E apt-get update                             || exit $?
sudo -E apt-get -y install openjdk-7-jdk           || exit $?
wget -q $MINICONDA_SCRIPT                          || exit $?
chmod +x ./Miniconda-3.7.0-Linux-x86_64.sh         || exit $?
./Miniconda-3.7.0-Linux-x86_64.sh -b               || exit $?

echo export PATH="$HOME/miniconda/bin:$PATH" >> $HOME/.bashrc
source $HOME/.bashrc
$HOME/miniconda/bin/conda update --yes conda     || exit $?

wget -q $ELASTIC_DPKG_SRC $LOGSTASH_DPKG_SRC     || exit $?
sudo dpkg -i elasticsearch-1.4.2.deb             || exit $?
sudo dpkg -i logstash_1.4.2-1-2c0f5a1_all.deb    || exit $?

# Download and install Kibana to the vagrant box. This involves downloading
# Kibana 3.1.2, extracting the contents of the tar ball, and copying the
# kibanan files to /etc/elasticsearch and /etc/logstash
wget -q $KIBANA_SRC                                           || exit $?
tar -xvf kibana-3.1.2.tar.gz                                  || exit $?
sudo cp /vagrant/files/elasticsearch.yml /etc/elasticsearch/  || exit $?
sudo cp /vagrant/files/xdata.conf /etc/logstash/conf.d/       || exit $?
sudo cp /vagrant/files/twisted_app.py $HOME/       || exit $?

# Restart all the services to ensure the configurations are being used properly
# and Run the kibana twisted web server so the developer has access to the
# dashboad provided by Kibana.
sudo mkdir /var/log/xdata                          || exit $?
sudo touch  /var/log/xdata/xdata.log               || exit $?

cp /vagrant/files/XDATA-Dashboard-v3.json $HOME/kibana-3.1.2/app/dashboards/default.json  || exit $?

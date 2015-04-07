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

#wget http://09c8d0b2229f813c1b93-c95ac804525aac4b6dba79b00b39d1d3.r79.cf1.rackcdn.com/Anaconda-2.1.0-Linux-x86_64.sh
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

# Restart all the services to ensure the configurations are being used properly
# and Run the kibana twisted web server so the developer has access to the
# dashboad provided by Kibana.
sudo mkdir /var/log/xdata                          || exit $?
sudo touch  /var/log/xdata/xdata.log               || exit $?

cp /vagrant/files/XDATA-Dashboard-v3 $HOME/kibana-3.1.2/app/dashboards/default.json  || exit $?

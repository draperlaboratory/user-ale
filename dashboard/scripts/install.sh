#!/usr/bin/env bash

sudo -E apt-get update

sudo -E apt-get -y install openjdk-7-jdk

wget http://repo.continuum.io/miniconda/Miniconda-3.7.0-Linux-x86_64.sh

bash Miniconda-3.7.0-Linux-x86_64.sh -b

#wget http://09c8d0b2229f813c1b93-c95ac804525aac4b6dba79b00b39d1d3.r79.cf1.rackcdn.com/Anaconda-2.1.0-Linux-x86_64.sh


echo export PATH="/home/vagrant/miniconda/bin:$PATH" >> $HOME/.bashrc

source $HOME/.bashrc

conda update --yes conda

wget https://download.elasticsearch.org/elasticsearch/elasticsearch/elasticsearch-1.4.2.deb
sudo dpkg -i elasticsearch-1.4.2.deb 
sudo service elasticsearch start

wget https://download.elasticsearch.org/logstash/logstash/packages/debian/logstash_1.4.2-1-2c0f5a1_all.deb
sudo dpkg -i logstash_1.4.2-1-2c0f5a1_all.deb
sudo service logstash start

wget https://download.elasticsearch.org/kibana/kibana/kibana-3.1.2.tar.gz
tar -xvf kibana-3.1.2.tar.gz

sudo cp /vagrant/files/elasticsearch.yml /etc/elasticsearch/
sudo cp /vagrant/files/xdata.conf /etc/logstash/conf.d/

#config
#/etc/elasticsearch/elasticsearch.yml

#logstash conf
# /etc/logstash/conf.d/test.conf

#sudo twistd -y twisted_app.py
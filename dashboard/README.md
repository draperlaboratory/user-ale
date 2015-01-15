# User-ALE Dashboard

Fully running User-ALE

## Getting Started

## Install Dependencies

- Install Vagrant
- Install VirtualBox

## Start Vagrant

This will provision the base box which is an Ubuntu 14.04 machine.

    vagrant up

## SSH into Vagrant

    vagrant ssh

## Install necessary packages

    bash /vagrant/scripts/install.sh

## Set indices in ElasticSearch

    bash /vagrant/scripts/restart.sh

## Start Twisted Server

    sudo twistd -y /vagrant/twisted_app.py

## Go to Kibana at http://localhost:9000/kibana

## Send logs by going here: http://localhost:9000/test/
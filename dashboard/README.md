# User-ALE Dashboard

Fully running User-ALE

## Getting Started

## Install Dependencies

- Install Vagrant
-    (This may require downloading the newest version from their website rather than trusting apt-get)
- Install VirtualBox

## If behind a proxy, modify Vagrantfile
- Modifiy the vagantfile to point to your proxy. 
- 	Don't forget to add "http://" as leaving that off may break apt-get in the vagrant vm
	Example: config.proxy.http="http://1.2.3.4:5678"
	If your host system is also the proxy (e.g. CNTLM):
	   setting the proxy as http://127.0.0.1:3128 or localhost may confuse the Vagrant VM and prevent net access

## Start Vagrant

This will provision the base box which is an Ubuntu 14.04 machine.

    vagrant up

## SSH into Vagrant

    vagrant ssh

## Install necessary packages

    bash /vagrant/scripts/install.sh
        See script comments if errors arise

## Set indices in ElasticSearch

    bash /vagrant/scripts/restart.sh

## (Re)Start Twisted Server

    sudo twistd -y /vagrant/twisted_app.py

## Go to Kibana at http://localhost:9000/kibana

## Send logs by going here: http://localhost:9000/test/

<img src="https://raw.githubusercontent.com/draperlaboratory/user-ale/gh-pages/img/user-ale-small.png"/>

##Background

The User Activity Logging Engine, or User-ALE, is a logging mechanism used to quantitatively assess the behavioural and cognitive state of a data analyst while interacting with Big Data Exploitation Systems (BDES).

To accurately measure the cognitive state of the user, tool developers associate model based workflow states with each user action. Did a user pan a map? Then they are exploring. Did a user click a search button? Then they are getting new data. These model based activities can then be processed to measure hidden empirical states that describe more accurately the user's workflow and behaviour.

##Who is the package for?

This package is for developers creating User facing tools, and who would like to log the users' interaction with this tool, in order to gain an insight into the behavioural and cognitive state of the user.


Want to learn more? See the [wiki](https://github.com/draperlaboratory/user-ale/wiki).

Want to see an example client? Check out the [demo](http://draperlaboratory.github.io/user-ale/test_app/index.html).

## Quick Startup Guide

### 1. Install Dependencies

- Install Vagrant
  - https://www.vagrantup.com
- Install VirtualBox
  - https://www.virtualbox.org/wiki/Downloads

#### If behind a proxy, modify Vagrantfile
- Modifiy the vagantfile to point to your proxy. 
- Don't forget to add "http://" as leaving that off may break apt-get in the vagrant vm
- Example: config.proxy.http="http://1.2.3.4:5678"
- If your host system is also the proxy (e.g. CNTLM): setting the proxy as http://127.0.0.1:3128 or localhost may confuse the Vagrant VM and prevent net access

### 2. Startup Vagrant ELK and Developer

This will provision the base box which is an Ubuntu 14.04 machine. The ELK server is running on http://192.16.1.100 while the developer box is running on http://192.16.1.10

    vagrant up elk
    vagrant up developer

### 3. Go to Kibana Dashboard here: http://192.16.1.100:5601

### Send logs by going here: http://192.16.1.10/test

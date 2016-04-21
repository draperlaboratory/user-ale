<img src="https://raw.githubusercontent.com/draperlaboratory/user-ale/gh-pages/img/user-ale-small.png"/>

##Background

The User Analytic Logging Engine (User ALE) is part of Draper's Softare as a Sensor™ Project. User ALE is for Software Developers, HCI/UX researchers, and project managers who develop user facing software tools—applications that are used for manipulating, analyzing, or visualizing data or other systems. 

User ALE provides an API for instrumenting software tools, turning them into a human usability sensors. With every user interaction User ALE will transmit specially structured messages (JSON) from software tools to an activity logging server (Elastic). These messages not only report user activities and their timing, but provide sufficient context to understand how those activities are related to the functional organization of the software tool. This allows for greater utility in understanding how users are interacting with software tool features, and seeds more rigorous modeling and analytic approaches to understand not just what users do in software tools, but how they perform tasks with them.

User ALE provides data provides insight into software tool usage frequency, users' cognitive/behavioral strategy in using tools to complete tasks, their workflows, as well as their integrative use of software tool features. 

##Who is the package for?

The User Analytic Logging Engine (User ALE) is for Software Developers, HCI/UX researchers, and project managers who develop user facing software tools.

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

### 2. Startup Vagrant ELK Stack and Developer

This will provision the base box which is an Ubuntu 14.04 machine. The ELK server is running on http://192.16.1.100 while the developer box is running on http://192.16.1.10

    vagrant up elk
    vagrant up developer

### 3. Send logs by using our test-app: http://192.16.1.10/test
####View the logs you send on the test-app Kibana Dashboard: http://192.16.1.100:5601


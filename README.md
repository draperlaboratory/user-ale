#User-ALE

##Background

The User Activity Logging Engine, or User-ALE, is a logging mechanism used to quantitatively assess the behavioural and cognitive state of a data analyst while interacting with Big Data Exploitation Systems (BDES).

To accurately measure the cognitive state of the user, tool developers associate model based workflow states with each user action. Did a user pan a map? Then they are exploring. Did a user click a search button? Then they are getting new data. These model based activities can then be processed to measure hidden empirical states that describe more accurately the user's workflow and behaviour.

##Who is the package for?

This package is for developers creating User facing tools, and who would like to log the users interaction with this tool, in order to gain an insight into the behavioural and cognitive state of the user.

##JavaScript Quickstart
Download both the latest logging library and the latest worker library from Github.

###Instantiate the JavaScript Logger
```javascript
// web worker url
var worker = 'js/draper.activity_worker-2.1.1.js'
var ac = new activityLogger(worker);
.testing(true) // simulate POST, won't send log
.echo(true) // log to console
.mute(['SYS']); // don't log SYSTEM actions
```

###Register the logger
```javascript
ac.registerActivityLogger(
  "http://xd-draper.xdata.data-tactics-corp.com:1337", 
  "my-component", 
  "v0.1"
  );
```

###Log a User Action
```javascript
$('#button').mouseenter(function() {
  ac.logUserActivity(
  'User hovered over element to read popup', // description
  'hover_start', // activity_code
  ac.WF_EXPLORE // workflow State
  );
})
```

## ELK Stack Getting Started

## Install Dependencies

- Install Vagrant
	(This may require downloading the newest version from their website rather than trusting apt-get)
- Install VirtualBox

## If behind a proxy, modify Vagrantfile
- Modifiy the vagantfile to point to your proxy. 
- Don't forget to add "http://" as leaving that off may break apt-get in the vagrant vm
- Example: config.proxy.http="http://1.2.3.4:5678"
- If your host system is also the proxy (e.g. CNTLM): setting the proxy as http://127.0.0.1:3128 or localhost may confuse the Vagrant VM and prevent net access

## Start Vagrant

This will provision the base box which is an Ubuntu 14.04 machine. The Kibana/ELK server is running on http://192.168.86.100 while the developer box is running on http://192.168.86.10

    vagrant up

## Go to Kibana Dashboard at http://192.168.86.100/kibana

## Send logs by going here: http://192.168.86.10/test
---
layout: page
title: JavaScript Quickstart
prev_section: drafts
next_section: variables
permalink: /quickstart/
---

<div class="step">
  <h4>Download both the JavaScript helper logging library and the worker library</h4>
  <h3 class="dl-link"><a href="https://raw.githubusercontent.com/draperlaboratory/User-ALE/master/helper-libs/javascript/draper.activity_logger-2.1.1.js" download><span class="label label-primary">draper.activity_logger-2.1.1.js</span></a> </h3>
  <h3 class="dl-link"><a href="https://raw.githubusercontent.com/draperlaboratory/User-ALE/master/helper-libs/javascript/draper.activity_worker-2.1.1.js" download><span class="label label-primary">draper.activity_worker-2.1.1.js</span></a> </h3>
</div>

<div class="step">
  <h4>Include the logging library</h4>
  {% highlight html %}
<script src="js/draper.activity_logger-2.1.1.js"></script>
    {% endhighlight %}
</div>

<div class="step">
  <h4>Instantiate the Logger</h4>
{% highlight javascript %}
// web worker url
var worker = 'js/draper.activity_worker-2.1.1.js'
var ac = new activityLogger(worker);
.testing(true) // simulate POST, won't send log
.echo(true) // log to console
.mute(['SYS']); // don't log SYSTEM actions
{% endhighlight %}
</div>

<div class="alert alert-warning" role="alert">
  If you plan to distribute software that is instrumented using User-ALE, please set testing=true to ensure that logging is not automatically turned on.
</div>

<div class="step">
  <h4>Register the Logger</h4>
  {% highlight javascript %}
ac.registerActivityLogger(
"http://xd-draper.xdata.data-tactics-corp.com:1337",
"my-component",
"v0.1"
);
  {% endhighlight %}
</div>


<div class="step">
  <h4>Log a User Activity</h4>
  {% highlight javascript %}
$('#button').mouseenter(function() {
ac.logUserActivity(
'User hovered over element to read popup', // description
'hover_start', // activity_code
ac.WF_EXPLORE // workflow State
);
})
  {% endhighlight %}
</div>

<div class="step">
<h4>Log a System Activity</h4>
{% highlight javascript %}
ac.logSystemActivity('asking server for data.');

$.getJSON('https://my_endpoint/get_data', data, function(data) {
  ac.logSystemActivity('received data from server.');
  $("#result").text(data.result);
});
  {% endhighlight %}
</div>
/**
* Draper activityLogger
*
* The purpose of this module is allow XDATA Developers to easily add a logging
* mechanism into their own modules for the purposes of recording the behaviors
* of the analysists using their tools.
*
* @author Draper Laboratory
* @date 2014
* @version 2.1.1
*/

/*jshint unused:false*/
function activityLogger(webWorkerURL) {
    'use strict';
    var draperLog = {version: "2.1.2"}; // semver
    draperLog.worker = new Worker(webWorkerURL);

    var muteUserActivityLogging = false,
    muteSystemActivityLogging = false,
    logToConsole = false,
    testing = false,
    workflowCodingVersion = '2.0';

    // Workflow Codes
    draperLog.WF_OTHER       = 0;
    draperLog.WF_DEFINE      = 1;
    draperLog.WF_GETDATA     = 2;
    draperLog.WF_EXPLORE     = 3;
    draperLog.WF_CREATE      = 4;
    draperLog.WF_ENRICH      = 5;
    draperLog.WF_TRANSFORM   = 6;


    // User intent enumeration. This allows the developer to select a finite list
    // of intents the user maybe doing in order to log the event properly.
    draperLog.LOGGING_INTENT = {
        ADD        : "add",
        REMOVE     : "remove",
        CREATE     : "create",
        DELETE     : "delete",
        SELECT     : "select",
        ENTER      : "enter",
        LEAVE      : "leave",
        EXEC       : "execute",
        EXPLORE    : "explore",
        INSPECT    : "inspect",
    };

    // User Action: This allows the developer to select a finite actions the 
    // developer is performing within the application.
    draperLog.LOGGING_ACTION = {
        SCROLL     :   "scroll",
        KEYPRESS   :   "keypress",
        TYPE       :   "type",
        SELECT     :   "click",
        ZOOM       :   "zoom",
        HOVER      :   "hover",
        DROP       :   "drop",
        DRAG       :   "drag",
        CLICK      :   "click",
        DBLCLK     :   "dblclk",
    };

    // draperLog.LOGGING_COMPONENT = {
    //     WINDOW       : "window",
    //     FRAME        : "frame",
    //     MAP          : "map",
    //     CANVAS       : "canvas",
    //     BUTTON       : "button",
    //     RADIO_BUTTON : "radio_btn",
    //     CHECKBOX     : "checkbox",
    //     TEXTBOX      : "textbox",
    //     LIST         : "list",
    //     TABLE        : "table",

    //     // Other is used in conjunction with softwareMetadata in order
    //     // to provide a component in which is not currently listed within
    //     // the COMPONENT list.
    //     OTHER        : "other",
    // }


    /**
    * Registers this component with Draper's logging server.  The server creates
    * a unique session_id, that is then used in subsequent logging messages.  This
    * is a blocking ajax call to ensure logged messages are tagged correctly.
    * @todo investigate the use of promises, instead of the blocking call.
    *
    * @method registerActivityLogger
    * @param {String} url the url of Draper's Logging Server
    * @param {String} componentName the name of this component
    * @param {String} componentVersion the version of this component
    */
    draperLog.registerActivityLogger = function(url, componentName, componentVersion) {

        draperLog.url = url;
        draperLog.componentName = componentName;
        draperLog.componentVersion = componentVersion;

        // get session id from url
        function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }

        draperLog.sessionID = getParameterByName('USID');
        draperLog.clientHostname = getParameterByName('client');

        if (!draperLog.sessionID) {
            draperLog.sessionID = draperLog.componentName.slice(0,3) + new Date().getTime();
        }

        if (!draperLog.clientHostname) {
            draperLog.clientHostname = 'UNK';
        }

        // set the logging URL on the Web Worker
        draperLog.worker.postMessage({
            cmd: 'setLoggingUrl',
            msg: url
        });

        // Felipe: Commented this out currently so we don't have a mix of logs being 
        // sent to the log server.
        //classListener();

        if (logToConsole) {
            if (testing) {
                console.log('DRAPER LOG: (TESTING) Registered Activity Logger ' + draperLog.sessionID);
            } else {
                console.log('DRAPER LOG: Registered Activity Logger ' + draperLog.sessionID);
            }
        }

        draperLog.worker.postMessage({
            cmd: 'sendBuffer',
            msg: ''
          });

        // Log the activity that we are closing the window of the web browser
        // before we exit. In order to do this, we register a onBeforeUnload 
        // callback which logs the closing and sends the buffer.
        window.onbeforeunload = function(e){
            draperLog.logUserActivity(
                draperLog.LOGGING_INTENT.REMOVE,
                
                // This could be a number of ways
                // in which this could be closed.
                draperLog.LOGGING_ACTION.CLICK,

                // The type of object that is being used.
                "draper_browser");

            // Since the window is closing and the script will be forced closed,
            // ensure the buffer is being sent to the server.
            draperLog.worker.postMessage({
                cmd: 'sendBuffer',
                msg: ''});
        };

        // Log the activity when the user gains focus on the web browser
        // window. In order to do this, we register an onFocus callback function
        // which will log the gained focus of the element.
        window.onfocus = function(e) {
            console.log(e.detail);
            draperLog.logUserActivity(
                draperLog.LOGGING_INTENT.ENTER,
                
                // This could be a number of ways the window
                // focus was gained
                draperLog.LOGGING_ACTION.CLICK,
                
                // The type of object that is being used.
                "draper_browser");
        };

        // Log the activity when the user leaves focus on the web browser
        // window. In order to do this, we register an onBlur callback function
        // which will log the lost focus
        window.onblur = function(e) {
            console.log(e.detail);
            draperLog.logUserActivity(
                draperLog.LOGGING_INTENT.LEAVE,
                
                // This could be a number of ways the window
                // focus was gained
                draperLog.LOGGING_ACTION.CLICK,
                
                // The type of object that is being used.
                "draper_browser");
        };

        return draperLog;
    };

    /**
    * Create USER activity message.
    *
    * @method logUserActivity
    * @param {LOGGING_INTENT} userIntent a description of the natural activity that is being performed.
    * @param {LOGGING_ACTION} userActivity a more user input specific action the user is doing.
    * @param {JSON} componentInfo is a more generalized component information. This will contain 
    * a specific component type and component ID
    * @param {JSON} softwareMetadata any arbitrary JSON that may support this activity
    */
    draperLog.logUserActivity = function (userIntent, userActivity, componentId, softwareMetadata) 
    {
        if(!muteUserActivityLogging) {
            // Construct the initial log message with the information provided by the user.
            // This will allow us to see what is being logged by the developer.
            var msg = {
                type: 'USERACTION',
                parms: {
                    desc: userIntent,
                    activity: userActivity,
                    wf_state: {},
                    wf_version: workflowCodingVersion,
                    component: componentId,
                },
                meta: softwareMetadata
            };
            sendMessage(msg);

      if (logToConsole) {
        if (testing) {
          console.log('DRAPER LOG: (TESTING) Logging UserActivity', msg.parms);
        } else {
          console.log('DRAPER LOG: Logging UserActivity', msg.parms);
        }
      }
        }
    };

    /**
    * Create SYSTEM activity message.
    *
    * @method logSystemActivity
    * @param {String} actionDescription a description of the activity in natural language.
    * @param {JSON} softwareMetadata any arbitrary JSON that may support this activity
    */
    draperLog.logSystemActivity = function (actionDescription, softwareMetadata) {

        if(!muteSystemActivityLogging) {
            var msg = {
                type: 'SYSACTION',
                parms: {
                    desc: actionDescription,
                },
                meta: softwareMetadata
            };
            sendMessage(msg);

      if (logToConsole) {
        if (testing) {
          console.log('DRAPER LOG: (TESTING) Logging SystemActivity', msg.parms);
        } else {
          console.log('DRAPER LOG: Logging SystemActivity', msg.parms);
        }
      }
        }
    };

    /**
    * Send activity message to Draper's logging server.  This function uses Jquery's ajax
    * function to send the created message to draper's server.
    *
    * @method sendMessage
    * @param {JSON} msg the JSON message.
    */
    function sendMessage(msg) {
        msg.timestamp = new Date().toJSON();
        msg.client = draperLog.clientHostname;
        msg.component = {name: draperLog.componentName, version: draperLog.componentVersion};
        msg.sessionID = draperLog.sessionID;
        msg.impLanguage = 'JavaScript';
        msg.apiVersion = draperLog.version;

        if (!testing) {
            draperLog.worker.postMessage({
            cmd: 'sendMsg',
            msg: msg
          });
        }
    }

    /**
    * When set to true, logs messages to browser console.
    *
    * @method echo
    * @param {Boolean} set to true to log to console
    */
    draperLog.echo = function(d) {
        if (!arguments.length) { return logToConsole; }
        logToConsole = d;
        draperLog.worker.postMessage({
        cmd: 'setEcho',
        msg: d
      });
        return draperLog;
    };

   /**
    * Accepts an array of Strings telling logger to mute those type of messages.
    * Possible values are 'SYS' and 'USER'.  These messages will not be sent to
    * server.
    *
    * @method mute
    * @param {Array} array of strings of messages to mute.
    */
    draperLog.mute = function(d) {
        d.forEach(function(d) {
            if(d === 'USER') { muteUserActivityLogging = true; }
            if(d === 'SYS') { muteSystemActivityLogging = true; }
        });
        return draperLog;
    };

    draperLog.unmute = function(d) {
        d.forEach(function(d) {
          if(d === 'USER') { muteUserActivityLogging = false; }
          if(d === 'SYS') { muteSystemActivityLogging = false; }
        });
        return draperLog;
    };

   /**
    * When set to true, no connection will be made against logging server.
    *
    * @method testing
    * @param {Boolean} set to true to disable all connection to logging server
    */
    draperLog.testing = function(d) {
        if (!arguments.length) { return testing; }
        testing = d;
        draperLog.worker.postMessage({
        cmd: 'setTesting',
        msg: d
      });
        return draperLog;
    };

   /**
    * DOM Listener for specific events.
    *
    */
    function classListener() {

        $(document).ready(function() {
            $(".draper").each(function(i,d){
                $(d).on("click", function(a){
                    draperLog.logUserActivity('User clicked element', 
                                              $(this).data('activity'),
                                              $(this).data('wf'));
                });
            });

            $(window).scroll(function() {
                clearTimeout($.data(this, 'scrollTimer'));
                $.data(this, 'scrollTimer', setTimeout(function() {
                    draperLog.logUserActivity('User scrolled window', 'scroll', 3);
                }, 500));
            });
        });
    }

    /**
     * @brief [brief description]
     * @details [long description]
     * 
     * @param elem [description]
     * @param msg [description]
     */
    draperLog.tag = function(elem, msg) {
        $.each(msg.events, function(i, d) {
            if (d === 'scroll') {
                console.log('found scroll');
                $(elem).scroll(function() {
                    clearTimeout($.data(this, 'scrollTimer'));
                    $.data(this, 'scrollTimer', setTimeout(function() {
                        draperLog.logUserActivity('User scrolled window', 'scroll', 3);
                    }, 500));
                });
            }else{
                $(elem).on(d, function() {
                    draperLog.logUserActivity(msg.desc, msg.activity, msg.wf_state);
                });
            }
        });
    };

    // Return the activity logger object in which is created. With this, 
    // object functions and variable are created to keep this a separate instance
    // of the logger.
    return draperLog;
}
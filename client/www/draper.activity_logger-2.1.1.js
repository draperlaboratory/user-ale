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


    // User activity enumeration. This allows the developer to select a finite list
    // of activities the user maybe doing in order to log the event properly.
    draperLog.LOGGING_ACTIVITY = {
        ADD        : "add",
        REMOVE     : "remove",
        CREATE     : "create",
        DELETE     : "delete",
        SELECT     : "select",
        DESELECT   : "deselect",
        ENTER      : "enter",
        LEAVE      : "leave",
        INSPECT    : "inspect",
        ALTER      : "alter",
        HIDE       : "hide",
        SHOW       : "show",
    };

    draperLog.LOGGING_COMPONENT = {
        BUTTON        : "button",
        CANVAS        : "canvas",
        CHECKBOX      : "checkbox",
        COMBOBOX      : "combobox",
        DATAGRID      : "datagrid",
        DIALOGBOX     : "dialog_box",
        DROPDOWNLIST  : "dropdownlist",
        FRAME         : "frame",
        ICON          : "icon",
        INFOBAR       : "infobar",
        LABEL         : "label",
        LINK          : "link",
        LISTBOX       : "listbox",
        MAP           : "map",
        MENU          : "menu",
        MODALWINDOW   : "modalwindow",
        PALETTEWINDOW : "palettewindow",
        PANEL         : "panel",
        PROGRESSBAR   : "progressbar",
        RADIOBUTTON   : "radiobutton",
        SLIDER        : "slider",
        SPINNER       : "spinner",
        STATUSBAR     : "statusbar",
        TAB           : "tab",
        TABLE         : "table",
        TAG           : "tag",
        TEXTBOX       : "textbox",
        THROBBER      : "throbber",
        TOAST         : "toast",
        TOOLBAR       : "toolbar",
        TOOLTIP       : "tooltip",
        TREEVIEW      : "treeview",
        WINDOW        : "window",
        WORKSPACE     : "workspace",

        // Other is used in conjunction with softwareMetadata in order
        // to provide a component in which is not currently listed within
        // the COMPONENT list.
        OTHER         : "other"
    }


    /**
    * Registers this component with Draper's logging server.  The server creates
    * a unique session_id, that is then used in subsequent logging messages.  This
    * is a blocking ajax call to ensure logged messages are tagged correctly.
    * @todo investigate the use of promises, instead of the blocking call.
    *
    * @method registerActivityLogger
    * @param {String} url the url of Draper's Logging Server
    * @param {String} toolName the name of the tool being logged.
    * @param {String} toolVersion the version of this component
    */
    draperLog.registerActivityLogger = function(url, toolName, toolVersion) {

        draperLog.url = url;
        draperLog.toolName = toolName;
        draperLog.toolVersion = toolVersion;

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
            draperLog.sessionID = draperLog.toolName.slice(0,3) + new Date().getTime();
        }

        if (!draperLog.clientHostname) {
            draperLog.clientHostname = 'UNK';
        }

        // set the logging URL on the Web Worker
        draperLog.worker.postMessage({
            cmd: 'setLoggingUrl',
            msg: url
        });

        // Commented this out currently so we don't have a mix of logs being 
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
                draperLog.LOGGING_ACTIVITY.REMOVE,          // Logging Action
                "",                                         // Logging Support Element
                { id: "draper_browser",                     // Logging Target Component
                  type: draperLog.LOGGING_COMPONENT.WINDOW, 
                  gid: ""},
                []);                                        // Logging Tags
                

            // Since the window is closing and the script will be forced closed,
            // ensure the buffer is being sent to the server.
            draperLog.worker.postMessage({
                cmd: 'sendBuffer',
                msg: ''});
        };

        window.onload = function(e){
            draperLog.logUserActivity(
                draperLog.LOGGING_ACTIVITY.CREATE,          // Logging Action
                "",                                         // Logging Support Element
                { id: "draper_browser",                     // Logging Target Component
                  type: draperLog.LOGGING_COMPONENT.WINDOW, 
                  gid: ""},
                []);                                        // Logging Tags
        };

        // Log the activity when the user gains focus on the web browser
        // window. In order to do this, we register an onFocus callback function
        // which will log the gained focus of the element.
        window.onfocus = function(e) {
            draperLog.logUserActivity(
                draperLog.LOGGING_ACTIVITY.SELECT,          // Logging Action
                "",                                         // Logging Support Element
                { id: "draper_browser",                     // Logging Target Component
                  type: draperLog.LOGGING_COMPONENT.WINDOW, 
                  gid: ""},
                []);                                        // Logging Tags

        };

        // Log the activity when the user leaves focus on the web browser
        // window. In order to do this, we register an onBlur callback function
        // which will log the lost focus
        window.onblur = function(e) {
            draperLog.logUserActivity(
                draperLog.LOGGING_ACTIVITY.DESELECT,          // Logging Action
                "",                                         // Logging Support Element
                { id: "draper_browser",                     // Logging Target Component
                  type: draperLog.LOGGING_COMPONENT.WINDOW, 
                  gid: ""},
                []);                                        // Logging Tags

        };

        return draperLog;
    };


    /**
     * @brief Checks to see if input parameters are valid
     * @details Checks to see if input parameters are valid. Goes through
     * each parameter and checks the type of variable it is.
     * 
     * @param activity Activity parameter which should be a string parameter
     * @param objectInfo Object Information which should be a string parameter
     * @param componentInfo Component Info which should be a complex object param
     * @param Tags Tags parameter should be an array of strings
     * @return [description]
     */
    function _CheckParams(activity, objectInfo, componentInfo, tags)
    {    
        // Validate that the component object is a valid type of parameter
        // defined by the developer
        if( (!_IsValidComponent(componentInfo))   ||
            (typeof(activity) != "string")        ||
            (typeof(objectInfo) != "string")      ||
            (!(tags instanceof Array)))
        {
            return false;
        }

        // If the code hits here, we have valid parameters being passed into the
        // logging activity.
        return true;

        /**
         * @brief Checks and validates that the component field is a valid file 
         * the right parameters.
         * @details Checks and validates that the component field is a valid file 
         * the right parameters. Checks the component object on whether it is an
         * object, has the right parameters, and parameter types.
         * 
         * @param  componentInfo - Component object that contains information
         * about the target component
         * @return True if valid, False if not 
         */
        function _IsValidComponent(componentInfo)
        {
            // Check to see if the parameter is an object
            if ( (typeof(componentInfo) != 'object')   ||
                (!("id" in componentInfo))             ||
                (!("type" in componentInfo))           ||
                (!("gid" in componentInfo)))
                return false;
            return true;
        }
    }

    /**
     * @brief Construct log constructs the base information about a log.
     * @details Construct log constructs the base information about a log. The
     * information generated is based on the log event itself and not the 
     * surrounding meta data around it (version, etc..)
     * 
     * @param Activity The activity that is being logged. This is based on a list of
     * logging activities defined above.
     * @param ObjectInfo The object info is a freeform string that is used to describe the
     * item that is being alter on within the component. For example, a row in a table.
     * @param Component Info - A Structured object that contains meta data about
     * the component being logged. This object contains the "id", "type", and group id
     * ("gid") of the component
     * @param tags - An array of string tags to help describe the functionality of
     * the component.
     * @return msg - An object that contains the structured logging information.
     */
    function constructLog(activity, objectInfo, componentInfo, tags)
    {
        // Validate the parameters that are being passed in by 
        // the developer. Ensure the fields are proper before 
        // continuing further.
        if (!_CheckParams(activity, objectInfo, componentInfo, tags))
            return null;

        // Construct the initial log message with the information provided by the user.
        // This will allow us to see what is being logged by the developer.
        var msg = {
            type: 'INVALID',
            parms: {
                activity:    activity,
                objectInfo:  objectInfo,
                component:   componentInfo,
                tags: []
            }
        };

        // Append the tags to the tags field within the component object.
        // We loop through and do this to ensure all the elements within
        // the array are strings
        for (var e in tags){
            if(typeof(tags[e]) == 'string')
                msg.parms.tags.push(tags[e]);
        }

        // Return the constructed log to the caller.
        return msg;
    } 

    /**
    * Create USER activity message.
    */
    draperLog.logUserActivity = function (activity, objectInfo, componentInfo, tags) 
    {
        if(muteUserActivityLogging) {
            return;
        }

        // Construct the log with the current parameters for a new log.
        // Check to see if the function return null. If so, the parameters
        // were not proper
        var msg = constructLog(activity, objectInfo, componentInfo, tags);
        if (msg == null)
        {
            if(logToConsole){
                if(testing)
                    console.error("ActivityLogger: Invalid Parameter(s). Log skipped.");
                else
                    console.error("(TESTING): ActivityLogger: Invalid Parameter(s). Log skipped.");
            }
            return;
        }

        // Add User Log Specific Data to the log. This will allow us to
        // distinguish between user log and system log.
        msg.type = "USERACTION";

        // Send the logging message to the server. This function will
        // append the top level meta data to the log and send it to the
        // server.
        sendMessage(msg);

        // Check to see if the developer set the debugging "testing" and 
        // "logToConsole" variables
        if (logToConsole) {
            if (testing) {
                console.log('DRAPER LOG: (TESTING) Logging User Activity', msg.parms);
            } else {
                console.log('DRAPER LOG: Logging User Activity', msg.parms);
            }
        }

    };

    /**
    * Create SYSTEM activity message.
    */
    draperLog.logSystemActivity = function (activity, objectInfo, componentInfo, tags) {

        if(muteSystemActivityLogging)
            return;

        // Construct the log with the current parameters for a new log.
        // Check to see if the function return null. If so, the parameters
        // were not proper
        var msg = constructLog(activity, objectInfo, componentInfo, tags);
        if (msg == null)
        {
            if(logToConsole){
                if(testing)
                    console.error("ActivityLogger: Invalid Parameter(s). Log skipped.");
                else
                    console.error("(TESTING): ActivityLogger: Invalid Parameter(s). Log skipped.");
            }
            return;
        }

        // Add User Log Specific Data to the log. This will allow us to
        // distinguish between user log and system log.
        msg.type = "SYSACTION";

        // Send the logging message to the server. This function will
        // append the top level meta data to the log and send it to the
        // server.
        sendMessage(msg);

        // Check to see if the developer set the debugging "testing" and 
        // "logToConsole" variables
        if (logToConsole) {
            if (testing) {
                console.log('DRAPER LOG: (TESTING) Logging System Activity', msg.parms);
            } else {
                console.log('DRAPER LOG: Logging System Activity', msg.parms);
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
        msg.component = { name: draperLog.toolName,
                          version: draperLog.toolVersion};
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
    // function classListener() {
    //     $(document).ready(function() {
    //         $(".draper").each(function(i,d){
    //             $(d).on("click", function(a){
    //                 draperLog.logUserActivity('User clicked element', 
    //                                           $(this).data('activity'),
    //                                           $(this).data('wf'));
    //             });
    //         });

    //         $(window).scroll(function() {
    //             clearTimeout($.data(this, 'scrollTimer'));
    //             $.data(this, 'scrollTimer', setTimeout(function() {
    //                 draperLog.logUserActivity('User scrolled window', 'scroll', 3);
    //             }, 500));
    //         });
    //     });
    // }

    /**
     * @brief [brief description]
     * @details [long description]
     * 
     * @param elem [description]
     * @param msg [description]
     */
    // draperLog.tag = function(elem, msg) {
    //     $.each(msg.events, function(i, d) {
    //         if (d === 'scroll') {
    //             console.log('found scroll');
    //             $(elem).scroll(function() {
    //                 clearTimeout($.data(this, 'scrollTimer'));
    //                 $.data(this, 'scrollTimer', setTimeout(function() {
    //                     draperLog.logUserActivity('User scrolled window', 'scroll', 3);
    //                 }, 500));
    //             });
    //         }else{
    //             $(elem).on(d, function() {
    //                 draperLog.logUserActivity(msg.desc, msg.activity, msg.wf_state);
    //             });
    //         }
    //     });
    // };

    // Return the activity logger object in which is created. With this, 
    // object functions and variable are created to keep this a separate instance
    // of the logger.
    return draperLog;
}
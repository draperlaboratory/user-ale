function activityLogger() {
	// draperLog = (function(){
  var draperLog = {version: "0.2.0"}; // semver

  var muteUserActivityLogging = false;
  var muteSystemActivityLogging = false;

  /*      WORKFLOW CODES
	* These constants specify the workflow codes defined in the Draper
	* Activity Logging API version <apiVersion>. One of these
	* constants must be passed in the parameter <userWorkflowState>
	* in the function <logUserActivity> below. 
	*/
	draperLog.WF_OTHER       = 0;
	draperLog.WF_PLAN        = 1;
	draperLog.WF_SEARCH      = 2;
	draperLog.WF_EXAMINE     = 3;
	draperLog.WF_MARSHAL     = 4;
	draperLog.WF_REASON      = 5;
	draperLog.WF_COLLABORATE = 6;
	draperLog.WF_REPORT      = 7;

	var workflowCodingVersion = '1.0'

	draperLog.registerActivityLogger = function(url, componentName, componentVersion) {
		draperLog.url = url;
		draperLog.componentName = componentName;
		draperLog.componentVersion = componentVersion;

		$.ajax({
			url: draperLog.url + '/register',
			async: false,
			dataType: 'json',
			success: function(a) {
				console.log('success:', a);
				// console.log('success2:', a);

				// console.log(a, a.session_id, a["session_id"])

				// console.log("SESSIONID:", draperLog);
				draperLog.sessionID = a.session_id;
				draperLog.clientHostname = a.client_ip;	
				// console.log("SESSIONID:", draperLog.sessionID);	
				// console.log(draperLog);			
			}
		})

		console.log("SESSIONID:", draperLog.sessionID)
	}

	draperLog.logUserActivity = function (actionDescription, userActivity, userWorkflowState, softwareMetadata) {	    

	    if(!muteUserActivityLogging) {
	    	msg = {
	    		type: 'USERACTION',
	    		parms: {
	    			desc: actionDescription,
					activity: userActivity,
					wf_state: userWorkflowState,
					wf_version: workflowCodingVersion 
	    		},
	    		meta: softwareMetadata
	    	}
	    	sendMessage(msg);         
	    }
	}

	draperLog.logSystemActivity = function (actionDescription, softwareMetadata) {	    
               
	    if(!muteUserActivityLogging) {
	    	msg = {
	    		type: 'SYSACTION',
	    		parms: {
	    			desc: actionDescription,	          
	    		},
	    		meta: softwareMetadata
	    	}
	    	sendMessage(msg);         
	    }
	}

	function setCookie(cname,cvalue,exdays)	{
		var d = new Date();
		d.setTime(d.getTime()+(exdays*24*60*60*1000));
		var expires = "expires="+d.toGMTString();
		document.cookie = cname + "=" + cvalue + "; " + expires;
	}

	function sendMessage(msg) {
		msg.timestamp = new Date().toJSON();
		console.log(msg.timestamp, new Date())
		msg.client = draperLog.clientHostname;
		msg.component = {name: draperLog.componentName, version: draperLog.componentVersion};
		msg.sessionID = draperLog.sessionID;
		msg.impLanguage = 'JavaScript';
		msg.apiVersion = draperLog.version;

		console.log(msg);
		$.ajax({
			url: draperLog.url + '/send_log',
			type: 'POST',
			dataType: 'json',
			data: msg,
			success: function(a) {
				// console.log('success:', a)

			}
		})
	}

	return draperLog;
}
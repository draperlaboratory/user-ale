import socket, Queue, threading, urllib2
import json
from random import randint
from datetime import datetime

class ActivityLogger:
	"""

	##########################
	Python Activity Logger
	##########################
	Draper Laboratory, June 2013
	----------------------------

	
	This library is intended for integration into Python 2.7 software component which is implementing the Draper 
	Activity Logging API. To send activity log messages using this libary, components must:

		1. Instantiate an ``ActivityLogger`` object
		2. Call ``registerActivityLogger(...)`` to pass in required networking 
		   and version information.
		3. Call one of the logging functions:
			* ``logSystemActivity(...)``
			* ``logUserActivity(...)``
			* ``logUILayout(...)``
	
	An example use of this library is included below::
	
		import ActivityLogger

		# Instantiate the Activity Logger
		ac = ActivityLogger.ActivityLogger()

		# Minimally register the logger (DISCOURAGED). In this case, we register our logger object to look for the 
		# Draper logging server on port 1337 at 172.16.98.9. This is the real address of the Logging Server during 
		# XDATA Summer Camp 2013. No other arguments are supplied, so the software component name will be logged as 
		# unknownComponent, the component version will be unknown, the User Session ID will be a random integer, 
		# and the host name of this machine will be its public-facing IP address.

	    ac.registerActivityLogger("http://172.16.98.9:1337")

		# Re-register the logger. In this case, we register our logger object to look for the Draper logging server on 
		# port 1337 at 172.16.98.9.We specify that this software component is version 34.87 of the software component 
		# named "Python Test Component", the User Session ID is "AC34523452345", and this machine is named
		# pythonTableServer.xdata.data-tactics-corp.net
		
		ac.registerActivityLogger("http://172.16.98.9:1337", "Python Test Component", "34.87", "AC34523452345", 
			"pythonTableServer.xdata.data-tactics-corp.net")

		# Send a System Activity Message. In this case, we send a System Activity message with the action description 
		# "Pushed query results to GUI"

		ac.logSystemActivity("Pushed query results to GUI")

		# Send a System Activity Message with optional metadata included. In this case, we send a System Activity
		# message with the action description "Pushed query results to GUI" and optional metadata with two key-value 
		# pairs of:
		# 	'rowsReturned'=314
		# 	'queryTime'='422 ms
'
		ac.logSystemActivity("Pushed query results to GUI", {"rowsReturned":314, "queryTime":"422 ms"})

		# Send a User Activity Message. In this case, we send a User Activity message with the action description 
		# "Filtered results using a Histogram view", a developer-defined user action visualFilter_Histogram, and the 
		# workflow constant WF_SEARCH, defined in the Draper Activity Logging API.

		ac.logUserActivity("Filtered results using a Histogram view" , "visualFilter_Histogram",  ac.WF_SEARCH)

		# Send a UI Layout Message. In this case, we send a UI Layout message with action description of"Expand Tree 
		# Node". The name of the UI element is "Cluster_Browser_List", visibility=True, meaning SearchWindow A is 
		# currently visible. The left, right, top and bottom bounds of the UI element are 200px, 450px, 200px, and 500 
		# from the top right of the screen. 

		ac.logUILayout("Expand Tree Node", "Cluster_Browser_List", True, 200, 450, 200, 500) 
	"""
	def __init__(self):
		"""
		The fully-qualified address of the logging server that will collect messages dispatched by this library. During 
		XDATA Summer Camp 2013, the logging server is ``http://172.16.98.9:1337``.
		"""
		self.activityLogServerURL = ""

		"""
		The name of the computer or VM on which the software component using this library is runing. In the case of
		a server-side Python component, this should be the host name of the machine on which the Python service is
		running. By default, this field will be populated with the IP address of the machine on which this module is 
		executed.

		Ideally, this hostname should describe a physical terminal or experimental setup as persistently as possible.
		"""
		try:
		  	self.clientHostname = socket.gethostname()
			self.clientHostname = socket.gethostbyname(socket.gethostname())
		except Exception:
			pass

		"""
		The name of the software component or application sending log messages from this library. Defaults to 
		``unknownComponent``
		"""
		self.componentName = "unknownComponent"

		"""
		The version number of the software component or application specified in ``clientHostname`` that is sending log
		messages from this library. Defaults to ``unknown``.
		"""
		self.componentVersion = "unknown"

		"""
		The unique session ID used for communication between client and sever-side software components during use of 
		this component. Defaults to a random integer.

		Ideally, this session ID will identify log messages from all software components used to execute a unique user 
		session.
		"""
		self.sessionID = randint(1,10000)


		"""
		Set to ``True`` to echo log messages to the console, even if they are sent sucessfully to the Logging Server.
		"""
		self.echoLogsToConsole = False

		"""Set to ``True`` to disable System Activity log messages."""
		self.muteSystemActivityLogging = False

		"""Set to ``True`` to disable User Activity log messages."""
		self.muteUserActivityLogging = False

		"""Set to ``True`` to disable UI Layout log messages."""
		self.muteUILayoutLogging = False

		self.logMessageQueue = Queue.Queue(0)
		self.httpTransmissionThread = None

		self.running = True;

	"""
	******************
	INTERNAL CONSTANTS
	******************
	
	These constant define values associated with this specific version of this library, and should not be changed by the
	implementor.
	"""

	"""The version number of the Draper Activity Logging API implemented by this library."""
	apiVersion = 2

	"""The workflow coding version used by this Activity Logging API."""
	workflowCodingVersion = 1
	
	"""
	WORKFLOW CODES
	
	These constants specify the workflow codes defined in the Draper Activity Logging API version <apiVersion>. One of 
	these constants *must* be passed in the parameter ``userWorkflowState``	in the function ``logUserActivity``. 
	"""
	WF_OTHER	  	= 0
	WF_PLAN	   		= 1
	WF_SEARCH	 	= 2
	WF_EXAMINE		= 3
	WF_MARSHAL		= 4
	WF_REASON	 	= 5
	WF_COLLABORATE	= 6
	WF_REPORT  		= 7


	"""
	The domain for all structured data elements necessary to send IETF RCF 5424 compliant Syslog messages. 15038 is 
	Draper Lab's IANA Private Enterprise Number, and should be used in all log messages sent with this API.
	"""
	structuredDataDomain = 15038

	"""The language in which this helper library is implemented"""
	implementationLanguage = "Python"


	# /*======================== REGISTRATION ============================
	# * These variables are assigned by calling the 
	# * <registerActivityLogger> function below. They are persistent until
	# * a new ActivityLogger object is instantiated, or until modification
	# * by the <registerActivityLogger> function. 
	# */

	def writeHead(self):
          msg = {}

          msg['timestamp'] = datetime.now().isoformat('T') + 'Z'
          msg['client'] = self.clientHostname;
          msg['component'] = {'name': self.componentName, 'version': self.componentVersion};
          msg['sessionID'] = self.sessionID;
          msg['impLanguage'] = self.implementationLanguage;
          msg['apiVersion'] = self.apiVersion

          return msg;


	def registerActivityLogger(self, activityLogServerIN, componentNameIN=None, componentVersionIN=None, 
		sessionIdIN=None, clientHostnameIN=None):
	
		"""Register this event logger. <registerActivityLogger> MUST be called before log messages can be sent with this
		library. 

		Args:
			activityLogServerIN (str): The address of the logging server. See documentation for ``activityLogServerURL``
			below. 

    	Kwargs:
			componentNameIN (str): The name of the app or component using this library. See documentation for 
			``componentName`` below. If not provided, defaults to the hostname of the web app that loaded this library.

			componentVersionIN (str): The version of this app or component. See documentation for ``componentVersion``
			below. If not provided, defaults to 'unknown'.

			sessionIdIN (str): A unique ID for the current user session. See documentation for ``sessionID`` below. If 
			not provided, defaults to a random integer.

			clientHostnameIN (str): The hostname or IP address of this machine or VM. See documentation for 
			``clientHostname`` below. If not provided, defaults to the public IP address of this computer.
    	"""
		self.activityLogServerURL = activityLogServerIN

		if componentNameIN is not None:
			    self.componentName= componentNameIN
		

		if componentVersionIN is not None:
			self.componentVersion = componentVersionIN
		
		if sessionIdIN is not None:
			    self.sessionID = sessionIdIN

		if clientHostnameIN is not None:
		    self.clientHostname = clientHostnameIN

	#========================END REGISTRATION==========================

	"""
	DEVELOPMENT FUNCTIONALITY
	=========================
	The properties and function in this section allow developers to echo log messages to the console, and disable the 
	generation and transmission of logging messages by this library. 
	"""
	
	def muteAllLogging(self):
		"""Disable all log messages"""
		self.muteSystemActivityLogging = True
		self.muteUserActivityLogging = True
		self.muteUILayoutLogging = True

	def unmuteAllLogging(self):
		"""Enable all log messages"""
		self.muteSystemActivityLogging = False
		self.muteUserActivityLogging = False
		self.muteUILayoutLogging = False
	
	#=================END DEVELOPMENT FUNCTIONALITY====================

	
	# /*==================ACTIVITY LOGGING FUNCTIONS======================
	# * The 3 functions in this section are used to send Activity Log
	# * Mesages to an Activity Logging Server. Seperate functions are used
	# * to log System Activity, User Activity, and UI Layout Events. See 
	# * the Activity Logging API by Draper Laboratory for more details 
	# * about the use of these messages.
	# */
	
	def logSystemActivity(self, actionDescription, softwareMetadata = {}):
		"""Log a System Activity. 

		Args:
			actionDescription (str): A string describing the System Activity performed by the component. Example: 
		 		"BankAccountTableView component refreshed datasource"
		Kwargs: 
			softwareMetadata: (dict): Any key/value pairs that will clarify or paramterize this system activity. 
			Example: 
				{'rowsAdded':'3', 'dataSource':'CheckingAccounts'}

		``registerActivityLogger`` **must** be called before calling this function. Use ``logSystemActivity`` to log 
		software actions that are not explicitly invoked by the user. For example, if a software component refreshes a 
		data store after a pre-determined time span, the refresh event should be logged as a system activity. However, 
		if the datastore was refreshed in response to a user clicking a Reshresh UI element, that activity should NOT be
		logged as a System Activity, but rather as a User Activity, with the method ``logUserActivity``.
		"""
		# encodedSystemActivityMessage = ""
		if not(self.muteSystemActivityLogging):
		
			msg =  self.writeHead()
			msg['type'] = "SYSACTION";
			msg['parms'] = {
			    'desc': actionDescription
			}
			msg['meta'] = softwareMetadata;
			self.sendHttpMsg(msg);
			

			# self.sendHttpMsg(encodedSystemActivityMessage)
		

		return msg
	


	def logUserActivity(self, actionDescription, userActivity, userWorkflowState, softwareMetadata={}):
		"""
		Log a User Activity. 
    
    	Args:
    		actionDescription (str): A string describing the System Activity performed by the component. Example: 
    			"BankAccountTableView component refreshed datastore."
    		
    		userActivity (str): A key word defined by each software component or application indicating which 
    		software-centric function is is most likely indicated by the this user activity. See the Activity Logging 
    		API for a standard set of user activity key words. 

			userWorkflowState (int): This value must be one of the Workflow Codes defined in this library. See the 
			Activity Logging API for definitions of each workflow code. Example:
				ac = new ActivityLogger()
				...
				userWorkflowState = ac.WF_SEARCH
		
		Kwargs
			softwareMetadata (dict) Optional. Any key/value pairs that will clarify or paramterize this system activity.
			Example: 
				{'rowsAdded':'3', 'dataSource':'CheckingAccounts'}
    
    	``registerActivityLogger`` MUST be called before calling this function. Use ``logUserActivity`` to log actions 
    	initiated by an explicit user action. For example, if a software component refreshes a data store when the user 
	    clicks a Reshresh UI element, that activity should be logged as a User Activity. However, if the datastore was 
	    refreshed automatically after a certain time span, that activity should NOT be logged as a User Activity, but 
	    rather as a System Activity.
	    """

		encodedSystemActivityMessage = ""

		if not(self.muteUserActivityLogging):
			
			msg =  self.writeHead()
			msg['type'] = "USERACTION";
			msg['parms'] = {
			    'desc': actionDescription,
			    'activity': userActivity,
			    'wf_state': userWorkflowState,
				'wfCodeVersion': self.workflowCodingVersion
			}
			msg['meta'] = softwareMetadata;
			self.sendHttpMsg(msg);			
		
		return msg
	

	def logUILayout(self, actionDescription, uiElementName, visibility, leftBound, rightBound, topBound, bottomBound, softwareMetadata={}):
		"""
		Log the Layout of a UI Element. 

		Args:
			actionDescription (str): A string describing the System Activity performed by the component. Example: 
				"BankAccountTableView moved in User_Dashboard"

			uiElementName (str): The name of the UI component that has changed position or visibility.

			visibility (bool): ``True`` if the element is currently visibile. False if the element is completely hidden. 

			leftBound (int): The absolute position on screen, in pixels, of the leftmost boundary of the UI element.  
			
			rightBound (int): The absolute position on screen, in pixels, of the rightmost boundary of the UI element. 
			
			topBound (int): The absolute position on screen, in pixels of the top boundary of the UI element. 
			
			bottomBound (int): The absolute position on screen, in pixels of the bottom boundary of the UI element. 
			
		Kwargs: 

			softwareMetadata (dict): Any key/value pairs that will clarify or paramterize this system activity. Example:
				{'currentDashboardRow':'3', 'movementMode':'Snap_To_Grid'}

		``registerActivityLogger`` MUST be called before calling this function. Use ``logUILayout`` to record any 
		changes to the position or visibility of User Interface elements on screen.
		"""
		# encodedSystemActivityMessage = ""

		if not(self.muteUILayoutLogging):

			msg =  self.writeHead()
			msg['type'] = "UILAYOUT";
			msg['parms'] = {
			    'visibility': visibility,
			    'leftBound': leftBound,
			    'rightBound': rightBound,
			    'topBound': topBound,
			    'bottomBound': bottomBound
			}
			msg['meta'] = softwareMetadata;
			self.sendHttpMsg(msg);			
		
		return msg
	

	# //=================END ACTIVITY LOGGING FUNCTIONS========================

	# /*=========================INTERNAL FUNCTIONS============================
	# * These functions are used internally by the Activity Logger helper 
	# * library to generate RCF5424 Syslog messages, and transmit them via 
	# * HTTP POST messages to an Activity Logging server. 
	# */



	def httpTransmissionLoop(self):
		
		# activityLoggerConnection = httplib.HTTPConnection(self.activityLogServerURL)

		while self.running:
			nextLogMessage = self.logMessageQueue.get(block=True)

			try:
				activityLogServerResponse = urllib2.urlopen(self.activityLogServerURL, nextLogMessage)

				activityLogServerResponse.read()		
				if activityLogServerResponse.getcode() != 200:
					print "Log message not sent. Bad response from Logging Server."
					print "Server address: " + self.activityLogServerURL
					print "Response code: " + str(activityLogServerResponse.getcode())
					print "Log Message:"
					print nextLogMessage
			except Exception as err:
				print "Error connecting to Draper Activity Logging Server. Error is:"
				print err
				print "Server address: " + self.activityLogServerURL
				print "Log Message:"
				print nextLogMessage


	def sendHttpMsg(self, encodedLogMessage):
		if self.httpTransmissionThread is None:
			self.httpTransmissionThread = threading.Thread(group=None, target=self.httpTransmissionLoop, name=None, args=(), kwargs={})
			self.httpTransmissionThread.start()
		self.logMessageQueue.put(json.dumps(encodedLogMessage))	

	def __del__(self):
		self.running = False
	#=======================END INTERNAL FUNCTIONS==========================
	
	



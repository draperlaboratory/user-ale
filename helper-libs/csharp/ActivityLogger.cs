/*
   Copyright 2014 The Charles Stark Draper Laboratory

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

using System;
using System.Collections.Generic;

namespace Activity_Logging_API_Helper
{
    /*
	 * ++++++++++++++++++
     * C# Activity Logger
     * ++++++++++++++++++
	 * 
	 * Draper Laboratory, June 2013
	 * ----------------------------
     * 
	 * 
	 * This library is intended for integration into a C# software application which is implementing the Draper 
	 * Activity Logging API. To send activity log messages using this libary, components must:
     * 
	 * 	1. Instantiate an ``ActivityLogger`` object
	 * 	2. Call ``registerActivityLogger(...)`` to pass in required networking 
	 * 	   and version information.
	 * 	3. Call one of the logging functions:
	 * 		* ``logSystemActivity(...)``
	 * 		* ``logUserActivity(...)``
	 * 		* ``logUILayout(...)``
	 * 
	 * An example use of this library is included below::
     * 
	 * 	    //Instantiate the Activity Logger
	 * 	    ac = ActivityLogger.ActivityLogger();
     * 
     *      //Get the the current UTC time, and store it as an ISO-compliant timestamp string.
     *      String ISOTime = DateTime.UtcNow.ToString("O");
     * 
	 * 	    //Minimally register the logger (DISCOURAGED). In this case, we register our logger with client hostname
     * 	    //"3D Viz Tablet 001", which is the name of the hardware device on which this application is running.
     * 	    //No other arguments are supplied, so the software component name will be logged as unknownComponent, the 
     * 	    //component version will be unknown,and the User Session ID will be a random integer.
     *  
     *      ac.registerActivityLogger("Viz_Tablet_001");
     *      
     *      //Re-register the logger. In this case, we register our logger object with client hostname
     * 	    //"Viz_Tablet_001". We specify that the application sending logs is version 34.87 of the application 
     * 	    //"c-Sharp Test App", and the User Session ID is "AC34523452345".
     * 	    
     *      c.registerActivityLogger("Viz_Tablet_001", "cSharpTestApp", "34.87", "AC34523452345");
     *      
     *      //Send a System Activity Message. In this case, we send a System Activity message with the current UTC
     *      //timestamp and the action description "Pushed query results to GUI"
     *
     *      ac.logSystemActivity(ISOTime, "Pushed query results to GUI");
     *      
     *      //Send a System Activity Message with optional metadata included. In this case, we send a System Activity
     *      //message with the current UTC timestamp, the action description "Pushed query results to GUI" and 
     *      //optional metadata with two key-value pairs of:
     *      //  'rowsReturned'=314
     *      //  'queryTime'='422 ms'
     *      
     *      Dictionary<String,String> testDict = new Dictionary<String, String>();
     *      testDict.Add("rowsReturned", "314");
     *      testDict.Add("queryTime", "422 ms");
     *      ac.logSystemActivity(ISOTime, "Pushed query results to GUI", testDict);
     *      
     *      //Send a User Activity Message. In this case, we send a User Activity message with the current UTC 
     *      //timestamp, the action description "Filtered results using a Histogram view", a developer-defined user 
     *      //action visualFilter_Histogram, and the workflow constant SEARCH, defined in the Draper Activity Logging
     *      //API.
     *      
     * 		ac.logUserActivity(ISOTime, "Filtered results using a Histogram view" , "visualFilter_Histogram", 
     * 		    ActivityLogger.WF.MARSHAL);
     * 	    
     *      //Send a UI Layout Message. In this case, we send a UI Layout message with the current UTC timestamp, 
     *      //action description of "Expand Tree Node". The name of the UI element is "Cluster_Browser_List", 
     *      //visibility=true, meaning SearchWindow A is currently visible. The left, right, top and bottom bounds of
     *      //the UI element are 200px, 450px, 200px, and 500px from the top right of the screen.
     *      
     *      Console.Write(ac.logUILayout(ISOTime, "Expand Tree Node", "Cluster_Browser_List", true, 200, 450, 200, 
     *          500)) ;  
     */
    class ActivityLogger
    {
        /// <summary>
        /// The name of the computer or VM on which the software component using this library is runing. In the case of
        ///a server-side Python component, this should be the host name of the machine on which the Python service is
        ///running. By default, this field will be populated with the IP address of the machine on which this module is 
        ///executed.
        ///
        ///Ideally, this hostname should describe a physical terminal or experimental setup as persistently as possible.
        /// </summary>
        String clientHostname;

        //The name of the software component or application sending log messages from this library. Defaults to 
        //``unknownComponent``
        String componentName = "unknownComponent";

        //The version number of the software component or application specified in ``clientHostname`` that is sending log
        //messages from this library. Defaults to ``unknown``.
        String componentVersion = "unknown";

        //The unique session ID used for communication between client and sever-side software components during use of 
        //this component. Defaults to a random integer.
        //
        //Ideally, this session ID will identify log messages from all software components used to execute a unique user 
        //session.
        int sessionID;


        public ActivityLogger()
        {
            Random randomNumberGen = new Random();
            sessionID = randomNumberGen.Next(1, 10000);
        }

        /*
         INTERNAL CONSTANTS
         ******************
         * These constant define values associated with this specific version of this library, and should not be 
         * changed by the implementor.
         */

        //The version number of the Draper Activity Logging API implemented by this library.
        private int apiVersion = 2;

        //The workflow coding version used by this Activity Logging API.
        private int workflowCodingVersion = 1;

        //WORKFLOW CODES

        //These constants specify the workflow codes defined in the Draper Activity Logging API version <apiVersion>. One of 
        //these constants *must* be passed in the parameter ``userWorkflowState``	in the function ``logUserActivity``. 

        public enum WF
        {
            OTHER = 0,
            PLAN = 1,
            SEARCH = 2,
            EXAMINE = 3,
            MARSHAL = 4,
            REASON = 5,
            COLLABORATE = 6,
            REPORT = 7
        }

        //The language in which this helper library is implemented
        String implementationLanguage = "C#";

        // END INTERNAL CONSTANTS
        // **********************


        /*======================== REGISTRATION ============================
        * These variables are assigned by calling the 
        * <registerActivityLogger> function below. They are persistent until
        * a new ActivityLogger object is instantiated, or until modification
        * by the <registerActivityLogger> function. 
        */

        /// <summary>
        /// Register this event logger. <registerActivityLogger> MUST be called before log messages can be sent with 
        /// this library. 
        /// </summary>
        /// <param name="clientHostnameIN">The hostname or IP address of this machine or VM. See documentation for
        ///     <clientHostname> below. If not provided, defaults to the public IP address of this computer.</param>
        /// <param name="componentNameIN">The name of the app or component using this library. See documentation for 
        ///     <componentName> below. If not provided, defaults to the hostname of the web app that loaded this 
        ///     library.</param>
        /// <param name="componentVersionIN">The version of this app or component. See documentation for 
        ///     <componentVersion> below. If not provided, defaults to 'unknown'.</param>
        /// <param name="sessionIdIN">A unique ID for the current user session. See documentation for <sessionID>
        ///     below. If not provided, defaults to a random integer.</param>

        public void registerActivityLogger(String clientHostnameIN, String componentNameIN = null, String componentVersionIN = null,
            int sessionIdIN = -1)
        {
            if (componentNameIN != null)
            {
                componentName = componentNameIN;
            }


            if (componentVersionIN != null)
            {
                componentVersion = componentVersionIN;
            }

            if (sessionIdIN != -1)
            {
                sessionID = sessionIdIN;
            }

            clientHostname = clientHostnameIN;
        }

        //========================END REGISTRATION==========================


        /*==================ACTIVITY LOGGING FUNCTIONS======================
         * The 3 functions in this section are used to send Activity Log Mesages to an Activity Logging Server. 
         * Seperate functions are used to log System Activity, User Activity, and UI Layout Events. See the Activity 
         * Logging API by Draper Laboratory for more details about the use of these messages.
        */

        /// <summary>
        /// Log a System Activity, with nested metadata.
        /// </summary>
        /// <remarks> <see cref="registerActivityLogger"/> **must** be called before calling this function. Use <code>logSystemActivity</code> to log 
        /// software actions that are not explicitly invoked by the user. For example, if a software component refreshes a 
        /// data store after a pre-determined time span, the refresh event should be logged as a system activity. However, 
        /// if the datastore was refreshed in response to a user clicking a Reshresh UI element, that activity should NOT be
        /// logged as a System Activity, but rather as a User Activity, with the method <see cref="logUserActivity"/>.
        /// </remarks>
        /// <param name="ISOTimestamp">An ISO-compliant Timestamp string, in UTC.</param>
        /// <param name="actionDescription">A string describing the System Activity performed by the component. Example:  
        ///     <example>"BankAccountTableView component refreshed datasource"</example></param>
        /// <param name="softwareMetadata">Any key/value pairs that will clarify or paramterize this system activity.</param>
        /// <returns>A JSON message.</returns>
        public String logSystemActivity(String ISOTimestamp, String actionDescription, Dictionary<String, String> softwareMetadata = null)
        {
            Dictionary<String, object> recastMetaData = null;
            if (softwareMetadata != null)
            {
                recastMetaData = new Dictionary<string, object>();
                foreach (String key in softwareMetadata.Keys)
                {
                    recastMetaData.Add(key, softwareMetadata[key]);
                }
            }

            return logSystemActivity<Object>(ISOTimestamp, actionDescription, recastMetaData);
        }
        /// <summary>
        /// Log a System Activity.
        /// </summary>
        /// <remarks> <see cref="registerActivityLogger"/> **must** be called before calling this function. Use <code>logSystemActivity</code> to log 
        /// software actions that are not explicitly invoked by the user. For example, if a software component refreshes a 
        /// data store after a pre-determined time span, the refresh event should be logged as a system activity. However, 
        /// if the datastore was refreshed in response to a user clicking a Reshresh UI element, that activity should NOT be
        /// logged as a System Activity, but rather as a User Activity, with the method <see cref="logUserActivity"/>.
        /// </remarks>
        /// <param name="ISOTimestamp">An ISO-compliant Timestamp string, in UTC.</param>
        /// <param name="actionDescription">A string describing the System Activity performed by the component. Example:  
        ///     <example>"BankAccountTableView component refreshed datasource"</example></param>
        /// <param name="softwareMetadata">Any key/value pairs that will clarify or paramterize this system activity.</param>
        /// <returns>A JSON message.</returns>
        public String logSystemActivity<T>(String ISOTimestamp, String actionDescription, Dictionary<String, T> softwareMetadata = null)
        {
            Dictionary<string,object> SystemActivityMessage = new Dictionary<string,object>();

            writeHeader(SystemActivityMessage);

            SystemActivityMessage.Add("timestamp", ISOTimestamp);

            SystemActivityMessage.Add("type","SYSACTION");

            Dictionary<string, object> parms = new Dictionary<string, object>();
            parms.Add("desc", actionDescription);
            SystemActivityMessage.Add("parms", parms);

            SystemActivityMessage.Add("metadata",softwareMetadata);

            return convertToJSON(SystemActivityMessage);
        }
        /// <summary>
        /// Log a User Activity.
        /// </summary>
        /// <param name="ISOTimestamp"></param>
        /// <param name="actionDescription">A string describing the System Activity performed by the component. Example: 
        ///     <example>"BankAccountTableView component refreshed datastore."</example></param>
        /// <param name="userActivity">A key word defined by each software component or application indicating which 
        ///     software-centric function is is most likely indicated by the this user activity. See the Activity Logging 
        ///     API for a standard set of user activity key words. </param>
        /// <param name="userWorkflowState">
        ///     This value must be one of the Workflow Codes defined in this library. See the Activity Logging API 
        ///     for definitions of each workflow code. Example:
        ///         <example>  
        ///         ac = new ActivityLogger();
        ///         ...
        ///         userWorkflowState = ac.WF.SEARCH
        ///         </example>
        /// </param>
        /// <param name="softwareMetadata">Any key/value pairs that will clarify or paramterize this system activity.</param>
        /// <returns>A JSON log message.</returns>
        /// <remarks>
        /// <see cref="registerActivityLogger"/> MUST be called before calling this function. Use <code>logUserActivity</code>
        /// to log actions initiated by an explicit user action. For example, if a software component refreshes a 
        /// data store when the user clicks a Reshresh UI element, that activity should be logged as a User Activity.
        /// However, if the datastore was refreshed automatically after a certain time span, that activity should NOT
        /// be logged as a User Activity, but rather as a System Activity.
        /// </remarks>
        public String logUserActivity(String ISOTimestamp, String actionDescription, String userActivity, WF userWorkflowState, Dictionary<String, String> softwareMetadata = null)
        {
            Dictionary<String, object> recastMetaData = null;
            if (softwareMetadata != null)
            {
                recastMetaData = new Dictionary<string, object>();
                foreach (String key in softwareMetadata.Keys)
                {
                    recastMetaData.Add(key, softwareMetadata[key]);
                }
            }

            return logUserActivity<Object>(ISOTimestamp, actionDescription, userActivity, userWorkflowState, recastMetaData);
        }
        /// <summary>
        /// Log a User Activity, with optionally nested metadata.
        /// </summary>
        /// <param name="ISOTimestamp"></param>
        /// <param name="actionDescription">A string describing the System Activity performed by the component. Example: 
        ///     <example>"BankAccountTableView component refreshed datastore."</example></param>
        /// <param name="userActivity">A key word defined by each software component or application indicating which 
        ///     software-centric function is is most likely indicated by the this user activity. See the Activity Logging 
        ///     API for a standard set of user activity key words. </param>
        /// <param name="userWorkflowState">
        ///     This value must be one of the Workflow Codes defined in this library. See the Activity Logging API 
        ///     for definitions of each workflow code. Example:
        ///         <example>  
        ///         ac = new ActivityLogger();
        ///         ...
        ///         userWorkflowState = ac.WF.SEARCH
        ///         </example>
        /// </param>
        /// <param name="softwareMetadata">Any key/value pairs that will clarify or paramterize this system activity. These values can be nested.</param>
        /// <returns>A JSON log message.</returns>
        /// <remarks>
        /// <see cref="registerActivityLogger"/> MUST be called before calling this function. Use <code>logUserActivity</code>
        /// to log actions initiated by an explicit user action. For example, if a software component refreshes a 
        /// data store when the user clicks a Reshresh UI element, that activity should be logged as a User Activity.
        /// However, if the datastore was refreshed automatically after a certain time span, that activity should NOT
        /// be logged as a User Activity, but rather as a System Activity.
        /// </remarks>
        public String logUserActivity<T>(String ISOTimestamp, String actionDescription, String userActivity, WF userWorkflowState, Dictionary<String, T> softwareMetadata = null)
        {
            Dictionary<String, Object> UserActivityMessage = new Dictionary<string, object>();

            writeHeader(UserActivityMessage);

            UserActivityMessage.Add("timestamp", ISOTimestamp);
            UserActivityMessage.Add("type", "USERACTION ");

            Dictionary<String, Object> parms = new Dictionary<string,object>();
            parms.Add("desc", actionDescription);
            parms.Add("activity", userActivity);
            parms.Add("wf_state", (int)userWorkflowState);
            parms.Add("wf_version", workflowCodingVersion);

            UserActivityMessage.Add("parms", parms);
            UserActivityMessage.Add("metadata",  softwareMetadata);

            return convertToJSON(UserActivityMessage);
        }

        /// <summary>
        /// Log the Layout of a UI Element.
        /// </summary>
        /// <param name="ISOTimestamp"></param>
        /// <param name="actionDescription">A string describing the System Activity performed by the component. Example: 
        ///        <example>"BankAccountTableView moved in User_Dashboard"</example></param>
        /// <param name="uiElementName">The name of the UI component that has changed position or visibility.</param>
        /// <param name="visibility"><code>true</code> if the element is currently visibile. <code>false</code> if the element is completely hidden.</param>
        /// <param name="leftBound">The absolute position on screen, in pixels, of the leftmost boundary of the UI element.</param>
        /// <param name="rightBound">The absolute position on screen, in pixels, of the rightmost boundary of the UI element.</param>
        /// <param name="topBound">The absolute position on screen, in pixels of the top boundary of the UI element.</param>
        /// <param name="bottomBound">The absolute position on screen, in pixels of the bottom boundary of the UI element.</param>
        /// <param name="softwareMetadata">Any key/value pairs that will clarify or paramterize this system activity.</param>
        /// <remarks><see cref="registerActivityLogger"/> MUST be called before calling this function. Use <code>logUILayout</code>
        /// to record any changes to the position or visibility of User Interface elements on screen.</remarks>
        /// <returns>A JSON log message.</returns>
        public String logUILayout(String ISOTimestamp, String actionDescription, String uiElementName, bool visibility, int leftBound, int rightBound, int topBound, int bottomBound, Dictionary<String, String> softwareMetadata = null)
        {
            Dictionary<String, object> recastMetaData = null;
            if (softwareMetadata != null)
            {
                recastMetaData = new Dictionary<string, object>();
                foreach (String key in softwareMetadata.Keys)
                {
                    recastMetaData.Add(key, softwareMetadata[key]);
                }
            }

            return logUILayout<Object>(ISOTimestamp, actionDescription, uiElementName, visibility, leftBound, rightBound, topBound, bottomBound, recastMetaData);
        }

        /// <summary>
        /// Log the Layout of a UI Element, with optionally nested metadata.
        /// </summary>
        /// <param name="ISOTimestamp"></param>
        /// <param name="actionDescription">A string describing the System Activity performed by the component. Example: 
        ///        <example>"BankAccountTableView moved in User_Dashboard"</example></param>
        /// <param name="uiElementName">The name of the UI component that has changed position or visibility.</param>
        /// <param name="visibility"><code>true</code> if the element is currently visibile. <code>false</code> if the element is completely hidden.</param>
        /// <param name="leftBound">The absolute position on screen, in pixels, of the leftmost boundary of the UI element.</param>
        /// <param name="rightBound">The absolute position on screen, in pixels, of the rightmost boundary of the UI element.</param>
        /// <param name="topBound">The absolute position on screen, in pixels of the top boundary of the UI element.</param>
        /// <param name="bottomBound">The absolute position on screen, in pixels of the bottom boundary of the UI element.</param>
        /// <param name="softwareMetadata">Any key/value pairs that will clarify or paramterize this system activity. These can be nested.</param>
        /// <remarks><see cref="registerActivityLogger"/> MUST be called before calling this function. Use <code>logUILayout</code>
        /// to record any changes to the position or visibility of User Interface elements on screen.</remarks>
        /// <returns>A JSON log message.</returns>
        public String logUILayout<T>(String ISOTimestamp, String actionDescription, String uiElementName, bool visibility, int leftBound, int rightBound, int topBound, int bottomBound, Dictionary<String, T> softwareMetadata = null)
        {
            Dictionary<string, object> UILayoutMessage = new Dictionary<string,object>();
            
            writeHeader(UILayoutMessage);

            UILayoutMessage.Add("timestamp", ISOTimestamp);
            UILayoutMessage.Add("type", "UILAYOUT");

            Dictionary<string, object> parms = new Dictionary<string,object>();
            parms.Add("desc", actionDescription);
            parms.Add("visibility", visibility);
            parms.Add("leftBound", leftBound);
            parms.Add("rightBound", rightBound);
            parms.Add("topBound", topBound);
            parms.Add("bottomBound", bottomBound);
            UILayoutMessage.Add("parms", parms);

            UILayoutMessage.Add("metadata", softwareMetadata);

            return convertToJSON(UILayoutMessage);
        }


        //=================END ACTIVITY LOGGING FUNCTIONS========================

        /*=========================INTERNAL FUNCTIONS============================
        * These functions are used internally by the Activity Logger helper 
        * library to generate JSON log messages.
        */

        private void writeHeader(Dictionary<string,object> msg)
        {
            msg.Add("client", clientHostname);
            msg.Add("sessionID", sessionID);
            msg.Add("apiVersion", apiVersion);
            msg.Add("impLanguage", implementationLanguage);

            Dictionary<string, object> component = new Dictionary<string,object>();
            component.Add("name", componentName);
            component.Add("version", componentVersion);
            msg.Add("component", component);
        }

       
        //Write the required API version structured data element
        private String convertToJSON(Dictionary<string, object> msg)
        {
            String json = "{";

            bool isFirstElement = true;
            foreach (String key in msg.Keys)
            {
                if (msg[key] != null)
                {
                    if (!isFirstElement)
                    {
                        json += ", ";
                    }
                    else
                    {
                        isFirstElement = false;
                    }

                    json += "\"" + key + "\":";

                    if (msg[key] is int || msg[key] is float)
                    {
                        json += msg[key];
                    }
                    else if (msg[key] is String)
                    {
                        json += "\"" + msg[key] + "\"";
                    }
                    else if (msg[key] is bool)
                    {
                        bool fieldVal = (bool)msg[key];
                        if (fieldVal)
                        {
                            json += "true";
                        }
                        else
                        {
                            json += "false";
                        }
                    }
                    else if (msg[key] is Dictionary<string, object>)
                    {
                        json += convertToJSON((Dictionary<string, object>)msg[key]);
                    }
                    else
                    {
                        throw new FormatException("Can only serialize numbers, strings, and Dictionary<string, object>s to JSON.");
                    }
                }
            }

            json += "}";
            return json;

        }

        //Write the required Activity structured data element
            //	Write the UI Layout structured data element
            //Write any metadata included by the software developer
            //Internal function to encode a single structured data element 
            //=======================END INTERNAL FUNCTIONS==========================

        }
}


/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.draperlabs.userale.logger;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.Date;
import java.util.HashMap;

import org.draperlabs.userale.structs.Message;
import org.draperlabs.userale.worker.ActivityWorker;

/**
 * Draper ActivityLogger
 *
 * The Java API is specifically aimed to be used as an embedded
 * logger for capturing software characteristics. An example
 * of this would be an ETL (Extract-Transform-Load) scenario
 * where there are many stages/steps executed sequentially or in
 * parallel which when combined make up a unit of workflow.
 *
 * @version 2.1.1
 */
public class ActivityLogger {

  //TODO What is 'use strict' in JS API???
  // Do we need to port this here?
  
  private static String VERSION = "2.1.1";

  private ActivityWorker worker;

  private boolean muteUserActivityLogging;

  private boolean muteSystemActivityLogging;

  private boolean logToConsole;

  private boolean testing;

  private String workflowCodingVersion = "2.0";

  private URL url;

  private String componentName;

  private String componentVersion;

  private Object sessionID = null;

  private Object clientHostName;

  /**
   * The main constructor for the User-ALE ActivityLogger. 
   * @param webWorkerURL the fully qualified {@link String} 
   * representing the {@link org.draperlabs.userale.worker.ActivityWorker}.
   */
  public ActivityLogger(String webWorkerURL) {
    this.worker = new ActivityWorker(webWorkerURL);
    setMuteUserActivityLogging(false);
    setMuteSystemActivityLogging(false);
    setLogToConsole(false);
    setTesting(false);
  }

  /**
   * This should be called when we wish to register an instance of the 
   * {@link ActivityLogger}. Once we register it we can begin to gather metrics
   * from software execution.
   * @param url
   * @param componentName
   * @param componentVersion
   * @throws MalformedURLException
   */
  public void registerActivityLogger(String url, String componentName, String componentVersion) throws MalformedURLException {
    setUrl(new URL(url));
    setComponentName(componentName);
    setComponentVersion(componentVersion);
    //get the session ID from the JRE
    setSessionID(getJREParameterByName("USID"));
    setClientHostName(getJREParameterByName("host"));

    if (sessionID == null) {
      sessionID = componentName + new Date().getTime(); // we 'just' get the component name here we drop .slice(0,3)
    }

    if (clientHostName == null) {
      clientHostName = "UNK";
    }

    // set the logging URL on the ActivityWorker
    worker.postMessage("setLoggingUrl", getUrl());

    //TODO what does classListener(); actually do?

    if (logToConsole) {
      if (testing) {
        System.out.println("DRAPER LOG: (TESTING) Successdfully registered Activity Logger " + getSessionID());
      } else {
        System.out.println("DRAPER LOG: Successfully registered Activity Logger " + getSessionID());
      }     
    }

    // TODO what is sendBuffer actually sending???
    worker.postMessage("sendBuffer", "");

    //return draperLog; TODO Confirm we do not need to return a ActivityLogger instance.
    //we 'should' now be able to log system activity via a call to 
    //    activityLogger.logSystemActivity(params).

  }

  /**
   * This call creates a system/software/task activity message which is 
   * POSTED to the Logging API. Currently we <b>always</b> append an arbitrary string
   * 'SYSACTION' to the logging message. This **may** change in the future.
   * 
   * TODO How do we structure the JSON do we wish to provide a schema for doing so?
   * Right now this is a bit unclear to me.
   *
   * @param actionDescription a {@link String } description of the activity in natural language.
   * This should be fully representative of the task being executed as it can hopefully
   * be used to further analyze the nature of complex algorithms and/or programs more
   * generally.
   * @param softwareMetadata an arbitrary JSON {@link String} that may support this activity.
   */
  public void logSystemActivity(String actionDescription, String softwareMetadata) {

    if(!muteSystemActivityLogging) {
      sendMessage("SYSACTION", actionDescription, softwareMetadata);
      if (logToConsole) {
        if (testing) {
          System.out.println("DRAPER LOG: (TESTING) Logging SystemActivity "
              + "with following description: " + actionDescription);
        } else {
          System.out.println("DRAPER LOG: Logging SystemActivity with following"
              + " description: " + actionDescription);
        }
      }
    }
  };


  /**
   * Sends an activity message to Draper's logging server.
   * @param string an arbitrary {@link String} used to describe the nature of the 
   * operation being logged and example would be 'SYSACTION'.
   * @param actionDescription a {@link String } description of the activity in natural language.
   * @param softwareMetadata
   */
  private void sendMessage(String string, String actionDescription,
      String softwareMetadata) {
    Message msg = Message.newBuilder().build();
    msg.setTimestamp(new Date().toString());
    msg.setClient((String)getClientHostName());
    HashMap<CharSequence, CharSequence> componentMap = new HashMap<>();
    componentMap.put("name", getComponentName());
    componentMap.put("version", ActivityLogger.VERSION); //TODO This is meant to be the software version
                                                         //NOT the ActivityLogger version... correct?
    msg.setComponent(componentMap);
    msg.setSessionID((String)getSessionID());
    msg.setImplLanguage("Java"); // TODO Is this always the case? I am not sure it is.
    msg.setApiVersion(ActivityLogger.VERSION);

    // if (!testing) {
      worker.postMessage("sendMsg", msg);
    // }
  }
  
  /**
   * When set to true, logs messages to browser console.
   *
   * @param echo set to true to log to console
   */
  public void echo (boolean echo){
    if (echo) { 
      setLogToConsole(true);
    }
    worker.postMessage("setEcho", true);
  }

  /**
   * Accepts an array of Strings telling logger to mute those type of messages.
   * Possible values are 'SYS' and 'USER'.  These messages will not be sent to
   * server.
   *
   * @param messageType an {@link java.util.Array} of {@link String} messages to mute.
   */
  public void mute (String[] messageType){
    for (String string : messageType) {
      if(string.equalsIgnoreCase("USER") || string.equalsIgnoreCase("SYS")) {
        setMuteUserActivityLogging(true);
      }
    } //TODO should be post that it has been muted?
  }

    /**
     * Accepts an array of Strings telling logger to un-mute those type of messages.
     * Possible values are 'SYS' and 'USER'.  These messages will not be sent to
     * server.
     *
     * @param messageType an {@link java.util.Array} of {@link String} messages to un-mute.
     */
  public void unmute (String[] messageType) {
    for (String string : messageType) {
      if(string.equalsIgnoreCase("USER") || string.equalsIgnoreCase("SYS")) {
        setMuteUserActivityLogging(true);
      }
    } //TODO should we post it has been unmuted?
  }

  /**
   * When set to true, no connection will be made against logging server.
   *
   * @param test set to true to disable all connection to logging server
   */
  public void testing(Boolean test) {
    if (test) { 
      setTesting(true);
    } else {
      setTesting(false);
    }
    worker.postMessage("setTesting", getTesting());
  }

  /**
   * This method should obtain the JRE sessionsID which can
   * be used to consistently log events against a series of
   * particular task executions.
   * @param string
   * @return returns a specific metric from the JRE/JVM.
   */
  private Object getJREParameterByName(String string) {
    // TODO Auto-generated method stub
    return null;
  }



  /**
   * @param args
   */
  public static void main(String[] args) {
    // TODO Auto-generated method stub

  }

  public boolean isMuteUserActivityLogging() {
    return muteUserActivityLogging;
  }

  public void setMuteUserActivityLogging(boolean muteUserActivityLogging) {
    this.muteUserActivityLogging = muteUserActivityLogging;
  }

  public boolean isMuteSystemActivityLogging() {
    return muteSystemActivityLogging;
  }

  public void setMuteSystemActivityLogging(boolean muteSystemActivityLogging) {
    this.muteSystemActivityLogging = muteSystemActivityLogging;
  }

  public String getWorkflowCodingVersion() {
    return workflowCodingVersion;
  }

  public void setWorkflowCodingVersion(String workflowCodingVersion) {
    this.workflowCodingVersion = workflowCodingVersion;
  }

  public URL getUrl() {
    return url;
  }

  public void setUrl(URL url) {
    this.url = url;
  }

  public String getComponentName() {
    return componentName;
  }

  public void setComponentName(String componentName) {
    this.componentName = componentName;
  }

  public String getComponentVersion() {
    return componentVersion;
  }

  public void setComponentVersion(String componentVersion) {
    this.componentVersion = componentVersion;
  }

  public boolean getLogToConsole() {
    return logToConsole;
  }

  public void setLogToConsole(Boolean logToConsole) {
    this.logToConsole = logToConsole;
  }

  public boolean getTesting() {
    return testing;
  }

  public void setTesting(Boolean testing) {
    this.testing = testing;
  }

  public Object getSessionID() {
    return (String)sessionID;
  }

  public void setSessionID(Object sessionID) {
    this.sessionID = sessionID;
  }

  public Object getClientHostName() {
    return (String)clientHostName;
  }

  public void setClientHostName(Object clientHostName) {
    this.clientHostName = clientHostName;
  }

}

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

import java.net.InetAddress;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.UnknownHostException;
import java.util.Date;

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
  
  @SuppressWarnings("unused")
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
  
  // This is the static endpoint used within XDATA Workshop.
  public static String LOGGING_ENDPOINT = "http://xd-draper.xdata.data-tactics-corp.com:1337";

  /**
   * The main constructor for the User-ALE ActivityLogger. 
   */
  public ActivityLogger() {
    this.worker = new ActivityWorker();
    setMuteUserActivityLogging(false);
    setMuteSystemActivityLogging(false);
    setLogToConsole(false);
    setTesting(true); //
  }

  /**
   * This should be called when we wish to register an instance of the 
   * {@link ActivityLogger}. Once we register it we can begin to gather metrics
   * from software execution.
   * @param url the logging server end-point, logger is currently static and behind XDATA VPN. 
   * This will change when migrated to AWS. Possibility to change again when local logging via
   * nodejs is implemented.
   * @param componentName the component name we are currently logging activity for
   * @param componentVersion version version of the actual component we are logging
   * @throws MalformedURLException
   */
  public void registerActivityLogger(String url, String componentName, String componentVersion) throws MalformedURLException {
    if (url !=null) {
      setUrl(new URL(url));
    } else {
      setUrl(new URL(LOGGING_ENDPOINT));
    }
    setComponentName(componentName);
    setComponentVersion(componentVersion);
    setSessionID(System.getenv("user.name") + "-" + System.getenv("os.name") + "-" + System.getenv("os.version"));
    try {
      setClientHostName(InetAddress.getLocalHost().getHostName());
    } catch (UnknownHostException e) {
      e.printStackTrace();
    }

    if (sessionID == null) {
      sessionID = componentName + new Date().getTime(); 
    }

    if (clientHostName == null) {
      clientHostName = "UNK";
    }

    // set the logging URL on the ActivityWorker
    worker.postMessage("setLoggingUrl", getUrl().toString());

    if (logToConsole) {
      if (testing) {
        System.out.println("DRAPER LOG: (TESTING) Successdfully registered Activity Logger " + getSessionID());
      } else {
        System.out.println("DRAPER LOG: Successfully registered Activity Logger " + getSessionID());
      }     
    }
  }

  /**
   * This call creates a system/software/task activity message which is 
   * POSTED to the Logging API. Currently we <b>always</b> append an arbitrary string
   * 'SYSACTION' to the logging message.
   *
   * @param actionDescription a {@link String} description of the activity in natural language.
   * This should be fully representative of the task being executed as it can hopefully
   * be used to further analyze the nature of complex algorithms and/or programs more
   * generally. This may be an excerpt from the Javadoc for the method call.
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
   * @param actionType an arbitrary {@link String} used to describe the nature of the 
   * operation being logged and example would be 'SYSACTION'.
   * @param actionDescription a {@link String } description of the activity in natural language.
   * @param softwareMetadata
   */
  private void sendMessage(String actionType, String actionDescription,
      String softwareMetadata) {

    //TODO define software metadata structure and description based upon
    //existing wengine ontology. 
    String message = 
    "{ " +
      "\"type\" : \"" + actionType + "\", " +
      "\"parms\" : { " +
        "\"desc\" : \"" + actionDescription + "\"" +
      "}," +
      "\"timestamp\" : \"" + System.currentTimeMillis() + "\"," +
      "\"client\" : \"" + getClientHostName() + "\"," +
      "\"component\" : {" +
        "\"name\" : \"" + getComponentName() + "\"," +
        "\"version\" : \"" + getComponentVersion() + "\"" +
      "}," +
      "\"sessionID\" : \"" + getSessionID() + "\"," +
      "\"impLanguage\" : \"Java\"," +
      "\"apiVersion\" : \"0.2.0\"" +
    "}";
    
    if (!testing) {
      worker.postMessage("sendMsg", message);
    }
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
    worker.postMessage("setEcho", String.valueOf(getLogToConsole()));
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
    }
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
    }
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
    worker.postMessage("setTesting", String.valueOf(getTesting()));
  }

  /**
   * @param args
   */
  public static void main(String[] args) {
    //TODO implement command line parsing using commons-cli
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

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
package org.draperlabs.userale.worker;

import java.util.ArrayList;

/**
 * The {@link ActivityWorker} is an encapsulated class 
 * which does all of the heavy lifting for the actual
 * {@link org.draperlabs.userale.logger.AcvtivityLogger}
 * instance.
 */
public class ActivityWorker {
  
  private ArrayList<?> logBuffer = new ArrayList<Object>();
  private static String LOGGING_URL = "http://localhost:3001";
  private int intervalTime = 5000; //send every 5 seconds
  private boolean testing = false;
  private boolean echo = true;
  private String msg = "DRAPER LOG: ";

  public ActivityWorker(String webWorkerURL) {
  }
  
  private void timerMethod() {

    if (getLogBuffer().size() != 0) {
      if (echo) {
        System.out.println(getMsg() + " sent " + getLogBuffer().size() + " logs to enpoint: " + getLOGGING_URL());
      }
      //This is the real thing, we are logging.
      if (!isTesting()) {
        xmlHttpRequest(getLOGGING_URL() + "/send_log", getLogBuffer());
          setLogBuffer(null);
      // This is a test, we are not logging.
      } else {
        setLogBuffer(null);
      }   
    } else {
      if (echo) {
        System.out.println(msg + ": no log sent, buffer is empty.");
      }
    }
  }
  
  private void sendBuffer() {
    // method to force flushing the buffer
    timerMethod();
    if (echo) {
      System.out.println(msg + ": buffer sent");
    } 
  }

  private void xmlHttpRequest(String string, ArrayList<?> logBuffer2) {
    String xhr;//TODO define the HTTP REquest object, maybe as top level private variable.

    //if(XMLHttpRequest type "undefined") xhr = new XMLHttpRequest();
    //else {
      String[] versions = {"MSXML2.XmlHttp.5.0", 
                      "MSXML2.XmlHttp.4.0",
                      "MSXML2.XmlHttp.3.0", 
                      "MSXML2.XmlHttp.2.0",
                      "Microsoft.XmlHttp"};

      for(int i = 0, len = versions.length; i < len; i++) {
        try {
          //xhr = new ActiveXObject(versions[i]);
          break;
        }
        catch(e){}
      } 
    //}

    //xhr.onreadystatechange = ensureReadiness;

    ensureReadiness();

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(log));
    
  }

  private void ensureReadiness() {
      if(xhr.readyState < 4) {
        return;
      }

      if(xhr.status != 200) {
        return;
      }

      // all is well  
      if(xhr.readyState === 4) {
        callback(xhr);
      }     
    
  }

  /**
   * @param args
   */
  public static void main(String[] args) {
    // TODO Auto-generated method stub

  }

  public void postMessage(String string, Object object) {
    // TODO Auto-generated method stub
    
  }

  /**
   * @return the logBuffer
   */
  public ArrayList<?> getLogBuffer() {
    return logBuffer;
  }

  /**
   * @param logBuffer the logBuffer to set
   */
  public void setLogBuffer(ArrayList<?> logBuffer) {
    this.logBuffer = logBuffer;
  }

  /**
   * @return the lOGGING_URL
   */
  public static String getLOGGING_URL() {
    return LOGGING_URL;
  }

  /**
   * @param lOGGING_URL the lOGGING_URL to set
   */
  public static void setLOGGING_URL(String lOGGING_URL) {
    LOGGING_URL = lOGGING_URL;
  }

  /**
   * @return the intervalTime
   */
  public int getIntervalTime() {
    return intervalTime;
  }

  /**
   * @param intervalTime the intervalTime to set
   */
  public void setIntervalTime(int intervalTime) {
    this.intervalTime = intervalTime;
  }

  /**
   * @return the testing
   */
  public boolean isTesting() {
    return testing;
  }

  /**
   * @param testing the testing to set
   */
  public void setTesting(boolean testing) {
    this.testing = testing;
  }

  /**
   * @return the msg
   */
  public String getMsg() {
    return msg;
  }

  /**
   * @param msg the msg to set
   */
  public void setMsg(String msg) {
    this.msg = msg;
  }

  /**
   * @return the echo
   */
  public boolean isEcho() {
    return echo;
  }

  /**
   * @param echo the echo to set
   */
  public void setEcho(boolean echo) {
    this.echo = echo;
  }

}

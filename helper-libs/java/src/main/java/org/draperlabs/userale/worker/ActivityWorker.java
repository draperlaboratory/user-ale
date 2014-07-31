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

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.util.ArrayList;

import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.draperlabs.userale.logger.ActivityLogger;

/**
 * The {@link ActivityWorker} is an encapsulated class 
 * which does all of the heavy lifting for the actual
 * {@link org.draperlabs.userale.logger.ActivityLogger}
 * instance.
 */
public class ActivityWorker {

  private ArrayList<?> logBuffer = new ArrayList<Object>();
  private static String LOGGING_URL = "http://localhost:3001";
  private int intervalTime = 5000; //send every 5 seconds
  private boolean testing = false;
  private boolean echo = true;
  private String msg = "DRAPER LOG: ";

  private void timerMethod() {

    if (getLogBuffer().size() != 0) {
      if (echo) {
        System.out.println(getMsg() + " sent " + getLogBuffer().size() + " logs to enpoint: " + getLOGGING_URL());
      }
      //This is the real thing, we are logging.
      if (!isTesting()) {
        postMessage("", ""); //getLogBuffer()
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


  /**
   * @param args
   */
  public static void main(String[] args) {
    // TODO Auto-generated method stub

  }

  public void postMessage(String string, String message) {

    try {
      DefaultHttpClient httpClient = new DefaultHttpClient();
      HttpPost postRequest = new HttpPost(
          ActivityLogger.LOGGING_ENDPOINT + "/send_msg");

      StringEntity input = new StringEntity(message);
      input.setContentType("application/json;charset=UTF-8");
      postRequest.setEntity(input);

      HttpResponse response = httpClient.execute(postRequest);

      if (response.getStatusLine().getStatusCode() != 201) {
        throw new RuntimeException("Failed : HTTP error code : "
            + response.getStatusLine().getStatusCode());
      }
      BufferedReader br = new BufferedReader(
          new InputStreamReader((response.getEntity().getContent())));

      String output;
      System.out.println("Output from Server .... \n");
      while ((output = br.readLine()) != null) {
        System.out.println(output);
      }
      httpClient.getConnectionManager().shutdown();
    } catch (MalformedURLException e) {
      e.printStackTrace();
    } catch (IOException e) {
      e.printStackTrace();
    }
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

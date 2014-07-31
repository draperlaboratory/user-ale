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
package org.draperlabs.userale.state;

/**
 * This class merely provides static references to software states.
 * These states are combined with other logging metrics and send via the POST
 * REST call to be logged.
 */
public class ActivityState {

  
  /** 
   *  If the user action does not appear to map to any other workflow state, 
   * please use Other and contact Draper. 
   */
  public static int WF_OTHER = 0;

  /** 
   * This state includes: receiving tasking, refining the request (perhaps 
   * with the requestor), defining specific goals and objectives for the 
   * request, specifying research questions and/or hypotheses to test, and 
   * justifying the tasking.
   */
  public static int WF_DEFINE = 1;

  /**
   * Get Data involves creating (formulating and writing), executing, and refining search queries.
   */
  public static int WF_GETDATA = 2;

  /**
   * Explore Data involves consuming data (reading, listening, watching) or visualizations of data.
   */
  public static int WF_EXPLORE = 3;

  /**
   * Create View of Data involves the organization of data.
   */
  public static int WF_CREATE = 4;

  /**
   * In Enrich, the user actively adds insight value back into the tool.
   */
  public static int WF_ENRICH = 5;

  /**
   * In Transform, the user takes a deeper look at the data.
   */
  public static int WF_TRANSFORM = 6;

}

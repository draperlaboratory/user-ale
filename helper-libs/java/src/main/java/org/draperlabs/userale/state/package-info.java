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
/**
 * The JavaScript activity logger attempts to capture 'states' relating to 
 * specific user behavior. We try to mimic this within the Java API by attempting
 * to build a taxonomy of software states.</p> 
 * By capturing state characteristics we can make general assertions about (for example) 
 * how long a particular program remains idle whilst a specific task completes.</p>
 * Currently there appears to be no existing taxonomy for describing software and/or 
 * program states so this is an effort to begin understanding and substantiating on 
 * our understanding of this area.</p>
 * 
 * For more information please see the
 * <a href="https://github.com/draperlaboratory/user-ale/tree/master/helper-libs">Draper Labs Github Repos</a>
 */
package org.draperlabs.userale.state;
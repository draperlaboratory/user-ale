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
 * This package contains data structures defined in JSON and stored in <code>src/main/resources/</code>.</p>
 * The JSON is compiled into Java beans using the GoraCompiler. This ensures that we define a fully
 * compliant Java bean and which we can hold in memory whilst we populate it with data. Such a 
 * Java bean will also scale if data structures grow.</p>
 * <p>Finally, the Gora data bean essentially writes Avro data meaning it is Hadoop
 * compatible should there be a requirement to persist logs into HDFS or another
 * larger storage backend.</p>
 * For more information please see the
 * <a href="https://github.com/draperlaboratory/user-ale/tree/master/helper-libs">Draper Labs Github Repos</a>
 */
package org.draperlabs.userale.structs;
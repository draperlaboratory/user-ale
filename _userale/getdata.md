---
layout: workflow
title: Get Data
wf_code: WF_GETDATA
css_class: wf_getdata
prev_section: drafts
next_section: variables
permalink: /wf_states/getdata/
---


#Description

Get Data involves __creating__ (formulating and writing), **executing**, and **refining** search queries.  Refining may include drilling down, augmenting (e.g., for multiple spellings).  We use the term *query* loosely -- a database is not required.   Because some searches are on-going, any action involved in monitoring the status or checking for new results from a persistent search also fall into this activity.   Operationally, this state would include requesting data from others, but that is out of scope for XDATA.

#Example Usages

<ul class="list-group">
  <li class="list-group-item">
    <h5>If you are...</h5>
    <p style="margin-left: 15px; ">
      <b>Creating a filter or query</b> for getting data (whether that filter is done with a text box or crossfiltered views or checkboxes or sliders or ...) A visual filter has an interactive component, such as a slider, or dragging a box around an area on a map.
    </p>

    <h5>Consider the following activities...</h5>
    <div   style="margin-left: 15px;">
      <code>select_filter_menu_option, enter_filter_text, set_visual_filter_parameters, reset_filter_parameters, remove_visual_filter, remove_query_filter</code>
    </div>
  </li>
  <li class="list-group-item">
    <h5>If you are...</h5>
    <p style="margin-left: 15px; ">
      <b>Executing a query</b> or visual search (if that takes a separate step).
    </p>

    <h5>Consider the following activities...</h5>
    <div style="margin-left: 15px;">
      <code>execute_query_filter, execute_visual_filter, abort_query</code>
    </div>
  </li>
</ul>
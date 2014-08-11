---
layout: workflow
title: Explore Data
wf_code: WF_EXPLORE
css_class: wf_explore
permalink: /wf_states/explore/
---
#Description

Explore Data involves consuming data (reading, listening, watching) or visualizations of data. This activity may involve the examination of a visualization, or the comparing of multiple views of a dataset.  Explore may be dynamic, but is a passive state (vs. Enrich).  This is the triage step of taking a first look at the data.  This is typically a big picture view.

#Example Usages

<ul class="list-group">
  <li class="list-group-item">
    <h5>If you are...</h5>
    <p style="margin-left: 15px; ">
      Interacting with a map or visualization
    </p>

    <h5>Consider the following activities...</h5>
    <div   style="margin-left: 15px;">
      <code>pan (pan_start, pan_end), zoom (zoom_in, zoom_out), rotate,
drag_object (drag_object_start, drag_object_end),
drag (drag_start, drag_end), hover (hover_start, hover_end),
select_object, deselect_object, expand_data, collapse_data</code>
    </div>
  </li>
  <li class="list-group-item">
    <h5>If you are...</h5>
    <p style="margin-left: 15px; ">
      Controls for the user to directly interact with the data presented within a visualization
    </p>

    <h5>Consider the following activities...</h5>
    <div style="margin-left: 15px;">
      <code>sort, scroll, show_data_info, hide_data_info, highlight_data</code>
    </div>
  </li>
</ul>
---
layout: workflow
title: Transform Data
wf_code: WF_TRANSFORM
css_class: wf_transform
permalink: /wf_states/transform/
---
#Description
In Transform, the user takes a deeper look at the data. The user applies algorithms to transform the data (reduce, denoise, etc.) and searches for patterns. Actions may be informed by SME knowledge or knowledge gained from other datasets. Actions may include interpolating or extrapolating, comparing across data sets or models, correlating. (Making notes or conclusions about patterns is in Enrich. Identifying/searching for them is in Transform.)

#Example Usages

<ul class="list-group">
  <li class="list-group-item">
    <h5>If you are...</h5>
    <p style="margin-left: 15px; ">
      Letting your user directly interact with the behavior of an algorithm (such as running a pattern match, or changing the parameters of a clustering algorithm)
    </p>

    <h5>Consider the following activities...</h5>
    <div   style="margin-left: 15px;">
      <code>denoise, detrend, pattern_search, "do_math",
transform_data, coordinate_transform</code>
    </div>
  </li>
</ul>
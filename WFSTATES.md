##Define Problem

###Description

Most of Define the Problem will be accomplished outside of XDATA tools (largely in the challenge problem assignment interface). This state includes: receiving tasking, refining the request (perhaps with the requestor), defining specific goals and objectives for the request, specifying research questions and/or hypotheses to test, and justifying the tasking.

####Example Usages

None at this time

##Get Data

###Description

Get Data involves creating (formulating and writing), executing, and refining search queries. Refining may include drilling down, augmenting (e.g., for multiple spellings). We use the term 'query' loosely -- a database is not required. Because some searches are on-going, any action involved in monitoring the status or checking for new results from a persistent search also fall into this activity. Operationally, this state would include requesting data from others, but that is out of scope for XDATA.

####Example Usages

__If you are...__

Creating a filter or query for getting data (whether that filter is done with a text box or crossfiltered views or checkboxes or sliders or ...) A visual filter has an interactive component, such as a slider, or dragging a box around an area on a map.

__Consider the following activities...__

`select_filter_menu_option`, `enter_filter_text`, `set_visual_filter_parameters`, `reset_filter_parameters`, `remove_visual_filter`, `remove_query_filter`

__If you are...__

Executing a query or visual search (if that takes a separate step).

__Consider the following activities...__

`execute_query_filter`, `execute_visual_filter`, `abort_query`


##Explore Data

###Description

Explore Data involves consuming data (reading, listening, watching) or visualizations of data. This activity may involve the examination of a visualization, or the comparing of multiple views of a dataset. Explore may be dynamic, but is a passive state (vs. Enrich). This is the triage step of taking a first look at the data. This is typically a big picture view.

####Example Usages

__If you are...__

Interacting with a map or visualization

__Consider the following activities...__

`pan (pan_start, pan_end)`, `zoom (zoom_in, zoom_out)`, `rotate`, `drag_object (drag_object_start, drag_object_end)`, `drag (drag_start, drag_end)`, `hover (hover_start, hover_end)`, `select_object`, `deselect_object`, `expand_data`, `collapse_data`

__If you are...__

Controls for the user to directly interact with the data presented within a visualization

__Consider the following activities...__

`sort`, `scroll`, `show_data_info`, `hide_data_info`, `highlight_data`

##Create View

###Description

Create View of Data involves the organization of data. Creating and manipulating the spatial layout in a visualization, creating categories, deriving higher-level structures, and merging pieces of information all fall under this activity.

####Example Usages

__If you are...__

Configuring or adjusting the overall UI. This includes arrangement of windows, and hiding/showing of control panels or help functions, but not hiding/showing of data.

__Consider the following activities...__

`open_modal_tools`, `close_modal_tools`, `show_tools`, `hide_tools`, `resize_window`, `resize_component`, `arrange_windows`, `scroll`, `show_instructional_material`, `hide_instructional_material`

__If you are...__

Generating or displaying visualizations of data (including maps, plots, tables, and more)

__Consider the following activities...__

`show_map`, `hide_map`, `show_plot`, `hide_plot`, `show_data`, `hide_data`, `show_table`, `hide_table`, `show_graph`, `hide_graph`, `show_chart`, `hide_chart`

__If you are...__

Defining the parameters for a visualization (including maps, plots, tables, and more)

__Consider the following activities...__

`select_plot_type`, `select_table_type`, `select_map_type`, `select_graph_type`, `select_map_layer_type`, `set_map_layer_properties`, `set_plot_properties`, `set_chart_properties`, `set_graph_properties`, `define_axes`, `add_map_layer`, `remove_map_layer`, `start_animation`, `stop_animation`, `pause_animation`, `set_animation_properties`

##Enrich Data

###Description

In Enrich, the user actively adds insight value back into the tool. Activities include annotating/tagging/labeling data with textual notes or links, bookmarking views, creating links between data elements. Annotations may include external insight (from SMEs), algorithmic results (searching for patterns, denoising, etc.), identifying patterns/trends, (Making notes or conclusions about patterns is in Enrich. Identifying/searching for them is in Transform.)

####Example Usages

__If you are...__

Letting the user organize their data, in a sandbox or workspace

__Consider the following activities...__

`create_workspace`, `remove_workspace`, `add_to_workspace`, `remove_from_workspace`, `clear_workspace`, `export_data`, `import_data`

__If you are...__

Letting your user annotate or mark the data. This is an active process of having the user document their insight within your tool

__Consider the following activities...__

`annotate_graph`, `annotate_plot`, `annotate_chart`, `annotate_map`, `remove_graph_annotation`, `remove_map_annotation`, `remove_chart_annotation`, `bookmark_view`, `add_note`, `remove_note`, `highlight_data`

##Transform Data

###Description

In Transform, the user takes a deeper look at the data. The user applies algorithms to transform the data (reduce, denoise, etc.) and searches for patterns. Actions may be informed by SME knowledge or knowledge gained from other datasets. Actions may include interpolating or extrapolating, comparing across data sets or models, correlating. (Making notes or conclusions about patterns is in Enrich. Identifying/searching for them is in Transform.)

####Example Usages

__If you are...__

Letting your user directly interact with the behavior of an algorithm (such as running a pattern match, or changing the parameters of a clustering algorithm)

__Consider the following activities...__

`denoise`, `detrend`, `pattern_search`, `"do_math"`, `transform_data`, `coordinate_transform`

##Other

###Description

If the user action does not appear to map to any other workflow state, please use Other.  As part of ongoing development, this is also the state where we are capturing dormant workflow states:  those that are not currently being addressed by development programs.  Please contact the Draper development team to discuss dormant states, new states or additional uses of Other.

###Dormant Workflow States

####Plan the Analysis
Plan includes all of the overhead of the user’s interaction with the tool.  While critical for a professional analyst, our experimental participants will not have access to this level of tool control.  Identifying resources, selection/configuration of the tool (including version control), selection and wrangling of datasets, tool switching, and outlining a plan of attack (creating to-do lists, organizing workflow, assessing progress) all fall under this activity. 

####Curate Data
Curate Data is required because big data is typically messy.  This is an organizational and clean-up state, and currently the main catch-all for the Extract, Transform, Load (ETL) process.  Activities include assessing data quality, cleaning/standardizing/normalizing/formatting data, merging data sets, removing duplicates, merging data sets, removing unwanted data.  All of this will be done prior to the experiment.  Future functions might include import/load/open/bring into workspace, cut, copy, paste, …

####Interpret Data
In Interpret, the user relates their insights to the tasking at hand (that is, the questions they are trying to answer, or the hypotheses they are trying to test).  This involves constructing an argument from one or more visualizations of enriched data, relating data to questions, testing hypotheses, being vigilant for bias, managing data provenance.  Use of an Analysis of Competing Hypotheses (ACH) widget would be a good example of Interpret vs. Enrich.

####Collaborate
Collaborate includes reviewing another’s work, showing their work product to another analyst (peer or superior), or preparing materials for a presentation.  Collaboration may be synchronous or asynchronous.  This state also includes pulling in findings from collaboration (e.g., red team notes)

####Draft and Publish Report
Report first involves the generation of the work-product by the analyst. Summarizing findings, creating storyboards, formatting data, writing, and editing of reports (including editing for audience) all fall under this activity.  Report further includes final task closeout, including getting permission to release, disseminating the report, storing/saving data for later use, archiving, exporting.




####Example Usages

None at this time

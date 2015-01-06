/*jslint browser: true */

/*globals $, tangelo, d3, vg, console */

var state_names = {
    "AL": "Alabama",
    "AK": "Alaska",
    "AS": "American Samoa",
    "AZ": "Arizona",
    "AR": "Arkansas",
    "CA": "California",
    "CO": "Colorado",
    "CT": "Connecticut",
    "DE": "Delaware",
    "DC": "District Of Columbia",
    "FM": "Federated States Of Micronesia",
    "FL": "Florida",
    "GA": "Georgia",
    "GU": "Guam",
    "HI": "Hawaii",
    "ID": "Idaho",
    "IL": "Illinois",
    "IN": "Indiana",
    "IA": "Iowa",
    "KS": "Kansas",
    "KY": "Kentucky",
    "LA": "Louisiana",
    "ME": "Maine",
    "MH": "Marshall Islands",
    "MD": "Maryland",
    "MA": "Massachusetts",
    "MI": "Michigan",
    "MN": "Minnesota",
    "MS": "Mississippi",
    "MO": "Missouri",
    "MT": "Montana",
    "NE": "Nebraska",
    "NV": "Nevada",
    "NH": "New Hampshire",
    "NJ": "New Jersey",
    "NM": "New Mexico",
    "NY": "New York",
    "NC": "North Carolina",
    "ND": "North Dakota",
    "MP": "Northern Mariana Islands",
    "OH": "Ohio",
    "OK": "Oklahoma",
    "OR": "Oregon",
    "PW": "Palau",
    "PA": "Pennsylvania",
    "PR": "Puerto Rico",
    "RI": "Rhode Island",
    "SC": "South Carolina",
    "SD": "South Dakota",
    "TN": "Tennessee",
    "TX": "Texas",
    "UT": "Utah",
    "VT": "Vermont",
    "VI": "Virgin Islands",
    "VA": "Virginia",
    "WA": "Washington",
    "WV": "West Virginia",
    "WI": "Wisconsin",
    "WY": "Wyoming"
};

var userActivities = {
    switchChartType: 1,
    changeXAxis:     2,
    changeYAxis:     3,
    changeDataScope: 4,
    changeDataSource:5,
    highlightData:   6,
    summerizeData:   7
};

var updateUI =	function (element, msg, visibility) {
			var elementAddress = "#" + element;
			var height = d3.select(elementAddress)[0][0].offsetHeight;
			var left = d3.select(elementAddress)[0][0].offsetLeft;
			var top = d3.select(elementAddress)[0][0].offsetTop;
			var width = d3.select(elementAddress)[0][0].offsetWidth;
			// ac.logUILayout(msg, element, visibility, left, left+width, top, top+height);
		}


var ac = new activityLogger().testing(false).echo(true).mute(['SYS']);
// var ac = {};

var all_records, states, treatments, hospitals, outcome_map, averages, hospitals_geolocation;
var state_set = {},
    treatment_set = {};

var home = {vis: null,
            order: "cost",
            scale: "cost",
            treatment: "pneumonia",
            scope: "nation",
            colormap_n: 50,
            moving_avg: false,
            national_avg: false,
            geom: {height: 400,
                   width: 600,
                   margin: {left: 75,
                            right: 200,
                            top: 10,
                            bottom: 35
                   }
            },

            setup: function () {
                "use strict";


                var i,
                    positions;

                home.vis = d3.select("#vis")
                    .style("width", (home.geom.width + home.geom.margin.left + home.geom.margin.right) + "px")
                    .style("height", (home.geom.height + home.geom.margin.top + home.geom.margin.bottom) + "px");

                // Create a color legend.
                //
                // Create a series of rects stacked at the right of the graph.
                positions = [];
                for (i = 0; i < home.colormap_n; i += 1) {
                    positions.push(i * (0.4 * home.geom.height / home.colormap_n));
                }

                home.vis.select("g.legend")
                    .selectAll("rect")
                    .data(positions.reverse())
                    .enter()
                    .append("rect")
                    .classed("legend", true)
                    .style("fill", "rgba(0,0,0,0)")
                    .attr("x", home.geom.margin.left + home.geom.width + 100)
                    .attr("y", function (d) {
                        return home.geom.margin.top + d;
                    })
                    .attr("width", 40)
                    .attr("height", 0.4*home.geom.height / home.colormap_n + 1);

                d3.select("#axislabelleft")
                    .text("Lower")
                    .attr("x", home.geom.margin.left)
                    .attr("y", function () {
                        return home.geom.margin.top + home.geom.height + 1.5*this.getBBox().height;
                    })
                    .text("");
                d3.select("#axislabelright")
                    .text("Higher")
                    .attr("x", home.geom.margin.left + home.geom.width)
                    .attr("y", function () {
                        return home.geom.margin.top + home.geom.height + 1.5*this.getBBox().height;
                    })
                    .text("");
            },

            init: function () {
                "use strict";

                var states_copy = states.slice();
                states_copy.shift();
                states_copy.unshift("None");

                d3.select("#state").selectAll("option")
                    .data(states_copy)
                    .enter().append("option")
                    .text(function (d) { return d; });
                d3.select("#state").on("change", function () {
                  home.select_state(this.value);
		  if(this.value == "None")
			{
				ac.logUserActivity("User removed data highlighting.", "highlightData", ac.WF_EXPLORE);
			}else{
                  		ac.logUserActivity("User highlighted a subset of data.", "highlightData", ac.WF_EXPLORE);
			}
                });

                d3.select("#scope").selectAll("option")
                    .data(states)
                    .enter().append("option")
                    .text(function (d) { return d; });
                d3.select("#scope").on("change", function () {

                    var hospitals = [], d, hospital = $("#hospital").val(), keep_hospital, state = this.value;
                    if (state === "Entire U.S.") {
                        // ac.logSystemActivity("User zoomed out to entire data set.");
                        home.scope = "nation";
                        d3.select("#state").style("display", "inline");
                        state = $("#state").val();
                        for (d in state_set[state]) {
                            if (state_set[state].hasOwnProperty(d)) {
                                hospitals.push(d);
                            }
                        }
                        hospitals.sort(d3.ascending);
                        hospitals.unshift("ALL");
                        d3.select("#hospital").selectAll("option").remove();
                        d3.select("#hospital").selectAll("option")
                            .data(hospitals)
                            .enter().append("option")
                            .text(function (d) { return d; });
                        $("#hospital").val(hospital);
                      home.update();
                    } else {
                        ac.logUserActivity("User zoomed to data subset.", "changeDataScope", ac.WF_EXPLORE);
                        home.scope = "state";
                        d3.select("#state").style("display", "none");
                        keep_hospital = (state === $("#state").val());
                        home.select_state(state);
                        if (keep_hospital) {
                          home.select_hospital(hospital);
                        }
                    }
                });

                d3.select("#treatment").on("change", function () {
                    home.update();
                    // logSystemActivity("treatment changed");
                });
                d3.select("#hospital").selectAll("option")
                    .data(hospitals)
                    .enter().append("option")
                    .text(function (d) { return d; });
                d3.select("#hospital")
                    .property("value", "")
                    .on("change", function() {home.update(); console.log("hospital change event");});
                //d3.select("#hospital").style("display", "none");
                d3.select("#compare").on("change", function() {home.update(); console.log("compare change event");});

                d3.select("#order-cost").on("click", function () { home.order = "cost"; home.update(); ac.logUserActivity("Reorder Bar Chart by Cost", "changeXAxis",  ac.WF_EXPLORE);});
                d3.select("#order-reimbursement").on("click", function () { home.order = "reimbursement"; home.update(); ac.logUserActivity("Reorder Bar Chart by Reimbursement", "changeXAxis",  ac.WF_EXPLORE);});
                d3.select("#order-mortality").on("click", function () { home.order = "mortality"; home.update(); ac.logUserActivity("Reorder Bar Chart by Mortality", "changeXAxis",  ac.WF_EXPLORE);});

                d3.select("#scale-cost").on("click", function () { home.scale = "cost"; home.update(); ac.logUserActivity("Set Bar Chart Scale to Cost", "changeYAxis",  ac.WF_EXPLORE);});
                d3.select("#scale-reimbursement").on("click", function () { home.scale = "reimbursement"; home.update(); ac.logUserActivity("Set Bar Chart Scale to Reimbursement", "changeYAxis",  ac.WF_EXPLORE);});
                d3.select("#scale-mortality").on("click", function () { home.scale = "mortality"; home.update(); ac.logUserActivity("Set Bar Chart Scale to Mortality", "changeYAxis",  ac.WF_EXPLORE);});

                d3.select("#treatment-heart").on("click", function () { home.treatment = "heart failure"; home.update(); ac.logUserActivity("Data source changed to heart failure.", "changeDataSource",  ac.WF_GETDATA); });
                d3.select("#treatment-pneumonia").on("click", function () { home.treatment = "pneumonia"; home.update(); ac.logUserActivity("Data source changed to pneumonia.", "changeDataSource",  ac.WF_GETDATA) });

                d3.select("#moving-avg")
                    .on("change", function () {
                        home.moving_avg = this.checked;
			var actionString = "";
			if (home.moving_avg)
			{
				actionString = "added to";
			}
			else
			{
				actionString = "removed from";
			}
                        home.update();
			ac.logUserActivity("Moving Average " + actionString + " Chart", "summerizeData",  ac.WF_TRANSFORM);
                    });
                d3.select("#national-avg")
                    .on("change", function () {
                        home.national_avg = this.checked;
			var actionString = "";
			if (home.national_avg)
			{
				actionString = "added to";
			}
			else
			{
				actionString = "removed from";
			}
                        home.update();
			ac.logUserActivity("National Average " + actionString + " Chart", "summerizeData",  ac.WF_TRANSFORM);
                    });
            },

            select_state: function (state) {
              d3.select("#state").property('value', state);
              if (home.scope === "state") {
                d3.select("#scope").property('value', state);
              }
              var hospitals = [], d;
              for (d in state_set[state]) {
                if (state_set[state].hasOwnProperty(d)) {
                  hospitals.push(d);
                }
              }
              hospitals.sort(d3.ascending);
              if (home.scope !== "state") {
                hospitals.unshift("ALL");
              }
              d3.select("#hospital").selectAll("option").remove();
              d3.select("#hospital").selectAll("option")
                .data(hospitals)
                .enter().append("option")
                .text(function (d) { return d; })
                .on("change", function() {home.update(); console.log("hospital change event");});

              if (state === "None") {
                d3.select("#hospital")
                  .property("value", "");

                //d3.select("#hospital").style("display", "none");
              }
              /*                    else {*/
              //d3.select("#hospital").style("display", "inline");
              //}

              home.update();
            },

            select_hospital: function (provider) {
              d3.select("#hospital").property('value', provider);
              home.update();
            },

            update: function () {
                "use strict";

                var comparison = [],
                state = d3.select("#state").property("value"),
                hospital = d3.select("#hospital").property("value"),
                cost_range,
                cost_scale,
                color_scale,
                bar_scale,
                format = d3.format(",f"),
                g,
                g_enter,
                sliding,
                moving_average,
                circ,
                y_axis,
                legend_axis,
                line,
                selected_hospital,
                colormap_vals,
                i,
                mort_label,
                bbox;

                d3.select("#chart-title").text(home.scale[0].toUpperCase() + home.scale.slice(1) + " of " + home.treatment + " treatment in " + (home.scope === "state" ? state_names[state] : "U.S.") + " hospitals, ordered by " + home.order);

                selected_hospital = null;
                all_records.forEach(function (d) {
                    if ((home.scope === "state" && d["Provider State"] === state && d.treatment === home.treatment) || (home.scope !== "state" && d.treatment === home.treatment)) {
                        comparison.push({
                            cost: d["Average Covered Charges"],
                            reimbursement: d["Average Total Payments"],
                            mortality: outcome_map[home.treatment][d["Provider Id"]],
                            ratio: d["Average Total Payments"] / d["Average Covered Charges"],
                            state: d["Provider State"],
                            hospital: d.Provider,
                            id: d["Provider Id"]
                        });
                        if (d.Provider === hospital) {
                            selected_hospital = comparison[comparison.length - 1];
                        }
                    }
                });
                comparison.sort(function (a, b) {
                    if (home.order === "mortality") {
                        if (a[home.order] === undefined) {
                            return 1;
                        }
                        if (b[home.order] === undefined) {
                            return -1;
                        }
                        return d3.descending(a[home.order], b[home.order]);
                    }
                    return d3.ascending(a[home.order], b[home.order]);
                });

                // Set the axis labels.
                d3.select("#axislabelleft")
                    .text((home.order === "mortality" ? "Higher " : "Lower ") + home.order);

                d3.select("#axislabelright")
                    .text((home.order === "mortality" ? "Lower " : "Higher ") + home.order);

                sliding = [];
                moving_average = [];

                // Preload sliding window with data.
                for (i = 0; i < comparison.length / 10; i += 1) {
                    var d = comparison[i];
                    var outcome = outcome_map[home.treatment][d.id];

                    if (outcome !== -1 && outcome !== undefined) {
                        sliding.push(d[home.scale]);
                    }
                }

                // Now compute the moving average once per remaining data item.
                for (i = i; i < comparison.length; i += 1) {
                    d = comparison[i];
                    outcome = outcome_map[home.treatment][d.id];

                    if (outcome !== -1 && outcome !== undefined) {
                        sliding.push(d[home.scale]);
                        if (sliding.length > comparison.length / 10) {
                            sliding.shift();
                        }
                    }

                    moving_average.push({
                        index: Math.round(i - comparison.length / 20),
                        value: d3.sum(sliding) / sliding.length
                    });
                }

                bar_scale = d3.scale.ordinal().domain(d3.range(comparison.length)).rangeBands([0, home.geom.width]);

                var avg = averages[home.treatment][home.scale].average;
                cost_range = [d3.min(comparison, function (d) { return d[home.scale]; }), d3.max(comparison, function (d) { return d[home.scale]; })];
                if (avg < cost_range[0]) {
                    cost_range[0] = avg;
                }
                if (avg > cost_range[1]) {
                    cost_range[1] = avg;
                }

                color_scale = d3.scale.linear().domain([8, 15]).range(["steelblue", "firebrick"]);
                cost_scale = d3.scale.linear().domain([0, cost_range[1]]).range([home.geom.height, 0]);

                colormap_vals = [];
                for (i = 0; i < home.colormap_n; i += 1) {
                    colormap_vals.push(8 + i * (15 - 8) / (home.colormap_n - 1));
                }
                home.vis.selectAll("rect.legend")
                    .data(colormap_vals)
                    .style("fill", function (d) {
                        return color_scale(d);
                    });

                legend_axis = d3.svg.axis()
                    .scale(d3.scale.linear().domain([8, 15]).range([home.geom.margin.top + 0.4*home.geom.height, home.geom.margin.top]))
                    .tickSize(5)
                    .orient("left")
                    .tickFormat(function (d) {
                        return d + "%";
                    });
                home.vis.select("g#legendtext")
                    .attr("transform", "translate(" + (home.geom.margin.left + home.geom.width + 100) + ", 0)")
                    .call(legend_axis);
                mort_label = home.vis.select("text#mortlabel")
                    .attr("x", home.geom.margin.left + home.geom.width + 100)
                    .attr("y", home.geom.margin.top + 0.4 * home.geom.height);
                bbox = mort_label.node().getBBox();
                mort_label.attr("x", mort_label.attr("x") - bbox.width / 2)
                    .attr("y", +mort_label.attr("y") + bbox.height);

                function highlighted(d) {
                    return false;
                    //return ((compare === "State to Nation" &&  d.state === state) || d.hospital === hospital);
                }

                function details(d) {
                    d3.select("#details").html("<div>" + d.hospital + "</div>"
                            + "<div>2011 Average cost for " + home.treatment.toLowerCase() + " treatment among Medicare patients: $" + format(d.cost) + "</div>"
                            + "<div>2011 Average reimbursement for " + home.treatment.toLowerCase() + " treatment among Medicare patients: $" + format(d.reimbursement) + "</div>"
                            + "<div>2012 Mortality rate for " + home.treatment.toLowerCase() + " treatment among Medicare patients: "
                            + (d.mortality >= 0 ? (d.mortality + "%") : "unknown") + "</div>");
		    updateUI("details", "Details about a single data point are displayed.", true);
		//    console.log(d3.select("#details")[0][0].clientHeight);
            //console.log(div#scatter-details.span12.clientHeight);
            //ac.logUILayout("Details about a single data point displayed", "ScatterDetails",

                }

                function clearDetails() {
                    if (selected_hospital) {
                        details(selected_hospital);
                    } else {
                        d3.select("#details").html("<div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div>");
			updateUI("details", "Details about a single data point have been cleared.", false);
                    }
                }

                clearDetails();

                // Y axis
                y_axis = d3.svg.axis()
                    .scale(cost_scale)
                    .tickSize(home.geom.width)
                    .orient("left")
                    .tickFormat(function (d) {
                        if (home.scale === "cost" || home.scale === "reimbursement") {
                            return "$" + d3.format(",.0f")(d);
                        } else {
                            return d + "%";
                        };
                    });
                home.vis.selectAll("g.chartaxis").remove();
                home.vis.append("g")
                    .attr("class", "axis")
                    .classed("chartaxis", true)
                    .attr("transform", "translate(" + (home.geom.margin.left + home.geom.width) + "," + home.geom.margin.top + ")")
                    .call(y_axis);

                // Data rectangles
                g = home.vis.selectAll("rect.data").data(comparison, function (d) { return d.hospital; });
                g_enter = g.enter().append("rect")
                    .classed("data", true)
                    .attr("x", function (d, i) { return home.geom.margin.left + bar_scale(i); })
                    .attr("y", function (d) { return home.geom.margin.top + cost_scale(d[home.scale]); })
                    .style("opacity", 0)
                    .attr("height", function (d) { return home.geom.height - cost_scale(d[home.scale]); })
                    .attr("width", function (d) { return bar_scale.rangeBand() + 1; })
                    .style("fill", function (d) { return highlighted(d) ? "red" : (d.mortality >= 0 ? color_scale(d.mortality) : "#aaa"); })
                    .on("mouseover", details)
                    .on("mouseout", clearDetails);
                g.transition().duration(1000).delay(function (d, i) { return 500 * i / comparison.length; })
                    .attr("x", function (d, i) { return home.geom.margin.left + bar_scale(i); })
                    .attr("y", function (d) { return home.geom.margin.top + cost_scale(d[home.scale]); })
                    .style("opacity", 0.5)
                    .attr("height", function (d) { return home.geom.height - cost_scale(d[home.scale]); })
                    .attr("width", function (d) { return bar_scale.rangeBand() + 1; })
                    .style("fill", function (d) { return highlighted(d) ? "red" : (d.mortality >= 0 ? color_scale(d.mortality) : "#aaa"); });
                g.exit().remove();

                // Selection dots
                circ = home.vis.selectAll("circle").data(comparison, function (d) { return d.hospital; });
                circ.enter().append("circle")
                    .style("visibility", function (d) { return ((hospital === "ALL" && d.state === state) || d.hospital === hospital) ? "visible" : "hidden"; })
                    .style("opacity", function (d) { return ((hospital === "ALL" && d.state === state) || d.hospital === hospital) ? 0.5 : 0; })
                    .attr("cx", function (d, i) { return home.geom.margin.left + bar_scale(i) + bar_scale.rangeBand() / 2; })
                    .attr("cy", home.geom.height + home.geom.margin.top + 7)
                    .attr("r", 5)
                    .style("fill", "steelblue")
                    .on("mouseover", details)
                    .on("mouseout", clearDetails);
                circ.transition().duration(1000)
                    .style("visibility", function (d) { return ((hospital === "ALL" && d.state === state) || d.hospital === hospital) ? "visible" : "hidden"; })
                    .style("opacity", function (d) { return ((hospital === "ALL" && d.state === state) || d.hospital === hospital) ? 0.5 : 0; })
                    .attr("cx", function (d, i) { return home.geom.margin.left + bar_scale(i) + bar_scale.rangeBand() / 2; });
                circ.exit().remove();

                // Moving average
                home.vis.selectAll("path").remove();
                if (home.moving_avg) {
                    line = d3.svg.line()
                        .x(function (d) { return home.geom.margin.left + bar_scale(d.index); })
                        .y(function (d) { return home.geom.margin.top + cost_scale(d.value); });
                    home.vis.append("path").datum(moving_average)
                        .attr("d", line)
                        .style("opacity", 1)
                        .style("stroke-width", 3)
                        .style("stroke", "black")
                        .style("fill", "none");
                }

                // National average
                home.vis.selectAll("line.average").remove();
                if (home.national_avg) {
                    home.vis.append("line")
                        .classed("average", "true")
                        .attr("x1", home.geom.margin.left)
                        .attr("x2", home.geom.margin.left + home.geom.width)
                        .attr("y1", home.geom.margin.top + cost_scale(avg))
                        .attr("y2", home.geom.margin.top + cost_scale(avg))
                        .style("stroke", "black")
                        .style("stroke-width", 5)
                        .style("stroke-opacity", 0.5);
                }
            },
            highlight_closest_hospital_success_callback: function (p) {
              // Compute the distances between the hospitals and the user
              // This does the trick performance-wise on my laptop but there
              // are likely faster way to do it (by lat first for example):
              // http://stackoverflow.com/q/5031268
              // http://stackoverflow.com/q/15736995
              // http://mathforum.org/library/drmath/view/61573.html
              // Actually the geolocation is the slowest part, the rest below
              // takes only a few ms.
              p_geo = [p.coords.longitude, p.coords.latitude];
              distances = hospitals_geolocation.map(function(r) {
                var r_geo = [r.zip_longitude, r.zip_latitude];
                r.distance = d3.geo.distance(r_geo, p_geo);
                return r;
              });
              // Sort to find the closest
              distances.sort(function (a, b) {
                return a.distance - b.distance;
              });
              // At this point we could highligh as many as the closest we want,
              // maybe 5, or maybe display them in a menu, etc.
              // Just pick the first closest to highlight.
              var closest_hospital = distances.shift();
              var distance_in_miles = 3949.9 * closest_hospital.distance;
              if (distance_in_miles < 100) {
                $.each(all_records, function(index, record) {
                  if (record['Provider Id'] === closest_hospital.provider_id) {
                    home.show_highlight_closest_hospital_button('Got it!', 'btn-success', 5000);
                    closest_hospital.provider = record.Provider;
                    //console.log(closest_hospital);
                    home.select_state(closest_hospital.state);
                    home.select_hospital(closest_hospital.provider);
                    return false;
                  }
                });
              } else {
                home.show_highlight_closest_hospital_button('No Match', 'btn-warning');
              }
            },
            highlight_closest_hospital_error_callback: function (p) {
              home.show_highlight_closest_hospital_button('Ooops', 'btn-warning', 5000);
            },
            highlight_closest_hospital: function () {
              home.show_highlight_closest_hospital_button('Looking...', 'btn-info');
              geoPosition.getCurrentPosition(
                home.highlight_closest_hospital_success_callback,
                home.highlight_closest_hospital_error_callback,
                { enableHighAccuracy: true }
              );
            },
            show_highlight_closest_hospital_button: function (text, btn_class, revert_delay) {
              var $button = $("#highlight-closest-hospital");
              $button.tooltip(text === undefined ? {} : 'destroy');
              text = text || 'Find closest';
              btn_class = btn_class || '';
              revert_delay = revert_delay || false;
              $button.fadeOut('fast', function () {
                $(this).removeClass().addClass('btn ' + btn_class).text(text).fadeIn();
              });
              if (revert_delay !== false) {
                window.setTimeout(home.show_highlight_closest_hospital_button, 3000);
              }
            }
        };

var scatter = {
    vis: null,
    region: "Entire U.S.",
    treatment: "pneumonia",
    xvar: "cost",
    yvar: "cost",

    geom: {
        height: 400,
        width: 400,
        margin: {
            left: 80,
            right: 40,
            top: 20,
            bottom: 75
        }
    },

    setup: function () {
        scatter.vis = d3.select("#scatter-vis")
            .style("width", (scatter.geom.width + scatter.geom.margin.left + scatter.geom.margin.right) + "px")
            .style("height", (scatter.geom.height + scatter.geom.margin.top + scatter.geom.margin.bottom) + "px");
    },

    init: function () {
        var update_hl_hospitals,
            states_copy;

        update_hl_hospitals = function (that) {
            var hospitals = [],
                d,
                state = that.value;

                for (d in state_set[state]) {
                    if (state_set[state].hasOwnProperty(d)) {
                        hospitals.push(d);
                    }
                }
                hospitals.sort(d3.ascending);
                hospitals.unshift("ALL");
                d3.select("#scatter-hl-hospital").selectAll("option").remove();
                d3.select("#scatter-hl-hospital").selectAll("option")
                    .data(hospitals)
                    .enter().append("option")
                    .text(function (d) { return d; })
                    .on("change", function() {scatter.update(); console.log("scatter hospital change event");});

        };

        states_copy = states.slice();
        states_copy.shift();
        states_copy.unshift("None");

        d3.select("#scatter-hl-state")
            .selectAll("option")
            .data(states_copy)
            .enter().append("option")
            .text(function (d) { return d; });
        d3.select("#scatter-hl-state")
            .on("change", function () {
                update_hl_hospitals(this);
		console.log("scatter hl state change event");
                if (this.value === "None") {
                    d3.select("#scatter-hl-hospital").property("value", "");
                    //d3.select("#scatter-hl-hospital").style("display", "none");
                }
/*                else {*/
                    //d3.select("#scatter-hl-hospital").style("display", "none");
                //}

                scatter.update();
            });
        d3.select("#scatter-hl-hospital")
            .on("change", function () {
                scatter.update();
		console.log("scatter-hl-hospital change event2");
            });

        d3.select("#scatter-state")
            .on("change", function () {
                var state,
                    hospital;

                state = d3.select("#scatter-hl-state");
                hospital = d3.select("#scatter-hl-hospital");

                scatter.region = this.value;
                state.style("display", scatter.region === "Entire U.S." ? "inline" : "none");

                if (this.value !== "Entire U.S.") {
                    $(state.node()).val(this.value);

                    scatter.highlight_state = state.property("value");
                    update_hl_hospitals(this);
                }
		console.log("scatter state change event.");
                scatter.update();
            })
            .selectAll("option")
            .data(states)
            .enter()
            .append("option")
            .text(function (d) { return d; });

        d3.select("#scatter-treatment-pneumonia")
            .on("click", function () {
                scatter.treatment = "pneumonia";
                scatter.update();
		ac.logUserActivity("Change scatterplot dataset to pneumonia", "changeDataSource",  ac.WF_GETDATA);
            });
        d3.select("#scatter-treatment-heart")
            .on("click", function () {
		ac.logUserActivity("Change scatterplot dataset to heart failure", "changeDataSource",  ac.WF_GETDATA);
                scatter.treatment = "heart failure";
                scatter.update();
            });

        d3.select("#scatter-x-cost")
            .on("click", function () {
                scatter.xvar = "cost";
		ac.logUserActivity("Change scatterplot X-axis to treatment cost", "changeXAxis",  ac.WF_EXPLORE);
                scatter.update();
            });
        d3.select("#scatter-x-reimbursement")
            .on("click", function () {
                scatter.xvar = "reimbursement";
                scatter.update();
		ac.logUserActivity("Change scatterplot X-axis to Medicare reimbursement", "changeXAxis",  ac.WF_EXPLORE);
            });
        d3.select("#scatter-x-mortality")
            .on("click", function () {
                scatter.xvar = "mortality";
		ac.logUserActivity("Change scatterplot X-axis to mortality rate", "changeXAxis",  ac.WF_EXPLORE);
                scatter.update();
            });

        d3.select("#scatter-y-cost")
            .on("click", function () {
                scatter.yvar = "cost";
		ac.logUserActivity("Change scatterplot Y-axis to treatment cost", "changeYAxis",  ac.WF_EXPLORE);
                scatter.update();
            });
        d3.select("#scatter-y-reimbursement")
            .on("click", function () {
                scatter.yvar = "reimbursement";
		ac.logUserActivity("Change scatterplot Y-axis to Medicare reimbursement", "changeYAxis",  ac.WF_EXPLORE);
                scatter.update();
            });
        d3.select("#scatter-y-mortality")
            .on("click", function () {
                scatter.yvar = "mortality";
		ac.logUserActivity("Change scatterplot Y-axis to mortality rate", "changeYAxis",  ac.WF_EXPLORE);
                scatter.update();
            });
    },

    update: function () {
        var xscale,
            yscale,
            duration,
            format = d3.format(",f"),
            data,
            hospital,
            state,
            plot,
            maxx,
            maxy,
            xaxis,
            yaxis,
            x,
            y,
            x_mean,
            y_mean,
            prod,
            x_mom,
            y_mom,
            corr;

        duration = 1000;

        function capitalize(s) {
            return s ? s[0].toUpperCase() + s.slice(1) : s;
        }

        d3.select("#scatter-chart-title")
            .text(capitalize(scatter.yvar) + " vs. " + scatter.xvar + ", for " + scatter.treatment + " treatment in " + (scatter.region === "Entire U.S." ? "U.S." : state_names[scatter.region]) + " hospitals");

        data = [];
        all_records.forEach(function (d) {
            if ((scatter.region === "Entire U.S." || d["Provider State"] === scatter.region) && scatter.treatment === d.treatment) {
                if (scatter.xvar === "cost") {
                    x = d["Average Covered Charges"];
                } else if (scatter.xvar === "reimbursement") {
                    x = d["Average Total Payments"];
                } else if (scatter.xvar === "mortality") {
                    x = outcome_map[scatter.treatment][d["Provider Id"]];
                } else {
                    throw "Illegal xvar code: " + xvar;
                }

                if (scatter.yvar === "cost") {
                    y = d["Average Covered Charges"];
                } else if (scatter.yvar === "reimbursement") {
                    y = d["Average Total Payments"];
                } else if (scatter.yvar === "mortality") {
                    y = outcome_map[scatter.treatment][d["Provider Id"]];
                } else {
                    throw "Illegal yvar code: " + yvar;
                }

                if (x >= 0.0 && y >= 0.0) {
                    data.push({
                        x: x,
                        y: y,
                        hospital: d.Provider,
                        state: d["Provider State"],
                        id: d["Provider Id"],
                        cost: d["Average Covered Charges"],
                        reimbursement: d["Average Total Payments"],
                        mortality: outcome_map[scatter.treatment][d["Provider Id"]]
                    });
                }
            }
        });

        maxx = d3.max(data, function (d) {
            return d.x;
        });

        maxy = d3.max(data, function (d) {
            return d.y;
        });

        xscale = d3.scale.linear().domain([0, maxx]).range([0, scatter.geom.width]);
        yscale = d3.scale.linear().domain([0, maxy]).range([scatter.geom.height, 0]).nice();

        function formatter(axis) {
            return function (d) {
                if (scatter[axis] === "cost" || scatter[axis] === "reimbursement") {
                    return "$" + d3.format(",.0f")(d);
                } else {
                    return d + "%";
                };
            }
        }

        xaxis = d3.svg.axis()
            .scale(xscale)
            .tickSize(scatter.geom.height)
            .orient("bottom")
            .tickFormat(formatter("xvar"));
        scatter.vis.select("g.x.axis")
            .attr("transform", "translate(" + (scatter.geom.margin.left) + ", " + (scatter.geom.margin.top) + ")")
            .transition()
            .duration(duration)
            .call(xaxis)
            .selectAll("text")
            .style("text-anchor", "start")
            .attr("dy", "0.5ex")
            .attr("transform", function () {
                var s = d3.select(this);
                var r = "rotate(45, " + (s.attr("x") || 0) + ", " + s.attr("y") + ")";
                return r;
            });

        yaxis = d3.svg.axis()
            .scale(yscale)
            .tickSize(scatter.geom.width)
            .orient("left")
            .tickFormat(formatter("yvar"));
        scatter.vis.select("g.y.axis")
            .attr("transform", "translate(" + (scatter.geom.margin.left + scatter.geom.width) + ", " + scatter.geom.margin.top + ")")
            .transition()
            .duration(duration)
            .call(yaxis);

        hospital = d3.select("#scatter-hl-hospital").property("value");
        state = d3.select("#scatter-hl-state").property("value");

        function highlight(d) {
            return (d.hospital === hospital) ||
                (hospital === "ALL" && scatter.region === "Entire U.S." && state === d.state);
        }

        function details(d) {
            d3.select("#scatter-details").html("<div>" + d.hospital + "</div>"
                    + "<div>2011 Average cost for " + scatter.treatment.toLowerCase() + " treatment among Medicare patients: $" + format(d.cost) + "</div>"
                    + "<div>2011 Average reimbursement for " + scatter.treatment.toLowerCase() + " treatment among Medicare patients: $" + format(d.reimbursement) + "</div>"
                    + "<div>2012 Mortality rate for " + scatter.treatment.toLowerCase() + " treatment among Medicare patients: "
                    + (d.mortality >= 0 ? (d.mortality + "%") : "unknown") + "</div>");

            console.log(d3.select("#scatter-details")[0][0].clientHeight);
	    updateUI("scatter-details", "Details about a single data point are displayed.", true);
            //console.log(div#scatter-details.span12.clientHeight);
            //ac.logUILayout("Details about a single data point displayed", "ScatterDetails",


        }

        function clearDetails() {
            d3.select("#scatter-details").html("<div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div>");
	    updateUI("scatter-details", "Details about a single data point have been cleared.", false);
        }

        plot = scatter.vis.selectAll("circle")
            .data(data, function (d) { return d.hospital; });
        plot.enter()
            .append("circle")
            .attr("cx", function (d) {
                return scatter.geom.margin.left + xscale(d.x);
            })
            .attr("cy", function (d) {
                return scatter.geom.margin.top + yscale(d.y);
            })
            .attr("r", 0.0)
            .style("fill-opacity", 0.0)
            .style("stroke-opacity", 0.0)
            .style("stroke", "black")
            .style("cursor", "crosshair")
            .on("mouseover", function (d) {
                var col,
                    me,
                    r,
                    opacity;

                me = d3.select(this);

                col = me.style("fill");
                me.attr("savefill", col);
                me.style("fill", "green");

                r = me.attr("r");
                me.attr("saver", r);
                me.attr("r", 7);

                opacity = me.style("fill-opacity");
                me.attr("saveopacity", opacity);
                me.style("fill-opacity", 0.8);

                details(d);
            })
            .on("mouseout", function (d) {
                var me;

                me = d3.select(this);

                me.style("fill", me.attr("savefill"));
                me.attr("savefill", null);

                me.attr("r", me.attr("saver"));
                me.attr("saver", null);

                me.style("fill-opacity", me.attr("saveopacity"));
                me.attr("saveopacity", null);

                clearDetails();
            });
        plot.transition()
            .duration(duration)
            .attr("cx", function (d) {
                return scatter.geom.margin.left + xscale(d.x);
            })
            .attr("cy", function (d) {
                return scatter.geom.margin.top + yscale(d.y);
            })
            .attr("r", function (d) {
                return highlight(d) ? 5 : 1.5;
            })
            .style("fill-opacity", function (d) {
                var val;
                if (scatter.region === "Entire U.S.") {
                    val = highlight(d) ? 0.8 : 0.2;
                } else {
                    val = highlight(d) ? 1.0 : 0.8;
                }

                return val;
            })
            .style("stroke-opacity", function (d) {
                return highlight(d) ? 0.5 : 0.0;
            })
            .style("fill", function (d) {
                return highlight(d) ? "yellow" : "blue";
            });
        plot.exit()
            .transition()
            .duration(duration)
            .attr("cx", function (d) {
                return scatter.geom.margin.left + xscale(d.x);
            })
            .attr("cy", function (d) {
                return scatter.geom.margin.top + yscale(d.y);
            })
            .style("opacity", 0.0)
            .attr("r", 7.0)
            .remove();

        // Compute the correlation.
        //
        // Compute the means of the two dimensions.
        x_mean = d3.sum(data, function (d) { return d.x; }) / data.length;
        y_mean = d3.sum(data, function (d) { return d.y; }) / data.length;

        // Compute the various sums necessary for the Pearson correlation
        // coefficient.
        prod = 0.0;
        x_mom = 0.0;
        y_mom = 0.0;
        data.forEach(function (d) {
            prod += (d.x - x_mean) * (d.y - y_mean);
            x_mom += (d.x - x_mean) * (d.x - x_mean);
            y_mom += (d.y - y_mean) * (d.y - y_mean);
        });

        x_mom = Math.sqrt(x_mom);
        y_mom = Math.sqrt(y_mom);

        corr = prod / (x_mom * y_mom);

        d3.select("#scatter-corr")
            .text(corr.toPrecision(3));
    }
};

$(function () {
    "use strict";

    // Do any static setup (setting sizes of vis elements, etc.).
    //
    // TODO(choudhury): automate this with a list of app names, then pack all
    // the app objects into a master app list object.
    home.setup();
    scatter.setup();

    // ac = draperLog;
    ac.registerActivityLogger("http://xd-draper.xdata.data-tactics-corp.com:1337", "KitwareHospitalCosts", "0.1")
    // ac.registerActivityLogger("http://xd-draper.xdata.data-tactics-corp.com:3000", "KitwareHospitalCosts", "0.1");
    // ac.registerActivityLogger("http://xd-draper.xdata.data-tactics-corp.com:1337", "KitwareHospitalCosts", "0.1", Math.floor(Math.random()*10000+1));
    // ac.registerActivityLogger("http://localhost:1337", "KitwareHospitalCosts", "0.1", Math.floor(Math.random()*10000+1));

    // Load in the county, state, and initial contribution data
    d3.csv("Medicare_Provider_Charge_Inpatient_DRG100_FY2011_filtered.csv", function (error, records) {
        d3.csv("Outcome of Care Measures_filtered.csv", function (error, outcome) {
            var d, val;

            averages = {
                "heart failure": {"cost": {"count": 0, "sum": 0}, "reimbursement": {"count": 0, "sum": 0}, "mortality": {"count": 0, "sum": 0}},
                "pneumonia": {"cost": {"count": 0, "sum": 0}, "reimbursement": {"count": 0, "sum": 0}, "mortality": {"count": 0, "sum": 0}}};
            all_records = records;
            records.forEach(function (d) {
                d["Average Covered Charges"] = +d["Average Covered Charges"];
                d["Average Total Payments"] = +d["Average Total Payments"];
                d["Total Discharges"] = +d["Total Discharges"];
                d["Provider Zip Code"] = +d["Provider Zip Code"];
                d["Provider Id"] = +d["Provider Id"];
                if (state_set[d["Provider State"]] === undefined) {
                    state_set[d["Provider State"]] = {};
                }
                if (treatment_set[d["DRG Definition"]] === undefined) {
                    treatment_set[d["DRG Definition"]] = 0;
                }
                treatment_set[d["DRG Definition"]] += 1;
                d.Provider = d["Provider Name"] + " - " + d["Provider City"] + ", " + d["Provider State"];
                if (state_set[d["Provider State"]][d.Provider] === undefined) {
                    state_set[d["Provider State"]][d.Provider] = true;
                }
                if (d["DRG Definition"] === "292 - HEART FAILURE & SHOCK W CC") {
                    d.treatment = "heart failure";
                } else if (d["DRG Definition"] === "194 - SIMPLE PNEUMONIA & PLEURISY W CC") {
                    d.treatment = "pneumonia";
                } else {
                    d.treatment = undefined;
                }
                if (d.treatment !== undefined) {
                    averages[d.treatment]["cost"]["count"] += 1;
                    averages[d.treatment]["cost"]["sum"] += d["Average Covered Charges"];
                    averages[d.treatment]["reimbursement"]["count"] += 1;
                    averages[d.treatment]["reimbursement"]["sum"] += d["Average Total Payments"];
                }
            });
            outcome_map = {"heart failure": {}, "pneumonia": {}};
            outcome.forEach(function (d) {
                var heart_failure = d["Hospital 30-Day Death (Mortality) Rates from Heart Failure"],
                    pneumonia = d["Hospital 30-Day Death (Mortality) Rates from Pneumonia"];
                outcome_map["heart failure"][+d["Provider Number"]] = (heart_failure === "Not Available") ? -1 : +heart_failure;
                outcome_map.pneumonia[+d["Provider Number"]] = (pneumonia === "Not Available") ? -1 : +pneumonia;
                if (heart_failure !== "Not Available") {
                    averages["heart failure"]["mortality"]["count"] += 1;
                    averages["heart failure"]["mortality"]["sum"] += +heart_failure;
                }
                if (pneumonia !== "Not Available") {
                    averages.pneumonia["mortality"]["count"] += 1;
                    averages.pneumonia["mortality"]["sum"] += +pneumonia;
                }
            });

            val = averages["heart failure"]["cost"];
            val.average = val.sum / val.count;
            val = averages["heart failure"]["reimbursement"];
            val.average = val.sum / val.count;
            val = averages["heart failure"]["mortality"];
            val.average = val.sum / val.count;
            val = averages.pneumonia["cost"];
            val.average = val.sum / val.count;
            val = averages.pneumonia["reimbursement"];
            val.average = val.sum / val.count;
            val = averages.pneumonia["mortality"];
            val.average = val.sum / val.count;

            states = [];
            for (d in state_set) {
                if (state_set.hasOwnProperty(d)) {
                    states.push(d);
                }
            }
            states.sort(d3.ascending);
            states.unshift("Entire U.S.");

            treatments = [];
            for (d in treatment_set) {
                if (treatment_set.hasOwnProperty(d)) {
                    treatments.push({name: d, count: treatment_set[d]});
                }
            }

            hospitals = [];
            for (d in state_set.AK) {
                if (state_set.AK.hasOwnProperty(d)) {
                    hospitals.push(d);
                }
            }
            hospitals.sort(d3.ascending);
            hospitals.unshift("ALL");

            // Initialize and bootstrap the "home" screen vis.
            home.init();
            home.update();

            // Initialize the scatter plot app.
            scatter.init();
            scatter.update();

            d3.select("#scatter-link").on("click", function () {
		ac.logUserActivity("Change plot type to Scatter Plot", "switchChartType",  ac.WF_EXPLORE);
                d3.select("#home").style("display", "none");
                d3.select("#scatter").style("display", "inline");
            });
            d3.select("#home-link").on("click", function () {
		ac.logUserActivity("Change plot type to Bar Graph Plot", "switchChartType",  ac.WF_EXPLORE);
                d3.select("#scatter").style("display", "none");
                d3.select("#home").style("display", "inline");
            });

            // Get hospitals geolocation, but only if that functionality
            // is supported, and after the rest has been done, since it is
            // not that critical
            hospitals_geolocation = [];
            if (geoPosition.init()) {
              d3.csv("Provider Zip.csv",
                     function(d) {
                       return {
                         provider_id: +d['Provider Id'],
                         state: d['Provider State'],
                         zip: +d['Provider Zip Code'],
                         zip_latitude: +d['Zip Latitude'],
                         zip_longitude: +d['Zip Longitude']
                         };
                     },
                     function (error, rows) {
                       hospitals_geolocation = rows;
                       home.show_highlight_closest_hospital_button();
                       $("#highlight-closest-hospital").on("click", home.highlight_closest_hospital);
                     });
            }
        });
    });
});

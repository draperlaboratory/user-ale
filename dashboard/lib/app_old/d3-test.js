App.BarChartComponent = Ember.Component.extend({
    tagName: 'div',
    // attributeBindings: 'width height'.w(),
    // margin: {top: 20, right: 20, bottom: 30, left: 40},
    
    // w: function(){
    //   return this.get('width') - this.get('margin.left') - this.get('margin.right');
    // }.property('width'),
  
    // h: function(){
    //   return this.get('height') - this.get('margin.top') - this.get('margin.bottom');
    // }.property('height'),  
  
    // transformG: function(){
    //   return "translate(" + this.get('margin.left') + "," + this.get('margin.top') + ")";
    // }.property(),
      
    // transformX: function(){
    //   return "translate(0,"+ this.get('h') +")";
    // }.property('h'),   
  
    draw: function(){
      console.log('In Draw', this);
      var wf_states = [],
      curState = {};

      window.T = this;

      var logs = this.logs;

      

      var f3 = d3.time.format("%H:%M:%S.%L")
      var f4 = d3.time.format("%a, %e %b %Y")

      logs = logs.filter(function(d) { return d.type == 'USERACTION'; });

      if (!logs.length) return
      console.log(logs)

      logs.forEach(function(d) {
        d.timestamp = new Date(d.timestamp);

        // console.log(d)
        if (d.wfState != curState.state) {
          // console.log('in loop')
          curState.stop = d.timestamp;
          if (curState.start) wf_states.push(curState);
          curState = {};
          curState.state = d.wfState;
          curState.start = d.timestamp;
        }
      });

      // console.log(wf_states)

      curState.stop = d3.time.second.offset(logs[logs.length-1].timestamp, 5);
      wf_states.push(curState);
    // x.domain([d3.min(data, function(d) { return d.start; }), d3.max(data, function(d) { return d.stop; })])
      var chartArtist = eventChart()
      .data(wf_states)
      .x(d3.time.scale()
        .range([0, 500])
        .domain([d3.min(wf_states, function(d) { return d.start; }), d3.max(wf_states, function(d) { return d.stop; })])
      );      

      var chart = d3.select('.chart')
      .datum(chart);

      chart.call(chartArtist);

      var chartArtist2 = eventChart()
      .brushing(true)
      .data(wf_states)
      .y(d3.scale.linear()
        .range([20, 0]))
      .x(d3.time.scale()
        .range([0, 500])
        .domain([d3.min(wf_states, function(d) { return d.start; }), d3.max(wf_states, function(d) { return d.stop; })])
      );

      var chart2 = d3.select('#context')
      .datum(chart);

      chart2.call(chartArtist2);

      function renderAll() {
        // console.log(chartArtist2.brush.extent())

        var a = chartArtist2.brush.extent()
        chartArtist.x().domain(a)
        chart.call(chartArtist);

        logMarkers
        .selectAll('line')
        .attr("x1", function(d) { return x(d.timestamp); })
        .attr("x2", function(d) { return x(d.timestamp); })

        logMarkers
        .selectAll('circle')
        .attr("cx", function(d) { return x(d.timestamp); })
        // .attr("x2", function(d) { return x(d.timestamp); })
      }

      chartArtist2
      .on("brush", renderAll)
      .on("brushend", renderAll);



      var logMarkers = d3.select(".chart svg > g").selectAll("g.log_markers").data(logs)
      .enter()
      .append("g")
      .attr("class", "log-markers")
      .on("mouseover", function(d) { 
        d3.select('#event-info .timestamp')
        .html(f3(d.timestamp));
        d3.select('#event-info .desc')
        .html(d.parms.desc);
        d3.select('#event-info .activity')
        .html(d.parms.activity);

        d3.select(this).select('circle')
        .attr('fill', 'white')
      })
      .on("mouseout", function(d) { 
        d3.select('#event-info .timestamp')
        .html("");
        d3.select('#event-info .desc')
        .html("");
        d3.select('#event-info .activity')
        .html("");

        d3.select(this).select('circle')
        .attr('fill', 'black')
      });

      var x = chartArtist.x();

      logMarkers.append("line")
      .attr("x1", function(d) { return x(d.timestamp); })
      .attr("x2", function(d) { return x(d.timestamp); })
      .attr("y1", 0)
      .attr("y2", 100)
      .attr("stroke-width", 1)
      .attr("stroke", "black")
      .attr("clip-path", "url(#clip-0)");

      logMarkers.append("circle")
      .attr("cx", function(d) { return x(d.timestamp); })
      .attr("cy", 4)
      .attr("r", 4)
      .attr("clip-path", "url(#clip-0)");
    },
  
    didInsertElement: function(){
      this.draw();
    }
  });
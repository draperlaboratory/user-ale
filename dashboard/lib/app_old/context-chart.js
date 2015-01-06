App.ContextChartComponent = App.ChartCompComponent.extend(App.WfColors, {
  hasNoData: Ember.computed(function() {
    return false;
  }).property('logData'),
  contextHeight: 20,
  marginHeight: 5,
  xDomain: Ember.computed(function() {
    var min = d3.min(this.get('wfData'), function(d) { return d.start; });
    var max = d3.max(this.get('wfData'), function(d) { return d.stop; });

    // console.log('WFDATA', [min, max])
    return [min, max];
  }).property('wfData'),
  yDomain: Ember.computed(function() {
    return [0, 1]
  }).property('wfData'),
  focusHeight: Ember.computed(function() {
    return this.get('graphicHeight') - (this.get('contextHeight') + this.get('marginHeight'));
  }).property('graphicHeight', 'contextHeight'),
  yContextRange: Ember.computed(function() {
    return [this.get('graphicTop') + this.get('contextHeight'), this.get('graphicTop')];
  }).property('graphicTop', 'contextHeight'),
  yContextScale: Ember.computed(function() {
    return d3.scale.linear().domain(this.get('yDomain')).range(this.get('yContextRange'));
  }).property('yDomain', 'yContextRange'),
  yFocusRange: Ember.computed(function() {
    console.log('AAA', [this.get('graphicTop') + this.get('focusHeight'), this.get('graphicTop')])
    return [this.get('graphicTop') + this.get('focusHeight'), this.get('graphicTop')];
    // return [200, 0];
  }).property('graphicTop', 'focusHeight'),
  yFocusScale: Ember.computed(function() {
    return d3.scale.linear().domain(this.get('yDomain')).range(this.get('yFocusRange'));
  }).property('yDomain', 'yFocusRange'),
  xRange: Ember.computed(function() {
    return [this.get('graphicLeft'), this.get('graphicLeft') + this.get('graphicWidth')];
  }).property('graphicLeft', 'graphicWidth'),
  xContextTimeScale: Ember.computed(function() {
    var xDomain;
    xDomain = this.get('xDomain');
    return d3.time.scale().domain(this.get('xDomain')).range(this.get('xRange'));
  }).property('xDomain', 'xRange'),
  xFocusTimeScale: Ember.computed(function() {    
    // return d3.time.scale();
    return d3.time.scale().domain(this.get('xDomain')).range(this.get('xRange'));
  }).property('xDomain', 'xRange'),
  xContextAxis: Ember.computed(function() {
    var xAxis;
    xAxis = this.get('contextFrame').select('.x.axis');
    if (xAxis.empty()) {
      return this.get('contextFrame').insert('g', ':first-child').attr('class', 'x axis');
    } else {
      return xAxis;
    }
  }).volatile(),
  xFocusAxis: Ember.computed(function() {
    var xAxis;
    xAxis = this.get('focusFrame').select('.x.axis');
    if (xAxis.empty()) {
      return this.get('focusFrame').insert('g', ':first-child').attr('class', 'x axis');
    } else {
      return xAxis;
    }
  }).volatile(),
  // wfData: Ember.computed(function() {
  //   var wfData = [],
  //   curState = {};

  //   var logs = this.get('logData');

  //   console.log('LOGS', logs)

  //   // logs = logs.filter(function(d) { return d.type == 'USERACTION'; });

  //   // logs.forEach(function(d) {
  //   //   d.timestamp = new Date(d.timestamp);
  //   //   if (d.wfState != curState.state) {
  //   //     curState.stop = d.timestamp;
  //   //     if (curState.start) wfData.push(curState);
  //   //     curState = {};
  //   //     curState.state = d.wfState;
  //   //     curState.start = d.timestamp;
  //   //   }
  //   // });      

  //   // curState.stop = d3.time.second.offset(logs[logs.length-1].timestamp, 5);
  //   // wfData.push(curState);

  //   return wfData;
  // }).property('logData'),
  // testObs: function() {
  //   console.log(this.get('logData').length)
  // }.property('logData'),
  testObs: Ember.computed(function() {
    console.log(this.get('logs').length)
  }).property('logs'),
  contextFrame: Ember.computed(function() {
    return this.get('viewport').select('.context').datum(this.get('wfData'));
  }).volatile(),
  focusFrame: Ember.computed(function() {
    return this.get('viewport').select('.focus').datum(this.get('wfData'));
  }).volatile(),
  buildGroups: function() {
    this.get('viewport')
    .append('g')
    .attr('class', 'context');

    this.get('viewport')
    .append('g')
    .attr('transform', "translate(0," + (this.get('contextHeight') + this.get('marginHeight')) + ")")
    .attr('class', 'focus');
  },  
  drawChart: function() {
    this.buildGroups();    

    this.get('viewport')
    .append("defs")
    .append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", this.get('graphicWidth'))
    .attr("height", this.get('focusHeight'));

    this.updateChart();

    // console.log('DRAWCHART', this.get('testDave'), this.get('testDave.length'));
  },
  updateChart: function() {
    var this_ = this;

    var xContextTimeScale = this.get('xContextTimeScale'),
    xFocusTimeScale = this.get('xFocusTimeScale')
    yContextScale = this.get('yContextScale'),
    yFocusScale = this.get('yFocusScale'),
    colors = this.get('colors'),
    xDomain = this.get('xDomain'),
    focus = this.get('focusFrame');

    var brush = d3.svg.brush()
    .x(xContextTimeScale)
    .on("brush", brushed);

    var contextFrame = this.get('contextFrame')
    .selectAll('g.draw-pane')
    .data([1]);

    contextFrame
    .enter()
    .append("g")
    .attr('class', 'draw-pane');

    var cf = contextFrame
    .selectAll('rect.wf-context')
    .data(this.get('wfData'))

    cf
    .enter()
    .append('rect')
    .attr('class', 'wf-context');

    cf
    .attr({
      x: function(d) { return xContextTimeScale(d.start); },
      width: function(d) { return xContextTimeScale(d.stop) - xContextTimeScale(d.start); },
      y: function(d) { return yContextScale(1); },
      height: function(d) { return yContextScale(0) - yContextScale(1); },
      fill: function(d) { return colors[+d.state]},
      'fill-opacity': 0.5
    });

    cf.exit()
    .remove();

    this.get('contextFrame').selectAll('g.x.brush')
    .data([1])
    .enter()
    .append("g")
    .attr("class", "x brush")
    .call(brush)
    .selectAll("rect")
    .attr("y", -6)
    .attr("height", this.get('contextHeight') + 7);

    var wf = this.get('focusFrame')
    .selectAll('rect.wf-focus')
    .data(this.get('wfData'))

    wf
    .enter()
    .append('rect')
    .attr('class', 'wf-focus');

    wf
    .attr({
      x: function(d) { return xFocusTimeScale(d.start); },
      width: function(d) { return xFocusTimeScale(d.stop) - xFocusTimeScale(d.start); },
      y: function(d) { return yFocusScale(1); },
      height: function(d) { return yFocusScale(0) - yFocusScale(1); },
      fill: function(d) { return colors[+d.state]},
      'fill-opacity': 0.5,
      'clip-path': 'url(#clip)'
    });

    wf.exit()
    .remove();
        
    var logLines = this.get('focusFrame')
    .selectAll('line.log-line')
    .data(this.get('logs'));

    console.log('NLINES', this.get('logs').length)

    logLines  
    .enter()
    .append('line')
    .attr('class', 'log-line');

    logLines
    .attr({
      x1: function(d) { return xFocusTimeScale(d.timestamp); },
      x2: function(d) { return xFocusTimeScale(d.timestamp); },
      y1: function(d) { return yFocusScale(1); },
      y2: function(d) { return yFocusScale(0); },
      stroke: function(d) { return colors[+d.wfState]},
      'clip-path': 'url(#clip)'
    });

    logLines.exit()
    .remove();

    // var logCircs = this.get('focusFrame')
    // .selectAll('line.log-circ')
    // .data(this.get('logs'));

    // logCircs
    // .enter()
    // .append('circle')
    // .attr('class', 'log-circ')
    // .on("mouseover", function(d) {
    //   $("#test").html(d.activity + ": " + d.description);
    // });

    // logCircs    
    // .attr({
    //   cx: function(d) { return xFocusTimeScale(d.timestamp); },
    //   cy: function(d) { return yFocusScale(0) - 5; },
    //   r: 5,
    //   fill: function(d) { return colors[+d.wfState]},
    //   'clip-path': 'url(#clip)'
    // });

    // logCircs.exit()
    // .remove();

    xAxis = d3.svg.axis().scale(xFocusTimeScale).orient('bottom');
    
    gXAxis = this.get('xFocusAxis').attr({
      transform: "translate(0," + (this.get('focusHeight')) + ")"
    }).call(xAxis);

    xAxis1 = d3.svg.axis().scale(xContextTimeScale).orient('top');
    
    gXAxis = this.get('xContextAxis').call(xAxis1);

    function brushed() {
      xFocusTimeScale.domain(brush.empty() ? xDomain : brush.extent());
      
      focus
      .selectAll('rect')
      .attr({
        x: function(d) { return xFocusTimeScale(d.start); },
        width: function(d) { return xFocusTimeScale(d.stop) - xFocusTimeScale(d.start); }
      });

      focus
      .selectAll('line.log-line')
      .attr({
        x1: function(d) { return xFocusTimeScale(d.timestamp); },
        x2: function(d) { return xFocusTimeScale(d.timestamp); }
      });

      // logCircs
      // .attr({
      //   cx: function(d) { return xFocusTimeScale(d.timestamp); }
      // });

      xAxis = d3.svg.axis().scale(xFocusTimeScale).orient('bottom');    
      this_.get('xFocusAxis').call(xAxis);
    }
  }.observes('logs'),
  daveReed: function() {
    // this.buildGroups();
    // this.drawContext();
    // this.drawFocus();
    // console.log('DAVE DRAWCHART', this.get('testDave'), this.get('testDave.length'));
  }.observes('logs')
});

Ember.Handlebars.helper('context-chart', App.ContextChartComponent)

// $("body").append("<div class='chart-float-tooltip' id='#{@get 'tooltipId'}'></div>")
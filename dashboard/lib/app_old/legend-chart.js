App.LegendChartComponent = App.ChartCompComponent.extend(App.WfColors, {
    hasNoData: Ember.computed(function() {
      return false;
    }).property('wfStates'),
    defaultOuterHeight: 200,
    verticalMargin: 0,
    xScale: function() {
      var xScale = d3.scale.ordinal()
      .domain(d3.range(this.get('wfStates').length))
      .rangeBands([0, this.get('graphicWidth')], .1, 0);

      return xScale;
    }.property('graphicWidth'),
    drawChart: function(){ 
      
      var colors = this.get('colors');

      var svg = this.get('viewport');

      var xScale = this.get('xScale');

      svg.selectAll('rect.legend')
      .data(this.get('wfStates'))
      .enter()
      .append('rect')
      .attr({
        fill: function(d, i) { return colors[i]; },
        class: 'legend',
        x: function(d,i) { return xScale(i); },
        width: xScale.rangeBand(),
        y: 0,
        height: 30
      })

      var text = svg.selectAll('text.legend')
      .data(this.get('counts'))
      .enter()
      .append('text')
      .attr({
        x: function(d,i) { return xScale(i) + 0.5*xScale.rangeBand(); },
        y: 20,
        'text-anchor': 'middle',
        fill: 'white'
      })
      .text(function(d) { 
        var text = d.text;

        return d.numLogs ? d.text + " (" + d.numLogs + ")" : d.text; 
      })

      this.set('textD', text);
    },
    updateChart: function() {
      console.log('updateChart')
      var xScale = this.get('xScale');

      var text = this.get('textD')
      .data(this.get('counts'))
      .attr({
        x: function(d,i) { return xScale(i) + 0.5*xScale.rangeBand(); },
        y: 20,
        'text-anchor': 'middle',
        fill: 'white'
      })
      .text(function(d) { 
        var text = d.text;

        return d.numLogs ? d.text + " (" + d.numLogs + ")" : d.text; 
      })

    }.observes('counts')
  });
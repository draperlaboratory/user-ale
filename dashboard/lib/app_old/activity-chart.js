App.ActivityChartComponent = App.ChartCompComponent.extend(App.WfColors, {
  hasNoData: Ember.computed(function() {
    return false;
  }).property('logData'),  
  transformViewport: Ember.computed(function() {
    return "translate(120, 0)";
  }).property('marginLeft', 'marginTop'),
  drawChart: function() {

    var colors = this.get('colors');

    var nest2 = d3.nest()
    .key(function(d) { return d.wfState; })
    .key(function(d) { return d.activity; })
    .entries(this.get('logs'));

    var nest = d3.nest()
    .key(function(d) { return d.activity; })
    .sortKeys(d3.descending)
    .entries(this.get('logs'));

    console.log('ACTIVITIES', nest, nest2);   

    var x = d3.scale.linear()
    .range([0, this.get('graphicWidth')]);

    var y = d3.scale.ordinal()
    .rangeRoundBands([this.get('graphicHeight'), 0], .1);     

    var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");      

    var svg = this.get('viewport');

    x.domain([0, d3.max(nest, function(d) { return d.values.length; })]);
    y.domain(nest.map(function(d) { return d.key; }));        

    var yAx = svg.selectAll('g.y.axis')
    .data([1])

    yAx
    .enter()
    .append("g")
    .attr("class", "y axis");

    yAx
    .call(yAxis);

    var aBars = svg.selectAll(".activity-bar")
    .data(nest);

    aBars
    .enter().append("rect");

    aBars
    .attr("fill", function(d) { return colors[d.values[0].wfState]; })
    .attr("class", "activity-bar")
    .attr("x", 0) //function(d) { return x(d.values.length); })
    .attr("width", function(d) { return x(d.values.length); })
    .attr("y", function(d) { return y(d.key); })
    .attr("height", y.rangeBand() );

    aBars
    .exit().remove();

    var tCount = svg.selectAll(".activity-text")
    .data(nest);

    tCount
    .enter()
    .append("text")
    .attr("class", "activity-text");

    tCount
    .attr("fill", function(d) { return x(d.values.length) < 20 ? 'black' : 'white'})
    .attr("x", function(d) { return x(d.values.length); })
    .attr("dx", function(d) { return x(d.values.length) < 20 ? 10 : -10})
    .attr("y", function(d) { return y(d.key) + y.rangeBand()/2 + 4; })
    .text(function(d) { return d.values.length; })
    .attr('text-anchor', function(d) { return x(d.values.length) < 20 ? 'start' : 'end'});

    tCount
    .exit().remove();
  }.observes('logs'),  
});

Ember.Handlebars.helper('activity-chart', App.ActivityChartComponent)

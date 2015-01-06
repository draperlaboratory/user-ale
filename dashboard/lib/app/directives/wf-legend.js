app.directive('wfLegend', function() {
  return {
    restrict: 'E',
    scope: {
      height: '='
    },
    controller: function($scope, wfStates) {
      $scope.wfStates = wfStates.wfStates;
    },
    link: function(scope, element, attr){

      var el = element[0],
      margin = {top:2, bottom: 2, left: 30, right: 30},
      height = scope.height - margin.top - margin.bottom,
      width = el.clientWidth - margin.left - margin.right;

      function translate(x,y) {
        return 'translate(' + x + ',' + y + ')';
      }

      var svg = d3.select(el).append('svg')
      .attr({width: el.clientWidth, height: scope.height});

      var drawLayer = svg.append('g')
      .attr('transform', translate(margin.left, margin.top));

      var textLayer = svg.append('g')
      .attr('transform', translate(margin.left, margin.top));

      var xScale = d3.scale.ordinal()
      .rangeBands([0, width], .1, 0)
      .domain(d3.range(scope.wfStates.length));

      // var xScale = d3.time.scale()
      // .range([0, width])
      // .domain([0, scope.wfStates.length]);

      console.log('A', height, scope.height, scope.wfStates)

      drawLayer.selectAll('rect')
      .data(scope.wfStates)
      .enter()
      .append('rect')
      .attr({
        x: function(d, i) { return xScale(i); },
        width: xScale.rangeBand(),
        y: 0,
        height: height,
        fill: function(d) { return d.color; },
        class: 'wfState'
      })
      .on("click", function(d) { 
        window.open('/static/wf_states/#' + d.wfState); 
      });
      // .attr("xlink:href", function (d) {
      //     return "http://www.google.com";
      // });

      textLayer.selectAll('text')
      .data(scope.wfStates)
      .enter()
      .append('text')
      .style("text-anchor", "middle")
      .attr({
        x: function(d, i) { return xScale(i) + xScale.rangeBand()/2; },
        y: height/2,
        dy: 4,
        fill: function(d, i) { return d.stroke; },
        class: 'wfState'
      })
      .text(function(d, i) { return d.name; })
      .on("click", function(d) { 
        window.open('/static/wf_states/#' + d.wfState); 
      });;



    }
  }
})
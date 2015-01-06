app.directive('wfStateChart', function() {
  return {
    restrict: 'E',
    scope: {
      logs: '=',
      height: '=',
      timebounds: '='
    },
    controller: function($scope, wfStates) {
      $scope.wfData = [];
      $scope.logs2 = [];
      $scope.$watch('logs', function(logs) {
        if (!logs.length) return;

        // logs.

        // logs.sort(function(a,b){return a.timestamp.getTime() - b.getTime()});

        logs = logs.filter(function(d) {
          return d.type == 'USERACTION';
        });

        $scope.logs2 = logs;
        var wfData = [],
        curState = {};

        logs.forEach(function(d) {
          if (d.type === 'SYSACTION') return;
          if (d.parms.wf_state != curState.state) {

            curState.stop = d.timestamp;
            if (curState.start) wfData.push(curState);

            try {
              var tmp =  _.findWhere(wfStates.wfStates, {id: +d.parms.wf_state});
              // console.log(d, _.findWhere(wfStates.wfStates, {id: +d.parms.wf_state}))
              curState = _.clone(tmp);
              curState.state = d.parms.wf_state;
              curState.start = d.timestamp;
            }
            catch(err) {
              var tmp =  _.findWhere(wfStates.wfStates, {id: 99});
              curState = _.clone(tmp);
              curState.state = 99;
              curState.start = d.timestamp;
            }
            
          }
        });
        curState.stop = d3.time.second.offset(logs[logs.length-1].timestamp, 5);
        wfData.push(curState);

        $scope.wfData = wfData;
      }, true)
    },
    link: function($scope, element, attr){

      var el = element[0],
      margin = {top:10, bottom: 20, left: 30, right: 30},
      height = $scope.height - margin.top - margin.bottom,
      width = el.clientWidth - margin.left - margin.right;

      function translate(x,y) {
        return 'translate(' + x + ',' + y + ')';
      }

      var svg = d3.select(el).append('svg')
      .attr({width: el.clientWidth, height: $scope.height});

      console.log(height, $scope.height)

      var wfLayer = svg.append('g')
      .attr('transform', translate(margin.left, margin.top));

      var activityLayer = svg.append('g')
      .attr('transform', translate(margin.left, margin.top));

      var brushLayer = svg.append('g')
      .attr('transform', translate(margin.left, margin.top));

      var xScale = d3.time.scale()
      .range([0, width]);

      var xAxis = d3.svg.axis()
      .scale(xScale)
      .ticks(5)
      .orient("bottom");

      wfLayer.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

      function render() {
        wfLayer.selectAll('rect')
        .attr({
          x: function(d) {
            return xScale(d.start);
          },
          dave: function(d) {
            return d.start;
          },
          width: function(d) {
            var out = xScale(d.stop) - xScale(d.start);
            return out > 0 ? out : 0;
          }
        })

        activityLayer.selectAll('line')
        .attr({
          x1: function(d){ return xScale(d.timestamp); },
          x2: function(d){ return xScale(d.timestamp); }
        })

        wfLayer.select(".x.axis").call(xAxis);
      }

      var brush = d3.svg.brush()
      .x(xScale)
      .on("brushend", brushed);

      function brushed() {
        console.log('brushing', brush.empty())
        // console.log(typeof brush.empty() === 'null')
        // if (brush.empty() == null) return;
        // console.log('brushing', brush.empty())
        $scope.$apply(function() {
          $scope.timebounds = brush.empty() ? null : brush.extent();
        })
      }

      $scope.$watch('logs2', function(logs) {
        // console.log('LOGS', logs)
        if (!logs.length) return;

        console.log('LOGS', logs)
        activityLayer.selectAll('line')
        .data(logs)
        .enter()
        .append('line')
        .attr({
          // x0: function(d){ return xScale(d.timestamp); },
          // x1: function(d){ return xScale(d.timestamp); },
          y1: 0,
          y2: height,
          stroke: function(d){ return d.color; },
        })
      })

      $scope.$watch('wfData', function(wfData) {
        if (!wfData.length) return;
        console.log(wfData)

        var min = d3.min(wfData, function(d) {
          return d.start;
        });

        var max = d3.max(wfData, function(d) {
          return d.stop;
        });

        xScale.domain([min, max]);

        wfLayer.selectAll('rect')
        .data(wfData)
        .enter()
        .append('rect')
        .attr({
          y: 0,
          height: height,
          fill: function(d){ return d.color; },
          'fill-opacity': 0.6
        })

        render();

        brushLayer
        .attr("class", "x brush")
        .call(brush)
        .selectAll("rect")
        .attr("y", -4)
        .attr("height", height + 8);
      })

      $scope.$watch(function(){
        return el.clientWidth
      }, function(){
        var width = el.clientWidth;
        // height = el.clientHeight;
        svg.attr({width: width, height: $scope.height});
        width = el.clientWidth - margin.left - margin.right;
        xScale.range([0, width])
        render();
      })
    }
  }
})
app.directive('compByActivity', function () {
  return {
    restrict:'E',
    // templateUrl: 'templates/directives/sort-th.html',
        // transclude: true,
        // scope: {
        //   order: '=',
        //   label: '='
        // },
        controller: function($scope) {
          console.log('hello')
          function translate(dx, dy) {
            return "translate(" + dx + "," + dy + ")"
          }
  d3.json('/stats/activities', function(data) {
    console.log(data);
    var maxComponents = d3.max(data, function(d) { return d.components.length; });

    window.data = data;

    var width = 800,
    // height = 800;
    barHeight = 40,
    padding = 3,
    margin = {top: 50, bottom: 30, left: 30, right: 30},
    svgHeight = (barHeight + padding)*data.length + margin.top + margin.bottom,
    svgWidth = width + margin.left + margin.right;

    var svg = d3.select('.fixed-info .axis')
    .append('svg')
    .attr({
      width: svgWidth,
      height: 60
    })
    .append('g')
    .attr("transform", translate(margin.left, margin.top));

    var xScale = d3.scale.linear()
      .range([0, width])
      .domain([0, maxComponents+3]);

    var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("top");

    svg.append("g")
      .attr("class", "x axis")
      // .attr("transform", "translate(0," + 50 + ")")
      .call(xAxis)
      .append("text")
      // .attr("transform", "rotate(-90)")
      .attr("y", -40)
      .attr("dy", ".71em")
      .style("text-anchor", "start")
      .text("Number of Components per Activity");

    // })

    

    var wfCoding = {
      0: {id: 0, wfState:'WF_OTHER', name: 'Other'},
      1: {id: 1, wfState:'WF_DEFINE',name: 'Define Problem'},
      2: {id: 2, wfState:'WF_GETDATA',name: 'Get Data'},
      3: {id: 3, wfState:'WF_EXPLORE',name: 'Explore Data'},
      4: {id: 4, wfState:'WF_CREATE',name: 'Create View'},
      5: {id: 5, wfState:'WF_ENRICH',name: 'Enrich Data'},
      6: {id: 6, wfState:'WF_TRANSFORM',name: 'Transform Data'},
      99: {id: 99, wfState:'WF_UNK',name: 'UNK'}
    }

    var byWf = d3.nest()
    .key(function(d) { 
      var a = d.wfStates[0];
      var a = (!a) ? 99 : +a;
      return a; 
    })
    .entries(data);

    byWf.sort(function(a, b) {
      return +a.key - +b.key;
    })

    byWf.forEach(function(wfData) {

      var wfCode = wfCoding[+wfData.key].wfState
      var wfName = wfCoding[+wfData.key].name
    
      var data = wfData.values;

      var width = 800,
      // height = 800;
      barHeight = 40,
      padding = 3,
      margin = {top: 50, bottom: 30, left: 30, right: 30},
      svgHeight = (barHeight + padding)*data.length + margin.top + margin.bottom,
      svgWidth = width + margin.left + margin.right;

      var svg = d3.select('.canvas')
      .append('svg')
      .attr({
        width: svgWidth,
        height: svgHeight
      })
      .append('g')
      .attr("transform", translate(margin.left, margin.top));

      data.sort(function(a, b) {
        return b.components.length - a.components.length;
      })

      svg.append('text')
      .attr({
        class: wfCode.toLowerCase() + ' wfTitle fill-light',
        x: 0,
        y: -5
      })
      .text(wfName)

      // svg.selectAll('rect')
      // .data(data)
      // .enter()
      // .append('rect')
      // .attr({
      //   x: 0,
      //   y: function(d, i) { return i*(barHeight+3); },
      //   width: function(d) { return xScale(d.components.length)},
      //   height: barHeight,
      //   class: function(d) { return wfCode.toLowerCase() + " fill-light bar"}
      // })

      var barGr = svg.selectAll('g.bar-group')
      .data(data)
      .enter()
      .append('g')
      .attr({
        class: 'bar-group',
        transform: function(d,i) {
          return translate(0, i*(barHeight + padding));
        },
        cursor: 'pointer'
      })
      .on("mouseenter", function(d) {
        d3.select(this).select('rect').classed('stroke-dark', true)
        .classed('sw2', true)
        
        d3.select(this).select('.compGr')
        .attr('visibility', 'visible');

        var lis = d3.select('.components ol')
        .selectAll('li')
        .data(d.components, function(d) { return d; })

        lis
        .enter()
        .append('li')
        .html(function(d) { return d; })

        lis.exit().remove();

        console.log(d.components)
      })
      .on("mouseleave", function(d) {
        d3.select(this).select('rect')
        .classed('stroke-dark', false)
        .classed('sw2', false)

        d3.select(this).select('.compGr')
        .attr('visibility', 'hidden');
      });

      barGr
      .append('rect')
      .attr({
        x: 0,
        y: 0,
        width: function(d) { return xScale(d.components.length)},
        height: barHeight,
        class: function(d) { return wfCode.toLowerCase() + " fill-light bar"}
      })

      barGr
      .append('text')
      .attr({
        x: 0,
        y: barHeight/2,
        dy: '0.3em',
        dx: 10,
        class: function(d) { return wfCode.toLowerCase() + " fill-dark over-text"}
      })
      .text(function(d) {
        return d._id;
      })

      barGr
      .append('g')
      .attr({
        transform: function(d) {
          var dx1 = xScale(d.components.length);

          if (d._id) {
            var dx2 = d._id.length * 12;
          } else {
            var dx2 = 0;
          }

          var dx = d3.max([dx1, dx2]);

          // console.log(translate(dx+20, 20))
          return translate(dx+20, 20);
          // return translate(250, 20)
        },
        class: 'compGr',
        visibility: 'hidden'
      })
      .selectAll('text')
      .data(function(d) { return ['Components:'].concat(d.components); })
      .enter()
      .append('text')
      .attr('y', function(d,i) { return i*20; })
      .attr('class', wfCode.toLowerCase() + " fill-light")
      .text(function(d) {
        return d;
      })

    })
  })
        }
      };
    });
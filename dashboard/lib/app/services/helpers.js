app
.service('wfStates', function() {
    var exports = {};

    exports.wfStates = [
      {id: 0, wfState:'WF_OTHER', name: 'Other', color: '#aaa', stroke: '#EEEEEE'},
      {id: 1, wfState:'WF_DEFINE',name: 'Define Problem', color: '#984ea3', stroke: '#F8D0FD'},
      {id: 2, wfState:'WF_GETDATA',name: 'Get Data', color: '#d7191c', stroke: 'rgb(255, 192, 192)'},
      {id: 3, wfState:'WF_EXPLORE',name: 'Explore Data', color: '#fdae61', stroke: '#AF6013'},
      {id: 4, wfState:'WF_CREATE',name: 'Create View', color: '#f1b6da', stroke: '#cc4037'},
      {id: 5, wfState:'WF_ENRICH',name: 'Enrich Data', color: '#abdda4', stroke: '#4F8348'},
      {id: 6, wfState:'WF_TRANSFORM',name: 'Transform Data', color: '#2b83ba', stroke: '#0B3D5C'},
      {id: 99, wfState:'WF_UNK',name: 'UNK', color: '#000', stroke: '#C9C9C9'},
    ]

    return exports;
})

// #7fc97f
// #beaed4
// #fdc086
// #ffff99
// #386cb0

// #66c2a5
// #fc8d62
// #8da0cb
// #e78ac3
// #a6d854

// #e41a1c
// #377eb8
// #4daf4a
// #984ea3
// #ff7f00

// #d7191c
// #fdae61
// #ffffbf
// #abdda4
// #2b83ba

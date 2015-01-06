App.ChartCompComponent = Ember.Component.extend({
  // templateName: 'chart-comp',
  // templateName:'components/chart-comp',
  layoutName:'components/chart-comp',
  classNames: ['chart-frame', 'scroll-y'],
  horizontalMargin: 30,
  verticalMargin: 30,
  marginRight: Ember.computed.alias('horizontalMargin'),
  marginLeft: Ember.computed.alias('horizontalMargin'),
  marginTop: Ember.computed.alias('verticalMargin'),
  marginBottom: Ember.computed.alias('verticalMargin'),
  defaultOuterHeight: 200,
  defaultOuterWidth: 700,
  outerHeight: Ember.computed.alias('defaultOuterHeight'),
  outerWidth: Ember.computed.alias('defaultOuterWidth'),
  width: Ember.computed(function() {
    return this.get('outerWidth') - this.get('marginLeft') - this.get('marginRight');
  }).property('outerWidth', 'marginLeft', 'marginRight'),
  height: Ember.computed(function() {
    return this.get('outerHeight') - this.get('marginBottom') - this.get('marginTop');
  }).property('outerHeight', 'marginBottom', 'marginTop'),
  $viewport: Ember.computed(function() {
    return this.$('.chart-viewport')[0];
  }),
  viewport: Ember.computed(function() {
    return d3.select(this.get('$viewport'))
    .attr('transform', this.get('transformViewport'));
  }),
  transformViewport: Ember.computed(function() {
    return "translate(" + (this.get('marginLeft')) + "," + (this.get('marginTop')) + ")";
  }).property('marginLeft', 'marginTop'),
  labelPadding: 10,
  labelWidth: 30,
  labelHeight: 15,
  labelWidthOffset: Ember.computed(function() {
    return this.get('labelWidth') + this.get('labelPadding');
  }).property('labelWidth', 'labelPadding'),
  labelHeightOffset: Ember.computed(function() {
    return this.get('labelHeight') + this.get('labelPadding');
  }).property('labelHeight', 'labelPadding'),
  graphicTop: 0,
  graphicLeft: 0,
  graphicWidth: Ember.computed.alias('width'),
  graphicHeight: Ember.computed.alias('height'),
  graphicBottom: Ember.computed(function() {
    return this.get('graphicTop') + this.get('graphicHeight');
  }).property('graphicTop', 'graphicHeight'),
  graphicRight: Ember.computed(function() {
    return this.get('graphicLeft') + this.get('graphicWidth');
  }).property('graphicLeft', 'graphicWidth'),
  hasNoData: Ember.computed(function() {
    return Ember.isEmpty(this.get('finishedData'));
  }).property('finishedData'),
  concatenatedProperties: ['renderVars'],
  renderVars: ['finishedData', 'width', 'height', 'margin'],
  init: function() {
    var renderVar, _i, _len, _ref, _results;
    this._super();
    _ref = this.get('renderVars').uniq();
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      renderVar = _ref[_i];
      _results.push(this.addObserver(renderVar, (function(_this) {
        return function() {
          return Ember.run.once(_this, _this.get('draw'));
        };
      })(this)));
    }
    return _results;
  },
  didInsertElement: function() {
    this._super();
    this._updateDimensions();
    return Ember.run.once(this, this.get('draw'));
  },
  onResizeEnd: function() {
    return this._updateDimensions();
  },
  _updateDimensions: function() {
    console.log('UpdateDims', this.$().parent().height(), this.$().height());
    this.$().height(this.$().parent().height());
    this.set('defaultOuterHeight', this.$().height());
    return this.set('defaultOuterWidth', this.$().width());
  },
  clearChart: function() {
    return this.$('.chart-viewport').children().remove();
  },
  draw: function() {
    if (this.get('state') !== 'inDOM') {
      return;
    }
    if (this.get('hasNoData')) {
      return this.clearChart();
    } else {
      return this.drawChart();
    }
  }
});
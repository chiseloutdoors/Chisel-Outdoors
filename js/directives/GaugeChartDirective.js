mainRouter
		.directive('gaugeChart', function() {
			return {
			  replace: true,
			  restrict:'E',
				scope: {
				  chartid: '@chartid',
				  chartdata: '=chartdata'
				},
				template:"<div id='{{::chartid}}' class='gauge'></div>",
				link: function(scope, elem, attrs){
				  elem.attr("id", scope.chartid);
				  var gauge = function(container, configuration) {
				    var that = {};
				    var config = {
				      size            : 60,
				      clipWidth         : 200,
				      clipHeight          : 110,
				      ringInset         : 10,
				      ringWidth         : 100,
				      
				      pointerWidth        : 10,
				      pointerTailLength     : 3,
				      pointerHeadLengthPercent  : 0.9,
				      
				      minValue          : 0,
				      maxValue          : 100,
				      
				      minAngle          : -90,
				      maxAngle          : 90,
				      
				      transitionMs        : 750,
				      
				      majorTicks          : 3,
				      
				      arcColorFn          : function(i) {
				                                return [
                                                d3.rgb('#F84949'),
				                                        d3.rgb('#FBB231'),
                                                d3.rgb('#4DAA0E')
				                                        ][i];
				      }
				    };
				    
				    var range = undefined;
				    var r = undefined;
				    var pointerHeadLength = undefined;
				    var value = 0;
				    
				    var svg = undefined;
				    var arc = undefined;
				    var scale = undefined;
				    var ticks = undefined;
				    var tickData = undefined;
				    var pointer = undefined;

				    var donut = d3.layout.pie();
				    
				    function deg2rad(deg) {
				      return deg * Math.PI / 180;
				    }
				    
				    function newAngle(d) {
				      var ratio = scale(d);
				      var newAngle = config.minAngle + (ratio * range);
				      return newAngle;
				    }
				    
				    function configure(configuration) {
				      var prop = undefined;
				      for ( prop in configuration ) {
				        config[prop] = configuration[prop];
				      }
				      
				      range = config.maxAngle - config.minAngle;
				      r = config.size / 2;
				      pointerHeadLength = Math.round(r * config.pointerHeadLengthPercent);

				      // a linear scale that maps domain values to a percent from 0..1
				      scale = d3.scale.linear()
				        .range([0,1])
				        .domain([config.minValue, config.maxValue]);
				        
				      ticks = scale.ticks(config.majorTicks);
				      tickData = d3.range(config.majorTicks).map(function() {return 1/config.majorTicks;});
				      
				      arc = d3.svg.arc()
				        .innerRadius(r - config.ringWidth - config.ringInset)
				        .outerRadius(r - config.ringInset)
				        .startAngle(function(d, i) {
				          var ratio = d * i;
				          return deg2rad(config.minAngle + (ratio * range));
				        })
				        .endAngle(function(d, i) {
				          var ratio = d * (i+1);
				          return deg2rad(config.minAngle + (ratio * range));
				        });
				    }
				    that.configure = configure;
				    
				    function centerTranslation() {
				      return 'translate('+r +','+ r +')';
				    }
				    
				    function isRendered() {
				      return (svg !== undefined);
				    }
				    that.isRendered = isRendered;
				    
				    function render(newValue) {
				      svg = d3.select(container)
				        .append('svg:svg')
				          .attr('class', 'gauge')
				          .attr('width', config.clipWidth)
				          .attr('height', config.clipHeight);
				      
				      var centerTx = centerTranslation();
				      
				      var arcs = svg.append('g')
				          .attr('class', 'arc')
				          .attr('transform', centerTx);
				      
				      arcs.selectAll('path')
				          .data(tickData)
				        .enter().append('path')
				          .attr('fill', function(d, i) {
				            return config.arcColorFn(i);
				          })
				          .attr('d', arc);
				      
				      var lg = svg.append('g')
				          .attr('class', 'label')
				          .attr('transform', centerTx);
				      lg.selectAll('text')
				          .data(ticks)
				        .enter().append('text')
				          .attr('transform', function(d) {
				            var ratio = scale(d);
				            var newAngle = config.minAngle + (ratio * range);
				            return 'rotate(' +newAngle +') translate(0,' +(config.labelInset - r) +')';
				          })
				          .text(config.labelFormat);

				      var lineData = [ [config.pointerWidth / 2, 0], 
				              [0, -pointerHeadLength],
				              [-(config.pointerWidth / 2), 0],
				              [0, config.pointerTailLength],
				              [config.pointerWidth / 2, 0] ];
				      var pointerLine = d3.svg.line().interpolate('monotone');
				      var pg = svg.append('g').data([lineData])
				          .attr('class', 'pointer')
				          .attr('transform', centerTx);
				          
				      pointer = pg.append('path')
				        .attr('d', pointerLine/*function(d) { return pointerLine(d) +'Z';}*/ )
				        .attr('transform', 'rotate(' +config.minAngle +')');
				        
				      update(newValue === undefined ? 0 : newValue);
				    }
				    that.render = render;
				    
				    function update(newValue, newConfiguration) {
				      if ( newConfiguration !== undefined) {
				        configure(newConfiguration);
				      }
				      var ratio = scale(newValue);
				      var newAngle = config.minAngle + (ratio * range);
				      pointer.transition()
				        .duration(config.transitionMs)
				        .ease('elastic')
				        .attr('transform', 'rotate(' +newAngle +')');
				    }
				    that.update = update;

				    configure(configuration);
				    
				    return that;
				  };

          scope.$watch('chartdata', function(val) {
            if (val) {
              var powerGauge = gauge("#" + scope.chartid, {
                size: 180,
                clipWidth: 250,
                clipHeight: 110,
                ringWidth: 20,
                maxValue: 100,
                transitionMs: 4000,
              });
              powerGauge.render();
              
              powerGauge.update(val);
            };
          });
				  
      }
	};
});
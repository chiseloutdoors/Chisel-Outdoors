mainRouter
		.directive('horizontalBarChart', function() {
			return {
			  restrict:'EA',
				replace : true,
        scope: {
          chartid: '@chartid'
        },
        template:"<div id='{{::chartid}}' class='gauge'></div>",
				link: function(scope, elem, attrs){
          elem.attr("id", scope.chartid);
			    var categories= ['',''];

			    var dollars = [2, 2];

			    var colors = ['#0000b4','#0082ca'];

			    var grid = d3.range(25).map(function(i){
			      return {'x1':0,'y1':0,'x2':0,'y2':480};
			    });

			    var tickVals = grid.map(function(d,i){
			      if(i>0){ return i*10; }
			      else if(i===0){ return "100";}
			    });

			    var xscale = d3.scale.linear()
			            .domain([10,250])
			            .range([0,722]);

			    var yscale = d3.scale.linear()
			            .domain([0,categories.length])
			            .range([0,480]);

			    var colorScale = d3.scale.quantize()
			            .domain([0,categories.length])
			            .range(colors);

			    var canvas = d3.select('#' + scope.chartid)
			            .append('svg')
			            .attr({'width':900,'height':550});

			    var grids = canvas.append('g')
			              .attr('id','grid')
			              .attr('transform','translate(150,10)')
			              .selectAll('line')
			              .data(grid)
			              .enter()
			              .append('line')
			              .attr({'x1':function(d,i){ return i*30; },
			                 'y1':function(d){ return d.y1; },
			                 'x2':function(d,i){ return i*30; },
			                 'y2':function(d){ return d.y2; },
			              })
			              .style({'stroke':'#adadad','stroke-width':'1px'});

			    var xAxis = d3.svg.axis();
			      xAxis
			        .orient('bottom')
			        .scale(xscale)
			        .tickValues(tickVals);

			    var yAxis = d3.svg.axis();
			      yAxis
			        .orient('left')
			        .scale(yscale)
			        .tickSize(2)
			        .tickFormat(function(d,i){ return categories[i]; })
			        .tickValues(d3.range(17));

			    var y_xis = canvas.append('g')
			              .attr("transform", "translate(150,0)")
			              .attr('id','yaxis')
			              .call(yAxis);

			    var x_xis = canvas.append('g')
			              .attr("transform", "translate(150,480)")
			              .attr('id','xaxis')
			              .call(xAxis);

			    var chart = canvas.append('g')
			              .attr("transform", "translate(150,0)")
			              .attr('id','bars')
			              .selectAll('rect')
			              .data(dollars)
			              .enter()
			              .append('rect')
			              .attr('height',19)
			              .attr({'x':0,'y':function(d,i){ return yscale(i)+19; }})
			              .style('fill',function(d,i){ return colorScale(i); })
			              .attr('width',function(d){ return 0; });


			    var transit = d3.select("svg").selectAll("rect")
			                .data(dollars)
			                .transition()
			                .duration(1000) 
			                .attr("width", function(d) {return xscale(d); });

			    var transitext = d3.select('#bars')
			              .selectAll('text')
			              .data(dollars)
			              .enter()
			              .append('text')
			              .attr({'x':function(d) {return xscale(d)-200; },'y':function(d,i){ return yscale(i)+35; }})
			              .text(function(d){ return d+"$"; }).style({'fill':'#fff','font-size':'14px'});

				  
      }
	};
});
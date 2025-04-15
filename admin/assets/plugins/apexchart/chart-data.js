'use strict';

$(document).ready(function() {

	function generateData(baseval, count, yrange) {
		var i = 0;
		var series = [];
		while (i < count) {
			var x = Math.floor(Math.random() * (750 - 1 + 1)) + 1;;
			var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
			var z = Math.floor(Math.random() * (75 - 15 + 1)) + 15;

			series.push([x, y, z]);
			baseval += 86400000;
			i++;
		}
		return series;
	}


	// Column chart
    if($('#chart-view').length > 0 ){
    	      
        var options = {
            series: [{
            name: 'series1',
            data: [11, 32, 45, 32, 34, 52, 41],
            colors: [' #C10037' ]
            
          }, {
            name: 'series2',
            colors: [' #C10037'],
            data: [31, 40, 28, 51, 42, 109, 100]
          }],
            chart: {
            height: 350,
            type: 'area',
          },
          fill: {
            colors: [' #C10037', '#C10037'],
            type: 'gradient',
            gradient: {
              shade: 'dark',
              type: "horizontal",
              shadeIntensity: 0.1,
              gradientToColors: undefined, 
              inverseColors: true,
              opacityFrom: 0.5,
              opacityTo: 0.5,
              stops: [0, 50, 100],
              colorStops: []
            }
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            width: 1,
            curve: 'smooth',
            dashArray: [0, 8, 5],
            opacityFrom: 0.5,
            opacityTo: 0.5,
            colors: [' #C10037'],
          },
          xaxis: {
            type: 'month',
            categories: ["jan", "feb", "march", "april", "may", "june", "july"]
          },
          tooltip: {
           
          },
          };
  
          var chart = new ApexCharts(document.querySelector("#chart-view"), options);
          chart.render();
        
        
    }

    // Column chart
    if($('#chart-booking').length > 0 ){
      
      var columnCtx = document.getElementById("chart-booking"),
    	columnConfig = {
    		colors: ['#C10037'],
    		series: [
    			{
    			name: "Received",
    			type: "column",
    			data: [70, 150, 80, 180, 150, 175, 201, 60, 200, 120, 190, 160, 50]
    			}
    		],
    		chart: {
    			type: 'bar',
    			fontFamily: 'Poppins, sans-serif',
    			height: 350,
    			toolbar: {
    				show: false
    			}
    		},
    		plotOptions: {
    			bar: {
    				horizontal: false,
    				columnWidth: '60%',
    				endingShape: 'rounded'
    			},
    		},
    		dataLabels: {
    			enabled: false
    		},
    		stroke: {
    			show: true,
    			width: 2,
    			colors: ['transparent']
    		},
    		xaxis: {
    			categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    		},
    		yaxis: {
    			title: {
    				text: '$ (thousands)'
    			}
    		},
    		fill: {
    			opacity: 1
    		},
    		tooltip: {
    			y: {
    				formatter: function (val) {
    					return "$ " + val + " thousands"
    				}
    			}
    		}
    	};
    	var columnChart = new ApexCharts(columnCtx, columnConfig);
    	columnChart.render();
    }
    if($('#chart-income').length > 0 ){
    	   
        var options = {
            series: [{
            name: 'PRODUCT A',
            data: dataSet[0]
          }, {
            name: 'PRODUCT B',
            data: dataSet[1]
          }, {
            name: 'PRODUCT C',
            data: dataSet[2]
          }],
            chart: {
            type: 'area',
            stacked: false,
            height: 350,
            
            zoom: {
              enabled: false
            },
          },
          dataLabels: {
            enabled: false
          },
          markers: {
            size: 0,
          },
          fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                inverseColors: false,
                opacityFrom: 0.45,
                opacityTo: 0.05,
                stops: [20, 100, 100, 100]
              },
          },
          yaxis: {
            labels: {
                style: {
                    colors: '#C10037',
                },
                offsetX: 0,
                formatter: function(val) {
                  return (val / 1000000).toFixed(2);
                },
            },
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false
            }
          },
          xaxis: {
            type: 'datetime',
            tickAmount: 8,
            min: new Date("01/01/2014").getTime(),
            max: new Date("01/20/2014").getTime(),
            labels: {
                rotate: -15,
                rotateAlways: true,
                formatter: function(val, timestamp) {
                  return moment(new Date(timestamp)).format("DD MMM YYYY")
              }
            }
          },
          title: {
            text: 'Irregular Data in Time Series',
            align: 'left',
            offsetX: 14
          },
          tooltip: {
            shared: true
          },
          legend: {
            position: 'top',
            horizontalAlign: 'right',
            offsetX: -10
          }
          };
  
          var chart = new ApexCharts(document.querySelector("#chart"), options);
          chart.render();
    }
    if($('#chart-bar').length > 0 ){
    	   
      var options = {
        series: [10, 45 , 45],
        chart: {
        width: 200,
        type: 'pie',
      },
      labels: ['Team A', 'Team B', 'Team C'],
      color:['#C10037','#C10037' , '#C10037' ],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
      };

      var chart = new ApexCharts(document.querySelector("#chart-bar"), options);
      chart.render();
    
    }
    if($('#chart-incomes').length > 0 ){
      var options = {
        series: [{
        name: 'series1',
        data: [31, 40, 28, 51, 42, 109, 100]
      }],
        chart: {
        height: 350,
        type: 'area',
      },
      fill: {
        colors: [' #C10037'],
        type: 'gradient',
        gradient: {
          type: "horizontal",
          shadeIntensity: 0.1,
          gradientToColors: undefined, 
          inverseColors: true,
          opacityFrom: 0.5,
          opacityTo: 0.5,
          stops: [0, 50, 100],
          colorStops: []
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        colors: [' #C10037'],
      },
      xaxis: {
        type: 'Month',
        categories: ["Jan", "Feb", "March", "April", "May", "Jun", "July"]
      },
      tooltip: {
       
      },
      };

      var chart = new ApexCharts(document.querySelector("#chart-incomes"), options);
      chart.render();
    
    
    }

    
});
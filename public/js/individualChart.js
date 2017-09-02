google.charts.setOnLoadCallback(drawPieChart);
$('#columnchart_individual').appear(function() {
	if($('#columnchart_individual').css('display') == 'block'){
		drawColumnChart()
	}
});
//function init() {
	//drawColunmChart()
    //drawPieChart()
//}

function drawColumnChart() {
    var data = google.visualization.arrayToDataTable(individualBarChart);

    var options = {
      chart: {
        title: 'Revision distribution by year and by user type',
      },
      vAxis : {format: 'decimal'},
      'width': 730, 'height':350
    };

    var chart = new google.charts.Bar(document.getElementById('columnchart_individual'));

    chart.draw(data, google.charts.Bar.convertOptions(options));
}

function drawPieChart() {
    var data = google.visualization.arrayToDataTable(individualPieChart);
    var options = {
      title: 'Revision number distribution by user type',
      is3D: true,
      chartArea: {'left':50,'top':50, 'width': '90%', 'height': '90%'},
      legend: { position: 'labeled' },
      'width':700, 'height':350,
      slices: {  1: {offset: 0.1},
          		 2: {offset: 0.2},
      },
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart_individual'));
    chart.draw(data, options);
  }
/*    $(window).resize(function(){
    	drawColunmChart();
    	drawPieChart();
    });*/
$( "#tabs-individual" ).tabs({
    select: function(event, ui) {
        $(ui.panel).animate({opacity:0.1});
    },
    show: function(event, ui) {
        $(ui.panel).animate({opacity:1.0},1000);
    }
});
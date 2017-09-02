google.charts.setOnLoadCallback(drawPieChart);
$('#columnchart_material').appear(function() {
	if($('#columnchart_material').css('display') == 'block'){
		drawColunmChart()
	}
});

//function initOverall() {
	//drawColunmChart()
    //drawPieChart()
//}

function drawColunmChart() {
    var data = google.visualization.arrayToDataTable(overallBarChart);

    var options = {
      chart: {
        title: 'Revision distribution by year and by user type',
      },
      vAxis : {format: 'decimal'},
      'width': 730, 'height':350
    };

    var chart = new google.charts.Bar(document.getElementById('columnchart_material'));

    chart.draw(data, google.charts.Bar.convertOptions(options));
}

function drawPieChart() {
    var data = google.visualization.arrayToDataTable(OverallPieChart);
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

    var chart = new google.visualization.PieChart(document.getElementById('piechart_material'));
    chart.draw(data, options);
  }
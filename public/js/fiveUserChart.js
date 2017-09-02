$('#user_chart').appear(function() {
	google.charts.setOnLoadCallback(drawChart)
});
//google.charts.setOnLoadCallback(drawChart);

  function drawChart() {
    var data = new google.visualization.arrayToDataTable(fiveUserBarChart);

    var options = {
      chartArea: {'left':100,'top': 20, 'width': '100%', 'height': '100%'},
      legend: { position: 'none' },
      chart: {
        title: 'Revision distributed by year of top 5 users for article ' + title,
      },
  		vAxis : {format: 'decimal'},
  		'width':400, 'height':300,
    };

    var chart = new google.charts.Bar(document.getElementById('columnchart_five'));
    // Convert the Classic options to Material options.
    chart.draw(data, google.charts.Bar.convertOptions(options));
  };
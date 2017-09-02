$('#user_chart').appear(function() {
	google.charts.setOnLoadCallback(drawChart)
});
//google.charts.setOnLoadCallback(drawChart);

  function drawChart() {
    var data = new google.visualization.arrayToDataTable(userBarChart);

    var options = {
      chartArea: {'left':100,'width': '100%', 'height': '100%'},
      legend: { position: 'none' },
      chart: {
        title: 'Revision distributed by year of user ' + user + ' for article ' + title,
      },
  		vAxis : {format: 'decimal'},
  		'width':390, 'height':280,
    };

    var chart = new google.charts.Bar(document.getElementById('columnchart_user'));
    // Convert the Classic options to Material options.
    chart.draw(data, google.charts.Bar.convertOptions(options));
  };
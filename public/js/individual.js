$(document).ready(function(){
	google.charts.load('current', {packages: ['corechart', 'bar']}); 

	$('#selectbox').fadeIn('slow');
	
	$("#title").change(function(){
		$('#wiki').slideUp();
		$('#title').css({'margin-top':'0', 'font-size':'15px', 'width':'30%'});
		$('#individual-statistics .loader').fadeIn('fast');
		$('#container_individual').fadeOut('slow');

		var option = $('#title option').filter(function() {
		       return this.value === $("#title").val();
		   }).val();
		if (option) {
			$.post("http://localhost:3000/article", {title: option}, function(data){
				$('#individual-statistics .loader').fadeOut('fast');
				$('#result').html(data);
				$('#hint').text('');
				$('#result').show();
				first_user = $( "#topFive li" ).first().attr('value');
				$.post("http://localhost:3000/user", {user: first_user, title: title}, function(data){
					$('#user_chart').html(data);
					$('#user_chart').show();
				});
		});
		}
		else {
			$('#hint').text('No result');
		}
	});
	
	$( "#index" ).tabs({
		create: function(event, ui) {
			$('#overall-statistics .loader').fadeIn('fast');
			$('#overall-statistics').load('/overall');
        },
		select: function(event, ui) {
            $(ui.panel).animate({opacity:0.1});
        },
        show: function(event, ui) {
            $(ui.panel).animate({opacity:1.0},1000);
        }
	});
});
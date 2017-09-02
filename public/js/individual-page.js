$(document).ready(function(){
	/*$('#index_link a, #overall_link, #individual_link').one( 'click', function(){
		$(this).prepend('<i class="fa fa-spinner fa-spin"></i>');
	})
	
	$('#overall_link').click(function(){
		$('#result').fadeOut('fast');
		$('.loader').fadeIn('fast');
		$('#box').load('/overall');
	})*/
	
	$('#container_individual').fadeIn('slow');
	$("#topFive li a").click(function(){
		selected = $(this).parent().attr('value')
		$.post("http://localhost:3000/user", {user: selected, title: title}, function(data){
			$('#user_chart').html(data);
			$('#user_chart').show();
		} );
	});
	
	$( "#sum" ).click(function(){
		$.post("http://localhost:3000/topfive", {title: title}, function(data){
			$('#user_chart').html(data);
			$('#user_chart').show();
		});
	});
});
$(document).ready(function(){
	$('#container').fadeIn('slow');
	
	$( "#tabs" ).tabs({
	    select: function(event, ui) {
	        $(ui.panel).animate({opacity:0.1});
	    },
	    show: function(event, ui) {
	        $(ui.panel).animate({opacity:1.0},1000);
	    }
	});
});
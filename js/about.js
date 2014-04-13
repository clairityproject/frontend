$(function() {

	$('body').scrollspy({ target: '.collapse.navbar-collapse' });

	var handlerIn = function(evt) {
		var featuresTile = $(evt.currentTarget).closest('.features-tile');
		var leftPixels = featuresTile.attr('data-left');
		featuresTile.animate({
			width: '323px',
			height: '322px',
			left: leftPixels,
			top: '-40px'
		});
		featuresTile.css('z-index', 1500)
	};
	var handlerOut = function(evt) {
		var featuresTile = $(evt.currentTarget).closest('.features-tile');
		featuresTile.animate({
		}).removeAttr('style');
	};
	
	$('.features-tile-cap').hover(handlerIn, handlerOut);


});
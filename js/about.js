$(function() {

	$('body').scrollspy({ target: '.collapse.navbar-collapse' });


	// var handlerIn = function(evt) {
	// 	var featuresTile = $(evt.currentTarget).closest('.features-tile');
	// 	var leftPixels = featuresTile.attr('data-left');
	// 	featuresTile.animate({
	// 		width: '323px',
	// 		height: '322px',
	// 		left: leftPixels,
	// 		top: '-40px'
	// 	});
	// 	featuresTile.css('z-index', 1500)
	// };
	// var handlerOut = function(evt) {
	// 	var featuresTile = $(evt.currentTarget).closest('.features-tile');
	// 	featuresTile.animate({
	// 	}).removeAttr('style');
	// };
	
	// $('.features-tile-cap').hover(handlerIn, handlerOut);


$(".scrollable").scrollable();
 
$(".items img").click(function() {
	// see if same thumb is being clicked
	if ($(this).hasClass("active")) { return; }
 
	// calclulate large image's URL based on the thumbnail URL (flickr specific)
	var url = $(this).attr("src");
 
	// get handle to element that wraps the image and make it semi-transparent
	var wrap = $("#image_wrap").fadeTo("medium", 0.5);
 
	// the large image from www.flickr.com
	var img = new Image();
 

	// call this function after it's loaded
	img.onload = function() {
 
		// make wrapper fully visible
		wrap.fadeTo("fast", 1);
 
		// change the image
		wrap.find("img").attr("src", url);
 
	};
 
	// begin loading the image from www.flickr.com
	img.src = url;
 
	// activate item
	$(".items img").removeClass("active");
	$(this).addClass("active");
 
// when page loads simulate a "click" on the first image
}).filter(":first").click();

});



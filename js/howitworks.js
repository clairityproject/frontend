$(window).load(function() {
    $('img.caption').captionjs({
    	'mode': 'stacked'
    });

	$(".items img").click(function(ev){
		 var caption = $(ev.currentTarget).attr("data-caption");
		 $("#image_wrap figcaption").text(caption);
	})
});


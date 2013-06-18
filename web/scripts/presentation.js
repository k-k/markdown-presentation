$(document).ready( function() {
	$('div.page:not(:first)').hide();
	$(document).on( 'swipeleft', function() {
		next = $('div.page:visible').next('div.page');
		if ( next.length ) {
			$('div.page:visible').hide();
			next.fadeIn( 200 );
			return false;
		}
	});
	$(document).on( 'swiperight', function() {
		last = $('div.page:visible').prev('div.page');
		if ( last.length ) {
			$('div.page:visible').hide();
			last.fadeIn( 200 );
			return false;
		}
	});
	$(document).keydown( function( e ) {
		if ( e.which == 39 || e.which == 32 || e.which == 34 || e.which == 40) {
			next = $('div.page:visible').next('div.page');
			if ( next.length ) {
				$('div.page:visible').hide();
				next.fadeIn( 200 );
				return false;
			}
		}
		if ( e.which == 37 || e.which == 8 || e.which == 33 || e.which == 38 ) {
			last = $('div.page:visible').prev('div.page');
			if ( last.length ) {
				$('div.page:visible').hide();
				last.fadeIn( 200 );
				return false;
			}
		}
	});
});
var fontFix = function () {
	var width = window.innerWidth || document.documentElement.clientWidth;
	document.getElementById("document").style.fontSize = Math.max( 1, ( ( 24 / 1920 ) * width ) / 12 ) + "em";
};
window.addEventListener('resize', fontFix);
window.addEventListener('load', fontFix);

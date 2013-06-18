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
	Mousetrap.bind([ 'right', 'space', 'pagedown', 'down' ], function( e ) {
		next = $('div.page:visible').next('div.page');
		if ( next.length ) {
			$('div.page:visible').hide();
			next.fadeIn( 200 );
			return false;
		}
	});
	Mousetrap.bind([ 'left', 'backspace', 'pageup', 'up' ], function( e ) {
		last = $('div.page:visible').prev('div.page');
		if ( last.length ) {
			$('div.page:visible').hide();
			last.fadeIn( 200 );
			return false;
		}
	});
});
var fontFix = function () {
	var width = window.innerWidth || document.documentElement.clientWidth;
	document.getElementById("document").style.fontSize = Math.max( 1, ( ( 24 / 1920 ) * width ) / 9 ) + "em";
};
window.addEventListener('resize', fontFix);
window.addEventListener('load', fontFix);

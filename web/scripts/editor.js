(function( $, _ ) {
	var binds = {
		keys: function() {
			_.bind( 'shift+right', page.next );
			_.bind( 'shift+left', page.prev ); 
			_.bind( 'tab', util.editor.tab );
			_.bind( 'shift+a', util.slide.add );
			_.bind( 'shift+i', util.slide.insert );
			_.bind( 'shift+s', util.presentation.save );
		},
		events: function() {
			$('#presentation').on('change', presentation.fetch );
			$('#page-group').on('click', '.page-nav', nav.render );
			$('#add-page').on('click', util.slide.add );
			$('#insert-page').on('click', util.slide.insert );
			$('#remove, #remove-page').on('click', util.slide.remove );
			$('#show-css').on('click', customcss.toggle );
			$('#save-slides').on('click', util.presentation.save );
			$('#p_id').on('blur', util.editor.slug );
			$('#save-new-presentation').on('click', presentation.create );
			$('#p_id').on('keyup', util.urlpreview );
			$('#page-group').on('click', '.btn.group', group.display );
			$('#markdown-editor').on('click', '#md-bold', util.editor.bold );
			$('#markdown-editor').on('click', '#md-italic', util.editor.italic );
			$('#markdown-editor').on('click', '.header-button', util.editor.header );
			$('#markdown-editor').on('click', '#md-quote', util.editor.quote );
			$('#markdown-editor').on('click', '#md-code', util.editor.code );
			$('#markdown-editor').on('click', '#md-link', util.editor.link );
			$('#markdown-editor').on('click', '#md-image', util.editor.image );
			$('#markdown-editor').on('click', '#md-numbered', util.editor.numbered );
			$('#markdown-editor').on('click', '#md-unordered', util.editor.unordered );
			$('#markdown-editor').on('click', '#md-hr', util.editor.hr );
		},
	},
	util = {
		container: window.localStorage || { setItem: function() { }, getItem: function() {} },
		storage: function( key, val ) {
			if ( typeof val == "undefined" || val === null )
				return util.container.getItem( key );
			else
				return util.container.setItem( key, val );
		},
		slide: {
			add: function() {
				var p = meta.pages() + 1;
				if ( p == 61 ) return;

				meta.pages( p );
				slide.add( p, "" ); 
				page.add( p );

				nav.render( p );
			},
			insert: function() {
				var p = meta.pages() + 1;
				var x = util.storage('current-slide');
				if ( p == 100 ) return;
				
				meta.pages( p );
				slide.insert( "" );
				page.add( p );

				nav.render( x );
			},
			remove: function( x ) {
				if ( util.confirmdel() > 0 && ! $('#remove-current-page').is(':visible') )
				{
					$('#remove-current-page').modal('show');
					return false;
				}

				var x = typeof x == "object" ? util.storage('current-slide') : x;

				if ( ! $('#delete-confirm').is(':checked') )
					util.confirmdel( 0 );

				slide.remove( x );
				page.remove( x );
				
				$('#page-group .group').each(function() {
					if ( ! $(this).find('.page-nav').length ) $(this).remove();
				});
			
				meta.pages( meta.pages() - 1 );
				slide.reorder();
				page.reorder();
				nav.render( ( x - 1 || 1 ) );

				$('#remove-current-page').modal('hide');
			}
		},
		presentation: {
			save: function() {
				if ( util.storage('current-presentation').length )
					presentation.save();
			}
		},
		overlay: {
			active: false,
			show: function( msg, duration ) {
				if ( util.overlay.active ) return;

				if ( typeof duration !== "undefined" && duration > 0 )
					setTimeout( util.overlay.hide, duration );

				util.overlay.active = true;
				$('#wait-message').text( msg ).parents('div:eq(0)').fadeIn( 200 );				
			},
			update: function( msg ) {
				$('#wait-message').text( msg );
			},
			hide: function( duration ) {
				var d = duration || 0;
				setTimeout( function() {
					$('#wait-message').text('').parents('div:eq(0)').fadeOut( 100, function() { util.overlay.active = false } );
				}, d );
			}
		},
		confirmdel: function( val ) {
			if ( typeof val == "undefined" )
			{
				if ( util.storage('confirm-delete') == null ) util.storage('confirm-delete', 1 );
				return parseInt( util.storage('confirm-delete'), 10 );
			}

			util.storage('confirm-delete', val );
		},
		urlpreview: function() {
			if ( ! $('.url-preview-base').text().length )
				$('.url-preview-base').text( "http://" + location.host + "/" );

			$('.url-preview-append').text( util.editor.slug( $(this).val() ) );
		},
		editor: {
			tab: function( e ) { 
				var x = e.target;
				if ( x.tagName == "TEXTAREA" )
				{
					var fn = function( x, s, e, v ) { return "\t"; }
					util.editor.manipulate( fn, 1, 0 );
					return false;
				}
			},
			slug: function( txt ) {
				if ( typeof txt == "string" )
					return txt.toLowerCase().replace(/^\s+|\s+$/g, '').replace(/ /g, '-').replace(/[^\w-]+/g, '').replace(/-+/, '-');
				else
				{
					if ( $(this).val().length )
						$(this).val( util.editor.slug( $(this).val() ) );
					else
						$(this).text( util.editor.slug( $(this).text() ) );
				}
			},
			manipulate: function( fn, sx, ex ) {
				var x = $('.slide-editor:visible');
				var s = x.get(0).selectionStart;
				var e = x.get(0).selectionEnd;
				var v = x.val();

				x.blur();
				var str = fn( x, s, e, v );
				x.val( v.substring( 0, s ) + str + v.substring( e ) + '\r\n' );

				x.get(0).selectionStart = s + sx;
				x.get(0).selectionEnd = s + str.length - ex;
				x.focus();
			},
			bold: function( ) {				
				var fn = function( x, s, e, v ) { return "**" + v.substring( s, e ).replace(/\*/g,'').replace(/\r?\n/g, "") + "**"; };
				util.editor.manipulate( fn, 2, 2 );
				return false;
			},
			italic: function( ) {				
				var fn = function( x, s, e, v ) { return "*" + v.substring( s, e ).replace(/\*/g,'') + "*"; }
				util.editor.manipulate( fn, 1, 1 );
				return false;
			},
			header: function( ) {
				var ch = $(this).data('char');	
				var fn = function( x, s, e, v ) { return ch + v.substring( s, e ).replace(/#/g, '').trim() + ch; };
				util.editor.manipulate( fn, ch.length , ch.length );
				return false;
			},
			quote: function( ) {
				var fn = function( x, s, e, v ) { ">" + v.substring( s, e ).replace(/>/g, '').replace(/\r?\n/g, " "); };
				util.editor.manipulate( fn, 1, 0 );
				return false;
			},
			code: function() {
				var fn = function( x, s, e, v ) {
					var code = v.substring( s, e ).split(/\r?\n/g);
					for ( var c in code )
						code[c] = "\t" + code[c];
				
					return code.join('\r\n');
				};
				util.editor.manipulate( fn, 1, 0 );
				return false;
			},
			numbered: function() {
				var fn = function( x, s, e, v ) {
					var list = v.substring( s, e ).split(/\r?\n/g);
					for ( var l in list )
					{
						var i = parseInt( l, 10 ) + 1;
						list[l] = ' ' + i + '. ' + list[l].replace(/^ \d\. |^ - /g, '');
					}

					return list.join('\r\n');
				};
				util.editor.manipulate( fn, 3, 0 );
				return false;
			},
			unordered: function() {
				var fn = function( x, s, e, v ) {
					var list = v.substring( s, e ).split(/\r?\n/g);
					for ( var l in list )
						list[l] = ' - ' + list[l].replace(/^ \d\. |^ - /g, '');

					return list.join('\r\n');
				};
				util.editor.manipulate( fn, 3, 0 );
				return false;
			},
			link: function() {
				var fn = function( x, s, e, v ) {
					if ( ! v.substring( s, e ).length )
						return '[enter description here]( enter url here )';
					if ( v.substring( s, e ).indexOf('://') >= 0 )
						return '[enter description here](' + v.substring( s, e ).replace(/\r?\n/g, '') + ')';
					return '[' + v.substring( s, e ).replace(/\r?\n/g, '') + ']( enter url here )';
				};
				util.editor.manipulate( fn, 0, 0 );
				return false;
			},
			image: function() {
				var fn = function( x, s, e, v ) {
					if ( ! v.substring( s, e ).length )
						return '![enter description here]( enter url here )';
					if ( v.substring( s, e ).indexOf('://') >= 0 )
						return '![enter description here](' + v.substring( s, e ).replace(/\r?\n/g, '') + ')';
					return '![' + v.substring( s, e ).replace(/\r?\n/g, '') + ']( enter url here )';
				};
				util.editor.manipulate( fn, 10, 0 );
				return false;
			},
			hr: function() {
				var fn = function( x, s, e, v ) { return v.substring( s, e ) + '\r\n\r\n----------\r\n\r\n'; };
				util.editor.manipulate( fn, 0, 18 );
				return false;
			}
		}
	},
	presentation = {
		entity: {
			p_id: 0,
			meta: {
				title: "",
				author: "",
			},
			css: [],
			pages: [ { page: 1, raw: [ ], html: "" } ]
		},
		list: function() {
			$.post('/editor/list/', function( data ) {
				if ( ! data.length ) 
				{
					$('#presentation').html('').append( $('<option/>').val("").text("No presentations found...") );
					return;
				}

				$('#presentation').html('').append( $('<option/>').val("").text("Please Select One") );
				for ( var p in data )
					$('#presentation').append( $('<option />').val( data[p].p_id ).text( data[p].meta.title ) );
			});
		},
		fetch: function( id ) {
			var id = typeof id === "object" ? $(this).val() : id;
			if ( ! id.length || id == util.storage("current-presentation") ) return;
			
			util.overlay.show( "Fetching your presentation!" );
			$.post('/editor/' + id + '/', function ( data ) {
				util.storage('current-presentation', id );
				util.storage('current-slide', '' );
				util.storage('presentation-url', "http://" + location.host + "/" + id + ".doc" );
				$('#view-url').attr('href', util.storage('presentation-url') );

				meta.update( data.meta );
				customcss.update( data.css );

				slide.clear();
				nav.clear();
				for( var p in data.pages ) {
					p = data.pages[ p ];
					slide.add( p.page, p.raw );
					page.add( p.page );
				}
			
				customcss.hide();
				group.toggle( 1 );
				nav.render( 1 );

				util.overlay.hide( 250 );
			});
		},
		create: function() {
			presentation.entity =  {
				p_id: $('#p_id').val(),
				meta: {
					title: $('#title').val(),
					author: $('#author').val(),
					pages: 1
				},
				css: "",
				pages: [ { page: 1, raw: "", html: "" } ]
			};
			presentation.persist( function() {
				$('#presentation')
					.append( $('<option />').val( presentation.entity.p_id ).text( presentation.entity.meta.title ) )
					.val( presentation.entity.p_id );
				$('#add-new-form').find(':input').val('');
				$('#add-new-presentation').modal('toggle');
				meta.update( presentation.entity.meta );
				presentation.fetch( presentation.entity.p_id );
			});
		},
		save: function() {
			presentation.entity = {
				p_id: $('#presentation').val(),
				meta: {
					title: $('#meta-title').text(),
					author: $('#meta-author').text(),
					pages: $('#meta-pages').data('val'),
				},
				css: $('#custom-css').val().replace(/\r?\n/g, "\n"),
				pages: []
			};
			$('.slide-editor').each( function() {
				presentation.entity.pages.push({
					page: $(this).data('p'),
					raw: $(this).val().replace(/\r?\n/g, "\n")
				});
			});
			presentation.persist( util.overlay.hide );
		},
		persist: function( callBack ) {
			util.overlay.show( "Persisting Changes..." );
			$.post('/save/', { presentation: JSON.stringify( presentation.entity ) }, function( data ) {
				if ( data == "Problems." )
					var message = "There was a problem :(";
				else
					var message = "All set!";

				util.overlay.update( message );
				if ( typeof callBack === "function" )
					callBack();
			});
		}
	},
	slide = {
		add: function( x, raw ) {
			$('#slides').append(
				$('<textarea />')
					.attr({ id: "slide-page-" + x, class: "slide-editor mousetrap" })
					.val( raw.replace(/\\n/g, "\r\n") )
					.data('p', x )
			);
			
		},
		insert: function( raw ) {
			var p = util.storage('current-slide');
			$('#slide-page-' + p).after(
				$('<textarea />')
					.attr({ id: "slide-page-00", class: "slide-editor mousetrap" })
					.val( raw.replace(/\\n/g, "\r\n") )
					.data('p', 00 )
			);
			slide.reorder();
		},
		remove: function( x ) {
			$('#slide-page-' + x).remove();
		},
		reorder: function() {
			$('.slide-editor').each(function() {
				var p = $('.slide-editor').index( this ) + 1;
				$(this).attr('id', 'slide-page-' + p ).data('p', p );
			});
		},
		clear: function() {
			$('#slides').children('div :not(#slides-empty, #slides-menu, #slides-css)').remove();
		}
	},
	meta = {
		update: function( data ) {
			for( var m in data )
			{
				var val = data[ m ];
				var ele = $('#meta-' + m );
				ele.text( val ).data('val', val );
				if ( ele.hasClass('editable') )
					ele.attr('contenteditable', '' );
			}
		},
		pages: function( val ) {
			if ( typeof val == "undefined" )
				return parseInt( $('#meta-pages').data('val'), 10 );

			val = parseInt( val, 10 );
			$('#meta-pages').text( val ).data('val', val );
		},
		clear: function() {
			$('.info-value').forEach( function() { $(this).text('').data('val', '' ); });
		}
	},
	customcss = {
		update: function( data ) {
			css = data || "";
			$('#custom-css').val( css.replace(/\\n/g, "\r\n") );
		},
		clear: function() {
			$('#custom-css').val("");
		},
		toggle: function() {
			if ( $('#slides-css').is(':visible') )
				customcss.hide();
			else
				customcss.show();
		},
		show: function() {
			$('#slides-css').fadeIn( 200 );
			$('.slide-editor, #markdown-editor').hide();
			$('.btn-info').removeClass('btn-info');
			$('#show-css').addClass('btn-info').find('i').addClass('icon-white');
		},
		hide: function() {
			var p = util.storage('current-slide');
			if ( p )
			{
				$('#slide-page-' + p + ', #markdown-editor' ).fadeIn( 200 );
				$('#page-button-' + p).addClass('btn-info');
			}
			$('#show-css').removeClass('btn-info').find('i').removeClass('icon-white');
			$('#slides-css').hide();
		}
	}
	nav = {
		render: function( x ) {
			var x = typeof x === "object" ? $(this).text() : x;	
			var b = $('#page-button-' + x );
			var s = $('#slide-page-' + x );

			if ( util.storage('current-slide') == x && s.is(':visible') ) return;

			util.storage('current-slide', x );

			$('#slides-empty, .slide-editor, #slides-css').hide();
			s.show();

			$('#markdown-editor').show();
			
			if ( ! $('#slides-menu').is(':visible') )
				$('#slides-menu').fadeIn( 100 );

			if ( ! b.parents('.group.active').length )
				group.toggle( b.parents('.group:eq(0)') );

			$('.btn-info').removeClass('btn-info').find('i').removeClass('icon-white');
			b.show().addClass('btn-info');
		},
		clear: function() {
			$('#slides-menu #page-group').children('.group').remove();
		}
	},
	page = {
		add: function( x ) {
			var g = x % 10  == 0 ? x / 10 :  Math.floor( x / 10 ) + 1;
			group.add( g );
			$('#group-' + g ).append(
				$('<button />').attr({ id: "page-button-" + x, class: "btn btn-mini page-nav" }).data('p', x).text( x )
			);
		},
		remove: function( x ) {
			$('#page-button-' + x).remove();
		},
		next: function() {
			var x =  $('#slide-page-' + util.storage('current-slide') ).next('textarea.slide-editor');
			if ( x.length )
				nav.render( x.data('p') );
		},
		prev: function() {
			var x = $('#slide-page-' + util.storage('current-slide') ).prev('textarea.slide-editor');
			if ( x.length )
				nav.render( x.data('p') );
		},
		reorder: function() {
			$('.page-nav').each( function() {
				var p = $('.page-nav').index( this ) + 1;
				$(this).attr('id', 'page-button-' + p ).text( p ).data('p', p );
			});
		}
	},
	group = {
		add: function( x ) {
			if ( $('#group-' + x).length ) return;

			var end = x * 10;
			var start = end - 9;
			$('#page-group').append(
				$('<div />')
					.attr({ id: "group-" + x, class: "btn btn-mini btn-group group" })
					.data({ g: x, s: start, e: end })
					.text( start + " - " + end )
			);
		},
		toggle: function( e ) {
			e = typeof e !== "object" ? $("#group-" + e ) : $(e);

			$('#page-group .group').addClass('btn btn-mini').removeClass('active').find('.page-nav').hide();
			e.removeClass('btn btn-mini').addClass('active').find('.page-nav').fadeIn();
		},
		display: function( e ) {
			var x = typeof e !== "object" ? $("#group-" + e ).data('g') : $(this).data('g');
			var y = $("#page-group .group.active").data('g');
			var pos = (x < y) ? 'last' : 'first';

			nav.render( $(this).find('.page-nav:' + pos).data('p') );
		}
	},
	init = function() {
		util.storage('current-presentation', '');
		util.storage('current-slide', 1 );
		util.storage('confirm-delete', 1 );
		binds.keys();
		binds.events();
		presentation.list();
	};
	$('document').ready( init );

})( jQuery, Mousetrap );

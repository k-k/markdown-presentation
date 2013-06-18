# Markdown Presentations - With Silex & MongoDB. 

##Installation
This project is managed with [composer](http://getcomposer.org/) and published to [packagist](https://packagist.org/packages/kmfk/markdown-presentation). To install it:

	# composer.phar create-project kmfk/markdown-presentation


This repository requires `MongoDB` & `PHP 5.4`. 

#####Configure your MongoDB Info
If the database and/or collection do not exist, they will be created once you create a new presentation. 

The `mongo.options` array will allow any of the `options` passed to `MongoClient` - see [PHP - MongoClient](http://php.net/manual/en/class.mongoclient.php).  You can leave the `mongo.options` property as an empty array if its un-needed.

	$app->register( new MarkdownPresentation\Provider\MongoClientProvider(), [ 
		'mongo.host' => "localhost:27017",
		'mongo.db'	=> "presentation",
		'mongo.collection' => "slides",
		'mongo.options' => [ ]
	]);

#####Configure MonoLog - ( Optional )
Monolog can be removed ( or commented out ) if you do not want to use it.  Otherwise, make sure that the file specified has the correct permissions.

	$app->register( new Silex\Provider\MonologServiceProvider(), [ 
		'monolog.logfile' => '/var/log/apache2/error.log', 
		'monolog.level' => \Monolog\Logger::WARNING ] 
	);


##Features

#####Markdown Formatting:
[Silex-Markdown Provider](https://github.com/nicl/Silex-Markdown), which relies on the [Dragonfly](https://github.com/dflydev/dflydev-markdown) markdown parser.

#####Syntax Highlighting:
Uses [Google Code Prettify](https://code.google.com/p/google-code-prettify/) to handle code type detection and syntax highlighting of `<pre><code>` blocks.

#####PDF's Available:
Using [KnpLabs Snappy](https://github.com/KnpLabs/snappy) and [wkhtmltopdf](http://wkhtmltopdf.googlecode.com/) your presentation can be exported as a PDF.

#####Slide Navigation & Keyboard shortcuts:
Relies on [Mousetrap.js](http://craig.is/killing/mice) for keybindings.
Both the presentation view and editor have keyboard shortcuts. All standard keys are bound for the Presentation view, to allow it to work with common presenter's remotes.

#####Markdown Editor & CSS
Use the custom Markdown editor for quickly creating & formatting your presentation.  You can specify custom CSS to style any elements:

	/* To target H1 tags on the first page */
	#slide-page-1 h1, h2, h3 {
		color: red;
	}

	/* Or an image... consider the following, using the image's alt tag*/
	![specific-title](http:://example.com/image.jpg)
	
	img[alt=specific-title] {
		border-radius: 5px;
	}

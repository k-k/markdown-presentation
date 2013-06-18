# Simple Markdown Formatted Presentations - With Silex. 

##To Use: 
This repository requires `MongoDB` and `PHP 5.4`.  To use, you must configure a few options in `src/app.php`:

#####Configure your MongoDB Info
If the database and/or collection do not exist, they will be created once you create a new presentation. The `mongo.options` array will allow any of the `options` passed to `MongoClient` - see [PHP - MongoClient](http://php.net/manual/en/class.mongoclient.php).  If you do not have a replicaSet, you can set the `mongo.options` property to an empty array.

	$app->register( new UE\Provider\MongoClientProvider(), [ 
		'mongo.host' => "mongodb://example-host.net:27017",
		'mongo.db'	=> "presentation",
		'mongo.collection' => "slides",
		'mongo.options' => [ 'replicaSet' => 'example', 'readPreference' => \MongoClient::RP_SECONDARY_PREFERRED ]
	]);

#####Configure MonoLog - ( Optional )
Monolog can be removed ( or commented out ) if you do not want to use it.  Otherwise, make sure that the file specified has the correct permissions, else this will error.

	$app->register( new Silex\Provider\MonologServiceProvider(), [ 
		'monolog.logfile' => '/var/log/apache2/error.log', 
		'monolog.level' => \Monolog\Logger::WARNING ] 
	);


##Features

#####Markdown Formatting:
[Silex-Markdown Provider](https://github.com/nicl/Silex-Markdown), which relies on the [Dragonfly](https://github.com/dflydev/dflydev-markdown) markdown parser.


#####Syntax Highlighting:
Uses [Google Code Prettify](https://code.google.com/p/google-code-prettify/) to handle code type detection and syntax highlighting of `<pre><code>` blocks.

#####PDF Available:
Uses [KnpLabs Snappy](https://github.com/KnpLabs/snappy) and [wkhtmltopdf](http://wkhtmltopdf.googlecode.com/) for rendering this into a PDF.

#####Slide Navigation:
Right and Left arrow keys on the keyboard are bound to move through the slides with simple fade transitions.  Spacebar, Down Arrow, Page Down and Backspace, Up Arrow and Page Up are also available for navigating through slides - to be compatible with presentation remotes.

In the future, I may add other customizable transitions.


#####Scaling Text
The font of the slides scale with the browser window, to be easier to read at farther distances.

#####Editor built-in
Use the simple editor manage your presentations and to create your markdown based slides. Editor maintains linebreaks and tabspacing and allows the tab key  to insert tabspaces instead of shifting to the next field.  You may also add your own custom CSS per presentation.

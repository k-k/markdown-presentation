<?php
require_once __DIR__ . '/../vendor/autoload.php';

use UE\Application\PresentationApplication;

$app = new PresentationApplication();

$app->register( new Silex\Provider\TwigServiceProvider(), [ 'twig.path' => __DIR__.'/../web/views' ] );
$app->register( new Nicl\Silex\MarkdownServiceProvider(), [ 'markdown.parser' => 'extra' ] );
$app->register( new UE\Provider\SnappyServiceProvider() );
$app->register( new Silex\Provider\MonologServiceProvider(), [ 
	'monolog.logfile' => '/var/log/apache2/error.log', 
	'monolog.level' => \Monolog\Logger::WARNING ] 
);
$app->register( new UE\Provider\MongoClientProvider(), [ 
	'mongo.host' => "mongodb://example.com:27017",
	'mongo.db'	=> "mdpresents",
	'mongo.collection' => "slides",
	'mongo.options' => [ ]
]);

return $app;

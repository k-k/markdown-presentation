<?php

$app = require_once __DIR__.'/../src/app.php';

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use dflydev\markdown\MarkdownExtraParser;

/* MongoDB  */
$app['mongo'] = $app['mongo.client']->selectCollection( $app['mongo.db'], $app['mongo.collection'] );

$app['get.presentation'] = $app->protect( function( $presentation ) use ( $app ) {
	return $app['mongo']->find([ 'p_id' => $presentation ], [ 'css' => 1, 'meta' => 1, 'pages' => 1 ])->limit(1)->getNext();
}); 


/* Editor Routes */
$app->get('/editor/', function() use ( $app ) { 
	return $app->render('editor.twig'); 
});

$app->post('/editor/list/', function( ) use ( $app ) {
	$results = $app['mongo']->find([], [ 'p_id' => 1, 'meta.title' => 1 ])->sort([ 'meta.title' => 1 ]);
	$results = iterator_to_array( $results, false );

	return $app->json( $results, 200, [ 'Content-Type' => 'text/json', 'Cache-Control' => 'no-cache' ] ); 
});

$app->post('/editor/{presentation}/', function( $presentation ) use ( $app ) {
	if ( is_null( $presentation ) )
		return $app->json( [], 200, [ 'Content-Type' => 'text/json' ] );

	$presentation = $app['get.presentation']( $presentation );
	return $app->json( $presentation, 200, [ 'Content-Type' => 'text/json', 'Cache-Control' => 'no-cache' ] ); 
})
->value( 'presentation', null );

$app->post('/save/', function( Request $request ) use ( $app ) {
	$presentation = json_decode( $request->get('presentation'), true );

	$presentation['meta']['modified_dt'] = date("Y-m-d H:i:s");
	$parser = new MarkdownExtraParser();
	foreach( $presentation['pages'] as &$page )
		$page['html'] = $parser->transformMarkdown( $page['raw'] );

	$result = $app['mongo']->update([ 'p_id' => $presentation['p_id'] ], [ '$set' => $presentation ], [ 'upsert' => true, 'w' => 1 ] );

	if ( !$result['ok'] )
		return new Response('Problems.', 304);

	return new Response('Saved.', 201);
});


/* Document Routes */
$app->get('/', function() use ( $app ) { 
	return $app->render('presentation.md.twig'); 
});

$app->get('/pdferize/{presentation}/', function( $presentation ) use ( $app ) {
	$slides = $app['get.presentation']( $presentation );
	return $app->render('presentation.md.twig', [ 'slides' => $slides, 'pdf' => true ], new Response( null, 200, [ 'Content-Type' => 'text/html' ] ) );
});

$app->get('/{presentation}.{format}', function( Request $request, $presentation, $format ) use( $app ) {
	
	if ( $format == "pdf" )
	{
		$url = "http://{$request->headers->get('host')}/pdferize/{$presentation}/";
		$pdf = $app['snappy.pdf']->getOutput( $url );
		return new Response( $pdf, 200, [ 'Content-Type' => 'application/pdf' ] );
	}

	$slides = $app['get.presentation']( $presentation );
	return $app->render('presentation.md.twig', [ 'slides' => $slides, 'pdf' => false ], new Response( null, 200, [ 'Content-Type' => 'text/html' ] ) 
	);	
})
->assert('format', 'md|html|doc|txt|pdf');

$app->run();

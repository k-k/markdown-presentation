<?php

namespace MarkdownPresentation\Provider;

use Silex\Application;
use Silex\ServiceProviderInterface;
use Knp\Snappy\Pdf;

class SnappyServiceProvider implements ServiceProviderInterface
{
	public function boot(Application $app)
	{
	}

	public function register(Application $app)
	{
		$app['snappy.pdf'] = $app->share(function ($app) {
			return new Pdf(
				isset( $app['snappy.pdf_binary'] ) 
					? $app['snappy.pdf_binary'] 
					: __DIR__ . '/../../../vendor/google/wkhtmltopdf-amd64/wkhtmltopdf-amd64',
				isset( $app['snappy.pdf_options'] ) 
					? $app['snappy.pdf_options'] 
					: [ ]
			);
		});
	}
}

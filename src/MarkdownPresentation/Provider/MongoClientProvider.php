<?php

namespace MarkdownPresentation\Provider;

use Silex\Application;
use Silex\ServiceProviderInterface;

class MongoClientProvider implements ServiceProviderInterface
{
	public function register( Application $app )
	{
		$app['mongo.client'] = $app->share( function() use ( $app ) {
			if ( !empty( $app['mongo.host'] ) )
			{
				$host = $app['mongo.host'];

				if ( !empty( $app['mongo.db'] ) ) $host .= '/' . $app['mongo.db'];

				$options = !empty( $app['mongo.options'] ) ? $app['mongo.options'] : [];

				return new \MongoClient( $host, $options );
			}
			else
				throw new \InvalidArgumentException("mongo.host can not be empty!");
		});
	}

	public function boot(Application $app)
	{ 	}
}

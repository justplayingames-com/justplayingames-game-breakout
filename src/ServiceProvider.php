<?php

namespace JustPlayinGames\Games\Breakout;

use Illuminate\Support\ServiceProvider as BaseServiceProvider;


class ServiceProvider extends BaseServiceProvider
{
    /**
     * Bootstrap the application events.
     */
    public function boot()
    {
        /* views */
        $this->loadViewsFrom(__DIR__.'/../resources/views', 'justplayingames-game-breakout');

        $this->publishes([
            __DIR__.'/../resources/views' => resource_path('views/vendor/justplayingames-game-breakout'),
        ], 'views');

        /* assets */
        $this->publishes([
            __DIR__.'/../public' => public_path('assets/games/breakout'),
        ], 'public');
    }

    /**
     * Register the service provider.
     */
    public function register()
    {
        $this->app->router->group(
            ['namespace' => 'JustPlayinGames\Games\Breakout'], 
            function($router) {
                require (__DIR__ . '/../routes/web.php');
            }
        );
    }
}

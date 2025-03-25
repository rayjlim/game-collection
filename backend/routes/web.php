<?php

/** @var \Laravel\Lumen\Routing\Router $router */

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function () use ($router) {
    return $router->app->version();
});

// Route::apiResource('projects', ProjectController::class);
$router->group(['prefix' => 'api/'], function () use ($router) {
    $router->get('games', 'GameController@index');
    $router->post('games', 'GameController@store');
    $router->get('games/{id}', 'GameController@show');
    $router->post('games/{id}', 'GameController@update');
    // $router->patch('games/{id}', 'GameController@update');
    $router->delete('games/{id}', 'GameController@destroy');

    $router->get('removeDuplicates', 'GameController@removeDuplicates');
    $router->get('genres', 'GameController@getGenres');
    $router->get('tags', 'GameController@getTags');

    $router->post('parser/', 'ParserController@store');
    $router->post('playnite/', 'ParserController@playnite');
});


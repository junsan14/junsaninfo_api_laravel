<?php

use Illuminate\Support\Facades\Route;
use CKSource\CKFinderBridge\Controller\CKFinderController;
use App\Http\Middleware\ExcludeCkfinderFromCsrf;

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});



require __DIR__.'/auth.php';

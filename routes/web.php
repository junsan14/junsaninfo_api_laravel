<?php

use Illuminate\Support\Facades\Route;
use CKSource\CKFinderBridge\Controller\CKFinderController;
use App\Http\Middleware\ExcludeCkfinderFromCsrf;

Route::get('/', function () {
    return response()->json(['message' => 'Laravel Root OK']);

});



require __DIR__.'/auth.php';

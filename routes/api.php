<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ContactFormController;

/*
Route::get('/user', function (Request $request) {
    return Auth::check()
        ? response()->json($request->user())
        : response()->json("Not login");
});
*/
Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return response()->json([
        'user'=>$request->user(),
        'session'=>session()->all(),
    ]);
});

Route::post('/contact/send', [ContactFormController::class, 'store']);
Route::get('/blog', [PostController::class, 'index']);
Route::get('/blog/{category}/{postId}', [PostController::class, 'show']);


//Route::middleware('auth:sanctum')->get('/blog/create', [PostController::class, 'create']);

//Route::get('/blog/create', [PostController::class, 'store']);
//Route::get('/admin', [PostController::class, 'index']);

Route::get('/admin/blog/post/create', [PostController::class, 'create']);
Route::post('/admin/blog/post/store', [PostController::class, 'store']);

Route::get('/admin/blog/post/edit', [PostController::class, 'edit']);
Route::put('/admin/blog/post/visible', [PostController::class, 'visible']);
Route::delete('/admin/blog/post/delete', [PostController::class, 'destroy']);



//Route::post('/blog/create', [BlogController::class, 'store']);
/*
Route::middleware(['auth:sanctum'])->group(function () {
     
   Route::post('/blog/create', [BlogController::class, 'store']);
});
*/
//Route::get('/blog/{category}/{id}', [PostController::class, 'show']);


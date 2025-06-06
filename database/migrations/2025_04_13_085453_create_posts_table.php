<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->integer('author_id')->nullable();
            $table->string('title')->nullable();
            $table->text('content')->nullable();
            $table->string('excerpt')->nullable();
            $table->integer('category')->nullable();
            $table->string('keywords')->nullable();
            $table->string('tag')->nullable();
            $table->string('thumbnail');
            $table->boolean('is_show')->default(false);;
            $table->string('slug')->nullable();
            $table->boolean('is_top')->default(false);;
            $table->datetime('published_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};

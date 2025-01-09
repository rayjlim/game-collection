<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGamesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('gc_games', function (Blueprint $table) {
            $table->id();
            $table->integer('fg_id')->nullable();
            $table->string('title', 255);
            $table->string('genre', 255)->nullable();
            $table->string('size', 100)->nullable();
            $table->date('last_checked_at')->nullable();
            $table->string('status', 50)->nullable();
            $table->text('thoughts')->nullable();

            $table->string('platform')->nullable(); // pc, gamecube, wii, etc.
            $table->string('image')->nullable();
            $table->string('graphic_style')->nullable();
            $table->integer('priority')->nullable();
            $table->text('tags')->nullable();  // will use space delimited

            $table->date('fg_article_date')->nullable();
            $table->string('fg_url')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('gc_games');
    }
}

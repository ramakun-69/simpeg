<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('ALTER TABLE employees DROP FOREIGN KEY employees_grade_id_foreign');
        DB::statement('ALTER TABLE rank_histories DROP FOREIGN KEY rank_histories_grade_id_foreign');
        Schema::dropIfExists('grades');
    }

    public function down(): void
    {
        Schema::create('grades', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->timestamps();
            $table->softDeletes();
        });
        Schema::create('grades', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::table('employees', function (Blueprint $table) {
            $table->foreignUuid('grade_id')
                  ->nullable()
                  ->constrained('grades')
                  ->cascadeOnUpdate()
                  ->nullOnDelete();
        });

        Schema::table('rank_histories', function (Blueprint $table) {
            $table->foreignUuid('grade_id')
                  ->nullable()
                  ->constrained('grades')
                  ->cascadeOnUpdate()
                  ->nullOnDelete();
        });
        // Schema::table('employees', function (Blueprint $table) {
        //     $table->foreignUuid('grade_id')
        //         ->nullable()
        //         ->constrained('grades')
        //         ->cascadeOnUpdate()
        //         ->nullOnDelete();
        // });
    }
};

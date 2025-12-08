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
        Schema::create('training_histories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('employee_id')->constrained()->cascadeOnUpdate()->cascadeOnDelete();
            $table->string('issuing_institution');
            $table->string('training_name');
            $table->date('start_date');
            $table->date('end_date');
            $table->integer('training_hours');
            $table->string('certificate_number');
            $table->date('certificate_date');
            $table->string('training_certificate_file')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('training_histories');
    }
};

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
        Schema::create('education_histories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('employee_id')->constrained()->cascadeOnUpdate()->cascadeOnDelete();
            $table->string('university_name');
            $table->string('study_program');
            $table->enum(
                'education_program',
                ['D1', 'D2', 'D3', 'S1', 'S2', 'S3']
            )->nullable();
            $table->string('honorific_title')->nullable();
            $table->string('post_nominal_letters')->nullable();
            $table->string('degree_certificate_number')->nullable();
            $table->date('degree_certificate_date')->nullable();
            $table->string('degree_certificate_file')->nullable();
            $table->enum('is_last', ['Yes','No'])->default('Yes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('education_histories');
    }
};

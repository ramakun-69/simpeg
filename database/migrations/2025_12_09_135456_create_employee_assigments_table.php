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
        Schema::create('employee_assigments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('employee_id')->constrained()->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignUuid('position_id')->constrained()->cascadeOnUpdate()->cascadeOnDelete();
            $table->enum('type', ['PLH', 'PLT']);
            $table->string('letter_number');
            $table->string('letter_date');
            $table->string('letter_subject')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('letter_document')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employee_assigments');
    }
};

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
        Schema::create('position_histories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('employee_id')->constrained()->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignUuid('position_id')->constrained()->cascadeOnUpdate()->cascadeOnDelete();
            $table->date('appointment_date')->nullable();
            $table->text('position_sk_number')->nullable();
            $table->date('position_sk_date')->nullable();
            $table->text('position_sk_file')->nullable();
            $table->enum('is_last', ['Yes','No'])->default('Yes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('position_histories');
    }
};

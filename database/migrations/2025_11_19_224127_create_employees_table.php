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
        Schema::create('employees', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignUuid('rank_id')->nullable()->constrained()->cascadeOnUpdate()->cascadeOnDelete('set null');
            $table->foreignUuid('grade_id')->nullable()->constrained()->cascadeOnUpdate()->cascadeOnDelete('set null');
            $table->foreignUuid('position_id')->nullable()->constrained()->cascadeOnUpdate()->cascadeOnDelete('set null');
            $table->string('nip')->unique()->index();
            $table->string('name');
            $table->enum('gender', ['Male', 'Female']);
            $table->string('born_place');
            $table->date('born_date');
            $table->string('phone');
            $table->text('address');
            $table->enum('employee_type', ['PNS', 'PPPK']);
            $table->enum('division', ['Sekretariat', 'Irban 1', 'Irban 2', 'Irban 3', 'Irban 4', 'Irban 5']);
            $table->enum('status', ['Active', 'Inactive'])->default('Active');
            $table->string('status_reason')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};

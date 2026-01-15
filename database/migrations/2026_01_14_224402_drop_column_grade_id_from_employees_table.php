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
        Schema::table('employees', function (Blueprint $table) {
            $table->dropColumn('grade_id');
        });
        Schema::table('rank_histories', function (Blueprint $table) {
            $table->dropColumn('grade_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->foreignUuid('grade_id')->nullable()->constrained()->cascadeOnUpdate()->cascadeOnDelete('set null');
        });
        Schema::table('rank_histories', function (Blueprint $table) {
            $table->foreignUuid('grade_id')->constrained()->cascadeOnUpdate()->cascadeOnDelete();
        });
    }
};

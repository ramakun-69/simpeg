<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // The application's users.id is UUID, not BIGINT.
        DB::statement('ALTER TABLE oauth_auth_codes MODIFY user_id CHAR(36) NOT NULL');
        DB::statement('ALTER TABLE oauth_access_tokens MODIFY user_id CHAR(36) NULL');
        DB::statement('ALTER TABLE oauth_device_codes MODIFY user_id CHAR(36) NULL');
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE oauth_auth_codes MODIFY user_id BIGINT UNSIGNED NOT NULL');
        DB::statement('ALTER TABLE oauth_access_tokens MODIFY user_id BIGINT UNSIGNED NULL');
        DB::statement('ALTER TABLE oauth_device_codes MODIFY user_id BIGINT UNSIGNED NULL');
    }
};

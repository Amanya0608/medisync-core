<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('medicines', function (Blueprint $table) {
            if (!Schema::hasColumn('medicines', 'requires_cold_chain')) {
                $table->boolean('requires_cold_chain')->default(false);
                $table->decimal('min_temp_celsius', 4, 1)->default(2.0);
                $table->decimal('max_temp_celsius', 4, 1)->default(8.0);
            }
        });

        if (!Schema::hasTable('cold_chain_logs')) {
            Schema::create('cold_chain_logs', function (Blueprint $table) {
                $table->id();
                $table->foreignId('batch_id')->constrained('medicine_batches')->onDelete('cascade');
                $table->string('sensor_location')->default('Central Pharmacy Cold Unit 1');
                $table->decimal('recorded_temp_celsius', 4, 1);
                $table->decimal('min_threshold', 4, 1)->default(2.0);
                $table->decimal('max_threshold', 4, 1)->default(8.0);
                $table->enum('status', ['NORMAL', 'BREACH_HIGH', 'BREACH_LOW'])->default('NORMAL');
                $table->text('notes')->nullable();
                $table->timestamp('created_at')->useCurrent();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('cold_chain_logs');
    }
};

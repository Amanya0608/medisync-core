<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('stock_condemnations')) {
            Schema::create('stock_condemnations', function (Blueprint $table) {
                $table->id();
                $table->string('condemnation_code')->unique();
                $table->foreignId('batch_id')->constrained('medicine_batches')->onDelete('cascade');
                $table->integer('quantity_condemned');
                $table->enum('reason', ['EXPIRED', 'DAMAGED', 'CONTAMINATED', 'STORAGE_BREACH', 'RECALLED'])->default('EXPIRED');
                $table->string('disposal_method')->default('Incineration');
                $table->string('witnessed_by')->default('Chief Pharmacist & Compliance Officer');
                $table->string('certificate_hash')->nullable();
                $table->foreignId('condemned_by_user_id')->nullable()->constrained('users')->nullOnDelete();
                $table->enum('status', ['PENDING_APPROVAL', 'CONDEMNED_DESTROYED'])->default('CONDEMNED_DESTROYED');
                $table->text('notes')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_condemnations');
    }
};

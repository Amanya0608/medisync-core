<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('medicine_batches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('medicine_id')->constrained('medicines')->onDelete('cascade');
            $table->foreignId('supplier_id')->nullable()->constrained('suppliers')->nullOnDelete();
            $table->string('batch_number');
            $table->date('mfd_date');
            $table->date('exp_date');
            $table->integer('initial_quantity');
            $table->integer('current_quantity');
            $table->decimal('unit_cost', 10, 2)->default(0.00);
            $table->string('storage_location')->default('Main Pharmacy Shelf');
            $table->enum('status', ['available', 'low', 'expired', 'recalled'])->default('available');
            $table->timestamps();

            $table->index(['medicine_id', 'exp_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medicine_batches');
    }
};

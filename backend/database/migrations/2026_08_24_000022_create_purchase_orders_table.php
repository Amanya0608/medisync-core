<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('purchase_orders')) {
            Schema::create('purchase_orders', function (Blueprint $table) {
                $table->id();
                $table->string('po_number')->unique();
                $table->foreignId('supplier_id')->constrained('suppliers')->onDelete('cascade');
                $table->foreignId('medicine_id')->constrained('medicines')->onDelete('cascade');
                $table->integer('requested_quantity');
                $table->decimal('estimated_cost', 10, 2)->default(0.00);
                $table->string('supplier_email');
                $table->enum('status', ['DRAFT', 'SENT_TO_SUPPLIER', 'DELIVERED', 'CANCELLED'])->default('SENT_TO_SUPPLIER');
                $table->string('triggered_by')->default('AUTOMATED_LOW_STOCK_REORDER');
                $table->text('notes')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('purchase_orders');
    }
};

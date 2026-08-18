<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('medicines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('medicine_categories')->onDelete('cascade');
            $table->string('barcode')->unique()->nullable();
            $table->string('generic_name');
            $table->string('brand_name');
            $table->string('dosage_form')->default('Tablet');
            $table->string('unit')->default('pcs');
            $table->integer('min_reorder_level')->default(100);
            $table->integer('max_stock_capacity')->default(5000);
            $table->decimal('unit_price', 10, 2)->default(0.00);
            $table->boolean('prescription_required')->default(true);
            $table->enum('status', ['active', 'discontinued'])->default('active');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medicines');
    }
};

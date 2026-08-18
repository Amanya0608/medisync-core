<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_inventory_insights', function (Blueprint $table) {
            $table->id();
            $table->foreignId('medicine_id')->constrained('medicines')->onDelete('cascade');
            $table->foreignId('batch_id')->nullable()->constrained('medicine_batches')->nullOnDelete();
            $table->decimal('expiry_risk_score', 5, 2)->default(0.00);
            $table->integer('predicted_demand_30d')->default(0);
            $table->integer('recommended_reorder_qty')->default(0);
            $table->decimal('confidence_score', 5, 2)->default(90.00);
            $table->text('ai_recommendation')->nullable();
            $table->timestamp('generated_at')->useCurrent();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_inventory_insights');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_symptom_triage_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->nullable()->constrained('patients')->nullOnDelete();
            $table->text('input_symptoms');
            $table->enum('suggested_triage_level', ['Routine', 'Urgent', 'Emergency'])->default('Routine');
            $table->string('recommended_department')->default('General OPD');
            $table->decimal('ai_confidence_score', 5, 2)->default(85.00);
            $table->json('suggested_medications')->nullable();
            $table->boolean('doctor_override')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_symptom_triage_logs');
    }
};

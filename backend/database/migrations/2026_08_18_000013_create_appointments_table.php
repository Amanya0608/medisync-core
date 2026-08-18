<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('patients')->onDelete('cascade');
            $table->foreignId('doctor_id')->constrained('staff')->onDelete('cascade');
            $table->dateTime('appointment_date');
            $table->enum('type', ['Consultation', 'Follow-up', 'Emergency', 'Routine Checkup'])->default('Consultation');
            $table->enum('priority', ['Low', 'Normal', 'High', 'Emergency'])->default('Normal');
            $table->enum('status', ['Scheduled', 'In_Progress', 'Completed', 'Cancelled'])->default('Scheduled');
            $table->text('reason')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};

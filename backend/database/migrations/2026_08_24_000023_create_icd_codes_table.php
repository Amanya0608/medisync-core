<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('icd_codes')) {
            Schema::create('icd_codes', function (Blueprint $table) {
                $table->id();
                $table->enum('icd_version', ['ICD-10', 'ICD-11'])->default('ICD-10');
                $table->string('code')->index();
                $table->string('description');
                $table->string('category')->default('General Medicine');
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('icd_codes');
    }
};

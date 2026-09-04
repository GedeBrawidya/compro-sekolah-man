<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('legalization_requests', function (Blueprint $table) {
            $table->id();
            $table->string('alumni_name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('graduation_year')->nullable();
            $table->string('document_type'); // e.g. Ijazah, Transkrip Nilai, Raport
            $table->integer('copies')->default(1);
            $table->string('document_file')->nullable();
            $table->enum('status', ['pending', 'processing', 'approved', 'rejected'])->default('pending');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('legalization_requests');
    }
};

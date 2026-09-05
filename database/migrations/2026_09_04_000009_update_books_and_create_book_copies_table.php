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
        Schema::table('books', function (Blueprint $table) {
            $table->integer('total_stock')->default(1)->after('category');
            $table->integer('available_stock')->default(1)->after('total_stock');
        });

        Schema::create('book_copies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('book_id')->constrained('books')->onDelete('cascade');
            $table->string('copy_code');
            $table->string('borrower_name')->nullable();
            $table->date('borrowed_at')->nullable();
            $table->date('due_date')->nullable();
            $table->enum('status', ['available', 'borrowed'])->default('available');
            $table->string('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('book_copies');

        Schema::table('books', function (Blueprint $table) {
            $table->dropColumn(['total_stock', 'available_stock']);
        });
    }
};

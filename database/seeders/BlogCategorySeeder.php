<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB; // ← これを追加！

class BlogCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('blog_categories')->insert([
            [
                'name' => 'test',
                'slug' => 'test',
                'is_active' => false,
            ],
            [
                'name' => 'Tech',
                'slug' => 'technology',
                'is_active' => true,
            ],
            [
                'name' => 'test01',
                'slug' => 'test01',
                'is_active' => false,
            ],
            [
                'name' => 'test02',
                'slug' => 'test02',
                'is_active' => false,
            ],
            [
                'name' => 'Diary',
                'slug' => 'diary',
                'is_active' => true,
            ],
            [
                'name' => 'JOCV',
                'slug' => 'JOCV',
                'is_active' => true, // 非表示にする例
            ],
        ]);
    }
}

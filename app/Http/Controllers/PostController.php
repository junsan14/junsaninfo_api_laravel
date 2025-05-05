<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Support\Str;
use App\Models\BlogCategory;

class PostController extends Controller
{
    public function index(Request $request)
    {  
        $limit = $request->query('limit', 10);
        $isAdmin = filter_var($request->query('all'), FILTER_VALIDATE_BOOLEAN);
        $isTop = filter_var($request->query('isTop'), FILTER_VALIDATE_BOOLEAN);
        $selectedCategory = $request->query('category');
        $inputKeywords = $request->query('keywords');
        $categroy_id = null;
        if ($selectedCategory) {
            $categroy_id = BlogCategory::where('name', $selectedCategory)->first()->id;
        }
      
        $query = Post::query();

        if (!$isAdmin) {
            $query->where('is_show', 1);
        }
        $query->when($categroy_id, function ($q) use ($categroy_id) {
            $q->where('category', $categroy_id);
        });
        $query->when($inputKeywords, function ($q) use ($inputKeywords) {
            $q->where(function ($subQuery) use ($inputKeywords) {
                $subQuery->where('title', 'like', '%' . $inputKeywords . '%')
                         ->orWhere('sub_category', 'like', '%' . $inputKeywords . '%')
                         ->orWhere('keywords', 'like', '%' . $inputKeywords . '%');
            });
        });
        if ($isTop) {
            $posts = Post::where('is_top', 1)
                         ->where('is_show', 1)
                         ->orderByDesc('is_featured')
                         ->latest()
                         ->paginate($limit);
    
            return response()->json($posts);
        }else{
            $posts = $query->orderByDesc('is_featured')  // is_featured が true の記事を先頭に
            ->latest()                   // 最新の記事順に並べる
            ->paginate($limit);
            return response()->json($posts);
        }
 
        //dd($posts);
       //return response()->json($posts);    
    }
    public function getCategories ()
    {
        $blogCategories = BlogCategory::where('is_active', true)->get();
      
        return response()->json($blogCategories);    
    }
    public function getSubCategories ()
    {
        //$blogSubCategories = BlogCategory::get();
        $blogSubCategories = Post::groupBy('sub_category')->get(['sub_category']);
        //dd($blogSubCategories);
        return response()->json($blogSubCategories);    
    }
    public function getTags()
    {
        $tags = Post::whereNotNull('tags')->pluck('tags');
        $uniqueTags = collect();

        foreach ($tags as $tagArray) {
            if (is_array($tagArray)) {
                $uniqueTags = $uniqueTags->merge($tagArray);
            }
        }

        $uniqueTags = $uniqueTags->unique()->values();
        return response()->json($uniqueTags);
    }


    public function show(Request $request,$category,$postId)
    {
        // 投稿をカテゴリとIDに基づいて取得
        $category_id = BlogCategory::where('slug', $category)->first()->id;

       $query = Post::where([
        ['category', $category_id],
        ['id', intval($postId)],
        ]);
      
        if (!$request->boolean('preview')) {
            $query->where('is_show', 1);
        }
        $post = $query->first();
       
        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }
        $sub_category = $post->sub_category;
        $relevantIds = collect();

        // 1. サブカテゴリで関連投稿（前後4件）を取得（自分は除く）
        $relevantIds = Post::where('sub_category', 'like', "%{$sub_category}%")
            ->where('is_show', 1)
            ->where('category', $post->category)
            ->where('id', '<>', $post->id) // 自分を除く
            ->orderBy('id', 'desc')
            ->limit(4)
            ->pluck('id');

        // 2. サブカテゴリで1件も見つからなければ、タグ検索
   
        if ($relevantIds->isEmpty() && !empty($post->tags)) {
           $tags = $post->tags;
            $relevantQuery = Post::query()
                ->where('is_show', 1)
                ->where('id', '<>', $post->id)
                ->where('category', $post->category);

            $relevantQuery->where(function ($query) use ($tags) {
                foreach ($tags as $tag) {
                    $trimmed = trim($tag);
                    if (!empty($trimmed)) {
                        $query->orWhere('tags', 'like', "%{$trimmed}%");
                    }
                }
            });

            $relevantIds = $relevantQuery
                ->orderBy('id', 'desc')
                ->limit(4)
                ->pluck('id');
        }

        // 最終取得
        $relevantPosts = Post::whereIn('id', $relevantIds)
            ->orderBy('id', 'desc')
            ->get();

 
        //dd($relevantPosts);
        // 投稿を返す
        return response()->json(['post'=>$post, 'relevantPosts'=>$relevantPosts]);
    }
    public function create()
    {
        $keywords = Post::latest('updated_at')->first(['keywords']);

        return response()->json([
            'keywords'=>$keywords,
            'isNew'=>true,
        ]);
    
    }
    public function store(Request $request)
    {
        $post = Post::find($request->id) ?? new Post();

        if (!$request->is_update) {
            $post->timestamps = false; // 自動で updated_at を書き換えない
        }
        $post->updated_at = $request->is_update
            ? Carbon::now()->toDateTimeString()
            : $post->updated_at;
        
        $post->fill([
            'title' => $request->title,
            'content' => $request->content,
            'author_id' => $request->author_id,
            'excerpt' => $request->excerpt,
            'keywords' => $request->keywords,
            'category' => $request->category,
            'sub_category' => $request->sub_category,
            'tags' => $request->tags,
            'slug' => $request->slug,
            'published_at' => $request->is_show == 0 ? null : ($request->published_at ?? now()->toDateTimeString()),
            'thumbnail' => $request->thumbnail ?? '<figure class="image"><img style="aspect-ratio:1200/1200;" src="' . config('app.url') . '/userfiles/images/noImage.png" width="1200" height="1200"></figure>',
            'is_show' => filter_var($request->is_show, FILTER_VALIDATE_BOOLEAN),
            'is_top' => $request->is_top,
            'is_featured' => $request->is_featured,
        ]);
        
        $post->save();
        return response()->json($request);
        
    }
    public function edit(Request $request) 
    {
      
        $id = $request->query('postid');
        $keywords = Post::latest('updated_at')->first(['keywords']);
        $post =Post::where('id', $id)->first();
        
        return response()->json(['post'=>$post,]);
    }
    public function visible(Request $request){

        $id = $request->query('postid');
        
        $is_show =(bool)$request->query('is_show');
        //dd($request);
        if($is_show){
            Post::where('id', $id)->update([
                'is_show'=>0,
                'updated_at' => Post::raw('updated_at')
            ]);
        }else{
            Post::where('id', $id)->update([
                'is_show'=>1,
                'updated_at' => Post::raw('updated_at')
            ]);
        }

        return response()->json($request);

    }

    public function destroy(Request $request)
    {
        //dd($request);
        $id = $request->query('postid');
        Post::where('id', $id)->delete(); 
        return response()->json($request);
    }

}

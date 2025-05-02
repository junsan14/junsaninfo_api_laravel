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
                         ->orWhere('keywords', 'like', '%' . $inputKeywords . '%');
            });
        });
        $posts = $query->orderByDesc('is_featured')  // is_featured が true の記事を先頭に
                   ->latest()                   // 最新の記事順に並べる
                   ->paginate($limit);
        //dd($posts);
       return response()->json($posts);    
    }
    public function getCategories ()
    {
        $blogCategories = BlogCategory::where('is_active', true)->get();
      
        return response()->json($blogCategories);    
    }
    public function show(Request $request,$category,$postId)
    {
        // 投稿をカテゴリとIDに基づいて取得
        $category_id = BlogCategory::where('name', $category)->first()->id;

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
        $tag = $post->tag;
        $relevantIds = collect([
            Post::where('tag', 'like', "%{$tag}%")
                ->where('is_show', 1)
                ->where('category', $post->category)
                ->where('id', '>', $post->id)
                ->min('id'),
            
            Post::where('tag', 'like', "%{$tag}%")
                ->where('is_show', 1)
                ->where('category', $post->category)
                ->where('id', '<', $post->id)
                ->max('id')
        ])->filter()->all();
        $relevantPosts = Post::whereIn('id', $relevantIds)->get();
 

        // 投稿を返す
        return response()->json(['post'=>$post, 'relevantPosts'=>$relevantPosts]);
    }
    public function create()
    {
        $keywords = Post::latest('updated_at')->first(['keywords']);
        $tags = Post::groupBy('tag')->get(['tag']);

        return response()->json([
            'keywords'=>$keywords,
            'tags'=>$tags,
            'isNew'=>true,
    ]);
    
    }
    public function store(Request $request)
    {
       
        $content= $request->content;
        $thumbnailPath = $request->thumbnail;
        $isshow = filter_var($request->is_show, FILTER_VALIDATE_BOOLEAN);

        //サムネイル格納
        if(!isset($thumbnailPath)){
            //$thumbnailPath ='<img src="/userfiles/images/noImage.png" alt="">';
            $url = 'https://api.example.com?key=' . env('url');
            $thumbnailPath = '<figure class="image"><img style="aspect-ratio:1200/1200;" src="'.config('app.url').'/userfiles/images/noImage.png" width="1200" height="1200"></figure>';
        }
        if($request->is_show == 0){
            $publish_at = null;
        }else{
            if($request->published_at){
                $publish_at = $request->published_at;
            }else{
                //dd(Carbon::now()->toDateTimeString());
                $today = Carbon::now()->toDateTimeString();
                $publish_at = $today;
                //dd($publish_at);
            }
            
        }
       //dd($publish_at);
       Post::updateOrCreate(
            ['id'=> $request->id],
            [
            'title' => $request->title,
            'content' => $content,
            'author_id'=>$request->author_id,
            'excerpt'=>$request->excerpt,
            'keywords'=>$request->keywords,
            'category'=>$request->category,
            'tag'=>$request->tag,
            'slug'=>$request->slug,
            'published_at'=>$publish_at,
            'thumbnail'=> $thumbnailPath,
            'is_show'=>$isshow,
            'is_top'=>$request->is_top,
            'is_featured'=>$request->is_featured,
        ]);
       return response()->json($request);
    }
    public function edit(Request $request) 
    {
      
        $id = $request->query('postid');
        $keywords = Post::latest('updated_at')->first(['keywords']);
        $post =Post::where('id', $id)->first();
        
        $tags = Post::groupBy('tag')->get(['tag']);
        return response()->json([
            'post'=>$post,
            'tags'=>$tags
        ]);
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

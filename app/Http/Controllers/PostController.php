<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
class PostController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->query('limit', 10);
        $isAdmin = $request->query('all',false);
        //dd($isAdmin);
        if($isAdmin && auth()->check()){
            $posts = Post::latest()->paginate($limit);
        }else{
            $posts = Post::where('is_show',1)->latest()->paginate($limit);
        }
        
       return response()->json($posts);    
    }
    public function show($category, $postId)
    {
        // 投稿をカテゴリとIDに基づいて取得
        $post = Post::where('category', intval($category))->find(intval($postId));
        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        // 投稿を返す
        return response()->json($post);
    }
    public function create()
    {
        $keywords = Post::latest('updated_at')->first(['keywords']);
        $tags = Post::groupBy('tag')->get(['tag']);

        return response()->json([
            'post'=>[
                'keywords'=>$keywords,
                'category'=>5,
                'is_show'=>1,
                'is_top'=>1
            ],
            'tags'=>$tags,
    ]);
    
    }
    public function store(Request $request)
    {
       
        $content= $request->content;
        $thumbnailPath = $request->thumbnail;
       //dd($request);
        //dd(isset($thumbnailPath));
        //サムネイル格納
        if(!isset($thumbnailPath)){
            $thumbnailPath ='<img src="/userfiles/images/noImage.png" alt="">';
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
            'author_id'=>Auth::id(),
            'excerpt'=>$request->excerpt,
            'keywords'=>$request->keywords,
            'category'=>$request->category,
            'tag'=>$request->tag,
            'published_at'=>$publish_at,
            'thumbnail'=> $thumbnailPath,
            'is_show'=>$request->is_show,
            'is_top'=>$request->is_top,
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

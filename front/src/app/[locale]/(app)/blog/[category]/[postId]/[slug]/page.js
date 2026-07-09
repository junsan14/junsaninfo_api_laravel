import PostContent from "@/components/posts/PostContent"
import { fetchPost } from "@/lib/postAPI"

export default async function Page({params,searchParams}) {
  const { category, postId,slug } = await params
  const isPreview = searchParams?.preview === "true"
  const {post} = await fetchPost(category, postId, slug)
  return(
    <>
      <PostContent category={category} postId={postId} slug={slug} initialPost={post} is_preview={isPreview}/>
    </>
  )
}

export async function generateMetadata({ params }) {
  const { category, postId } = await params
  const {post,error} = await fetchPost(category,postId)
  if (error || !post) {
    return {
      title: 'junsan14｜記事が見つかりません',
    }
  }
  const matches = [...(post.thumbnail?.matchAll(/<img[^>]+src="([^">]+)"/g) || [])]
  const urls = matches.map(match => match[1])

  return {
    title: !error && `junsan14｜${post.title}`,
    description: post.excerpt ?? 'JICA海外協力隊としての活動記録。',
    keywords: post.keywords ?? 'ルワンダ, 海外協力隊, JICA, JOCV,協力隊,地方生活,ルワンダ, 海外協力隊,',
    openGraph: {
      images: [urls[0]],
    },
    twitter: {
      card: 'summary',
      title: `junsan14｜${post.title}`,
      images: [urls[0]],
    },
  }
}



  







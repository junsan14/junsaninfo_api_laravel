'use client'
import { useSearchParams } from 'next/navigation'
import BlogEditor from '@/components/posts/BlogEditor'
import { useEffect,useState } from 'react'

export default function EditBlog(){
    const searchParams = useSearchParams()
    const postId = searchParams.get('postid') // ← ここで取得
      const [data, setData] = useState(null)
      const [error, setError] = useState(null)
      const [loading, setLoading] = useState(true)
      useEffect(() => {
    if (!postId) return

    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/blog/post/edit?postid=${postId}`, {
          cache: 'no-store', // ← 強制的にキャッシュ使わない（Vercel環境でも有効）
        })
        if (!res.ok) throw new Error('Fetch error')
        const json = await res.json()
        setData(json)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [postId])

      if (error) return <div>Error loading post</div>
      if (loading || !data) return <div>Loading...</div> 
        //console.log(data)
    return(
        <section className="section wrap blogEditor">
            <h1 className="section_title">
                <p className="section_title_jp">EDIT</p>
            </h1>
            <BlogEditor postData={data} /> *
        </section>
    )
}
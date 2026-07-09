'use client'
import useSWR from 'swr'
//import BlogEditor from '@/components/BlogEditor'
import BlogEditor from '@/components/posts/BlogEditor'

const fetcher = (url) =>
    fetch(url, {
      credentials: 'include',
    }).then((res) => {
      if (!res.ok) throw new Error('認証エラー')
      return res.json()
    })

export default function Create(){   

    const { data } = useSWR(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/blog/post/create`, fetcher)

    if (!data) return <p>読み込み中...</p>
    return(
        <>
            <section className="section wrap blogEditor">
                <h1 className="section_title">
                    <div className="section_title_jp">NEW POST</div>
                </h1>
                {/* <BlogEditor postData={data}/>  */}
                 <BlogEditor postData={data}/>
            </section>
        </>                
    )
}


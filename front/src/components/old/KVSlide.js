'use client'
import Image from 'next/image'
import {useEffect, useState } from 'react'
import clsx from 'clsx'


export function KVSlide (){

    function ChangeKv (){
            const imageList = [
                "/kvs/9.jpeg", "/kvs/10.jpeg", "/kvs/11.jpeg", "/kvs/12.jpeg",
                "/kvs/13.jpeg", "/kvs/14.jpeg", "/kvs/15.jpeg", "/kvs/16.jpeg",
                "/kvs/17.jpeg", "/kvs/18.jpeg", "/kvs/19.jpeg", "/kvs/20.jpeg"
            ]
        
            // 最初のランダムインデックスを設定
            const [currentIndex, setCurrentIndex] = useState(0)
            const [fade, setFade] = useState(false)
        
            useEffect(() => {
                // クライアントサイドで画像をランダムに決定
                setCurrentIndex(Math.floor(Math.random() * imageList.length))
        
                const interval = setInterval(() => {
                    setFade(true) // フェードアウト開始
        
                    setTimeout(() => {
                        // 新しい画像をランダムに選択
                        setCurrentIndex(Math.floor(Math.random() * imageList.length))
                        setFade(false) // フェードイン
                    }, 500) // 500ms後に画像を切り替え
        
                }, 4000) // 4000msごとに画像を変更
        
                return () => clearInterval(interval)
            }, [])
        
            if (currentIndex === null) {
                return <div>Loading...</div> // クライアントサイドで画像を設定するまで表示
            }
    
            return (
                <>
                <Image
                    src={imageList[currentIndex]}
                    alt=""
                    priority
                    width={325}
                    height={325}
                    className={clsx(
                    'object-cover transition-opacity duration-500',
                    fade ? 'opacity-0' : 'opacity-100'
                    )}
                />
                </>
            )
    }

    return(
        <div className='kvs'>
            <div className='kvs_mask'>
                <div className='kvs_item' id="kvs_item1">
                    <Image src="/kvs/1.jpeg" width={325} height={325} alt='' className='js-kvs_item_src'/>
                </div>
                <div className='kvs_item' id="kvs_item2">
                    <Image src="/kvs/2.jpeg" width={325} height={325} alt='' className='js-kvs_item_src'/>
                </div>
                <div className='kvs_item' id="kvs_item3">
                    <Image src="/kvs/3.jpeg" width={650} height={650} alt='' className='js-kvs_item_src'/>
                </div>
                <div className='kvs_item' id="kvs_item4">
                    <Image src="/kvs/4.jpeg" width={325} height={325} alt='' className='js-kvs_item_src'/>
                </div>
                <div className='kvs_item' id="kvs_item5">
                    <Image src="/kvs/5.jpeg" width={650} height={650} alt='' className='js-kvs_item_src'/>
                </div>
                <div className='kvs_item' id="kvs_item6">
                    <ChangeKv/>
                </div>
                <div className='kvs_item' id="kvs_item7">
                    <Image src="/kvs/4.jpeg" width={325} height={325} alt='' className='js-kvs_item_src'/>
                </div>
                <div className='kvs_item' id="kvs_item8">
                    <ChangeKv/>
                </div>
                <div className='kvs_item' id="kvs_item9">
                    <Image src="/kvs/7.jpeg" width={325} height={325} alt='' className='js-kvs_item_src'/>
                </div>
                <div className='kvs_item' id="kvs_item10">
                    <Image src="/kvs/8.jpeg" width={325} height={325} alt='' className='js-kvs_item_src'/>
                </div>
            </div>
            <div className='kvs_title'>
                <h1>JUNSAN14 <br />WEB ENGINEER</h1>
            </div>
        </div>
    )

    
}
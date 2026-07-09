// components/HtmlWithImage.tsx
'use client'

import parse from 'html-react-parser'
import Image from 'next/image'
const options = {
        replace: (domNode) => {
          if (domNode.name === 'img') {
            const { src } = domNode.attribs
            return (
              <Image
                src={src?src:`${process.env.NEXT_PUBLIC_BACKEND_URL}/userfiles/images/noImage.png`}
                width={640}
                height={640}
                className="posts_item_link_image_src"
                alt="画像"
                //style={{ aspectRatio: `${width || 640} / ${height || 640}` }}
              />
            )
          }
        },
}
const ConvertCKEditorImageToNextImage = ({ imagePath }) => {
  return (
    <>
      {parse(imagePath, options)}
    </>
  )
}

export default ConvertCKEditorImageToNextImage

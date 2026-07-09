import { useEffect, useState } from 'react'

const Toc = () => {
  const [headings, setHeadings] = useState([])

  useEffect(() => {
    const content = document.querySelector('.post_content')
    if (!content) return

    const h2Elements = Array.from(content.querySelectorAll('h2'))

    const newHeadings = h2Elements.map((el, index) => {
      const id = `section-${index}`
      el.id = id
      return {
        id,
        text: el.textContent || `セクション${index + 1}`,
      }
    })

    setHeadings(newHeadings)
  }, [])

  const handleClick = (e, id) => {
    e.preventDefault()
    const target = document.getElementById(id)
    if (target) {
      const offset = 80 // ヘッダーの高さ
      const elementPosition = target.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
  }

  if (headings.length === 0) return null

  return (
    <div className="toc-wrapper">
      <p className="toc-title">目次</p>
      <ul className="toc">
        {headings.map((heading) => (
          <li key={heading.id} className="toc-item">
            <a
              href={`#${heading.id}`}
              onClick={(e) => handleClick(e, heading.id)}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Toc

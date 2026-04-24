'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { getPostsByTags } from '@/actions/gelbooru'
import Image from 'next/image'

function useColumnCount() {
  const [cols, setCols] = useState(5)

  useEffect(() => {
    const updateCols = () => {
      if (window.innerWidth < 768) setCols(2)
      else if (window.innerWidth < 1024) setCols(3)
      else if (window.innerWidth < 1280) setCols(4)
      else setCols(5)
    }
    updateCols()
    window.addEventListener('resize', updateCols)
    return () => window.removeEventListener('resize', updateCols)
  }, [])

  return cols
}

export default function ImageGrid({ initialPosts, tags }: { initialPosts: any[]; tags: string }) {
  const [posts, setPosts] = useState(initialPosts)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const cols = useColumnCount()

  // 🧠 The Smart Masonry Calculation
  const columns = useMemo(() => {
    const colArrays: any[][] = Array.from({ length: cols }, () => [])
    const colHeights = Array(cols).fill(0)

    posts.forEach((post) => {
      // 1. Find the column that is currently the shortest
      const shortestColIdx = colHeights.indexOf(Math.min(...colHeights))

      // 2. Put the image in that column
      colArrays[shortestColIdx].push(post)

      // 3. Add the image's aspect ratio (height / width) to that column's total height tracker
      const aspectRatio = post.height / post.width
      colHeights[shortestColIdx] += aspectRatio
    })

    return colArrays
  }, [posts, cols])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          setPage((prev) => prev + 1)
        }
      },
      {
        rootMargin: '2000px',
      }
    )
    if (sentinelRef.current) observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [loading, hasMore])

  useEffect(() => {
    if (page === 0) return
    setLoading(true)
    getPostsByTags(tags, page).then((newPosts) => {
      if (newPosts && newPosts.length > 0) {
        setPosts((prev) => [...prev, ...newPosts])
      } else {
        setHasMore(false)
      }
      setLoading(false)
    })
  }, [page, tags])

  return (
    <>
      <div className={`grid gap-1 p-1`} style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {columns.map((col, i) => (
          <div key={i} className='flex flex-col gap-1'>
            {col.map((post: any) => (
              <Image key={post.id} src={post.preview_url} alt={post.tags} width={post.width} height={post.height} className='w-full select-none' />
            ))}
          </div>
        ))}
      </div>
      <div ref={sentinelRef} className='h-1' />
      {loading && hasMore && <p className='text-center py-4 text-muted-foreground'>Loading more...</p>}
      {!hasMore && <p className='text-center py-4 text-muted-foreground'>No more posts</p>}
    </>
  )
}

'use client'

import { useScrollDirection } from '@/hooks/useScrollDirection'
import SearchBar from './SearchBar'
import Settings from './Settings'
import { Button } from './ui/button'
import { Sparkles, Zap } from 'lucide-react'
import { useActions, usePage } from '@/hooks/useAppStore'
import { get10xPostsByTags } from '@/actions/gelbooru'
import { useSearchParams } from 'next/navigation'

export default function Header() {
  const searchParams = useSearchParams()
  const tags = searchParams.get('tags') ?? ''
  const page = usePage()

  const hidden = useScrollDirection()
  const { toggleChat, addPosts, setPage } = useActions()

  return (
    <header
      className={`sticky top-0 z-50 flex items-center justify-between p-4 bg-background/80 backdrop-blur transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
      ${hidden ? '-translate-y-full' : 'translate-y-0'}`}
    >
      <SearchBar />
      <div className='flex gap-2'>
        <Button
          variant='outline'
          onClick={async () => {
            const results = await get10xPostsByTags(tags, page + 1)
            addPosts(results.post)
            setPage(page + 10)
          }}
        >
          <span className='sm:block hidden'>Fetch 1000 images</span>
          <Zap size={20} />
        </Button>
        <Button variant='outline' onClick={toggleChat}>
          <Sparkles size={20} />
        </Button>
        <Settings />
      </div>
    </header>
  )
}

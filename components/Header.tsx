'use client'

import { useScrollDirection } from '@/hooks/useScrollDirection'
import SearchBar from './SearchBar'
import Settings from './Settings'

export default function Header() {
  const hidden = useScrollDirection()

  return (
    <header
      className={`sticky top-0 z-50 flex items-center justify-between p-4 bg-background/80 backdrop-blur transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
      ${hidden ? '-translate-y-full' : 'translate-y-0'}`}
    >
      <SearchBar />
      <Settings />
    </header>
  )
}

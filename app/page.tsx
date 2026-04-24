import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import SearchResults from '@/components/SearchResults'
export default function Home() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <SearchResults tags='blue_hair animated solo rating:g' />
    </Suspense>
  )
}
function LoadingSkeleton() {
  return (
    <div className='grid grid-cols-4 gap-1'>
      {Array.from({ length: 100 }).map((_, i) => (
        <Skeleton key={i} className={`h-100 w-full rounded-none`} />
      ))}
    </div>
  )
}

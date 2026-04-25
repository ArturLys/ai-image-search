import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import SearchResults from '@/components/SearchResults'

export default async function Home({ searchParams }: { searchParams: { tags?: string } }) {
  const params = await searchParams
  return (
    <Suspense key={params.tags} fallback={<LoadingSkeleton />}>
      <SearchResults tags={params.tags ?? ''} />
    </Suspense>
  )
}
function LoadingSkeleton() {
  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1'>
      {Array.from({ length: 100 }).map((_, i) => (
        <Skeleton key={i} className={`h-100 w-full rounded-none`} />
      ))}
    </div>
  )
}

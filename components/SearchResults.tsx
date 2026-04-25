import { getPostsByTags } from '@/actions/gelbooru'
import ImageGrid from './ImageGrid'
import { prisma } from '@/prisma/prisma'

export default async function SearchResults({ tags }: { tags: string }) {
  const dbSettings = await prisma.settings.findUnique({ where: { id: 1 } })
  const isSfw = dbSettings?.sfw ?? true
  const blacklist = dbSettings?.blacklist ?? ''

  const invertedBlacklist = blacklist
    .split(' ')
    .filter(Boolean)
    .map((tag) => `-${tag}`)

  const combinedTags = [tags, isSfw ? 'rating:g' : null, ...invertedBlacklist].filter(Boolean).join(' ')

  const initialPosts = await getPostsByTags(combinedTags)
  return <ImageGrid initialPosts={initialPosts.post ?? []} tags={combinedTags} totalPosts={initialPosts.total_posts} />
}

import { getPostsByTags, getFilteredTags } from '@/actions/gelbooru'
import ImageGrid from './ImageGrid'

export default async function SearchResults({ tags }: { tags: string }) {
  const combinedTags = await getFilteredTags(tags)
  const initialPosts = await getPostsByTags(combinedTags)

  return <ImageGrid initialPosts={initialPosts.post ?? []} tags={combinedTags} totalPosts={initialPosts.total_posts} />
}

import { getPostsByTags } from '@/actions/gelbooru'
import ImageGrid from './ImageGrid'

export default async function SearchResults({ tags }: { tags: string }) {
  const initialPosts = await getPostsByTags(tags)
  return <ImageGrid initialPosts={initialPosts} tags={tags} />
}

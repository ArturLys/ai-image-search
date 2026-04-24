'use server'

const url = `https://gelbooru.com/index.php?page=dapi&s=post&q=index&json=1${process.env.GELBOORU_CREDENTIALS}`

export const getPostsByTags = async (tags: string, page: number = 0) => {
  const res = await fetch(`${url}&tags=${tags}&limit=100&pid=${page}`)
  const json = await res.json()
  if (json.posts?.length === 0) return null
  return json.post
}

'use server'

const url = `https://gelbooru.com/index.php?page=dapi&s=post&q=index&json=1${process.env.GELBOORU_CREDENTIALS}`
export interface GelbooruPost {
  id: number
  created_at: string
  score: number
  width: number
  height: number
  md5: string
  directory: string
  image: string
  rating: string
  source: string
  change: number
  owner: string
  creator_id: number
  parent_id: number
  sample: number
  preview_height: number
  preview_width: number
  tags: string
  title: string
  has_notes: string
  has_comments: string
  file_url: string
  preview_url: string
  sample_url: string
  sample_height: number
  sample_width: number
  status: string
  post_locked: number
  has_children: string
}

export interface GelbooruResponse {
  post: GelbooruPost[]
  total_posts: number
}

interface RawGelbooruResponse {
  '@attributes'?: {
    limit: number
    offset: number
    count: number
  }
  post?: GelbooruPost[]
}

export const getPostsByTags = async (tags: string, page: number = 0): Promise<GelbooruResponse> => {
  const res = await fetch(`${url}&tags=${tags}&limit=100&pid=${page}`)
  const json = (await res.json()) as RawGelbooruResponse
  
  return {
    post: json.post ?? [],
    total_posts: json['@attributes']?.count ?? 0
  }
}

/*'@attributes': { limit: 100, offset: 0, count: 144310 },

id: 13930188,
      created_at: 'Fri Apr 24 01:29:04 -0500 2026',
      score: 5,
      width: 1440,
      height: 1080,
      md5: '74d2c99749c6a57a476b437744b45f4d',
      directory: '74/d2',
      image: '74d2c99749c6a57a476b437744b45f4d.webm',
      rating: 'general',
      source: 'Tenshi no Shippo EP.9',
      change: 1777012144,
      owner: 'kevinyu274',
      creator_id: 439798,
      parent_id: 0,
      sample: 0,
      preview_height: 262,
      preview_width: 350,
      tags: 
        '00s 1girl absurdres air_bubble animated aqua_hair bikini blue_hair breasts bubble diving female_focus highres inko_no_tsubasa medium_breasts pool poolside red_bikini short_hair solo submerged swimsuit tagme tenshi_no_shippo underwater video yellow_eyes',
      title: '',
      has_notes: 'false',
      has_comments: 'false',
      file_url: 
        'https://video-cdn4.gelbooru.com/images/74/d2/74d2c99749c6a57a476b437744b45f4d.mp4',
      preview_url: 
        'https://gelbooru.com/thumbnails/74/d2/thumbnail_74d2c99749c6a57a476b437744b45f4d.jpg',
      sample_url: '',
      sample_height: 0,
      sample_width: 0,
      status: 'active',
      post_locked: 0,
      has_children: 'false' 
*/

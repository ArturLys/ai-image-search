'use client'

import Form from 'next/form'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useSearchParams } from 'next/navigation'

export default function SearchBar() {
  const searchParams = useSearchParams()

  return (
    <Form action='/' className='flex gap-2 w-1/2'>
      <Input name='tags' id='search-bar' placeholder='tags' defaultValue={searchParams.get('tags') ?? ''} />
      <Button variant='outline' type='submit'>
        Search
      </Button>
    </Form>
  )
}

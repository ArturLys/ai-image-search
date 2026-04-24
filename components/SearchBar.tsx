import { Button } from './ui/button'
import { Input } from './ui/input'

export default function SearchBar() {
  return (
    <div className='flex gap-2 w-1/2'>
      <Input id='search-bar' placeholder='tags' />
      <Button variant='outline'>Search</Button>
    </div>
  )
}

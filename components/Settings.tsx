import { Menu, X } from 'lucide-react'
import { Button } from './ui/button'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from './ui/drawer'
import { ThemeDropdown } from './ThemeDropdown'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from './ui/input'

export default function Settings() {
  return (
    <Drawer direction='right'>
      <DrawerTrigger asChild>
        <Button variant='outline'>
          <Menu />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className='absolute right-3 top-3'>
          <DrawerClose asChild>
            <Button variant='secondary' size='icon'>
              <X />
            </Button>
          </DrawerClose>
        </div>
        <DrawerHeader>
          <DrawerTitle>Settings</DrawerTitle>
        </DrawerHeader>
        <div className='flex flex-col px-4 gap-3'>
          <div className='flex items-center gap-2'>
            <ThemeDropdown />
            <label htmlFor='theme'>Theme</label>
          </div>
          <div className='flex items-center gap-2'>
            <Checkbox id='sfw' />
            <label htmlFor='sfw'>Only SFW</label>
          </div>
          <div className='flex items-center gap-2'>
            <Input id='blacklist' placeholder='tags' />
            <label htmlFor='blacklist'>Blacklisted tags</label>
          </div>
        </div>
        <DrawerFooter>
          <Button>Submit</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

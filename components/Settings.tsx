'use client'

import { Menu, X } from 'lucide-react'
import { Button } from './ui/button'
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from './ui/drawer'
import { ThemeDropdown } from './ThemeDropdown'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from './ui/input'
import { useSfw, useBlacklist, useHistory, useActions, useModel } from '@/hooks/useAppStore'
import Link from 'next/link'
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'
import ModelDropdown from './ModelDropdown'

export default function Settings() {
  const sfw = useSfw()
  const blacklist = useBlacklist()
  const history = useHistory()
  const model = useModel()
  const { setSfw, setBlacklist, clearHistory, setModel } = useActions()

  return (
    <Drawer direction='right'>
      <DrawerTrigger asChild>
        <Button variant='outline'>
          <Menu />
        </Button>
      </DrawerTrigger>
      <DrawerContent id='settings-drawer'>
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
        <div className='flex flex-col px-4 gap-5'>
          <div className='flex items-center gap-2'>
            <ThemeDropdown containerId='settings-drawer' />
            <label htmlFor='theme'>Theme</label>
          </div>
          <div className='flex flex-col gap-2'>
            <label>AI Model</label>
            <ModelDropdown containerId='settings-drawer' />
          </div>
          <div className='flex items-center gap-2'>
            <Checkbox id='sfw' onCheckedChange={(checked) => setSfw(checked)} checked={sfw} />
            <label htmlFor='sfw'>Only SFW</label>
          </div>
          <div className='flex flex-col gap-2'>
            <label htmlFor='blacklist'>Blacklisted tags</label>
            <Input id='blacklist' placeholder='tags' value={blacklist} onChange={(e) => setBlacklist(e.target.value)} />
          </div>
          <div className='flex flex-col gap-2'>
            <label htmlFor='history'>Past searches</label>
            <Button variant='destructive' onClick={clearHistory}>
              Clear
            </Button>
            <div className='flex flex-col gap-1 py-2'>
              {history.map((item, index) => (
                <DrawerClose asChild key={index}>
                  <Link
                    href={`/?tags=${encodeURIComponent(item.query)}`}
                    className='flex flex-row justify-between gap-2 hover:bg-muted px-2 py-1.5 rounded-md transition-colors cursor-pointer text-sm items-center'
                  >
                    <p className='truncate flex-1' title={item.query}>
                      {item.query}
                    </p>
                    <span className='text-muted-foreground text-xs bg-muted-foreground/10 px-2 py-0.5 rounded-full'>{item.results}</span>
                  </Link>
                </DrawerClose>
              ))}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

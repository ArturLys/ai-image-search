'use client'

import { useActions, useModel } from '@/hooks/useAppStore'
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Button } from './ui/button'
import { ChevronDown } from 'lucide-react'
import React from 'react'

export default function ModelDropdown({ containerId }: { containerId?: string }) {
  const model = useModel()
  const { setModel } = useActions()

  const [container, setContainer] = React.useState<HTMLElement | null>(null)

  React.useEffect(() => {
    if (containerId) {
      setContainer(document.getElementById(containerId))
    }
  }, [containerId])

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <Button variant='outline' className='w-full justify-between'>
          <span className='truncate'>{model}</span>
          <ChevronDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent container={container} className='w-200px'>
        <DropdownMenuRadioGroup value={model} onValueChange={setModel}>
          <DropdownMenuRadioItem value='gemini-3.1-flash-lite-preview'>Flash Lite 3.1</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value='gemini-3-flash-preview'>Flash 3.0</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value='gemini-2.5-flash'>Flash 2.5</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

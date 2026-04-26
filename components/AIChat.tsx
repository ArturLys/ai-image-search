'use client'
import { useEffect, useRef, useState } from 'react'
import { useActions, useChatHistory, useDisplayHistory, useIsChatOpen, useModel, usePosts, useSelectedImages } from '@/hooks/useAppStore'
import { Button } from './ui/button'
import { ImageIcon, Loader2, Trash2, X } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function AIChat() {
  const { toggleChat } = useActions()
  const isChatOpen = useIsChatOpen()
  const searchParams = useSearchParams()
  const tags = searchParams.get('tags') ?? ''
  const posts = usePosts()
  const model = useModel()
  const chatHistory = useChatHistory()
  const displayHistory = useDisplayHistory()
  const selectedImages = useSelectedImages()
  const { clearSelectedImages, addChatMessage, clearChatHistory } = useActions()

  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pendingMessage, setPendingMessage] = useState<string | null>(null)

  // Track which post IDs and selected IDs the AI has already seen
  const sentPostIdsRef = useRef<Set<number>>(new Set())
  const sentSelectedIdsRef = useRef<Set<number>>(new Set())

  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [displayHistory, isLoading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userInput = input
    setPendingMessage(userInput)
    setInput('')
    setIsLoading(true)
    setError(null)

    try {
      // Compute delta: which posts are NEW (not yet sent to AI)
      const newPosts = posts.filter((p) => !sentPostIdsRef.current.has(p.id))

      // Compute selected delta: which selected images are NEW
      const currentSelectedIds = new Set(selectedImages.map((p) => p.id))
      const prevSelectedIds = sentSelectedIdsRef.current
      const selectedChanged =
        currentSelectedIds.size !== prevSelectedIds.size ||
        [...currentSelectedIds].some((id) => !prevSelectedIds.has(id))

      // Build context object — only include what's new
      const hasNewResults = newPosts.length > 0
      const hasNewSelected = selectedChanged && selectedImages.length > 0

      const context =
        hasNewResults || hasNewSelected
          ? {
              tags,
              results: hasNewResults
                ? newPosts.map((p) => ({ id: p.id, tags: p.tags, score: p.score }))
                : undefined,
              selected: hasNewSelected
                ? selectedImages.map((p) => ({ id: p.id, tags: p.tags, score: p.score }))
                : undefined,
            }
          : undefined

      const res = await fetch('/api/gemini', {
        method: 'POST',
        body: JSON.stringify({ prompt: userInput, model, history: chatHistory, context }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'AI Error')

      // Update tracking refs AFTER successful response
      if (hasNewResults) {
        newPosts.forEach((p) => sentPostIdsRef.current.add(p.id))
      }
      if (hasNewSelected) {
        sentSelectedIdsRef.current = new Set(selectedImages.map((p) => p.id))
      }

      // Store full prompt in chatHistory (for Gemini memory), display text in displayHistory (for UI)
      addChatMessage(
        { role: 'user', parts: [{ text: data.fullPrompt }] },
        userInput
      )
      addChatMessage(
        { role: 'model', parts: [{ text: data.text }] },
        data.text
      )
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
      setPendingMessage(null)
    }
  }

  return (
    <main
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-3xl z-50 bg-background/80 backdrop-blur-md border border-border shadow-2xl rounded-2xl flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${isChatOpen ? 'opacity-100 translate-y-0 visible h-auto' : 'opacity-0 scale-97 translate-y-8 transform-none invisible pointer-events-none'}`}
    >
      <div className='flex items-center justify-between p-4 border-b border-border/50 bg-muted/30'>
        <div className='flex gap-4 items-center'>
          <h1 className='text-sm font-semibold tracking-tight select-none'>AI Assistant</h1>
          {selectedImages.length > 0 && (
            <div className='flex gap-0 items-center'>
              <Badge variant='secondary' className='flex gap-1.5 px-2.5 py-3 font-medium bg-background/50 border-border/50 group'>
                <ImageIcon size={12} className='text-primary' />
                <span className='text-primary font-bold'>{selectedImages.length}</span>
                <span className='text-[10px] uppercase tracking-wider text-muted-foreground font-bold'>
                  {selectedImages.length === 1 ? 'Image' : 'Images'}
                </span>
              </Badge>
              <Button variant='ghost' onClick={() => clearSelectedImages()} size='sm' className='cursor-pointer rounded-full'>
                clear
              </Button>
            </div>
          )}
        </div>
        <div className='flex gap-2 items-center'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => {
              clearChatHistory()
              sentPostIdsRef.current.clear()
              sentSelectedIdsRef.current.clear()
              setError(null)
            }}
            className='h-8 w-8 rounded-full'
            title='New Chat'
          >
            <Trash2 size={16} />
          </Button>
          <Button variant='ghost' onClick={toggleChat} size='icon' className='h-8 w-8 rounded-full'>
            <X size={16} />
          </Button>
        </div>
      </div>

      <div ref={scrollRef} className='flex-1 overflow-y-auto p-4 space-y-4 max-h-[60vh] scroll-smooth'>
        {displayHistory.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div
              className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted border border-border'}`}
            >
              <Markdown remarkPlugins={[remarkGfm]}>
                {msg.text.replace(/(?:id:)?(\d{7,10})\b|!\[img\]\((\d+)\)/g, (match, id1, id2) => {
                  const id = id1 || id2
                  const p = posts.find((x) => String(x.id) === id) || selectedImages.find((x) => String(x.id) === id)
                  return p ? `[![${p.tags.replace(/loli/gi, 'cute')}](${p.preview_url})](${p.file_url})` : match
                })}
              </Markdown>
            </div>
          </div>
        ))}
        {pendingMessage && (
          <div className='flex flex-col items-end'>
            <div className='max-w-[85%] px-3 py-2 rounded-2xl text-sm bg-primary text-primary-foreground'>
              {pendingMessage}
            </div>
          </div>
        )}
        {isLoading && (
          <div className='flex justify-start'>
            <Loader2 className='animate-spin text-muted-foreground' size={18} />
          </div>
        )}
        {error && <div className='p-2 text-xs text-destructive bg-destructive/10 rounded-lg border border-destructive/20'>{error}</div>}
      </div>

      <form onSubmit={handleSubmit} className='flex gap-2 p-4 pt-2'>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          className='flex-1 bg-background/50 focus-visible:ring-1 disabled:opacity-50'
          placeholder='Ask me anything...'
        />
        <Button type='submit' variant='outline' className='px-6' disabled={isLoading}>
          {isLoading ? <Loader2 className='animate-spin' size={18} /> : 'Ask'}
        </Button>
      </form>
    </main>
  )
}

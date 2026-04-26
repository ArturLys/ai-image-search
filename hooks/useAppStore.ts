import {
  addHistory as serverAddHistory,
  clearHistory as serverClearHistory,
  serverGetSettings,
  setBlacklist as serverSetBlacklist,
  setSfw as serverSetSfw,
} from '@/actions/settings'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { GelbooruPost } from '@/actions/gelbooru'

type Actions = {
  setSfw: (checked: boolean) => void
  setBlacklist: (blacklist: string) => void
  addHistory: (query: string, results: number) => void
  clearHistory: () => void
  hydrate: () => void
  toggleChat: () => void
  toggleSelectedImage: (post: GelbooruPost) => void
  clearSelectedImages: () => void
  setPosts: (posts: GelbooruPost[], total: number) => void
  addPosts: (posts: GelbooruPost[]) => void
  setPage: (page: number) => void
  setModel: (model: string) => void
  addChatMessage: (message: { role: 'user' | 'model'; parts: { text: string }[] }, displayText: string) => void
  clearChatHistory: () => void
}

type AppState = {
  sfw: boolean
  blacklist: string
  history: { query: string; results: number }[]
  isChatOpen: boolean
  actions: Actions
  selectedImages: GelbooruPost[]
  posts: GelbooruPost[]
  totalPosts: number
  page: number
  model: string
  chatHistory: { role: 'user' | 'model'; parts: { text: string }[] }[]
  displayHistory: { role: 'user' | 'model'; text: string }[]
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      sfw: true,
      blacklist: '',
      history: [],
      isChatOpen: false,
      selectedImages: [],
      posts: [],
      totalPosts: 0,
      page: 0,
      model: 'gemini-3.1-flash-lite-preview',
      chatHistory: [],
      displayHistory: [],

      actions: {
        hydrate: async () => {
          const settings = await serverGetSettings()
          set(settings)
        },
        setSfw: async (checked: boolean) => {
          set({ sfw: checked })
          await serverSetSfw(checked)
        },
        setBlacklist: async (blacklist: string) => {
          set({ blacklist })
          await serverSetBlacklist(blacklist)
        },
        addHistory: async (query: string, results: number) => {
          set((state) => {
            const filtered = state.history.filter((h) => h.query !== query)
            return { history: [{ query, results }, ...filtered] }
          })
          await serverAddHistory(query, results)
        },
        clearHistory: async () => {
          set({ history: [] })
          await serverClearHistory()
        },
        toggleChat: () => {
          set((state) => ({ isChatOpen: !state.isChatOpen }))
        },
        toggleSelectedImage: (post) => {
          set((state) => {
            const isSelected = state.selectedImages.some((img) => img.id === post.id)
            if (isSelected) {
              return { selectedImages: state.selectedImages.filter((img) => img.id !== post.id) }
            }
            return { selectedImages: [...state.selectedImages, post] }
          })
        },
        clearSelectedImages: () => {
          set({ selectedImages: [] })
        },
        setPosts: (posts, total) => {
          set({ posts, totalPosts: total, page: 0 })
        },
        addPosts: (newPosts) => {
          set((state) => {
            const existingIds = new Set(state.posts.map((p) => p.id))
            const uniqueNewPosts = newPosts.filter((p) => !existingIds.has(p.id))
            return { posts: [...state.posts, ...uniqueNewPosts] }
          })
        },
        setPage: (page) => {
          set({ page })
        },
        setModel: (model) => {
          set({ model })
        },
        addChatMessage: (message, displayText) => {
          set((state) => ({
            chatHistory: [...state.chatHistory, message],
            displayHistory: [...state.displayHistory, { role: message.role, text: displayText }],
          }))
        },
        clearChatHistory: () => {
          set({ chatHistory: [], displayHistory: [] })
        },
      },
    }),
    {
      name: 'app-storage',
      partialize: ({ actions, posts, totalPosts, page, ...rest }) => rest,
      onRehydrateStorage: () => (state) => {
        state?.actions.hydrate()
      },
    }
  )
)

export const useSfw = () => useAppStore((state) => state.sfw)
export const useBlacklist = () => useAppStore((state) => state.blacklist)
export const useHistory = () => useAppStore((state) => state.history)
export const useIsChatOpen = () => useAppStore((state) => state.isChatOpen)
export const useSelectedImages = () => useAppStore((state) => state.selectedImages)
export const usePosts = () => useAppStore((state) => state.posts)
export const useTotalPosts = () => useAppStore((state) => state.totalPosts)
export const usePage = () => useAppStore((state) => state.page)
export const useModel = () => useAppStore((state) => state.model)
export const useChatHistory = () => useAppStore((state) => state.chatHistory)
export const useDisplayHistory = () => useAppStore((state) => state.displayHistory)

export const useActions = () => useAppStore((state) => state.actions)

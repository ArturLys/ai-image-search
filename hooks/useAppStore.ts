import {
  addHistory as serverAddHistory,
  clearHistory as serverClearHistory,
  serverGetSettings,
  setBlacklist as serverSetBlacklist,
  setSfw as serverSetSfw,
} from '@/actions/settings'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Actions = {
  setSfw: (checked: boolean) => void
  setBlacklist: (blacklist: string) => void
  addHistory: (query: string, results: number) => void
  clearHistory: () => void
  hydrate: () => void
}

type AppState = {
  sfw: boolean
  blacklist: string
  history: { query: string; results: number }[]
  actions: Actions
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      sfw: true,
      blacklist: '',
      history: [],

      actions: {
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
        hydrate: async () => {
          const settings = await serverGetSettings()
          set(settings)
        },
      },
    }),
    {
      name: 'app-storage',
      partialize: ({ actions, ...rest }) => rest,
      onRehydrateStorage: () => (state) => {
        state?.actions.hydrate()
      },
    }
  )
)

export const useSfw = () => useAppStore((state) => state.sfw)
export const useBlacklist = () => useAppStore((state) => state.blacklist)
export const useHistory = () => useAppStore((state) => state.history)

export const useActions = () => useAppStore((state) => state.actions)

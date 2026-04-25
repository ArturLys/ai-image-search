'use server'

import { prisma } from '@/prisma/prisma'

export async function setSfw(checked: boolean) {
  await prisma.settings.upsert({
    where: { id: 1 },
    update: { sfw: checked },
    create: { id: 1, sfw: checked, blacklist: '' },
  })
}

export async function setBlacklist(tags: string) {
  await prisma.settings.upsert({
    where: { id: 1 },
    update: { blacklist: tags },
    create: { id: 1, sfw: true, blacklist: '' },
  })
}

export async function addHistory(query: string, results: number) {
  await prisma.searchHistory.deleteMany({ where: { query } })
  await prisma.searchHistory.create({ data: { query, results } })
}

export async function clearHistory() {
  await prisma.searchHistory.deleteMany()
}

export async function serverGetSettings() {
  const settings = await prisma.settings.findUnique({ where: { id: 1 } })
  const history = await prisma.searchHistory.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
  })
  return {
    sfw: settings?.sfw ?? true,
    blacklist: settings?.blacklist ?? '',
    history: history.map((h) => ({ query: h.query, results: h.results })),
  }
}

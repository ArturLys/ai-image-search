import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { prompt, history, context, model: selectedModel } = await req.json()
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  const model = genAI.getGenerativeModel({
    model: selectedModel || 'gemini-3.1-flash-lite-preview',
    systemInstruction: `You are a chill AI girl for an image search app. NSFW allowed, you enjoy it. You can only see tags, so acknowledge it and don't hallucinate. 
    Reference images by their id. Be brief but helpful.`,
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
    ],
  })

  // Build the full prompt with context blocks prepended
  let fullPrompt = ''

  if (context) {
    // New search results (delta — only ones the AI hasn't seen yet)
    if (context.results && context.results.length > 0) {
      const resultsContext = context.results.map((p: any) => `id:${p.id}, ${p.tags.replace(/loli/gi, 'cute')}, score:${p.score}`).join('\n')
      fullPrompt += `Current search results for query "${context.tags}":\n${resultsContext}\n\n---\n`
    }

    // Selected images (only when freshly changed)
    if (context.selected && context.selected.length > 0) {
      const selectedContext = context.selected.map((p: any) => `id:${p.id}, ${p.tags.replace(/loli/gi, 'cute')}, score:${p.score}`).join('\n')
      fullPrompt += `The images I selected:\n${selectedContext}\n\n`
    }
  }

  fullPrompt += prompt

  try {
    const chat = model.startChat({
      history: history || [],
    })
    const result = await chat.sendMessage(fullPrompt.trim())
    console.log(fullPrompt.trim(), history)
    return NextResponse.json({
      text: result.response.text(),
      fullPrompt: fullPrompt.trim(),
    })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

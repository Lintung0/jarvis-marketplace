"use server"

const API_KEY = process.env.OPENAI_API_KEY
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini"
const BASE_URL = "https://api.openai.com/v1/chat/completions"

function isConfigured(): boolean {
  return !!API_KEY
}

function apiNotConfiguredError(): never {
  throw new Error("OpenAI API key not configured. Set OPENAI_API_KEY in .env.local")
}

async function callOpenAI(systemPrompt: string, userPrompt: string): Promise<string> {
  if (!API_KEY) apiNotConfiguredError()

  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`OpenAI API error: ${res.status} ${err}`)
  }

  const json = await res.json()
  return json.choices?.[0]?.message?.content?.trim() ?? ""
}

export async function generateProductDescription(params: {
  title: string
  category?: string
  keywords?: string
  tone?: string
}): Promise<string> {
  const tone = params.tone || "professional"
  const systemPrompt = "Anda adalah ahli copywriter produk e-commerce. Hasilkan deskripsi produk yang menarik, informatif, dan dioptimalkan untuk konversi. Gunakan bahasa Indonesia yang baik dan benar."
  const userPrompt = [
    `Generate a compelling product description for "${params.title}" in ${tone} tone.`,
    params.category ? `Category: ${params.category}.` : "",
    params.keywords ? `Include keywords: ${params.keywords}.` : "",
    "Write in Indonesian. Format with proper paragraphs.",
  ].filter(Boolean).join(" ")

  return callOpenAI(systemPrompt, userPrompt)
}

export async function generateBlogPost(params: {
  title: string
  keywords?: string
  tone?: string
}): Promise<string> {
  const tone = params.tone || "professional"
  const systemPrompt = "Anda adalah penulis konten blog profesional. Hasilkan artikel blog yang informatif, menarik, dan terstruktur dengan baik. Gunakan bahasa Indonesia yang baik dan benar."
  const userPrompt = [
    `Write a blog post about "${params.title}" in ${tone} tone.`,
    params.keywords ? `Include keywords: ${params.keywords}.` : "",
    "Write in Indonesian. Format with proper paragraphs and headings.",
  ].filter(Boolean).join(" ")

  return callOpenAI(systemPrompt, userPrompt)
}

export async function generatePageContent(params: {
  title: string
  purpose: string
}): Promise<string> {
  const systemPrompt = "Anda adalah penulis konten profesional untuk website. Hasilkan konten halaman statis yang jelas, informatif, dan menarik. Gunakan bahasa Indonesia yang baik dan benar."
  const userPrompt = `Generate content for a page titled "${params.title}". Purpose: ${params.purpose}. Write in Indonesian. Format with proper paragraphs.`

  return callOpenAI(systemPrompt, userPrompt)
}

export async function suggestTags(params: {
  title: string
  description?: string
}): Promise<string[]> {
  const systemPrompt = "Anda adalah asisten yang membantu menyarankan tag untuk produk e-commerce. Berikan 5-10 tag yang relevan dalam bahasa Indonesia."
  const userPrompt = [
    `Suggest relevant tags for a product titled "${params.title}".`,
    params.description ? `Description: ${params.description}` : "",
    "Return ONLY a comma-separated list of tags, nothing else.",
  ].filter(Boolean).join(" ")

  const result = await callOpenAI(systemPrompt, userPrompt)
  return result.split(",").map((t) => t.trim()).filter(Boolean)
}

export async function checkOpenAIConfig(): Promise<{ configured: boolean; model: string }> {
  return {
    configured: isConfigured(),
    model: isConfigured() ? MODEL : "",
  }
}

import * as fs from 'fs'

export interface LLMResponse {
  content: string
}

export interface LLMConfig {
  baseUrl: string
  model: string
  apiKey: string
}

export function loadLLMConfig(): LLMConfig {
  const baseUrl = process.env.LLM_BASE_URL
  const model = process.env.LLM_MODEL
  const apiKey = process.env.OPENROUTER_API_KEY

  if (!baseUrl) {
    process.stderr.write('Error: LLM_BASE_URL environment variable is not set\n')
    process.exit(1)
  }
  if (!model) {
    process.stderr.write('Error: LLM_MODEL environment variable is not set\n')
    process.exit(1)
  }
  if (!apiKey) {
    process.stderr.write('Error: OPENROUTER_API_KEY environment variable is not set\n')
    process.exit(1)
  }

  return { baseUrl, model, apiKey }
}

export async function generateChangelog(commits: { sha: string; message: string; date: string; author: string }[], config: LLMConfig): Promise<string> {
  const prompt = buildPrompt(commits)

  const response = await fetch(config.baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`
    },
    body: JSON.stringify({
      model: config.model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 1000
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    process.stderr.write(`Error: LLM API request failed with status ${response.status}\n`)
    process.stderr.write(`Response: ${errorText}\n`)
    process.exit(1)
  }

  const data = await response.json()
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    process.stderr.write('Error: Unexpected LLM response format\n')
    process.exit(1)
  }

  return data.choices[0].message.content
}

function buildPrompt(commits: { sha: string; message: string; date: string; author: string }[]): string {
  const commitStrings = commits.map((c, i) => `${i + 1}. ${c.message} (${c.author})`).join('\n')

  return `You are a technical writer generating a semantic changelog. 

Generate a CHANGELOG.md fragment in Markdown format with exactly these three categories:

### ✨ Features
### 🐛 Bug Fixes  
### ♻️ Refactors

Assign each commit to exactly one category based on its message. If a commit does not fit any category, place it under ♻️ Refactors.

Commits:
${commitStrings}

Output ONLY the Markdown fragment. Do not include any greetings, explanations, or additional text.`
}
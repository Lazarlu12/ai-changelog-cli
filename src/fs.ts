import * as fs from 'fs'
import * as path from 'path'

export interface ChangelogContent {
  existingContent: string
  writeContent: string
}

export async function readChangelogFile(changelogPath: string): Promise<string> {
  if (!fs.existsSync(changelogPath)) {
    return ''
  }
  return fs.readFileSync(changelogPath, 'utf-8')
}

export async function writeChangelogFile(changelogPath: string, content: string): Promise<void> {
  const dir = path.dirname(changelogPath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(changelogPath, content, 'utf-8')
}

export async function ensureDirectoryExistence(dirPath: string): Promise<void> {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}
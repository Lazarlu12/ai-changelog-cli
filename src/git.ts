export interface Commit {
  sha: string
  message: string
  date: string
  author: string
}

export interface GitInfo {
  currentBranch: string
  totalCommits: number
}

export async function getRecentCommits(limit: number): Promise<Commit[]> {
  const { execSync } = await import('child_process')
  try {
    const output = execSync(`git log --format="%H||%s||%ai||%an" --max-count=${limit}`).toString()
    const lines: string[] = output.trim().split('\n').filter((line) => line.length > 0)
    return lines.map((line): Commit => {
      const parts = line.split('||')
      return {
        sha: parts[0]!,
        message: parts[1]!.trim(),
        date: parts[2]!,
        author: parts[3]!.trim(),
      }
    })
  } catch (error) {
    throw new Error('Failed to fetch git commits')
  }
}

export async function getCurrentBranch(): Promise<string> {
  const { execSync } = await import('child_process')
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim()
  } catch (error) {
    throw new Error('Not a git repository')
  }
}

export async function getCommitsCount(): Promise<number> {
  const { execSync } = await import('child_process')
  try {
    return parseInt(execSync('git rev-list --count HEAD', { encoding: 'utf-8' }).trim(), 10)
  } catch (error) {
    throw new Error('Failed to count commits')
  }
}
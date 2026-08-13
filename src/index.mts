import { program } from 'commander'
import { getRecentCommits, getCurrentBranch, getCommitsCount } from './git.ts'
import { readChangelogFile, writeChangelogFile } from './fs.ts'
import { generateChangelog, loadLLMConfig } from './llm.ts'

program
  .name('changelog-gen')
  .description('CLI asistido por IA para generar release notes desde Git')
  .option('-o, --output <path>', 'Ruta de destino para el archivo CHANGELOG.md', 'CHANGELOG.md')
  .option('-m, --model <name>', 'Modelo de LLM a utilizar', process.env.LLM_MODEL || 'qwen/qwen-2.5-coder-32b-instruct:free')
  .parse()

const options = program.opts()

async function main() {
  console.log('🔍 Obteniendo rama actual...')
  const branch = await getCurrentBranch()
  console.log(`   Rama: ${branch}`)

  console.log('📝 Obteniendo commits recientes...')
  const limit = 50
  const commits = await getRecentCommits(limit)
  console.log(`   ${commits.length} commits obtenidos`)

  console.log('🤖 Cargando configuración LLM...')
  const config = loadLLMConfig()

  console.log('📡 Generando changelog con LLM...')
  const changelogContent = await generateChangelog(commits, config)

  console.log('💾 Escribiendo archivo CHANGELOG.md...')
  const defaultOutput = 'CHANGELOG.md'
  const outputPath = options.output || defaultOutput
  const existingContent = await readChangelogFile(outputPath)
  const finalContent = changelogContent + '\n\n' + existingContent
  await writeChangelogFile(outputPath, finalContent)

  console.log(`✅ CHANGELOG.md generado en: ${outputPath}`)
}

main().catch((error) => {
  process.stderr.write(`Error: ${error.message}\n`)
  process.exit(1)
})
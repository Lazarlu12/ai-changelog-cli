# Contrato Maestro (SPEC.md) - ai-changelog-cli

## 1. Visión General
Herramienta CLI construida en Node.js y TypeScript que analiza el historial de commits locales de un repositorio Git y, utilizando un LLM, genera un archivo `CHANGELOG.md` semántico agrupado por categorías.

## 2. Stack Tecnológico
- **Entorno:** Node.js (v18+ requerido para `fetch` nativo)
- **Lenguaje:** TypeScript (Strict Mode)
- **Gestor de paquetes:** pnpm
- **Dependencias Core:** `commander` (interfaz CLI), `simple-git` (operaciones Git), `dotenv` (gestión de variables de entorno)

## 3. Arquitectura del Proyecto
El código fuente residirá en `src/`:
- `src/index.ts`: Punto de entrada de la CLI, parseo de argumentos con commander y orquestación del flujo. Debe incluir feedback visual básico en consola (`console.log` o `stdout`) indicando el progreso.
- `src/git.ts`: Módulo de abstracción para git. **Requisito:** Debe obtener los commits desde el último tag de git. Si no hay tags, obtener los últimos 50 commits por defecto para evitar exceder los límites de tokens del LLM.
- `src/llm.ts`: Servicio de integración con la API del LLM utilizando `fetch` nativo de Node.js. Debe ser agnóstico y permitir configurar la URL base para soportar OpenRouter, Groq o OpenAI.
- `src/fs.ts` (Nuevo): Módulo para manejar la escritura en el sistema de archivos. **Requisito:** Si el archivo `CHANGELOG.md` ya existe, debe agregar el contenido nuevo en la parte superior (prepend) sin borrar el historial previo.

## 4. Interfaz CLI (Commander)
La herramienta debe soportar las siguientes opciones:
- `-o, --output <path>`: Ruta de destino (por defecto: `CHANGELOG.md`).
- `-m, --model <name>`: Modelo de LLM a utilizar (por defecto: el definido en variables de entorno o uno estándar).

## 5. Invariantes y Reglas Estrictas (Hard Constraints)
- **Cero Hardcoding:** No hardcodear API Keys ni Base URLs. Siempre consumir `process.env`.
- **Manejo de Errores Riguroso:** En caso de falla (ej. repositorio Git no inicializado, API Key faltante, error de red), imprimir un mensaje claro en `stderr` y finalizar con código de salida `1` (`process.exit(1)`).
- **Formato de Salida Obligatorio:** El prompt del sistema para el LLM debe forzar una salida estructurada en Markdown, omitiendo saludos o explicaciones. Categorías obligatorias: `### ✨ Features`, `### 🐛 Bug Fixes` y `### ♻️ Refactors`.
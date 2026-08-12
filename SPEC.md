# CLI: AI Changelog Generator

## Objetivo del Sistema
Crear una herramienta de interfaz de línea de comandos (CLI) en Node.js que analice el historial de commits local mediante Git y utilice la API de un LLM para generar un archivo `CHANGELOG.md` semántico y estructurado.

## Arquitectura y Stack
*   **Lenguaje:** TypeScript (Estricto).
*   **Gestor de Paquetes:** pnpm.
*   **Módulos principales:**
    *   `src/index.ts`: Punto de entrada del CLI (usando `commander`).
    *   `src/git.ts`: Servicio aislado para leer el historial de Git (usando `simple-git`).
    *   `src/llm.ts`: Servicio aislado para interactuar con la API del LLM (usando `dotenv` para claves).

## Invariantes y Reglas de Negocio (Core)
1.  **Ejecución:** El CLI se invocará con `pnpm start -- --days <numero>`.
2.  **Seguridad:** Las API Keys NUNCA deben estar harcodeadas. Deben leerse de un archivo `.env` (ignorado en git).
3.  **Manejo de Errores:** Si el directorio actual no es un repositorio Git, el CLI debe abortar con un mensaje amigable en consola y código de salida 1.
4.  **Formato de Salida:** El LLM debe devolver la información en formato Markdown, agrupada obligatoriamente en: `🚀 Features`, `🐛 Fixes`, y `🛠️ Refactors`.
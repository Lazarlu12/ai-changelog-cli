# Skill: Estándares de TypeScript

Cuando generes o refactorices código TypeScript en este proyecto, DEBES cumplir estrictamente las siguientes reglas:

1. **Tipado Fuerte:** Prohibido el uso de `any`. Usa genéricos o `unknown` si el tipo no es deducible.
2. **Inmutabilidad:** Prefiere `const` sobre `let`. No mutes arreglos u objetos, retorna nuevas copias para buenas prácticas.
3. **Manejo de Errores:** No uses `console.log` para errores. Utiliza bloques `try/catch` y lanza errores descriptivos (`throw new Error(...)`).
4. **Exportaciones Nombradas**: Todas las exportaciones deben ser nombradas (`export const`, `export interface`, etc.). Queda estrictamente prohibido el uso de `export default` para mantener consistencia en los imports y facilitar refactorizaciones.
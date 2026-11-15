# Agent Development Guidelines (AGENT.md)

These instructions govern all code generation, modifications, and system enhancements for the Green Electronics project. Every agent must strictly adhere to these principles.

---

## 1. Single Task Focus
- **One Objective per Session:** Focus exclusively on the single assigned task or phase.
- **No Scope Creep:** Do not introduce extra features, unrequested dependencies, speculative abstractions, or unsolicited aesthetic modifications.
- **Minimal Surface Area:** Keep diffs concise, strictly scoped to the target files, and free of extraneous comments or dead code.

---

## 2. Self-Documenting Code & Modularity
- **Explicit Naming:** Use clear, intention-revealing variable, function, and type names (e.g., `accumulatedScrollDelta`, `isKineticLockActive`, `computeVorticityConfinement`) instead of cryptic abbreviations.
- **Clean Architecture & Separation of Concerns:**
  - Logic must be modularized into dedicated hooks (e.g., `useFullpageNavigation`), shaders, and focused UI components.
  - Keep components small with single, well-defined responsibilities.
  - Maintain clear TypeScript interfaces for all component props, state objects, and shader uniforms.
- **Inline Architectural Context:** Include concise JSDoc/TSDoc blocks explaining *why* non-obvious algorithms exist (e.g., Jacobi Poisson relaxation passes or wheel momentum absorption), making future refactoring straightforward.

---

## 3. Source Code & Asset Protection (DevTools Hardening)
Protect production assets and intellectual property (such as WebGL2 shader pipelines and proprietary algorithms) against straightforward copying via browser DevTools:
- **Disable Production Source Maps:**
  - Ensure `productionBrowserSourceMaps: false` in `next.config.ts`.
  - Prevent raw TypeScript/TSX source exposure in the DevTools Sources tab.
- **Minification & Shader Compaction:**
  - Minify and inline GLSL shader sources into production bundles; avoid exposing raw `.glsl` files in the public directory.
- **Client-Side DevTools Defenses:**
  - Disable context menus on interactive canvases where appropriate (`onContextMenu={(e) => e.preventDefault()}`).
  - Suppress text/element inspection shortcuts on canvas presentation elements (`user-select: none; -webkit-touch-callout: none;`).
  - Strip internal debug loggers (`console.log`, `console.debug`) in production builds.

---

## 4. Verification & Clean Hand-off
- Every change must pass:
  1. `npm run lint` (zero warnings/errors).
  2. `npx tsc --noEmit` (strict type checking).
  3. `npm run build` (successful Turbopack/Next.js production compile).
- Do not mark a task complete until all verification checks pass.

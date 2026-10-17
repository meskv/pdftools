# PDF Tools
React + TypeScript + Vite. Everything runs in the browser; no backend.

    npm install
    npm run dev        # http://localhost:5173
    npm run build      # typecheck + production build in dist/

## Layout
- src/tools/*.ts: one file per tool (name, options, and its run/post function). Register it in src/tools/index.ts.
- src/engine/pdf.ts: shared PDF helpers (render, build, save) and libraries.
- src/workspace/: imperative page-grid and click-to-place editor, mounted by src/pages/ToolPage.tsx.
- src/components, src/pages: React UI (mega menu, home, tool page).
- public/CNAME: custom domain. .github/workflows/deploy.yml: auto-deploys main to GitHub Pages.

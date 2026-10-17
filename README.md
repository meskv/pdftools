# PDF Tools (static)
Pure HTML/CSS/JS. Upload this folder as-is to any static host (Cloudflare Pages, Netlify, GitHub Pages, S3, plain nginx).
Point pdftools.skverma.com at it with a CNAME/A record. No build step, no backend.

- style.css and common.js are shared by all pages.
- Each tool is its own .html file. Delete a tool by removing its file and its row in index.html.
- Libraries (pdf-lib, pdf.js, JSZip) load from cdnjs. To self-host later, download them and change the <script src> lines.

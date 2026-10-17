# PDF Tools (static)
Plain HTML/CSS/JS, no backend. Host on GitHub Pages, Netlify or Cloudflare Pages.
- tools.js and tools2.js: the tool lists. editor.js: the click-to-place editor (Edit, Sign, Redact, Crop). sw.js + manifest.json: offline install. app.js: the shared engine. style.css: the look.
- Add a tool: add an entry in tools.js, then `sed "s/@@/my-tool/" _template.html > my-tool.html`.
- Remove a tool: delete its entry in tools.js and its .html file.

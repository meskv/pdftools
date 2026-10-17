# PDF Tools (static)
Plain HTML/CSS/JS, no backend. Host on GitHub Pages, Netlify or Cloudflare Pages.
- tools.js: the tool list. app.js: the shared engine. style.css: the look.
- Add a tool: add an entry in tools.js, then `sed "s/@@/my-tool/" _template.html > my-tool.html`.
- Remove a tool: delete its entry in tools.js and its .html file.

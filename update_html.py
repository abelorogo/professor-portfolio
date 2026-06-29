from pathlib import Path
import re

root = Path(r'c:\Users\Administrator\Desktop\portfolio')
for path in root.glob('*.html'):
    text = path.read_text(encoding='utf-8')
    text = text.replace(
        'family=Inter:wght@300;400;600;800&family=Merriweather:wght@300;700&display=swap',
        'family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700&display=swap'
    )
    text = text.replace(
        '<a class="logo" href="home.html"><span>Abel</span> Orogo</a>',
        '<a class="logo" href="index.html"><span>Dr.</span> Abel Orogo</a>'
    )
    text = text.replace(
        '<a class="logo" href="index.html"><span>Abel</span> Orogo</a>',
        '<a class="logo" href="index.html"><span>Dr.</span> Abel Orogo</a>'
    )
    text = re.sub(
        r'</nav>\s*<button id="nav-toggle" aria-label="Toggle navigation">☰</button>',
        '</nav>\n        <div class="header-actions">\n          <button id="theme-toggle" class="theme-toggle" aria-label="Toggle theme" title="Switch to Light Mode">\n            <span class="theme-icon">🌙</span>\n            <span class="toggle-label">Dark</span>\n          </button>\n          <button id="nav-toggle" aria-label="Toggle navigation">☰</button>\n        </div>',
        text
    )
    path.write_text(text, encoding='utf-8')

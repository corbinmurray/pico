# pico

A minimal, production‑ready Markdown reading experience.  
Drop in any plain Markdown and `pico` renders it with Tailwindcss typography, tables,
code blocks, anchors, and right‑to‑left support. Editing is secondary –- the focus
is on clean, accessible UI/UX for reading content.

## Features

- Styled output via Tailwind Typography (`prose`, dark mode, RTL)
- Smart link handling (internal anchors, external in new tab, block relative URLs)
- Custom components: syntax‑highlighted codeblocks, responsive tables
- Safe – raw HTML is disabled, external links open with `noopener,noreferrer`
- Easy to embed in any React app (function component + simple props)
- Optional TOC/slug generation via `rehype-slug`
- Vite‑powered for fast dev/production builds

## Quickstart

```bash
# clone the repo
git clone https://github.com/yourusername/pico.git
cd pico

# install deps
npm install          # or yarn / pnpm

# run dev server
npm run dev
# open http://localhost:5173 and paste some Markdown
```

## Usage

Import the preview component and feed it a string:

```tsx
import { MarkdownPreview } from "@/components/MarkdownPreview";

function App() {
  const [md, setMd] = useState("# Hello world");

  return (
    <MarkdownPreview content={md} className="prose-lg" />
  );
}
```

Styling is controlled via Tailwind classes; the component already includes `prose` and them utilities -- you can add or override as needed.

## Development

- `npm run dev` – start Vite dev server
- `npm run build` – build for production
- `npm run preview` – preview production build
- `npm run lint` – run ESLint

> If you add new `.prose-` classes be sure to whitelist them in `tailwind.config.ts` so they aren't purged.

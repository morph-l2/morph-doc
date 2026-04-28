# AGENTS.md

Operating instructions for AI agents working in this repository. Loaded by **OpenClaw** when this directory is the agent workspace; use as the shared team handbook for other coding agents too.

**Claude Code** also reads [`CLAUDE.md`](./CLAUDE.md) at session start—project facts below are canonical for any tool.

## Project overview

This is the Morph Documentation website (Docusaurus 3.1.1). Morph is an optimistic zkEVM scaling solution for Ethereum. The site provides developer resources, guides, and API references for the Morph network.

## Knowledge base layout

- **Vision (docs-as-SKILL, external brain, toolchain):** [`VISION.md`](./VISION.md) — write and review MDX/SKILL pairs against this contract so models can instantiate behavior reliably.
- **Human-readable docs:** `docs/` (MDX). Prefer linking to the authoritative page instead of duplicating long specs in chat.
- **Executable topic summaries:** `skills/<skill-id>/SKILL.md` (see [`skills/README.md`](./skills/README.md)). Use these for routing and concise procedures.
- **Agent sub-definition:** `agents/*.md` (also published under `/agents/` on the doc site; navbar **Agents**). Start with [`agents/morph-doc-agent.md`](./agents/morph-doc-agent.md) for skill authoring from a single goal. Canonical skill path is **`skills/<skill-id>/`** at repo root; see [`skills/README.md`](./skills/README.md) to symlink into Cursor / Claude Code / OpenClaw global dirs. When in doubt, treat `docs/` + `skills/` as the product source of truth.

## Development commands

### Local development

- `npm start` or `docusaurus start` — dev server
- `npm run build` — production build
- `npm run serve` — serve built site (port 8080)
- `npm run clear` — clear Docusaurus cache
- `npm run swizzle` — customize Docusaurus components

### Environment

- `MORPH_DOCS_URL` — site URL when needed
- Algolia DocSearch: `ALGOLIA_APP_ID`, `ALGOLIA_SEARCH_API_KEY`, `ALGOLIA_INDEX_NAME`

## Architecture

### Tech stack

- **Framework:** Docusaurus 3.1.1 (preset-classic)
- **Styling:** Tailwind CSS 3.4.1 with `@morui/theme`
- **CSS:** Sass with autoprefixer
- **Markdown:** MDX with remark-math and rehype-katex
- **Search:** Algolia DocSearch
- **Deployment:** static output + nginx configs in repo

### Key directories

- `docs/` — MDX content (`build-on-morph/`, `about-morph/`, `how-morph-works/`, `morph-rails/`, …)
  - `docs/build-on-morph/sdk/{classes,enumerations,functions,interfaces,type-aliases,variables}/` — **typedoc-generated API reference**; do **not** hand-edit these files or add frontmatter (including `doc_skill_id`), they will be overwritten on regeneration. See [`VISION.md`](./VISION.md) § Pairing Policy.
- `skills/` — executable SKILL topics (mirrored on the site at `/skills/`)
- `agents/` — agent role definitions (mirrored on the site at `/agents/`)
- `src/components/` — React (`MorphRpc/`, `AltFee/`, `ApiExplorer/`, …)
- `static/` — assets
- `plugins/` — custom Docusaurus plugins
- `scripts/` — doc processing utilities

### Configuration

- `docusaurus.config.js` — main config, sidebars reference (`sidebars.js`, `sidebars-skills.js`, `sidebars-agents.js`)
- `sidebars.js` — nav (Get Started, Morph Chain, Node Operators, Learn, Morph Rails)
- `tailwind.config.js` — theme tokens
- `config.json` — Algolia DocSearch

### Styling

- Tailwind + `@morui/theme`; Sass in `src/css/`; overrides in `src/css/custom.scss`

### Plugins

- Markdown source plugin: `plugins/markdown-source-plugin.js` — post-build exports cleaned `.md` into `build/docs/`, `build/skills/`, and `build/agents/` (mirrors site routes)
- Client redirects, Sass plugin, Mermaid theme

## Documentation structure (sidebar)

1. **Get Started** — quickstart, protocol overview  
2. **Morph Chain** — SDKs, APIs, building on Morph  
3. **Node Operators** — full node, validators  
4. **Learn** — concepts and architecture  
5. **Morph Rails** — infrastructure (e.g. AltFee, Reference Key)
6. **Agent Skills** — `skills/` SKILL playbooks (site path `/skills/`)
7. **Agents** — `agents/*.md` role definitions (site path `/agents/`)

## Component patterns

- Tailwind + Morui tokens; `morui-` prefix where applicable  
- Demos (e.g. `MorphRpcClientDemo`) use JSON-RPC against Morph endpoints  

## Deployment

- Build output: `build/`  
- Scripts: `build:mainnet`, `build:qanet` where applicable  

## Key dependencies

- `@morphnetwork/viem`, `@morui/theme`, `viem`, `lottie-react`

## Development notes

- MDX for embedded React; math via remark-math / rehype-katex  
- Light/dark theming via custom tokens  
- Single locale (en) for now  

## Testing and changes

- Automated checks live under `__tests__/`. When adding or changing **executable** helpers or behaviors covered by tests, extend or add tests there and run the project’s test script from `package.json`.

## Secrets

- Do not commit API keys, tokens, or `.env` contents. Follow `.gitignore`.

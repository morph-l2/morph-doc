# Welcome to Morph 

Welcome to the official GitHub repository for the Morph Documentation— your all-in-one resource dedicated to the Morph community.

Morph redefines the Ethereum scaling experience by combining the strengths of optimistic rollups and zk technology. 

Our decentralized sequencer design and innovative Layer 2 approach address blockchain scalability and security, making it ideal for everyday consumer applications.

## Dive deeper into our vision and objectives here

1. [What is & Why Responsive Validity Proof?](https://docs.morphl2.io/docs/how-morph-works/optimistic-zkevm)


2. [How Does RVP Run in Morph?](https://medium.com/@morphlayer/how-does-rvp-run-in-morph-6025233a21cc)


3. [Morph's Origins and Aspirations](https://medium.com/@morphlayer/morphys-origins-and-aspirations-7afc0280a8e2)

## AI assistant workspace (Claude Code & OpenClaw)

This repo includes agent-oriented docs at the root:

| File | Purpose |
|------|---------|
| [`VISION.md`](./VISION.md) | Morph doc intelligence vision: **documentation as SKILL**, external brain for Morph-facing agents, developer toolchain (Cursor / Claude Code / OpenClaw). |
| [`AGENTS.md`](./AGENTS.md) | Shared operating instructions: architecture, commands, `docs/` vs `skills/`, testing expectations. OpenClaw loads this when the workspace is this directory. |
| [`CLAUDE.md`](./CLAUDE.md) | Entry point for [Claude Code](https://docs.anthropic.com/en/docs/claude-code/claude-md); points to `AGENTS.md` for project facts. |

### Point OpenClaw workspace at this repository

So file tools and session bootstrap use this clone as the agent home:

1. Edit `~/.openclaw/openclaw.json` on the machine that runs the OpenClaw gateway.
2. Set the workspace to **this repo’s absolute path** (adjust for your machine), for example:

```json5
{
  "agent": {
    "workspace": "/Users/you/path/to/morph-doc"
  }
}
```

If your config uses the `agents.defaults` shape instead, set `agents.defaults.workspace` to the same path—follow the keys your OpenClaw version documents.

3. Restart the gateway or run `openclaw setup` if you need missing workspace files seeded.
4. If you maintain `AGENTS.md` yourself and do not want bootstrap to recreate defaults, you can set `agent.skipBootstrap` / `skipBootstrap` per [OpenClaw Agent Workspace](https://docs.openclaw.ai/concepts/agent-workspace) docs.

Optional OpenClaw files in the same directory (see OpenClaw docs): `SOUL.md`, `USER.md`, `TOOLS.md`, `memory/`, etc. `USER.md` is listed in `.gitignore` for local-only preferences.

## Learn more

Website: https://www.morphl2.io/

Twitter: https://x.com/MorphNetwork

Medium: [Morph – Medium](https://medium.com/@morphlayer)

Telegram: https://t.me/MorphGlobal

Gmail: official@morphl2.io
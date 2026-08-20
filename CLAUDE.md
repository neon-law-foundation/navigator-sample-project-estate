# Working in this repository

## Stay inside this folder

**Read and write only what is inside this repository.** Everything you need is here.

Do not open, search, copy from, or write to files elsewhere on this machine — not other
matters, not sibling checkouts, not the home directory. Other folders on this system hold
real client matters; this one holds a fixture. Reaching outside is how the two get mixed,
and a public sample repository is the worst possible place for that to happen.

Concretely:

- No `~/…`, no `../` above the repository root, no absolute paths outside it.
- Do not consult another project for a convention. If a convention is not visible here,
  ask, or decide it here and write it down.
- Installing dependencies and fetching public sources (a package registry, a published
  release, public case law) is fine. Reading another project on this machine is not.
- Temporary files go to the session scratchpad, never to a neighbouring folder.

If a task seems to require something outside this repository, say so and stop rather than
going to find it.

## What this is

A Navigator **project application**: the client portal for the fixture matter *Estate of
Cornelius Montgomery*. Vite, React 19, and
[Navigator UX](https://github.com/neon-law-foundation/navigator-ux) for every component
and every color.

**All of it is fixture data.** Nobody named in `src/matter.ts` exists. Real client
material must never be added here — see `README.md`.

## Commands

```bash
pnpm check
```

That is lint → typecheck → build → test, and it is the gate. `pnpm test` alone reads the
built output in `dist/`, so run the build first or run `pnpm check`.

Use the Browser pane's preview tools to run the dev server, never a bare `pnpm dev` in a
shell. The portal is served at its mount, not at the origin root:
`http://localhost:5173/app/projects/sample-estate/portal/`.

## The three things that break silently

1. **The mount.** `MOUNT` in `vite.config.ts` is the single most load-bearing line here. A
   bundle built with the wrong base 404s on every asset, and only once published.
2. **In-bundle links.** Every link inside this bundle goes through `portalPath()` in
   `src/mount.ts`. A hardcoded path fails only when somebody clicks it. Links to
   Navigator's own routes (`/app/projects`) stay absolute.
3. **The ready hook.** `src/ready.tsx` renders `id="sample-estate-portal-ready"`, which
   Navigator's walkthrough waits for. It must be rendered by React, never written into
   `index.html`.

## Styling

Navigator UX ships the tokens, the typeface, and every component rule. Compose its
components; do not reach for a literal color. When something genuinely local is needed,
add it to `src/index.css` reading `--nav-*` tokens, and say in a comment why the library
did not cover it.

## The research folder

`research/opinions/` holds the full text of the Washington intestacy cases the portal
shows under its *Research* tab. The `.json` files come from the Caselaw Access Project and
the `.md` files are generated from them:

```bash
python3 research/convert.py
```

Nothing in `research/opinions/` is edited by hand. `src/research.ts` is the index the
portal renders; `research/README.md` records where the text came from and what has not
been verified.

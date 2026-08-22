# Working in this repository

## Stay inside this folder

**Read and write only what is inside this repository.** Everything you need is here.

Do not open, search, copy from, or write to files elsewhere on this machine — not other matters, not sibling checkouts,
not the home directory. Other folders on this system hold real client matters; this one holds a fixture. Reaching
outside is how the two get mixed, and a public sample repository is the worst possible place for that to happen.

Concretely:

- No `~/…`, no `../` above the repository root, no absolute paths outside it.
- Do not consult another project for a convention. If a convention is not visible here, ask, or decide it here and write
  it down.
- Installing dependencies and fetching public sources (a package registry, a published release, public case law) is
  fine. Reading another project on this machine is not.
- Temporary files go to the session scratchpad, never to a neighbouring folder.

If a task seems to require something outside this repository, say so and stop rather than going to find it.

## What this is

A Navigator **project application**: the client portal for the fixture matter *Estate of Cornelius Montgomery*. Vite,
React 19, and [Navigator UX](https://github.com/neon-law-foundation/navigator-ux) for every component and every color.

**All of it is fixture data.** Nobody named in `src/matter.ts` exists. Real client material must never be added here —
see `README.md`.

## Commands

```bash
pnpm check
```

That is lint → typecheck → build → test, and it is the gate. `pnpm test` alone reads the built output in `dist/`, so run
the build first or run `pnpm check`.

Use the Browser pane's preview tools to run the dev server, never a bare `pnpm dev` in a shell. The portal is served at
its mount, not at the origin root: `http://localhost:5173/app/projects/sample-estate/portal/`.

## The three things that break silently

1. **The mount.** `MOUNT` in `vite.config.ts` is the single most load-bearing line here. A bundle built with the wrong
   base 404s on every asset, and only once published.
2. **In-bundle links.** Every link inside this bundle goes through `portalPath()` in `src/mount.ts`. A hardcoded path
   fails only when somebody clicks it. Links to Navigator's own routes (`/app/projects`) stay absolute.
3. **The ready hook.** `src/ready.tsx` renders `id="sample-estate-portal-ready"`, which Navigator's walkthrough waits
   for. It must be rendered by React, never written into `index.html`.

## Styling

Navigator UX ships the tokens, the typeface, and every component rule. Compose its components; do not reach for a
literal color. When something genuinely local is needed, add it to `src/index.css` reading `--nav-*` tokens, and say in
a comment why the library did not cover it.

## The research folder

`research/opinions/` holds the full text of the Washington intestacy cases the portal shows under its *Research* tab.
The `.json` files come from the Caselaw Access Project and the `.md` files are generated from them:

```bash
python3 research/convert.py
```

Nothing in `research/opinions/` is edited by hand. `src/research.ts` is the index the portal renders;
`research/README.md` records where the text came from and what has not been verified.

## Notation lint

`pnpm check` covers the TypeScript. The Markdown and the YAML answer to the Neon Law Navigator rule set instead, and the
only thing that reads them is the Navigator CLI:

```bash
brew install neon-law-foundation/navigator/navigator   # macOS, and tap-qualified on purpose
pnpm validate                                          # navigator validate, over the whole tree
```

Install it tap-qualified. An unqualified `brew install navigator` resolves to a Homebrew cask for a trackpad utility of
the same name, which installs cleanly and then has no `validate` subcommand. `brew upgrade` keeps it current, and
`navigator --version` says which rule set you are holding this repository to.

CI does not use Homebrew. The `notation` job in `.github/workflows/ci.yml` runs on `ubuntu-latest` and unpacks the Linux
tarball from a pinned public Navigator release into `$HOME/.local/bin`: one static binary, no tap, no account, no sudo.
The pin is deliberate, so that a rule added upstream arrives when somebody bumps that line rather than turning a green
branch red overnight. `notation` is one of the three jobs the required `ci` check waits on, so a finding blocks the
merge — and the pinned version is worth keeping in step with the formula above, since the two together are what "it
passed on my machine" means here.

`pnpm validate` is deliberately not part of `pnpm check`: `check` needs only what `pnpm install` brings, so a
contributor who has not installed the CLI is not blocked by it. Run both before pushing.

`validate` takes no file list, and there is no list to keep current. It walks the tree itself and finds every Markdown,
event, and YAML file under it, so a document is covered the moment it exists rather than the moment somebody remembers
to register it. Each Markdown file it also classifies as it reads: prose gets the structural rules (`M*`) and the
line-width rules (`S*`), and a file whose frontmatter makes it a notation — a `code:`, a `questionnaire:`, a `workflow:`
— additionally gets the notation rules (`N*`). Vendored trees such as `node_modules/` are skipped, but `.gitignore` is
not consulted, so a generated file that sits in the tree is linted like any other.

A finding prints as `path:line RULE: message`, and an error exits non-zero where a warning is only reported.

`navigator validate --fix` applies in place the fixes that are safe by construction — whitespace, ATX heading spacing,
blockquote spacing — and then re-validates. The rest are diagnostic only: the `N*` notation rules, duplicate headings
(M024), trailing heading punctuation (M026). Those it names and leaves for a human, which is the right split; a notation
state machine is not something a formatter should rewrite.

Every document here is filled greedily to 120 columns, because that is what the width rules ask for: **S101** rejects a
line over 120, and **S102** rejects a line that stopped short of 120 with a word still to come. Match that when you edit
rather than rewrapping a paragraph to 80 or 100 columns.

Four things about writing prose that passes, none of them obvious from the message the rule prints:

- **Some spans cannot be broken across lines.** A link, because CommonMark forbids a line break inside a destination; an
  inline code span, because a break leaves whitespace at its edge (M038); an emphasis span, because the rules are
  line-scoped and a span crossing a line reads as unbalanced (M037). So a ~100-character link that lands at the start of
  a line reports S102 permanently — reword the sentence until the link sits inside a line, or make it the first thing in
  its paragraph.
- **Reference-style links are not the way out of that.** A definition line carrying a bare URL reports M034.
- **A literal too long to shorten belongs in a fenced block.** S101 does not reach inside a fence, so a CSP header or a
  long command goes in one — with a language tag, which is what M040 wants.
- **Italics inside a list item bulleted with an asterisk report M037.** The bullet's own asterisk is counted as an
  inline marker. A dash bullet has no such problem, and M004 holds a file to whichever character its first bullet used.

`research/opinions/` is generated, and it stays clean by construction rather than by hand. `research/convert.py` fills
court paragraphs to 120 columns and escapes what wrapping turns into accidental Markdown — the `*5` of a LEXIS citation,
a statute number like `11.04.015` that lands at the start of a line, a bare URL in a footnote. `src/markdown.tsx` undoes
exactly those two things when it renders, and `src/test/markdown.test.tsx` pins the pair. So a finding in that folder is
a bug in the converter, never a file to edit: change `convert.py`, re-run it, and validate again.

## Merging

A green gate arms GitHub auto-merge on its own: the `enable-automerge` job in `.github/workflows/ci.yml` squash-merges
the pull request once `ci` passes and review threads are resolved. To hold a pull request that is ready, convert it to
draft rather than disabling auto-merge — a push re-arms it.

It arms as the `neon-law-staging-merge-queue` App and never as `GITHUB_TOKEN`, and that distinction is load-bearing
rather than cosmetic. GitHub creates no workflow runs for a push attributed to `GITHUB_TOKEN`, and auto-merge merges as
whoever armed it, so a merge armed with the run's own token lands on `main` and starts nothing — not a skipped run, not
a red one: none. Nothing goes red, because nothing runs. `.github/automerge-identity.py` runs inside `ci` and fails the
gate if that fallback is ever reintroduced.

If the App secrets are absent the job arms nothing and the pull request visibly waits for a human, which is the safe
direction to fail. Merge by hand in that case.

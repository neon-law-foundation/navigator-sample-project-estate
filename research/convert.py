#!/usr/bin/env python3
# Copyright (C) 2026 Neon Law Foundation.
# SPDX-License-Identifier: AGPL-3.0-only

"""Render the Caselaw Access Project JSON in `opinions/` as readable Markdown.

The JSON is the source and the Markdown is derived, so nothing here is edited by
hand — re-run this rather than fixing a `.md` in place:

    python3 research/convert.py

One `.md` per `.json`, written beside it. A case whose JSON is replaced by a
fresh download regenerates identically, which is the point: the text a reader
quotes should be traceable to the file it came from.

What comes out has to satisfy `navigator validate`, which the `notation` job in CI
runs over this folder along with everything else. That is why the text is wrapped
and why some characters are escaped on the way out — see `fill` and `safe` below.
`src/markdown.tsx` is the other half of the contract: it undoes both when it
renders, and `src/test/markdown.test.tsx` pins the pair.
"""

import json
import pathlib
import re

OPINIONS = pathlib.Path(__file__).parent / "opinions"

# The width `navigator validate` holds Markdown to: S101 rejects a line over this,
# and S102 rejects one that stopped short of it with a word still to come. Court
# paragraphs arrive as a single line each, so every one of them is filled to here.
WIDTH = 120

# A citation like `at *5` is not emphasis, and a court's own URL is not a link the
# reporter wrote. Both are escaped rather than left to a Markdown reader's judgement:
# `\*` renders as an asterisk, and an autolink renders as the URL it wraps.
BARE_URL = re.compile(r"(?<![<(\[])\bhttps?://[^\s<>()\[\],;]+")


def opening(word: str) -> str:
    """Escape a word that would read as a list marker or a heading at a line's start.

    Wrapping court text puts arbitrary words in that position: a statute cited as
    `11.04.015(2)(b)` opens a line and `11.` becomes an ordered-list marker with no
    space after it (M030), and the paragraph after it becomes a list that wanted a
    blank line before it (M032). The escape renders as the character itself.
    """
    return re.sub(r"^(\d+)([.)])", r"\1\\\2", re.sub(r"^([-+>#])", r"\\\1", word))


def fill(text: str, prefix: str = "") -> list[str]:
    """Greedily fill `text` to `WIDTH` columns, prefixing every line."""
    lines: list[str] = []
    current, fresh = prefix, True
    for word in text.split():
        candidate = current + word if fresh else current + " " + word
        if fresh:
            candidate = current + opening(word)
        if len(candidate) <= WIDTH or fresh:
            current, fresh = candidate, False
        else:
            lines.append(current)
            current, fresh = prefix + opening(word), False
    if current.strip():
        lines.append(current)
    return lines


def safe(text: str) -> str:
    """Neutralise the Markdown a court's plain text produces by accident."""
    return BARE_URL.sub(lambda m: f"<{m.group(0)}>", text.replace("*", r"\*"))


def citations(case: dict) -> list[str]:
    return [c["cite"] for c in case.get("citations", [])]


def render(case: dict) -> str:
    body = case.get("casebody", {})
    out = [f"# {case.get('name_abbreviation', 'Untitled')}", ""]
    out += fill(f"**Full caption:** {case.get('name', '—')}") + [""]
    out += ["| | |", "| --- | --- |"]
    out.append(f"| Citations | {'; '.join(citations(case)) or '—'} |")
    out.append(f"| Court | {case.get('court', {}).get('name', '—')} |")
    out.append(f"| Decided | {case.get('decision_date', '—')} |")
    out.append(f"| Docket | {case.get('docket_number') or '—'} |")
    out.append(f"| Pages | {case.get('first_page')}–{case.get('last_page')} |")
    out.append(f"| Source | Caselaw Access Project (static.case.law), CAP id {case.get('id')} |")
    out.append("")

    if body.get("judges"):
        out += fill(f"**Judges:** {'; '.join(body['judges'])}") + [""]
    if body.get("attorneys"):
        out += fill(f"**Counsel:** {safe(' '.join(body['attorneys']))}") + [""]

    # The head matter is the reporter's own front page — caption, counsel, and
    # syllabus. Quoted rather than reflowed, because it is not the court's text.
    quoted = [
        line.strip() for line in (body.get("head_matter") or "").strip().splitlines() if line.strip()
    ]
    for index, line in enumerate(quoted):
        if index:
            out.append(">")
        out += fill(safe(line), prefix="> ")
    if quoted:
        out.append("")

    for opinion in body.get("opinions", []):
        label = (opinion.get("type") or "opinion").replace("-", " ").title()
        author = opinion.get("author")
        # M026 rejects a heading that ends in punctuation, and a reporter's author
        # line routinely does — `Stephens, J.` and, in one case, `Tolman, J.—`. The
        # trailing mark is dropped rather than the attribution.
        heading = f"## {label}" + (f" — {author}" if author else "")
        out += [heading.rstrip(" .,;:—-"), ""]
        for paragraph in opinion.get("text", "").strip().splitlines():
            if paragraph.strip():
                out += fill(safe(paragraph.strip())) + [""]

    return "\n".join(out).rstrip() + "\n"


def main() -> None:
    for path in sorted(OPINIONS.glob("*.json")):
        case = json.loads(path.read_text())
        markdown = path.with_suffix(".md")
        markdown.write_text(render(case))
        words = sum(
            len(o.get("text", "").split()) for o in case.get("casebody", {}).get("opinions", [])
        )
        print(f"{markdown.name:34} {words:>7,} words  {case.get('name_abbreviation')}")


if __name__ == "__main__":
    main()
